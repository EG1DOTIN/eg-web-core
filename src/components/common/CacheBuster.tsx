import React, { useState } from 'react';
import { DataCache } from '../../services/DataCache';

export interface CacheBusterProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  /** Optional extra storage keys to purge on refresh */
  customKeys?: string[];
  /** Optional custom callback invoked before reload */
  onRefreshComplete?: () => void;
}

/**
 * Maintenance button component to purge local caches, CacheStorage, and Service Workers,
 * triggering a clean hard reload of application assets.
 *
 * @example
 * ```tsx
 * <CacheBuster size="md" showLabel={true} />
 * ```
 */
export const CacheBuster: React.FC<CacheBusterProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
  customKeys,
  onRefreshComplete,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleHardRefresh = async () => {
    if (refreshing || typeof window === 'undefined') return;
    setRefreshing(true);

    try {
      // 1. Clear DataCache in memory & local storage (cleans all registered prefixes/keys)
      DataCache.clearCache('ALL');

      // 2. Clear standard telemetry consent, opt-out, and session storage
      try {
        localStorage.removeItem('analytics_consent');
        localStorage.removeItem('analytics_optout');
        localStorage.removeItem('analytics_session');
        if (customKeys && Array.isArray(customKeys)) {
          customKeys.forEach((k) => localStorage.removeItem(k));
        }
        sessionStorage.clear();
      } catch (storageErr) {
        console.warn('[CacheBuster] Storage reset error:', storageErr);
      }

      // 3. Clear browser CacheStorage if available
      if ('caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
      }

      // 4. Unregister service workers if any
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }
    } catch (e) {
      console.warn('[CacheBuster] Cache clearance error:', e);
    }

    if (onRefreshComplete) {
      onRefreshComplete();
    } else {
      // Force clean reload with cache-busting query parameter
      const url = new URL(window.location.href);
      url.searchParams.set('reload', Date.now().toString());
      window.location.href = url.toString();
    }
  };

  const pxSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <button
      type="button"
      id="headerCacheRefreshBtn"
      onClick={handleHardRefresh}
      disabled={refreshing}
      title="Clear cache and reload latest version"
      aria-label="Clear cache and reload latest version"
      className={`eg-cache-buster ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '6px' : '8px',
        background: 'transparent',
        border: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))',
        borderRadius: 'var(--eg-radius-md, 8px)',
        color: 'var(--eg-text-primary, inherit)',
        cursor: refreshing ? 'wait' : 'pointer',
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
        width={pxSize}
        height={pxSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          animation: refreshing ? 'egSpin 1s linear infinite' : 'none',
        }}
      >
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
      {showLabel && (
        <span style={{ fontSize: '13px', fontWeight: 500 }}>
          {refreshing ? 'Refreshing...' : 'Clear Cache'}
        </span>
      )}
      <style>{`
        @keyframes egSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
