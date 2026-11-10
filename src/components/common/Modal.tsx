import React, { useEffect } from 'react';
import './Modal.css';

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
 * @param props - ModalProps configuration
 * @returns Dialog modal or null if not open
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
      className="eg-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="eg-modal-container" style={{ maxWidth }}>
        {title && (
          <div className="eg-modal-header">
            <h3 className="eg-modal-header__title">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="eg-modal-header__close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div className="eg-modal-body">{children}</div>

        {footer && <div className="eg-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};
