import { default as React } from 'react';
import { AdminAuthConfig, AdminPinConfig, AdminUser } from '../../services/adminAuthService';
export interface AdminLoginFormProps {
    /** Title for the login card (default: 'Admin Portal') */
    title?: string;
    /** Subtitle text (default: 'Sign in with your authorized administrator credentials') */
    subtitle?: string;
    /** Optional branding logo or icon element */
    logo?: React.ReactNode;
    /** List of authorized Google email addresses */
    allowedEmails?: string[];
    /** Pin configuration options (salt, expectedPinHash, pinLength) */
    pinConfig?: AdminPinConfig;
    /** Full auth configuration options */
    authConfig?: AdminAuthConfig;
    /** Callback fired upon full 2FA authentication success */
    onSuccess?: (user: AdminUser) => void;
    /** Custom wrapper style */
    style?: React.CSSProperties;
    /** Custom CSS class */
    className?: string;
}
export declare const AdminLoginForm: React.FC<AdminLoginFormProps>;
