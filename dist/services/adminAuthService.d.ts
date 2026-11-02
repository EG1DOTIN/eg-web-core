import { FirebaseAppConfig } from './firebase';
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
    /** Optional custom Firebase App instance name */
    appName?: string;
}
export declare const DEFAULT_PIN_SALT = "EG_ADMIN_SALT_2026";
export declare const DEFAULT_MAX_FAIL_ATTEMPTS = 3;
export declare const DEFAULT_LOCKOUT_DURATION_MS: number;
export declare const DEFAULT_SESSION_KEY = "eg_admin_pin_verified_uid";
export declare const LOGS_PER_BUCKET_DOC = 18;
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
export declare function computePinHash(pin: string, salt?: string): Promise<string>;
/**
 * Fetches client public IP address with a graceful 3-second abort timeout.
 * Returns 'unknown' if offline or network blocked.
 */
export declare function getClientIP(): Promise<string>;
/**
 * Converts an IP like "103.12.34.56" to a Firestore document-safe ID like "103_12_34_56".
 */
export declare function sanitizeIPKey(ip: string): string;
/**
 * Checks whether an IP address is currently blocked due to repeated failed attempts.
 */
export declare function checkAdminLockout(ip: string, options?: {
    db?: any;
    lockoutCollection?: string;
    maxFailAttempts?: number;
    lockoutDurationMs?: number;
}): Promise<AdminLockoutStatus>;
/**
 * Records a failed login/PIN verification attempt and locks out the IP if threshold exceeded.
 */
export declare function recordAdminFailedAttempt(ip: string, email: string, outcome: 'fail_unauthorized' | 'fail_google' | 'fail_pin', options?: {
    db?: any;
    lockoutCollection?: string;
    logCollection?: string;
    maxFailAttempts?: number;
    lockoutDurationMs?: number;
}): Promise<void>;
/**
 * Resets the lockout status for an IP upon successful administrative login.
 */
export declare function clearAdminLockout(ip: string, options?: {
    db?: any;
    lockoutCollection?: string;
}): Promise<void>;
/**
 * Logs an administrative login attempt using the batched 18-entries-per-document pattern.
 */
export declare function logAdminLoginAttempt(attempt: AdminLoginAttempt, options?: {
    db?: any;
    logCollection?: string;
}): Promise<void>;
/**
 * Checks if the current browser session has verified the 16-digit PIN.
 */
export declare function isAdminSessionVerified(uid: string, sessionKey?: string): boolean;
/**
 * Stores verified administrative session token into sessionStorage.
 */
export declare function setAdminSessionVerified(uid: string, sessionKey?: string): void;
/**
 * Clears administrative session token from sessionStorage.
 */
export declare function clearAdminSession(sessionKey?: string): void;
/**
 * Executes Google Sign-in popup flow with email whitelist check and lockout protection.
 */
export declare function signInWithGooglePopup(config?: AdminAuthConfig): Promise<AdminUser>;
/**
 * Validates a 16-digit PIN against Firestore security document or local expected hash.
 */
export declare function verifyAdminPin(pin: string, user: AdminUser, config?: AdminAuthConfig & AdminPinConfig & {
    db?: any;
    ip?: string;
}): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Signs the user out from Firebase Auth and invalidates admin session verification.
 */
export declare function adminSignOut(config?: {
    sessionKey?: string;
    firebaseConfig?: FirebaseAppConfig;
}): Promise<void>;
