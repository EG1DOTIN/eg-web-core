import { default as React } from 'react';
import { NewsItem } from '../../services/DataCache';
export interface TotemTickerProps {
    items: NewsItem[];
    intervalMs?: number;
    label?: string;
    theme?: 'auto' | 'light' | 'dark';
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Vertical rotating news/announcement ticker with hover-pause and smooth slide transition.
 *
 * @example
 * ```tsx
 * <TotemTicker items={newsItems} intervalMs={4000} label="Updates" theme="dark" />
 * ```
 */
export declare const TotemTicker: React.FC<TotemTickerProps>;
