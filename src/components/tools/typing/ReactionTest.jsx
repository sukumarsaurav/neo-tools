import { useState, useEffect, useRef, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

// Speed rating thresholds
const SPEED_RATINGS = [
    { max: 150, emoji: '🥷', label: 'Ninja', color: '#8B5CF6', desc: 'Incredible reflexes!' },
    { max: 200, emoji: '⚡', label: 'Lightning', color: '#10B981', desc: 'Faster than most!' },
    { max: 250, emoji: '🏃', label: 'Fast', color: '#3B82F6', desc: 'Above average!' },
    { max: 300, emoji: '👍', label: 'Average', color: '#F59E0B', desc: 'Normal human speed' },
    { max: 400, emoji: '🐢', label: 'Slow', color: '#EF4444', desc: 'Need more practice' },
    { max: Infinity, emoji: '😴', label: 'Sleepy', color: '#6B7280', desc: 'Wake up!' }
];

const getSpeedRating = (ms) => {
    return SPEED_RATINGS.find(r => ms <= r.max) || SPEED_RATINGS[SPEED_RATINGS.length - 1];
};

const ReactionTest = () => {
    const [state, setState] = useState('waiting'); // waiting, ready, click, result, too-early
    const [startTime, setStartTime] = useState(null);
    const [results, setResults] = useState([]);
    const [trials, setTrials] = useState(5);
    const [minDelay, setMinDelay] = useState(2);
    const [maxDelay, setMaxDelay] = useState(5);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const timeoutRef = useRef(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'reaction-test').slice(0, 3);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Load stats from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('reactionTestStats');
        if (saved) {
            const data = JSON.parse(saved);
            setBestStreak(data.bestStreak || 0);
        }
    }, []);

    const startTest = useCallback(() => {
        setState('ready');
        const delayRange = maxDelay - minDelay;
        const delay = Math.random() * (delayRange * 1000) + (minDelay * 1000);
        timeoutRef.current = setTimeout(() => {
            setState('click');
            setStartTime(Date.now());
        }, delay);
    }, [minDelay, maxDelay]);

    const handleClick = () => {
        if (state === 'ready') {
            clearTimeout(timeoutRef.current);
            setState('too-early');
            setStreak(0);
        }
        else if (state === 'click') {
            const reactionTime = Date.now() - startTime;
            const newResults = [...results, reactionTime];
            setResults(newResults);

            // Update streak
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak > bestStreak) {
                setBestStreak(newStreak);
                localStorage.setItem('reactionTestStats', JSON.stringify({ bestStreak: newStreak }));
            }

            setState('result');
        }
        else if (state === 'waiting' || state === 'result' || state === 'too-early') {
            startTest();
        }
    };

    const reset = () => {
        setState('waiting');
        setResults([]);
        setStreak(0);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const copyResults = () => {
        const text = `🎯 Reaction Time Test Results\n` +
            `📊 Average: ${avgTime}ms\n` +
            `⚡ Best: ${bestTime}ms\n` +
            `🔥 Streak: ${streak}\n` +
            `📝 Attempts: ${results.length}\n` +
            `${getSpeedRating(avgTime).emoji} Rating: ${getSpeedRating(avgTime).label}`;
        navigator.clipboard.writeText(text);
    };

    // Stats calculations  
    const avgTime = results.length > 0 ? Math.round(results.reduce((a, b) => a + b, 0) / results.length) : 0;
    const bestTime = results.length > 0 ? Math.min(...results) : 0;
    const worstTime = results.length > 0 ? Math.max(...results) : 0;

    // Standard deviation
    const stdDev = results.length > 1
        ? Math.round(Math.sqrt(results.reduce((sum, r) => sum + Math.pow(r - avgTime, 2), 0) / results.length))
        : 0;

    // Median
    const median = results.length > 0
        ? Math.round([...results].sort((a, b) => a - b)[Math.floor(results.length / 2)])
        : 0;

    const lastResult = results[results.length - 1];
    const lastRating = lastResult ? getSpeedRating(lastResult) : null;
    const avgRating = avgTime ? getSpeedRating(avgTime) : null;

    const faqs = [
        { question: 'What is a good reaction time?', answer: 'Average human reaction: 200-250ms. Fast: <200ms. Very fast: <150ms. Professional gamers: ~120-150ms.' },
        { question: 'How to improve reaction time?', answer: 'Get enough sleep, stay focused, practice regularly, reduce distractions, and stay healthy.' },
        { question: 'Why do I sometimes click too early?', answer: 'Anticipation is common. Try to wait for the green signal. Random delays help prevent pattern prediction.' }
    ];

    const seoContent = (<><h2>Reaction Time Test</h2><p>Measure how fast you can react to visual stimuli. Track your reaction time, build streaks, and compare your speed rating.</p></>);

    return (
        <ToolLayout title="Reaction Time Tester" description="Test your reaction time and reflexes. See how fast you can respond to visual stimuli." keywords={['reaction time test', 'reflex test', 'reaction speed', 'response time']} category="typing" categoryName="Typing & Education" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="reaction-container">
                {/* Settings */}
                <div className="settings-bar">
                    <div className="setting">
                        <label>Delay Range:</label>
                        <select value={minDelay} onChange={(e) => setMinDelay(Number(e.target.value))}>
                            <option value={1}>1s</option>
                            <option value={2}>2s</option>
                            <option value={3}>3s</option>
                        </select>
                        <span>to</span>
                        <select value={maxDelay} onChange={(e) => setMaxDelay(Number(e.target.value))}>
                            <option value={4}>4s</option>
                            <option value={5}>5s</option>
                            <option value={7}>7s</option>
                        </select>
                    </div>
                    {bestStreak > 0 && (
                        <div className="streak-badge">
                            🔥 Best Streak: {bestStreak}
                        </div>
                    )}
                </div>

                {/* Main Click Area */}
                <div className={`reaction-box ${state}`} onClick={handleClick}>
                    {state === 'waiting' && (
                        <>
                            <div className="reaction-icon">🎯</div>
                            <h2>Click to Start</h2>
                            <p>Wait for green, then click as fast as you can!</p>
                        </>
                    )}
                    {state === 'ready' && (
                        <>
                            <div className="reaction-icon pulse">⏳</div>
                            <h2>Wait for green...</h2>
                            <p>Don't click yet!</p>
                        </>
                    )}
                    {state === 'click' && (
                        <>
                            <div className="reaction-icon bounce">🟢</div>
                            <h2>CLICK NOW!</h2>
                        </>
                    )}
                    {state === 'too-early' && (
                        <>
                            <div className="reaction-icon shake">❌</div>
                            <h2>Too Early!</h2>
                            <p>Click to try again</p>
                        </>
                    )}
                    {state === 'result' && lastRating && (
                        <>
                            <div className="reaction-icon">{lastRating.emoji}</div>
                            <h2 style={{ color: lastRating.color }}>{lastResult}ms</h2>
                            <p className="rating-label" style={{ color: lastRating.color }}>
                                {lastRating.label} - {lastRating.desc}
                            </p>
                            <p className="continue-hint">Click to continue</p>
                        </>
                    )}

                    {/* Streak indicator */}
                    {streak > 0 && (
                        <div className="streak-indicator">
                            🔥 Streak: {streak}
                        </div>
                    )}
                </div>

                {/* Stats Panel */}
                {results.length > 0 && (
                    <div className="stats-panel">
                        <div className="stats-header">
                            <h3>📊 Statistics ({results.length} attempts)</h3>
                            <div className="stats-actions">
                                <button className="btn-icon" onClick={copyResults} title="Copy Results">
                                    📋
                                </button>
                                <button className="btn-icon" onClick={reset} title="Reset">
                                    🔄
                                </button>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card primary">
                                <span className="stat-label">Average</span>
                                <span className="stat-value">{avgTime}ms</span>
                                {avgRating && (
                                    <span className="stat-rating" style={{ color: avgRating.color }}>
                                        {avgRating.emoji} {avgRating.label}
                                    </span>
                                )}
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Best</span>
                                <span className="stat-value best">{bestTime}ms</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Worst</span>
                                <span className="stat-value">{worstTime}ms</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Median</span>
                                <span className="stat-value">{median}ms</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Std Dev</span>
                                <span className="stat-value">±{stdDev}ms</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">Current Streak</span>
                                <span className="stat-value">🔥 {streak}</span>
                            </div>
                        </div>

                        {/* Results Timeline */}
                        <div className="results-timeline">
                            <h4>Recent Results</h4>
                            <div className="timeline-bars">
                                {results.slice(-10).map((r, i) => {
                                    const rating = getSpeedRating(r);
                                    const height = Math.min(100, Math.max(20, (400 - r) / 3));
                                    return (
                                        <div
                                            key={i}
                                            className="timeline-bar"
                                            style={{
                                                height: `${height}%`,
                                                background: rating.color
                                            }}
                                            title={`${r}ms - ${rating.label}`}
                                        >
                                            <span className="bar-value">{r}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Speed Rating Legend */}
                        <div className="rating-legend">
                            <h4>Speed Ratings</h4>
                            <div className="legend-items">
                                {SPEED_RATINGS.slice(0, 5).map((rating, i) => (
                                    <div key={i} className="legend-item">
                                        <span className="legend-emoji">{rating.emoji}</span>
                                        <span className="legend-label">{rating.label}</span>
                                        <span className="legend-range">
                                            {i === 0 ? `<${rating.max}` : `<${rating.max}`}ms
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .reaction-container {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .settings-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-md);
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }

                .setting {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    font-size: var(--text-sm);
                }

                .setting label {
                    color: var(--text-muted);
                }

                .setting select {
                    padding: var(--spacing-xs);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }

                .streak-badge {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: linear-gradient(135deg, #F59E0B, #D97706);
                    color: white;
                    border-radius: 20px;
                    font-size: var(--text-sm);
                    font-weight: 600;
                }

                .reaction-box {
                    position: relative;
                    padding: var(--spacing-3xl);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    user-select: none;
                    text-align: center;
                    min-height: 250px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .reaction-box.waiting { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; }
                .reaction-box.ready { background: linear-gradient(135deg, #DC2626, #B91C1C); color: white; }
                .reaction-box.click { background: linear-gradient(135deg, #10B981, #059669); color: white; }
                .reaction-box.too-early { background: linear-gradient(135deg, #DC2626, #B91C1C); color: white; }
                .reaction-box.result { background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; }

                .reaction-icon {
                    font-size: 64px;
                    margin-bottom: var(--spacing-md);
                }

                .reaction-box h2 {
                    font-size: var(--text-3xl);
                    margin: 0 0 var(--spacing-sm);
                }

                .reaction-box p {
                    margin: 0;
                    opacity: 0.9;
                }

                .rating-label {
                    font-size: var(--text-lg);
                    font-weight: 600;
                }

                .continue-hint {
                    margin-top: var(--spacing-md);
                    font-size: var(--text-sm);
                    opacity: 0.7;
                }

                .streak-indicator {
                    position: absolute;
                    top: var(--spacing-md);
                    right: var(--spacing-md);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: rgba(0,0,0,0.3);
                    border-radius: 20px;
                    font-size: var(--text-sm);
                    font-weight: 600;
                }

                /* Animations */
                .pulse {
                    animation: pulse 1s ease-in-out infinite;
                }

                .bounce {
                    animation: bounce 0.5s ease-in-out;
                }

                .shake {
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }

                @keyframes bounce {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }

                /* Stats Panel */
                .stats-panel {
                    margin-top: var(--spacing-lg);
                    padding: var(--spacing-lg);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                }

                .stats-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }

                .stats-header h3 {
                    margin: 0;
                    font-size: var(--text-md);
                }

                .stats-actions {
                    display: flex;
                    gap: var(--spacing-xs);
                }

                .btn-icon {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: var(--text-md);
                    transition: all 0.2s;
                }

                .btn-icon:hover {
                    background: var(--accent-primary);
                    color: white;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }

                .stat-card {
                    padding: var(--spacing-md);
                    background: var(--bg-primary);
                    border-radius: var(--radius);
                    text-align: center;
                }

                .stat-card.primary {
                    grid-column: span 3;
                    background: var(--gradient-primary);
                    color: white;
                }

                .stat-label {
                    display: block;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-bottom: 4px;
                }

                .stat-card.primary .stat-label {
                    color: rgba(255,255,255,0.8);
                }

                .stat-value {
                    font-size: var(--text-xl);
                    font-weight: 700;
                }

                .stat-value.best {
                    color: var(--success);
                }

                .stat-rating {
                    display: block;
                    font-size: var(--text-sm);
                    margin-top: 4px;
                }

                .results-timeline {
                    margin-bottom: var(--spacing-lg);
                }

                .results-timeline h4 {
                    margin: 0 0 var(--spacing-sm);
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                .timeline-bars {
                    display: flex;
                    align-items: flex-end;
                    gap: 4px;
                    height: 80px;
                    padding: var(--spacing-sm);
                    background: var(--bg-primary);
                    border-radius: var(--radius);
                }

                .timeline-bar {
                    flex: 1;
                    min-width: 20px;
                    border-radius: 4px 4px 0 0;
                    position: relative;
                    transition: height 0.3s ease;
                }

                .bar-value {
                    position: absolute;
                    top: -18px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 9px;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .rating-legend h4 {
                    margin: 0 0 var(--spacing-sm);
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                .legend-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    background: var(--bg-primary);
                    border-radius: var(--radius-sm);
                    font-size: var(--text-xs);
                }

                .legend-emoji { font-size: var(--text-md); }
                .legend-label { font-weight: 600; }
                .legend-range { color: var(--text-muted); }

                @media (max-width: 480px) {
                    .reaction-box {
                        padding: var(--spacing-xl);
                        min-height: 200px;
                    }

                    .reaction-icon { font-size: 48px; }
                    .reaction-box h2 { font-size: var(--text-2xl); }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .stat-card.primary {
                        grid-column: span 2;
                    }

                    .settings-bar {
                        justify-content: center;
                    }

                    .streak-badge {
                        width: 100%;
                        text-align: center;
                    }
                }
            `}</style>
        </ToolLayout>
    );
};

export default ReactionTest;
