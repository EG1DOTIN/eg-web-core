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
export declare class DataCacheService {
    products: ProductItem[] | null;
    blogs: BlogPostItem[] | null;
    news: NewsItem[] | null;
    pages: Record<string, PageContent> | null;
    private registeredPrefixes;
    private registeredKeys;
    private CACHE_TTL_DEV;
    private CACHE_TTL_PROD;
    /**
     * Registers a storage key prefix for local persistence and cache purging.
     * Consumers (e.g. eg1.in, mchess.eg1.in, av.eg1.in) register their own application prefixes.
     */
    registerStoragePrefix(prefix: string): void;
    /**
     * Registers a specific storage key for cache management and purging.
     */
    registerStorageKey(key: string): void;
    private isDev;
    private getTTL;
    private getPersistent;
    private setPersistent;
    clearCache(type?: string): void;
    /**
     * Fetches website content JSON (news, page intros, copy)
     */
    getWebsiteContent(contentUrl?: string): Promise<WebsiteContent | null>;
    /**
     * Fetches news items
     */
    getNews(contentUrl?: string): Promise<NewsItem[]>;
    /**
     * Fetches static page content snippet by key (e.g., 'about', 'contact', 'apps')
     */
    getPageContent(pageKey: string, contentUrl?: string): Promise<PageContent | null>;
    KNOWN_APP_SLUGS: string[];
    /**
     * Registers application slugs for Markdown fallback ingestion.
     */
    registerAppSlugs(slugs: string[]): void;
    /**
     * Helper to parse YAML frontmatter and Markdown body of an application file.
     */
    parseAppMarkdown(rawText: string, defaultSlug?: string): ProductItem | null;
    getRequestedAppSlug(): string | null;
    /**
     * Fetches applications/products catalog with dynamic markdown ingestion,
     * chronological sorting, and static JSON fallback.
     */
    getProducts(optionsOrUrl?: string | {
        productsUrl?: string;
        mdDir?: string;
        slugs?: string[];
        filterActive?: boolean;
    }): Promise<ProductItem[]>;
    /**
     * Extracts 'owner/repo' from GitHub URLs
     */
    extractGithubRepo(url: string): string | null;
    /**
     * Finds any GitHub repository referenced in a product object
     */
    findGithubRepoInProduct(product: ProductItem): string | null;
    /**
     * Fetches latest release or tag version from GitHub with local caching
     */
    getGithubVersion(repo: string): Promise<string | null>;
    /**
     * Synchronizes version numbers from GitHub in background and updates elements
     */
    syncGithubVersions(products: ProductItem[], onVersionResolved?: (productId: string, version: string) => void): Promise<void>;
    /**
     * Resolves display version string for a product
     */
    resolveProductVersion(product: ProductItem): string;
    KNOWN_BLOG_IDS: string[];
    /**
     * Registers blog article IDs for Markdown fallback ingestion.
     */
    registerBlogIds(ids: string[]): void;
    /**
     * Helper to parse YAML frontmatter and Markdown body of a blog post file.
     */
    parseBlogMarkdown(rawText: string, defaultId?: string): BlogPostItem | null;
    /**
     * Fetches blog articles dataset from blog-index.json or individual Markdown files.
     */
    getBlogs(indexUrl?: string, blogDir?: string, blogIds?: string[]): Promise<BlogPostItem[]>;
}
export declare const DataCache: DataCacheService;
/**
 * Derives a clean URL slug from a ProductItem
 */
export declare const getAppSlug: (product: ProductItem) => string;
/**
 * Derives a clean URL slug from a BlogPostItem
 */
export declare const getBlogSlug: (blog: BlogPostItem) => string;
