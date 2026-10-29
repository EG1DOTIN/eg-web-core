import React, { useState, useEffect, useMemo, useRef } from 'react';
import { marked } from 'marked';
import { Badge } from '../common/Badge';
import { ShareModal } from '../common/ShareModal';
import { sanitizeHtml } from '../../services/sanitizer';
import { enhanceMarkdownContainer, parseMarkdownToHtml } from '../../services/markdownEnhancer';

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
 * Parses YAML frontmatter headers (e.g. `--- \n title: ... \n ---`) from Markdown text.
 */
function parseFrontmatter(raw: string): { meta: Record<string, any>; body: string } {
  if (!raw) return { meta: {}, body: '' };
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const yamlContent = match[1];
  const markdownBody = match[2];
  const meta: Record<string, any> = {};

  yamlContent.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;

    const key = line.slice(0, colonIdx).trim();
    let val: any = line.slice(colonIdx + 1).trim();

    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    meta[key] = val;
  });

  return { meta, body: markdownBody };
}

/**
 * Normalizes common markdown authoring artifacts:
 * - Strips leftover MS Word conditional comments (e.g. `<!--[endif]-->`).
 * - Resolves accidental duplicate numbering (e.g. "1. 1.**" or "1. 1. " -> "1. ").
 * - Replaces non-breaking spaces (\u00a0) with standard spaces.
 * - Normalizes loose bold delimiters (e.g. "** C++**" -> " **C++**", "**C **" -> "**C** ").
 * - Normalizes loose italic delimiters (e.g. "* text *" -> " *text* ").
 */
export function normalizeMarkdown(md: string): string {
  if (!md) return '';

  let text = md.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '');
  text = text.replace(/<!--\[endif\]-->/gi, '');

  const lines = text.split('\n');
  let inCodeBlock = false;

  const processedLines = lines.map((line) => {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) return line;

    // Fix accidental duplicate numbering on list items like "1. 1.**" or "1. 1. "
    line = line.replace(/^(\s*\d+\.)\s+\d+\.\s*/, '$1 ');
    line = line.replace(/^(\s*\d+\.)\s+\d+\.\*\*/, '$1 **');

    // Replace non-breaking spaces (\u00a0) with regular spaces
    line = line.replace(/\u00a0/g, ' ');

    // Normalize loose bold markers (e.g. "** C++**" -> " **C++**", "**C **" -> "**C** ")
    line = line.replace(/\*\*([^\*\n]+?)\*\*/g, (match, inner) => {
      const trimmed = inner.trim();
      if (!trimmed) return match;
      const leadSpace = /^\s/.test(inner) ? ' ' : '';
      const trailSpace = /\s$/.test(inner) ? ' ' : '';
      return leadSpace + '**' + trimmed + '**' + trailSpace;
    });

    // Normalize loose italic markers (e.g. "* text *" -> " *text* ")
    line = line.replace(/(?<!\*)\*([^\*\n]+?)\*(?!\*)/g, (match, inner) => {
      const trimmed = inner.trim();
      if (!trimmed) return match;
      const leadSpace = /^\s/.test(inner) ? ' ' : '';
      const trailSpace = /\s$/.test(inner) ? ' ' : '';
      return leadSpace + '*' + trimmed + '*' + trailSpace;
    });

    return line;
  });

  return processedLines.join('\n');
}



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
export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  url,
  metadata = {},
  title: propTitle,
  author: propAuthor,
  date: propDate,
  category: propCategory,
  tags: propTags,
  readingTime: propReadingTime,
  imageUrl: propImageUrl,
  description: propDescription,
  short_description: propShortDescription,
  textAlign = 'justify',
  onBack,
  backLabel = 'Back',
  showShare = true,
  showRaw = true,
  showToc = false,
  headerExtra,
  footerExtra,
  className = '',
  style,
}) => {
  const [fetchedContent, setFetchedContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(Boolean(url && !content));
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [rawModalOpen, setRawModalOpen] = useState(false);
  const [rawCopied, setRawCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Fetch from URL if provided and content not directly supplied
  useEffect(() => {
    if (!url || content) return;
    let active = true;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load markdown: HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!active) return;
        setFetchedContent(text);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [url, content]);

  // Parse frontmatter & extract body
  const { parsedMeta, markdownBody } = useMemo(() => {
    const raw = content !== undefined ? content : fetchedContent;
    const { meta, body } = parseFrontmatter(raw);
    return { parsedMeta: meta, markdownBody: body };
  }, [content, fetchedContent]);

  // Combined metadata resolution (explicit props > metadata object > YAML frontmatter)
  const resolvedTitle =
    propTitle ||
    metadata.title ||
    metadata.heading ||
    parsedMeta.title ||
    parsedMeta.heading ||
    '';

  const resolvedAuthor =
    propAuthor ||
    metadata.author ||
    parsedMeta.author ||
    '';

  const resolvedDate =
    propDate ||
    metadata.date ||
    parsedMeta.date ||
    parsedMeta.createdAt ||
    '';

  const resolvedCategory =
    propCategory ||
    metadata.category ||
    parsedMeta.category ||
    (Array.isArray(parsedMeta.tags) && parsedMeta.tags.length > 0 ? parsedMeta.tags[0] : '') ||
    '';

  const resolvedTags: string[] = useMemo(() => {
    if (propTags && propTags.length > 0) return propTags;
    if (metadata.tags && metadata.tags.length > 0) return metadata.tags;
    if (Array.isArray(parsedMeta.tags)) return parsedMeta.tags;
    if (typeof parsedMeta.tags === 'string') return [parsedMeta.tags];
    return [];
  }, [propTags, metadata.tags, parsedMeta.tags]);

  const resolvedImageUrl =
    propImageUrl ||
    metadata.output_image ||
    metadata.imageUrl ||
    parsedMeta.output_image ||
    parsedMeta.imageUrl ||
    '';

  const resolvedDescription =
    propDescription ||
    propShortDescription ||
    metadata.short_description ||
    metadata.description ||
    (typeof parsedMeta.short_description === 'string' ? parsedMeta.short_description : undefined) ||
    (typeof parsedMeta.description === 'string' ? parsedMeta.description : undefined) ||
    '';

  const cleanMarkdownBody = useMemo(() => normalizeMarkdown(markdownBody), [markdownBody]);

  const renderedDescriptionHtml = useMemo(() => {
    if (!resolvedDescription.trim()) return '';
    try {
      const parsed = marked.parseInline(normalizeMarkdown(resolvedDescription)) as string;
      return sanitizeHtml(parsed);
    } catch {
      return sanitizeHtml(resolvedDescription);
    }
  }, [resolvedDescription]);

  const resolvedReadingTime = useMemo(() => {
    if (propReadingTime) return propReadingTime;
    if (metadata.readingTime) return metadata.readingTime;
    if (parsedMeta.readingTime) return parsedMeta.readingTime;
    const wordCount = (cleanMarkdownBody || '').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    return `${minutes} min read`;
  }, [propReadingTime, metadata.readingTime, parsedMeta.readingTime, cleanMarkdownBody]);

  // Parse markdown to HTML with sanitization and rich diagram/alert/code enhancements
  const htmlContent = useMemo(() => {
    if (!cleanMarkdownBody.trim()) return '';
    return parseMarkdownToHtml(cleanMarkdownBody);
  }, [cleanMarkdownBody]);

  // Table of Contents extraction (H2 & H3)
  const toc = useMemo(() => {
    if (!showToc || !cleanMarkdownBody) return [];
    const lines = cleanMarkdownBody.split('\n');
    const items: Array<{ level: number; text: string; id: string }> = [];

    lines.forEach((line) => {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        const level = line.startsWith('## ') ? 2 : 3;
        const text = line.replace(/^#{2,3}\s+/, '').trim();
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        items.push({ level, text, id });
      }
    });

    return items;
  }, [showToc, cleanMarkdownBody]);

  // Enhance code blocks with GitHub Dark header and copy button, Mermaid diagrams, and headings with IDs
  useEffect(() => {
    if (!bodyRef.current) return;
    enhanceMarkdownContainer(bodyRef.current);
  }, [htmlContent]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--eg-text-muted, #94a3b8)' }}>
        <p style={{ fontSize: '15px', fontWeight: 600 }}>Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '24px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '10px',
          color: 'var(--eg-color-danger, #ef4444)',
          margin: '20px 0',
        }}
      >
        <p style={{ fontWeight: 700, margin: '0 0 6px' }}>Failed to load Markdown document</p>
        <p style={{ fontSize: '13.5px', margin: 0 }}>{error}</p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              marginTop: '12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--eg-color-primary, #b8860b)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            &larr; {backLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <article
      className={`eg-markdown-viewer ${className}`}
      style={{
        background: 'var(--eg-bg-surface, #ffffff)',
        border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
        borderRadius: 'var(--eg-radius-lg, 14px)',
        padding: 'clamp(16px, 3.5vw, 36px)',
        boxShadow: 'var(--eg-shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.06))',
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Top Navigation Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--eg-color-primary, #b8860b)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>&larr;</span>
            <span>{backLabel}</span>
          </button>
        ) : (
          <div />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showShare && (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.12))',
                color: 'var(--eg-text-secondary, #475569)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Share</span>
            </button>
          )}

          {showRaw && (
            <button
              type="button"
              onClick={() => setRawModalOpen(true)}
              style={{
                background: 'transparent',
                border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.12))',
                color: 'var(--eg-text-secondary, #475569)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="View raw Markdown source"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span>View Raw</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Metadata Section (only rendered if title or metadata exists) */}
      {(resolvedTitle || resolvedCategory || resolvedAuthor || resolvedDate) && (
        <header
          style={{
            marginBottom: '28px',
            borderBottom: '1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))',
            paddingBottom: '20px',
          }}
        >
          {(resolvedCategory || resolvedTags.length > 0) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {resolvedCategory && (
                <Badge variant="neutral" size="sm">
                  {resolvedCategory}
                </Badge>
              )}
              {resolvedTags
                .filter((t) => t.toLowerCase() !== resolvedCategory.toLowerCase())
                .map((t) => (
                  <Badge key={t} variant="neutral" size="sm">
                    #{t}
                  </Badge>
                ))}
            </div>
          )}

          {resolvedTitle && (
            <h1
              style={{
                fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--eg-text-primary, #0f172a)',
                lineHeight: 1.3,
                margin: '0 0 14px',
                wordBreak: 'break-word',
              }}
            >
              {resolvedTitle}
            </h1>
          )}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--eg-text-muted, #94a3b8)',
              fontSize: '13.5px',
            }}
          >
            {resolvedAuthor && (
              <span>
                By <strong>{resolvedAuthor}</strong>
              </span>
            )}
            {resolvedAuthor && resolvedDate && <span>•</span>}
            {resolvedDate && <span>{resolvedDate}</span>}
            {resolvedReadingTime && (
              <>
                <span>•</span>
                <span>{resolvedReadingTime}</span>
              </>
            )}
          </div>
        </header>
      )}

      {/* Optional Featured Image */}
      {resolvedImageUrl && (
        <div
          style={{
            marginBottom: '28px',
            borderRadius: '10px',
            overflow: 'hidden',
            maxHeight: '420px',
            background: 'var(--eg-bg-canvas, #f8fafc)',
          }}
        >
          <img
            src={resolvedImageUrl}
            alt={resolvedTitle || 'Featured'}
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Short Description / Lead Excerpt */}
      {renderedDescriptionHtml && (
        <div
          className="blog-description eg-article-description"
          style={{
            fontSize: 'clamp(1.05rem, 0.92rem + 0.45vw, 1.18rem)',
            lineHeight: 1.8,
            color: 'var(--eg-text-primary, #0f172a)',
            marginBottom: '22px',
            fontWeight: 500,
            letterSpacing: '0.01em',
            fontStyle: 'normal',
            textAlign: textAlign,
            textJustify: 'inter-word',
          }}
          dangerouslySetInnerHTML={{ __html: renderedDescriptionHtml }}
        />
      )}

      {/* Optional Table of Contents */}
      {toc.length > 0 && (
        <nav
          style={{
            margin: '0 0 28px',
            padding: '16px 20px',
            background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.03))',
            borderRadius: '8px',
            border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))',
          }}
        >
          <h4
            style={{
              margin: '0 0 10px',
              fontSize: '12.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: 'var(--eg-text-muted, #64748b)',
            }}
          >
            Table of Contents
          </h4>
          <ul style={{ margin: 0, paddingLeft: '18px', listStyleType: 'disc' }}>
            {toc.map((item) => (
              <li
                key={item.id}
                style={{
                  marginLeft: item.level === 3 ? '16px' : '0',
                  marginBottom: '4px',
                  fontSize: '13.5px',
                }}
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(item.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      if (typeof window !== 'undefined' && window.history.replaceState) {
                        window.history.replaceState(null, '', `#${item.id}`);
                      }
                    }
                  }}
                  style={{ color: 'var(--eg-color-primary, #b8860b)', textDecoration: 'none' }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Custom Header Slot */}
      {headerExtra}

      {/* Scoped CSS for markdown body tables and typography */}
      <style>{`
        .eg-article-markdown-body {
          word-break: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }
        .eg-article-markdown-body h1,
        .eg-article-markdown-body h2,
        .eg-article-markdown-body h3,
        .eg-article-markdown-body h4 {
          color: var(--eg-text-primary, #0f172a);
          margin-top: 28px;
          margin-bottom: 12px;
          font-weight: 700;
          line-height: 1.35;
          scroll-margin-top: 80px;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .eg-article-markdown-body p,
        .eg-article-markdown-body li {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .blog-description,
        .eg-article-description {
          text-align: ${textAlign};
          text-align-last: left;
          text-justify: inter-word;
        }
        .eg-article-markdown-body p {
          color: var(--eg-text-primary, #0f172a);
          line-height: 1.8;
          font-size: 15.5px;
          margin-bottom: 18px;
          text-align: ${textAlign};
          text-align-last: left;
          text-justify: inter-word;
        }
        .eg-article-markdown-body ul,
        .eg-article-markdown-body ol {
          color: var(--eg-text-primary, #0f172a);
          margin: 14px 0 20px 24px;
          padding-left: 8px;
          line-height: 1.7;
        }
        .eg-article-markdown-body li {
          margin-bottom: 8px;
          text-align: left;
          line-height: 1.7;
        }
        .eg-article-markdown-body blockquote {
          margin: 20px 0;
          padding: 12px 20px;
          border-left: 4px solid var(--eg-color-primary, #b8860b);
          background: var(--eg-bg-subtle, rgba(0,0,0,0.03));
          border-radius: 0 8px 8px 0;
          text-align: ${textAlign};
          text-align-last: left;
          text-justify: inter-word;
        }
        .eg-article-markdown-body table {
          display: block;
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-collapse: collapse;
          margin: 22px 0 26px 0;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15));
          border-radius: 8px;
        }
        .eg-article-markdown-body th,
        .eg-article-markdown-body td {
          padding: 11px 16px;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15));
          text-align: left;
          font-size: 14.5px;
        }
        .eg-article-markdown-body th {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.05));
          color: var(--eg-text-primary, #0f172a);
          font-weight: 700;
        }
        .eg-article-markdown-body td {
          color: var(--eg-text-primary, #0f172a);
        }
        .eg-article-markdown-body code:not(pre code) {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.06));
          color: var(--eg-color-primary, #b8860b);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: monospace;
        }
        .eg-article-markdown-body blockquote {
          margin: 20px 0;
          padding: 12px 20px;
          border-left: 4px solid var(--eg-color-primary, #b8860b);
          background: var(--eg-bg-subtle, rgba(0,0,0,0.03));
          border-radius: 0 8px 8px 0;
        }
        .eg-article-markdown-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        /* GitHub Dark Syntax Highlighting */
        .eg-code-wrapper pre code.hljs {
          display: block;
          overflow-x: auto;
          background: #0d1117 !important;
          color: #e6edf3 !important;
        }
        .hljs-keyword,
        .hljs-operator {
          color: #ff7b72 !important;
          font-weight: 600;
        }
        .hljs-built_in,
        .hljs-type {
          color: #ffa657 !important;
        }
        .hljs-string,
        .hljs-regexp {
          color: #a5d6ff !important;
        }
        .hljs-comment,
        .hljs-quote {
          color: #8b949e !important;
          font-style: italic;
        }
        .hljs-number,
        .hljs-literal {
          color: #79c0ff !important;
        }
        .hljs-meta,
        .hljs-meta .hljs-keyword {
          color: #79c0ff !important;
          font-weight: 600;
        }
        .hljs-title,
        .hljs-title.function_,
        .hljs-title.class_ {
          color: #d2a8ff !important;
        }
        .hljs-attr,
        .hljs-attribute,
        .hljs-variable,
        .hljs-template-variable {
          color: #ffa657 !important;
        }
        .hljs-name,
        .hljs-tag,
        .hljs-selector-tag {
          color: #7ee787 !important;
        }
      `}</style>

      {/* Main Sanitized Markdown Body */}
      <div
        ref={bodyRef}
        className="eg-article-markdown-body"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Custom Footer Slot */}
      {footerExtra}

      {/* Bottom Back Button */}
      {onBack && (
        <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--eg-color-primary, #b8860b)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>&larr;</span>
            <span>{backLabel}</span>
          </button>
        </div>
      )}

      {/* Web Share Modal */}
      {showShare && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          title={resolvedTitle}
          url={typeof window !== 'undefined' ? window.location.href : ''}
          description={resolvedTitle}
        />
      )}

      {/* Raw Markdown Source Modal */}
      {showRaw && rawModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setRawModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '840px',
              maxHeight: '85vh',
              background: 'var(--eg-bg-surface, #ffffff)',
              border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))',
              borderRadius: '14px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))',
                borderBottom: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              <span>Raw Markdown Source ({resolvedTitle || 'Document'})</span>
              <button
                type="button"
                onClick={() => setRawModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              <textarea
                style={{
                  width: '100%',
                  height: '420px',
                  backgroundColor: '#090d16',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontFamily: 'var(--eg-font-mono, monospace)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
                readOnly
                value={cleanMarkdownBody}
              />
            </div>
            <div
              style={{
                padding: '12px 20px',
                background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))',
                borderTop: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => setRawModalOpen(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--eg-border-default, rgba(0,0,0,0.2))',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(cleanMarkdownBody);
                    setRawCopied(true);
                    setTimeout(() => setRawCopied(false), 2000);
                  } catch (_) {}
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'var(--eg-color-primary, #10b981)',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {rawCopied ? 'Copied!' : 'Copy Markdown'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

// Aliases for developer convenience
export const MdViewer = MarkdownViewer;
export type MdViewerProps = MarkdownViewerProps;
