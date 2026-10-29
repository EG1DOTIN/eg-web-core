import React, { useState, useEffect } from 'react';
import { sanitizeUrl } from '../../services/sanitizer';

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
export const ImageSlider: React.FC<ImageSliderProps> = ({
  slides,
  intervalMs = 5000,
  autoPlay = true,
  className = '',
  onButtonClick,
}) => {
  const defaultSlides: SlideItem[] = [
    {
      title: 'Modular Component Architecture',
      subtitle: 'Universal React components, design tokens, and high-performance utilities built for modern web applications.',
      badge: 'Architecture',
      buttonLabel: 'Learn More',
      buttonHref: '#',
      crystalThemeIndex: 1,
    },
    {
      title: 'Responsive & Accessible Design',
      subtitle: 'Dynamic dark/light themes, touch-optimized layouts, and strict accessibility standards across all screen sizes.',
      badge: 'User Experience',
      buttonLabel: 'Explore Components',
      buttonHref: '#',
      crystalThemeIndex: 2,
    },
    {
      title: 'High Performance & Security',
      subtitle: 'Zero-overhead styling tokens, offline caching, and defense-in-depth sanitization built right in.',
      badge: 'Performance',
      buttonLabel: 'Get Started',
      buttonHref: '#',
      crystalThemeIndex: 3,
    },
  ];

  const activeSlides = slides || defaultSlides;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [autoPlay, activeSlides.length, intervalMs]);

  const slide = activeSlides[currentIndex];
  const crystalClass = `crystal-theme-${slide.crystalThemeIndex || (currentIndex % 6) + 1}`;

  return (
    <div
      id="mainContentHeaderslide"
      className={`eg-image-slider ${crystalClass} ${className}`}
      style={{
        position: 'relative',
        minHeight: '340px',
        padding: '60px 20px',
        background: 'var(--eg-crystal-gradient, linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%))',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        transition: 'background 0.8s ease-in-out',
        borderRadius: 'var(--eg-radius-lg, 12px)',
        margin: '16px 0 32px',
        overflow: 'hidden',
        boxShadow: 'var(--eg-shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.4))',
      }}
    >
      <div style={{ maxWidth: '780px', zIndex: 2, animation: 'egSliderFade 0.6s ease' }}>
        {slide.badge && (
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              color: '#ffffff',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            {slide.badge}
          </span>
        )}

        <h1
          style={{
            fontSize: 'var(--eg-text-4xl, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.5px',
            margin: '0 0 16px',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
          }}
        >
          {slide.title}
        </h1>

        {slide.subtitle && (
          <p
            style={{
              fontSize: 'var(--eg-text-lg, 1.15rem)',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 auto 28px',
              maxWidth: '620px',
            }}
          >
            {slide.subtitle}
          </p>
        )}

        {slide.buttonLabel && (
          <a
            href={sanitizeUrl(slide.buttonHref)}
            onClick={(e) => {
              if (onButtonClick) {
                e.preventDefault();
                onButtonClick(slide);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              color: '#0f172a',
              padding: '12px 28px',
              borderRadius: 'var(--eg-radius-pill, 9999px)',
              fontWeight: 700,
              fontSize: '15px',
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            }}
          >
            {slide.buttonLabel} →
          </a>
        )}
      </div>

      {/* Slide Indicators */}
      {activeSlides.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            display: 'flex',
            gap: '8px',
            zIndex: 3,
          }}
        >
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: idx === currentIndex ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: idx === currentIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes egSliderFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
