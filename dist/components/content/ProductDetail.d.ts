import { default as React } from 'react';
import { ProductItem } from '../../services/DataCache';
export interface ProductDetailProps {
    product: ProductItem;
    onBack?: () => void;
    backLabel?: string;
    onShare?: () => void;
    customActions?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
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
export declare const ProductDetail: React.FC<ProductDetailProps>;
