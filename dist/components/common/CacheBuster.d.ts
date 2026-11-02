import { default as React } from 'react';
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
export declare const CacheBuster: React.FC<CacheBusterProps>;
