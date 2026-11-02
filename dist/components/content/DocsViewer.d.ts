import { default as React } from 'react';
export interface DocArticle {
    id: string;
    title: string;
    category: string;
    content: string;
    tags?: string[];
    readingTime?: string;
}
export interface DocsViewerProps {
    articles: DocArticle[];
    defaultArticleId?: string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Interactive documentation explorer featuring categorized collapsible sidebar,
 * live fuzzy search, auto-generated Table of Contents ("On This Page"),
 * copyable code snippets, breadcrumb navigation, interactive Mermaid diagrams,
 * and XSS-sanitized Markdown pane.
 *
 * @example
 * ```tsx
 * <DocsViewer
 *   articles={docArticles}
 *   defaultArticleId="cli-flags"
 * />
 * ```
 */
export declare const DocsViewer: React.FC<DocsViewerProps>;
