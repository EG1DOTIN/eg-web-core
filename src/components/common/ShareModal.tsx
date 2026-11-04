import React, { useState } from 'react';
import { Modal } from './Modal';
import { sanitizeUrl } from '../../services/sanitizer';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  description?: string;
  imageUrl?: string;
}

/**
 * Native Web Share dialog fallback modal with one-click social sharing,
 * thumbnail preview, and clipboard copy.
 *
 * @example
 * ```tsx
 * <ShareModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Modular Web Suite"
 *   url="https://example.com"
 *   imageUrl="https://example.com/thumb.webp"
 * />
 * ```
 */
export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  description = '',
  imageUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const targetUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const encodedUrl = encodeURIComponent(targetUrl);
  const shareText =
    description && description.trim() && description.trim() !== title.trim()
      ? `${title} - ${description.trim()}`
      : title;
  const encodedTitle = encodeURIComponent(shareText);

  const platforms = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366',
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: '#1DA1F2',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#229ED9',
    },
    {
      name: 'Reddit',
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: '#FF4500',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${title}"`} maxWidth="480px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Preview Card with Image & Title if Image or Description is Available */}
        {(imageUrl || description) && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              padding: '10px 12px',
              background: 'var(--eg-bg-subtle, rgba(255, 255, 255, 0.04))',
              border: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.1))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              overflow: 'hidden',
            }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                style={{
                  width: '58px',
                  height: '58px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  flexShrink: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--eg-text-primary, #f8fafc)',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {title}
              </div>
              {description && description.trim() !== title.trim() && (
                <div
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '12px',
                    color: 'var(--eg-text-muted, #94a3b8)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {description}
                </div>
              )}
            </div>
          </div>
        )}

        <p style={{ margin: 0, fontSize: '13px', color: 'var(--eg-text-secondary, #cbd5e1)' }}>
          Share this link with friends, developers, or colleagues:
        </p>

        {/* Quick Share Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {platforms.map((p) => (
            <a
              key={p.name}
              href={sanitizeUrl(p.url)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--eg-radius-md, 8px)',
                background: 'var(--eg-bg-subtle, rgba(255, 255, 255, 0.06))',
                border: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))',
                color: 'var(--eg-text-primary, #f8fafc)',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = p.color;
                e.currentTarget.style.color = p.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--eg-border-subtle, rgba(255, 255, 255, 0.12))';
                e.currentTarget.style.color = 'var(--eg-text-primary, #f8fafc)';
              }}
            >
              {p.name}
            </a>
          ))}
        </div>

        {/* Copy Link Input */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--eg-text-muted, #94a3b8)',
              marginBottom: '6px',
            }}
          >
            Direct Link
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={targetUrl}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--eg-radius-md, 8px)',
                border: '1px solid var(--eg-border-default, rgba(255, 255, 255, 0.15))',
                background: 'var(--eg-bg-input, #0f172a)',
                color: 'var(--eg-text-primary, #f8fafc)',
                fontSize: '13px',
                fontFamily: 'var(--eg-font-mono, monospace)',
              }}
            />
            <button
              type="button"
              onClick={handleCopy}
              style={{
                padding: '8px 16px',
                background: copied ? '#10b981' : 'var(--eg-color-primary, #2563eb)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--eg-radius-md, 8px)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                flexShrink: 0,
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
