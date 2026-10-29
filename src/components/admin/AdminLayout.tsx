/**
 * @file AdminLayout.tsx
 * @description Responsive administrative layout shell for the EG web ecosystem.
 * Features:
 *   - Collapsible desktop sidebar with navigation items, badges, and active state.
 *   - Mobile slide-out drawer with overlay backdrop.
 *   - Top header with dynamic title, user profile pill, theme toggle, and logout button.
 *   - Smooth design-token styling with 100% theme integration.
 */

import React, { useState } from 'react';
import { AdminUser } from '../../services/adminAuthService';
import { ThemeToggle } from '../common/ThemeToggle';

export interface AdminNavItem {
  /** Unique navigation identifier */
  id: string;
  /** Label displayed in sidebar */
  label: string;
  /** Leading icon element */
  icon?: React.ReactNode;
  /** Optional badge counter or status text */
  badge?: string | number;
  /** Optional badge background tint */
  badgeColor?: string;
  /** Optional link destination */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface AdminLayoutProps {
  /** Main title displayed in sidebar and header */
  brandTitle?: string;
  /** Optional subtitle or version tag */
  brandSubtitle?: string;
  /** Optional logo element */
  logo?: React.ReactNode;
  /** Navigation items list */
  navItems: AdminNavItem[];
  /** Currently active navigation ID */
  activeNavId?: string;
  /** Navigation item select handler */
  onNavSelect?: (id: string) => void;
  /** Currently authenticated admin user */
  user?: AdminUser | null;
  /** Logout handler callback */
  onLogout?: () => void;
  /** Current section/page title for the header */
  currentTitle?: string;
  /** Optional header actions slot (e.g. search, refresh button) */
  headerActions?: React.ReactNode;
  /** Main content body */
  children: React.ReactNode;
  /** Custom wrapper style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  brandTitle = 'Admin Portal',
  brandSubtitle = 'Security & Control',
  logo,
  navItems,
  activeNavId,
  onNavSelect,
  user,
  onLogout,
  currentTitle,
  headerActions,
  children,
  style,
  className = '',
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleItemClick = (item: AdminNavItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onNavSelect) {
      onNavSelect(item.id);
    }
    setMobileMenuOpen(false);
  };

  const activeItem = navItems.find((item) => item.id === activeNavId);
  const displayTitle = currentTitle || activeItem?.label || brandTitle;

  return (
    <div
      className={`eg-admin-layout ${className}`}
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--eg-bg-primary, #030712)',
        color: 'var(--eg-text-primary, #f9fafb)',
        fontFamily: 'var(--eg-font-sans, inherit)',
        position: 'relative',
        ...style,
      }}
    >
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 99990,
          }}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        style={{
          width: sidebarCollapsed ? '72px' : '260px',
          background: 'var(--eg-bg-secondary, #111827)',
          borderRight: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'width var(--eg-transition-normal, 220ms), transform var(--eg-transition-normal, 220ms)',
          zIndex: 99995,
          position: 'sticky',
          top: 0,
          height: '100vh',
          flexShrink: 0,
          ...(mobileMenuOpen
            ? {
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                transform: 'translateX(0)',
              }
            : {}),
        }}
      >
        {/* Sidebar Header */}
        <div>
          <div
            style={{
              padding: sidebarCollapsed ? '16px 8px' : '20px 16px',
              borderBottom: '1px solid var(--eg-border, rgba(255, 255, 255, 0.06))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
              {logo ? (
                <div style={{ flexShrink: 0 }}>{logo}</div>
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--eg-radius-md, 10px)',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.2))',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--eg-color-primary, #10b981)',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              )}
              {!sidebarCollapsed && (
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <div
                    style={{
                      fontSize: 'var(--eg-text-base, 1rem)',
                      fontWeight: 700,
                      color: 'var(--eg-text-primary, #f9fafb)',
                      lineHeight: 1.2,
                    }}
                  >
                    {brandTitle}
                  </div>
                  {brandSubtitle && (
                    <div
                      style={{
                        fontSize: 'var(--eg-text-xs, 0.75rem)',
                        color: 'var(--eg-text-muted, #9ca3af)',
                      }}
                    >
                      {brandSubtitle}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            {!mobileMenuOpen && (
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--eg-text-muted, #9ca3af)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: sidebarCollapsed ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation Items List */}
          <nav style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = item.id === activeNavId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  title={sidebarCollapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'space-between',
                    gap: '12px',
                    width: '100%',
                    padding: sidebarCollapsed ? '10px 0' : '10px 14px',
                    background: isActive ? 'var(--eg-color-emerald-glow, rgba(0, 220, 130, 0.12))' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                    borderRadius: 'var(--eg-radius-md, 10px)',
                    color: isActive ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-secondary, #d1d5db)',
                    fontSize: 'var(--eg-text-sm, 0.875rem)',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all var(--eg-transition-fast, 150ms)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon && (
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                        }}
                      >
                        {item.icon}
                      </span>
                    )}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </div>

                  {!sidebarCollapsed && item.badge != null && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--eg-radius-pill, 9999px)',
                        fontSize: 'var(--eg-text-xs, 0.75rem)',
                        fontWeight: 600,
                        background: item.badgeColor || 'var(--eg-bg-tertiary, #1f2937)',
                        color: 'var(--eg-text-primary, #f9fafb)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User profile and expand button (when collapsed) */}
        <div
          style={{
            padding: sidebarCollapsed ? '12px 8px' : '16px',
            borderTop: '1px solid var(--eg-border, rgba(255, 255, 255, 0.06))',
          }}
        >
          {sidebarCollapsed ? (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--eg-text-muted, #9ca3af)',
                cursor: 'pointer',
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Expand sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ) : user ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.email}
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--eg-color-primary, #10b981)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <div
                    style={{
                      fontSize: 'var(--eg-text-xs, 0.8125rem)',
                      fontWeight: 600,
                      color: 'var(--eg-text-primary, #f9fafb)',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {user.displayName || user.email.split('@')[0]}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: 'var(--eg-text-muted, #9ca3af)',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {user.email}
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f87171',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: 'var(--eg-radius-sm, 6px)',
                  }}
                  title="Sign Out"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              )}
            </div>
          ) : null}
        </div>
      </aside>

      {/* Main Body Area: Header + Content */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, minHeight: '100vh' }}>
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            background: 'var(--eg-bg-secondary, #111827)',
            borderBottom: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--eg-space-6, 24px)',
            position: 'sticky',
            top: 0,
            zIndex: 99980,
          }}
        >
          {/* Mobile hamburger + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: 'var(--eg-text-primary, #f9fafb)',
                cursor: 'pointer',
                padding: '6px',
              }}
              className="eg-admin-mobile-toggle"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <h2
              style={{
                fontSize: 'var(--eg-text-lg, 1.125rem)',
                fontWeight: 700,
                color: 'var(--eg-text-primary, #f9fafb)',
                margin: 0,
              }}
            >
              {displayTitle}
            </h2>
          </div>

          {/* Right actions: custom slot + ThemeToggle + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {headerActions}
            <ThemeToggle />
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  color: '#f87171',
                  fontSize: 'var(--eg-text-xs, 0.8125rem)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </header>

        {/* Content View Container */}
        <main
          style={{
            flex: 1,
            padding: 'var(--eg-space-6, 24px)',
            maxWidth: '1600px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .eg-admin-mobile-toggle {
            display: flex !important;
          }
          aside {
            display: ${mobileMenuOpen ? 'flex !important' : 'none !important'};
          }
        }
      `}</style>
    </div>
  );
};
