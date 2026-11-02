/**
 * Visitor Tracker Service
 * Non-invasive telemetry (GeoIP, OS, Browser, Screen) with Firestore Batched Bucket Pattern (50 per doc).
 */
export interface GeoLocation {
    ip: string;
    city: string;
    region: string;
    country: string;
    org: string;
    postal: string;
}
export interface VisitorLogEntry {
    id: string;
    timestamp: string;
    appName: string;
    pageVisited: string;
    referrer: string;
    ip: string;
    city: string;
    region: string;
    country: string;
    org: string;
    postal: string;
    timezone: string;
    os: string;
    browser: string;
    screen: string;
    language: string;
}
export declare const CONSENT_STORAGE_KEY = "analytics_consent";
export declare const SESSION_STORAGE_KEY = "analytics_session";
export declare const BUCKET_PAGE_SIZE = 50;
/**
 * Returns the current local calendar date formatted as YYYY-MM-DD.
 * Used for bucket metadata tracking.
 *
 * @example
 * ```ts
 * const dateStr = getTodayDateString(); // e.g. "2026-10-21"
 * ```
 */
export declare const getTodayDateString: () => string;
/**
 * Detects operating system from User Agent string.
 *
 * @example
 * ```ts
 * const os = detectOS(navigator.userAgent); // "Windows", "macOS", "Linux", etc.
 * ```
 */
export declare const detectOS: (ua: string) => string;
/**
 * Detects web browser from User Agent string.
 *
 * @example
 * ```ts
 * const browser = detectBrowser(navigator.userAgent); // "Chrome", "Firefox", etc.
 * ```
 */
export declare const detectBrowser: (ua: string) => string;
/**
 * Fetches GeoIP coordinates and network metadata using resilient multi-tier fallback.
 *
 * @example
 * ```ts
 * const geo = await fetchGeoLocation();
 * console.log(geo.city, geo.country);
 * ```
 */
export declare const fetchGeoLocation: () => Promise<GeoLocation>;
/**
 * Checks whether user has explicitly opted out or denied analytics consent.
 *
 * @param storageKey Optional custom storage key for consent state
 */
export declare const isConsentDenied: (storageKey?: string) => boolean;
/**
 * Checks whether user has explicitly granted analytics consent.
 *
 * @param storageKey Optional custom storage key for consent state
 */
export declare const isConsentGranted: (storageKey?: string) => boolean;
/**
 * Checks whether this browser session has already been recorded.
 *
 * @param sessionKey Optional custom session storage key
 */
export declare const isSessionLogged: (sessionKey?: string) => boolean;
/**
 * Marks this browser session as recorded in sessionStorage.
 *
 * @param sessionKey Optional custom session storage key
 */
export declare const markSessionLogged: (sessionKey?: string) => void;
export interface AssembleVisitorLogOptions {
    consentStorageKey?: string;
    sessionStorageKey?: string;
}
/**
 * Assembles anonymous visitor log entry if telemetry consent is not denied
 * and session has not already been logged.
 * Does not lock sessionStorage directly, allowing caller to commit session state upon successful persistence.
 *
 * @param appName Application or website identifier (defaults to window.location.hostname || 'web-app')
 * @param options Storage key overrides
 *
 * @example
 * ```ts
 * const entry = await assembleVisitorLog();
 * if (entry) console.log('Visitor session:', entry.id, entry.country, entry.appName);
 * ```
 */
export declare const assembleVisitorLog: (appName?: string, options?: AssembleVisitorLogOptions) => Promise<VisitorLogEntry | null>;
export interface FirestoreBucketWriterOptions {
    collectionName?: string;
    pageSize?: number;
}
/**
 * Persists a visitor telemetry log entry to Cloud Firestore using the Batched Bucket Pattern (50 records per page).
 * Significantly optimizes read/write quotas by grouping entries into paginated document buckets.
 *
 * @example
 * ```ts
 * const entry = await assembleVisitorLog();
 * if (entry && window.firebase) {
 *   const db = window.firebase.firestore();
 *   await writeVisitorLogToFirestore(db, entry);
 * }
 * ```
 */
export declare const writeVisitorLogToFirestore: (db: any, logEntry: VisitorLogEntry, options?: FirestoreBucketWriterOptions) => Promise<boolean>;
