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
export declare const AdminAuthGuard: React.FC<AdminAuthGuardProps>;
