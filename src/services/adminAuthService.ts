/**
 * @file adminAuthService.ts
 * @description Generic, secure authentication services for admin suites across EG web ecosystem.
 * Implements a three-tier defense model:
 *   1. Google OAuth Provider with configurable email whitelisting.
 *   2. 16-digit salted SHA-256 PIN challenge (10^16 search space).
 *   3. Rate limiting with automatic IP-based brute-force lockout and paginated Firestore audit logs.
 */

import { FirebaseAppConfig, getFirebaseAuth, getFirestore } from './firebase';

export interface AdminUser {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface AdminPinConfig {
  /** Secret salt string combined with raw 16-digit PIN before hashing */
  salt?: string;
  /** Pre-calculated SHA-256 hash to test against (local verification) */
  expectedPinHash?: string;
  /** Length of the PIN (default: 16) */
  pinLength?: number;
  /** Firestore collection storing security credentials by user UID (default: 'admin_security') */
  securityCollection?: string;
}

export interface AdminLockoutStatus {
  locked: boolean;
  unlocksAt: Date | null;
  failCount: number;
  hoursRemaining: number;
}

export interface AdminLoginAttempt {
  email: string;
  ipAddress: string;
  outcome: 'success' | 'fail_unauthorized' | 'fail_google' | 'fail_pin';
  userAgent?: string;
  uid?: string | null;
  timestamp?: string;
}

export interface AdminAuthConfig {
  /** Array of authorized Google email addresses. If empty or undefined, any valid Google account is allowed. */
  allowedEmails?: string[];
  /** Salt string for PIN hashing (default: 'EG_ADMIN_SALT_2026') */
  pinSalt?: string;
  /** Maximum consecutive failed attempts allowed before triggering lockout (default: 3) */
  maxFailAttempts?: number;
  /** Duration in milliseconds of an active lockout (default: 24 hours) */
  lockoutDurationMs?: number;
  /** Key used in sessionStorage to store verified UID (default: 'eg_admin_pin_verified_uid') */
  sessionKey?: string;
  /** Firestore collection for lockout records (default: 'admin_lockout') */
  lockoutCollection?: string;
  /** Firestore collection for login audit logs (default: 'admin_login_log') */
  logCollection?: string;
  /** Firestore collection for security PIN hashes (default: 'admin_security') */
  securityCollection?: string;
  /** Optional custom Firebase App configuration */
  firebaseConfig?: FirebaseAppConfig;
}

export const DEFAULT_PIN_SALT = 'EG_ADMIN_SALT_2026';
export const DEFAULT_MAX_FAIL_ATTEMPTS = 3;
export const DEFAULT_LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const DEFAULT_SESSION_KEY = 'eg_admin_pin_verified_uid';
export const LOGS_PER_BUCKET_DOC = 18;

/**
 * Computes a salted SHA-256 hash of the given PIN using the browser Web Crypto API.
 *
 * @param pin Raw numeric PIN string
 * @param salt Secret salt string appended before hashing
 * @returns Hex-encoded SHA-256 hash string (lowercase)
 *
 * @example
 * ```ts
 * const hash = await computePinHash('1234567890123456', 'MY_SALT');
 * ```
 */
export async function computePinHash(pin: string, salt: string = DEFAULT_PIN_SALT): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('[eg-web-core] Web Crypto API is unavailable in this environment.');
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Fetches client public IP address with a graceful 3-second abort timeout.
 * Returns 'unknown' if offline or network blocked.
 */
export async function getClientIP(): Promise<string> {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Converts an IP like "103.12.34.56" to a Firestore document-safe ID like "103_12_34_56".
 */
export function sanitizeIPKey(ip: string): string {
  if (!ip) return 'unknown';
  return ip.replace(/\./g, '_').replace(/[^a-zA-Z0-9_]/g, '');
}

/**
 * Checks whether an IP address is currently blocked due to repeated failed attempts.
 */
export async function checkAdminLockout(
  ip: string,
  options: {
    db?: any;
    lockoutCollection?: string;
    maxFailAttempts?: number;
    lockoutDurationMs?: number;
  } = {}
): Promise<AdminLockoutStatus> {
  const defaultStatus: AdminLockoutStatus = {
    locked: false,
    unlocksAt: null,
    failCount: 0,
    hoursRemaining: 0,
  };

  if (!ip || ip === 'unknown') return defaultStatus;

  try {
    const db = options.db || (window as any).db;
    if (!db) {
      // Local fallback in case Firestore is uninitialized
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem(`admin_lock_${sanitizeIPKey(ip)}`);
        if (local) {
          const parsed = JSON.parse(local);
          const unlocksAt = new Date(parsed.unlocksAt);
          if (new Date() < unlocksAt) {
            const hrs = Math.max(1, Math.ceil((unlocksAt.getTime() - Date.now()) / 3600000));
            return { locked: true, unlocksAt, failCount: parsed.failCount || 3, hoursRemaining: hrs };
          }
        }
      }
      return defaultStatus;
    }

    const collName = options.lockoutCollection || 'admin_lockout';
    const lockRef = db.collection(collName).doc(sanitizeIPKey(ip));
    const lockSnap = await lockRef.get();

    if (!lockSnap.exists) return defaultStatus;

    const data = lockSnap.data() || {};
    const failCount = data.failCount || 0;

    if (!data.lockedUntil) {
      return { ...defaultStatus, failCount };
    }

    const lockedUntil = data.lockedUntil.toDate ? data.lockedUntil.toDate() : new Date(data.lockedUntil);
    const now = new Date();

    if (now < lockedUntil) {
      const remainingMs = lockedUntil.getTime() - now.getTime();
      const hoursRemaining = Math.max(1, Math.ceil(remainingMs / 3600000));
      return {
        locked: true,
        unlocksAt: lockedUntil,
        failCount,
        hoursRemaining,
      };
    } else {
      // Lockout expired — reset the lock counter
      try {
        await lockRef.update({ failCount: 0, lockedUntil: null });
      } catch {
        // Non-blocking update failure
      }
      return defaultStatus;
    }
  } catch (err: any) {
    console.warn('[eg-web-core] checkAdminLockout error (fail-open):', err.message);
    return defaultStatus;
  }
}

/**
 * Records a failed login/PIN verification attempt and locks out the IP if threshold exceeded.
 */
export async function recordAdminFailedAttempt(
  ip: string,
  email: string,
  outcome: 'fail_unauthorized' | 'fail_google' | 'fail_pin',
  options: {
    db?: any;
    lockoutCollection?: string;
    logCollection?: string;
    maxFailAttempts?: number;
    lockoutDurationMs?: number;
  } = {}
): Promise<void> {
  const maxAttempts = options.maxFailAttempts ?? DEFAULT_MAX_FAIL_ATTEMPTS;
  const durationMs = options.lockoutDurationMs ?? DEFAULT_LOCKOUT_DURATION_MS;
  const safeIp = sanitizeIPKey(ip);

  try {
    const db = options.db || (window as any).db;
    if (db) {
      const collName = options.lockoutCollection || 'admin_lockout';
      const lockRef = db.collection(collName).doc(safeIp);
      const lockSnap = await lockRef.get();

      const currentCount = lockSnap.exists ? (lockSnap.data().failCount || 0) : 0;
      const newCount = currentCount + 1;

      const update: any = {
        ipAddress: ip,
        email: email,
        failCount: newCount,
        lastFailAt: (window as any).firebase?.firestore?.FieldValue?.serverTimestamp() || new Date(),
      };

      if (newCount >= maxAttempts) {
        const unlocksAt = new Date(Date.now() + durationMs);
        const fbTimestamp = (window as any).firebase?.firestore?.Timestamp;
        update.lockedUntil = fbTimestamp ? fbTimestamp.fromDate(unlocksAt) : unlocksAt.toISOString();
        update.lockedAt = (window as any).firebase?.firestore?.FieldValue?.serverTimestamp() || new Date();
      }

      await lockRef.set(update, { merge: true });
    } else if (typeof window !== 'undefined') {
      // LocalStorage fallback
      const key = `admin_lock_${safeIp}`;
      const existing = localStorage.getItem(key);
      const parsed = existing ? JSON.parse(existing) : { failCount: 0 };
      const newCount = (parsed.failCount || 0) + 1;
      const payload: any = { ip, email, failCount: newCount };
      if (newCount >= maxAttempts) {
        payload.unlocksAt = new Date(Date.now() + durationMs).toISOString();
      }
      localStorage.setItem(key, JSON.stringify(payload));
    }

    // Also record audit log entry
    await logAdminLoginAttempt({
      email,
      ipAddress: ip,
      outcome,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      uid: null,
      timestamp: new Date().toISOString(),
    }, options);
  } catch (err: any) {
    console.warn('[eg-web-core] recordAdminFailedAttempt warning:', err.message);
  }
}

/**
 * Resets the lockout status for an IP upon successful administrative login.
 */
export async function clearAdminLockout(
  ip: string,
  options: { db?: any; lockoutCollection?: string } = {}
): Promise<void> {
  const safeIp = sanitizeIPKey(ip);
  try {
    const db = options.db || (window as any).db;
    if (db) {
      const collName = options.lockoutCollection || 'admin_lockout';
      await db.collection(collName).doc(safeIp).delete();
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`admin_lock_${safeIp}`);
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Logs an administrative login attempt using the batched 18-entries-per-document pattern.
 */
export async function logAdminLoginAttempt(
  attempt: AdminLoginAttempt,
  options: { db?: any; logCollection?: string } = {}
): Promise<void> {
  try {
    const db = options.db || (window as any).db;
    if (!db) return;

    const collName = options.logCollection || 'admin_login_log';
    const metaRef = db.collection(collName).doc('meta');

    await db.runTransaction(async (transaction: any) => {
      const metaSnap = await transaction.get(metaRef);
      let currentPage = 1;
      let currentCount = 0;

      if (metaSnap.exists) {
        currentPage = metaSnap.data().currentPage || 1;
        currentCount = metaSnap.data().currentCount || 0;
      }

      if (currentCount >= LOGS_PER_BUCKET_DOC) {
        currentPage++;
        currentCount = 0;
      }

      const pageRef = db.collection(collName).doc(`page_${currentPage}`);
      const fb = (window as any).firebase;

      transaction.set(
        pageRef,
        {
          pageNum: currentPage,
          logs: fb?.firestore?.FieldValue?.arrayUnion
            ? fb.firestore.FieldValue.arrayUnion({
                ...attempt,
                timestamp: attempt.timestamp || new Date().toISOString(),
              })
            : [{ ...attempt, timestamp: attempt.timestamp || new Date().toISOString() }],
        },
        { merge: true }
      );

      transaction.set(metaRef, {
        currentPage,
        currentCount: currentCount + 1,
        lastUpdated: fb?.firestore?.FieldValue?.serverTimestamp() || new Date(),
      });
    });
  } catch (err: any) {
    console.warn('[eg-web-core] logAdminLoginAttempt failed (non-critical):', err.message);
  }
}

/**
 * Checks if the current browser session has verified the 16-digit PIN.
 */
export function isAdminSessionVerified(uid: string, sessionKey = DEFAULT_SESSION_KEY): boolean {
  if (typeof window === 'undefined' || !uid) return false;
  try {
    const storedUid = sessionStorage.getItem(sessionKey);
    return storedUid === uid;
  } catch {
    return false;
  }
}

/**
 * Stores verified administrative session token into sessionStorage.
 */
export function setAdminSessionVerified(uid: string, sessionKey = DEFAULT_SESSION_KEY): void {
  if (typeof window === 'undefined' || !uid) return;
  try {
    sessionStorage.setItem(sessionKey, uid);
  } catch {
    // Storage access error handling
  }
}

/**
 * Clears administrative session token from sessionStorage.
 */
export function clearAdminSession(sessionKey = DEFAULT_SESSION_KEY): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(sessionKey);
  } catch {
    // Storage access error handling
  }
}

/**
 * Executes Google Sign-in popup flow with email whitelist check and lockout protection.
 */
export async function signInWithGooglePopup(config: AdminAuthConfig = {}): Promise<AdminUser> {
  const ip = await getClientIP();

  // 1. Check IP lockout first
  const lockout = await checkAdminLockout(ip, config);
  if (lockout.locked) {
    throw new Error(
      `Access is temporarily blocked due to repeated failed attempts. Please try again in ${lockout.hoursRemaining} hour(s).`
    );
  }

  // 2. Obtain Firebase Auth instance
  const auth = await getFirebaseAuth(config.firebaseConfig);
  const fb = (window as any).firebase;
  if (!auth || !fb || !fb.auth) {
    throw new Error('[eg-web-core] Firebase Authentication SDK is unavailable.');
  }

  // Enforce session persistence
  try {
    if (fb.auth.Auth && fb.auth.Auth.Persistence) {
      await auth.setPersistence(fb.auth.Auth.Persistence.SESSION);
    }
  } catch {
    // Ignore persistence warning
  }

  const provider = new fb.auth.GoogleAuthProvider();
  let result: any = null;

  try {
    result = await auth.signInWithPopup(provider);
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in popup was cancelled by user.');
    }
    await recordAdminFailedAttempt(ip, 'unknown-google-user', 'fail_google', config);
    throw err;
  }

  const user = result.user;
  if (!user || !user.email) {
    throw new Error('No user profile received from Google Authentication.');
  }

  // 3. Email whitelist check
  const allowed = config.allowedEmails;
  if (allowed && allowed.length > 0) {
    const isAllowed = allowed.some((email) => email.toLowerCase() === user.email.toLowerCase());
    if (!isAllowed) {
      // Unauthorized email — sign out immediately and record failure
      await auth.signOut();
      clearAdminSession(config.sessionKey);
      await recordAdminFailedAttempt(ip, user.email, 'fail_unauthorized', config);
      throw new Error(`Unauthorized account (${user.email}). Access to this administrative portal is restricted.`);
    }
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

/**
 * Validates a 16-digit PIN against Firestore security document or local expected hash.
 */
export async function verifyAdminPin(
  pin: string,
  user: AdminUser,
  config: AdminAuthConfig & AdminPinConfig & { db?: any; ip?: string } = {}
): Promise<{ success: boolean; error?: string }> {
  const pinLength = config.pinLength ?? 16;
  const cleanPin = pin.replace(/\D/g, '');

  if (cleanPin.length !== pinLength) {
    return {
      success: false,
      error: `PIN must be exactly ${pinLength} numeric digits. Received ${cleanPin.length}.`,
    };
  }

  const ip = config.ip || (await getClientIP());

  // Check lockout before verifying
  const lockout = await checkAdminLockout(ip, config);
  if (lockout.locked) {
    return {
      success: false,
      error: `Access blocked due to excessive failed attempts. Try again in ${lockout.hoursRemaining} hour(s).`,
    };
  }

  const salt = config.salt || config.pinSalt || DEFAULT_PIN_SALT;
  const enteredHash = await computePinHash(cleanPin, salt);

  let isMatch = false;

  // Case A: Provided local expected hash
  if (config.expectedPinHash) {
    isMatch = config.expectedPinHash.toLowerCase() === enteredHash.toLowerCase();
  } else {
    // Case B: Firestore lookup in securityCollection / user.uid
    try {
      const db = config.db || (await getFirestore(config.firebaseConfig));
      const collName = config.securityCollection || 'admin_security';
      const docSnap = await db.collection(collName).doc(user.uid).get();

      if (docSnap.exists) {
        const storedHash = (docSnap.data()?.pinHash || '').toLowerCase();
        isMatch = storedHash === enteredHash.toLowerCase();
      } else {
        // Fallback: Check if there's a global config document or master hash
        const globalSnap = await db.collection(collName).doc('config').get();
        if (globalSnap.exists) {
          const globalHash = (globalSnap.data()?.pinHash || '').toLowerCase();
          isMatch = globalHash === enteredHash.toLowerCase();
        }
      }
    } catch (err: any) {
      return {
        success: false,
        error: `Database error while verifying PIN: ${err.message}`,
      };
    }
  }

  if (isMatch) {
    // Grant access
    setAdminSessionVerified(user.uid, config.sessionKey);
    await clearAdminLockout(ip, config);
    await logAdminLoginAttempt({
      email: user.email,
      ipAddress: ip,
      outcome: 'success',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      uid: user.uid,
      timestamp: new Date().toISOString(),
    }, config);

    return { success: true };
  } else {
    // Incorrect PIN
    clearAdminSession(config.sessionKey);
    await recordAdminFailedAttempt(ip, user.email, 'fail_pin', config);
    return {
      success: false,
      error: 'Incorrect security PIN. Access denied.',
    };
  }
}

/**
 * Signs the user out from Firebase Auth and invalidates admin session verification.
 */
export async function adminSignOut(
  config: { sessionKey?: string; firebaseConfig?: FirebaseAppConfig } = {}
): Promise<void> {
  clearAdminSession(config.sessionKey);
  try {
    const auth = await getFirebaseAuth(config.firebaseConfig);
    if (auth && typeof auth.signOut === 'function') {
      await auth.signOut();
    }
  } catch (err: any) {
    console.warn('[eg-web-core] adminSignOut warning:', err.message);
  }
}
