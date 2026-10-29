import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FirebaseAppConfig, DEFAULT_FIREBASE_CONFIG, initFirebase } from '../services/firebase';

/**
 * Customizable collection names for all Firebase/Firestore features.
 * Allows consumers to map to their own schema conventions.
 */
export interface FirebaseCollectionsConfig {
  /** Collection name for contact inquiries (default: 'messages') */
  messages?: string;
  /** Collection name for batched visitor telemetry (default: 'visitor_analytics') */
  analytics?: string;
  /** Collection name for admin failed attempt lockouts (default: 'admin_lockout') */
  adminLockout?: string;
  /** Collection name for admin login audit logs (default: 'admin_login_log') */
  adminAuditLog?: string;
  [key: string]: string | undefined;
}

export const DEFAULT_FIREBASE_COLLECTIONS: Required<FirebaseCollectionsConfig> = {
  messages: 'messages',
  analytics: 'visitor_analytics',
  adminLockout: 'admin_lockout',
  adminAuditLog: 'admin_login_log',
};

/**
 * Context value interface for Firebase configuration, active app, collections, and Firestore DB.
 */
export interface FirebaseContextValue {
  config: FirebaseAppConfig;
  appName: string;
  collections: FirebaseCollectionsConfig;
  db: any | null;
  isReady: boolean;
  error: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextValue>({
  config: DEFAULT_FIREBASE_CONFIG,
  appName: 'web-app',
  collections: DEFAULT_FIREBASE_COLLECTIONS,
  db: null,
  isReady: false,
  error: null,
});

export interface FirebaseProviderProps {
  children: React.ReactNode;
  config?: FirebaseAppConfig;
  appName?: string;
  collections?: FirebaseCollectionsConfig;
  autoInit?: boolean;
}

/**
 * Provides parameterized Firebase configuration context to child components.
 * Automatically initializes the Firebase SDK and Firestore database when `autoInit` is true.
 *
 * @example
 * ```tsx
 * import { FirebaseProvider } from 'eg-web-core';
 * import { myAppFirebaseConfig } from './config/firebase';
 *
 * export function App() {
 *   return (
 *     <FirebaseProvider
 *       config={myAppFirebaseConfig}
 *       appName="my-app"
 *       collections={{ messages: 'user_inquiries', analytics: 'site_metrics' }}
 *     >
 *       <MainContent />
 *     </FirebaseProvider>
 *   );
 * }
 * ```
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  config = DEFAULT_FIREBASE_CONFIG,
  appName = 'web-app',
  collections,
  autoInit = true,
}) => {
  const [db, setDb] = useState<any | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mergedCollections = useMemo<FirebaseCollectionsConfig>(() => ({
    ...DEFAULT_FIREBASE_COLLECTIONS,
    ...(collections || {}),
  }), [collections]);

  useEffect(() => {
    if (!autoInit || !config.apiKey) return;

    let active = true;
    initFirebase(config, appName === 'web-app' ? undefined : appName)
      .then(({ db: firestoreDb }) => {
        if (!active) return;
        setDb(firestoreDb);
        setIsReady(true);
      })
      .catch((err) => {
        if (!active) return;
        console.warn('[FirebaseProvider] Firebase auto-init warning:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      });

    return () => {
      active = false;
    };
  }, [config, appName, autoInit]);

  const value = useMemo<FirebaseContextValue>(() => ({
    config,
    appName,
    collections: mergedCollections,
    db,
    isReady,
    error,
  }), [config, appName, mergedCollections, db, isReady, error]);

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
};

/**
 * Hook to access current Firebase configuration, collections, Firestore instance, and initialization state.
 *
 * @example
 * ```tsx
 * const { db, collections, isReady } = useFirebase();
 * ```
 */
export const useFirebase = (): FirebaseContextValue => {
  return useContext(FirebaseContext);
};
