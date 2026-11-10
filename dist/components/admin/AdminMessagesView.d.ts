import { default as React } from 'react';
import { FirebaseAppConfig } from '../../services/firebase';
export interface AdminMessageItem {
    id: string;
    name: string;
    email: string;
    contact?: string;
    message: string;
    appName?: string;
    createdAt?: string | number | {
        seconds?: number;
        nanoseconds?: number;
    } | null;
    userAgent?: string;
    ip?: string;
    [key: string]: unknown;
}
export interface AdminMessagesViewProps {
    /** Firestore database instance (defaults to useFirebase().db or window.db) */
    db?: unknown;
    /** Firebase app configuration */
    firebaseConfig?: FirebaseAppConfig;
    /** Collection name storing messages (default: 'messages') */
    collectionName?: string;
    /** Optional custom fetcher override (e.g. for custom backends) */
    customFetcher?: () => Promise<AdminMessageItem[]>;
    /** Optional custom delete handler */
    customDeleteHandler?: (id: string) => Promise<void>;
    /** Title for the view (default: 'Contact Inquiries & Messages') */
    title?: string;
    /** Custom wrapper style */
    style?: React.CSSProperties;
    /** Custom class name */
    className?: string;
}
/**
 * Administrative inquiries and messages viewer with one-click reply and safe deletion.
 *
 * @param props - AdminMessagesViewProps configuration
 * @returns Messages management console
 *
 * @example
 * ```tsx
 * <AdminMessagesView
 *   collectionName="messages"
 *   title="User Inquiries"
 * />
 * ```
 */
export declare const AdminMessagesView: React.FC<AdminMessagesViewProps>;
