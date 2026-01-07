import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting form drafts to localStorage
 * 
 * @param {string} key - Unique key for this tool's drafts
 * @param {object} initialState - Default state values
 * @param {number} debounceMs - Debounce delay for saving (default: 500ms)
 * @returns {[object, function, function, boolean]} - [state, setState, clearDraft, hasDraft]
 * 
 * Usage:
 * const [formData, setFormData, clearDraft, hasDraft] = useDraft('meta-tag-generator', {
 *   title: '',
 *   description: ''
 * });
 */
const useDraft = (key, initialState, debounceMs = 500) => {
    const storageKey = `neoft_draft_${key}`;

    // Initialize state from localStorage or use initialState
    const [state, setState] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with initial state to handle new fields
                return { ...initialState, ...parsed.data };
            }
        } catch (e) {
            console.warn('Failed to load draft:', e);
        }
        return initialState;
    });

    const [hasDraft, setHasDraft] = useState(() => {
        try {
            return localStorage.getItem(storageKey) !== null;
        } catch {
            return false;
        }
    });

    // Debounced save to localStorage
    useEffect(() => {
        // Check if state has meaningful content (not just empty strings)
        const hasContent = Object.values(state).some(val => {
            if (typeof val === 'string') return val.trim().length > 0;
            if (Array.isArray(val)) return val.length > 0;
            if (typeof val === 'object' && val !== null) return Object.keys(val).length > 0;
            return val !== null && val !== undefined && val !== false && val !== 0;
        });

        const timer = setTimeout(() => {
            try {
                if (hasContent) {
                    localStorage.setItem(storageKey, JSON.stringify({
                        data: state,
                        savedAt: new Date().toISOString()
                    }));
                    setHasDraft(true);
                }
            } catch (e) {
                console.warn('Failed to save draft:', e);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [state, storageKey, debounceMs]);

    // Clear draft from localStorage
    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            setHasDraft(false);
            setState(initialState);
        } catch (e) {
            console.warn('Failed to clear draft:', e);
        }
    }, [storageKey, initialState]);

    return [state, setState, clearDraft, hasDraft];
};

/**
 * Get all saved drafts for SEO tools
 * @returns {Array} Array of draft objects with key, data, and savedAt
 */
export const getAllDrafts = () => {
    const drafts = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('neoft_draft_')) {
                const toolKey = key.replace('neoft_draft_', '');
                const data = JSON.parse(localStorage.getItem(key));
                drafts.push({
                    key: toolKey,
                    ...data
                });
            }
        }
    } catch (e) {
        console.warn('Failed to get drafts:', e);
    }
    return drafts.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
};

/**
 * Clear all saved drafts
 */
export const clearAllDrafts = () => {
    try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('neoft_draft_')) {
                keys.push(key);
            }
        }
        keys.forEach(key => localStorage.removeItem(key));
    } catch (e) {
        console.warn('Failed to clear all drafts:', e);
    }
};

export default useDraft;
