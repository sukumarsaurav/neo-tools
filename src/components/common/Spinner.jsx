import PropTypes from 'prop-types';
import './Spinner.css';

/**
 * Circular spinner for quick loading operations
 * Supports multiple sizes and optional label
 */
const Spinner = ({
    size = 'medium',
    variant = 'primary',
    label,
    className = '',
    inline = false
}) => {
    const spinnerClasses = [
        'spinner-container',
        `spinner-${size}`,
        `spinner-${variant}`,
        inline && 'spinner-inline',
        className
    ].filter(Boolean).join(' ');

    return (
        <div
            className={spinnerClasses}
            role="status"
            aria-label={label || 'Loading'}
        >
            <div className="spinner-circle" aria-hidden="true">
                <div className="spinner-ring" />
            </div>
            {label && <span className="spinner-label">{label}</span>}
            <span className="sr-only">{label || 'Loading...'}</span>
        </div>
    );
};

Spinner.propTypes = {
    /** Size variant: tiny, small, medium, large */
    size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
    /** Color variant */
    variant: PropTypes.oneOf(['primary', 'accent', 'light', 'dark']),
    /** Optional label text */
    label: PropTypes.string,
    /** Additional CSS class */
    className: PropTypes.string,
    /** Whether to display inline */
    inline: PropTypes.bool
};

/**
 * Spinner overlay for covering content during loading
 */
export const SpinnerOverlay = ({
    visible = true,
    label,
    blur = true
}) => {
    if (!visible) return null;

    return (
        <div className={`spinner-overlay ${blur ? 'spinner-overlay-blur' : ''}`}>
            <Spinner size="large" label={label} variant="primary" />
        </div>
    );
};

SpinnerOverlay.propTypes = {
    visible: PropTypes.bool,
    label: PropTypes.string,
    blur: PropTypes.bool
};

/**
 * Button with built-in loading spinner
 */
export const LoadingButton = ({
    children,
    loading = false,
    disabled = false,
    onClick,
    className = '',
    type = 'button',
    variant = 'primary',
    ...props
}) => {
    const buttonClasses = [
        'btn',
        `btn-${variant}`,
        'loading-button',
        loading && 'loading-button-active',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <Spinner size="tiny" variant="light" inline />}
            <span className={loading ? 'loading-button-text' : ''}>
                {children}
            </span>
        </button>
    );
};

LoadingButton.propTypes = {
    children: PropTypes.node.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
    variant: PropTypes.string
};

export default Spinner;
