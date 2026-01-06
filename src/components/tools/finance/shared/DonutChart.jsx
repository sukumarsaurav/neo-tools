import { useEffect, useRef, useState } from 'react';
import './DonutChart.css';

/**
 * DonutChart - An animated SVG donut chart component
 * @param {Object} props
 * @param {Array} props.segments - Array of { value, label, color } objects
 * @param {string} props.centerLabel - Label to display in center
 * @param {string} props.centerValue - Value to display in center
 * @param {number} props.size - Size of the chart in pixels (default: 200)
 * @param {number} props.strokeWidth - Width of the donut stroke (default: 30)
 * @param {boolean} props.animate - Whether to animate on mount (default: true)
 */
const DonutChart = ({
    segments = [],
    centerLabel = '',
    centerValue = '',
    size = 200,
    strokeWidth = 30,
    animate = true
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const chartRef = useRef(null);

    // Calculate total and percentages
    const total = segments.reduce((sum, seg) => sum + (seg.value || 0), 0);

    useEffect(() => {
        if (!animate) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (chartRef.current) {
            observer.observe(chartRef.current);
        }

        return () => observer.disconnect();
    }, [animate]);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Calculate segment offsets
    let cumulativePercent = 0;
    const segmentData = segments.map((seg, index) => {
        const percent = total > 0 ? (seg.value / total) * 100 : 0;
        const dashLength = (percent / 100) * circumference;
        const dashOffset = circumference - (cumulativePercent / 100) * circumference;

        const data = {
            ...seg,
            percent,
            dashLength,
            dashOffset,
            rotation: (cumulativePercent / 100) * 360 - 90,
            index
        };

        cumulativePercent += percent;
        return data;
    });

    return (
        <div
            ref={chartRef}
            className={`donut-chart-container ${isVisible ? 'visible' : ''}`}
            style={{ width: size, height: size }}
        >
            <svg
                className="donut-chart-svg"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle
                    className="donut-background"
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="var(--platinum)"
                    strokeWidth={strokeWidth}
                />

                {/* Segments */}
                {segmentData.map((seg, index) => (
                    <circle
                        key={index}
                        className="donut-segment"
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
                        strokeDashoffset={seg.dashOffset}
                        strokeLinecap="round"
                        style={{
                            animationDelay: `${index * 0.15}s`,
                            '--target-offset': seg.dashOffset
                        }}
                    />
                ))}
            </svg>

            {/* Center content */}
            <div className="donut-center">
                {centerValue && (
                    <span className="donut-center-value">{centerValue}</span>
                )}
                {centerLabel && (
                    <span className="donut-center-label">{centerLabel}</span>
                )}
            </div>

            {/* Legend */}
            <div className="donut-legend">
                {segmentData.map((seg, index) => (
                    <div key={index} className="donut-legend-item">
                        <span
                            className="donut-legend-color"
                            style={{ backgroundColor: seg.color }}
                        />
                        <span className="donut-legend-label">{seg.label}</span>
                        <span className="donut-legend-value">
                            {seg.percent.toFixed(1)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;
