import React, { useState } from 'react';
import { useTheme } from '../../theme';

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
export const Logo: React.FC<LogoProps> = ({
  mainText = 'BRAND',
  textColor: customTextColor,
  domainText = '',
  hoverRevealDomain = true,
  domainColor: customDomainColor,
  domainHoverColor: customDomainHoverColor,
  bylineText = '',
  showByline = Boolean(bylineText),
  hoverRevealByline = true,
  bylineColor: customBylineColor,
  bylineHoverColor: customBylineHoverColor,
  badgeBg: customBadgeBg,
  badgeHoverBg: customBadgeHoverBg,
  ringBorder: customRingBorder,
  ringHoverBorder: customRingHoverBorder,
  icon,
  fontFamily = 'inherit',
  fontSize: customFontSize,
  size = 80,
  shape = 'circle',
  innerRing = shape === 'circle',
  ringOnHoverOnly = false,
  theme = 'auto',
  dataInfo,
  onClick,
  className = '',
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isDark: activeIsDark } = useTheme();

  const isDark =
    theme === 'dark'
      ? true
      : theme === 'light'
      ? false
      : activeIsDark;

  // Proportional font and offset calculations
  const scriptFontSize = customFontSize || Math.round(size * 0.38);
  const domainFontSize = Math.round(size * 0.135);
  const bylineFontSize = Math.max(7, Math.round(size * 0.075));
  const innerRingOffset = Math.max(3, Math.round(size * 0.045));

  // Determine whether the outer shape / inner ring should be visually active
  const isRingVisible = ringOnHoverOnly ? isHovered : true;

  // Outer badge background (neutral generic defaults or custom overrides)
  const defaultBadgeBg =
    shape === 'none' || (ringOnHoverOnly && !isHovered)
      ? 'transparent'
      : isDark
      ? isHovered
        ? 'var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.08))'
        : 'var(--eg-bg-surface, rgba(255, 255, 255, 0.04))'
      : isHovered
      ? 'var(--eg-bg-surface-hover, rgba(0, 0, 0, 0.04))'
      : 'var(--eg-bg-surface, rgba(0, 0, 0, 0.02))';

  const badgeBg =
    shape === 'none' || (ringOnHoverOnly && !isHovered)
      ? 'transparent'
      : isHovered
      ? (customBadgeHoverBg || customBadgeBg || defaultBadgeBg)
      : (customBadgeBg || defaultBadgeBg);

  // Inner ring border color (neutral generic defaults or custom overrides)
  const defaultRingBorder =
    ringOnHoverOnly && !isHovered
      ? 'transparent'
      : isDark
      ? isHovered
        ? 'var(--eg-border-hover, rgba(255, 255, 255, 0.35))'
        : 'var(--eg-border-default, rgba(255, 255, 255, 0.15))'
      : isHovered
      ? 'var(--eg-border-hover, rgba(0, 0, 0, 0.25))'
      : 'var(--eg-border-default, rgba(0, 0, 0, 0.12))';

  const ringBorder =
    ringOnHoverOnly && !isHovered
      ? 'transparent'
      : isHovered
      ? (customRingHoverBorder || customRingBorder || defaultRingBorder)
      : (customRingBorder || defaultRingBorder);

  // Main text color
  const textColor = customTextColor || (isDark ? '#ffffff' : 'var(--eg-text-primary, #0f172a)');

  // Domain text color (generic neutral defaults or project-specific overrides)
  const defaultDomainColor = isDark
    ? hoverRevealDomain
      ? isHovered
        ? 'var(--eg-text-primary, #ffffff)'
        : 'var(--eg-text-secondary, rgba(255, 255, 255, 0.45))'
      : 'var(--eg-text-primary, #ffffff)'
    : hoverRevealDomain
    ? isHovered
      ? 'var(--eg-text-primary, #0f172a)'
      : 'var(--eg-text-secondary, rgba(0, 0, 0, 0.45))'
    : 'var(--eg-text-primary, #0f172a)';

  const domainColor = isHovered
    ? (customDomainHoverColor || customDomainColor || defaultDomainColor)
    : (customDomainColor || defaultDomainColor);

  // Micro-byline text color (generic neutral defaults or project-specific overrides)
  const defaultBylineColor = isDark
    ? hoverRevealByline
      ? isHovered
        ? 'var(--eg-text-secondary, rgba(255, 255, 255, 0.6))'
        : 'var(--eg-text-muted, rgba(255, 255, 255, 0.25))'
      : 'var(--eg-text-secondary, rgba(255, 255, 255, 0.6))'
    : hoverRevealByline
    ? isHovered
      ? 'var(--eg-text-secondary, rgba(0, 0, 0, 0.6))'
      : 'var(--eg-text-muted, rgba(0, 0, 0, 0.25))'
    : 'var(--eg-text-secondary, rgba(0, 0, 0, 0.6))';

  const bylineColor = isHovered
    ? (customBylineHoverColor || customBylineColor || defaultBylineColor)
    : (customBylineColor || defaultBylineColor);

  const borderRadius =
    shape === 'circle'
      ? '50%'
      : shape === 'rounded'
      ? `${Math.max(6, Math.round(size * 0.18))}px`
      : shape === 'square'
      ? '4px'
      : '0';

  return (
    <div
      className={`eg-logo-badge ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius,
        background: badgeBg,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        boxShadow:
          shape !== 'none' && isRingVisible
            ? isDark
              ? '0 2px 10px rgba(0, 0, 0, 0.25)'
              : '0 2px 8px rgba(0, 0, 0, 0.04)'
            : 'none',
        transition: 'background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'visible', // Prevents cursive clipping
        boxSizing: 'border-box',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Concentric inner outline ring */}
      {innerRing && shape !== 'none' && (
        <div
          style={{
            position: 'absolute',
            top: `${innerRingOffset}px`,
            left: `${innerRingOffset}px`,
            right: `${innerRingOffset}px`,
            bottom: `${innerRingOffset}px`,
            border: `1.5px solid ${ringBorder}`,
            borderRadius,
            pointerEvents: 'none',
            opacity: isRingVisible ? 1 : 0,
            transition: 'opacity 0.25s ease, border-color 0.25s ease',
          }}
        />
      )}

      {/* Main Content & Domain */}
      <div
        className="eg-logo-content"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          marginTop: showByline ? `${-Math.round(size * 0.04)}px` : '0',
          zIndex: 2,
          overflow: 'visible',
          maxWidth: '100%',
          padding: '0 4px',
        }}
      >
        {icon && <span style={{ marginRight: mainText ? '6px' : '0' }}>{icon}</span>}
        {mainText && (
          <span
            className="eg-logo-main-text"
            style={{
              fontFamily,
              color: textColor,
              fontSize: `${scriptFontSize}px`,
              lineHeight: 1.15,
              fontWeight: fontFamily.includes('cursive') || fontFamily.includes('Vibes') ? 300 : 700,
              whiteSpace: 'nowrap',
              letterSpacing: '-0.5px',
              padding: '0 2px',
              WebkitFontSmoothing: 'antialiased',
              textShadow: isDark && isHovered ? '0 0 10px rgba(255, 255, 255, 0.2)' : 'none',
              transition: 'color 0.25s ease',
            }}
          >
            {mainText}
          </span>
        )}
        {domainText && (
          <span
            className="eg-logo-domain-text"
            style={{
              fontFamily: 'var(--eg-font-sans, "Plus Jakarta Sans", sans-serif)',
              fontSize: `${domainFontSize}px`,
              fontWeight: 500,
              color: domainColor,
              marginLeft: '2.5px',
              position: 'relative',
              top: `${-Math.round(size * 0.03)}px`,
              lineHeight: 1,
              transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {domainText}
          </span>
        )}
      </div>

      {/* Micro-byline */}
      {showByline && bylineText && (
        <span
          className="eg-logo-byline"
          data-info={dataInfo}
          style={{
            position: 'absolute',
            bottom: `${Math.round(size * 0.10)}px`,
            fontFamily: 'var(--eg-font-sans, "Plus Jakarta Sans", sans-serif)',
            fontSize: `${bylineFontSize}px`,
            fontStyle: 'italic',
            fontWeight: 300,
            color: bylineColor,
            letterSpacing: '0.3px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 2,
            transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {bylineText}
        </span>
      )}
    </div>
  );
};
