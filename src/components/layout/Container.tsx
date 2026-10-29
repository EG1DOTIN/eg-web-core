import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  narrow?: boolean;
  wide?: boolean;
  fluid?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Standard responsive layout container enforcing consistent max-widths and horizontal padding.
 * Supports standard (`min(1536px, 94%)`), wide (`min(1680px, 96%)`), narrow (`880px`), or fluid (`100%`) layouts.
 *
 * @example
 * ```tsx
 * <Container wide={true}>
 *   <h1>Widescreen Application Content</h1>
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  narrow = false,
  wide = false,
  fluid = false,
  className = '',
  style,
}) => {
  const computedMaxWidth = fluid
    ? '100%'
    : wide
    ? 'var(--eg-container-wide, min(1680px, 96%))'
    : narrow
    ? 'var(--eg-container-narrow, 880px)'
    : 'var(--eg-container-max, min(1536px, 94%))';

  return (
    <div
      className={`eg-container ${className}`}
      style={{
        maxWidth: computedMaxWidth,
        margin: '0 auto',
        padding: '0 clamp(16px, 2.5vw, 32px)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  padded?: boolean;
}

/**
 * Standard semantic section wrapper with default vertical padding.
 *
 * @example
 * ```tsx
 * <Section id="products" padded={true}>
 *   <ProductGrid />
 * </Section>
 * ```
 */
export const Section: React.FC<SectionProps> = ({
  children,
  id,
  className = '',
  style,
  padded = true,
}) => {
  return (
    <section
      id={id}
      className={`eg-section ${className}`}
      style={{
        padding: padded ? '40px 0' : '0',
        ...style,
      }}
    >
      {children}
    </section>
  );
};

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Consistent page hero header with title, subtitle, and optional pill badge.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Software Applications"
 *   subtitle="Free, privacy-focused open source desktop suites and utilities."
 *   badge="Open Source"
 * />
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  className = '',
  style,
}) => {
  return (
    <div
      className={`eg-page-header ${className}`}
      style={{
        margin: '28px 0 36px',
        textAlign: 'center',
        ...style,
      }}
    >
      {badge && (
        <span
          style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--eg-color-primary, #10b981)',
            marginBottom: '10px',
          }}
        >
          {badge}
        </span>
      )}
      <h1
        style={{
          fontSize: 'var(--eg-text-3xl, 2rem)',
          fontWeight: 800,
          color: 'var(--eg-text-primary, #0f172a)',
          margin: '0 0 10px',
          letterSpacing: '-0.5px',
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 'var(--eg-text-base, 1rem)',
            color: 'var(--eg-text-secondary, #64748b)',
            maxWidth: '760px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
