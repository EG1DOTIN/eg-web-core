import { useState, useEffect, useCallback, useMemo } from 'react';
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
export const useNotifications = ({
  storageKey = 'notifications_seen_v1',
  initialItems = [],
  fetchUrl,
  maxItems = 5,
}: UseNotificationsOptions = {}) => {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveReadIds = useCallback(
    (newIds: string[]) => {
      setReadIds(newIds);
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(newIds));
      } catch (e) {
        console.warn('[useNotifications] Could not persist read notification IDs:', e);
      }
    },
    [storageKey]
  );

  useEffect(() => {
    if (!fetchUrl) return;
    let active = true;

    fetch(fetchUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const newsArray: NewsItem[] = Array.isArray(data)
          ? data
          : Array.isArray(data.news)
          ? data.news
          : Array.isArray(data.updates)
          ? data.updates
          : [];
        setItems(newsArray);
      })
      .catch((err) => {
        console.warn('[useNotifications] Failed to fetch notification feed:', err);
      });

    return () => {
      active = false;
    };
  }, [fetchUrl]);

  const notifications = useMemo<NotificationItem[]>(() => {
    return items.slice(0, maxItems).map((item) => {
      const anyItem = item as Record<string, unknown>;
      return {
        id: item.id || String(anyItem.version || Math.random()),
        title: item.title || String(anyItem.title || 'Update'),
        description: (item.description || anyItem.message || '') as string,
        date: (item.date || anyItem.date || '') as string,
        link: (item.link || anyItem.link || '') as string,
        category: (item.category || anyItem.badge || '') as string,
        read: readIds.includes(item.id),
      };
    });
  }, [items, readIds, maxItems]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback(
    (id: string) => {
      if (!readIds.includes(id)) {
        saveReadIds([...readIds, id]);
      }
    },
    [readIds, saveReadIds]
  );

  const markAllAsRead = useCallback(() => {
    const allIds = Array.from(new Set([...readIds, ...items.map((i) => i.id)]));
    saveReadIds(allIds);
  }, [items, readIds, saveReadIds]);

  return {
    notifications,
    unreadCount,
    hasUnread: unreadCount > 0,
    markAsRead,
    markAllAsRead,
    setItems,
  };
};
