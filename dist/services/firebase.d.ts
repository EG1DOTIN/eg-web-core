/**
 * @file firebase.ts
 * @description Universal, parameterized Firebase client initialization & service helpers for EG web ecosystem.
 * Supports arbitrary configuration objects, presets, dynamic SDK loading, and Firestore instances.
 */
export interface FirebaseAppConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId: string;
    [key: string]: unknown;
}
export declare const DEFAULT_FIREBASE_CONFIG: FirebaseAppConfig;
declare global {
    interface Window {
        firebase?: any;
        db?: any;
        firebaseApp?: any;
    }
}
/**
 * Dynamically loads Firebase compat SDK scripts (app + firestore) into document head if not already loaded.
 */
export declare function ensureFirebaseSDK(): Promise<any>;
/**
 * Dynamically loads Firebase compat SDK scripts (app + firestore + auth) into document head if not already loaded.
 */
export declare function ensureFirebaseAuthSDK(): Promise<any>;
/**
 * Idempotently initializes Firebase and returns the application, Firestore, and Auth instances.
 *
 * @param config Custom or preset FirebaseAppConfig
 * @param appName Optional named instance (defaults to default app)
 * @param options Optional flags such as includeAuth
 *
 * @example
 * ```ts
 * const { app, db, auth } = await initFirebase(myFirebaseConfig, undefined, { includeAuth: true });
 * ```
 */
export declare function initFirebase(config?: FirebaseAppConfig, appName?: string, options?: {
    includeAuth?: boolean;
}): Promise<{
    app: any;
    db: any;
    auth?: any;
}>;
/**
 * Returns Firestore instance initialized with the given configuration.
 */
export declare function getFirestore(config?: FirebaseAppConfig, appName?: string): Promise<any>;
/**
 * Returns Firebase Auth instance initialized with the given configuration.
 */
export declare function getFirebaseAuth(config?: FirebaseAppConfig, appName?: string): Promise<any>;
