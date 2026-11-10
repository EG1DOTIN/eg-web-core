import { default as React } from 'react';
import { UpdateItem, ReleaseAsset } from '../../services/updatesService';
export type { UpdateItem, ReleaseAsset };
export type UpdateEntry = UpdateItem;
export interface FilterTabOption {
    id: string;
    label: string;
    filter?: (item: UpdateItem) => boolean;
}
export interface UpdatesTimelineProps {
    /** Array of update items loaded from static JSON or live GitHub releases */
    updates: UpdateItem[];
    /** Optional title displayed at top of the timeline */
    title?: string;
    /** Optional subtitle displayed below the title */
    subtitle?: string;
    /** Custom filter tabs to display above timeline. If not specified, automatically infers (All, Website, Apps, etc.) */
    filterTabs?: FilterTabOption[];
    /** Initially active filter tab ID (default: 'all') */
    defaultFilter?: string;
    /** Whether to show item count badges on filter tab buttons (default: true) */
    showFilterCounts?: boolean;
    /** Whether to show a live keyword search input (default: true) */
    showSearch?: boolean;
    /** Placeholder text for live search input */
    searchPlaceholder?: string;
    /** Callback for client-side routing on action button clicks */
    onNavigate?: (href: string) => void;
    /** Callback fired when an update item action is clicked */
    onUpdateClick?: (update: UpdateItem) => void;
    /** Storage key used to mark seen update IDs (default: 'eg_seen_updates') */
    seenStorageKey?: string;
    /** Message displayed when no updates match active filter/search */
    emptyMessage?: string;
    /** Optional custom action button label resolver */
    getActionLabel?: (item: UpdateItem) => string;
    /** Optional container class name */
    className?: string;
    /** Optional inline container styles */
    style?: React.CSSProperties;
}
/**
 * Comprehensive vertical updates timeline component featuring category filter pills,
 * dynamic item counts, keyword search, platform download pills, and context-aware action triggers.
 *
 * @param props - UpdatesTimelineProps configuration
 * @returns Fully styled and interactive timeline component
 *
 * @example
 * ```tsx
 * <UpdatesTimeline
 *   updates={updatesData}
 *   title="Release History"
 *   subtitle="All product updates, improvements, and fixes"
 *   onNavigate={(url) => window.location.href = url}
 * />
 * ```
 */
export declare const UpdatesTimeline: React.FC<UpdatesTimelineProps>;
