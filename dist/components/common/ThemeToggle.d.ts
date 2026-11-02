import { default as React } from 'react';
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
export declare const ThemeToggle: React.FC<ThemeToggleProps>;
