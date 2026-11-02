import { default as React } from 'react';
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
export declare const Container: React.FC<ContainerProps>;
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
export declare const Section: React.FC<SectionProps>;
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
export declare const PageHeader: React.FC<PageHeaderProps>;
