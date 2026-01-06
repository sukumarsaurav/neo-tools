import PropTypes from 'prop-types';
import './Skeleton.css';

/**
 * Skeleton loading component for placeholder UI elements
 * Supports various shapes and sizes for different use cases
 */
const Skeleton = ({
    variant = 'rectangular',
    width,
    height,
    className = '',
    animation = 'pulse',
    count = 1,
    gap = '0.5rem'
}) => {
    const skeletonClasses = [
        'skeleton',
        `skeleton-${variant}`,
        `skeleton-${animation}`,
        className
    ].filter(Boolean).join(' ');

    const style = {
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '1em' : undefined)
    };

    if (count > 1) {
        return (
            <div className="skeleton-group" style={{ gap }}>
                {Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className={skeletonClasses}
                        style={style}
                        aria-hidden="true"
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={skeletonClasses}
            style={style}
            aria-hidden="true"
        />
    );
};

Skeleton.propTypes = {
    /** Shape variant: text, circular, rectangular */
    variant: PropTypes.oneOf(['text', 'circular', 'rectangular']),
    /** Custom width (CSS value) */
    width: PropTypes.string,
    /** Custom height (CSS value) */
    height: PropTypes.string,
    /** Additional CSS class */
    className: PropTypes.string,
    /** Animation type: pulse, wave, none */
    animation: PropTypes.oneOf(['pulse', 'wave', 'none']),
    /** Number of skeleton items to render */
    count: PropTypes.number,
    /** Gap between items when count > 1 */
    gap: PropTypes.string
};

/**
 * Pre-configured skeleton for tool cards
 */
export const ToolCardSkeleton = () => (
    <div className="skeleton-tool-card" aria-label="Loading tool...">
        <Skeleton variant="rectangular" height="48px" width="48px" className="skeleton-icon" />
        <Skeleton variant="text" width="70%" height="1.2em" />
        <Skeleton variant="text" count={2} height="0.9em" />
    </div>
);

/**
 * Pre-configured skeleton for image previews
 */
export const ImagePreviewSkeleton = ({ width = '100%', height = '200px' }) => (
    <div className="skeleton-image-preview" aria-label="Loading image...">
        <Skeleton variant="rectangular" width={width} height={height} />
        <div className="skeleton-image-info">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
        </div>
    </div>
);

ImagePreviewSkeleton.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string
};

/**
 * Pre-configured skeleton for property panels
 */
export const PropertyPanelSkeleton = ({ rows = 4 }) => (
    <div className="skeleton-property-panel" aria-label="Loading properties...">
        {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="skeleton-property-row">
                <Skeleton variant="text" width="30%" height="0.9em" />
                <Skeleton variant="rectangular" width="60%" height="36px" />
            </div>
        ))}
    </div>
);

PropertyPanelSkeleton.propTypes = {
    rows: PropTypes.number
};

export default Skeleton;
