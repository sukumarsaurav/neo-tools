import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

// Toast Context
const ToastContext = createContext(null);

/**
 * Toast types with their icons and colors
 */
const TOAST_TYPES = {
    success: { icon: '✓', className: 'toast-success' },
    error: { icon: '✗', className: 'toast-error' },
    warning: { icon: '⚠', className: 'toast-warning' },
    info: { icon: 'ℹ', className: 'toast-info' }
};

/**
 * Individual Toast component
 */
const Toast = ({ id, type, message, onClose }) => {
    const { icon, className } = TOAST_TYPES[type] || TOAST_TYPES.info;

    return (
        <div
            className={`toast ${className}`}
            role="alert"
            aria-live="polite"
        >
            <span className="toast-icon" aria-hidden="true">{icon}</span>
            <span className="toast-message">{message}</span>
            <button
                className="toast-close"
                onClick={() => onClose(id)}
                aria-label="Close notification"
            >
                ×
            </button>
        </div>
    );
};

Toast.propTypes = {
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

/**
 * Toast Container - renders all active toasts
 */
const ToastContainer = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-label="Notifications">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

ToastContainer.propTypes = {
    toasts: PropTypes.array.isRequired,
    removeToast: PropTypes.func.isRequired
};

/**
 * Toast Provider - wraps app and provides toast functionality
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    let toastId = 0;

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = ++toastId;

        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    const toast = {
        show: (message, type, duration) => addToast(message, type, duration),
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
        dismiss: removeToast,
        dismissAll: () => setToasts([])
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired
};

/**
 * Hook to use toast notifications
 * @returns {object} Toast methods: success, error, warning, info, show, dismiss, dismissAll
 */
export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        // Return a fallback that uses alert() if not wrapped in ToastProvider
        return {
            show: (message) => alert(message),
            success: (message) => alert(`✓ ${message}`),
            error: (message) => alert(`✗ ${message}`),
            warning: (message) => alert(`⚠ ${message}`),
            info: (message) => alert(`ℹ ${message}`),
            dismiss: () => { },
            dismissAll: () => { }
        };
    }

    return context;
};

export default ToastProvider;
