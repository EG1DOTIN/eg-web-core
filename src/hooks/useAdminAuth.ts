/**
 * @file useAdminAuth.ts
 * @description React hook for administrative authentication state management,
 * Google OAuth session monitoring, 16-digit PIN verification, and brute-force lockout status.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  AdminUser,
  AdminAuthConfig,
  AdminPinConfig,
  AdminLockoutStatus,
  getClientIP,
  checkAdminLockout,
  signInWithGooglePopup,
  verifyAdminPin,
  adminSignOut,
  isAdminSessionVerified,
  clearAdminSession,
} from '../services/adminAuthService';
import { getFirebaseAuth } from '../services/firebase';

export interface UseAdminAuthResult {
  /** The authenticated Google user profile, or null if unauthenticated */
  user: AdminUser | null;
  /** True if the user has passed the 16-digit PIN challenge in the current session */
  isPinVerified: boolean;
  /** True only if both Google auth AND 16-digit PIN are verified */
  isAuthenticated: boolean;
  /** Loading state during auth checks or login/verification actions */
  isLoading: boolean;
  /** Latest user-facing error message, if any */
  error: string | null;
  /** Lockout status of the client IP */
  lockout: AdminLockoutStatus;
  /** Detected public client IP address */
  clientIP: string;
  /** Triggers the Google Sign-In popup with whitelist verification */
  loginWithGoogle: () => Promise<AdminUser | null>;
  /** Submits a 16-digit PIN for SHA-256 verification */
  verifyPin: (pin: string, pinConfig?: AdminPinConfig) => Promise<boolean>;
  /** Signs out from Google and invalidates the session */
  logout: () => Promise<void>;
  /** Resets PIN verification in the current session so the PIN screen is shown again */
  resetPinPrompt: () => void;
  /** Re-checks IP lockout status */
  refreshLockout: () => Promise<void>;
  /** Clears any active error banner */
  clearError: () => void;
}

/**
 * Hook to manage administrative 2-Factor Authentication state.
 *
 * @param config Configuration options for emails, salts, lockouts, and collections
 *
 * @example
 * ```tsx
 * const {
 *   user,
 *   isPinVerified,
 *   isAuthenticated,
 *   isLoading,
 *   error,
 *   loginWithGoogle,
 *   verifyPin,
 *   logout
 * } = useAdminAuth({
 *   allowedEmails: ['admin@example.com'],
 *   pinSalt: 'MY_SALT_2026'
 * });
 * ```
 */
export function useAdminAuth(config: AdminAuthConfig = {}): UseAdminAuthResult {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clientIP, setClientIP] = useState<string>('unknown');
  const [lockout, setLockout] = useState<AdminLockoutStatus>({
    locked: false,
    unlocksAt: null,
    failCount: 0,
    hoursRemaining: 0,
  });

  // Re-check lockout status
  const refreshLockout = useCallback(async () => {
    try {
      const ip = clientIP !== 'unknown' ? clientIP : await getClientIP();
      if (ip !== 'unknown') {
        setClientIP(ip);
        const status = await checkAdminLockout(ip, config);
        setLockout(status);
      }
    } catch {
      // Non-blocking
    }
  }, [clientIP, config]);

  // Initial client IP and auth listener setup
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setIsLoading(true);
      try {
        const ip = await getClientIP();
        if (isMounted) {
          setClientIP(ip);
          const lockStatus = await checkAdminLockout(ip, config);
          setLockout(lockStatus);
        }

        const auth = await getFirebaseAuth(config.firebaseConfig);
        if (auth && typeof auth.onAuthStateChanged === 'function') {
          auth.onAuthStateChanged((fbUser: any) => {
            if (!isMounted) return;

            if (fbUser && fbUser.email) {
              // Whitelist check
              if (config.allowedEmails && config.allowedEmails.length > 0) {
                const isAllowed = config.allowedEmails.some(
                  (em) => em.toLowerCase() === fbUser.email.toLowerCase()
                );
                if (!isAllowed) {
                  clearAdminSession(config.sessionKey);
                  setUser(null);
                  setIsPinVerified(false);
                  setIsLoading(false);
                  auth.signOut();
                  return;
                }
              }

              const profile: AdminUser = {
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName,
                photoURL: fbUser.photoURL,
              };

              setUser(profile);
              const verified = isAdminSessionVerified(fbUser.uid, config.sessionKey);
              setIsPinVerified(verified);
            } else {
              setUser(null);
              setIsPinVerified(false);
            }
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to initialize administrative security layer.');
          setIsLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [config.sessionKey, config.firebaseConfig]);

  // Step 1: Login with Google
  const loginWithGoogle = useCallback(async (): Promise<AdminUser | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const loggedUser = await signInWithGooglePopup(config);
      setUser(loggedUser);
      const verified = isAdminSessionVerified(loggedUser.uid, config.sessionKey);
      setIsPinVerified(verified);
      await refreshLockout();
      setIsLoading(false);
      return loggedUser;
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
      await refreshLockout();
      setIsLoading(false);
      return null;
    }
  }, [config, refreshLockout]);

  // Step 2: Verify PIN
  const verifyPin = useCallback(
    async (pin: string, pinConfig: AdminPinConfig = {}): Promise<boolean> => {
      if (!user) {
        setError('Please sign in with Google first.');
        return false;
      }
      setError(null);
      setIsLoading(true);
      try {
        const result = await verifyAdminPin(pin, user, {
          ...config,
          ...pinConfig,
          ip: clientIP,
        });

        if (result.success) {
          setIsPinVerified(true);
          setError(null);
          await refreshLockout();
          setIsLoading(false);
          return true;
        } else {
          setIsPinVerified(false);
          setError(result.error || 'Incorrect security PIN.');
          await refreshLockout();
          setIsLoading(false);
          return false;
        }
      } catch (err: any) {
        setIsPinVerified(false);
        setError(err.message || 'Failed to verify security PIN.');
        await refreshLockout();
        setIsLoading(false);
        return false;
      }
    },
    [user, config, clientIP, refreshLockout]
  );

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await adminSignOut(config);
      setUser(null);
      setIsPinVerified(false);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const resetPinPrompt = useCallback(() => {
    clearAdminSession(config.sessionKey);
    setIsPinVerified(false);
  }, [config.sessionKey]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isPinVerified,
    isAuthenticated: Boolean(user && isPinVerified),
    isLoading,
    error,
    lockout,
    clientIP,
    loginWithGoogle,
    verifyPin,
    logout,
    resetPinPrompt,
    refreshLockout,
    clearError,
  };
}
