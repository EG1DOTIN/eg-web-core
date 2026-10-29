/**
 * @file StatCard.tsx
 * @description KPI metric stat card for administrative dashboards.
 * Displays value, label, contextual icon badge, trend indicators, and hover animations.
 */

import React from 'react';

export interface StatCardProps {
  /** Metric label or title (e.g. 'Total Unique Visitors') */
  title: string;
  /** Primary metric value (e.g. 14280, '99.98%') */
  value: string | number;
  /** Optional descriptive footnote or contextual note */
  subtitle?: string;
  /** Primary icon element */
  icon?: React.ReactNode;
  /** Background color for icon container */
  iconBgColor?: string;
  /** Foreground icon color */
  iconColor?: string;
  /** Optional trend indicator (percentage or difference) */
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  /** Optional click handler (makes card interactive) */
  onClick?: () => void;
  /** Custom wrapper style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'rgba(16, 185, 129, 0.12)',
  iconColor = 'var(--eg-color-primary, #10b981)',
  trend,
  onClick,
  style,
  className = '',
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      className={`eg-stat-card ${className}`}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--eg-space-5, 20px)',
        background: 'var(--eg-bg-secondary, #111827)',
        border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
        borderRadius: 'var(--eg-radius-lg, 14px)',
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.2)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform var(--eg-transition-fast, 150ms), border-color var(--eg-transition-fast, 150ms)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '120px',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <span
            style={{
              fontSize: 'var(--eg-text-xs, 0.8125rem)',
              fontWeight: 600,
              color: 'var(--eg-text-muted, #9ca3af)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </span>
          <div
            style={{
              fontSize: 'var(--eg-text-3xl, 2rem)',
              fontWeight: 700,
              color: 'var(--eg-text-primary, #f9fafb)',
              marginTop: 'var(--eg-space-1, 4px)',
              lineHeight: 1.1,
              fontFamily: 'var(--eg-font-sans, inherit)',
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
        </div>

        {icon && (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--eg-radius-md, 10px)',
              background: iconBgColor,
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: 'var(--eg-space-3, 12px)',
            fontSize: 'var(--eg-text-xs, 0.75rem)',
          }}
        >
          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 600,
                color:
                  trend.direction === 'up'
                    ? '#34d399'
                    : trend.direction === 'down'
                    ? '#f87171'
                    : 'var(--eg-text-muted, #9ca3af)',
              }}
            >
              {trend.direction === 'up' ? '▲' : trend.direction === 'down' ? '▼' : '●'} {trend.value}
            </span>
          )}
          {subtitle && (
            <span style={{ color: 'var(--eg-text-muted, #9ca3af)' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
