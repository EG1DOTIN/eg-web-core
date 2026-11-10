import { default as React } from 'react';
import { AdminUser } from '../../services/adminAuthService';
export interface AdminNavItem {
    /** Unique navigation identifier */
    id: string;
    /** Label displayed in sidebar */
    label: string;
    /** Leading icon element */
    icon?: React.ReactNode;
    /** Optional badge counter or status text */
    badge?: string | number;
    /** Optional badge background tint */
    badgeColor?: string;
    /** Optional link destination */
    href?: string;
    /** Click handler */
    onClick?: () => void;
}
export interface AdminLayoutProps {
    /** Main title displayed in sidebar and header */
    brandTitle?: string;
    /** Optional subtitle or version tag */
    brandSubtitle?: string;
    /** Optional logo element */
    logo?: React.ReactNode;
    /** Navigation items list */
    navItems: AdminNavItem[];
    /** Currently active navigation ID */
    activeNavId?: string;
    /** Navigation item select handler */
    onNavSelect?: (id: string) => void;
    /** Currently authenticated admin user */
    user?: AdminUser | null;
    /** Logout handler callback */
    onLogout?: () => void;
    /** Current section/page title for the header */
    currentTitle?: string;
    /** Optional header actions slot (e.g. search, refresh button) */
    headerActions?: React.ReactNode;
    /** Main content body */
    children: React.ReactNode;
    /** Custom wrapper style */
    style?: React.CSSProperties;
    /** Custom class name */
    className?: string;
}
/**
 * Responsive administrative layout shell featuring collapsible sidebar,
 * top navigation bar with user profile, theme toggle, and mobile drawer.
 *
 * @param props - AdminLayoutProps configuration
 * @returns Responsive admin shell layout
 *
 * @example
 * ```tsx
 * <AdminLayout
 *   brandTitle="EG1 Management"
 *   navItems={[{ id: 'overview', label: 'Overview' }]}
 *   activeNavId="overview"
 *   onNavSelect={(id) => setActiveNav(id)}
 * >
 *   <OverviewView />
 * </AdminLayout>
 * ```
 */
export declare const AdminLayout: React.FC<AdminLayoutProps>;
