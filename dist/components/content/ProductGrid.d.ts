import { default as React } from 'react';
import { ProductItem } from '../../services/DataCache';
export interface ProductCardProps {
    product: ProductItem;
    onSelect?: (product: ProductItem) => void;
}
/**
 * Application card showcasing live GitHub release version, platform buttons, and share modal.
 *
 * @example
 * ```tsx
 * <ProductCard product={appItem} onSelect={(item) => openModal(item)} />
 * ```
 */
export declare const ProductCard: React.FC<ProductCardProps>;
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
export declare const ProductGrid: React.FC<ProductGridProps>;
