import React, { useState, useRef, useEffect } from 'react';
import { useNotifications, NotificationItem } from '../../hooks/useNotifications';
import { sanitizeUrl } from '../../services/sanitizer';
import { useTheme } from '../../theme/ThemeContext';

export interface NotificationBellProps {
  storageKey?: string;
  fetchUrl?: string;
  items?: NotificationItem[];
  allUpdatesUrl?: string;
  onNavigate?: (href: string) => void;
}

/**
 * Interactive notification trigger with animated badge counter and dropdown tray.
 * Integrates directly with `useNotifications` and localStorage persistence.
 *
 * @example
 * ```tsx
 * <NotificationBell
 *   fetchUrl="data/updates.json"
 *   storageKey="eg_seen_updates"
 *   allUpdatesUrl="updates.html"
 * />
 * ```
 */
export const NotificationBell: React.FC<NotificationBellProps> = ({
  storageKey = 'eg_seen_updates',
  fetchUrl = 'data/updates.json',
  items,
  allUpdatesUrl = 'updates.html',
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const hookData = useNotifications({
    storageKey,
    fetchUrl,
  });

  const notifications = items || hookData.notifications;
  const unreadCount = items ? items.filter((i) => !i.read).length : hookData.unreadCount;
  const markAsRead = hookData.markAsRead;
  const markAllAsRead = hookData.markAllAsRead;

  const calculateDropdownLayout = (): React.CSSProperties => {
    if (!containerRef.current) return {};
    const rect = containerRef.current.getBoundingClientRect();
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const dropdownWidth = Math.min(360, vw - 24);

    // If screen is narrow or standard right-alignment bleeds off left edge
    if (vw <= 768 || rect.right - 320 < 12) {
      const topPos = rect.bottom + 8;
      const leftPos = Math.max(12, Math.min(vw - dropdownWidth - 12, rect.right - dropdownWidth));

      return {
        position: 'fixed',
        top: `${topPos}px`,
        left: `${leftPos}px`,
        right: 'auto',
        width: `${dropdownWidth}px`,
        maxWidth: 'calc(100vw - 24px)',
        zIndex: 9999,
      };
    } else {
      return {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        left: 'auto',
        width: '320px',
        maxWidth: '90vw',
        zIndex: 1000,
      };
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      setDropdownStyle(calculateDropdownLayout());
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Dynamic layout positioning to prevent off-screen trimming on mobile or tablet
  useEffect(() => {
    if (!isOpen) return;

    const updateDropdownLayout = () => {
      setDropdownStyle(calculateDropdownLayout());
    };

    updateDropdownLayout();
    window.addEventListener('resize', updateDropdownLayout);
    window.addEventListener('scroll', updateDropdownLayout, true);
    return () => {
      window.removeEventListener('resize', updateDropdownLayout);
      window.removeEventListener('scroll', updateDropdownLayout, true);
    };
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="header-notify-wrapper eg-notify-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        id="headerNotifyBtn"
        className="header-cta-btn cta-notify eg-notify-bell-btn"
        onClick={handleToggle}
        aria-label="View notifications"
        aria-expanded={isOpen}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px',
          background: 'transparent',
          border: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))',
          borderRadius: 'var(--eg-radius-md, 8px)',
          color: 'var(--eg-text-primary, inherit)',
          cursor: 'pointer',
          transition: 'all var(--eg-transition-fast, 150ms)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--eg-border-hover, #10b981)';
          e.currentTarget.style.backgroundColor = 'var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.05))';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--eg-border-subtle, rgba(255, 255, 255, 0.12))';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span
            id="headerNotifyBadge"
            className="notify-badge unread-pulse"
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              minWidth: '18px',
              height: '18px',
              lineHeight: '18px',
              borderRadius: '9999px',
              textAlign: 'center',
              padding: '0 4px',
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          id="headerNotifyDropdown"
          className="notify-dropdown eg-notify-dropdown"
          role="region"
          aria-label="Recent notifications"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: '320px',
            maxWidth: '90vw',
            ...dropdownStyle,
            background: 'var(--eg-bg-surface-elevated, #ffffff)',
            border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))',
            borderRadius: 'var(--eg-radius-lg, 12px)',
            boxShadow: 'var(--eg-shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.15))',
            overflow: 'hidden',
            fontFamily: 'var(--eg-font-sans, sans-serif)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
              background: 'var(--eg-bg-subtle, #f1f5f9)',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--eg-text-primary, #0f172a)' }}>
              What&apos;s New
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--eg-color-sky, #0284c7)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: 'var(--eg-text-muted, #94a3b8)',
                  fontSize: '13px',
                }}
              >
                No new announcements
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    markAsRead(item.id);
                    if (onNavigate) {
                      onNavigate(allUpdatesUrl);
                      setIsOpen(false);
                    }
                  }}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.06))',
                    background: item.read ? 'transparent' : (isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(14, 165, 233, 0.08)'),
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--eg-bg-surface-hover, rgba(0, 0, 0, 0.04))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = item.read
                      ? 'transparent'
                      : (isDark ? 'rgba(56, 189, 248, 0.08)' : 'rgba(14, 165, 233, 0.08)');
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: item.read ? 500 : 700,
                        fontSize: '13px',
                        color: 'var(--eg-text-primary, #0f172a)',
                        flex: 1,
                      }}
                    >
                      {item.title}
                    </span>
                    {item.category && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          background:
                            item.category.includes('ENHANC') ? (isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.14)') :
                            item.category.includes('FEAT') ? (isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(14, 165, 233, 0.14)') :
                            item.category.includes('BUG') ? (isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.14)') :
                            item.category.includes('OPT') ? (isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.14)') :
                            (isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.14)'),
                          color:
                            item.category.includes('ENHANC') ? (isDark ? '#c084fc' : '#7e22ce') :
                            item.category.includes('FEAT') ? (isDark ? '#38bdf8' : '#0369a1') :
                            item.category.includes('BUG') ? (isDark ? '#f87171' : '#b91c1c') :
                            item.category.includes('OPT') ? (isDark ? '#fbbf24' : '#b45309') :
                            (isDark ? '#34d399' : '#047857'),
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                    {!item.read && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--eg-color-sky, #0284c7)',
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: 'var(--eg-text-secondary, #475569)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </p>
                  {item.date && (
                    <span
                      style={{
                        display: 'block',
                        marginTop: '4px',
                        fontSize: '11px',
                        color: 'var(--eg-text-muted, #94a3b8)',
                      }}
                    >
                      {item.date}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          <div
            style={{
              padding: '10px 16px',
              textAlign: 'center',
              borderTop: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
              background: 'var(--eg-bg-subtle, #f1f5f9)',
            }}
          >
            <a
              href={sanitizeUrl(allUpdatesUrl)}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(allUpdatesUrl);
                  setIsOpen(false);
                }
              }}
              style={{
                color: 'var(--eg-color-primary, #10b981)',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              View all updates →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
