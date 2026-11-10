import { default as React } from 'react';
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
export declare const Modal: React.FC<ModalProps>;
