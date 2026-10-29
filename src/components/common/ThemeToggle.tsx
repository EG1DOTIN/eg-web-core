import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

export interface ThemeToggleProps {
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  mode?: 'toggle' | 'cycle' | 'auto';
}

/**
 * Animated theme switcher button supporting binary toggle (light / dark) or cycling across theme presets.
 *
 * @example
 * ```tsx
 * <ThemeToggle size="md" mode="toggle" />
 * ```
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  id = 'themeToggleBtn',
  className = '',
  size = 'md',
  showLabel = false,
  mode = 'auto',
}) => {
  const { theme, toggleTheme, cycleTheme, isDark, allowedThemes } = useTheme();

  const isBinaryToggle = mode === 'toggle' || (mode === 'auto' && allowedThemes && allowedThemes.length <= 2);
  const handleClick = isBinaryToggle ? toggleTheme : cycleTheme;

  const pxSize = size === 'sm' ? 18 : size === 'lg' ? 24 : 20;
  const padding = size === 'sm' ? '6px' : size === 'lg' ? '10px' : '8px';

  return (
    <button
      type="button"
      id={id}
      onClick={handleClick}
      className={`eg-theme-toggle ${className}`}
      title={isBinaryToggle ? (isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme') : `Current theme: ${theme}. Click to switch theme.`}
      aria-label={isBinaryToggle ? (isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme') : `Current theme: ${theme}. Click to cycle themes.`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding,
        background: 'transparent',
        border: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))',
        borderRadius: 'var(--eg-radius-md, 8px)',
        color: 'var(--eg-text-primary, inherit)',
        cursor: 'pointer',
        transition: 'all var(--eg-transition-fast, 150ms)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--eg-border-hover, #10b981)';
        e.currentTarget.style.backgroundColor = 'var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.05))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--eg-border-subtle, rgba(255, 255, 255, 0.12))';
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {theme === 'crystal' ? (
        // Crystal / Gem SVG
        <svg
          width={pxSize}
          height={pxSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#a855f7' }}
        >
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M11 3v18" />
          <path d="M2 9h20" />
        </svg>
      ) : isDark ? (
        // Moon SVG
        <svg
          width={pxSize}
          height={pxSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#38bdf8' }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun SVG
        <svg
          width={pxSize}
          height={pxSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: '#f59e0b' }}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
      {showLabel && (
        <span style={{ fontSize: '13px', textTransform: 'capitalize', fontWeight: 500 }}>
          {theme}
        </span>
      )}
    </button>
  );
};
