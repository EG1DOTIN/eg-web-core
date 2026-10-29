import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Compact status and category badge with semantic color variants.
 *
 * @example
 * ```tsx
 * <Badge variant="success" size="sm">Active</Badge>
 * <Badge variant="warning">Beta</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  style,
}) => {
  const variantStyles = {
    primary: {
      background: 'rgba(16, 185, 129, 0.14)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.25)',
    },
    success: {
      background: 'rgba(0, 220, 130, 0.14)',
      color: '#00dc82',
      border: '1px solid rgba(0, 220, 130, 0.25)',
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.14)',
      color: '#f59e0b',
      border: '1px solid rgba(245, 158, 11, 0.25)',
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.14)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.25)',
    },
    info: {
      background: 'rgba(56, 189, 248, 0.14)',
      color: '#38bdf8',
      border: '1px solid rgba(56, 189, 248, 0.25)',
    },
    neutral: {
      background: 'var(--eg-bg-subtle, rgba(255, 255, 255, 0.08))',
      color: 'var(--eg-text-secondary, #cbd5e1)',
      border: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))',
    },
  }[variant];

  const sizeStyles = size === 'sm'
    ? { padding: '2px 6px', fontSize: '11px', borderRadius: '4px' }
    : { padding: '3px 10px', fontSize: '12px', borderRadius: '6px' };

  return (
    <span
      className={`eg-badge eg-badge-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 600,
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        lineHeight: 1.2,
        ...sizeStyles,
        ...variantStyles,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
