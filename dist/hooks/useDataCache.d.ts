import { ProductItem, NewsItem, PageContent, BlogPostItem } from '../services/DataCache';
/**
 * Fetches applications catalog from static JSON, caches locally,
 * and automatically resolves live versions from GitHub in the background.
 *
 * @example
 * ```tsx
 * const { products, loading, error, refresh } = useProducts('data/apps.json');
 * ```
 */
export declare const useProducts: (productsUrlOrOptions?: string | {
    productsUrl?: string;
    mdDir?: string;
    slugs?: string[];
    filterActive?: boolean;
}) => {
    products: ProductItem[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
/**
 * Fetches blog articles dataset from pre-indexed JSON or Markdown files.
 *
 * @example
 * ```tsx
 * const { blogs, loading } = useBlogs('data/blog-index.json');
 * ```
 */
export declare const useBlogs: (indexUrl?: string, blogDir?: string, blogIds?: string[]) => {
    blogs: BlogPostItem[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
};
/**
 * Fetches news and announcements from website content JSON.
 *
 * @example
 * ```tsx
 * const { news, loading } = useNews('data/website_content.json');
 * ```
 */
export declare const useNews: (contentUrl?: string) => {
    news: NewsItem[];
    loading: boolean;
};
/**
 * Fetches static page content snippet (e.g. 'about', 'contact', 'apps').
 *
 * @example
 * ```tsx
 * const { content: about } = usePageContent('about');
 * ```
 */
export declare const usePageContent: (pageKey: string, contentUrl?: string) => {
    content: PageContent | null;
    loading: boolean;
};
