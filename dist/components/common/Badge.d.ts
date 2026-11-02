import { default as React } from 'react';
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
export declare const Badge: React.FC<BadgeProps>;
