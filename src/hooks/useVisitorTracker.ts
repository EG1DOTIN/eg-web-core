import { useEffect, useRef } from 'react';
import {
  assembleVisitorLog,
  VisitorLogEntry,
  writeVisitorLogToFirestore,
  CONSENT_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  isConsentDenied,
  isConsentGranted,
  isSessionLogged,
  markSessionLogged,
} from '../services/visitorTracker';
import { FirebaseAppConfig, initFirebase } from '../services/firebase';
import { useFirebase } from '../theme/FirebaseContext';

export interface UseVisitorTrackerOptions {
  /** Application or domain identifier (defaults to window.location.hostname || 'web-app') */
  appName?: string;
  /** Custom Firebase App configuration credentials */
  firebaseConfig?: FirebaseAppConfig;
  /** Target Firestore collection for bucket pagination (default: 'visitor_analytics') */
  firestoreCollection?: string;
  /** Custom storage key for user consent (default: 'eg_analytics_consent') */
  consentStorageKey?: string;
  /** Custom session storage key for session throttling (default: 'eg_v_sess') */
  sessionStorageKey?: string;
  /** Callback fired with the assembled telemetry payload */
  onLogReady?: (entry: VisitorLogEntry) => void | Promise<void>;
  /** Toggle tracking execution */
  enabled?: boolean;
  /**
   * If true, waits until explicit consent is granted ('granted')
   * before writing telemetry. If false (default), proceeds unless consent was explicitly denied ('denied').
   */
  requireExplicitConsent?: boolean;
}

/**
 * Hook to execute non-invasive, privacy-preserving visitor telemetry.
 * Automatically respects user consent ('eg_analytics_consent' !== 'denied')
 * and deduplicates writes per browser session.
 *
 * Inherits Firebase configuration and collection names from `<FirebaseProvider>` by default,
 * or allows explicit prop overrides.
 *
 * @example
 * ```tsx
 * useVisitorTracker({
 *   appName: 'my-custom-portal',
 *   onLogReady: (log) => console.log('Telemetry recorded:', log.city, log.os),
 * });
 * ```
 */
export const useVisitorTracker = ({
  appName,
  firebaseConfig,
  firestoreCollection,
  consentStorageKey,
  sessionStorageKey,
  onLogReady,
  enabled = true,
  requireExplicitConsent = false,
}: UseVisitorTrackerOptions = {}) => {
  const firebaseCtx = useFirebase();
  const activeConfig = firebaseConfig || (firebaseCtx.config?.apiKey ? firebaseCtx.config : undefined);
  const activeAppName =
    appName ||
    (firebaseCtx.appName && firebaseCtx.appName !== 'web-app'
      ? firebaseCtx.appName
      : typeof window !== 'undefined' && window.location.hostname
      ? window.location.hostname
      : 'web-app');
  const targetCollection = firestoreCollection || firebaseCtx.collections?.analytics || 'visitor_analytics';
  const activeConsentKey = consentStorageKey || CONSENT_STORAGE_KEY;
  const activeSessionKey = sessionStorageKey || SESSION_STORAGE_KEY;
  const isTrackingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    const executeTrack = async () => {
      // 1. Opt-out check
      if (isConsentDenied(activeConsentKey)) return;

      // 2. Explicit consent check if configured
      if (requireExplicitConsent && !isConsentGranted(activeConsentKey)) return;

      // 3. Early bail-out if this session has already been processed
      if (isSessionLogged(activeSessionKey)) return;

      // 4. In-flight lock to avoid duplicate requests during GeoIP or transaction resolution
      if (isTrackingRef.current) return;
      isTrackingRef.current = true;

      try {
        const entry = await assembleVisitorLog(activeAppName, {
          consentStorageKey: activeConsentKey,
          sessionStorageKey: activeSessionKey,
        });
        if (!active || !entry) {
          isTrackingRef.current = false;
          return;
        }

        let writeSuccess = true;

        // Automated parameterized Firestore persistence if configured
        if (activeConfig && activeConfig.apiKey) {
          try {
            const { db } = await initFirebase(activeConfig, activeAppName === 'web-app' ? undefined : activeAppName);
            if (db) {
              writeSuccess = await writeVisitorLogToFirestore(db, entry, {
                collectionName: targetCollection,
              });
            } else {
              writeSuccess = false;
            }
          } catch (err) {
            writeSuccess = false;
            console.warn('[useVisitorTracker] Auto Firestore write warning:', err);
          }
        }

        if (onLogReady) {
          Promise.resolve(onLogReady(entry)).catch((err) => {
            console.warn('[useVisitorTracker] Custom log handler error:', err);
          });
        }

        // Only commit session storage lock when write succeeded or in custom non-firestore mode
        if (writeSuccess) {
          markSessionLogged(activeSessionKey);
        }
      } finally {
        isTrackingRef.current = false;
      }
    };

    // Execute initial tracking attempt
    executeTrack();

    // Listen for consent changes dispatched when user accepts via ConsentBanner ("OK")
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<'granted' | 'denied'>;
      if (customEvent.detail === 'granted') {
        executeTrack();
      }
    };

    window.addEventListener('analytics_consent_changed', handleConsentChange as EventListener);
    window.addEventListener('eg_consent_changed', handleConsentChange as EventListener);

    return () => {
      active = false;
      window.removeEventListener('analytics_consent_changed', handleConsentChange as EventListener);
      window.removeEventListener('eg_consent_changed', handleConsentChange as EventListener);
    };
  }, [activeAppName, activeConfig, targetCollection, activeConsentKey, activeSessionKey, onLogReady, enabled, requireExplicitConsent]);
};

