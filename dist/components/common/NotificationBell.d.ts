import { default as React } from 'react';
import { NotificationItem } from '../../hooks/useNotifications';
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
export declare const NotificationBell: React.FC<NotificationBellProps>;
