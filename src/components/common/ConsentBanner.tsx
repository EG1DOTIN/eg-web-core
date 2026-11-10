import React, { useState, useEffect } from 'react';
import { CONSENT_STORAGE_KEY, SESSION_STORAGE_KEY } from '../../services/visitorTracker';
import { sanitizeUrl } from '../../services/sanitizer';
import './ConsentBanner.css';

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
  privacyPolicyUrl = 'privacypolicy',
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
      className="eg-consent-banner"
    >
      <div className="eg-consent-banner__content">
        <span>{message}</span>{' '}
        {privacyPolicyUrl && (
          <a
            href={sanitizeUrl(privacyPolicyUrl)}
            className="eg-consent-banner__link"
          >
            {privacyPolicyLabel}
          </a>
        )}
      </div>
      <div className="eg-consent-banner__actions">
        <button
          type="button"
          onClick={() => handleConsent('denied')}
          className="eg-consent-banner__btn-decline"
        >
          {declineLabel}
        </button>
        <button
          type="button"
          onClick={() => handleConsent('granted')}
          className="eg-consent-banner__btn-accept"
        >
          {acceptLabel}
        </button>
      </div>
    </aside>
  );
};
