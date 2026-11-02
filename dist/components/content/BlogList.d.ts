import { default as React } from 'react';
import { BlogPostItem } from '../../services/DataCache';
export type { BlogPostItem };
export interface BlogCardProps {
    post: BlogPostItem;
    onSelect?: (post: BlogPostItem) => void;
    /** Whether to display the short description/excerpt (default: false for clean grid) */
    showExcerpt?: boolean;
    /** Optional fallback image URL if post has no image */
    fallbackImageUrl?: string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Article teaser card with featured image, category badge, publication date,
 * reading time estimation, and hover elevation.
 *
 * @example
 * ```tsx
 * <BlogCard post={article} onSelect={(p) => console.log('Selected:', p.title)} />
 * ```
 */
export declare const BlogCard: React.FC<BlogCardProps>;
export interface BlogPostViewProps {
    post: BlogPostItem;
    onBack?: () => void;
    /** Text alignment for paragraphs and prose content (default: "justify") */
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    /** Whether to extract and display Table of Contents outline (default: true) */
    showToc?: boolean;
    /** Whether to show the Social Share button (default: true) */
    showShare?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Article reader powered by the generic MarkdownViewer.
 *
 * @example
 * ```tsx
 * <BlogPostView post={article} onBack={() => setActivePost(null)} />
 * ```
 */
export declare const BlogPostView: React.FC<BlogPostViewProps>;
export interface BlogSidebarProps {
    categories: {
        name: string;
        count: number;
    }[];
    recentPosts: BlogPostItem[];
    selectedCategory?: string | null;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    onCategorySelect?: (category: string | null) => void;
    onPostSelect?: (post: BlogPostItem) => void;
}
/**
 * Reusable sidebar tools with instant live search input, categories with article counts,
 * and recent posts widget.
 */
export declare const BlogSidebar: React.FC<BlogSidebarProps>;
export interface BlogListProps {
    posts: BlogPostItem[];
    pageSize?: number;
    currentPage?: number;
    /** Whether to show the excerpt on cards (default: false for clean grid) */
    showExcerpt?: boolean;
    /** Optional fallback image URL for cards */
    fallbackImageUrl?: string;
    onPageChange?: (page: number) => void;
    onSelectPost?: (post: BlogPostItem) => void;
}
/**
 * Responsive CSS grid of blog cards with forward/backward and numbered pagination controls.
 */
export declare const BlogList: React.FC<BlogListProps>;
