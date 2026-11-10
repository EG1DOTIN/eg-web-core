import React from 'react';
import './Button.css';

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
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  style,
  disabled,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`eg-button eg-button--${variant} eg-button--${size} eg-button-${variant} eg-button-${size} ${className}`}
      disabled={disabled}
      style={style}
      {...props}
    >
      {icon && <span className="eg-button__icon" style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  );
};
