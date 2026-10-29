import React, { useState, useMemo, useCallback } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { sanitizeUrl } from '../../services/sanitizer';
import { UpdateItem, ReleaseAsset, formatBytes } from '../../services/updatesService';

export type { UpdateItem, ReleaseAsset };
export type UpdateEntry = UpdateItem;

export interface FilterTabOption {
  id: string;
  label: string;
  filter?: (item: UpdateItem) => boolean;
}

export interface UpdatesTimelineProps {
  /** Array of update items loaded from static JSON or live GitHub releases */
  updates: UpdateItem[];
  /** Optional title displayed at top of the timeline */
  title?: string;
  /** Optional subtitle displayed below the title */
  subtitle?: string;
  /** Custom filter tabs to display above timeline. If not specified, automatically infers (All, Website, Apps, etc.) */
  filterTabs?: FilterTabOption[];
  /** Initially active filter tab ID (default: 'all') */
  defaultFilter?: string;
  /** Whether to show item count badges on filter tab buttons (default: true) */
  showFilterCounts?: boolean;
  /** Whether to show a live keyword search input (default: true) */
  showSearch?: boolean;
  /** Placeholder text for live search input */
  searchPlaceholder?: string;
  /** Callback for client-side routing on action button clicks */
  onNavigate?: (href: string) => void;
  /** Callback fired when an update item action is clicked */
  onUpdateClick?: (update: UpdateItem) => void;
  /** Storage key used to mark seen update IDs (default: 'eg_seen_updates') */
  seenStorageKey?: string;
  /** Message displayed when no updates match active filter/search */
  emptyMessage?: string;
  /** Optional custom action button label resolver */
  getActionLabel?: (item: UpdateItem) => string;
  /** Optional container class name */
  className?: string;
  /** Optional inline container styles */
  style?: React.CSSProperties;
}

/**
 * Returns fixed category vector icons matching standard taxonomy.
 */
function getCategoryIcon(cat?: string, icon?: string): React.ReactNode {
  const raw = (cat || icon || '').toLowerCase();

  if (raw.includes('enhanc') || raw.includes('spark')) {
    // Sparkles
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </svg>
    );
  }

  if (raw.includes('opt') || raw.includes('speed') || raw.includes('gauge')) {
    // Speedometer
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 14 4-4" />
        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
      </svg>
    );
  }

  if (raw.includes('feat') || raw.includes('star')) {
    // 5-Point Star
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  if (raw.includes('bug') || raw.includes('fix') || raw.includes('tool') || raw.includes('wrench')) {
    // Tool / Wrench
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    );
  }

  if (raw.includes('app') || raw.includes('grid')) {
    // App 4-grid
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1.5" />
        <rect width="7" height="7" x="14" y="3" rx="1.5" />
        <rect width="7" height="7" x="14" y="14" rx="1.5" />
        <rect width="7" height="7" x="3" y="14" rx="1.5" />
      </svg>
    );
  }

  if (raw.includes('sec') || raw.includes('shield')) {
    // Shield
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }

  // Info circle default
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/**
 * Returns calibrated category color styles for badges and icons.
 */
function getCategoryColor(cat?: string): { color: string; bg: string; border: string } {
  const raw = (cat || '').toUpperCase();
  if (raw.includes('ENHANC')) {
    return { color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)', border: 'rgba(2, 132, 199, 0.28)' };
  }
  if (raw.includes('OPT')) {
    return { color: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.28)' };
  }
  if (raw.includes('FEAT')) {
    return { color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.28)' };
  }
  if (raw.includes('BUG') || raw.includes('FIX')) {
    return { color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.28)' };
  }
  if (raw.includes('SEC')) {
    return { color: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.28)' };
  }
  if (raw.includes('APP')) {
    return { color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.28)' };
  }
  return { color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', border: 'rgba(100, 116, 139, 0.28)' };
}

/**
 * Comprehensive vertical updates timeline component featuring category filter pills,
 * dynamic item counts, keyword search, platform download pills, and context-aware action triggers.
 */
export const UpdatesTimeline: React.FC<UpdatesTimelineProps> = ({
  updates,
  title,
  subtitle,
  filterTabs,
  defaultFilter = 'all',
  showFilterCounts = true,
  showSearch = true,
  searchPlaceholder = 'Search updates & releases...',
  onNavigate,
  onUpdateClick,
  seenStorageKey = 'eg_seen_updates',
  emptyMessage = 'No updates found matching your criteria.',
  getActionLabel,
  className = '',
  style = {},
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(defaultFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Resolve filter tabs dynamically if not explicitly provided
  const resolvedTabs: FilterTabOption[] = useMemo(() => {
    if (filterTabs && filterTabs.length > 0) return filterTabs;

    // Check if dataset contains "website" or "app" types
    const hasWebsite = updates.some((u) => (u.type || '').toLowerCase() === 'website');
    const hasApp = updates.some((u) => (u.type || '').toLowerCase() === 'app');

    if (hasWebsite || hasApp) {
      return [
        { id: 'all', label: 'All Updates', filter: () => true },
        { id: 'website', label: 'Website', filter: (u) => (u.type || '').toLowerCase() === 'website' },
        { id: 'app', label: 'Apps', filter: (u) => (u.type || '').toLowerCase() === 'app' },
      ];
    }

    // Default generic tabs: All
    return [{ id: 'all', label: 'All Updates', filter: () => true }];
  }, [filterTabs, updates]);

  // 2. Calculate dynamic count badges for each tab
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    resolvedTabs.forEach((tab) => {
      if (tab.id === 'all') {
        counts[tab.id] = updates.length;
      } else if (tab.filter) {
        counts[tab.id] = updates.filter(tab.filter).length;
      } else {
        counts[tab.id] = updates.filter((u) => (u.type || u.category || '').toLowerCase() === tab.id.toLowerCase()).length;
      }
    });
    return counts;
  }, [resolvedTabs, updates]);

  // 3. Filter and search updates
  const filteredUpdates = useMemo(() => {
    let result = updates;

    // Apply active tab filter
    const activeTab = resolvedTabs.find((t) => t.id === activeFilter);
    if (activeTab && activeTab.id !== 'all') {
      if (activeTab.filter) {
        result = result.filter(activeTab.filter);
      } else {
        result = result.filter((u) => (u.type || u.category || '').toLowerCase() === activeTab.id.toLowerCase());
      }
    }

    // Apply keyword search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.title.toLowerCase().includes(q) ||
          (u.version && u.version.toLowerCase().includes(q)) ||
          (u.description && u.description.toLowerCase().includes(q)) ||
          (u.category && u.category.toLowerCase().includes(q)) ||
          (Array.isArray(u.highlights) && u.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [updates, resolvedTabs, activeFilter, searchQuery]);

  // 4. Handle mark update as seen on click
  const handleItemAction = useCallback(
    (e: React.MouseEvent, update: UpdateItem) => {
      if (onUpdateClick) {
        onUpdateClick(update);
      }

      if (typeof window !== 'undefined' && update.id) {
        try {
          const raw = localStorage.getItem(seenStorageKey);
          const seenIds: string[] = raw ? JSON.parse(raw) : [];
          if (!seenIds.includes(update.id)) {
            seenIds.push(update.id);
            localStorage.setItem(seenStorageKey, JSON.stringify(seenIds));
          }
        } catch {
          // Ignore storage quota error
        }
      }

      const href = update.link;
      if (href && !href.startsWith('http://') && !href.startsWith('https://') && onNavigate) {
        e.preventDefault();
        onNavigate(href);
      }
    },
    [onNavigate, onUpdateClick, seenStorageKey]
  );

  return (
    <div
      className={`eg-updates-timeline-container ${className}`}
      style={{
        maxWidth: '920px',
        margin: '0 auto',
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        ...style,
      }}
    >
      {/* Optional Title & Subtitle Header */}
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {title && (
            <h1
              style={{
                fontSize: 'var(--eg-text-3xl, 2.2rem)',
                fontWeight: 800,
                color: 'var(--eg-text-primary, #0f172a)',
                margin: '0 0 10px',
                letterSpacing: '-0.5px',
              }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: 'var(--eg-text-base, 1rem)',
                color: 'var(--eg-text-secondary, #64748b)',
                maxWidth: '680px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Control Bar: Filter Tabs + Search Input */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px',
          background: 'var(--eg-bg-surface, #ffffff)',
          border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))',
          borderRadius: 'var(--eg-radius-xl, 16px)',
          padding: '12px 18px',
          boxShadow: 'var(--eg-shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.04))',
        }}
      >
        {/* Interactive Filter Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} role="tablist">
          {resolvedTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            const count = tabCounts[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '7px 15px',
                  borderRadius: '9999px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 600,
                  border: isActive
                    ? '1px solid var(--eg-color-primary, #10b981)'
                    : '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                  background: isActive ? 'var(--eg-color-primary, #10b981)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--eg-text-secondary, #475569)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(16, 185, 129, 0.28)' : 'none',
                }}
              >
                <span>{tab.label}</span>
                {showFilterCounts && count !== undefined && (
                  <span
                    style={{
                      fontSize: '11.5px',
                      opacity: isActive ? 0.92 : 0.65,
                      fontWeight: 600,
                    }}
                  >
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        {showSearch && (
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 220px', maxWidth: '320px' }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--eg-text-muted, #94a3b8)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))',
                background: 'var(--eg-bg-canvas, #f8fafc)',
                color: 'var(--eg-text-primary, #0f172a)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
            />
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredUpdates.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--eg-bg-surface, #ffffff)',
            borderRadius: '16px',
            border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))',
            color: 'var(--eg-text-muted, #94a3b8)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px', opacity: 0.5 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{emptyMessage}</p>
        </div>
      )}

      {/* Vertical Timeline Card List */}
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        {/* Continuous Vertical Timeline Line */}
        {filteredUpdates.length > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '12px',
              bottom: '24px',
              width: '2px',
              background: 'var(--eg-border-default, rgba(0, 0, 0, 0.1))',
              zIndex: 0,
            }}
          />
        )}

        {filteredUpdates.map((update, idx) => {
          const colors = getCategoryColor(update.category || update.badge);
          const iconNode = getCategoryIcon(update.category, update.icon);
          const isExternal = Boolean(update.link && update.link.startsWith('http'));

          // Contextual Action Button Text
          let actionLabel = update.linkText;
          if (getActionLabel) {
            actionLabel = getActionLabel(update);
          } else if (!actionLabel) {
            const updateType = (update.type || '').toLowerCase();
            if (updateType === 'app') {
              actionLabel = isExternal ? 'Open Application ↗' : 'Open Application →';
            } else if (updateType === 'website') {
              actionLabel = 'Release Notes →';
            } else {
              actionLabel = isExternal ? 'View on GitHub →' : 'View Details →';
            }
          }

          return (
            <article
              key={update.id || idx}
              id={update.version ? `v-${update.version}` : undefined}
              style={{
                position: 'relative',
                marginBottom: '36px',
                zIndex: 1,
              }}
            >
              {/* Category Node Dot on Timeline */}
              <div
                style={{
                  position: 'absolute',
                  left: '-32px',
                  top: '16px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: colors.bg,
                  color: colors.color,
                  border: `2px solid ${colors.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 4px var(--eg-bg-canvas, #f8fafc)',
                  zIndex: 2,
                }}
              >
                <div style={{ transform: 'scale(0.65)' }}>{iconNode}</div>
              </div>

              {/* Main Timeline Card */}
              <div
                style={{
                  background: 'var(--eg-bg-surface, #ffffff)',
                  border: update.isLatest
                    ? '1.5px solid var(--eg-color-primary, #10b981)'
                    : '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))',
                  borderRadius: 'var(--eg-radius-xl, 16px)',
                  padding: '24px 28px',
                  boxShadow: update.isLatest
                    ? '0 6px 20px rgba(16, 185, 129, 0.08)'
                    : 'var(--eg-shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.03))',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Card Header Row: Badges, Date, Version */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '14px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.06))',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    {/* Category Tag */}
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        color: colors.color,
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {update.category || 'UPDATE'}
                    </span>

                    {/* Version Badge */}
                    {update.version && (
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: 800,
                          color: 'var(--eg-text-primary, #0f172a)',
                          letterSpacing: '-0.2px',
                        }}
                      >
                        v{update.version}
                      </span>
                    )}

                    {/* Latest Badge */}
                    {update.isLatest && (
                      <Badge variant="success" size="sm">
                        Latest Release
                      </Badge>
                    )}

                    {/* Type Tag */}
                    {update.type && (
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 600,
                          color: 'var(--eg-text-muted, #94a3b8)',
                          textTransform: 'capitalize',
                        }}
                      >
                        • {update.type === 'website' ? 'Core Website' : update.type === 'app' ? 'Application' : update.type}
                      </span>
                    )}
                  </div>

                  {/* Calendar Date */}
                  <time
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--eg-text-muted, #94a3b8)',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {update.date}
                  </time>
                </div>

                {/* Card Title */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--eg-text-primary, #0f172a)',
                    margin: '0 0 10px',
                    lineHeight: 1.4,
                  }}
                >
                  {update.title}
                </h3>

                {/* Description */}
                {update.description && (
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--eg-text-secondary, #475569)',
                      lineHeight: 1.65,
                      margin: '0 0 16px',
                    }}
                  >
                    {update.description}
                  </p>
                )}

                {/* Bullet Highlights List */}
                {Array.isArray(update.highlights) && update.highlights.length > 0 && (
                  <div
                    style={{
                      background: 'var(--eg-bg-canvas, rgba(0, 0, 0, 0.02))',
                      borderRadius: '8px',
                      padding: '12px 18px',
                      marginBottom: '16px',
                      border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.05))',
                    }}
                  >
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '16px',
                        fontSize: '13.5px',
                        color: 'var(--eg-text-secondary, #475569)',
                        lineHeight: 1.7,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}
                    >
                      {update.highlights.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Platform Assets / Download Binaries Bar (for GitHub releases or application files) */}
                {Array.isArray(update.assets) && update.assets.length > 0 && (
                  <div
                    style={{
                      background: 'var(--eg-bg-canvas, rgba(0, 0, 0, 0.02))',
                      border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--eg-text-muted, #94a3b8)' }}>
                      Download Binaries ({update.version ? `v${update.version}` : 'Release'}):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {update.assets.map((asset) => {
                        const sizeStr = formatBytes(asset.size);
                        const isExe = asset.platform === 'windows';
                        const badgeVariant = isExe ? 'primary' : asset.platform === 'checksum' ? 'neutral' : 'info';

                        return (
                          <a
                            key={asset.name}
                            href={sanitizeUrl(asset.browser_download_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                          >
                            <Badge variant={badgeVariant} size="sm">
                              <span>{asset.name}</span>
                              {sizeStr && <span style={{ opacity: 0.75, fontSize: '10.5px' }}>({sizeStr})</span>}
                            </Badge>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action CTA Button */}
                {update.link && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '12px' }}>
                    <a
                      href={sanitizeUrl(update.link)}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleItemAction(e, update)}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button variant="secondary" size="sm">
                        {actionLabel}
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
