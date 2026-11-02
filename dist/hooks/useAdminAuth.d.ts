import { AdminUser, AdminAuthConfig, AdminPinConfig, AdminLockoutStatus } from '../services/adminAuthService';
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
export declare function useAdminAuth(config?: AdminAuthConfig): UseAdminAuthResult;
