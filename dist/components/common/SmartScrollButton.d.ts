import { default as React } from 'react';
export interface SmartScrollButtonProps {
    /** Visual variant: 'primary' (default emerald/theme), 'accent' (amber gold), or 'neutral' */
    variant?: 'primary' | 'accent' | 'neutral';
    /** Optional preset string for backward compatibility */
    preset?: string;
    /** Button element ID (default: 'backToTopBtn') */
    id?: string;
    /** Explicit scroll distance threshold to switch between down and up */
    threshold?: number;
    /** Custom background color */
    backgroundColor?: string;
    /** Custom hover background color */
    hoverBackgroundColor?: string;
    /** Custom icon color */
    color?: string;
    /** Distance from bottom viewport edge (default: '25px') */
    bottom?: string | number;
    /** Distance from right viewport edge (default: '25px') */
    right?: string | number;
    /** Custom className */
    className?: string;
    /** Additional inline styles */
    style?: React.CSSProperties;
}
/**
 * Smart bidirectional floating scroll assistant (Scroll Down to Bottom / Scroll Up to Top).
 * - When near top: points DOWN and smoothly scrolls to bottom.
 * - When scrolled: points UP and smoothly scrolls back to top.
 * - Automatically hides when the page has negligible scrollable height (<= 80px).
 *
 * @example
 * ```tsx
 * <SmartScrollButton variant="primary" />
 * ```
 */
export declare const SmartScrollButton: React.FC<SmartScrollButtonProps>;
