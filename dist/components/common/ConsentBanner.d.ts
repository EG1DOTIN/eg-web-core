import { default as React } from 'react';
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
export declare const ConsentBanner: React.FC<ConsentBannerProps>;
