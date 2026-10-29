import React, { useState, useMemo } from 'react';
import { Badge } from '../common/Badge';
import { BlogPostItem } from '../../services/DataCache';
import { MarkdownViewer } from './MarkdownViewer';

export type { BlogPostItem };

const DEFAULT_CARD_IMAGE =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120' fill='none'><rect width='200' height='120' fill='%231e293b'/><path d='M60 40h80M60 60h60M60 80h40' stroke='%2394a3b8' stroke-width='4' stroke-linecap='round'/><circle cx='155' cy='75' r='12' fill='%2338bdf8' opacity='0.7'/></svg>";

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
export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onSelect,
  showExcerpt = false,
  fallbackImageUrl,
  className = '',
  style,
}) => {
  const imageUrl = post.output_image || post.imageUrl || fallbackImageUrl || DEFAULT_CARD_IMAGE;
  const category = post.category || (post.tags && post.tags.length > 0 ? post.tags[0] : 'General');
  const excerpt = post.short_description || post.description || '';

  return (
    <article
      className={`eg-blog-card ${className}`}
      onClick={() => onSelect && onSelect(post)}
      style={{
        background: 'var(--eg-bg-surface, #ffffff)',
        border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
        borderRadius: 'var(--eg-radius-lg, 12px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onSelect) {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = 'var(--eg-shadow-md, 0 8px 24px rgba(0, 0, 0, 0.12))';
          e.currentTarget.style.borderColor = 'var(--eg-color-primary, #b8860b)';
        }
      }}
      onMouseLeave={(e) => {
        if (onSelect) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))';
          e.currentTarget.style.borderColor = 'var(--eg-border-default, rgba(0, 0, 0, 0.1))';
        }
      }}
    >
      <div>
        {/* Featured Card Image */}
        <div style={{ width: '100%', height: '180px', overflow: 'hidden', background: 'var(--eg-bg-canvas, #f1f5f9)' }}>
          <img
            src={imageUrl}
            alt={post.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImageUrl || DEFAULT_CARD_IMAGE;
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>

        {/* Card Body */}
        <div style={{ padding: '20px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
            <Badge variant="neutral" size="sm">
              {category}
            </Badge>
            <span style={{ fontSize: '12px', color: 'var(--eg-text-muted, #94a3b8)', fontWeight: 500 }}>
              {post.date}
            </span>
          </div>

          <h3
            style={{
              margin: '0',
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--eg-text-primary, #0f172a)',
              lineHeight: 1.35,
              wordBreak: 'break-word',
            }}
          >
            {post.title}
          </h3>

          {showExcerpt && excerpt && (
            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--eg-text-secondary, #475569)',
                lineHeight: 1.55,
                marginTop: '10px',
                marginBottom: '14px',
                wordBreak: 'break-word',
                textAlign: 'justify',
                textJustify: 'inter-word',
              }}
            >
              {excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div
        style={{
          padding: '12px 20px 16px',
          borderTop: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.06))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--eg-text-muted, #94a3b8)' }}>
          {post.readingTime || '2 min read'}
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--eg-color-primary, #b8860b)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>Read more</span>
          <span>&rarr;</span>
        </span>
      </div>
    </article>
  );
};

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
export const BlogPostView: React.FC<BlogPostViewProps> = ({
  post,
  onBack,
  textAlign = 'justify',
  showToc = true,
  showShare = true,
  className = '',
  style,
}) => {
  return (
    <MarkdownViewer
      content={post.content || post.full_description}
      url={!post.content && !post.full_description ? `data/blog/id${post.id}.md` : undefined}
      description={post.short_description || post.description}
      textAlign={textAlign}
      showToc={showToc}
      showShare={showShare}
      metadata={{
        id: post.id,
        title: post.title || post.heading,
        author: post.author,
        date: post.date,
        category: post.category,
        tags: post.tags,
        readingTime: post.readingTime,
        imageUrl: post.output_image || post.imageUrl,
        short_description: post.short_description || post.description,
        description: post.description || post.short_description,
      }}
      onBack={onBack}
      backLabel="Back to Blog Articles"
      className={className}
      style={style}
    />
  );
};

export interface BlogSidebarProps {
  categories: { name: string; count: number }[];
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
export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  recentPosts,
  selectedCategory,
  searchQuery = '',
  onSearchChange,
  onCategorySelect,
  onPostSelect,
}) => {
  return (
    <aside className="eg-blog-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Live Search Input Box */}
      {onSearchChange && (
        <div
          style={{
            background: 'var(--eg-bg-surface, #ffffff)',
            border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
            borderRadius: '12px',
            padding: '18px',
            boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
          }}
        >
          <label
            htmlFor="sidebarSearchInput"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: 'var(--eg-text-muted, #64748b)',
              marginBottom: '10px',
            }}
          >
            Search Blog
          </label>
          <input
            id="sidebarSearchInput"
            type="text"
            placeholder="search blog here"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))',
              background: 'var(--eg-bg-surface, #ffffff)',
              color: 'var(--eg-text-primary, #0f172a)',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* 2. Categories Widget */}
      {categories && categories.length > 0 && (
        <div
          style={{
            background: 'var(--eg-bg-surface, #ffffff)',
            border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
            borderRadius: '12px',
            padding: '18px',
            boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
          }}
        >
          <h4
            style={{
              margin: '0 0 14px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: 'var(--eg-text-muted, #64748b)',
            }}
          >
            Categories
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <button
                type="button"
                onClick={() => onCategorySelect && onCategorySelect(null)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: !selectedCategory ? 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.06))' : 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  fontSize: '13.5px',
                  fontWeight: !selectedCategory ? 700 : 500,
                  color: !selectedCategory ? 'var(--eg-color-primary, #b8860b)' : 'var(--eg-text-primary, #0f172a)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>All Topics</span>
              </button>
            </li>
            {categories.map((cat) => {
              const active = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
              return (
                <li key={cat.name}>
                  <button
                    type="button"
                    onClick={() => onCategorySelect && onCategorySelect(cat.name)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: active ? 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.06))' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      fontSize: '13.5px',
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--eg-color-primary, #b8860b)' : 'var(--eg-text-primary, #0f172a)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{cat.name}</span>
                    <span
                      style={{
                        fontSize: '11px',
                        background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.06))',
                        padding: '2px 7px',
                        borderRadius: '999px',
                        color: 'var(--eg-text-muted, #64748b)',
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 3. Recent Posts Widget */}
      {recentPosts && recentPosts.length > 0 && (
        <div
          style={{
            background: 'var(--eg-bg-surface, #ffffff)',
            border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
            borderRadius: '12px',
            padding: '18px',
            boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
          }}
        >
          <h4
            style={{
              margin: '0 0 14px',
              fontSize: '13px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: 'var(--eg-text-muted, #64748b)',
            }}
          >
            Recent Articles
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentPosts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                onClick={() => onPostSelect && onPostSelect(post)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: onPostSelect ? 'pointer' : 'default',
                  textDecoration: 'none',
                }}
              >
                <div style={{ flex: '1 1 auto' }}>
                  <h5
                    style={{
                      margin: '0 0 4px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--eg-text-primary, #0f172a)',
                      lineHeight: 1.35,
                    }}
                  >
                    {post.title}
                  </h5>
                  <span style={{ fontSize: '11.5px', color: 'var(--eg-text-muted, #94a3b8)' }}>
                    {post.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

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
export const BlogList: React.FC<BlogListProps> = ({
  posts,
  pageSize = 6,
  currentPage: controlledPage,
  showExcerpt = false,
  fallbackImageUrl,
  onPageChange,
  onSelectPost,
}) => {
  const [internalPage, setInternalPage] = useState(1);
  const activePage = controlledPage !== undefined ? controlledPage : internalPage;

  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));

  const setPage = (p: number) => {
    const valid = Math.max(1, Math.min(totalPages, p));
    if (onPageChange) {
      onPageChange(valid);
    } else {
      setInternalPage(valid);
    }
  };

  const paginatedPosts = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, activePage, pageSize]);

  // Windowed visible pages for clean responsiveness on all screen sizes
  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (activePage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (activePage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', activePage, '...', totalPages);
    }
    return pages;
  }, [totalPages, activePage]);

  return (
    <div>
      {/* Grid of Posts */}
      {paginatedPosts.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--eg-text-muted, #94a3b8)' }}>
          No articles match your criteria.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap: 'clamp(16px, 2.5vw, 24px)',
          }}
        >
          {paginatedPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              showExcerpt={showExcerpt}
              fallbackImageUrl={fallbackImageUrl}
              onSelect={onSelectPost}
            />
          ))}
        </div>
      )}

      {/* Responsive Pagination Controls */}
      {totalPages > 1 && (
        <div
          className="eg-pagination-controls"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
            marginTop: '32px',
          }}
        >
          <button
            type="button"
            disabled={activePage === 1}
            onClick={() => setPage(activePage - 1)}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid var(--eg-border-default, rgba(0,0,0,0.12))',
              background: 'var(--eg-bg-surface, #ffffff)',
              color: 'var(--eg-text-primary, #0f172a)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: activePage === 1 ? 'not-allowed' : 'pointer',
              opacity: activePage === 1 ? 0.5 : 1,
            }}
          >
            &laquo; Prev
          </button>

          {visiblePages.map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '34px',
                    color: 'var(--eg-text-muted, #94a3b8)',
                    fontWeight: 700,
                    userSelect: 'none',
                  }}
                >
                  &hellip;
                </span>
              );
            }

            const pageNumber = Number(pageNum);
            const isCurrent = pageNumber === activePage;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                style={{
                  minWidth: '34px',
                  height: '34px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  border: isCurrent
                    ? '1px solid var(--eg-color-primary, #b8860b)'
                    : '1px solid var(--eg-border-default, rgba(0,0,0,0.12))',
                  background: isCurrent ? 'var(--eg-color-primary, #b8860b)' : 'var(--eg-bg-surface, #ffffff)',
                  color: isCurrent ? '#ffffff' : 'var(--eg-text-primary, #0f172a)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            disabled={activePage === totalPages}
            onClick={() => setPage(activePage + 1)}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid var(--eg-border-default, rgba(0,0,0,0.12))',
              background: 'var(--eg-bg-surface, #ffffff)',
              color: 'var(--eg-text-primary, #0f172a)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: activePage === totalPages ? 'not-allowed' : 'pointer',
              opacity: activePage === totalPages ? 0.5 : 1,
            }}
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};
