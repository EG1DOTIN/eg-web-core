import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../services/DataCache';
import { sanitizeUrl } from '../../services/sanitizer';
import { useTheme } from '../../theme/ThemeContext';

export interface TotemTickerProps {
  items: NewsItem[];
  intervalMs?: number;
  label?: string;
  theme?: 'auto' | 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Vertical rotating news/announcement ticker with hover-pause and smooth slide transition.
 *
 * @example
 * ```tsx
 * <TotemTicker items={newsItems} intervalMs={4000} label="Updates" theme="dark" />
 * ```
 */
export const TotemTicker: React.FC<TotemTickerProps> = ({
  items,
  intervalMs = 4500,
  label = 'News',
  theme = 'auto',
  className = '',
  style = {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { isDark: globalIsDark } = useTheme();

  useEffect(() => {
    if (!items || items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [items, intervalMs, isPaused]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const isDarkSurface =
    theme === 'dark' ? true : theme === 'light' ? false : globalIsDark;

  const containerBg = isDarkSurface
    ? 'rgba(255, 255, 255, 0.08)'
    : 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))';

  const containerBorder = isDarkSurface
    ? '1px solid rgba(255, 255, 255, 0.15)'
    : '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))';

  const titleColor = isDarkSurface ? '#ffffff' : 'var(--eg-text-primary, #0f172a)';
  const descColor = isDarkSurface ? '#cbd5e1' : 'var(--eg-text-secondary, #475569)';
  const arrowColor = isDarkSurface ? '#94a3b8' : 'var(--eg-text-muted, #94a3b8)';

  return (
    <div
      className={`eg-totem-ticker ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: containerBg,
        border: containerBorder,
        borderRadius: 'var(--eg-radius-md, 8px)',
        fontSize: '13.5px',
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        overflow: 'hidden',
        backdropFilter: isDarkSurface ? 'blur(8px)' : undefined,
        WebkitBackdropFilter: isDarkSurface ? 'blur(8px)' : undefined,
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            background: 'var(--eg-color-primary, #10b981)',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: 'var(--eg-radius-xs, 4px)',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <a
          href={sanitizeUrl(currentItem.link)}
          style={{
            color: titleColor,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: 'block',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--eg-color-primary, #10b981)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = titleColor;
          }}
        >
          <strong>{currentItem.title}</strong>
          {currentItem.description && (
            <span style={{ color: descColor, marginLeft: '8px' }}>
              — {currentItem.description}
            </span>
          )}
        </a>
      </div>

      {items.length > 1 && (
        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
            aria-label="Previous headline"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: arrowColor,
              padding: '2px 4px',
              fontSize: '16px',
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            aria-label="Next headline"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: arrowColor,
              padding: '2px 4px',
              fontSize: '16px',
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};
