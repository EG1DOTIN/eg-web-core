import { default as React } from 'react';
export interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
    icon?: React.ReactNode;
}
export interface FooterSection {
    title: string;
    links?: FooterLink[];
    customContent?: React.ReactNode;
}
export interface SocialLinkItem {
    name: string;
    url: string;
    icon?: React.ReactNode;
}
export interface FooterProps {
    preset?: 'generic' | 'eg1' | 'mchess' | 'clamui' | 'custom';
    brandLogo?: React.ReactNode;
    logoComponent?: React.ReactNode;
    logoSize?: number;
    logoTheme?: 'light' | 'dark' | 'auto';
    brandTitle?: string;
    brandSubtitle?: string;
    aboutText?: string;
    aboutReadMoreUrl?: string;
    socialLinks?: SocialLinkItem[];
    socialAlignment?: 'left' | 'center' | 'right';
    contactAlignment?: 'left' | 'center' | 'right';
    followLabel?: string;
    contactLabel?: string;
    contactButtonText?: string;
    contactUrl?: string;
    sections?: FooterSection[];
    copyrightText?: string;
    privacyPolicyUrl?: string;
    developedByText?: string;
    developedByUrl?: string;
    developedByPrefix?: string;
    showBackToTop?: boolean;
    containerMaxWidth?: string | number;
    containerPadding?: string | number;
    onNavigate?: (href: string) => void;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Universal application footer with configurable column structure, brand logo,
 * about text, social links, contact forms, and legal links.
 *
 * @example
 * ```tsx
 * <Footer
 *   brandTitle="My Application"
 *   aboutText="Modern modular web application."
 * />
 * ```
 */
export declare const Footer: React.FC<FooterProps>;
