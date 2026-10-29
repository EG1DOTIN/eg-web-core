import React, { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from '../common/ThemeToggle';
import { NotificationBell } from '../common/NotificationBell';
import { CacheBuster } from '../common/CacheBuster';
import { Logo } from '../common/Logo';
import { sanitizeUrl } from '../../services/sanitizer';

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
export const Header: React.FC<HeaderProps> = ({
  preset: _preset = 'generic',
  brandLogo,
  logoComponent,
  logoSize,
  logoTheme,
  brandTitle,
  brandSubtitle,
  brandUrl = 'index.html',
  navLinks,
  githubUrl,
  currentPath = 'index.html',
  showForkRibbon = false,
  forkRibbonUrl,
  forkRibbonText = 'FORK ME',
  forkRibbonPosition = 'right',
  showNotificationBell = true,
  notificationFetchUrl,
  notificationStorageKey = 'notifications_seen_updates',
  showThemeToggle = true,
  showCacheBuster = true,
  quickAction,
  customControls,
  containerMaxWidth = 'var(--eg-container-max, min(1536px, 94%))',
  containerPadding = '0 clamp(16px, 2.5vw, 32px)',
  onNavigate,
  className = '',
  style = {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const defaultGenericLinks: NavLinkItem[] = [
    { label: 'HOME', href: 'index.html' },
  ];

  const links = (navLinks && navLinks.length > 0) ? navLinks : defaultGenericLinks;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (external || href.startsWith('http://') || href.startsWith('https://')) {
      return;
    }
    if (href === '#' || href === 'javascript:void(0);') {
      e.preventDefault();
      return;
    }
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
      setMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  const checkIsActive = (link: NavLinkItem): boolean => {
    if (link.active) return true;
    const cleanCurrent = currentPath.replace(/^\/+/, '').split('?')[0].split('#')[0] || 'index.html';
    const cleanHref = link.href.replace(/^\/+/, '').split('?')[0].split('#')[0];

    if (cleanCurrent === cleanHref) return true;
    if (cleanHref === 'index.html' && (cleanCurrent === '' || cleanCurrent === 'index.html')) return true;

    // Check children
    if (link.children) {
      return link.children.some((child) => checkIsActive(child));
    }
    return false;
  };

  return (
    <header
      className={`eg-header ${className}`}
      style={{
        background: 'var(--eg-bg-surface, #ffffff)',
        borderBottom: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
        position: 'sticky',
        top: 0,
        zIndex: 900,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'background var(--eg-transition-normal, 220ms)',
        ...style,
      }}
    >
      {/* GitHub Fork Corner Ribbon */}
      {showForkRibbon && forkRibbonUrl && (
        <div
          className="github-fork-ribbon-wrapper"
          style={{
            position: 'absolute',
            top: 0,
            ...(forkRibbonPosition === 'right' ? { right: 0 } : { left: 0 }),
            width: '115px',
            height: '115px',
            overflow: 'hidden',
            zIndex: 10005,
            pointerEvents: 'none',
          }}
        >
          <a
            href={forkRibbonUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Fork me on GitHub"
            aria-label="Fork me on GitHub"
            className="github-fork-ribbon"
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '155px',
              top: '24px',
              ...(forkRibbonPosition === 'right'
                ? { right: '-38px', transform: 'rotate(45deg)' }
                : { left: '-38px', transform: 'rotate(-45deg)' }),
              background: 'linear-gradient(135deg, #24292e 0%, #161b22 100%)',
              color: '#ffffff',
              textAlign: 'center',
              padding: '6px 0',
              fontSize: '11px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
              border: '1px dashed rgba(255, 255, 255, 0.4)',
              borderLeft: 'none',
              borderRight: 'none',
              pointerEvents: 'auto',
              letterSpacing: '0.8px',
              lineHeight: 1,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(16, 185, 129, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #24292e 0%, #161b22 100%)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.45)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {forkRibbonText !== '' && <span>{forkRibbonText || 'FORK ME'}</span>}
          </a>
        </div>
      )}

      <div
        className="eg-header-container"
        style={{
          maxWidth: containerMaxWidth,
          margin: '0 auto',
          padding: containerPadding,
        }}
      >
        <div
          className="eg-header-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '74px',
            padding: '4px 0',
            gap: '28px',
          }}
        >
          {/* Brand Logo */}
          <div
            className="eg-header-left-brand"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
              marginRight: '20px',
              marginLeft: showForkRibbon && forkRibbonPosition === 'left' ? '48px' : '0',
            }}
          >
            <a
              href={brandUrl}
              onClick={(e) => handleLinkClick(e, brandUrl)}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
              title={brandTitle || 'Home'}
            >
              {brandLogo || logoComponent ? (
                brandLogo || logoComponent
              ) : brandTitle ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '20px',
                      letterSpacing: '-0.3px',
                      color: 'var(--eg-text-primary, #0f172a)',
                    }}
                  >
                    {brandTitle}
                  </span>
                  {brandSubtitle && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--eg-text-muted, #94a3b8)',
                        fontWeight: 500,
                      }}
                    >
                      {brandSubtitle}
                    </span>
                  )}
                </div>
              ) : (
                <Logo size={logoSize || 56} theme={logoTheme || 'auto'} mainText="APP" />
              )}
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            ref={dropdownRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
            className="eg-desktop-nav"
          >
            {links.map((link) => {
              const isActive = checkIsActive(link);
              const hasChildren = link.children && link.children.length > 0;
              const isDropdownOpen = openDropdown === link.label;

              if (hasChildren) {
                return (
                  <div key={link.label} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : link.label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'transparent',
                        border: 'none',
                        color: isActive ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-secondary, #475569)',
                        fontWeight: isActive ? 700 : 600,
                        fontSize: '13.5px',
                        padding: '8px 6px',
                        cursor: 'pointer',
                        borderBottom: isActive ? '2px solid var(--eg-color-primary, #10b981)' : '2px solid transparent',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {link.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{link.icon}</span>}
                      <span>{link.label}</span>
                      <span style={{ fontSize: '10px', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
                        ▼
                      </span>
                    </button>

                    {/* Submenu Dropdown Panel */}
                    {isDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          minWidth: '190px',
                          background: 'var(--eg-bg-surface-elevated, #ffffff)',
                          border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))',
                          borderRadius: '8px',
                          boxShadow: 'var(--eg-shadow-lg, 0 12px 30px rgba(0, 0, 0, 0.15))',
                          padding: '6px',
                          zIndex: 1000,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                        }}
                      >
                        {link.children!.map((child) => {
                          const childActive = checkIsActive(child);
                          return (
                            <a
                              key={child.label}
                              href={sanitizeUrl(child.href)}
                              target={child.external ? '_blank' : undefined}
                              rel={child.external ? 'noopener noreferrer' : undefined}
                              onClick={(e) => handleLinkClick(e, child.href, child.external)}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: childActive ? 700 : 500,
                                color: childActive ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-primary, #0f172a)',
                                background: childActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (!childActive) {
                                  e.currentTarget.style.background = 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!childActive) {
                                  e.currentTarget.style.background = 'transparent';
                                }
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {child.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{child.icon}</span>}
                                <span>{child.label}</span>
                              </div>
                              {child.external && <span style={{ fontSize: '11px', opacity: 0.7 }}>↗</span>}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={link.href}
                  href={sanitizeUrl(link.href)}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  onClick={(e) => handleLinkClick(e, link.href, link.external)}
                  style={
                    link.highlight
                      ? {
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#ffffff',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          textDecoration: 'none',
                          fontWeight: 800,
                          fontSize: '13px',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                          borderBottom: 'none',
                          transition: 'all 0.15s ease',
                          letterSpacing: '0.4px',
                        }
                      : {
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: isActive ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-secondary, #475569)',
                          textDecoration: 'none',
                          fontWeight: isActive ? 700 : 600,
                          fontSize: '13.5px',
                          padding: '8px 6px',
                          borderBottom: isActive ? '2px solid var(--eg-color-primary, #10b981)' : '2px solid transparent',
                          transition: 'all 0.15s ease',
                          letterSpacing: '0.5px',
                        }
                  }
                >
                  {link.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{link.icon}</span>}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Header Controls */}
          <div
            className="eg-header-right-controls"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
              marginLeft: '20px',
              marginRight: showForkRibbon && forkRibbonPosition === 'right' ? '48px' : '0',
            }}
          >
            {showNotificationBell && (
              <NotificationBell
                onNavigate={onNavigate}
                fetchUrl={notificationFetchUrl}
                storageKey={notificationStorageKey}
              />
            )}

            {quickAction}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Explore on GitHub"
                aria-label="Explore on GitHub"
                className="eg-header-control-desktop-only"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '7px 9px',
                  background: 'transparent',
                  border: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  color: 'var(--eg-text-primary, inherit)',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
            )}

            {showThemeToggle && <ThemeToggle />}
            {showCacheBuster && (
              <span className="eg-header-control-desktop-only">
                <CacheBuster />
              </span>
            )}
            {customControls}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="eg-mobile-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                background: 'transparent',
                border: '1px solid var(--eg-border-default, rgba(0,0,0,0.15))',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--eg-text-primary, inherit)',
              }}
            >
              <span style={{ fontSize: '18px' }}>{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Responsive Media Queries */}
      <style>{`
        @media (max-width: 860px) {
          .eg-desktop-nav {
            display: none !important;
          }
          .eg-mobile-toggle {
            display: inline-flex !important;
          }
        }
        @media (max-width: 768px) {
          .github-fork-ribbon-wrapper {
            display: none !important;
          }
          .eg-header-container {
            padding: 0 12px !important;
          }
          .eg-header-inner {
            min-height: 64px !important;
            padding: 4px 0 !important;
            gap: 8px !important;
          }
          .eg-header-left-brand {
            margin-left: 0 !important;
            margin-right: 0 !important;
            gap: 8px !important;
            flex-shrink: 1 !important;
            min-width: 0 !important;
          }
          .eg-header-right-controls {
            margin-left: auto !important;
            margin-right: 0 !important;
            gap: 6px !important;
            flex-shrink: 0 !important;
          }
          .eg-header-control-desktop-only {
            display: none !important;
          }
          .eg-mobile-toggle {
            display: inline-flex !important;
            padding: 6px 8px !important;
            min-width: 34px !important;
            height: 34px !important;
          }
          .eg-logo-badge {
            width: 44px !important;
            height: 44px !important;
          }
          .eg-logo-main-text {
            font-size: 18px !important;
          }
          .eg-logo-domain-text {
            font-size: 7.5px !important;
          }
          .eg-logo-byline {
            display: none !important;
          }
        }
        @media (max-width: 400px) {
          .eg-header-container {
            padding: 0 6px !important;
          }
          .eg-header-inner {
            gap: 4px !important;
          }
          .eg-header-right-controls {
            gap: 4px !important;
          }
          .eg-mobile-toggle {
            padding: 5px 6px !important;
            min-width: 30px !important;
            height: 30px !important;
          }
        }
      `}</style>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="eg-header-mobile-drawer"
          style={{
            borderTop: '1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))',
            background: 'var(--eg-bg-surface-elevated, var(--eg-bg-surface, #1e293b))',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {links.map((link) => {
            const isActive = checkIsActive(link);
            const hasChildren = link.children && link.children.length > 0;

            if (hasChildren) {
              return (
                <div key={link.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--eg-text-muted, #94a3b8)', padding: '6px 0' }}>
                    {link.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{link.icon}</span>}
                    <span>{link.label}</span>
                  </div>
                  {link.children!.map((child) => (
                    <a
                      key={child.label}
                      href={sanitizeUrl(child.href)}
                      onClick={(e) => handleLinkClick(e, child.href, child.external)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: checkIsActive(child) ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-primary, #0f172a)',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {child.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{child.icon}</span>}
                      <span>{child.label}</span>
                    </a>
                  ))}
                </div>
              );
            }

            return (
              <a
                key={link.href}
                href={sanitizeUrl(link.href)}
                onClick={(e) => handleLinkClick(e, link.href, link.external)}
                style={
                  link.highlight
                    ? {
                        padding: '10px 14px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: '#ffffff',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                      }
                    : {
                        padding: '10px 12px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: isActive ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-primary, #0f172a)',
                        background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }
                }
              >
                {link.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{link.icon}</span>}
                <span>{link.label}</span>
              </a>
            );
          })}

          {/* Mobile Drawer Utilities */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))',
              marginTop: '6px',
            }}
          >
            {showCacheBuster && <CacheBuster />}
            {githubUrl && (
              <a
                href={sanitizeUrl(githubUrl)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: 'var(--eg-text-secondary, #64748b)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                <span>GitHub Repository</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
