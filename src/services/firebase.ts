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

export const DEFAULT_FIREBASE_CONFIG: FirebaseAppConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: '',
};

declare global {
  interface Window {
    firebase?: any;
    db?: any;
    firebaseApp?: any;
  }
}

let sdkLoadingPromise: Promise<any> | null = null;

/**
 * Dynamically loads Firebase compat SDK scripts (app + firestore) into document head if not already loaded.
 */
export function ensureFirebaseSDK(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.firebase && window.firebase.firestore) return Promise.resolve(window.firebase);
  if (sdkLoadingPromise) return sdkLoadingPromise;

  sdkLoadingPromise = new Promise((resolve, reject) => {
    function loadScript(src: string): Promise<void> {
      return new Promise((res, rej) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          res();
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.onload = () => res();
        s.onerror = (e) => rej(e);
        document.head.appendChild(s);
      });
    }

    loadScript('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js')
      .then(() => loadScript('https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore-compat.js'))
      .then(() => resolve(window.firebase))
      .catch((err) => {
        sdkLoadingPromise = null;
        reject(err);
      });
  });

  return sdkLoadingPromise;
}

let authSdkLoadingPromise: Promise<any> | null = null;

/**
 * Dynamically loads Firebase compat SDK scripts (app + firestore + auth) into document head if not already loaded.
 */
export function ensureFirebaseAuthSDK(): Promise<any> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.firebase && window.firebase.auth && window.firebase.firestore) return Promise.resolve(window.firebase);
  if (authSdkLoadingPromise) return authSdkLoadingPromise;

  authSdkLoadingPromise = new Promise((resolve, reject) => {
    function loadScript(src: string): Promise<void> {
      return new Promise((res, rej) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          res();
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.crossOrigin = 'anonymous';
        s.onload = () => res();
        s.onerror = (e) => rej(e);
        document.head.appendChild(s);
      });
    }

    loadScript('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js')
      .then(() => loadScript('https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore-compat.js'))
      .then(() => loadScript('https://www.gstatic.com/firebasejs/10.5.0/firebase-auth-compat.js'))
      .then(() => resolve(window.firebase))
      .catch((err) => {
        authSdkLoadingPromise = null;
        reject(err);
      });
  });

  return authSdkLoadingPromise;
}

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
export async function initFirebase(
  config: FirebaseAppConfig = DEFAULT_FIREBASE_CONFIG,
  appName?: string,
  options: { includeAuth?: boolean } = {}
): Promise<{ app: any; db: any; auth?: any }> {
  if (typeof window === 'undefined') {
    return { app: null, db: null, auth: null };
  }

  if (options.includeAuth) {
    await ensureFirebaseAuthSDK();
  } else {
    await ensureFirebaseSDK();
  }

  const fb = window.firebase;
  if (!fb) {
    throw new Error('[eg-web-core] Firebase SDK could not be loaded.');
  }

  let app: any = null;
  if (appName) {
    const existing = fb.apps && fb.apps.find((a: any) => a && a.name === appName);
    if (existing) {
      app = existing;
    } else if (config && config.apiKey) {
      app = fb.initializeApp(config, appName);
    } else {
      throw new Error(`[eg-web-core] Cannot initialize Firebase app "${appName}": valid apiKey is required.`);
    }
  } else {
    if (fb.apps && fb.apps.length > 0) {
      app = fb.app();
    } else if (config && config.apiKey) {
      app = fb.initializeApp(config);
    } else {
      throw new Error('[eg-web-core] Cannot initialize default Firebase app: valid apiKey is required.');
    }
  }

  const db = app.firestore ? app.firestore() : null;
  const auth = (options.includeAuth && app.auth) ? app.auth() : (app.auth ? app.auth() : null);

  window.firebaseApp = app;
  if (db) window.db = db;

  return { app, db, auth };
}

/**
 * Returns Firestore instance initialized with the given configuration.
 */
export async function getFirestore(
  config: FirebaseAppConfig = DEFAULT_FIREBASE_CONFIG,
  appName?: string
): Promise<any> {
  const { db } = await initFirebase(config, appName);
  return db;
}

/**
 * Returns Firebase Auth instance initialized with the given configuration.
 */
export async function getFirebaseAuth(
  config: FirebaseAppConfig = DEFAULT_FIREBASE_CONFIG,
  appName?: string
): Promise<any> {
  const { auth } = await initFirebase(config, appName, { includeAuth: true });
  return auth;
}

