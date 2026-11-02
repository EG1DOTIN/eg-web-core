import { UpdateItem, LoadUpdatesOptions } from '../services/updatesService';
export interface UseUpdatesOptions extends LoadUpdatesOptions {
    /** Optional initial static updates array */
    initialUpdates?: UpdateItem[];
}
/**
 * Hook to fetch and synchronize changelogs and release notes from either static JSON
 * or dynamic GitHub Releases with caching and background refreshing.
 *
 * @example
 * ```tsx
 * // From static JSON:
 * const { updates, loading, refresh } = useUpdates({ updatesUrl: 'data/updates.json' });
 *
 * // From GitHub repository:
 * const { updates, loading, refresh } = useUpdates({ githubRepo: 'EG1DOTIN/pyEGClamUI' });
 * ```
 */
export declare function useUpdates(optionsOrUrl?: string | UseUpdatesOptions): {
    updates: UpdateItem[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
