import { default as React } from 'react';
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
export declare const ConsentControl: React.FC<ConsentControlProps>;
