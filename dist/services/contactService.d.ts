import { FirebaseAppConfig } from './firebase';
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
export declare function generateMathCaptcha(): MathCaptchaChallenge;
/**
 * Computes a stable machine & browser fingerprint from hardware, screen, and runtime signals.
 * Persists a unique client GUID to guard against incognito/tab switching.
 */
export declare function getMachineFingerprint(): string;
/**
 * Normalizes WebGL renderer strings across browser implementations (Chrome ANGLE, Firefox, WebKit)
 * to extract a clean, deterministic chipset identifier.
 * Example Chrome: "ANGLE (Intel, Mesa Intel(R) UHD Graphics (CML GT2), OpenGL 4.6)" -> "mesa intel uhd graphics cml gt2"
 * Example Firefox: "Mesa Intel(R) UHD Graphics (CML GT2)" -> "mesa intel uhd graphics cml gt2"
 */
export declare function normalizeGpuRenderer(raw: string): string;
/**
 * Computes a baseline cross-browser hardware fingerprint (screen resolution, timezone, timezone offset, platform, CPU cores, touch points)
 * that is 100% identical across different browsers (Chrome, Firefox, Edge, Safari, Incognito) on the same machine.
 */
export declare function getHardwareCoreFingerprint(): string;
/**
 * Computes a cross-browser hardware fingerprint (screen resolution, timezone, timezone offset, platform, concurrency, normalized GPU)
 * that remains identical across different browsers (Chrome, Firefox, Edge, Brave, Incognito) on the same machine.
 */
export declare function getHardwareFingerprint(): string;
/**
 * Generates normalized identity hashes for user inputs (email, contact phone, name).
 */
export declare function getUserIdentityHashes(name?: string, email?: string, contact?: string): {
    emailHash: string;
    phoneHash: string;
    nameHash: string;
};
export interface CheckContactRateLimitOptions {
    name?: string;
    email?: string;
    contact?: string;
    rateLimitKey?: string;
    rateLimitHours?: number;
    allowLocalhostBypass?: boolean;
}
export declare const CLOUD_HW_PREFIX = "c_rl_hw_";
export declare const CLOUD_HWCORE_PREFIX = "c_rl_hwcore_";
export declare const CLOUD_DEV_PREFIX = "c_rl_dev_";
export declare const CLOUD_EMAIL_PREFIX = "c_rl_em_";
export declare const CLOUD_PHONE_PREFIX = "c_rl_ph_";
/**
 * Checks if the user or machine is currently within the active rate-limit window.
 * Inspects machine/browser fingerprint as well as user contact information (name, email, phone)
 * to minimize automated spam.
 */
export declare function checkContactRateLimit(optionsOrKey?: CheckContactRateLimitOptions | string, rateLimitHours?: number, allowLocalhostBypass?: boolean): {
    allowed: boolean;
    hoursRemaining?: number;
    minutesRemaining?: number;
    reason?: 'machine' | 'email' | 'contact' | 'session' | 'general';
    message?: string;
};
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
export declare function checkCloudContactRateLimit(db: any, options?: CheckCloudRateLimitOptions): Promise<CloudRateLimitResult>;
/**
 * Records rate-limit timestamps to Cloud Firestore (default: 'visitor_analytics')
 * under deterministic machine/hardware keys and user credential hashes.
 */
export declare function recordCloudContactRateLimit(db: any, options?: {
    name?: string;
    email?: string;
    contact?: string;
    appName?: string;
    analyticsCollection?: string;
}): Promise<void>;
/**
 * Records a successful submission timestamp to enforce client and device rate-limiting.
 */
export declare function recordContactSubmissionTime(optionsOrKey?: {
    name?: string;
    email?: string;
    contact?: string;
    rateLimitKey?: string;
} | string): void;
/**
 * Clears recorded contact submission rate limit timestamps (useful for testing and verification).
 * If Firestore database is provided, also clears cloud records from visitor_analytics.
 */
export declare function clearContactRateLimit(rateLimitKey?: string, db?: any, analyticsCollection?: string): Promise<void>;
/**
 * Automatically syncs any offline messages cached in localStorage to Firestore once connectivity is available.
 * Returns the number of flushed messages.
 */
export declare function flushOfflineContactMessages(db: any, collectionName?: string, transformPayload?: (item: any) => Record<string, any>): Promise<number>;
/**
 * Submits a contact inquiry to Cloud Firestore `/messages` collection.
 * Gracefully falls back to offline localStorage queue if the client is offline,
 * and automatically flushes queued offline messages upon reconnecting.
 */
export declare function submitContactInquiry(payload: ContactMessagePayload, options?: SubmitContactOptions): Promise<SubmitContactResult>;
