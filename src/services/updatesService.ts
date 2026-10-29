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
export function formatBytes(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i] || 'MB'}`;
}

/**
 * Format ISO timestamp to standard month and year date (e.g. "Oct 18, 2026").
 */
export function formatReleaseDate(isoDate?: string): string {
  if (!isoDate) return 'Recent';
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Detect binary platform from file extension or file name conventions.
 */
export function detectPlatform(filename: string): ReleaseAsset['platform'] {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.exe') || lower.endsWith('.msi')) return 'windows';
  if (lower.endsWith('.zip') && (lower.includes('win') || lower.includes('windows'))) return 'windows';
  if (lower.endsWith('.appimage') || lower.endsWith('.tar.gz') || lower.endsWith('.deb') || lower.endsWith('.rpm')) return 'linux';
  if (lower.endsWith('.dmg') || (lower.endsWith('.zip') && (lower.includes('mac') || lower.includes('darwin')))) return 'macos';
  if (lower.includes('checksum') || lower.includes('sha256') || lower.endsWith('.txt') || lower.endsWith('.asc')) return 'checksum';
  if (lower.endsWith('.zip')) return 'windows'; // Generic zip fallback
  return 'other';
}

/**
 * Extract clean bullet highlights from a release Markdown body.
 */
export function extractHighlightsFromMarkdown(body?: string): string[] {
  if (!body) return [];
  const lines = body.split(/\r?\n/);
  const highlights: string[] = [];

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    // Matches bullets like: - Something, * Something, 1. Something
    const match = trimmed.match(/^[-*•]\s+(.*)$/) || trimmed.match(/^\d+\.\s+(.*)$/);
    if (match && match[1]) {
      const cleanBullet = match[1]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to text
        .replace(/[*_`]/g, '') // Strip markdown formatting
        .trim();
      if (cleanBullet.length > 5 && !cleanBullet.startsWith('http')) {
        highlights.push(cleanBullet);
      }
    }
    if (highlights.length >= 8) break;
  }

  return highlights;
}

/**
 * Normalize category string into one of the standard design system categories.
 */
export function normalizeCategory(cat?: string): UpdateItem['category'] {
  const raw = (cat || '').trim().toUpperCase();
  if (raw.includes('ENHANC')) return 'ENHANCEMENT';
  if (raw.includes('OPT')) return 'OPTIMIZATION';
  if (raw.includes('FEAT')) return 'FEATURE';
  if (raw.includes('BUG') || raw.includes('FIX') || raw.includes('REPAIR')) return 'BUG-FIX';
  if (raw.includes('SEC')) return 'SECURITY';
  if (raw.includes('APP')) return 'APP';
  if (raw.includes('MAINT')) return 'MAINTENANCE';
  return 'ENHANCEMENT';
}

/**
 * Fetches release history directly from a GitHub repository via GitHub Releases REST API.
 * Includes local storage caching with TTL (default 15 minutes) and automatic rate-limit backoff.
 */
export async function fetchGitHubReleases(
  repoSlug: string,
  options: FetchGitHubReleasesOptions = {}
): Promise<UpdateItem[]> {
  const cleanRepo = repoSlug.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
  const repoKey = cleanRepo.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cacheKey = options.cacheKey || `eg_gh_releases_${repoKey}`;
  const timeKey = `${cacheKey}_time`;
  const rateLimitKey = `eg_gh_ratelimit_${repoKey}`;
  const ttl = options.cacheTtlMs ?? 15 * 60 * 1000; // 15 minutes default

  // 1. Check local cache (unless forceRefresh is requested)
  if (!options.forceRefresh && typeof window !== 'undefined') {
    try {
      const cachedTime = localStorage.getItem(timeKey);
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedTime && cachedData && Date.now() - Number(cachedTime) < ttl) {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore cache parse errors
    }

    // Rate-limit backoff check
    try {
      const blockedUntil = localStorage.getItem(rateLimitKey);
      if (blockedUntil && Date.now() < Number(blockedUntil)) {
        const staleData = localStorage.getItem(cacheKey);
        if (staleData) {
          const parsed = JSON.parse(staleData);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {
      // Ignore rate limit check errors
    }
  }

  // 2. Fetch live data from GitHub Releases API
  try {
    const res = await fetch(`https://api.github.com/repos/${cleanRepo}/releases`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (res.ok) {
      const data: GitHubReleasePayload[] = await res.json();
      if (Array.isArray(data)) {
        const filtered = options.filterPrereleases ? data.filter((r) => !r.prerelease) : data;
        const normalized: UpdateItem[] = filtered.map((rel, idx) => {
          const tag = rel.tag_name || '';
          const version = tag.replace(/^v/, '');
          const highlights = extractHighlightsFromMarkdown(rel.body);
          const assets: ReleaseAsset[] = Array.isArray(rel.assets)
            ? rel.assets.map((a) => {
                const platform = detectPlatform(a.name);
                const isInstaller = a.name.toLowerCase().endsWith('.exe') || a.name.toLowerCase().endsWith('.msi') || a.name.toLowerCase().endsWith('.dmg') || a.name.toLowerCase().endsWith('.appimage');
                const isArchive = a.name.toLowerCase().endsWith('.zip') || a.name.toLowerCase().endsWith('.tar.gz');
                return {
                  name: a.name,
                  size: a.size,
                  browser_download_url: a.browser_download_url,
                  contentType: a.content_type,
                  platform,
                  isInstaller,
                  isArchive,
                };
              })
            : [];

          const repoName = cleanRepo.split('/')[1] || cleanRepo;
          const cleanBody = (rel.body || '').replace(/<!--[\s\S]*?-->/g, '').trim();

          return {
            id: String(rel.id || tag),
            version,
            title: rel.name || `${repoName} ${tag}`,
            date: formatReleaseDate(rel.published_at || rel.created_at),
            timestamp: rel.published_at ? new Date(rel.published_at).getTime() : Date.now(),
            type: 'release',
            category: idx === 0 ? 'FEATURE' : 'ENHANCEMENT',
            badge: idx === 0 ? 'Latest Release' : 'Release',
            description: cleanBody ? cleanBody.slice(0, 260) + (cleanBody.length > 260 ? '...' : '') : `Official GitHub release for ${repoName} ${tag}.`,
            highlights,
            link: rel.html_url,
            linkText: 'View on GitHub →',
            rawBody: cleanBody,
            assets,
            htmlUrl: rel.html_url,
            isLatest: idx === 0,
            prerelease: rel.prerelease,
          };
        });

        // Persist fresh data to local cache
        if (typeof window !== 'undefined' && normalized.length > 0) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(normalized));
            localStorage.setItem(timeKey, String(Date.now()));
            localStorage.removeItem(rateLimitKey);
          } catch {
            // Ignore storage quota errors
          }
        }

        return normalized;
      }
    } else if (res.status === 403 || res.status === 429) {
      // Backoff for 15 minutes if unauthenticated rate limit is exhausted
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(rateLimitKey, String(Date.now() + 15 * 60 * 1000));
        } catch {
          // Ignore storage errors
        }
      }
    }
  } catch (err) {
    console.warn(`[updatesService] Live GitHub releases fetch failed for ${cleanRepo}:`, err);
  }

  // 3. Fallback to stale cached data if network request failed
  if (typeof window !== 'undefined') {
    try {
      const staleData = localStorage.getItem(cacheKey);
      if (staleData) {
        const parsed = JSON.parse(staleData);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  return [];
}

/**
 * Fetches updates from a local or hosted static JSON file (e.g. data/updates.json).
 */
export async function fetchUpdatesFromJson(
  url: string,
  options: { forceRefresh?: boolean } = {}
): Promise<UpdateItem[]> {
  try {
    const fetchUrl = options.forceRefresh
      ? `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
      : url;

    const res = await fetch(fetchUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch updates JSON: HTTP ${res.status}`);
    }

    const json = await res.json();
    const rawList: unknown[] = Array.isArray(json)
      ? json
      : json && Array.isArray((json as { updates?: unknown[] }).updates)
      ? (json as { updates: unknown[] }).updates
      : [];

    return rawList.map((raw: any, idx) => {
      const id = String(raw.id || `update-${idx}`);
      const type = (raw.type || 'website').toLowerCase();
      const category = normalizeCategory(raw.category || raw.badge);
      const isExternal = typeof raw.link === 'string' && raw.link.startsWith('http');
      
      let defaultLinkText = 'Release Notes →';
      if (type === 'app') {
        defaultLinkText = isExternal ? 'Open Application ↗' : 'Open Application →';
      } else if (type === 'website') {
        defaultLinkText = 'Release Notes →';
      }

      return {
        id,
        version: raw.version ? String(raw.version).replace(/^v/, '') : undefined,
        title: raw.title || `Update ${id}`,
        date: raw.date || 'Recent',
        type,
        category,
        icon: raw.icon || (category === 'BUG-FIX' ? 'tool' : category === 'FEATURE' ? 'star' : category === 'OPTIMIZATION' ? 'speedometer' : category === 'APP' ? 'grid' : 'sparkles'),
        badge: raw.badge || (idx === 0 ? 'New' : undefined),
        description: raw.description || '',
        highlights: Array.isArray(raw.highlights) ? raw.highlights : undefined,
        link: raw.link || '#',
        linkText: raw.linkText || defaultLinkText,
        target: raw.target,
        rawBody: raw.rawBody || raw.description,
        isLatest: idx === 0,
      };
    });
  } catch (err) {
    console.warn(`[updatesService] Failed to load updates JSON from ${url}:`, err);
    return [];
  }
}

/**
 * Universal update loader that automatically routes between static JSON and live GitHub Releases.
 */
export async function loadUpdates(options: LoadUpdatesOptions): Promise<UpdateItem[]> {
  const { updatesUrl, githubRepo, preferGitHub = false, cacheTtlMs, forceRefresh } = options;

  if (preferGitHub && githubRepo) {
    const ghReleases = await fetchGitHubReleases(githubRepo, { cacheTtlMs, forceRefresh });
    if (ghReleases.length > 0) return ghReleases;
    if (updatesUrl) {
      return fetchUpdatesFromJson(updatesUrl, { forceRefresh });
    }
    return [];
  }

  if (updatesUrl) {
    const jsonUpdates = await fetchUpdatesFromJson(updatesUrl, { forceRefresh });
    if (jsonUpdates.length > 0) return jsonUpdates;
  }

  if (githubRepo) {
    return fetchGitHubReleases(githubRepo, { cacheTtlMs, forceRefresh });
  }

  return [];
}
