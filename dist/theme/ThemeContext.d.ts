import { default as React } from 'react';
/**
 * Available theme presets across the EG web ecosystem:
 * - `light-gray`: Standard high-contrast daylight theme
 * - `dark`: Deep navy-slate theme
 * - `crystal`: Rotating gradient theme (crystals 1 to 6)
 * - `slate-dark`: Authoritative slate/terminal dark aesthetic (alias: `clamui-dark`)
 */
export type EgTheme = 'light' | 'light-gray' | 'dark' | 'crystal' | 'clamui-dark' | 'slate-dark';
export interface ThemeContextValue {
    theme: EgTheme;
    setTheme: (theme: EgTheme) => void;
    toggleTheme: () => void;
    cycleTheme: () => void;
    isDark: boolean;
    allowedThemes: EgTheme[];
}
export declare const THEMES: EgTheme[];
export declare const STORAGE_KEY = "eg_theme";
export declare const ThemeContext: React.Context<ThemeContextValue | undefined>;
export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: EgTheme;
    storageKey?: string;
    allowedThemes?: EgTheme[];
}
/**
 * Top-level Theme Provider. Synchronizes document.documentElement attribute `data-theme`,
 * document.body classes (`dark-theme` / `light-theme`), and persists user preference in localStorage.
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from 'eg-web-core';
 *
 * export default function App() {
 *   return (
 *     <ThemeProvider defaultTheme="dark" allowedThemes={['dark', 'light']}>
 *       <MainContent />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
/**
 * Hook to access and control the current theme.
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme, isDark } = useTheme();
 * ```
 */
export declare const useTheme: () => ThemeContextValue;
/**
 * Raw JS string to place inside <head><script> to avoid Flash of Unstyled Content (FOUC).
 */
export declare const getFoucPreventScript: (storageKey?: string, defaultTheme?: string) => string;
