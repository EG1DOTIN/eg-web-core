import React, { useState, useMemo, useEffect, useRef } from 'react';
import { sanitizeHtml } from '../../services/sanitizer';
import { parseMarkdownToHtml, enhanceMarkdownContainer } from '../../services/markdownEnhancer';

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
export const DocsViewer: React.FC<DocsViewerProps> = ({
  articles,
  defaultArticleId,
  className = '',
  style = {},
}) => {
  const [activeId, setActiveId] = useState(defaultArticleId || articles[0]?.id || '');
  const [search, setSearch] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [rawModalOpen, setRawModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
        setRawModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileDrawerOpen]);

  // Group by category
  const categories = useMemo(() => {
    const map: Record<string, DocArticle[]> = {};
    articles.forEach((a) => {
      const cat = a.category || 'General';
      if (!map[cat]) map[cat] = [];
      map[cat].push(a);
    });
    return map;
  }, [articles]);

  const activeArticleIndex = articles.findIndex((a) => a.id === activeId);
  const activeArticle = articles[activeArticleIndex] || articles[0];

  const prevArticle = activeArticleIndex > 0 ? articles[activeArticleIndex - 1] : null;
  const nextArticle = activeArticleIndex < articles.length - 1 ? articles[activeArticleIndex + 1] : null;

  // Extract headings (## and ###) for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!activeArticle?.content) return [];
    const lines = activeArticle.content.split('\n');
    const toc: Array<{ level: number; text: string; id: string }> = [];

    lines.forEach((line) => {
      if (line.startsWith('## ') || line.startsWith('### ')) {
        const level = line.startsWith('## ') ? 2 : 3;
        const text = line.replace(/^#{2,3}\s+/, '').trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        toc.push({ level, text, id });
      }
    });

    return toc;
  }, [activeArticle]);

  // Render sanitized HTML using universal markdownEnhancer
  const renderedHtml = useMemo(() => {
    if (!activeArticle?.content) return '';
    return sanitizeHtml(parseMarkdownToHtml(activeArticle.content));
  }, [activeArticle]);

  // Enhance rendered Markdown with Mermaid diagrams, dark code blocks, and copy buttons
  useEffect(() => {
    enhanceMarkdownContainer(contentRef.current);
  }, [renderedHtml, activeId]);

  // Share link handler
  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Documentation link copied to clipboard!');
    } catch {
      showToast('Failed to copy link.');
    }
  };

  // Copy raw markdown handler
  const handleCopyRaw = async () => {
    if (!activeArticle) return;
    try {
      await navigator.clipboard.writeText(activeArticle.content);
      setCopiedRaw(true);
      showToast('Raw markdown copied to clipboard!');
      setTimeout(() => setCopiedRaw(false), 2000);
    } catch {
      showToast('Failed to copy raw markdown.');
    }
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Shared navigation tree renderer for both desktop sidebar and mobile drawer
  const renderNavTree = (isMobile: boolean) => (
    <>
      {/* Search Input */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search documentation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 12px',
            borderRadius: '6px',
            border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))',
            background: 'var(--eg-bg-input, #ffffff)',
            color: 'inherit',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Categories & Navigation Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {Object.entries(categories).map(([cat, docList]) => {
          const filtered = docList.filter(
            (d) =>
              d.title.toLowerCase().includes(search.toLowerCase()) ||
              d.category.toLowerCase().includes(search.toLowerCase()) ||
              (d.tags && d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
          );

          if (filtered.length === 0) return null;
          const isCollapsed = collapsedCategories[cat];

          return (
            <div key={cat}>
              <button
                type="button"
                onClick={() => toggleCategory(cat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  padding: '4px 0',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'var(--eg-text-muted, #94a3b8)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>{cat}</span>
                <span style={{ fontSize: '10px' }}>{isCollapsed ? '▶' : '▼'}</span>
              </button>

              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                  {filtered.map((d) => {
                    const isActive = d.id === activeId;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setActiveId(d.id);
                          if (isMobile) {
                            setMobileDrawerOpen(false);
                          }
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid transparent',
                          background: isActive
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'transparent',
                          color: isActive
                            ? 'var(--eg-color-primary, #10b981)'
                            : 'var(--eg-text-secondary, #475569)',
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span>{d.title}</span>
                        {d.readingTime && (
                          <span style={{ fontSize: '10px', opacity: 0.7 }}>
                            {d.readingTime}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div
      className={`eg-docs-viewer-root ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '280px minmax(0, 1fr) 240px',
        gap: '32px',
        alignItems: 'start',
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        color: 'var(--eg-text-primary, #0f172a)',
        position: 'relative',
        ...style,
      }}
    >
      <style>{`
        @keyframes egDocsDrawerSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes egDocsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .eg-docs-drawer-backdrop {
          animation: egDocsFadeIn 0.2s ease;
        }
        .eg-docs-mobile-drawer {
          animation: egDocsDrawerSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .eg-docs-floating-menu-btn {
          display: none;
        }
        .eg-docs-mobile-bar {
          display: none;
        }
        @media (max-width: 1200px) {
          .eg-docs-viewer-root {
            grid-template-columns: 260px minmax(0, 1fr) !important;
            gap: 24px !important;
          }
          .eg-docs-viewer-root > aside.eg-docs-toc {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .eg-docs-viewer-root {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
          }
          .eg-docs-desktop-sidebar {
            display: none !important;
          }
          .eg-docs-toc {
            display: none !important;
          }
          .eg-docs-mobile-bar {
            display: block !important;
          }
          .eg-docs-floating-menu-btn {
            display: inline-flex !important;
            align-items: center;
            gap: 7px;
            position: fixed;
            bottom: 24px;
            left: 20px;
            z-index: 850;
            padding: 10px 18px;
            border-radius: 9999px;
            background: var(--eg-color-primary, #10b981);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.45), 0 2px 6px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .eg-docs-floating-menu-btn:hover {
            background: var(--eg-color-primary-hover, #059669);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.55);
          }
          .eg-docs-floating-menu-btn:active {
            transform: scale(0.96);
          }
        }
      `}</style>

      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="eg-docs-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 99990,
          }}
        />
      )}

      {/* Mobile Drawer Aside (Slide-out menu for mobile view <= 900px) */}
      <aside
        className={`eg-docs-mobile-drawer ${mobileDrawerOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(340px, 86vw)',
          maxWidth: '360px',
          background: 'var(--eg-bg-surface, #ffffff)',
          borderRight: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.45)',
          zIndex: 99995,
          display: mobileDrawerOpen ? 'flex' : 'none',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px',
            borderBottom: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
            background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.02))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📑</span>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--eg-text-primary, #0f172a)' }}>
              Documentation
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close navigation"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'var(--eg-text-secondary, #64748b)',
              padding: '4px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', boxSizing: 'border-box' }}>
          {renderNavTree(true)}

          {tableOfContents.length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))' }}>
              <h5
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: 'var(--eg-text-muted, #94a3b8)',
                  margin: '0 0 10px',
                }}
              >
                On This Page
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {tableOfContents.map((heading, idx) => (
                  <a
                    key={idx}
                    href={`#${heading.id}`}
                    onClick={() => setMobileDrawerOpen(false)}
                    style={{
                      fontSize: heading.level === 2 ? '12.5px' : '11.5px',
                      padding: '4px 8px',
                      paddingLeft: heading.level === 2 ? '8px' : '18px',
                      color: 'var(--eg-text-secondary, #64748b)',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                      borderRadius: '4px',
                    }}
                  >
                    {heading.text}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 1. Desktop Sidebar Navigation (> 900px) */}
      <aside
        className="eg-docs-desktop-sidebar"
        style={{
          background: 'var(--eg-bg-surface, #ffffff)',
          border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
          borderRadius: 'var(--eg-radius-lg, 12px)',
          padding: '18px 16px',
          position: 'sticky',
          top: '84px',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
        }}
      >
        {renderNavTree(false)}
      </aside>

      {/* 2. Main Center Article Display */}
      <main
        style={{
          background: 'var(--eg-bg-surface, #ffffff)',
          border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
          borderRadius: 'var(--eg-radius-lg, 12px)',
          padding: 'clamp(20px, 3.5vw, 48px)',
          minHeight: '600px',
          boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
          minWidth: 0,
        }}
      >
        {activeArticle ? (
          <div>
            {/* Mobile Docs Navigation Trigger Bar (<= 900px) */}
            <div className="eg-docs-mobile-bar" style={{ display: 'none', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="Open documentation navigation menu"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))',
                  background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))',
                  color: 'var(--eg-text-primary, #0f172a)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'left',
                  gap: '10px',
                  boxShadow: 'var(--eg-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.04))',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--eg-color-primary, #10b981)', flexShrink: 0 }}>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--eg-text-muted, #94a3b8)', flexShrink: 0, fontWeight: 700 }}>
                      Topic:
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--eg-color-primary, #10b981)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activeArticle?.title || 'Select Article'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--eg-text-secondary, #475569)', flexShrink: 0 }}>
                  <span>Menu</span>
                  <span style={{ fontSize: '10px' }}>▼</span>
                </div>
              </button>
            </div>

            {/* Top Toolbar: Breadcrumb + Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingBottom: '16px',
                marginBottom: '24px',
                borderBottom: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
              }}
            >
              {/* Breadcrumb */}
              <div
                style={{
                  fontSize: '12.5px',
                  color: 'var(--eg-text-muted, #94a3b8)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Docs</span>
                <span>/</span>
                <span>{activeArticle.category}</span>
                <span>/</span>
                <span style={{ color: 'var(--eg-color-primary, #10b981)', fontWeight: 600 }}>
                  {activeArticle.title}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleShareLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))',
                    background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))',
                    color: 'var(--eg-text-secondary, #475569)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="Copy link to document"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRawModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))',
                    background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))',
                    color: 'var(--eg-text-secondary, #475569)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="View raw Markdown source"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                  <span>View Raw</span>
                </button>
              </div>
            </div>

            {/* Sanitized Markdown Render with Mermaid & Code Enhancements */}
            <div
              ref={contentRef}
              className="eg-markdown-content"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
              style={{
                fontSize: '15.5px',
                lineHeight: 1.75,
                color: 'var(--eg-text-secondary, #334155)',
              }}
            />

            {/* Footer Navigation (Prev / Next Article) */}
            <div
              style={{
                marginTop: '48px',
                paddingTop: '24px',
                borderTop: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              {prevArticle ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(prevArticle.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--eg-border-default, rgba(0,0,0,0.1))',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                    ← Previous
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--eg-color-primary, #10b981)' }}>
                    {prevArticle.title}
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(nextArticle.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--eg-border-default, rgba(0,0,0,0.1))',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'right',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                    Next →
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--eg-color-primary, #10b981)' }}>
                    {nextArticle.title}
                  </div>
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--eg-text-muted, #94a3b8)' }}>No article selected.</p>
        )}
      </main>

      {/* 3. Right Aside: "On This Page" Table of Contents */}
      <aside
        className="eg-docs-toc"
        style={{
          position: 'sticky',
          top: '84px',
          maxHeight: 'calc(100vh - 100px)',
          overflowY: 'auto',
          padding: '8px 12px',
        }}
      >
        <h5
          style={{
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: 'var(--eg-text-muted, #94a3b8)',
            margin: '0 0 12px',
          }}
        >
          On This Page
        </h5>
        {tableOfContents.length === 0 ? (
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Overview</span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tableOfContents.map((heading, idx) => (
              <a
                key={idx}
                href={`#${heading.id}`}
                style={{
                  fontSize: heading.level === 2 ? '12.5px' : '11.5px',
                  paddingLeft: heading.level === 2 ? '0px' : '12px',
                  color: 'var(--eg-text-secondary, #64748b)',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--eg-color-primary, #10b981)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--eg-text-secondary, #64748b)')}
              >
                {heading.text}
              </a>
            ))}
          </div>
        )}
      </aside>

      {/* Raw Markdown Source Modal */}
      {rawModalOpen && activeArticle && (
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
              <span>Raw Markdown Source ({activeArticle.title})</span>
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
                value={activeArticle.content}
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
                onClick={handleCopyRaw}
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
                {copiedRaw ? 'Copied!' : 'Copy Markdown'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mobile Topics Button (<= 900px) */}
      <button
        type="button"
        onClick={() => setMobileDrawerOpen(true)}
        className="eg-docs-floating-menu-btn"
        aria-label="Open documentation topics"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span>Topics</span>
      </button>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--eg-bg-surface-elevated, #1e293b)',
            border: '1px solid var(--eg-color-primary, #10b981)',
            color: 'var(--eg-color-primary, #10b981)',
            padding: '10px 18px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            fontSize: '13px',
            fontWeight: 600,
            zIndex: 999999,
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
