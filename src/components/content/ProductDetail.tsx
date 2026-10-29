import React, { useState } from 'react';
import { ProductItem, DataCache } from '../../services/DataCache';
import { Badge } from '../common/Badge';
import { ShareModal } from '../common/ShareModal';
import { sanitizeHtml, sanitizeUrl } from '../../services/sanitizer';

export interface ProductDetailProps {
  product: ProductItem;
  onBack?: () => void;
  backLabel?: string;
  onShare?: () => void;
  customActions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_APP_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231e293b'/><text x='50%' y='63%' font-family='sans-serif' font-weight='bold' font-size='38' fill='%2338bdf8' text-anchor='middle'>APP</text></svg>";

interface ParsedButton {
  label: string;
  url: string;
  isExternal: boolean;
  icon?: string;
}

/**
 * Generic, website-agnostic detail view for an application or software project.
 * Supports Markdown content rendering, dynamic version badge, action triggers, and share modal.
 *
 * @example
 * ```tsx
 * <ProductDetail product={selectedApp} onBack={() => navigate('/apps')} />
 * ```
 */
export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  backLabel = '← Back to all applications',
  customActions,
  className = '',
  style,
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const version = DataCache.resolveProductVersion(product);

  const resolveIconUrl = (raw?: string): string => {
    if (!raw || typeof raw !== 'string' || !raw.trim()) return DEFAULT_APP_ICON;
    let icon = raw.trim();
    if (icon.startsWith('./img/')) icon = './assets/' + icon.slice(2);
    else if (icon.startsWith('img/')) icon = 'assets/' + icon;
    return icon;
  };

  const parseActionButtons = (): ParsedButton[] => {
    const list: ParsedButton[] = [];

    const parseBtn = (btn: unknown, defaultLabel: string): ParsedButton | null => {
      if (!btn) return null;
      let label = defaultLabel;
      let url = '#';
      let icon = '';

      if (typeof btn === 'string') {
        url = btn;
      } else if (typeof btn === 'object' && btn !== null) {
        const obj = btn as Record<string, unknown>;
        if (obj.label && obj.url) {
          label = String(obj.label);
          url = String(obj.url);
        } else {
          const skipKeys = ['sametab', 'target', 'icon', 'class', 'btnclass', 'rel'];
          for (const [k, v] of Object.entries(obj)) {
            if (!skipKeys.includes(k.toLowerCase()) && typeof v === 'string') {
              label = k;
              url = v;
              break;
            }
          }
        }
        if (obj.icon && typeof obj.icon === 'string') {
          icon = obj.icon;
        }
      }

      if (!url || url === '#') return null;

      // Filter out redundant "VIEW DETAILS" buttons since we are already in detail view
      const labelUpper = label.toUpperCase().trim();
      if (
        labelUpper === 'VIEW DETAILS' ||
        labelUpper === 'DETAILS' ||
        labelUpper === 'VIEW APP' ||
        url.includes(`title=${product.slug}`) ||
        url.includes(`id=${product.id}`)
      ) {
        return null;
      }

      const isExternal = url.startsWith('http://') || url.startsWith('https://');
      return {
        label,
        url: sanitizeUrl(url),
        isExternal,
        icon,
      };
    };

    // Button 1
    const btn1 = parseBtn(
      product.button1,
      product.product_type === 'WebApp' ? 'Launch WebApp' : 'Open Website'
    );
    if (btn1) list.push(btn1);

    // Button 2
    const btn2 = parseBtn(product.button2, 'Download');
    if (btn2) list.push(btn2);

    // Fallback: If no button found but webapp_link exists
    if (list.length === 0 && product.webapp_link) {
      list.push({
        label: 'Launch Application',
        url: sanitizeUrl(product.webapp_link),
        isExternal: true,
      });
    }

    return list;
  };

  const actionButtons = parseActionButtons();
  const rawDescription =
    product.full_description ||
    product.description ||
    product.short_description ||
    'No detailed description available.';

  // Always pass description through sanitizeHtml for defense-in-depth XSS protection
  const sanitizedDescription = sanitizeHtml(
    rawDescription.includes('<')
      ? rawDescription
      : `<p>${rawDescription.replace(/\n\n+/g, '</p><p>')}</p>`
  );

  return (
    <article
      className={`eg-product-detail ${className}`}
      style={{
        background: 'var(--eg-bg-surface, #ffffff)',
        border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))',
        borderRadius: 'var(--eg-radius-lg, 14px)',
        padding: '32px',
        boxShadow: 'var(--eg-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.06))',
        maxWidth: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Top Header Card */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          borderBottom: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
          paddingBottom: '28px',
          marginBottom: '28px',
        }}
      >
        {/* Large App Icon */}
        <img
          src={resolveIconUrl(product.icon || product.imageUrl || product.image)}
          alt={product.title || product.name || 'Application Icon'}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_APP_ICON;
          }}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '16px',
            objectFit: 'contain',
            background: 'var(--eg-bg-canvas, #f8fafc)',
            border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.12))',
            padding: '8px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            flexShrink: 0,
          }}
        />

        {/* Title, Taxonomy Badges & Action Buttons */}
        <div style={{ flex: '1 1 300px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--eg-text-primary, #0f172a)',
                lineHeight: 1.25,
              }}
            >
              {product.title || product.name}
            </h1>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {product.category && <Badge variant="neutral" size="sm">{product.category}</Badge>}
              {product.product_type && <Badge variant="neutral" size="sm">{product.product_type}</Badge>}
              <Badge variant="primary" size="sm">v{version}</Badge>
            </div>
          </div>

          {product.subtitle && (
            <p
              style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                color: 'var(--eg-text-muted, #64748b)',
                fontWeight: 500,
              }}
            >
              {product.subtitle}
            </p>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
            {actionButtons.map((btn, idx) => (
              <a
                key={idx}
                href={btn.url}
                target={btn.isExternal ? '_blank' : undefined}
                rel={btn.isExternal ? 'noopener noreferrer' : undefined}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  minHeight: '42px',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: idx === 0 ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))',
                  color: idx === 0 ? '#ffffff' : 'var(--eg-text-primary, #0f172a)',
                  border: idx === 0 ? '1px solid transparent' : '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))',
                  boxShadow: idx === 0 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                }}
              >
                <span>{btn.label}</span>
                {btn.isExternal && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                )}
              </a>
            ))}

            {/* Share Trigger */}
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                minHeight: '42px',
                borderRadius: 'var(--eg-radius-md, 8px)',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))',
                color: 'var(--eg-text-secondary, #475569)',
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scoped Markdown typography & table styling */}
      <style>{`
        .eg-product-detail-body h1,
        .eg-product-detail-body h2,
        .eg-product-detail-body h3,
        .eg-product-detail-body h4 {
          color: var(--eg-text-primary, #0f172a);
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .eg-product-detail-body p {
          color: var(--eg-text-secondary, #334155);
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .eg-product-detail-body ul,
        .eg-product-detail-body ol {
          color: var(--eg-text-secondary, #334155);
          margin: 12px 0 18px 24px;
          padding-left: 8px;
          line-height: 1.65;
        }
        .eg-product-detail-body li {
          margin-bottom: 6px;
        }
        .eg-product-detail-body table {
          width: 100%;
          max-width: 720px;
          border-collapse: collapse;
          margin: 20px 0 24px 0;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          overflow: hidden;
        }
        .eg-product-detail-body th,
        .eg-product-detail-body td {
          padding: 10px 14px;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12));
          text-align: left;
        }
        .eg-product-detail-body th {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.04));
          color: var(--eg-text-primary, #0f172a);
          font-weight: 600;
        }
        .eg-product-detail-body td {
          color: var(--eg-text-secondary, #334155);
        }
        .eg-product-detail-body code {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.06));
          color: var(--eg-color-primary, #10b981);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: monospace;
        }
        .eg-product-detail-body pre {
          background: var(--eg-bg-canvas, #1e293b);
          color: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }
      `}</style>

      {/* Main Body: Markdown Document Pane */}
      <div
        className="eg-product-detail-body"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        style={{
          fontSize: '15px',
          lineHeight: 1.7,
          color: 'var(--eg-text-primary, #0f172a)',
        }}
      />

      {/* Custom Actions Slot */}
      {customActions && <div style={{ marginTop: '24px' }}>{customActions}</div>}

      {/* Footer Navigation */}
      <div
        style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))',
              border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))',
              color: 'var(--eg-text-primary, #0f172a)',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{backLabel}</span>
          </button>
        ) : (
          <a
            href="apps.html"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '8px',
              background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))',
              border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))',
              color: 'var(--eg-text-primary, #0f172a)',
              fontSize: '13.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>{backLabel}</span>
          </a>
        )}
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={product.title || product.name || 'Application'}
        description={product.description || product.short_description}
      />
    </article>
  );
};
