import { default as React } from 'react';
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
export declare const ShareModal: React.FC<ShareModalProps>;
