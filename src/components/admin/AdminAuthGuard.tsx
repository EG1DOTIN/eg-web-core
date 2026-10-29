/**
 * @file AdminAuthGuard.tsx
 * @description Route guard component that protects administrative suites.
 * Enforces two-tier authentication (Google Sign-In + 16-digit PIN).
 * Renders the AdminLoginForm whenever credentials are missing or unverified.
 */

import React from 'react';
import { AdminAuthConfig, AdminPinConfig, AdminUser } from '../../services/adminAuthService';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { AdminLoginForm, AdminLoginFormProps } from './AdminLoginForm';

export interface AdminAuthGuardProps {
  /** The protected content to render upon successful authentication */
  children: React.ReactNode | ((auth: { user: AdminUser; logout: () => Promise<void> }) => React.ReactNode);
  /** Configuration for Google whitelist, PIN salt, and collections */
  authConfig?: AdminAuthConfig;
  /** PIN verification parameters */
  pinConfig?: AdminPinConfig;
  /** Props forwarded to the default login form */
  loginProps?: Partial<AdminLoginFormProps>;
  /** Custom fallback element to render while verifying session */
  loadingFallback?: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  authConfig,
  pinConfig,
  loginProps,
  loadingFallback,
}) => {
  const mergedConfig: AdminAuthConfig = {
    ...authConfig,
    ...(pinConfig?.salt ? { pinSalt: pinConfig.salt } : {}),
  };

  const { user, isAuthenticated, isLoading, logout } = useAdminAuth(mergedConfig);

  // 1. Loading state
  if (isLoading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>;
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 'var(--eg-space-4, 16px)',
          color: 'var(--eg-text-muted, #9ca3af)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: 'var(--eg-color-primary, #10b981)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: 'var(--eg-text-sm, 0.875rem)', fontWeight: 500 }}>
          Verifying administrative authorization...
        </span>
      </div>
    );
  }

  // 2. Unauthenticated / PIN Unverified -> Render Login Form
  if (!isAuthenticated || !user) {
    return (
      <AdminLoginForm
        authConfig={mergedConfig}
        pinConfig={pinConfig}
        {...loginProps}
      />
    );
  }

  // 3. Authenticated -> Render protected content
  if (typeof children === 'function') {
    return <>{children({ user, logout })}</>;
  }

  return <>{children}</>;
};
