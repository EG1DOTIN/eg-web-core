import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

export const THEMES: EgTheme[] = ['light', 'light-gray', 'dark', 'crystal', 'slate-dark', 'clamui-dark'];
export const STORAGE_KEY = 'eg_theme';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

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
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light-gray',
  storageKey = STORAGE_KEY,
  allowedThemes = THEMES,
}) => {
  const [theme, setThemeState] = useState<EgTheme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && allowedThemes.includes(stored as EgTheme)) {
        return stored as EgTheme;
      }
    } catch {
      // Fallback
    }
    return defaultTheme;
  });

  const checkIsDark = (t: EgTheme): boolean => {
    return t === 'dark' || t === 'clamui-dark' || t === 'slate-dark' || t === 'crystal';
  };

  const applyTheme = useCallback((targetTheme: EgTheme) => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', targetTheme);

    const isTargetDark = checkIsDark(targetTheme);
    if (document.body) {
      document.body.setAttribute('data-theme', targetTheme);
      if (isTargetDark) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    }

    try {
      localStorage.setItem(storageKey, targetTheme);
      // Synchronize mchess_theme key if on mchess platform
      if (storageKey === 'mchess_theme' || targetTheme === 'dark' || targetTheme === 'light') {
        localStorage.setItem('mchess_theme', isTargetDark ? 'dark' : 'light');
      }
    } catch {
      // Ignore
    }
  }, [storageKey]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = useCallback((newTheme: EgTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      let nextTheme: EgTheme;
      if (allowedThemes && allowedThemes.length === 2) {
        nextTheme = prev === allowedThemes[0] ? allowedThemes[1] : allowedThemes[0];
      } else {
        const isCurrentDark = checkIsDark(prev);
        if (allowedThemes.includes('dark') && allowedThemes.includes('light')) {
          nextTheme = isCurrentDark ? 'light' : 'dark';
        } else {
          nextTheme = isCurrentDark ? 'light-gray' : 'dark';
        }
      }
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, [allowedThemes, applyTheme]);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const activeList = allowedThemes && allowedThemes.length > 0 ? allowedThemes : THEMES;
      const idx = activeList.indexOf(prev);
      const nextTheme = activeList[(idx + 1) % activeList.length];
      applyTheme(nextTheme);
      return nextTheme;
    });
  }, [allowedThemes, applyTheme]);

  const isDark = checkIsDark(theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, cycleTheme, isDark, allowedThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access and control the current theme.
 *
 * @example
 * ```tsx
 * const { theme, toggleTheme, isDark } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Raw JS string to place inside <head><script> to avoid Flash of Unstyled Content (FOUC).
 */
export const getFoucPreventScript = (storageKey = STORAGE_KEY, defaultTheme = 'light-gray'): string => `
(function() {
  try {
    var saved = localStorage.getItem('${storageKey}') || '${defaultTheme}';
    document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', '${defaultTheme}');
  }
})();
`.trim();
