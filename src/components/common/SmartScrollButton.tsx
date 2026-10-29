import React, { useState, useEffect, useCallback } from 'react';

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
  const [direction, setDirection] = useState<'down' | 'up'>('down');
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const evaluateScroll = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const maxScroll = scrollHeight - clientHeight;

    // Hide if negligible scrollable distance
    if (maxScroll <= 80) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const threshold = customThreshold ?? Math.min(300, maxScroll * 0.35);

    if (scrollTop < threshold) {
      setDirection('down');
    } else {
      setDirection('up');
    }
  }, [customThreshold]);

  useEffect(() => {
    evaluateScroll();

    let ticking = false;
    const handleScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          evaluateScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [evaluateScroll]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;

    if (direction === 'down') {
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight = window.innerHeight || 0;
      window.scrollTo({
        top: Math.max(0, scrollHeight - clientHeight),
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  // Determine theme colors based on variant or custom overrides
  const isAccent = variant === 'accent' || preset === 'mchess';

  const defaultBg =
    backgroundColor ||
    (isAccent
      ? 'rgba(245, 158, 11, 0.75)'
      : 'var(--eg-color-primary, #10b981)');

  const activeHoverBg =
    hoverBackgroundColor ||
    (isAccent
      ? '#f59e0b'
      : 'var(--eg-color-primary-hover, #059669)');

  const defaultColor =
    color ||
    (isAccent
      ? '#0f172a'
      : '#ffffff');

  const defaultShadow =
    isAccent
      ? '0 4px 14px rgba(245, 158, 11, 0.38)'
      : '0 4px 14px rgba(0, 0, 0, 0.25)';

  const hoverShadow =
    isAccent
      ? '0 6px 20px rgba(212, 175, 55, 0.65)'
      : '0 6px 20px rgba(16, 185, 129, 0.5)';

  if (!isVisible) return null;

  const title = direction === 'down' ? 'Scroll to Bottom' : 'Scroll to Top';

  return (
    <>
      <button
        type="button"
        id={id}
        className={`back-to-top-btn ${className}`}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={title}
        aria-label={title}
        data-direction={direction}
        style={{
          position: 'fixed',
          bottom,
          right,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: isHovered ? activeHoverBg : defaultBg,
          color: defaultColor,
          border: '1px solid rgba(255, 255, 255, 0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: isHovered ? hoverShadow : defaultShadow,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-3px) scale(1.06)' : 'none',
          opacity: isHovered ? 1 : 0.85,
          padding: 0,
          ...style,
        }}
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
            display: 'block',
            transition: 'transform 0.25s ease',
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

      {/* Responsive mobile scaling */}
      <style>{`
        @media (max-width: 768px) {
          #${id}.back-to-top-btn {
            bottom: 16px !important;
            right: 16px !important;
            width: 42px !important;
            height: 42px !important;
            z-index: 1000 !important;
            opacity: 0.82 !important;
          }
          #${id}.back-to-top-btn svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      `}</style>
    </>
  );
};
