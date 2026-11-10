import React from 'react';
import './Container.css';

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
 * @param props - ContainerProps configuration
 * @returns Responsive container division
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
  const variantClass = fluid
    ? 'eg-container--fluid'
    : wide
    ? 'eg-container--wide'
    : narrow
    ? 'eg-container--narrow'
    : 'eg-container--default';

  return (
    <div
      className={`eg-container ${variantClass} ${className}`}
      style={style}
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
 * @param props - SectionProps configuration
 * @returns Semantic section element
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
      className={`eg-section ${padded ? 'eg-section--padded' : 'eg-section--unpadded'} ${className}`}
      style={style}
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
 * @param props - PageHeaderProps configuration
 * @returns Page hero title banner
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
      style={style}
    >
      {badge && <span className="eg-page-header__badge">{badge}</span>}
      <h1 className="eg-page-header__title">{title}</h1>
      {subtitle && <p className="eg-page-header__subtitle">{subtitle}</p>}
    </div>
  );
};
