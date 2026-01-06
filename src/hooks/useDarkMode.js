import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage dark mode with system preference detection and persistence
 * @returns {object} Dark mode state and controls
 */
export const useDarkMode = () => {
    // Initialize from localStorage or system preference
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage first
        const stored = localStorage.getItem('theme');
        if (stored) {
            return stored === 'dark';
        }
        // Fall back to system preference
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    const [isSystem, setIsSystem] = useState(() => {
        return !localStorage.getItem('theme');
    });

    // Apply theme to document
    useEffect(() => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, [isDark]);

    // Listen for system preference changes
    useEffect(() => {
        if (!isSystem) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            setIsDark(e.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, [isSystem]);

    // Toggle between light and dark
    const toggle = useCallback(() => {
        setIsDark(prev => {
            const newValue = !prev;
            localStorage.setItem('theme', newValue ? 'dark' : 'light');
            setIsSystem(false);
            return newValue;
        });
    }, []);

    // Set specific mode
    const setMode = useCallback((mode) => {
        if (mode === 'system') {
            localStorage.removeItem('theme');
            setIsSystem(true);
            // Apply system preference
            if (window.matchMedia) {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
        } else {
            const dark = mode === 'dark';
            localStorage.setItem('theme', mode);
            setIsSystem(false);
            setIsDark(dark);
        }
    }, []);

    // Enable dark mode
    const enableDark = useCallback(() => {
        setMode('dark');
    }, [setMode]);

    // Enable light mode
    const enableLight = useCallback(() => {
        setMode('light');
    }, [setMode]);

    // Use system preference
    const useSystem = useCallback(() => {
        setMode('system');
    }, [setMode]);

    return {
        isDark,
        isLight: !isDark,
        isSystem,
        toggle,
        setMode,
        enableDark,
        enableLight,
        useSystem,
        // Current mode as string
        mode: isSystem ? 'system' : (isDark ? 'dark' : 'light')
    };
};

export default useDarkMode;
