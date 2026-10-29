/**
 * @file useUpdates.ts
 * @description React hook for loading platform updates, changelogs, and releases from static JSON
 * or live GitHub Releases API with automated background caching.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  UpdateItem,
  LoadUpdatesOptions,
  loadUpdates,
} from '../services/updatesService';

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
export function useUpdates(optionsOrUrl: string | UseUpdatesOptions = 'data/updates.json') {
  const options: UseUpdatesOptions =
    typeof optionsOrUrl === 'string'
      ? optionsOrUrl.includes('/') && !optionsOrUrl.endsWith('.json')
        ? { githubRepo: optionsOrUrl }
        : { updatesUrl: optionsOrUrl }
      : optionsOrUrl;

  const [updates, setUpdates] = useState<UpdateItem[]>(options.initialUpdates || []);
  const [loading, setLoading] = useState<boolean>(!options.initialUpdates || options.initialUpdates.length === 0);
  const [error, setError] = useState<Error | null>(null);

  const fetchUpdatesData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadUpdates({ ...options, forceRefresh });
      setUpdates(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [options.updatesUrl, options.githubRepo, options.preferGitHub, options.cacheTtlMs]);

  useEffect(() => {
    fetchUpdatesData(false);
  }, [fetchUpdatesData]);

  const refresh = useCallback(() => {
    return fetchUpdatesData(true);
  }, [fetchUpdatesData]);

  return {
    updates,
    loading,
    error,
    refresh,
  };
}
