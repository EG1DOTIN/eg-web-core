import { default as React } from 'react';
export type AntivirusState = 'protected' | 'warning' | 'danger';
export type DesktopTab = 'dashboard' | 'scan' | 'quarantine' | 'logs' | 'settings';
export interface QuarantinedItem {
    id: string;
    fileName: string;
    threatName: string;
    quarantinedAt: string;
    originalPath: string;
    size: string;
}
export interface DesktopPreviewSimulatorProps {
    appName?: string;
    version?: string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Interactive PySide6 Qt desktop antivirus GUI simulator for web browsers.
 * Replicates a desktop security interface with a 3-tier status matrix
 * (Protected/Warning/Danger), 4 scan profiles, live scanning modal,
 * Quarantine threat manager, terminal activity logs, and settings tabs.
 *
 * @example
 * ```tsx
 * <DesktopPreviewSimulator appName="Security Suite" version="1.0.0" />
 * ```
 */
export declare const DesktopPreviewSimulator: React.FC<DesktopPreviewSimulatorProps>;
