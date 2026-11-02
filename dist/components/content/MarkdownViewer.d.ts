import { default as React } from 'react';
export interface MarkdownMetadata {
    id?: string;
    title?: string;
    heading?: string;
    author?: string;
    date?: string;
    category?: string;
    tags?: string[];
    readingTime?: string;
    imageUrl?: string;
    output_image?: string;
    description?: string;
    short_description?: string;
    [key: string]: unknown;
}
export interface MarkdownViewerProps {
    /** Raw Markdown text (supports optional YAML frontmatter header) */
    content?: string;
    /** Direct URL or relative file path to an external .md file */
    url?: string;
    /** Metadata object (author, date, tags, category, title, etc.) */
    metadata?: MarkdownMetadata;
    /** Explicit title override */
    title?: string;
    /** Explicit author override */
    author?: string;
    /** Explicit date override */
    date?: string;
    /** Explicit category override */
    category?: string;
    /** Explicit tags override */
    tags?: string[];
    /** Explicit reading time override */
    readingTime?: string;
    /** Explicit header/featured image URL */
    imageUrl?: string;
    /** Explicit short description or summary override */
    description?: string;
    /** Explicit short description or summary override */
    short_description?: string;
    /** Text alignment for paragraphs and prose content (default: "justify") */
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    /** Optional back button callback */
    onBack?: () => void;
    /** Back button label (default: "← Back") */
    backLabel?: string;
    /** Whether to show the Web Share button (default: true) */
    showShare?: boolean;
    /** Whether to show the View Raw Markdown button (default: true) */
    showRaw?: boolean;
    /** Whether to extract and display Table of Contents (default: false) */
    showToc?: boolean;
    /** Custom header elements slot */
    headerExtra?: React.ReactNode;
    /** Custom footer elements slot */
    footerExtra?: React.ReactNode;
    /** Optional custom CSS class */
    className?: string;
    /** Optional custom inline styles */
    style?: React.CSSProperties;
}
/**
 * Normalizes common markdown authoring artifacts:
 * - Strips leftover MS Word conditional comments (e.g. `<!--[endif]-->`).
 * - Resolves accidental duplicate numbering (e.g. "1. 1.**" or "1. 1. " -> "1. ").
 * - Replaces non-breaking spaces (\u00a0) with standard spaces.
 * - Normalizes loose bold delimiters (e.g. "** C++**" -> " **C++**", "**C **" -> "**C** ").
 * - Normalizes loose italic delimiters (e.g. "* text *" -> " *text* ").
 */
export declare function normalizeMarkdown(md: string): string;
/**
 * Generic, website-agnostic Markdown Document & Article Viewer.
 *
 * Features:
 * - Direct ingestion of raw Markdown text or remote `.md` URLs.
 * - Automatic YAML frontmatter parsing (extracting author, date, category, tags, title).
 * - Code syntax blocks with dark background, language pill, and 1-click Copy-to-Clipboard button.
 * - 4-sided table outlines with responsive overflow wrapping.
 * - Table of Contents extraction (H2, H3).
 * - Built-in XSS sanitization via `sanitizeHtml()`.
 * - Theme-aware styling (light and dark mode via CSS variables).
 *
 * @example
 * ```tsx
 * // 1. Direct Markdown text
 * <MarkdownViewer content="# Hello World\nThis is pure markdown." />
 *
 * // 2. Direct remote .md file
 * <MarkdownViewer url="data/blog/id70.md" onBack={() => navigate('/blog')} />
 * ```
 */
export declare const MarkdownViewer: React.FC<MarkdownViewerProps>;
export declare const MdViewer: React.FC<MarkdownViewerProps>;
export type MdViewerProps = MarkdownViewerProps;
