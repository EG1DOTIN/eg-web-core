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

export const CONSENT_STORAGE_KEY = 'analytics_consent';
export const SESSION_STORAGE_KEY = 'analytics_session';
export const BUCKET_PAGE_SIZE = 50;
const GEO_TIMEOUT_MS = 3500;

/**
 * Returns the current local calendar date formatted as YYYY-MM-DD.
 * Used for bucket metadata tracking.
 *
 * @example
 * ```ts
 * const dateStr = getTodayDateString(); // e.g. "2026-10-21"
 * ```
 */
export const getTodayDateString = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Detects operating system from User Agent string.
 *
 * @example
 * ```ts
 * const os = detectOS(navigator.userAgent); // "Windows", "macOS", "Linux", etc.
 * ```
 */
export const detectOS = (ua: string): string => {
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  return 'Unknown OS';
};

/**
 * Detects web browser from User Agent string.
 *
 * @example
 * ```ts
 * const browser = detectBrowser(navigator.userAgent); // "Chrome", "Firefox", etc.
 * ```
 */
export const detectBrowser = (ua: string): string => {
  if (/edg\//i.test(ua)) return 'Edge';
  if (/opr\/|opera/i.test(ua)) return 'Opera';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return 'Safari';
  return 'Unknown Browser';
};

/**
 * Fetches GeoIP coordinates and network metadata using resilient multi-tier fallback.
 *
 * @example
 * ```ts
 * const geo = await fetchGeoLocation();
 * console.log(geo.city, geo.country);
 * ```
 */
export const fetchGeoLocation = async (): Promise<GeoLocation> => {
  const fallback: GeoLocation = {
    ip: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    org: 'Unknown',
    postal: 'Unknown',
  };

  if (typeof window === 'undefined') return fallback;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

    // Primary: ipapi.co
    try {
      const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return {
          ip: data.ip || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          country: data.country_name || data.country || 'Unknown',
          org: data.org || 'Unknown',
          postal: data.postal || 'Unknown',
        };
      }
    } catch {
      // Try secondary
    }

    // Secondary fallback: ipwho.is
    const res2 = await fetch('https://ipwho.is/');
    if (res2.ok) {
      const data2 = await res2.json();
      return {
        ip: data2.ip || 'Unknown',
        city: data2.city || 'Unknown',
        region: data2.region || 'Unknown',
        country: data2.country || 'Unknown',
        org: (data2.connection && data2.connection.isp) || 'Unknown',
        postal: data2.postal || 'Unknown',
      };
    }
  } catch {
    // Offline or blocked
  }

  return fallback;
};

/**
 * Checks whether user has explicitly opted out or denied analytics consent.
 *
 * @param storageKey Optional custom storage key for consent state
 */
export const isConsentDenied = (storageKey?: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const key = storageKey || CONSENT_STORAGE_KEY;
    const val = localStorage.getItem(key);
    if (val === 'denied') return true;

    const optout = localStorage.getItem('analytics_optout');
    return optout === 'true';
  } catch {
    return false;
  }
};

/**
 * Checks whether user has explicitly granted analytics consent.
 *
 * @param storageKey Optional custom storage key for consent state
 */
export const isConsentGranted = (storageKey?: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    if (isConsentDenied(storageKey)) return false;

    const key = storageKey || CONSENT_STORAGE_KEY;
    const val = localStorage.getItem(key);
    return val === 'granted';
  } catch {
    return false;
  }
};

/**
 * Checks whether this browser session has already been recorded.
 *
 * @param sessionKey Optional custom session storage key
 */
export const isSessionLogged = (sessionKey?: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const key = sessionKey || SESSION_STORAGE_KEY;
    return Boolean(sessionStorage.getItem(key));
  } catch {
    return false;
  }
};

/**
 * Marks this browser session as recorded in sessionStorage.
 *
 * @param sessionKey Optional custom session storage key
 */
export const markSessionLogged = (sessionKey?: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const targetKey = sessionKey || SESSION_STORAGE_KEY;
    sessionStorage.setItem(targetKey, '1');
  } catch {
    // Storage restricted
  }
};

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
export const assembleVisitorLog = async (
  appName?: string,
  options: AssembleVisitorLogOptions = {}
): Promise<VisitorLogEntry | null> => {
  if (typeof window === 'undefined') return null;

  if (isConsentDenied(options.consentStorageKey)) return null;
  if (isSessionLogged(options.sessionStorageKey)) return null;

  const resolvedAppName =
    appName ||
    (typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'web-app');

  const ua = navigator.userAgent || '';
  const os = detectOS(ua);
  const browser = detectBrowser(ua);
  const pageVisited = window.location.pathname + (window.location.search || '');

  let referrer = 'Direct';
  if (document.referrer) {
    try {
      referrer = new URL(document.referrer, window.location.href).hostname || 'Direct';
    } catch {
      referrer = 'Unknown';
    }
  }

  const screen = window.screen ? `${window.screen.width}x${window.screen.height}` : 'Unknown';
  const timezone = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown' : 'Unknown';
  const language = navigator.language || 'en';

  const geo = await fetchGeoLocation();
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    timestamp: new Date().toISOString(),
    appName: resolvedAppName,
    pageVisited: pageVisited || '/',
    referrer,
    ip: geo.ip,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    org: geo.org,
    postal: geo.postal,
    timezone,
    os,
    browser,
    screen,
    language,
  };
};

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
export const writeVisitorLogToFirestore = async (
  db: any,
  logEntry: VisitorLogEntry,
  options: FirestoreBucketWriterOptions = {}
): Promise<boolean> => {
  if (!db || !logEntry) return false;
  const collectionName = options.collectionName || 'visitor_analytics';
  const pageSize = options.pageSize || BUCKET_PAGE_SIZE;
  const todayStr = getTodayDateString();

  // Ensure all fields are safe, defined strings to prevent Firestore transaction rejection
  const safeEntry: Record<string, string> = {};
  for (const [k, v] of Object.entries(logEntry)) {
    safeEntry[k] = v === undefined || v === null ? '' : String(v);
  }

  const FieldValue =
    (typeof window !== 'undefined' && (window as any).firebase?.firestore?.FieldValue) ||
    (db as any)?.constructor?.FieldValue ||
    (db as any)?.app?.firebase?.firestore?.FieldValue ||
    (db as any)?.firestore?.FieldValue;

  const serverTimestamp = (FieldValue && typeof FieldValue.serverTimestamp === 'function')
    ? FieldValue.serverTimestamp()
    : new Date().toISOString();

  const metaRef = db.collection(collectionName).doc('meta');

  try {
    await db.runTransaction(async (transaction: any) => {
      const metaSnap = await transaction.get(metaRef);
      let currentPage = 1;
      let currentCount = 0;
      let totalVisitors = 0;
      let todayDate = todayStr;
      let todayCount = 0;

      if (metaSnap && (typeof metaSnap.exists === 'function' ? metaSnap.exists() : metaSnap.exists)) {
        const data = metaSnap.data() || {};
        currentPage = data.currentPage || 1;
        currentCount = data.currentCount || 0;
        totalVisitors = data.totalVisitors || 0;

        if (data.todayDate === todayStr) {
          todayCount = data.todayCount || 0;
        } else {
          todayDate = todayStr;
          todayCount = 0;
        }
      }

      if (currentCount >= pageSize) {
        currentPage++;
        currentCount = 0;
      }

      const pageRef = db.collection(collectionName).doc(`page_${currentPage}`);

      let logsPayload: any;
      if (FieldValue && typeof FieldValue.arrayUnion === 'function') {
        logsPayload = FieldValue.arrayUnion(safeEntry);
      } else {
        logsPayload = [safeEntry];
      }

      transaction.set(
        pageRef,
        {
          pageNum: currentPage,
          lastUpdated: new Date().toISOString(),
          logs: logsPayload,
        },
        { merge: true }
      );

      transaction.set(
        metaRef,
        {
          currentPage,
          currentCount: currentCount + 1,
          totalVisitors: totalVisitors + 1,
          todayDate,
          todayCount: todayCount + 1,
          lastUpdated: serverTimestamp,
        },
        { merge: true }
      );
    });

    return true;
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (err?.code === 'permission-denied' || errMsg.toLowerCase().includes('permission')) {
      console.error(
        `[writeVisitorLogToFirestore] Firestore permission denied for collection "${collectionName}". ` +
        `Security rules must allow create/update on page documents and read/write on meta document. ` +
        `Please check firestore.rules in Firebase Console. Details: ${errMsg}`
      );
    } else {
      console.warn('[writeVisitorLogToFirestore] Transaction failed, attempting direct batch fallback:', err);
      try {
        const metaDoc = await metaRef.get();
        let currentPage = 1;
        let currentCount = 0;
        let totalVisitors = 0;
        let todayCount = 0;
        let todayDate = todayStr;

        if (metaDoc && (typeof metaDoc.exists === 'function' ? metaDoc.exists() : metaDoc.exists)) {
          const d = metaDoc.data() || {};
          currentPage = d.currentPage || 1;
          currentCount = d.currentCount || 0;
          totalVisitors = d.totalVisitors || 0;
          if (d.todayDate === todayStr) todayCount = d.todayCount || 0;
        }

        if (currentCount >= pageSize) {
          currentPage++;
          currentCount = 0;
        }

        const pageRef = db.collection(collectionName).doc(`page_${currentPage}`);
        const logsPayload = (FieldValue && typeof FieldValue.arrayUnion === 'function')
          ? FieldValue.arrayUnion(safeEntry)
          : [safeEntry];

        await pageRef.set(
          {
            pageNum: currentPage,
            lastUpdated: new Date().toISOString(),
            logs: logsPayload,
          },
          { merge: true }
        );

        await metaRef.set(
          {
            currentPage,
            currentCount: currentCount + 1,
            totalVisitors: totalVisitors + 1,
            todayDate,
            todayCount: todayCount + 1,
            lastUpdated: serverTimestamp,
          },
          { merge: true }
        );

        return true;
      } catch (fallbackErr) {
        console.warn('[writeVisitorLogToFirestore] Direct fallback also failed:', fallbackErr);
      }
    }
    return false;
  }
};

