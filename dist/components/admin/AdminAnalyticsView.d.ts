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
    raw?: any;
}
export interface AnalyticsMetaState {
    totalVisitors: number;
    todayCount: number;
    todayDate: string;
    currentPage: number;
}
export interface AdminAnalyticsViewProps {
    /** Firestore database instance (defaults to window.db) */
    db?: any;
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
export declare const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps>;
