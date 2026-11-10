import { default as React } from 'react';
import { ContactMessagePayload } from '../../services/contactService';
import { FirebaseAppConfig } from '../../services/firebase';
export interface ContactChannel {
    id: string;
    label: string;
    value: string;
    href?: string;
    icon?: React.ReactNode;
    description?: string;
}
export interface ContactFormProps {
    /** Section / card title (default: "Any message?") */
    title?: string;
    /** Section / card subtitle or helper description */
    subtitle?: string;
    /** Form submission button label (default: "Send Enquiry ⮠") */
    submitButtonText?: string;
    /** Whether phone / contact number is required (default: true) */
    requireContactNumber?: boolean;
    /** Whether to enable arithmetic anti-spam CAPTCHA (default: true) */
    enableCaptcha?: boolean;
    /** Whether to lazy-load the CAPTCHA only upon user input focus (default: true) */
    lazyCaptcha?: boolean;
    /** Sliding window rate limiting in hours (default: 24, set 0 to disable) */
    rateLimitHours?: number;
    /** LocalStorage key for tracking submission rate limit (default: "lastMessageTime") */
    rateLimitKey?: string;
    /** Target Cloud Firestore collection name (defaults to FirebaseContext.collections.messages or "messages") */
    firestoreCollection?: string;
    /** Collection storing cross-browser and cross-device rate limit records (defaults to 'visitor_analytics') */
    analyticsCollection?: string;
    /** Direct Firestore database instance (defaults to useFirebase().db or window.db) */
    db?: unknown;
    /** Explicit Firebase app config for direct initialization */
    firebaseConfig?: FirebaseAppConfig;
    /** Application or domain name attached to inquiry payload (defaults to FirebaseContext appName or 'web-app') */
    appName?: string;
    /** Whether to bypass rate-limiting when testing on localhost (default: true) */
    allowLocalhostBypass?: boolean;
    /** Custom payload transformer to adapt to custom Firestore schema / security rules */
    transformPayload?: (payload: ContactMessagePayload) => Record<string, any>;
    /** Custom submission handler override (e.g. for non-Firebase backends: Supabase, REST, Webhooks) */
    onSubmit?: (payload: ContactMessagePayload) => Promise<{
        success: boolean;
        message?: string;
    }>;
    /** Direct communication channels for side column */
    channels?: ContactChannel[];
    /** Side column heading (default: "Connect on Other Platforms") */
    channelsTitle?: string;
    /** Side column subtitle */
    channelsSubtitle?: string;
    /** Success banner heading */
    successTitle?: string;
    /** Success message text */
    successMessage?: string;
    /** Maximum allowed character length for message (default: 2000, matching Firestore limits) */
    maxMessageLength?: number;
    /** Custom CSS class */
    className?: string;
    /** Custom container style */
    style?: React.CSSProperties;
}
export declare const ContactForm: React.FC<ContactFormProps>;
