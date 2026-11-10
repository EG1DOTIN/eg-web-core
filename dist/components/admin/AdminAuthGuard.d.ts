import { default as React } from 'react';
import { AdminAuthConfig, AdminPinConfig, AdminUser } from '../../services/adminAuthService';
import { AdminLoginFormProps } from './AdminLoginForm';
export interface AdminAuthGuardProps {
    /** The protected content to render upon successful authentication */
    children: React.ReactNode | ((auth: {
        user: AdminUser;
        logout: () => Promise<void>;
    }) => React.ReactNode);
    /** Configuration for Google whitelist, PIN salt, and collections */
    authConfig?: AdminAuthConfig;
    /** PIN verification parameters */
    pinConfig?: AdminPinConfig;
    /** Props forwarded to the default login form */
    loginProps?: Partial<AdminLoginFormProps>;
    /** Custom fallback element to render while verifying session */
    loadingFallback?: React.ReactNode;
}
/**
 * Two-tier authentication guard protecting administrative pages and features.
 *
 * @param props - AdminAuthGuardProps configuration
 * @returns Protected child components or AdminLoginForm fallback
 *
 * @example
 * ```tsx
 * <AdminAuthGuard authConfig={{ allowedEmails: ['admin@example.com'] }}>
 *   {({ user, logout }) => (
 *     <AdminDashboard user={user} onLogout={logout} />
 *   )}
 * </AdminAuthGuard>
 * ```
 */
export declare const AdminAuthGuard: React.FC<AdminAuthGuardProps>;
