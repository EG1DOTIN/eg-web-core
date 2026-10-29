import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';

export interface ProductButton {
  label?: string;
  url?: string;
  title?: string;
  icon?: string;
  sameTab?: boolean | string;
  [key: string]: unknown;
}

export interface ProductItem {
  id: string;
  slug?: string;
  title: string;
  name?: string;
  subtitle?: string;
  category?: string;
  categories?: string;
  product_type?: string;
  description?: string;
  short_description?: string;
  full_description?: string;
  icon?: string;
  image?: string;
  imageUrl?: string;
  version?: string;
  rawVersion?: unknown;
  order?: number;
  featured?: boolean;
  active?: boolean | string | number;
  button1?: ProductButton | string;
  button2?: ProductButton | string;
  webapp_link?: string;
  attach_upload_file_1?: string;
  attach_upload_file_2?: string;
  sourceUrl?: string;
  markdownBody?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  [key: string]: unknown;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  heading?: string;
  description: string;
  short_description?: string;
  full_description?: string;
  content?: string;
  date: string;
  author?: string;
  tags?: string[];
  category?: string;
  readingTime?: string;
  output_image?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  category?: string;
  link?: string;
  [key: string]: unknown;
}

export interface PageContent {
  title?: string;
  subtitle?: string;
  content?: string;
  [key: string]: unknown;
}

export interface WebsiteContent {
  news?: NewsItem[];
  about?: PageContent;
  blog?: PageContent;
  contact?: PageContent;
  apps?: PageContent;
  privacy?: PageContent;
  [key: string]: unknown;
}

export class DataCacheService {
  public products: ProductItem[] | null = null;
  public blogs: BlogPostItem[] | null = null;
  public news: NewsItem[] | null = null;
  public pages: Record<string, PageContent> | null = null;

  private registeredPrefixes: Set<string> = new Set(['cache_', 'gh_version_', 'analytics_']);
  private registeredKeys: Set<string> = new Set(['analytics_consent', 'analytics_optout', 'analytics_session']);

  private CACHE_TTL_DEV = 60000; // 60s
  private CACHE_TTL_PROD = 3600000; // 1 hour

  /**
   * Registers a storage key prefix for local persistence and cache purging.
   * Consumers (e.g. eg1.in, mchess.eg1.in, av.eg1.in) register their own application prefixes.
   */
  public registerStoragePrefix(prefix: string): void {
    if (prefix && typeof prefix === 'string') {
      this.registeredPrefixes.add(prefix);
    }
  }

  /**
   * Registers a specific storage key for cache management and purging.
   */
  public registerStorageKey(key: string): void {
    if (key && typeof key === 'string') {
      this.registeredKeys.add(key);
    }
  }

  private isDev(): boolean {
    if (typeof window === 'undefined') return false;
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:';
  }

  private getTTL(): number {
    return this.isDev() ? this.CACHE_TTL_DEV : this.CACHE_TTL_PROD;
  }

  private getPersistent<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      if (window.location.search.includes('nocache') || window.location.search.includes('refresh')) {
        return null;
      }
      const data = localStorage.getItem(key);
      const time = localStorage.getItem(`${key}_time`);
      if (data && time && Date.now() - parseInt(time, 10) < this.getTTL()) {
        return JSON.parse(data) as T;
      }
    } catch (e) {
      console.warn(`[DataCache] Persistent cache read error for ${key}:`, e);
    }
    return null;
  }

  private setPersistent<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_time`, Date.now().toString());
    } catch (e) {
      console.warn(`[DataCache] Persistent cache write error for ${key}:`, e);
    }
  }

  public clearCache(type?: string): void {
    if (typeof window === 'undefined') return;
    if (!type || type === 'ALL') {
      this.products = null;
      this.news = null;
      this.pages = null;
      this.blogs = null;
      try {
        const prefixes = Array.from(this.registeredPrefixes);
        const keys = this.registeredKeys;
        const keysToRemove = Object.keys(localStorage).filter(
          (k) => keys.has(k) || prefixes.some((p) => k.startsWith(p))
        );
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (e) {
        console.warn('[DataCache] Error clearing localStorage:', e);
      }
    }
  }

  /**
   * Fetches website content JSON (news, page intros, copy)
   */
  public async getWebsiteContent(contentUrl = 'data/website_content.json'): Promise<WebsiteContent | null> {
    const cacheKey = `eg_website_content_v2_${encodeURIComponent(contentUrl)}`;
    const cached = this.getPersistent<WebsiteContent>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(contentUrl);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = (await res.json()) as WebsiteContent;
      this.setPersistent(cacheKey, data);
      return data;
    } catch (e) {
      console.warn('[DataCache] Failed to fetch website_content.json:', e);
      return null;
    }
  }

  /**
   * Fetches news items
   */
  public async getNews(contentUrl = 'data/website_content.json'): Promise<NewsItem[]> {
    if (this.news && this.news.length > 0) return this.news;
    const content = await this.getWebsiteContent(contentUrl);
    if (content && Array.isArray(content.news)) {
      this.news = content.news;
      return this.news;
    }
    return [];
  }

  /**
   * Fetches static page content snippet by key (e.g., 'about', 'contact', 'apps')
   */
  public async getPageContent(pageKey: string, contentUrl = 'data/website_content.json'): Promise<PageContent | null> {
    const content = await this.getWebsiteContent(contentUrl);
    if (!content) return null;
    const pagesObj = (content.pages as Record<string, PageContent>) || content;
    if (pagesObj && pagesObj[pageKey]) {
      return pagesObj[pageKey] as PageContent;
    }
    if (content[pageKey]) {
      return content[pageKey] as PageContent;
    }
    return null;
  }

  public KNOWN_APP_SLUGS: string[] = [];

  /**
   * Registers application slugs for Markdown fallback ingestion.
   */
  public registerAppSlugs(slugs: string[]): void {
    this.KNOWN_APP_SLUGS = Array.from(new Set([...this.KNOWN_APP_SLUGS, ...slugs]));
  }

  /**
   * Helper to parse YAML frontmatter and Markdown body of an application file.
   */
  public parseAppMarkdown(rawText: string, defaultSlug?: string): ProductItem | null {
    if (!rawText) return null;
    const match = rawText.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);
    if (!match) return null;

    const yamlContent = match[1];
    const markdownBody = (match[2] || '').trim();
    const meta: Record<string, any> = {};
    const lines = yamlContent.split(/\r?\n/);
    let currentParentKey: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const isIndented = /^(\s{2,}|\t)/.test(line);
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const rawKey = line.slice(0, colonIdx).trim();
      let rawVal = line.slice(colonIdx + 1).trim();
      const hadQuotes = (rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"));

      if (hadQuotes) {
        rawVal = rawVal.slice(1, -1);
      }

      if (isIndented && currentParentKey) {
        if (!meta[currentParentKey] || typeof meta[currentParentKey] !== 'object') {
          meta[currentParentKey] = {};
        }
        meta[currentParentKey][rawKey] = rawVal;
      } else {
        if (rawVal === '' && !hadQuotes) {
          currentParentKey = rawKey;
          meta[currentParentKey] = {};
        } else {
          currentParentKey = null;
          meta[rawKey] = rawVal;
        }
      }
    }

    let bodyHtml = '';
    try {
      bodyHtml = sanitizeHtml(marked.parse(markdownBody) as string);
    } catch {
      bodyHtml = sanitizeHtml('<p>' + markdownBody.replace(/\n\n+/g, '</p><p>') + '</p>');
    }

    const productName = meta.name || meta.product_name || meta.title || defaultSlug || 'Unknown App';
    const slug = meta.slug || (defaultSlug || productName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-'));
    const appId = meta.id || slug;

    // Resolve version string
    let versionStr = '1.0.0';
    if (meta.version && typeof meta.version === 'object') {
      versionStr = meta.version['version-string'] || meta.version.versionString || meta.version.version || '1.0.0';
    } else if (typeof meta.version === 'string') {
      versionStr = meta.version;
    }

    return {
      id: appId,
      title: productName,
      name: productName,
      slug: slug,
      category: meta.category || meta.categories || 'General',
      categories: meta.categories || meta.category || 'General',
      product_type: meta.product_type || 'Desktop App',
      version: versionStr,
      rawVersion: meta.version,
      active: meta.active !== undefined ? meta.active : '1',
      icon: (typeof meta.icon === 'string' && meta.icon.trim()) || (typeof meta.imageUrl === 'string' && meta.imageUrl.trim()) || '',
      imageUrl: (typeof meta.imageUrl === 'string' && meta.imageUrl.trim()) || (typeof meta.icon === 'string' && meta.icon.trim()) || '',
      short_description: meta.short_description || meta.description || '',
      description: meta.description || meta.short_description || '',
      full_description: bodyHtml || meta.description || meta.short_description || '',
      markdownBody: markdownBody,
      webapp_link: meta.webapp_link || '',
      attach_upload_file_1: meta.attach_upload_file_1 || '',
      button1: meta.button1 || (meta.product_type === 'WebApp' && meta.webapp_link
        ? { LAUNCH: meta.webapp_link, sameTab: 'false' }
        : { 'VIEW DETAILS': `apps.html?title=${slug}`, sameTab: 'true' }),
      button2: meta.button2 || (meta.attach_upload_file_1
        ? { DOWNLOAD: meta.attach_upload_file_1, sameTab: 'true' }
        : undefined),
      createdAt: meta.createdAt || '',
      updatedAt: meta.updatedAt || '',
    };
  }

  public getRequestedAppSlug(): string | null {
    if (typeof window === 'undefined' || !window.location || !window.location.search) return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const title = params.get('title') || params.get('id');
      if (title) {
        return title.trim().toLowerCase().replace(/_/g, '-');
      }
    } catch {
      // Ignore
    }
    return null;
  }

  /**
   * Fetches applications/products catalog with dynamic markdown ingestion,
   * chronological sorting, and static JSON fallback.
   */
  public async getProducts(
    optionsOrUrl: string | { productsUrl?: string; mdDir?: string; slugs?: string[]; filterActive?: boolean } = 'data/apps.json'
  ): Promise<ProductItem[]> {
    const options = typeof optionsOrUrl === 'string' ? { productsUrl: optionsOrUrl } : optionsOrUrl;
    const productsUrl = options.productsUrl || 'data/apps.json';
    const mdDir = options.mdDir || 'data/apps/';
    const filterActive = options.filterActive !== false;

    if (this.products && this.products.length > 0) {
      return filterActive
        ? this.products.filter((p) => p.active === '1' || p.active === 1 || p.active === true || p.active === undefined)
        : this.products;
    }

    const cacheKey = `eg_apps_cache_v4_${encodeURIComponent(productsUrl)}`;
    const cached = this.getPersistent<ProductItem[]>(cacheKey);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      this.products = cached;
      return filterActive
        ? cached.filter((p) => p.active === '1' || p.active === 1 || p.active === true || p.active === undefined)
        : cached;
    }

    // 1. Attempt to fetch Markdown files first
    const slugs = (options.slugs && options.slugs.length > 0 ? options.slugs : this.KNOWN_APP_SLUGS).slice();
    const requested = this.getRequestedAppSlug();
    if (requested && !slugs.includes(requested)) {
      slugs.unshift(requested);
    }

    try {
      const fetchPromises = slugs.map(async (slug) => {
        try {
          const cleanSlug = slug.trim();
          const candidates = [
            `${mdDir}${cleanSlug.toLowerCase()}.md`,
            `${mdDir}${cleanSlug}.md`,
          ];
          let text: string | null = null;
          for (const cand of candidates) {
            try {
              const res = await fetch(cand);
              if (res.ok) {
                text = await res.text();
                break;
              }
            } catch {
              // Ignore candidate error
            }
          }
          if (!text) return null;
          return this.parseAppMarkdown(text, cleanSlug);
        } catch {
          return null;
        }
      });

      const loadedApps = await Promise.all(fetchPromises);
      const validApps = loadedApps.filter((a): a is ProductItem => a !== null);

      if (validApps.length > 0) {
        // Chronological sort: latest app on top
        validApps.sort((a, b) => {
          const timeA = new Date((a.createdAt as string) || (a.updatedAt as string) || 0).getTime();
          const timeB = new Date((b.createdAt as string) || (b.updatedAt as string) || 0).getTime();
          if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
            return timeB - timeA;
          }
          return String(b.id || '').localeCompare(String(a.id || ''));
        });

        this.products = validApps;
        this.setPersistent(cacheKey, validApps);
        return filterActive
          ? validApps.filter((p) => p.active === '1' || p.active === 1 || p.active === true || p.active === undefined)
          : validApps;
      }
    } catch (e) {
      console.warn('[DataCache] Failed loading markdown apps:', e);
    }

    // 2. Fallback to static JSON
    try {
      const res = await fetch(productsUrl);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = (await res.json()) as ProductItem[];

      data.sort((a, b) => {
        const timeA = new Date((a.createdAt as string) || (a.updatedAt as string) || 0).getTime();
        const timeB = new Date((b.createdAt as string) || (b.updatedAt as string) || 0).getTime();
        if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
          return timeB - timeA;
        }
        return String(b.id || '').localeCompare(String(a.id || ''));
      });

      this.products = data;
      this.setPersistent(cacheKey, data);
      return filterActive
        ? data.filter((p) => p.active === '1' || p.active === 1 || p.active === true || p.active === undefined)
        : data;
    } catch (e) {
      console.warn('[DataCache] Failed to fetch apps.json fallback:', e);
      return [];
    }
  }

  /**
   * Extracts 'owner/repo' from GitHub URLs
   */
  public extractGithubRepo(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/github\.com\/([^/]+)\/([^/\s#?]+)/i);
    if (match) {
      const owner = match[1];
      let repo = match[2];
      if (repo.endsWith('.git')) repo = repo.slice(0, -4);
      const reserved = ['features', 'about', 'topics', 'collections', 'site', 'orgs', 'users', 'pricing', 'explore'];
      if (reserved.includes(owner.toLowerCase())) return null;
      return `${owner}/${repo}`;
    }
    return null;
  }

  /**
   * Finds any GitHub repository referenced in a product object
   */
  public findGithubRepoInProduct(product: ProductItem): string | null {
    if (!product) return null;
    const urls: string[] = [];

    const extractUrls = (btn: ProductButton | string | undefined) => {
      if (!btn) return;
      if (typeof btn === 'string') urls.push(btn);
      else if (typeof btn === 'object') {
        Object.values(btn).forEach((v) => {
          if (typeof v === 'string') urls.push(v);
        });
      }
    };

    extractUrls(product.button1);
    extractUrls(product.button2);
    if (typeof product.webapp_link === 'string') urls.push(product.webapp_link);

    for (const url of urls) {
      const repo = this.extractGithubRepo(url);
      if (repo) return repo;
    }
    return null;
  }

  /**
   * Fetches latest release or tag version from GitHub with local caching
   */
  public async getGithubVersion(repo: string): Promise<string | null> {
    if (!repo || typeof window === 'undefined' || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repo)) return null;
    const cacheKey = `gh_version_${repo.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const cached = this.getPersistent<string>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      if (res.ok) {
        const data = await res.json();
        let tag = data.tag_name || data.name;
        if (tag) {
          tag = tag.trim().replace(/^v/i, '');
          this.setPersistent(cacheKey, tag);
          return tag;
        }
      }

      // Fallback to tags
      const tagsRes = await fetch(`https://api.github.com/repos/${repo}/tags?per_page=1`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      if (tagsRes.ok) {
        const tags = await tagsRes.json();
        if (Array.isArray(tags) && tags.length > 0 && tags[0]?.name) {
          const tag = tags[0].name.trim().replace(/^v/i, '');
          this.setPersistent(cacheKey, tag);
          return tag;
        }
      }
    } catch (e) {
      console.warn(`[DataCache] Could not fetch GitHub version for ${repo}:`, e);
    }
    return null;
  }

  /**
   * Synchronizes version numbers from GitHub in background and updates elements
   */
  public async syncGithubVersions(
    products: ProductItem[],
    onVersionResolved?: (productId: string, version: string) => void
  ): Promise<void> {
    if (!Array.isArray(products) || products.length === 0) return;

    for (const product of products) {
      const repo = this.findGithubRepoInProduct(product);
      if (!repo) continue;

      this.getGithubVersion(repo).then((version) => {
        if (version) {
          product.version = version;
          if (onVersionResolved) {
            onVersionResolved(product.id, version);
          }
        }
      });
    }
  }

  /**
   * Resolves display version string for a product
   */
  public resolveProductVersion(product: ProductItem): string {
    if (!product) return '1.0.0';

    const rawVer = (product.rawVersion || product.version) as any;
    if (rawVer && typeof rawVer === 'object') {
      const isFetchGithub =
        rawVer['fetch-github'] === true ||
        String(rawVer['fetch-github']).toLowerCase() === 'true' ||
        rawVer.fetchGithub === true ||
        String(rawVer.fetchGithub).toLowerCase() === 'true';

      const fallbackStr = rawVer['version-string'] || rawVer.versionString || rawVer.version || '1.0.0';

      if (isFetchGithub) {
        const repo = this.findGithubRepoInProduct(product);
        if (repo && typeof window !== 'undefined') {
          const cacheKey = `gh_version_${repo.replace(/[^a-zA-Z0-9_]/g, '_')}`;
          const cached = this.getPersistent<string>(cacheKey);
          if (cached) return cached.trim();
        }
      }
      return String(fallbackStr).trim();
    }

    if (product.version && typeof product.version === 'string' && product.version.trim()) {
      return product.version.trim().replace(/^v/i, '');
    }

    const repo = this.findGithubRepoInProduct(product);
    if (repo && typeof window !== 'undefined') {
      const cacheKey = `gh_version_${repo.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const cached = this.getPersistent<string>(cacheKey);
      if (cached) return cached;
    }
    return '1.0.0';
  }
  public KNOWN_BLOG_IDS: string[] = [];

  /**
   * Registers blog article IDs for Markdown fallback ingestion.
   */
  public registerBlogIds(ids: string[]): void {
    this.KNOWN_BLOG_IDS = Array.from(new Set([...this.KNOWN_BLOG_IDS, ...ids]));
  }

  /**
   * Helper to parse YAML frontmatter and Markdown body of a blog post file.
   */
  public parseBlogMarkdown(rawText: string, defaultId?: string): BlogPostItem | null {
    if (!rawText) return null;
    const match = rawText.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/);
    if (!match) return null;

    const yamlContent = match[1];
    const markdownBody = (match[2] || '').trim();
    const meta: Record<string, any> = {};
    const lines = yamlContent.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const rawKey = line.slice(0, colonIdx).trim();
      let rawVal: any = line.slice(colonIdx + 1).trim();

      if ((rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
        rawVal = rawVal.slice(1, -1);
      } else if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
        const inner = rawVal.slice(1, -1);
        rawVal = inner.split(',').map((item: string) => item.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      }

      meta[rawKey] = rawVal;
    }

    const cleanId = String(meta.id || defaultId || '').trim().replace(/^id/i, '');
    const title = meta.title || meta.heading || `Blog ${cleanId}`;
    const tags = Array.isArray(meta.tags)
      ? meta.tags
      : meta.category
      ? [meta.category]
      : ['General'];

    const plainDesc = (meta.short_description || meta.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const shortDesc = plainDesc.length > 140 ? plainDesc.slice(0, 140) + '...' : plainDesc;

    const wordCount = (markdownBody || '').split(/\s+/).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    const readingTime = `${minutes} min read`;

    return {
      id: cleanId,
      slug: meta.slug || `post-${cleanId}`,
      title,
      heading: meta.heading || title,
      description: shortDesc,
      short_description: shortDesc,
      content: markdownBody,
      date: meta.createdAt || meta.release_date || meta.date || '2026',
      author: meta.author || 'Author',
      tags,
      category: meta.category || (tags.length > 0 ? tags[0] : 'General'),
      readingTime: meta.readingTime || readingTime,
      output_image: meta.output_image || meta.imageUrl || `assets/img/blog/id${cleanId}.webp`,
    };
  }

  /**
   * Fetches blog articles dataset from blog-index.json or individual Markdown files.
   */
  public async getBlogs(
    indexUrl = 'data/blog-index.json',
    blogDir = 'data/blog/',
    blogIds?: string[]
  ): Promise<BlogPostItem[]> {
    if (this.blogs && this.blogs.length > 0) return this.blogs;

    const cacheKey = `eg_blogs_cache_v3_${encodeURIComponent(indexUrl)}`;
    const cached = this.getPersistent<BlogPostItem[]>(cacheKey);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      this.blogs = cached;
      return cached;
    }

    // 1. Try static pre-indexed JSON for fast instant delivery (0 Firestore reads)
    try {
      const res = await fetch(indexUrl);
      if (res.ok) {
        const data = (await res.json()) as BlogPostItem[];
        if (Array.isArray(data) && data.length > 0) {
          const normalized = data.map((item) => {
            const cleanId = String(item.id).trim().replace(/^id/i, '');
            const tags = Array.isArray(item.tags)
              ? item.tags.flatMap((t: string) => t.split(',').map((s) => s.trim())).filter(Boolean)
              : [item.category || 'General'];
            return {
              ...item,
              id: cleanId,
              slug: item.slug || `post-${cleanId}`,
              tags,
              category: item.category || (tags.length > 0 ? tags[0] : 'General'),
              short_description: item.short_description || item.description || '',
              description: item.description || item.short_description || '',
              output_image: item.output_image || item.imageUrl || `assets/img/blog/id${cleanId}.webp`,
            };
          });

          normalized.sort((a, b) => {
            const numA = Number(a.id);
            const numB = Number(b.id);
            if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
            return String(b.date || '').localeCompare(String(a.date || ''));
          });

          this.blogs = normalized;
          this.setPersistent(cacheKey, normalized);
          return normalized;
        }
      }
    } catch {
      // Fallback to reading markdown files
    }

    // 2. Fallback: Ingest .md files directly in parallel
    const idsToFetch = blogIds && blogIds.length > 0 ? blogIds : this.KNOWN_BLOG_IDS;
    if (idsToFetch.length === 0) {
      return [];
    }

    try {
      const promises = idsToFetch.map(async (id) => {
        try {
          const res = await fetch(`${blogDir}id${id}.md`);
          if (res.ok) {
            const text = await res.text();
            return this.parseBlogMarkdown(text, id);
          }
        } catch {
          // Ignore
        }
        return null;
      });

      const results = await Promise.all(promises);
      const valid = results.filter((b): b is BlogPostItem => b !== null);

      valid.sort((a, b) => {
        const numA = Number(a.id);
        const numB = Number(b.id);
        if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
        return String(b.date || '').localeCompare(String(a.date || ''));
      });

      if (valid.length > 0) {
        this.blogs = valid;
        this.setPersistent(cacheKey, valid);
        return valid;
      }
    } catch (e) {
      console.warn('[DataCache] Failed to load blog markdown files:', e);
    }

    return [];
  }
}

export const DataCache = new DataCacheService();

/**
 * Derives a clean URL slug from a ProductItem
 */
export const getAppSlug = (product: ProductItem): string => {
  if (product.slug) return product.slug;
  const name = (product.title || product.name || `app-${product.id}`).trim().toLowerCase();
  return name.replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-');
};

/**
 * Derives a clean URL slug from a BlogPostItem
 */
export const getBlogSlug = (blog: BlogPostItem): string => {
  if (blog.slug) return blog.slug;
  const title = String(blog.heading || blog.title || `article-${blog.id}`).trim();
  const s = title
    .replace(/c\+\+/gi, 'cpp')
    .replace(/c#/gi, 'csharp')
    .replace(/f#/gi, 'fsharp')
    .replace(/\.net\b/gi, 'dotnet')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-');
  return s || `article-${blog.id}`;
};


