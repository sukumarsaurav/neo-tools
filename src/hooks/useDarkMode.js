import { useState, useEffect, useCallback } from 'react';

/**
 * Determines if it's nighttime based on current hour
 * Uses 6 AM - 6 PM as daytime (light mode)
 * Uses 6 PM - 6 AM as nighttime (dark mode)
 * @returns {boolean} True if current time is nighttime
 */
const isNightTime = () => {
    const hour = new Date().getHours();
    // Night time is 6 PM (18) to 6 AM (6)
    return hour >= 18 || hour < 6;
};

/**
 * Check if system preference is available and has a definitive value
 * Some browsers/systems don't support prefers-color-scheme
 * @returns {boolean} True if system preference is available
 */
const hasSystemPreference = () => {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return false;
    }
    // Check if the media query is supported and has a preference
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');
    // If neither matches, system preference is not available
    return darkQuery.matches || lightQuery.matches;
};

/**
 * Hook to manage dark mode with system preference detection and persistence
 * Priority: 1. localStorage (user preference)
 *           2. System preference (prefers-color-scheme)
 *           3. Time-based fallback (night = dark, day = light)
 * @returns {object} Dark mode state and controls
 */
export const useDarkMode = () => {
    // Initialize from localStorage, system preference, or time-based fallback
    const [isDark, setIsDark] = useState(() => {
        // Priority 1: Check localStorage first (user's explicit preference)
        const stored = localStorage.getItem('theme');
        if (stored) {
            return stored === 'dark';
        }

        // Priority 2: Fall back to system preference
        if (hasSystemPreference()) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // Priority 3: Time-based fallback when system preference unavailable
        return isNightTime();
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
            // Apply system preference or time-based fallback
            if (hasSystemPreference()) {
                setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
            } else {
                // Use time-based fallback when system preference unavailable
                setIsDark(isNightTime());
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

    // Check if currently using time-based fallback (system mode but no system preference)
    const isUsingTimeFallback = isSystem && !hasSystemPreference();

    return {
        isDark,
        isLight: !isDark,
        isSystem,
        isUsingTimeFallback, // True when using time-based detection instead of OS preference
        toggle,
        setMode,
        enableDark,
        enableLight,
        useSystem,
        // Current mode as string
        mode: isSystem ? 'system' : (isDark ? 'dark' : 'light'),
        // Detection method currently in use
        detectionMethod: !isSystem ? 'manual' : (hasSystemPreference() ? 'system' : 'time')
    };
};

// Export helper functions for external use
export { isNightTime, hasSystemPreference };
export default useDarkMode;
