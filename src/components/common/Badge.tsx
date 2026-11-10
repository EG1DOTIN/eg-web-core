import React from 'react';
import './Badge.css';

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
 * @param props - BadgeProps configuration
 * @returns Stylized status pill badge element
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
  return (
    <span
      className={`eg-badge eg-badge--${variant} eg-badge--${size} eg-badge-${variant} eg-badge-${size} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};
