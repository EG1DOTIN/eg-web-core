import { default as React } from 'react';
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
/**
 * KPI metric stat card for administrative dashboards with trend indicator.
 *
 * @param props - StatCardProps configuration
 * @returns Metric stat card element
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Active Users"
 *   value="1,248"
 *   subtitle="Past 24 hours"
 *   trend={{ value: "+12%", direction: "up" }}
 * />
 * ```
 */
export declare const StatCard: React.FC<StatCardProps>;
