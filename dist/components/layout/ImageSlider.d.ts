import { default as React } from 'react';
export interface SlideItem {
    id?: string;
    title: string;
    subtitle?: string;
    badge?: string;
    buttonLabel?: string;
    buttonHref?: string;
    crystalThemeIndex?: number;
}
export interface ImageSliderProps {
    slides?: SlideItem[];
    intervalMs?: number;
    autoPlay?: boolean;
    className?: string;
    onButtonClick?: (slide: SlideItem) => void;
}
/**
 * Animated hero banner with cross-fading crystal theme gradient backgrounds,
 * slide indicator dots, and responsive typography.
 *
 * @example
 * ```tsx
 * <ImageSlider autoPlay={true} intervalMs={5000} />
 * ```
 */
export declare const ImageSlider: React.FC<ImageSliderProps>;
