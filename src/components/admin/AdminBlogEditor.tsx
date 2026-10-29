/**
 * @file AdminBlogEditor.tsx
 * @description Advanced Markdown Blog Article Editor & YAML Frontmatter Generator.
 * Features:
 *   - Auto-slug generation from title with custom override lock.
 *   - Interactive multi-tag chip creator and description character length gauge.
 *   - Rich Markdown formatting toolbar (headings, code blocks, tables, blockquotes).
 *   - Real-time split preview powered by the core <MarkdownViewer /> component.
 *   - One-click YAML frontmatter generator, clipboard copy, and .md file downloader.
 */

import React, { useState, useRef, useCallback } from 'react';
import { MarkdownViewer } from '../content/MarkdownViewer';

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getTodayIsoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const AdminBlogEditor: React.FC<AdminBlogEditorProps> = ({
  initialMetadata,
  initialBody = '',
  categories = ['Programming', 'Tutorial', 'Architecture', 'Security', 'Announcements'],
  defaultAuthor = 'Admin',
  onSave,
  title = 'Blog Article Editor',
  style,
  className = '',
}) => {
  const [metadata, setMetadata] = useState<BlogArticleMetadata>({
    title: initialMetadata?.title || '',
    slug: initialMetadata?.slug || (initialMetadata?.title ? slugify(initialMetadata.title) : ''),
    date: initialMetadata?.date || getTodayIsoDate(),
    author: initialMetadata?.author || defaultAuthor,
    category: initialMetadata?.category || categories[0] || 'General',
    tags: initialMetadata?.tags || ['Guide', 'Web'],
    description: initialMetadata?.description || '',
  });

  const [body, setBody] = useState<string>(
    initialBody ||
      `## Overview\n\nIntroduce the core topic and key concepts.\n\n## Getting Started\n\nExplain the initial steps, requirements, or prerequisites.\n\n\`\`\`ts\n// Example code snippet\nexport function example() {\n  console.log("Hello, World!");\n}\n\`\`\`\n\n## Key Benefits & Architecture\n\nDetail the design decisions and advantages.\n\n## Conclusion\n\nSummarize findings and next steps.`
  );

  const [tagInput, setTagInput] = useState<string>('');
  const [lockSlug, setLockSlug] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [copied, setCopied] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-slug sync when locked
  const handleTitleChange = (val: string) => {
    setMetadata((prev) => ({
      ...prev,
      title: val,
      slug: lockSlug ? slugify(val) : prev.slug,
    }));
  };

  // Tag management
  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim().replace(/^#/, '');
    if (clean && !metadata.tags.includes(clean)) {
      setMetadata((prev) => ({
        ...prev,
        tags: [...prev.tags, clean],
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && metadata.tags.length > 0) {
      handleRemoveTag(metadata.tags[metadata.tags.length - 1]);
    }
  };

  // Toolbar action helpers
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.slice(start, end);

    const replacement = `${prefix}${selected || 'text'}${suffix}`;
    const newText = text.slice(0, start) + replacement + text.slice(end);

    setBody(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 50);
  };

  // Build complete Markdown document with YAML frontmatter
  const buildFullMarkdown = useCallback((): string => {
    const tagsYaml = metadata.tags.map((t) => `  - "${t}"`).join('\n');
    const safeDesc = metadata.description.replace(/"/g, '\\"');

    return `---
title: "${metadata.title}"
slug: "${metadata.slug}"
date: "${metadata.date}"
author: "${metadata.author}"
category: "${metadata.category}"
description: "${safeDesc}"
tags:
${tagsYaml}
---

${body}
`;
  }, [metadata, body]);

  // Copy to clipboard
  const handleCopy = () => {
    const full = buildFullMarkdown();
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Download .md file
  const handleDownload = () => {
    const full = buildFullMarkdown();
    const blob = new Blob([full], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.slug || 'article'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save handler
  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave(buildFullMarkdown(), metadata);
    } finally {
      setSaving(false);
    }
  };

  const descLen = metadata.description.length;
  const isDescOptimal = descLen >= 120 && descLen <= 160;

  return (
    <div
      className={`eg-admin-blog-editor ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--eg-space-6, 24px)',
        width: '100%',
        ...style,
      }}
    >
      {/* Top Action Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'var(--eg-bg-secondary, #111827)',
          padding: 'var(--eg-space-4, 16px) var(--eg-space-5, 20px)',
          borderRadius: 'var(--eg-radius-lg, 14px)',
          border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2
            style={{
              fontSize: 'var(--eg-text-lg, 1.125rem)',
              fontWeight: 700,
              color: 'var(--eg-text-primary, #f9fafb)',
              margin: 0,
            }}
          >
            {title}
          </h2>

          {/* Mode Switcher */}
          <div
            style={{
              display: 'inline-flex',
              background: 'var(--eg-bg-primary, #030712)',
              padding: '2px',
              borderRadius: 'var(--eg-radius-md, 8px)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.1))',
            }}
          >
            {(['split', 'edit', 'preview'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--eg-radius-sm, 6px)',
                  border: 'none',
                  background: viewMode === mode ? 'var(--eg-color-primary, #10b981)' : 'transparent',
                  color: viewMode === mode ? '#ffffff' : 'var(--eg-text-muted, #9ca3af)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  transition: 'background var(--eg-transition-fast, 150ms)',
                }}
              >
                {mode === 'split' ? 'Split View' : mode === 'edit' ? 'Editor' : 'Preview'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'var(--eg-bg-tertiary, #1f2937)',
              border: '1px solid',
              borderColor: copied ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-border, rgba(255,255,255,0.12))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              color: copied ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-primary, #f9fafb)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'var(--eg-bg-tertiary, #1f2937)',
              border: '1px solid var(--eg-border, rgba(255,255,255,0.12))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download .md</span>
          </button>

          {onSave && (
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'var(--eg-color-primary, #10b981)',
                border: 'none',
                borderRadius: 'var(--eg-radius-md, 8px)',
                color: '#ffffff',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>{saving ? 'Saving...' : 'Save Article'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Frontmatter Metadata Form Panel */}
      <div
        style={{
          background: 'var(--eg-bg-secondary, #111827)',
          border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
          borderRadius: 'var(--eg-radius-lg, 14px)',
          padding: 'var(--eg-space-5, 20px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--eg-space-4, 16px)',
        }}
      >
        {/* Title */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--eg-text-muted, #9ca3af)', marginBottom: '4px' }}>
            Article Title *
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Modern Full-Stack Architecture with React & Cloud Services"
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--eg-bg-primary, #030712)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Slug */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--eg-text-muted, #9ca3af)' }}>
              URL Slug *
            </label>
            <button
              type="button"
              onClick={() => setLockSlug(!lockSlug)}
              style={{
                background: 'none',
                border: 'none',
                color: lockSlug ? 'var(--eg-color-sky, #38bdf8)' : 'var(--eg-color-amber, #f59e0b)',
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
            >
              {lockSlug ? '🔒 Auto Sync' : '🔓 Custom Override'}
            </button>
          </div>
          <input
            type="text"
            value={metadata.slug}
            disabled={lockSlug}
            onChange={(e) => setMetadata({ ...metadata, slug: slugify(e.target.value) })}
            placeholder="article-url-slug"
            style={{
              width: '100%',
              padding: '8px 12px',
              background: lockSlug ? 'var(--eg-bg-tertiary, #1f2937)' : 'var(--eg-bg-primary, #030712)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              color: lockSlug ? 'var(--eg-text-muted, #9ca3af)' : 'var(--eg-text-primary, #f9fafb)',
              fontFamily: 'var(--eg-font-mono, monospace)',
              fontSize: '0.8125rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category & Author */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--eg-text-muted, #9ca3af)', marginBottom: '4px' }}>
              Category
            </label>
            <select
              value={metadata.category}
              onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--eg-bg-primary, #030712)',
                border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
                borderRadius: 'var(--eg-radius-md, 8px)',
                color: 'var(--eg-text-primary, #f9fafb)',
                fontSize: '0.8125rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--eg-text-muted, #9ca3af)', marginBottom: '4px' }}>
              Author
            </label>
            <input
              type="text"
              value={metadata.author}
              onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--eg-bg-primary, #030712)',
                border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
                borderRadius: 'var(--eg-radius-md, 8px)',
                color: 'var(--eg-text-primary, #f9fafb)',
                fontSize: '0.8125rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Tags Chip Manager */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--eg-text-muted, #9ca3af)', marginBottom: '4px' }}>
            Tags (Press Enter or Comma to add)
          </label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: 'var(--eg-bg-primary, #030712)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              minHeight: '42px',
            }}
          >
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 'var(--eg-radius-sm, 6px)',
                  color: 'var(--eg-color-primary, #10b981)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--eg-color-primary, #10b981)',
                    cursor: 'pointer',
                    padding: '0 2px',
                    fontSize: '0.75rem',
                  }}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={metadata.tags.length === 0 ? 'Type tag and press Enter...' : ''}
              style={{
                flex: 1,
                minWidth: '120px',
                background: 'transparent',
                border: 'none',
                color: 'var(--eg-text-primary, #f9fafb)',
                fontSize: '0.8125rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Description / Summary */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--eg-text-muted, #9ca3af)' }}>
              Summary Description (for SEO Cards & Previews) *
            </label>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: isDescOptimal ? '#34d399' : 'var(--eg-text-muted, #9ca3af)',
              }}
            >
              {descLen} chars (Recommended: 120-160)
            </span>
          </div>
          <textarea
            rows={2}
            value={metadata.description}
            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
            placeholder="A concise, compelling overview of the article topics..."
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--eg-bg-primary, #030712)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              fontSize: '0.8125rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Editor & Preview Workspace */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            viewMode === 'split' ? '1fr 1fr' : viewMode === 'edit' ? '1fr' : '1fr',
          gap: 'var(--eg-space-4, 16px)',
          minHeight: '600px',
        }}
      >
        {/* Left: Textarea Editor */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--eg-bg-secondary, #111827)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
              borderRadius: 'var(--eg-radius-lg, 14px)',
              overflow: 'hidden',
            }}
          >
            {/* Formatting Toolbar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 12px',
                background: 'var(--eg-bg-tertiary, #1a2234)',
                borderBottom: '1px solid var(--eg-border, rgba(255, 255, 255, 0.06))',
              }}
            >
              {[
                { label: 'B', title: 'Bold', action: () => insertFormatting('**', '**') },
                { label: 'I', title: 'Italic', action: () => insertFormatting('*', '*') },
                { label: 'H2', title: 'Heading 2', action: () => insertFormatting('## ') },
                { label: 'H3', title: 'Heading 3', action: () => insertFormatting('### ') },
                { label: '`Code`', title: 'Inline Code', action: () => insertFormatting('`', '`') },
                { label: '``` Block', title: 'Code Block', action: () => insertFormatting('```ts\n', '\n```') },
                { label: 'Quote', title: 'Blockquote', action: () => insertFormatting('> ') },
                { label: 'List', title: 'Bullet List', action: () => insertFormatting('- ') },
                { label: 'Link', title: 'Hyperlink', action: () => insertFormatting('[', '](https://example.com)') },
              ].map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  title={btn.title}
                  onClick={btn.action}
                  style={{
                    padding: '4px 8px',
                    background: 'var(--eg-bg-secondary, #111827)',
                    border: '1px solid var(--eg-border, rgba(255,255,255,0.08))',
                    borderRadius: 'var(--eg-radius-sm, 6px)',
                    color: 'var(--eg-text-primary, #f9fafb)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Markdown Textarea */}
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your article in Markdown format..."
              style={{
                flex: 1,
                width: '100%',
                padding: '16px',
                background: 'var(--eg-bg-primary, #030712)',
                color: 'var(--eg-text-primary, #f9fafb)',
                fontFamily: 'var(--eg-font-mono, monospace)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                border: 'none',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
                minHeight: '520px',
              }}
            />
          </div>
        )}

        {/* Right: Live MarkdownViewer Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--eg-bg-secondary, #111827)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
              borderRadius: 'var(--eg-radius-lg, 14px)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '8px 16px',
                background: 'var(--eg-bg-tertiary, #1a2234)',
                borderBottom: '1px solid var(--eg-border, rgba(255, 255, 255, 0.06))',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--eg-text-muted, #9ca3af)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Live Rendered Preview
            </div>

            <div
              style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                maxHeight: '700px',
                background: 'var(--eg-bg-primary, #030712)',
              }}
            >
              {/* Article Header Card Preview */}
              <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--eg-border, rgba(255,255,255,0.08))', paddingBottom: '16px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--eg-color-primary, #10b981)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {metadata.category}
                </span>
                <h1
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--eg-text-primary, #f9fafb)',
                    margin: '12px 0 8px 0',
                    lineHeight: 1.25,
                  }}
                >
                  {metadata.title || 'Untitled Article'}
                </h1>
                <div style={{ fontSize: '0.8125rem', color: 'var(--eg-text-muted, #9ca3af)' }}>
                  By {metadata.author} • {metadata.date}
                </div>
                {metadata.description && (
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--eg-text-secondary, #d1d5db)',
                      fontStyle: 'italic',
                      marginTop: '8px',
                    }}
                  >
                    {metadata.description}
                  </p>
                )}
              </div>

              {/* Rendered Body Content */}
              <MarkdownViewer content={body} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
