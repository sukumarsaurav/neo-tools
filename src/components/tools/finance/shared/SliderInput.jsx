import { useState, useEffect, useRef } from 'react';
import './SliderInput.css';

/**
 * SliderInput - A dual slider + text input component with real-time updates
 * @param {Object} props
 * @param {string} props.label - Label for the input
 * @param {number} props.value - Current value
 * @param {function} props.onChange - Callback function when value changes
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {number} props.step - Step increment
 * @param {string} props.prefix - Prefix to display (e.g., "₹")
 * @param {string} props.suffix - Suffix to display (e.g., "%")
 * @param {Array} props.tickMarks - Array of tick mark values to display
 * @param {function} props.formatValue - Custom formatter for display
 * @param {string} props.id - Unique ID for the input
 */
const SliderInput = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    prefix = '',
    suffix = '',
    tickMarks = [],
    formatValue,
    id
}) => {
    const [inputValue, setInputValue] = useState(value?.toString() || '');
    const [isFocused, setIsFocused] = useState(false);
    const sliderRef = useRef(null);

    // Sync internal state with prop value
    useEffect(() => {
        if (!isFocused) {
            setInputValue(value?.toString() || '');
        }
    }, [value, isFocused]);

    const handleSliderChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setInputValue(newValue.toString());
        onChange(newValue);
    };

    const handleInputChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9.]/g, '');
        setInputValue(rawValue);

        const numValue = parseFloat(rawValue);
        if (!isNaN(numValue)) {
            // Clamp value to min/max bounds
            const clampedValue = Math.min(Math.max(numValue, min), max);
            onChange(clampedValue);
        }
    };

    const handleInputBlur = () => {
        setIsFocused(false);
        // Normalize the input value on blur
        const numValue = parseFloat(inputValue);
        if (isNaN(numValue)) {
            setInputValue(min.toString());
            onChange(min);
        } else {
            const clampedValue = Math.min(Math.max(numValue, min), max);
            setInputValue(clampedValue.toString());
            onChange(clampedValue);
        }
    };

    const handleInputFocus = () => {
        setIsFocused(true);
    };

    // Calculate slider fill percentage for gradient
    const fillPercentage = ((value - min) / (max - min)) * 100;

    // Format display value
    const displayValue = formatValue
        ? formatValue(value)
        : Number(value).toLocaleString('en-IN');

    return (
        <div className="slider-input-container">
            <label className="slider-input-label" htmlFor={id}>
                {label}
            </label>

            <div className="slider-input-wrapper">
                <div className="slider-text-input-container">
                    {prefix && <span className="slider-input-prefix">{prefix}</span>}
                    <input
                        type="text"
                        id={id}
                        className="slider-text-input"
                        value={isFocused ? inputValue : displayValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        inputMode="decimal"
                    />
                    {suffix && <span className="slider-input-suffix">{suffix}</span>}
                </div>

                <div className="slider-track-container">
                    <input
                        ref={sliderRef}
                        type="range"
                        className="slider-range"
                        min={min}
                        max={max}
                        step={step}
                        value={value || min}
                        onChange={handleSliderChange}
                        style={{
                            background: `linear-gradient(to right, var(--yinmn-blue) 0%, var(--yinmn-blue) ${fillPercentage}%, var(--platinum) ${fillPercentage}%, var(--platinum) 100%)`
                        }}
                        aria-label={label}
                    />

                    {tickMarks.length > 0 && (
                        <div className="slider-tick-marks">
                            {tickMarks.map((tick, index) => {
                                const position = ((tick - min) / (max - min)) * 100;
                                return (
                                    <span
                                        key={index}
                                        className="slider-tick"
                                        style={{ left: `${position}%` }}
                                    >
                                        {formatValue ? formatValue(tick) : tick.toLocaleString('en-IN')}
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SliderInput;
