import { default as React } from 'react';
export interface AnalyticsLogItem {
    id: string;
    timestamp: string;
    appName: string;
    pageVisited: string;
    referrer?: string;
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    postal?: string;
    org?: string;
    timezone?: string;
    os?: string;
    browser?: string;
    screen?: string;
    language?: string;
    location?: string;
    raw?: Record<string, unknown>;
}
export interface AnalyticsMetaState {
    totalVisitors: number;
    todayCount: number;
    todayDate: string;
    currentPage: number;
}
export interface AdminAnalyticsViewProps {
    /** Firestore database instance (defaults to window.db) */
    db?: unknown;
    /** Collection name storing analytics meta and pages (default: 'visitor_analytics') */
    collectionName?: string;
    /** Domain list for filtering. If omitted, domains are automatically extracted from loaded records */
    domains?: string[];
    /** Optional custom fetcher override (for custom backends or static previews) */
    customFetcher?: () => Promise<{
        meta: AnalyticsMetaState;
        logs: AnalyticsLogItem[];
    }>;
    /** Custom wrapper style */
    style?: React.CSSProperties;
    /** Custom class name */
    className?: string;
}
/**
 * Comprehensive visitor telemetry analytics dashboard with bucket pagination and detail modal.
 *
 * @param props - AdminAnalyticsViewProps configuration
 * @returns Visitor analytics management console
 *
 * @example
 * ```tsx
 * <AdminAnalyticsView
 *   collectionName="visitor_analytics"
 *   domains={['All Domains', 'eg1.in', 'mchess.eg1.in']}
 * />
 * ```
 */
export declare const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps>;
