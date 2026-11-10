/**
 * @file updatesService.ts
 * @description Universal updates and release history service supporting both static JSON feeds
 * and live GitHub Releases API with client-side TTL caching, rate-limit backoff, and platform asset parsing.
 */
export interface ReleaseAsset {
    name: string;
    size?: number;
    browser_download_url: string;
    contentType?: string;
    isInstaller?: boolean;
    isArchive?: boolean;
    platform?: 'windows' | 'linux' | 'macos' | 'checksum' | 'other';
}
export interface UpdateItem {
    id?: string;
    version?: string;
    title: string;
    date: string;
    timestamp?: number;
    type?: 'website' | 'app' | 'core' | 'release' | string;
    category?: 'FEATURE' | 'ENHANCEMENT' | 'BUG-FIX' | 'OPTIMIZATION' | 'SECURITY' | 'APP' | 'MAINTENANCE' | string;
    icon?: string;
    badge?: string;
    description?: string;
    highlights?: string[];
    link?: string;
    linkText?: string;
    target?: string;
    rawBody?: string;
    assets?: ReleaseAsset[];
    htmlUrl?: string;
    prerelease?: boolean;
    isLatest?: boolean;
    [key: string]: unknown;
}
export interface GitHubReleasePayload {
    id: number;
    node_id?: string;
    tag_name: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
    published_at?: string;
    created_at?: string;
    html_url?: string;
    assets?: Array<{
        name: string;
        size: number;
        browser_download_url: string;
        content_type?: string;
    }>;
}
export interface FetchGitHubReleasesOptions {
    cacheTtlMs?: number;
    filterPrereleases?: boolean;
    cacheKey?: string;
    forceRefresh?: boolean;
}
export interface LoadUpdatesOptions {
    updatesUrl?: string;
    githubRepo?: string;
    preferGitHub?: boolean;
    cacheTtlMs?: number;
    forceRefresh?: boolean;
}
/**
 * Format raw byte size into human-readable string (e.g., 24.5 MB).
 */
export declare function formatBytes(bytes?: number): string;
/**
 * Format ISO timestamp to standard month and year date (e.g. "Oct 18, 2026").
 */
export declare function formatReleaseDate(isoDate?: string): string;
/**
 * Detect binary platform from file extension or file name conventions.
 */
export declare function detectPlatform(filename: string): ReleaseAsset['platform'];
/**
 * Extract clean bullet highlights from a release Markdown body.
 */
export declare function extractHighlightsFromMarkdown(body?: string): string[];
/**
 * Normalize category string into one of the standard design system categories.
 */
export declare function normalizeCategory(cat?: string): UpdateItem['category'];
/**
 * Fetches release history directly from a GitHub repository via GitHub Releases REST API.
 * Includes local storage caching with TTL (default 15 minutes) and automatic rate-limit backoff.
 */
export declare function fetchGitHubReleases(repoSlug: string, options?: FetchGitHubReleasesOptions): Promise<UpdateItem[]>;
/**
 * Fetches updates from a local or hosted static JSON file (e.g. data/updates.json).
 */
export declare function fetchUpdatesFromJson(url: string, options?: {
    forceRefresh?: boolean;
}): Promise<UpdateItem[]>;
/**
 * Universal update loader that automatically routes between static JSON and live GitHub Releases.
 *
 * @param options - LoadUpdatesOptions configuration
 * @returns Array of parsed and normalized UpdateItem objects
 *
 * @example
 * ```ts
 * const updates = await loadUpdates({
 *   updatesUrl: '/data/updates.json',
 *   githubRepo: 'EG1DOTIN/eg1.in',
 * });
 * ```
 */
export declare function loadUpdates(options: LoadUpdatesOptions): Promise<UpdateItem[]>;
