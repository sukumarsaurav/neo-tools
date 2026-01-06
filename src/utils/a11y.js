/**
 * Accessibility (a11y) utility functions
 * Helper functions for keyboard navigation, screen reader announcements, and focus management
 */

/**
 * Creates a live region for screen reader announcements
 * @returns {HTMLElement} The live region element
 */
const createLiveRegion = () => {
    let region = document.getElementById('a11y-live-region');

    if (!region) {
        region = document.createElement('div');
        region.id = 'a11y-live-region';
        region.setAttribute('role', 'status');
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        region.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(region);
    }

    return region;
};

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
    const region = createLiveRegion();
    region.setAttribute('aria-live', priority);

    // Clear and set with a slight delay to ensure announcement
    region.textContent = '';
    setTimeout(() => {
        region.textContent = message;
    }, 100);
};

/**
 * Trap focus within a container element (useful for modals)
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {function} Cleanup function to remove the trap
 */
export const trapFocus = (container) => {
    if (!container) return () => { };

    const focusableSelector = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusableElements = container.querySelectorAll(focusableSelector);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus the first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
        container.removeEventListener('keydown', handleKeyDown);
    };
};

/**
 * Handle escape key to close modals/dropdowns
 * @param {function} onEscape - Callback to run when Escape is pressed
 * @returns {function} Cleanup function to remove the listener
 */
export const handleEscape = (onEscape) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onEscape();
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
};

/**
 * Handle arrow key navigation in a list
 * @param {HTMLElement} container - Container with navigable items
 * @param {string} itemSelector - CSS selector for navigable items
 * @param {object} options - Navigation options
 * @returns {function} Cleanup function
 */
export const arrowKeyNavigation = (container, itemSelector, options = {}) => {
    const {
        horizontal = false,
        wrap = true,
        onSelect = null
    } = options;

    const handleKeyDown = (e) => {
        const items = Array.from(container.querySelectorAll(itemSelector));
        const currentIndex = items.indexOf(document.activeElement);

        if (currentIndex === -1) return;

        let nextIndex = currentIndex;
        const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
        const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';

        if (e.key === prevKey) {
            e.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
                nextIndex = wrap ? items.length - 1 : 0;
            }
        } else if (e.key === nextKey) {
            e.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= items.length) {
                nextIndex = wrap ? 0 : items.length - 1;
            }
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onSelect) {
                onSelect(items[currentIndex], currentIndex);
            } else {
                items[currentIndex]?.click();
            }
            return;
        } else if (e.key === 'Home') {
            e.preventDefault();
            nextIndex = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            nextIndex = items.length - 1;
        }

        items[nextIndex]?.focus();
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
        container.removeEventListener('keydown', handleKeyDown);
    };
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get a safe animation duration based on user preference
 * @param {number} normalDuration - Normal animation duration in ms
 * @param {number} reducedDuration - Reduced duration for users who prefer reduced motion
 * @returns {number} The appropriate duration
 */
export const getAnimationDuration = (normalDuration, reducedDuration = 0) => {
    return prefersReducedMotion() ? reducedDuration : normalDuration;
};

/**
 * Generate a unique ID for accessibility purposes
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const generateA11yId = (prefix = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Skip link helper - creates a skip link for keyboard users
 * @param {string} targetId - ID of the main content element to skip to
 * @param {string} text - Skip link text
 * @returns {HTMLElement} The skip link element
 */
export const createSkipLink = (targetId, text = 'Skip to main content') => {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'skip-link';
    skipLink.textContent = text;
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--yinmn-blue);
        color: white;
        padding: 8px 16px;
        z-index: 10000;
        text-decoration: none;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    return skipLink;
};

export default {
    announceToScreenReader,
    trapFocus,
    handleEscape,
    arrowKeyNavigation,
    prefersReducedMotion,
    getAnimationDuration,
    generateA11yId,
    createSkipLink
};
