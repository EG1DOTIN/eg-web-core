import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  footer?: React.ReactNode;
}

/**
 * Accessible dialog modal with backdrop blur, keyboard ESC dismissal, and smooth scale-in animation.
 *
 * @example
 * ```tsx
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="App Details">
 *   <p>Detailed software release information goes here.</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '560px',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'egFadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          background: 'var(--eg-bg-surface-elevated, #1a2742)',
          border: '1px solid var(--eg-border-default, rgba(255, 255, 255, 0.15))',
          borderRadius: 'var(--eg-radius-lg, 14px)',
          boxShadow: 'var(--eg-shadow-lg, 0 16px 40px rgba(0, 0, 0, 0.6))',
          color: 'var(--eg-text-primary, #f8fafc)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
          animation: 'egScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'var(--eg-font-sans, sans-serif)',
        }}
      >
        {title && (
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--eg-bg-subtle, #0f172a)',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--eg-text-muted, #94a3b8)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>{children}</div>

        {footer && (
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.08))',
              background: 'var(--eg-bg-subtle, #0f172a)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes egFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes egScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
