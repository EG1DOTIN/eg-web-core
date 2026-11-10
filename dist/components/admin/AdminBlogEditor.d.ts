import { default as React } from 'react';
export interface BlogArticleMetadata {
    title: string;
    slug: string;
    date: string;
    author: string;
    category: string;
    tags: string[];
    description: string;
}
export interface AdminBlogEditorProps {
    /** Initial post metadata */
    initialMetadata?: Partial<BlogArticleMetadata>;
    /** Initial markdown body text */
    initialBody?: string;
    /** Available category options for selection */
    categories?: string[];
    /** Default author name (default: 'Admin') */
    defaultAuthor?: string;
    /** Callback fired when user clicks 'Save Post' */
    onSave?: (fullMarkdown: string, metadata: BlogArticleMetadata) => void | Promise<void>;
    /** Title for the editor interface (default: 'Blog Article Editor') */
    title?: string;
    /** Custom wrapper style */
    style?: React.CSSProperties;
    /** Custom class name */
    className?: string;
}
/**
 * Markdown blog article authoring console with live preview and YAML frontmatter export.
 *
 * @param props - AdminBlogEditorProps configuration
 * @returns Blog article editor interface
 *
 * @example
 * ```tsx
 * <AdminBlogEditor
 *   defaultAuthor="Editorial Team"
 *   categories={['Engineering', 'Product']}
 *   onSave={async (markdown, meta) => {
 *     console.log('Saved:', meta.title);
 *   }}
 * />
 * ```
 */
export declare const AdminBlogEditor: React.FC<AdminBlogEditorProps>;
