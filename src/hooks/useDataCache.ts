import { useState, useEffect, useCallback } from 'react';
import { DataCache, ProductItem, NewsItem, PageContent, BlogPostItem } from '../services/DataCache';

/**
 * Fetches applications catalog from static JSON, caches locally,
 * and automatically resolves live versions from GitHub in the background.
 *
 * @example
 * ```tsx
 * const { products, loading, error, refresh } = useProducts('data/apps.json');
 * ```
 */
export const useProducts = (
  productsUrlOrOptions: string | { productsUrl?: string; mdDir?: string; slugs?: string[]; filterActive?: boolean } = 'data/apps.json'
) => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DataCache.getProducts(productsUrlOrOptions);
      setProducts([...data]);

      // Automatically sync GitHub versions in background
      DataCache.syncGithubVersions(data, (productId, version) => {
        setProducts((prev) =>
          prev.map((item) => (item.id === productId ? { ...item, version } : item))
        );
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [productsUrlOrOptions]);

  useEffect(() => {
    load();
  }, [load]);

  return { products, loading, error, refresh: load };
};

/**
 * Fetches blog articles dataset from pre-indexed JSON or Markdown files.
 *
 * @example
 * ```tsx
 * const { blogs, loading } = useBlogs('data/blog-index.json');
 * ```
 */
export const useBlogs = (indexUrl?: string, blogDir?: string, blogIds?: string[]) => {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await DataCache.getBlogs(indexUrl, blogDir, blogIds);
      setBlogs([...data]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [indexUrl, blogDir, blogIds]);

  useEffect(() => {
    load();
  }, [load]);

  return { blogs, loading, error, refresh: load };
};

/**
 * Fetches news and announcements from website content JSON.
 *
 * @example
 * ```tsx
 * const { news, loading } = useNews('data/website_content.json');
 * ```
 */
export const useNews = (contentUrl?: string) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    DataCache.getNews(contentUrl).then((items) => {
      if (active) {
        setNews(items);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [contentUrl]);

  return { news, loading };
};

/**
 * Fetches static page content snippet (e.g. 'about', 'contact', 'apps').
 *
 * @example
 * ```tsx
 * const { content: about } = usePageContent('about');
 * ```
 */
export const usePageContent = (pageKey: string, contentUrl?: string) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    DataCache.getPageContent(pageKey, contentUrl).then((data) => {
      if (active) {
        setContent(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [pageKey, contentUrl]);

  return { content, loading };
};

