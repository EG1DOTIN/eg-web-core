import React, { useState, useEffect } from 'react';
import { CONSENT_STORAGE_KEY, SESSION_STORAGE_KEY } from '../../services/visitorTracker';
import { sanitizeUrl } from '../../services/sanitizer';

export interface ConsentBannerProps {
  /** Target Privacy Policy link URL (default: 'privacypolicy.html') */
  privacyPolicyUrl?: string;
  /** Custom storage key for consent persistence (default: 'eg_analytics_consent') */
  storageKey?: string;
  /** Informational message text or component (default: 'We collect anonymous telemetry to optimize tools & apps performance.') */
  message?: React.ReactNode;
  /** Privacy policy link label (default: 'Privacy Policy') */
  privacyPolicyLabel?: string;
  /** Text for accept button (default: 'OK') */
  acceptLabel?: string;
  /** Text for decline button (default: 'Decline') */
  declineLabel?: string;
  /** Callback fired upon user selection */
  onConsentChange?: (consent: 'granted' | 'denied') => void;
}

/**
 * Floating GDPR/privacy-compliant consent banner for anonymous analytics collection.
 * Includes acceptance and decline options with local storage persistence and full customization.
 *
 * @example
 * ```tsx
 * <ConsentBanner
 *   privacyPolicyUrl="/privacy"
 *   onConsentChange={(choice) => console.log('User consent:', choice)}
 * />
 * ```
 */
export const ConsentBanner: React.FC<ConsentBannerProps> = ({
  privacyPolicyUrl = 'privacypolicy.html',
  storageKey,
  message = 'We collect anonymous telemetry to optimize tools & apps performance.',
  privacyPolicyLabel = 'Privacy Policy',
  acceptLabel = 'OK',
  declineLabel = 'Decline',
  onConsentChange,
}) => {
  const [visible, setVisible] = useState(false);
  const activeStorageKey = storageKey || CONSENT_STORAGE_KEY;

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(activeStorageKey) ||
        localStorage.getItem(CONSENT_STORAGE_KEY) ||
        localStorage.getItem('analytics_consent');
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // Storage unavailable
    }

    const handleReopen = () => {
      setVisible(true);
    };

    const handleExternalChange = (e: Event) => {
      const customEvent = e as CustomEvent<'granted' | 'denied'>;
      if (customEvent.detail === 'granted' || customEvent.detail === 'denied') {
        setVisible(false);
      }
    };

    window.addEventListener('show_consent_banner', handleReopen);
    window.addEventListener('analytics_consent_changed', handleExternalChange as EventListener);

    // Global helper for programmatic interaction
    if (typeof window !== 'undefined') {
      const trackerApi = {
        showConsentBanner: () => {
          window.dispatchEvent(new CustomEvent('show_consent_banner'));
        },
        grantConsent: () => handleConsent('granted'),
        denyConsent: () => handleConsent('denied'),
      };
      (window as any).AnalyticsTracker = trackerApi;
    }

    return () => {
      window.removeEventListener('show_consent_banner', handleReopen);
      window.removeEventListener('analytics_consent_changed', handleExternalChange as EventListener);
    };
  }, [activeStorageKey]);

  const handleConsent = (consent: 'granted' | 'denied') => {
    try {
      localStorage.setItem(activeStorageKey, consent);
      if (activeStorageKey !== CONSENT_STORAGE_KEY) {
        localStorage.setItem(CONSENT_STORAGE_KEY, consent);
      }
      localStorage.setItem('analytics_consent', consent);

      if (consent === 'denied') {
        localStorage.setItem('analytics_optout', 'true');
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } else {
        localStorage.removeItem('analytics_optout');
      }
    } catch {
      // Storage unavailable
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent('analytics_consent_changed', { detail: consent }));
    window.dispatchEvent(new CustomEvent('eg_consent_changed', { detail: consent }));
    if (onConsentChange) onConsentChange(consent);
  };

  if (!visible) return null;

  return (
    <aside
      id="analytics-consent-banner"
      aria-label="Privacy and Cookie Consent"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '680px',
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#f8fafc',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
        padding: '14px 20px',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        fontSize: '13.5px',
        lineHeight: 1.5,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: '1 1 240px', minWidth: 0 }}>
        <span>{message}</span>{' '}
        {privacyPolicyUrl && (
          <a
            href={sanitizeUrl(privacyPolicyUrl)}
            style={{
              color: '#60a5fa',
              textDecoration: 'underline',
              marginLeft: '6px',
              fontWeight: 500,
            }}
          >
            {privacyPolicyLabel}
          </a>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => handleConsent('denied')}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            padding: '7px 15px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.color = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          {declineLabel}
        </button>
        <button
          type="button"
          onClick={() => handleConsent('granted')}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '7px 18px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2563eb';
          }}
        >
          {acceptLabel}
        </button>
      </div>
    </aside>
  );
};
