import { NewsItem } from '../services/DataCache';
export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    date?: string;
    link?: string;
    category?: string;
    read?: boolean;
}
export interface UseNotificationsOptions {
    storageKey?: string;
    initialItems?: NewsItem[];
    fetchUrl?: string;
    maxItems?: number;
}
/**
 * Hook to manage notification state, unread badges, mark-as-read actions,
 * and localStorage read status persistence.
 *
 * @example
 * ```tsx
 * const { notifications, unreadCount, hasUnread, markAsRead, markAllAsRead } = useNotifications({
 *   fetchUrl: 'data/website_content.json',
 *   maxItems: 5,
 * });
 * ```
 */
export declare const useNotifications: ({ storageKey, initialItems, fetchUrl, maxItems, }?: UseNotificationsOptions) => {
    notifications: NotificationItem[];
    unreadCount: number;
    hasUnread: boolean;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    setItems: import('react').Dispatch<import('react').SetStateAction<NewsItem[]>>;
};
