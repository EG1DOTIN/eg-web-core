import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Universal interactive button primitive supporting variants, sizes, and leading icons.
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
  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12.5px', borderRadius: '6px' },
    md: { padding: '9px 18px', fontSize: '14px', borderRadius: '8px' },
    lg: { padding: '12px 24px', fontSize: '15.5px', borderRadius: '10px' },
  }[size];

  const variantStyles = {
    primary: {
      background: 'var(--eg-color-primary, #10b981)',
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      background: 'var(--eg-bg-surface-elevated, #1a2742)',
      color: 'var(--eg-text-primary, #f8fafc)',
      border: '1px solid var(--eg-border-default, rgba(255, 255, 255, 0.15))',
    },
    outline: {
      background: 'transparent',
      color: 'var(--eg-color-primary, #10b981)',
      border: '1px solid var(--eg-color-primary, #10b981)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--eg-text-primary, inherit)',
      border: 'none',
    },
    danger: {
      background: '#ef4444',
      color: '#ffffff',
      border: 'none',
    },
  }[variant];

  return (
    <button
      type="button"
      className={`eg-button eg-button-${variant} ${className}`}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all var(--eg-transition-fast, 150ms)',
        ...sizeStyles,
        ...variantStyles,
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </button>
  );
};
