/**
 * @file contactService.ts
 * @description Client-side service for contact message submissions, arithmetic anti-spam
 * CAPTCHA generation, 24-hour sliding window rate-limiting, and Firestore / offline fallback persistence.
 */

import { FirebaseAppConfig, initFirebase } from './firebase';

export interface MathCaptchaChallenge {
  num1: number;
  num2: number;
  op: '+' | '-' | '*';
  expected: number;
  prompt: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  contact?: string;
  message: string;
  appName?: string;
  createdAt?: unknown;
  [key: string]: unknown;
}

export interface SubmitContactOptions {
  collectionName?: string;
  rateLimitKey?: string;
  rateLimitHours?: number;
  db?: any;
  firebaseConfig?: FirebaseAppConfig;
  appName?: string;
  allowLocalhostBypass?: boolean;
  /**
   * Target collection for storing cross-browser and cross-device rate-limiting records.
   * Defaults to 'visitor_analytics' which allows open read/write in standard configurations.
   */
  analyticsCollection?: string;
  /**
   * Custom payload transformer to adapt to consumer Firestore security rules and schema.
   * If omitted, defaults to clean standard fields: { name, email, contact, message, createdAt }.
   */
  transformPayload?: (payload: ContactMessagePayload) => Record<string, any>;
  /**
   * Optional custom submit handler callback (e.g. for non-Firebase backends: Supabase, REST API, Webhooks).
   * If provided and returns a result, submitContactInquiry delegates to it.
   */
  onSubmit?: (payload: ContactMessagePayload) => Promise<SubmitContactResult | void> | SubmitContactResult | void;
}

export interface SubmitContactResult {
  success: boolean;
  message: string;
  docId?: string;
  rateLimited?: boolean;
  offlineFallback?: boolean;
}

/**
 * Generates a randomized arithmetic challenge (+, -, *) for bot prevention.
 * Ensures subtraction operations never produce negative answers.
 */
export function generateMathCaptcha(): MathCaptchaChallenge {
  const ops: Array<'+' | '-' | '*'> = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let num1 = Math.floor(Math.random() * 9) + 1;
  let num2 = Math.floor(Math.random() * 9) + 1;

  // Guarantee non-negative integer for subtraction
  if (op === '-' && num1 < num2) {
    const temp = num1;
    num1 = num2;
    num2 = temp;
  }

  let expected = 0;
  if (op === '+') expected = num1 + num2;
  else if (op === '-') expected = num1 - num2;
  else if (op === '*') expected = num1 * num2;

  const symbolMap = { '+': '+', '-': '−', '*': '×' };

  return {
    num1,
    num2,
    op,
    expected,
    prompt: `What is ${num1} ${symbolMap[op]} ${num2}?`,
  };
}

/**
 * Fast 32-bit FNV-1a hash for deterministic client identification.
 */
function hashString(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

/**
 * Computes a stable machine & browser fingerprint from hardware, screen, and runtime signals.
 * Persists a unique client GUID to guard against incognito/tab switching.
 */
export function getMachineFingerprint(): string {
  if (typeof window === 'undefined') return 'unknown_machine';
  try {
    let clientGuid = '';
    try {
      clientGuid = localStorage.getItem('eg_client_guid') || sessionStorage.getItem('eg_client_guid') || '';
      if (!clientGuid) {
        clientGuid = 'cg_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem('eg_client_guid', clientGuid);
        sessionStorage.setItem('eg_client_guid', clientGuid);
      }
    } catch {
      // Storage unavailable
    }

    const screenRes = window.screen ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}` : '';
    const timezone = typeof Intl !== 'undefined' && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
    const raw = [
      navigator.userAgent || '',
      navigator.platform || '',
      navigator.language || '',
      screenRes,
      timezone,
      navigator.hardwareConcurrency || '',
      clientGuid,
    ].join('###');

    return hashString(raw);
  } catch {
    return 'fallback_machine';
  }
}

/**
 * Normalizes WebGL renderer strings across browser implementations (Chrome ANGLE, Firefox, WebKit)
 * to extract a clean, deterministic chipset identifier.
 * Example Chrome: "ANGLE (Intel, Mesa Intel(R) UHD Graphics (CML GT2), OpenGL 4.6)" -> "mesa intel uhd graphics cml gt2"
 * Example Firefox: "Mesa Intel(R) UHD Graphics (CML GT2)" -> "mesa intel uhd graphics cml gt2"
 */
export function normalizeGpuRenderer(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/^angle\s*\([^,]*,\s*/i, '') // remove "ANGLE (Vendor, "
    .replace(/,\s*opengl\s*[\d.]*\s*\)$/i, '') // remove ", OpenGL 4.6)"
    .replace(/\b(direct3d\d*|opengl|vs_\d_\d|ps_\d_\d|d3d\d*|\/pcie\/sse\d*)\b/gi, '')
    .replace(/\([rR]\)|\([tT][mM]\)|[®™]/g, '')
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Computes a baseline cross-browser hardware fingerprint (screen resolution, timezone, timezone offset, platform, CPU cores, touch points)
 * that is 100% identical across different browsers (Chrome, Firefox, Edge, Safari, Incognito) on the same machine.
 */
export function getHardwareCoreFingerprint(): string {
  if (typeof window === 'undefined') return 'unknown_core_hardware';
  try {
    const screenRes = window.screen ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth || 24}` : '';
    const timezone = typeof Intl !== 'undefined' && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
    const tzOffset = new Date().getTimezoneOffset();
    const platform = typeof navigator !== 'undefined' ? (navigator.platform || '').replace(/\s+/g, '').toLowerCase() : '';
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 0 : 0;
    const touchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0;

    const raw = [screenRes, timezone, tzOffset, platform, cores, touchPoints].join('###');
    return hashString(raw);
  } catch {
    return 'fallback_core_hardware';
  }
}

/**
 * Computes a cross-browser hardware fingerprint (screen resolution, timezone, timezone offset, platform, concurrency, normalized GPU)
 * that remains identical across different browsers (Chrome, Firefox, Edge, Brave, Incognito) on the same machine.
 */
export function getHardwareFingerprint(): string {
  if (typeof window === 'undefined') return 'unknown_hardware';
  try {
    const screenRes = window.screen ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth || 24}` : '';
    const timezone = typeof Intl !== 'undefined' && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
    const tzOffset = new Date().getTimezoneOffset();
    const platform = typeof navigator !== 'undefined' ? (navigator.platform || '').replace(/\s+/g, '').toLowerCase() : '';
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 0 : 0;
    const touchPoints = typeof navigator !== 'undefined' ? navigator.maxTouchPoints || 0 : 0;

    let gpu = '';
    try {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const ext = (gl as any).getExtension('WEBGL_debug_renderer_info');
          if (ext) {
            const rawGpu = String((gl as any).getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
            gpu = normalizeGpuRenderer(rawGpu);
          }
        }
      }
    } catch {
      // Ignore WebGL detection error
    }

    const raw = [screenRes, timezone, tzOffset, platform, cores, touchPoints, gpu].join('###');
    return hashString(raw);
  } catch {
    return 'fallback_hardware';
  }
}

/**
 * Generates normalized identity hashes for user inputs (email, contact phone, name).
 */
export function getUserIdentityHashes(name?: string, email?: string, contact?: string): {
  emailHash: string;
  phoneHash: string;
  nameHash: string;
} {
  const normEmail = (email || '').trim().toLowerCase();
  const normPhone = (contact || '').replace(/\D/g, ''); // Digits only to match regardless of format
  const normName = (name || '').trim().toLowerCase();

  return {
    emailHash: normEmail ? hashString(normEmail) : '',
    phoneHash: normPhone ? hashString(normPhone) : '',
    nameHash: normName ? hashString(normName) : '',
  };
}

export interface CheckContactRateLimitOptions {
  name?: string;
  email?: string;
  contact?: string;
  rateLimitKey?: string;
  rateLimitHours?: number;
  allowLocalhostBypass?: boolean;
}

interface RateLimitRegistryEntry {
  timestamp: number;
  machineHash: string;
  hardwareHash?: string;
  hardwareCoreHash?: string;
  emailHash?: string;
  phoneHash?: string;
  nameHash?: string;
}

const REGISTRY_STORAGE_KEY = 'eg_contact_submissions_v2';
const MACHINE_STORAGE_PREFIX = 'eg_rl_dev_';
const HARDWARE_STORAGE_PREFIX = 'eg_rl_hw_';
const HARDWARE_CORE_STORAGE_PREFIX = 'eg_rl_hwcore_';
const EMAIL_STORAGE_PREFIX = 'eg_rl_em_';
const PHONE_STORAGE_PREFIX = 'eg_rl_ph_';

export const CLOUD_HW_PREFIX = 'c_rl_hw_';
export const CLOUD_HWCORE_PREFIX = 'c_rl_hwcore_';
export const CLOUD_DEV_PREFIX = 'c_rl_dev_';
export const CLOUD_EMAIL_PREFIX = 'c_rl_em_';
export const CLOUD_PHONE_PREFIX = 'c_rl_ph_';

/**
 * Checks if the user or machine is currently within the active rate-limit window.
 * Inspects machine/browser fingerprint as well as user contact information (name, email, phone)
 * to minimize automated spam.
 */
export function checkContactRateLimit(
  optionsOrKey: CheckContactRateLimitOptions | string = 'lastMessageTime',
  rateLimitHours = 24,
  allowLocalhostBypass = false
): {
  allowed: boolean;
  hoursRemaining?: number;
  minutesRemaining?: number;
  reason?: 'machine' | 'email' | 'contact' | 'session' | 'general';
  message?: string;
} {
  if (typeof window === 'undefined') return { allowed: true };

  const opts: CheckContactRateLimitOptions =
    typeof optionsOrKey === 'string'
      ? { rateLimitKey: optionsOrKey, rateLimitHours, allowLocalhostBypass }
      : optionsOrKey;

  const hours = opts.rateLimitHours ?? 24;
  if (hours <= 0) return { allowed: true };

  const now = Date.now();
  const windowMs = hours * 60 * 60 * 1000;
  const legacyKey = opts.rateLimitKey || 'lastMessageTime';

  const machineHash = getMachineFingerprint();
  const hardwareHash = getHardwareFingerprint();
  const hardwareCoreHash = getHardwareCoreFingerprint();
  const { emailHash, phoneHash } = getUserIdentityHashes(opts.name, opts.email, opts.contact);

  let latestMatchedTimestamp = 0;
  let matchReason: 'machine' | 'email' | 'contact' | 'session' | 'general' = 'general';

  // 1. Check legacy / general localStorage & sessionStorage
  try {
    const rawLegacy = localStorage.getItem(legacyKey) || sessionStorage.getItem(legacyKey);
    if (rawLegacy) {
      const t = parseInt(rawLegacy, 10);
      if (!isNaN(t) && now - t < windowMs && t > latestMatchedTimestamp) {
        latestMatchedTimestamp = t;
        matchReason = 'general';
      }
    }
  } catch {}

  // 2. Check machine/browser fingerprint in localStorage & sessionStorage
  try {
    const devKey = `${MACHINE_STORAGE_PREFIX}${machineHash}`;
    const rawDev = localStorage.getItem(devKey) || sessionStorage.getItem(devKey);
    if (rawDev) {
      const t = parseInt(rawDev, 10);
      if (!isNaN(t) && now - t < windowMs && t > latestMatchedTimestamp) {
        latestMatchedTimestamp = t;
        matchReason = 'machine';
      }
    }
  } catch {}

  // 2b. Check cross-browser hardware fingerprint in localStorage & sessionStorage
  try {
    const hwKey = `${HARDWARE_STORAGE_PREFIX}${hardwareHash}`;
    const rawHw = localStorage.getItem(hwKey) || sessionStorage.getItem(hwKey);
    if (rawHw) {
      const t = parseInt(rawHw, 10);
      if (!isNaN(t) && now - t < windowMs && t > latestMatchedTimestamp) {
        latestMatchedTimestamp = t;
        matchReason = 'machine';
      }
    }
  } catch {}

  // 2c. Check baseline core hardware fingerprint
  try {
    const hwCoreKey = `${HARDWARE_CORE_STORAGE_PREFIX}${hardwareCoreHash}`;
    const rawHwCore = localStorage.getItem(hwCoreKey) || sessionStorage.getItem(hwCoreKey);
    if (rawHwCore) {
      const t = parseInt(rawHwCore, 10);
      if (!isNaN(t) && now - t < windowMs && t > latestMatchedTimestamp) {
        latestMatchedTimestamp = t;
        matchReason = 'machine';
      }
    }
  } catch {}

  // 3. Check email hash if email provided
  if (emailHash) {
    try {
      const emKey = `${EMAIL_STORAGE_PREFIX}${emailHash}`;
      const rawEm = localStorage.getItem(emKey) || sessionStorage.getItem(emKey);
      if (rawEm) {
        const t = parseInt(rawEm, 10);
        if (!isNaN(t) && now - t < windowMs && t > latestMatchedTimestamp) {
          latestMatchedTimestamp = t;
          matchReason = 'email';
        }
      }
    } catch {}
  }

  // 4. Check contact/phone hash if contact provided
  if (phoneHash) {
    try {
      const phKey = `${PHONE_STORAGE_PREFIX}${phoneHash}`;
      const rawPh = localStorage.getItem(phKey) || sessionStorage.getItem(phKey);
      if (rawPh) {
        const t = parseInt(rawPh, 10);
        if (!isNaN(t) && now - t < windowMs && t > latestMatchedTimestamp) {
          latestMatchedTimestamp = t;
          matchReason = 'contact';
        }
      }
    } catch {}
  }

  // 5. Check persistent submissions registry
  try {
    const rawRegistry = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (rawRegistry) {
      const list: RateLimitRegistryEntry[] = JSON.parse(rawRegistry);
      if (Array.isArray(list)) {
        for (const item of list) {
          if (!item.timestamp || now - item.timestamp >= windowMs) continue;

          // Check machine / hardware match
          if (
            ((item.machineHash && item.machineHash === machineHash) ||
              (item.hardwareHash && item.hardwareHash === hardwareHash) ||
              (item.hardwareCoreHash && item.hardwareCoreHash === hardwareCoreHash)) &&
            item.timestamp > latestMatchedTimestamp
          ) {
            latestMatchedTimestamp = item.timestamp;
            matchReason = 'machine';
          }
          // Check email match
          if (emailHash && item.emailHash && item.emailHash === emailHash && item.timestamp > latestMatchedTimestamp) {
            latestMatchedTimestamp = item.timestamp;
            matchReason = 'email';
          }
          // Check phone match
          if (phoneHash && item.phoneHash && item.phoneHash === phoneHash && item.timestamp > latestMatchedTimestamp) {
            latestMatchedTimestamp = item.timestamp;
            matchReason = 'contact';
          }
        }
      }
    }
  } catch {}

  if (latestMatchedTimestamp > 0) {
    const elapsed = now - latestMatchedTimestamp;
    const remainingMs = windowMs - elapsed;
    const hoursRemaining = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
    const minutesRemaining = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));

    let msg = `You have already sent a message recently. To minimize spam, please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending again.`;
    if (matchReason === 'email') {
      msg = `A message was already submitted using this email address recently. Please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending another message.`;
    } else if (matchReason === 'contact') {
      msg = `A message was already submitted using this contact number recently. Please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending another message.`;
    } else if (matchReason === 'machine') {
      msg = `A message was already sent from this device/browser recently. To minimize spam, please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending again.`;
    }

    return {
      allowed: false,
      hoursRemaining,
      minutesRemaining,
      reason: matchReason,
      message: msg,
    };
  }

  return { allowed: true };
}

export interface CheckCloudRateLimitOptions {
  name?: string;
  email?: string;
  contact?: string;
  rateLimitHours?: number;
  analyticsCollection?: string;
}

export interface CloudRateLimitResult {
  allowed: boolean;
  hoursRemaining?: number;
  minutesRemaining?: number;
  reason?: 'machine' | 'email' | 'contact' | 'general';
  message?: string;
}

/**
 * Checks Cloud Firestore collection (default: 'visitor_analytics') for active rate limits
 * using deterministic cross-browser machine/hardware fingerprints and user contact credentials.
 * This bridges rate-limiting across different tabs, different browsers, and incognito sessions.
 */
export async function checkCloudContactRateLimit(
  db: any,
  options: CheckCloudRateLimitOptions = {}
): Promise<CloudRateLimitResult> {
  if (!db || typeof db.collection !== 'function') {
    return { allowed: true };
  }

  const hours = options.rateLimitHours ?? 24;
  if (hours <= 0) return { allowed: true };

  const collectionName = options.analyticsCollection || 'visitor_analytics';
  const now = Date.now();
  const windowMs = hours * 60 * 60 * 1000;

  const hardwareHash = getHardwareFingerprint();
  const hardwareCoreHash = getHardwareCoreFingerprint();
  const machineHash = getMachineFingerprint();
  const { emailHash, phoneHash } = getUserIdentityHashes(options.name, options.email, options.contact);

  const col = db.collection(collectionName);
  const lookups: Array<{ key: string; reason: 'machine' | 'email' | 'contact'; promise: Promise<any> }> = [
    { key: `${CLOUD_HW_PREFIX}${hardwareHash}`, reason: 'machine', promise: col.doc(`${CLOUD_HW_PREFIX}${hardwareHash}`).get().catch(() => null) },
    { key: `${CLOUD_HWCORE_PREFIX}${hardwareCoreHash}`, reason: 'machine', promise: col.doc(`${CLOUD_HWCORE_PREFIX}${hardwareCoreHash}`).get().catch(() => null) },
    { key: `${CLOUD_DEV_PREFIX}${machineHash}`, reason: 'machine', promise: col.doc(`${CLOUD_DEV_PREFIX}${machineHash}`).get().catch(() => null) },
  ];

  if (emailHash) {
    lookups.push({
      key: `${CLOUD_EMAIL_PREFIX}${emailHash}`,
      reason: 'email',
      promise: col.doc(`${CLOUD_EMAIL_PREFIX}${emailHash}`).get().catch(() => null),
    });
  }

  if (phoneHash) {
    lookups.push({
      key: `${CLOUD_PHONE_PREFIX}${phoneHash}`,
      reason: 'contact',
      promise: col.doc(`${CLOUD_PHONE_PREFIX}${phoneHash}`).get().catch(() => null),
    });
  }

  let latestMatchedTimestamp = 0;
  let matchReason: 'machine' | 'email' | 'contact' = 'machine';

  try {
    const snaps = await Promise.all(lookups.map((item) => item.promise));
    for (let i = 0; i < snaps.length; i++) {
      const snap = snaps[i];
      if (snap && (typeof snap.exists === 'function' ? snap.exists() : snap.exists)) {
        const data = snap.data() || {};
        const t = typeof data.timestamp === 'number' ? data.timestamp : 0;
        if (t > 0 && now - t < windowMs && t > latestMatchedTimestamp) {
          latestMatchedTimestamp = t;
          matchReason = lookups[i].reason;
        }
      }
    }
  } catch {
    // Non-blocking fallback if cloud lookup fails
    return { allowed: true };
  }

  if (latestMatchedTimestamp > 0) {
    const elapsed = now - latestMatchedTimestamp;
    const remainingMs = windowMs - elapsed;
    const hoursRemaining = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
    const minutesRemaining = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));

    let msg = `You have already sent a message recently. To minimize spam, please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending again.`;
    if (matchReason === 'email') {
      msg = `A message was already submitted using this email address recently. Please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending another message.`;
    } else if (matchReason === 'contact') {
      msg = `A message was already submitted using this contact number recently. Please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending another message.`;
    } else if (matchReason === 'machine') {
      msg = `A message was already sent from this device/browser recently. To minimize spam, please wait approximately ${hoursRemaining} hour${hoursRemaining === 1 ? '' : 's'} before sending again.`;
    }

    // Cache locally into current browser's localStorage & sessionStorage
    try {
      recordContactSubmissionTime({
        name: options.name,
        email: options.email,
        contact: options.contact,
      });
    } catch {}

    return {
      allowed: false,
      hoursRemaining,
      minutesRemaining,
      reason: matchReason,
      message: msg,
    };
  }

  return { allowed: true };
}

/**
 * Records rate-limit timestamps to Cloud Firestore (default: 'visitor_analytics')
 * under deterministic machine/hardware keys and user credential hashes.
 */
export async function recordCloudContactRateLimit(
  db: any,
  options: {
    name?: string;
    email?: string;
    contact?: string;
    appName?: string;
    analyticsCollection?: string;
  } = {}
): Promise<void> {
  if (!db || typeof db.collection !== 'function') return;

  const collectionName = options.analyticsCollection || 'visitor_analytics';
  const hardwareHash = getHardwareFingerprint();
  const hardwareCoreHash = getHardwareCoreFingerprint();
  const machineHash = getMachineFingerprint();
  const { emailHash, phoneHash } = getUserIdentityHashes(options.name, options.email, options.contact);

  const now = Date.now();
  const payload = {
    timestamp: now,
    type: 'contact_rate_limit',
    appName: options.appName || (typeof window !== 'undefined' ? window.location.hostname : 'web-app'),
    createdAt: new Date(now).toISOString(),
  };

  const col = db.collection(collectionName);
  const writes: Promise<any>[] = [
    col.doc(`${CLOUD_HW_PREFIX}${hardwareHash}`).set(payload).catch(() => {}),
    col.doc(`${CLOUD_HWCORE_PREFIX}${hardwareCoreHash}`).set(payload).catch(() => {}),
    col.doc(`${CLOUD_DEV_PREFIX}${machineHash}`).set(payload).catch(() => {}),
  ];

  if (emailHash) {
    writes.push(col.doc(`${CLOUD_EMAIL_PREFIX}${emailHash}`).set(payload).catch(() => {}));
  }
  if (phoneHash) {
    writes.push(col.doc(`${CLOUD_PHONE_PREFIX}${phoneHash}`).set(payload).catch(() => {}));
  }

  try {
    await Promise.allSettled(writes);
  } catch {}
}

/**
 * Records a successful submission timestamp to enforce client and device rate-limiting.
 */
export function recordContactSubmissionTime(
  optionsOrKey: { name?: string; email?: string; contact?: string; rateLimitKey?: string } | string = 'lastMessageTime'
): void {
  if (typeof window === 'undefined') return;

  const opts = typeof optionsOrKey === 'string' ? { rateLimitKey: optionsOrKey } : (optionsOrKey || {});
  const legacyKey = opts.rateLimitKey || 'lastMessageTime';
  const now = Date.now();
  const nowStr = now.toString();

  const machineHash = getMachineFingerprint();
  const hardwareHash = getHardwareFingerprint();
  const hardwareCoreHash = getHardwareCoreFingerprint();
  const { emailHash, phoneHash, nameHash } = getUserIdentityHashes(opts.name, opts.email, opts.contact);

  try {
    // 1. Legacy keys
    localStorage.setItem(legacyKey, nowStr);
    sessionStorage.setItem(legacyKey, nowStr);

    // 2. Machine & hardware fingerprint keys
    localStorage.setItem(`${MACHINE_STORAGE_PREFIX}${machineHash}`, nowStr);
    sessionStorage.setItem(`${MACHINE_STORAGE_PREFIX}${machineHash}`, nowStr);
    localStorage.setItem(`${HARDWARE_STORAGE_PREFIX}${hardwareHash}`, nowStr);
    sessionStorage.setItem(`${HARDWARE_STORAGE_PREFIX}${hardwareHash}`, nowStr);
    localStorage.setItem(`${HARDWARE_CORE_STORAGE_PREFIX}${hardwareCoreHash}`, nowStr);
    sessionStorage.setItem(`${HARDWARE_CORE_STORAGE_PREFIX}${hardwareCoreHash}`, nowStr);

    // 3. User identity keys
    if (emailHash) {
      localStorage.setItem(`${EMAIL_STORAGE_PREFIX}${emailHash}`, nowStr);
      sessionStorage.setItem(`${EMAIL_STORAGE_PREFIX}${emailHash}`, nowStr);
    }
    if (phoneHash) {
      localStorage.setItem(`${PHONE_STORAGE_PREFIX}${phoneHash}`, nowStr);
      sessionStorage.setItem(`${PHONE_STORAGE_PREFIX}${phoneHash}`, nowStr);
    }

    // 4. Update persistent registry
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    let list: RateLimitRegistryEntry[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }

    // Prune entries older than 48 hours
    const cutoff = now - 48 * 60 * 60 * 1000;
    list = list.filter((item) => item.timestamp && item.timestamp > cutoff);

    list.push({
      timestamp: now,
      machineHash,
      hardwareHash,
      hardwareCoreHash,
      emailHash: emailHash || undefined,
      phoneHash: phoneHash || undefined,
      nameHash: nameHash || undefined,
    });

    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(list.slice(-30)));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clears recorded contact submission rate limit timestamps (useful for testing and verification).
 * If Firestore database is provided, also clears cloud records from visitor_analytics.
 */
export async function clearContactRateLimit(
  rateLimitKey = 'lastMessageTime',
  db?: any,
  analyticsCollection = 'visitor_analytics'
): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(rateLimitKey);
    sessionStorage.removeItem(rateLimitKey);
    localStorage.removeItem(REGISTRY_STORAGE_KEY);

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith(MACHINE_STORAGE_PREFIX) ||
          key.startsWith(HARDWARE_STORAGE_PREFIX) ||
          key.startsWith(HARDWARE_CORE_STORAGE_PREFIX) ||
          key.startsWith(EMAIL_STORAGE_PREFIX) ||
          key.startsWith(PHONE_STORAGE_PREFIX))
      ) {
        localStorage.removeItem(key);
      }
    }
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (
        key &&
        (key.startsWith(MACHINE_STORAGE_PREFIX) ||
          key.startsWith(HARDWARE_STORAGE_PREFIX) ||
          key.startsWith(HARDWARE_CORE_STORAGE_PREFIX) ||
          key.startsWith(EMAIL_STORAGE_PREFIX) ||
          key.startsWith(PHONE_STORAGE_PREFIX))
      ) {
        sessionStorage.removeItem(key);
      }
    }

    if (db && typeof db.collection === 'function') {
      const hardwareHash = getHardwareFingerprint();
      const hardwareCoreHash = getHardwareCoreFingerprint();
      const machineHash = getMachineFingerprint();
      const col = db.collection(analyticsCollection);
      await Promise.allSettled([
        col.doc(`${CLOUD_HW_PREFIX}${hardwareHash}`).delete().catch(() => {}),
        col.doc(`${CLOUD_HWCORE_PREFIX}${hardwareCoreHash}`).delete().catch(() => {}),
        col.doc(`${CLOUD_DEV_PREFIX}${machineHash}`).delete().catch(() => {}),
      ]);
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Stores an unsent message into localStorage offline queue.
 */
function queueOfflineMessage(
  payload: ContactMessagePayload,
  safeName: string,
  safeEmail: string,
  safeContact: string,
  safeMessage: string,
  options: SubmitContactOptions
): void {
  if (typeof window === 'undefined') return;
  try {
    const queueKey = 'eg_offline_contact_messages';
    const existing: any[] = JSON.parse(localStorage.getItem(queueKey) || '[]');
    existing.push({
      ...payload,
      name: safeName,
      email: safeEmail,
      contact: safeContact,
      message: safeMessage,
      appName: options.appName || payload.appName || (typeof window !== 'undefined' ? window.location.hostname : 'web-app'),
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    });
    localStorage.setItem(queueKey, JSON.stringify(existing.slice(-20)));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Automatically syncs any offline messages cached in localStorage to Firestore once connectivity is available.
 * Returns the number of flushed messages.
 */
export async function flushOfflineContactMessages(
  db: any,
  collectionName = 'messages',
  transformPayload?: (item: any) => Record<string, any>
): Promise<number> {
  if (!db || typeof db.collection !== 'function' || typeof window === 'undefined') return 0;
  try {
    const queueKey = 'eg_offline_contact_messages';
    const raw = localStorage.getItem(queueKey);
    if (!raw) return 0;
    const queue: any[] = JSON.parse(raw);
    if (!Array.isArray(queue) || queue.length === 0) return 0;

    let flushedCount = 0;
    const remaining: any[] = [];
    for (const item of queue) {
      try {
        const docData = transformPayload
          ? transformPayload(item)
          : {
              name: item.name || 'Anonymous',
              email: item.email || '',
              contact: item.contact || '',
              message: item.message || '',
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            };
        await db.collection(collectionName).add(docData);
        flushedCount++;
      } catch {
        remaining.push(item);
      }
    }

    if (remaining.length === 0) {
      localStorage.removeItem(queueKey);
    } else {
      localStorage.setItem(queueKey, JSON.stringify(remaining));
    }

    return flushedCount;
  } catch {
    return 0;
  }
}

/**
 * Submits a contact inquiry to Cloud Firestore `/messages` collection.
 * Gracefully falls back to offline localStorage queue if the client is offline,
 * and automatically flushes queued offline messages upon reconnecting.
 */
export async function submitContactInquiry(
  payload: ContactMessagePayload,
  options: SubmitContactOptions = {}
): Promise<SubmitContactResult> {
  const collectionName = options.collectionName || 'messages';
  const rateLimitKey = options.rateLimitKey || 'lastMessageTime';
  const rateLimitHours = options.rateLimitHours ?? 24;
  const allowLocalhostBypass = options.allowLocalhostBypass ?? false;

  // 1. Enforce client-side rate limit across machine, browser, and user identity
  const rateCheck = checkContactRateLimit({
    name: payload.name,
    email: payload.email,
    contact: payload.contact,
    rateLimitKey,
    rateLimitHours,
    allowLocalhostBypass,
  });
  if (!rateCheck.allowed) {
    return {
      success: false,
      rateLimited: true,
      message: rateCheck.message || 'You have sent a message recently. Please try again tomorrow.',
    };
  }

  // 2. Validate essential fields and format
  const rawName = (payload.name || '').trim();
  const rawEmail = (payload.email || '').trim();
  const rawContact = (payload.contact || '').trim();
  const rawMessage = (payload.message || '').trim();

  if (!rawName || !rawEmail || !rawMessage) {
    return {
      success: false,
      message: 'Please fill in all required fields (Name, Email, Message).',
    };
  }

  // Email format validation (RFC-compliant basic pattern)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(rawEmail) || rawEmail.length > 255) {
    return {
      success: false,
      message: 'Please enter a valid email address.',
    };
  }

  // Prevent client payload flooding by capping maximum string lengths
  const safeName = rawName.slice(0, 100);
  const safeEmail = rawEmail.slice(0, 255);
  const safeContact = rawContact.slice(0, 50);
  const safeMessage = rawMessage.slice(0, 5000);

  // Pluggable custom submission handler (e.g., Supabase, REST endpoint, Webhook, etc.)
  if (options.onSubmit) {
    try {
      const customRes = await options.onSubmit({
        ...payload,
        name: safeName,
        email: safeEmail,
        contact: safeContact,
        message: safeMessage,
        appName: options.appName || payload.appName || (typeof window !== 'undefined' ? window.location.hostname : 'web-app'),
      });
      recordContactSubmissionTime({
        name: safeName,
        email: safeEmail,
        contact: safeContact,
        rateLimitKey,
      });
      if (customRes && typeof customRes === 'object' && 'success' in customRes) {
        return customRes;
      }
      return {
        success: true,
        message: 'Thank you for reaching out! Your message has been received and we will get back to you shortly.',
      };
    } catch (customErr: any) {
      return {
        success: false,
        message: customErr?.message || 'Failed to submit inquiry via custom handler.',
      };
    }
  }

  // 3. Resolve Firestore DB instance
  let db = options.db;

  // If db not directly provided, initialize dynamically using firebaseConfig if supplied
  if (!db && options.firebaseConfig && options.firebaseConfig.apiKey) {
    try {
      const res = await initFirebase(options.firebaseConfig, options.appName);
      db = res.db;
    } catch (initErr) {
      console.warn('[contactService] Failed to initialize Firebase with provided config:', initErr);
    }
  }

  // Fallback: check global window objects
  if (!db && typeof window !== 'undefined') {
    db = (window as any).db || (window as any).firebase?.firestore?.();
    if (!db && (window as any).firebaseApp?.firestore) {
      db = (window as any).firebaseApp.firestore();
    }
  }

  if (db && typeof db.collection === 'function') {
    try {
      const fb = typeof window !== 'undefined' ? (window as any).firebase : null;
      const serverTimestamp = fb?.firestore?.FieldValue?.serverTimestamp
        ? fb.firestore.FieldValue.serverTimestamp()
        : new Date();

      const basePayload: ContactMessagePayload = {
        name: safeName,
        email: safeEmail,
        contact: safeContact,
        message: safeMessage,
        appName: options.appName || payload.appName || (typeof window !== 'undefined' ? window.location.hostname : 'web-app'),
        createdAt: serverTimestamp,
      };

      const docData = options.transformPayload
        ? options.transformPayload(basePayload)
        : {
            name: safeName,
            email: safeEmail,
            contact: safeContact,
            message: safeMessage,
            createdAt: serverTimestamp,
          };

      // 3a. Cross-browser, cross-tab, and incognito rate-limit verification via visitor_analytics
      const cloudRateCheck = await checkCloudContactRateLimit(db, {
        name: safeName,
        email: safeEmail,
        contact: safeContact,
        rateLimitHours,
        analyticsCollection: options.analyticsCollection || 'visitor_analytics',
      });
      if (!cloudRateCheck.allowed) {
        return {
          success: false,
          rateLimited: true,
          message: cloudRateCheck.message || 'You have sent a message recently. Please try again tomorrow.',
        };
      }

      const docRef = await db.collection(collectionName).add(docData);

      recordContactSubmissionTime({
        name: safeName,
        email: safeEmail,
        contact: safeContact,
        rateLimitKey,
      });

      // Persist rate limit timestamp to Cloud Firestore under deterministic machine and identity keys
      recordCloudContactRateLimit(db, {
        name: safeName,
        email: safeEmail,
        contact: safeContact,
        appName: options.appName || payload.appName,
        analyticsCollection: options.analyticsCollection || 'visitor_analytics',
      }).catch(() => {});

      // Background flush of any pending offline messages
      flushOfflineContactMessages(db, collectionName, options.transformPayload).catch(() => { });

      return {
        success: true,
        docId: docRef?.id || 'submitted',
        message: 'Thank you for reaching out! Your message has been received and we will get back to you shortly.',
      };
    } catch (err: any) {
      console.error('[contactService] Firestore write failed:', err);

      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      if (isOffline) {
        queueOfflineMessage(payload, safeName, safeEmail, safeContact, safeMessage, options);
        recordContactSubmissionTime({
          name: safeName,
          email: safeEmail,
          contact: safeContact,
          rateLimitKey,
        });
        return {
          success: true,
          offlineFallback: true,
          message: 'You appear to be offline. Your message has been saved and will be sent automatically once reconnected.',
        };
      }

      return {
        success: false,
        message: err?.message
          ? `Failed to deliver message: ${err.message}`
          : 'Failed to deliver message to server. Please try again later.',
      };
    }
  }

  // 4. Firestore DB could not be resolved
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  if (isOffline) {
    queueOfflineMessage(payload, safeName, safeEmail, safeContact, safeMessage, options);
    recordContactSubmissionTime({
      name: safeName,
      email: safeEmail,
      contact: safeContact,
      rateLimitKey,
    });
    return {
      success: true,
      offlineFallback: true,
      message: 'You appear to be offline. Your message has been saved locally and will be delivered once reconnected.',
    };
  }

  return {
    success: false,
    message: 'Backend message delivery service is not configured or unavailable. Please contact us directly via email.',
  };
}
