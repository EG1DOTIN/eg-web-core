import React, { useState, useEffect, useCallback } from 'react';
import './SmartScrollButton.css';

export interface SmartScrollButtonProps {
  /** Visual variant: 'primary' (default emerald/theme), 'accent' (amber gold), or 'neutral' */
  variant?: 'primary' | 'accent' | 'neutral';
  /** Optional preset string for backward compatibility */
  preset?: string;
  /** Button element ID (default: 'backToTopBtn') */
  id?: string;
  /** Explicit scroll distance threshold to switch between down and up */
  threshold?: number;
  /** Custom background color */
  backgroundColor?: string;
  /** Custom hover background color */
  hoverBackgroundColor?: string;
  /** Custom icon color */
  color?: string;
  /** Distance from bottom viewport edge (default: '25px') */
  bottom?: string | number;
  /** Distance from right viewport edge (default: '25px') */
  right?: string | number;
  /** Custom className */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Smart bidirectional floating scroll assistant (Scroll Down to Bottom / Scroll Up to Top).
 * - When near top: points DOWN and smoothly scrolls to bottom.
 * - When scrolled: points UP and smoothly scrolls back to top.
 * - Automatically hides when the page has negligible scrollable height (<= 80px).
 *
 * @example
 * ```tsx
 * <SmartScrollButton variant="primary" />
 * ```
 */
export const SmartScrollButton: React.FC<SmartScrollButtonProps> = ({
  variant = 'primary',
  preset,
  id = 'backToTopBtn',
  threshold: customThreshold,
  backgroundColor,
  hoverBackgroundColor,
  color,
  bottom = '25px',
  right = '25px',
  className = '',
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [isHovered, setIsHovered] = useState(false);

  // Backward compatibility: map preset="mchess" or preset="accent" to accent
  const effectiveVariant: 'primary' | 'accent' | 'neutral' =
    preset === 'mchess' || preset === 'accent' ? 'accent' : variant;

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const maxScroll = scrollHeight - clientHeight;

    // Negligible scrollable content (< 80px difference) -> hide button
    if (maxScroll <= 80) {
      setIsVisible(false);
      return;
    }

    // Default threshold: halfway through the page, bounded between 300px and 800px
    const defaultThreshold = Math.min(Math.max(maxScroll / 2, 300), 800);
    const threshold = customThreshold !== undefined ? customThreshold : defaultThreshold;

    setIsVisible(true);
    setDirection(scrollY < threshold ? 'down' : 'up');
  }, [customThreshold]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  const handleClick = () => {
    if (direction === 'down') {
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      window.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  const title = direction === 'down' ? 'Scroll to Bottom' : 'Scroll to Top';
  const variantClass = `eg-smart-scroll-btn--${effectiveVariant}`;

  // Custom overrides (if provided via props)
  const customStyle: React.CSSProperties = {
    bottom,
    right,
    ...(backgroundColor ? { backgroundColor: isHovered && hoverBackgroundColor ? hoverBackgroundColor : backgroundColor } : {}),
    ...(color ? { color } : {}),
    ...style,
  };

  return (
    <button
      type="button"
      id={id}
      className={`back-to-top-btn eg-smart-scroll-btn ${variantClass} ${className}`.trim()}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      aria-label={title}
      data-direction={direction}
      style={customStyle}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: direction === 'down' ? 'translateY(1px)' : 'translateY(-1px)',
        }}
      >
        {direction === 'down' ? (
          <polyline points="6 9 12 15 18 9" />
        ) : (
          <polyline points="18 15 12 9 6 15" />
        )}
      </svg>
    </button>
  );
};
