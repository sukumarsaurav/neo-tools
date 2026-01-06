import PropTypes from 'prop-types';
import './ProgressBar.css';

/**
 * Animated progress bar component with percentage display
 * Supports determinate and indeterminate modes
 */
const ProgressBar = ({
    value = 0,
    max = 100,
    indeterminate = false,
    showPercentage = true,
    size = 'medium',
    variant = 'primary',
    label,
    className = '',
    animated = true
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const barClasses = [
        'progress-bar-container',
        `progress-bar-${size}`,
        `progress-bar-${variant}`,
        indeterminate && 'progress-bar-indeterminate',
        animated && 'progress-bar-animated',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={barClasses} role="progressbar" aria-valuenow={indeterminate ? undefined : value} aria-valuemin={0} aria-valuemax={max} aria-label={label || `Progress: ${percentage.toFixed(0)}%`}>
            {label && <div className="progress-bar-label">{label}</div>}
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: indeterminate ? '50%' : `${percentage}%`,
                        transition: animated ? undefined : 'none'
                    }}
                />
            </div>
            {showPercentage && !indeterminate && (
                <div className="progress-bar-percentage">
                    {percentage.toFixed(0)}%
                </div>
            )}
        </div>
    );
};

ProgressBar.propTypes = {
    /** Current progress value */
    value: PropTypes.number,
    /** Maximum value */
    max: PropTypes.number,
    /** Whether to show indeterminate animation */
    indeterminate: PropTypes.bool,
    /** Whether to show percentage text */
    showPercentage: PropTypes.bool,
    /** Size variant: small, medium, large */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /** Color variant: primary, success, warning, error */
    variant: PropTypes.oneOf(['primary', 'success', 'warning', 'error', 'accent']),
    /** Accessible label for the progress bar */
    label: PropTypes.string,
    /** Additional CSS class */
    className: PropTypes.string,
    /** Whether to animate progress changes */
    animated: PropTypes.bool
};

/**
 * Step progress indicator for multi-step processes
 */
export const StepProgress = ({
    currentStep,
    totalSteps,
    steps = [],
    variant = 'primary'
}) => {
    return (
        <div className="step-progress" role="group" aria-label={`Step ${currentStep} of ${totalSteps}`}>
            <div className="step-progress-bar">
                <ProgressBar
                    value={currentStep}
                    max={totalSteps}
                    showPercentage={false}
                    variant={variant}
                />
            </div>
            <div className="step-progress-info">
                <span className="step-progress-count">
                    Step {currentStep} of {totalSteps}
                </span>
                {steps[currentStep - 1] && (
                    <span className="step-progress-name">
                        {steps[currentStep - 1]}
                    </span>
                )}
            </div>
        </div>
    );
};

StepProgress.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(PropTypes.string),
    variant: PropTypes.string
};

export default ProgressBar;
