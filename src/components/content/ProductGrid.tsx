import React, { useState } from 'react';
import { ProductItem, DataCache } from '../../services/DataCache';
import { Badge } from '../common/Badge';
import { ShareModal } from '../common/ShareModal';
import { sanitizeUrl } from '../../services/sanitizer';

export interface ProductCardProps {
  product: ProductItem;
  onSelect?: (product: ProductItem) => void;
}

const DEFAULT_APP_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231e293b'/><text x='50%' y='63%' font-family='sans-serif' font-weight='bold' font-size='38' fill='%2338bdf8' text-anchor='middle'>APP</text></svg>";

/**
 * Application card showcasing live GitHub release version, platform buttons, and share modal.
 *
 * @example
 * ```tsx
 * <ProductCard product={appItem} onSelect={(item) => openModal(item)} />
 * ```
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const version = DataCache.resolveProductVersion(product);

  const resolveIconUrl = (raw?: string): string => {
    if (!raw || typeof raw !== 'string' || !raw.trim()) return DEFAULT_APP_ICON;
    let icon = raw.trim();
    if (icon.startsWith('./img/')) icon = './assets/' + icon.slice(2);
    else if (icon.startsWith('img/')) icon = 'assets/' + icon;
    return icon;
  };

  const parseBtn = (btn: unknown, defaultLabel: string) => {
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
    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    return {
      label,
      url: sanitizeUrl(url),
      isExternal,
      icon,
    };
  };

  const btn1 = parseBtn(
    product.button1,
    product.product_type === 'WebApp' ? 'Launch' : 'View Details'
  ) || (product.webapp_link ? { label: 'Launch', url: sanitizeUrl(product.webapp_link), isExternal: true } : null);

  const btn2 = parseBtn(
    product.button2,
    product.attach_upload_file_1 ? 'Download' : 'Source Code'
  );

  const isBtn1Detail =
    btn1 &&
    (btn1.label.toUpperCase().includes('DETAIL') ||
      btn1.url.includes('title=') ||
      btn1.url.includes('id=') ||
      !btn1.isExternal);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate to detail if not clicking directly on a button or anchor
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;
    if (onSelect) {
      onSelect(product);
    }
  };

  return (
    <article
      className="eg-product-card"
      onClick={handleCardClick}
      style={{
        background: 'var(--eg-bg-surface, #ffffff)',
        border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
        borderRadius: 'var(--eg-radius-lg, 12px)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))',
        position: 'relative',
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--eg-shadow-md, 0 8px 24px rgba(0, 0, 0, 0.12))';
        e.currentTarget.style.borderColor = 'var(--eg-color-primary, #10b981)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))';
        e.currentTarget.style.borderColor = 'var(--eg-border-default, rgba(0, 0, 0, 0.1))';
      }}
    >
      <div>
        {/* Header: Icon, Title & Badges */}
        <div
          className="eg-product-card-header"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            marginBottom: '14px',
          }}
        >
          {/* App Icon */}
          <img
            src={resolveIconUrl(product.icon || product.imageUrl || product.image)}
            alt={product.title || product.name || 'App icon'}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_APP_ICON;
            }}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '10px',
              objectFit: 'contain',
              background: 'var(--eg-bg-canvas, #f1f5f9)',
              border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))',
              padding: '4px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
              flexShrink: 0,
            }}
          />

          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--eg-text-primary, #0f172a)',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                }}
              >
                {product.title || product.name}
              </h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                {product.category && <Badge variant="neutral" size="sm">{product.category}</Badge>}
                <Badge variant="primary" size="sm">v{version}</Badge>
              </div>
            </div>

            {product.subtitle && (
              <span style={{ fontSize: '12px', color: 'var(--eg-text-muted, #94a3b8)', fontWeight: 500, display: 'block', marginTop: '2px' }}>
                {product.subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--eg-text-secondary, #475569)',
            lineHeight: 1.55,
            margin: '0 0 18px',
            minHeight: '42px',
            wordBreak: 'break-word',
          }}
        >
          {product.short_description || product.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div
        className="eg-product-card-actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingTop: '16px',
          borderTop: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.06))',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: '1 1 auto' }}>
          {btn1 && (
            isBtn1Detail && onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(product)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  background: 'var(--eg-color-primary, #10b981)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {btn1.label}
              </button>
            ) : (
              <a
                href={btn1.url}
                target={btn1.isExternal ? '_blank' : undefined}
                rel={btn1.isExternal ? 'noopener noreferrer' : undefined}
                onClick={(e) => {
                  if (!btn1.isExternal && onSelect) {
                    e.preventDefault();
                    onSelect(product);
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  background: 'var(--eg-color-primary, #10b981)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {btn1.label}
              </a>
            )
          )}

          {btn2 && (
            <a
              href={btn2.url}
              target={btn2.isExternal ? '_blank' : undefined}
              rel={btn2.isExternal ? 'noopener noreferrer' : undefined}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--eg-radius-md, 8px)',
                background: 'var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))',
                border: '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.1))',
                color: 'var(--eg-text-primary, #0f172a)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {btn2.label}
            </a>
          )}
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShareOpen(true);
          }}
          title="Share application"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--eg-text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={product.title || product.name || 'Application'}
        description={product.short_description || product.description}
      />
    </article>
  );
};

export interface ProductGridProps {
  products: ProductItem[];
  columns?: number;
  onSelect?: (product: ProductItem) => void;
}

/**
 * Responsive CSS grid container for product and application cards.
 *
 * @example
 * ```tsx
 * <ProductGrid products={catalog} onSelect={(app) => console.log(app.title)} />
 * ```
 */
export const ProductGrid: React.FC<ProductGridProps> = ({ products, onSelect }) => {
  return (
    <div
      className="eg-product-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onSelect={onSelect} />
      ))}
    </div>
  );
};
