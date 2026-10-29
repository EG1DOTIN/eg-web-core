/**
 * @file AdminLoginForm.tsx
 * @description Two-factor administrative login interface:
 *   Step 1: Google OAuth with whitelist verification.
 *   Step 2: 4x4 segmented 16-digit PIN challenge with auto-focus, paste distribution,
 *           masked/unmasked toggle, and brute-force lockout protection.
 */

import React, { useState, useRef, useEffect } from 'react';
import { AdminAuthConfig, AdminPinConfig, AdminUser } from '../../services/adminAuthService';
import { useAdminAuth } from '../../hooks/useAdminAuth';

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

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  title = 'Admin Portal',
  subtitle = 'Sign in with your authorized administrator credentials',
  logo,
  allowedEmails,
  pinConfig,
  authConfig,
  onSuccess,
  style,
  className = '',
}) => {
  const mergedAuthConfig: AdminAuthConfig = {
    ...authConfig,
    ...(allowedEmails ? { allowedEmails } : {}),
    ...(pinConfig?.salt ? { pinSalt: pinConfig.salt } : {}),
  };

  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    lockout,
    loginWithGoogle,
    verifyPin,
    logout,
    clearError,
  } = useAdminAuth(mergedAuthConfig);

  // Segmented PIN inputs state: 4 groups of 4 digits
  const [segments, setSegments] = useState<[string, string, string, string]>(['', '', '', '']);
  const [showPin, setShowPin] = useState<boolean>(false);
  const [submittingPin, setSubmittingPin] = useState<boolean>(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // If already authenticated, notify parent
  useEffect(() => {
    if (isAuthenticated && user && onSuccess) {
      onSuccess(user);
    }
  }, [isAuthenticated, user, onSuccess]);

  // Focus first PIN input when transitioning to Step 2
  useEffect(() => {
    if (user && !isAuthenticated) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [user, isAuthenticated]);

  const handleSegmentChange = (index: number, val: string) => {
    // Only allow numbers
    const clean = val.replace(/\D/g, '');

    // Handle multi-character paste into one segment
    if (clean.length > 4) {
      handlePasteDirect(clean);
      return;
    }

    const nextSegments = [...segments] as [string, string, string, string];
    nextSegments[index] = clean;
    setSegments(nextSegments);

    // Auto-advance to next input when 4 digits are filled
    if (clean.length === 4 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && segments[index].length === 0 && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePasteDirect = (pastedText: string) => {
    const numericOnly = pastedText.replace(/\D/g, '').slice(0, 16);
    const seg1 = numericOnly.slice(0, 4);
    const seg2 = numericOnly.slice(4, 8);
    const seg3 = numericOnly.slice(8, 12);
    const seg4 = numericOnly.slice(12, 16);

    setSegments([seg1, seg2, seg3, seg4]);

    if (numericOnly.length >= 16) {
      inputRefs[3].current?.focus();
    } else if (numericOnly.length >= 12) {
      inputRefs[3].current?.focus();
    } else if (numericOnly.length >= 8) {
      inputRefs[2].current?.focus();
    } else if (numericOnly.length >= 4) {
      inputRefs[1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    handlePasteDirect(paste);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const fullPin = segments.join('');

    if (fullPin.length !== 16) {
      return;
    }

    setSubmittingPin(true);
    const success = await verifyPin(fullPin, pinConfig);
    setSubmittingPin(false);

    if (success && user && onSuccess) {
      onSuccess(user);
    }
  };

  const fullPinLength = segments.join('').length;

  return (
    <div
      className={`eg-admin-login-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: 'var(--eg-space-4, 16px)',
        ...style,
      }}
    >
      <div
        className="eg-admin-login-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'var(--eg-bg-secondary, #111827)',
          border: '1px solid var(--eg-border, rgba(255,255,255,0.08))',
          borderRadius: 'var(--eg-radius-xl, 20px)',
          padding: 'var(--eg-space-8, 32px)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative gradient glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--eg-color-emerald-glow, rgba(0, 220, 130, 0.15)) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--eg-space-6, 24px)' }}>
          {logo ? (
            <div style={{ display: 'inline-flex', marginBottom: 'var(--eg-space-3, 12px)' }}>
              {logo}
            </div>
          ) : (
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--eg-radius-lg, 14px)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--eg-color-primary, #10b981)',
                marginBottom: 'var(--eg-space-3, 12px)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          )}
          <h1
            style={{
              fontSize: 'var(--eg-text-2xl, 1.5rem)',
              fontWeight: 700,
              color: 'var(--eg-text-primary, #f9fafb)',
              margin: '0 0 var(--eg-space-1, 4px) 0',
              fontFamily: 'var(--eg-font-sans, inherit)',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 'var(--eg-text-sm, 0.875rem)',
              color: 'var(--eg-text-muted, #9ca3af)',
              margin: 0,
            }}
          >
            {user ? 'Enter your 16-digit security PIN' : subtitle}
          </p>
        </div>

        {/* Lockout Banner */}
        {lockout.locked && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--eg-radius-md, 10px)',
              padding: 'var(--eg-space-3, 12px) var(--eg-space-4, 16px)',
              color: '#f87171',
              fontSize: 'var(--eg-text-sm, 0.875rem)',
              marginBottom: 'var(--eg-space-4, 16px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
              Too many failed attempts. Access blocked for <strong>{lockout.hoursRemaining} hour(s)</strong>.
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && !lockout.locked && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--eg-radius-md, 10px)',
              padding: 'var(--eg-space-3, 12px) var(--eg-space-4, 16px)',
              color: '#f87171',
              fontSize: 'var(--eg-text-sm, 0.875rem)',
              marginBottom: 'var(--eg-space-4, 16px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{error}</span>
            <button
              onClick={clearError}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '1rem',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* STEP 1: Google OAuth Sign-In */}
        {!user && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eg-space-4, 16px)' }}>
            <button
              type="button"
              disabled={isLoading || lockout.locked}
              onClick={() => loginWithGoogle()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 20px',
                background: lockout.locked ? 'var(--eg-bg-tertiary, #1f2937)' : '#ffffff',
                color: lockout.locked ? 'var(--eg-text-muted, #9ca3af)' : '#1f2937',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--eg-radius-md, 10px)',
                fontSize: 'var(--eg-text-base, 1rem)',
                fontWeight: 600,
                cursor: lockout.locked || isLoading ? 'not-allowed' : 'pointer',
                transition: 'all var(--eg-transition-normal, 220ms)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                opacity: lockout.locked ? 0.6 : 1,
              }}
            >
              {/* Google Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
                fontSize: 'var(--eg-text-xs, 0.75rem)',
                color: 'var(--eg-text-muted, #9ca3af)',
                marginTop: 'var(--eg-space-2, 8px)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Restricted administrator access. Two-factor challenge required.</span>
            </div>
          </div>
        )}

        {/* STEP 2: 16-Digit PIN Challenge */}
        {user && !isAuthenticated && (
          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eg-space-4, 16px)' }}>
            {/* User Pill with Switch Option */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--eg-bg-tertiary, #1f2937)',
                borderRadius: 'var(--eg-radius-md, 10px)',
                border: '1px solid var(--eg-border, rgba(255,255,255,0.06))',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.email}
                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--eg-color-primary, #10b981)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  style={{
                    fontSize: 'var(--eg-text-xs, 0.8125rem)',
                    color: 'var(--eg-text-primary, #f9fafb)',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    maxWidth: '220px',
                  }}
                >
                  {user.email}
                </span>
              </div>
              <button
                type="button"
                onClick={() => logout()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--eg-color-sky, #38bdf8)',
                  fontSize: 'var(--eg-text-xs, 0.75rem)',
                  cursor: 'pointer',
                  padding: '2px 4px',
                  fontWeight: 500,
                }}
              >
                Switch
              </button>
            </div>

            {/* 4x4 Segmented Input Fields */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--eg-space-2, 8px)',
                }}
              >
                <label
                  style={{
                    fontSize: 'var(--eg-text-xs, 0.75rem)',
                    fontWeight: 600,
                    color: 'var(--eg-text-secondary, #d1d5db)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  16-Digit Master Security PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--eg-text-muted, #9ca3af)',
                    fontSize: 'var(--eg-text-xs, 0.75rem)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {showPin ? 'Hide' : 'Show'}
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                }}
              >
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    ref={inputRefs[idx]}
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={4}
                    value={segments[idx]}
                    onChange={(e) => handleSegmentChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    placeholder="••••"
                    autoComplete="off"
                    style={{
                      width: '100%',
                      height: '48px',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontFamily: 'var(--eg-font-mono, monospace)',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      background: 'var(--eg-bg-primary, #030712)',
                      border: segments[idx].length === 4
                        ? '1px solid var(--eg-color-primary, #10b981)'
                        : '1px solid var(--eg-border, rgba(255,255,255,0.12))',
                      borderRadius: 'var(--eg-radius-md, 10px)',
                      color: 'var(--eg-text-primary, #f9fafb)',
                      outline: 'none',
                      transition: 'border-color var(--eg-transition-fast, 150ms)',
                      boxSizing: 'border-box',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={fullPinLength !== 16 || submittingPin || lockout.locked}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: fullPinLength === 16 && !submittingPin && !lockout.locked
                  ? 'var(--eg-color-primary, #10b981)'
                  : 'var(--eg-bg-tertiary, #1f2937)',
                color: fullPinLength === 16 && !submittingPin && !lockout.locked ? '#ffffff' : 'var(--eg-text-muted, #9ca3af)',
                border: 'none',
                borderRadius: 'var(--eg-radius-md, 10px)',
                fontSize: 'var(--eg-text-base, 1rem)',
                fontWeight: 600,
                cursor: fullPinLength === 16 && !submittingPin && !lockout.locked ? 'pointer' : 'not-allowed',
                transition: 'all var(--eg-transition-normal, 220ms)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {submittingPin ? (
                <>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#ffffff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  <span>Verifying SHA-256 Hash...</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                  <span>Verify & Unlock Portal</span>
                </>
              )}
            </button>

            {/* Brute force warning footnote */}
            <div
              style={{
                textAlign: 'center',
                fontSize: 'var(--eg-text-xs, 0.75rem)',
                color: 'var(--eg-text-muted, #9ca3af)',
              }}
            >
              3 consecutive incorrect attempts trigger a 24-hour IP block.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
