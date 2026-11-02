import { default as React } from 'react';
export interface NavLinkItem {
    label: string;
    href: string;
    active?: boolean;
    external?: boolean;
    icon?: React.ReactNode;
    children?: NavLinkItem[];
    highlight?: boolean;
}
export interface HeaderProps {
    preset?: 'generic' | 'eg1' | 'mchess' | 'clamui' | 'custom';
    brandLogo?: React.ReactNode;
    logoComponent?: React.ReactNode;
    logoSize?: number;
    logoTheme?: 'light' | 'dark' | 'auto';
    brandTitle?: string;
    brandSubtitle?: string;
    brandUrl?: string;
    navLinks?: NavLinkItem[];
    githubUrl?: string;
    currentPath?: string;
    showForkRibbon?: boolean;
    forkRibbonUrl?: string;
    forkRibbonText?: string;
    forkRibbonPosition?: 'left' | 'right';
    showNotificationBell?: boolean;
    notificationFetchUrl?: string;
    notificationStorageKey?: string;
    showThemeToggle?: boolean;
    showCacheBuster?: boolean;
    quickAction?: React.ReactNode;
    customControls?: React.ReactNode;
    containerMaxWidth?: string | number;
    containerPadding?: string | number;
    onNavigate?: (href: string) => void;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Universal application header supporting customizable presets ('generic', 'eg1', 'mchess', 'clamui')
 * as well as completely custom brand titles, logos, controls, and navigation links.
 * Features:
 * - Brand typography or custom logo node
 * - Corner GitHub fork ribbon (right or left corner) with unclipped layout
 * - Desktop navigation with active route highlights, icons & dropdown submenus
 * - Responsive slide-out mobile drawer with accordion sub-items
 * - Header controls: Notification Bell, GitHub profile, Theme Toggle, and Cache Buster
 *
 * @example
 * ```tsx
 * <Header
 *   brandTitle="My Application"
 *   currentPath="index.html"
 *   onNavigate={(path) => navigate(path)}
 * />
 * ```
 */
export declare const Header: React.FC<HeaderProps>;
