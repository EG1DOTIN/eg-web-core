import { default as React } from 'react';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    children?: React.ReactNode;
}
/**
 * Universal interactive button primitive supporting variants, sizes, and leading icons.
 *
 * @param props - ButtonProps configuration
 * @returns Accessible HTML button element
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={() => alert('Clicked')}>
 *   Download Now
 * </Button>
 * ```
 */
export declare const Button: React.FC<ButtonProps>;
