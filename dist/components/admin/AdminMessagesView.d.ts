import { default as React } from 'react';
import { FirebaseAppConfig } from '../../services/firebase';
export interface AdminMessageItem {
    id: string;
    name: string;
    email: string;
    contact?: string;
    message: string;
    appName?: string;
    createdAt?: any;
    userAgent?: string;
    ip?: string;
    [key: string]: any;
}
export interface AdminMessagesViewProps {
    /** Firestore database instance (defaults to useFirebase().db or window.db) */
    db?: any;
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
export declare const AdminMessagesView: React.FC<AdminMessagesViewProps>;
