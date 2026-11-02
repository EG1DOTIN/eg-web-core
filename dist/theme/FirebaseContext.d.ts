import { default as React } from 'react';
import { FirebaseAppConfig } from '../services/firebase';
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
export declare const DEFAULT_FIREBASE_COLLECTIONS: Required<FirebaseCollectionsConfig>;
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
export declare const FirebaseContext: React.Context<FirebaseContextValue>;
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
export declare const FirebaseProvider: React.FC<FirebaseProviderProps>;
/**
 * Hook to access current Firebase configuration, collections, Firestore instance, and initialization state.
 *
 * @example
 * ```tsx
 * const { db, collections, isReady } = useFirebase();
 * ```
 */
export declare const useFirebase: () => FirebaseContextValue;
