import React, { useState, useEffect, useCallback } from 'react';
import { CONSENT_STORAGE_KEY, SESSION_STORAGE_KEY } from '../../services/visitorTracker';

export interface ConsentControlProps {
  /** Primary localStorage key for consent persistence ('granted' | 'denied') */
  storageKey?: string;
  /** Optional legacy keys to sync for backwards compatibility */
  legacyKeys?: string[];
  /** Session storage key to clear on opt-out */
  sessionStorageKey?: string;
  /** Title for the preferences card */
  title?: string;
  /** Custom descriptive subtitle or context */
  description?: string;
  /** Whether to show the 1-click toggle switch */
  showToggle?: boolean;
  /** Whether to show the button to reopen the floating consent banner */
  showReopenBannerBtn?: boolean;
  /** Whether to show the button to clear and reset choices */
  showResetBtn?: boolean;
  /** Callback fired whenever consent choice is toggled */
  onConsentChange?: (consent: 'granted' | 'denied') => void;
  /** Optional custom CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Universal interactive GDPR / CCPA 1-Click Opt-Out Switch and Consent Control Card.
 * Allows users to toggle telemetry on/off, view real-time tracking status, and reopen banners.
 *
 * @example
 * ```tsx
 * <ConsentControl
 *   title="Telemetry Preferences"
 *   onConsentChange={(choice) => console.log('Telemetry is now:', choice)}
 * />
 * ```
 */
export const ConsentControl: React.FC<ConsentControlProps> = ({
  storageKey = CONSENT_STORAGE_KEY,
  legacyKeys = [],
  sessionStorageKey = SESSION_STORAGE_KEY,
  title = 'Analytics & Telemetry Preferences',
  description,
  showToggle = true,
  showReopenBannerBtn = true,
  showResetBtn = true,
  onConsentChange,
  className = '',
  style = {},
}) => {
  const [consent, setConsent] = useState<'granted' | 'denied' | 'pending'>('pending');

  const readCurrentConsent = useCallback((): 'granted' | 'denied' | 'pending' => {
    try {
      const primary = localStorage.getItem(storageKey);
      if (primary === 'granted' || primary === 'denied') return primary;

      if (legacyKeys && legacyKeys.length > 0) {
        for (const key of legacyKeys) {
          const val = localStorage.getItem(key);
          if (val === 'denied' || val === 'true') return 'denied';
          if (val === 'granted') return 'granted';
        }
      }
    } catch {
      // Ignore
    }
    return 'pending';
  }, [storageKey, legacyKeys]);

  useEffect(() => {
    setConsent(readCurrentConsent());

    const handleExternalChange = (e: Event) => {
      const customEvent = e as CustomEvent<'granted' | 'denied'>;
      if (customEvent.detail === 'granted' || customEvent.detail === 'denied') {
        setConsent(customEvent.detail);
      } else {
        setConsent(readCurrentConsent());
      }
    };

    window.addEventListener('analytics_consent_changed', handleExternalChange as EventListener);
    window.addEventListener('storage', handleExternalChange);

    return () => {
      window.removeEventListener('analytics_consent_changed', handleExternalChange as EventListener);
      window.removeEventListener('storage', handleExternalChange);
    };
  }, [readCurrentConsent]);

  const updateConsent = (next: 'granted' | 'denied') => {
    try {
      localStorage.setItem(storageKey, next);
      localStorage.setItem('analytics_consent', next);
      if (legacyKeys && legacyKeys.length > 0) {
        for (const k of legacyKeys) {
          localStorage.setItem(k, next);
        }
      }
      if (next === 'denied') {
        localStorage.setItem('analytics_optout', 'true');
      } else {
        localStorage.removeItem('analytics_optout');
      }

      if (next === 'denied' && sessionStorageKey) {
        sessionStorage.removeItem(sessionStorageKey);
      }
    } catch {
      // Ignore
    }

    setConsent(next);
    window.dispatchEvent(new CustomEvent('analytics_consent_changed', { detail: next }));
    window.dispatchEvent(new CustomEvent('eg_consent_changed', { detail: next }));
    if (onConsentChange) onConsentChange(next);
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem('analytics_consent');
      localStorage.removeItem('analytics_optout');
      legacyKeys.forEach((key) => localStorage.removeItem(key));
      if (sessionStorageKey) sessionStorage.removeItem(sessionStorageKey);
    } catch {
      // Ignore
    }
    setConsent('pending');
    window.dispatchEvent(new CustomEvent('show_consent_banner'));
    window.dispatchEvent(new CustomEvent('eg_show_consent_banner'));
  };

  const handleReopenBanner = () => {
    window.dispatchEvent(new CustomEvent('show_consent_banner'));
    window.dispatchEvent(new CustomEvent('eg_show_consent_banner'));
  };

  const isEnabled = consent === 'granted';

  return (
    <div
      className={`eg-consent-control-card ${className}`}
      style={{
        background: 'var(--eg-bg-surface-elevated, var(--eg-bg-surface, #ffffff))',
        border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))',
        borderRadius: 'var(--eg-radius-lg, 12px)',
        padding: '24px',
        margin: '28px 0',
        boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        color: 'var(--eg-text-primary, #0f172a)',
        ...style,
      }}
    >
      {/* Header & Status Indicator */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
            {title}
          </h3>
          {description && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '13.5px',
                color: 'var(--eg-text-muted, #64748b)',
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Live Status Badge */}
        <div
          role="status"
          aria-live="polite"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '12.5px',
            fontWeight: 700,
            letterSpacing: '0.2px',
            background:
              consent === 'granted'
                ? 'rgba(16, 185, 129, 0.12)'
                : consent === 'denied'
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(148, 163, 184, 0.15)',
            color:
              consent === 'granted'
                ? '#10b981'
                : consent === 'denied'
                ? '#ef4444'
                : 'var(--eg-text-muted, #64748b)',
            border: `1px solid ${
              consent === 'granted'
                ? 'rgba(16, 185, 129, 0.35)'
                : consent === 'denied'
                ? 'rgba(239, 68, 68, 0.35)'
                : 'rgba(148, 163, 184, 0.3)'
            }`,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'currentColor',
              display: 'inline-block',
            }}
          />
          {consent === 'granted'
            ? 'Tracking Active (Anonymous)'
            : consent === 'denied'
            ? 'Tracking Disabled (Opted Out)'
            : 'Consent Notice Pending'}
        </div>
      </div>

      {/* Explanatory Message */}
      <p
        style={{
          fontSize: '13.5px',
          lineHeight: 1.65,
          color: 'var(--eg-text-secondary, #334155)',
          margin: '0 0 20px',
        }}
      >
        {consent === 'granted' ? (
          <>
            <strong>Telemetry is currently active:</strong> Non-invasive, anonymous performance metrics
            (operating system, browser family, approximate location) are collected via our 50-record
            Batched Bucket Pattern to maintain service performance. No personal identification, message
            content, or precise GPS coordinates are ever recorded.
          </>
        ) : consent === 'denied' ? (
          <>
            <strong>Telemetry is completely blocked:</strong> You have opted out of all usage telemetry.
            An opt-out flag is preserved in your browser&apos;s local storage, preventing any diagnostic
            tracking on this and future visits.
          </>
        ) : (
          <>
            <strong>Default consent state:</strong> No preference has been recorded yet. The floating consent
            notice will be displayed until you choose to accept or decline.
          </>
        )}
      </p>

      {/* 1-Click Interactive Switch & Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
        }}
      >
        {showToggle && (
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {/* Visual Toggle Pill */}
            <div
              style={{
                position: 'relative',
                width: '46px',
                height: '24px',
                borderRadius: '12px',
                background: isEnabled ? '#10b981' : 'var(--eg-bg-toggle-off, #cbd5e1)',
                transition: 'background 0.2s ease',
              }}
            >
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => updateConsent(e.target.checked ? 'granted' : 'denied')}
                aria-label="Toggle anonymous performance telemetry"
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  margin: 0,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: isEnabled ? '24px' : '3px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                  transition: 'left 0.2s ease',
                }}
              />
            </div>
            <span>{isEnabled ? 'Allow Anonymous Telemetry (Enabled)' : 'Opt Out of Telemetry (Disabled)'}</span>
          </label>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {showReopenBannerBtn && (
            <button
              type="button"
              id="btnReopenConsent"
              onClick={handleReopenBanner}
              style={{
                background: 'rgba(0, 0, 0, 0.05)',
                border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))',
                color: 'var(--eg-text-primary, #0f172a)',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.05)';
              }}
            >
              Show Floating Banner
            </button>
          )}

          {showResetBtn && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px dashed var(--eg-border-default, rgba(0, 0, 0, 0.2))',
                color: 'var(--eg-text-muted, #64748b)',
                padding: '7px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--eg-color-danger, #ef4444)';
                e.currentTarget.style.borderColor = 'var(--eg-color-danger, #ef4444)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--eg-text-muted, #64748b)';
                e.currentTarget.style.borderColor = 'var(--eg-border-default, rgba(0, 0, 0, 0.2))';
              }}
            >
              Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
