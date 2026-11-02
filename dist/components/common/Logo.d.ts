import { default as React } from 'react';
export interface LogoProps {
    /** Main badge or brand text (default: 'BRAND') */
    mainText?: string;
    /** Primary text color override (defaults to theme primary text) */
    textColor?: string;
    /** Secondary suffix or domain text (e.g. '.in', '.io', 'Pro') */
    domainText?: string;
    /** Whether domain text starts dim and clarifies on mouse hover (default: true) */
    hoverRevealDomain?: boolean;
    /** Custom domain text color when resting (or dim) */
    domainColor?: string;
    /** Custom domain text color when hovered */
    domainHoverColor?: string;
    /** Bottom micro-byline or subtitle text */
    bylineText?: string;
    /** Whether to show the bottom micro-byline (default: false or true if bylineText is provided) */
    showByline?: boolean;
    /** Whether the byline subtly illuminates on hover (default: true) */
    hoverRevealByline?: boolean;
    /** Custom byline color when resting */
    bylineColor?: string;
    /** Custom byline color when hovered */
    bylineHoverColor?: string;
    /** Outer badge background override when resting */
    badgeBg?: string;
    /** Outer badge background override when hovered */
    badgeHoverBg?: string;
    /** Inner ring border color override when resting */
    ringBorder?: string;
    /** Inner ring border color override when hovered */
    ringHoverBorder?: string;
    /** Optional custom icon node to display inside the badge */
    icon?: React.ReactNode;
    /** Custom CSS font-family for mainText (default: inherit / system) */
    fontFamily?: string;
    /** Explicit font size for mainText in pixels (default: proportional) */
    fontSize?: number;
    /** Diameter or size in pixels (default: 80) */
    size?: number;
    /** Badge outline shape (default: 'circle') */
    shape?: 'circle' | 'square' | 'rounded' | 'none';
    /** Whether to render an inner concentric outline ring (default: true for circular badges) */
    innerRing?: boolean;
    /** Whether the surrounding circle, inner ring, and background only appear on hover (default: false) */
    ringOnHoverOnly?: boolean;
    /** Explicit theme styling or 'auto' to synchronize with current theme */
    theme?: 'light' | 'dark' | 'auto';
    /** Optional verification data attribute */
    dataInfo?: string;
    /** Optional click handler */
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Generic, website-agnostic brand/logo badge component for eg-web-core.
 * Completely configurable with neutral defaults and zero hardcoded site-specific branding.
 * Specific website projects (such as EG1) customize and wrap this component in their own project sources.
 *
 * @example
 * ```tsx
 * // Neutral generic badge
 * <Logo mainText="APP" size={64} />
 *
 * // Custom branded badge
 * <Logo
 *   mainText="PORTAL"
 *   domainText=".io"
 *   shape="circle"
 *   domainColor="rgba(0,0,0,0.4)"
 *   domainHoverColor="rgba(0,0,0,0.9)"
 * />
 * ```
 */
export declare const Logo: React.FC<LogoProps>;
