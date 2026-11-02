import { VisitorLogEntry } from '../services/visitorTracker';
import { FirebaseAppConfig } from '../services/firebase';
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
export declare const useVisitorTracker: ({ appName, firebaseConfig, firestoreCollection, consentStorageKey, sessionStorageKey, onLogReady, enabled, requireExplicitConsent, }?: UseVisitorTrackerOptions) => void;
