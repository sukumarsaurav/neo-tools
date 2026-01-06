import { useState, useEffect, useRef, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

// Practice mode configurations
const PRACTICE_MODES = {
    random: {
        name: 'Random Numbers',
        desc: '4-digit numbers',
        icon: '🔢',
        generate: (count) => Array.from({ length: count }, () =>
            Math.floor(Math.random() * 9000 + 1000).toString()
        ).join(' ')
    },
    currency: {
        name: 'Currency',
        desc: '$XX.XX format',
        icon: '💵',
        generate: (count) => Array.from({ length: count }, () =>
            '$' + (Math.random() * 999 + 1).toFixed(2)
        ).join(' ')
    },
    phone: {
        name: 'Phone Numbers',
        desc: 'XXX-XXX-XXXX',
        icon: '📱',
        generate: (count) => Array.from({ length: count }, () => {
            const a = Math.floor(Math.random() * 900 + 100);
            const b = Math.floor(Math.random() * 900 + 100);
            const c = Math.floor(Math.random() * 9000 + 1000);
            return `${a}-${b}-${c}`;
        }).join(' ')
    },
    ip: {
        name: 'IP Addresses',
        desc: 'XXX.XXX.XXX.XXX',
        icon: '🌐',
        generate: (count) => Array.from({ length: count }, () =>
            Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
        ).join(' ')
    },
    date: {
        name: 'Dates',
        desc: 'MM/DD/YYYY',
        icon: '📅',
        generate: (count) => Array.from({ length: count }, () => {
            const m = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
            const d = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
            const y = Math.floor(Math.random() * 30 + 1995);
            return `${m}/${d}/${y}`;
        }).join(' ')
    },
    decimal: {
        name: 'Decimals',
        desc: 'XX.XXX format',
        icon: '🔬',
        generate: (count) => Array.from({ length: count }, () =>
            (Math.random() * 100).toFixed(3)
        ).join(' ')
    }
};

const NUMPAD_LAYOUT = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', '-']
];

const NumpadTest = () => {
    const [mode, setMode] = useState('random');
    const [count, setCount] = useState(10);
    const [numbers, setNumbers] = useState('');
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [showNumpad, setShowNumpad] = useState(true);
    const inputRef = useRef(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'numpad-test').slice(0, 3);

    // Generate numbers based on mode
    const generateNumbers = useCallback(() => {
        return PRACTICE_MODES[mode].generate(count);
    }, [mode, count]);

    // Initialize numbers
    useEffect(() => {
        setNumbers(generateNumbers());
    }, [generateNumbers]);

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('numpadHistory');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    // Timer
    useEffect(() => {
        let interval;
        if (started && !result) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [started, result, startTime]);

    // Get current expected character
    const currentChar = numbers[input.length] || '';

    // Calculate live accuracy
    const correctChars = numbers.split('').slice(0, input.length).filter((c, i) => c === input[i]).length;
    const liveAccuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;

    const handleInput = (e) => {
        const value = e.target.value;

        if (!started && value.length > 0) {
            setStarted(true);
            setStartTime(Date.now());
        }

        setInput(value);

        // Auto-complete when done
        if (value.length >= numbers.length) {
            finishTest(value);
        }
    };

    const finishTest = (typedText = input) => {
        const time = (Date.now() - startTime) / 1000;
        const typedItems = typedText.trim().split(/\s+/);
        const originalItems = numbers.split(' ');

        let correct = 0;
        typedItems.forEach((n, i) => {
            if (n === originalItems[i]) correct++;
        });

        const accuracy = Math.round((correct / originalItems.length) * 100);
        const kpm = Math.round((typedText.replace(/\s/g, '').length / time) * 60);

        const resultData = {
            accuracy,
            kpm,
            time: time.toFixed(1),
            correct,
            total: originalItems.length,
            mode,
            date: new Date().toISOString()
        };

        setResult(resultData);

        // Save to history
        const newHistory = [resultData, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('numpadHistory', JSON.stringify(newHistory));
    };

    const restart = () => {
        setNumbers(generateNumbers());
        setInput('');
        setStarted(false);
        setStartTime(null);
        setElapsedTime(0);
        setResult(null);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setNumbers(PRACTICE_MODES[newMode].generate(count));
        setInput('');
        setStarted(false);
        setStartTime(null);
        setElapsedTime(0);
        setResult(null);
    };

    const changeCount = (newCount) => {
        setCount(newCount);
        setNumbers(PRACTICE_MODES[mode].generate(newCount));
        setInput('');
        setStarted(false);
        setStartTime(null);
        setElapsedTime(0);
        setResult(null);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('numpadHistory');
    };

    // Get best KPM for current mode
    const bestKpm = history
        .filter(h => h.mode === mode)
        .reduce((best, h) => Math.max(best, h.kpm), 0);

    const avgKpm = history.length > 0
        ? Math.round(history.reduce((sum, h) => sum + h.kpm, 0) / history.length)
        : 0;

    const faqs = [
        { question: 'Why practice numpad typing?', answer: 'Numpad proficiency is essential for data entry, accounting, and any job requiring fast number input. It can double your numeric typing speed.' },
        { question: 'What is KPM in typing?', answer: 'KPM means Keystrokes Per Minute - the number of keys pressed in a minute, useful for measuring numeric typing speed.' },
        { question: 'Which mode should I practice?', answer: 'Start with Random Numbers to build basic numpad muscle memory. Then try Currency and Phone for real-world patterns.' }
    ];

    const seoContent = (<><h2>10-Key Numpad Practice</h2><p>Practice your numeric keypad typing skills with multiple modes including random numbers, currency, phone numbers, and more.</p></>);

    return (
        <ToolLayout title="10-Key Numpad Practice" description="Practice numeric keypad typing. Improve your data entry speed and accuracy." keywords={['numpad practice', '10 key test', 'numeric typing', 'data entry practice']} category="typing" categoryName="Typing & Education" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="numpad-test">
                {/* Mode Selector */}
                <div className="mode-selector">
                    {Object.entries(PRACTICE_MODES).map(([key, config]) => (
                        <button
                            key={key}
                            className={`mode-btn ${mode === key ? 'active' : ''}`}
                            onClick={() => changeMode(key)}
                        >
                            <span className="mode-icon">{config.icon}</span>
                            <span className="mode-name">{config.name}</span>
                        </button>
                    ))}
                </div>

                {/* Settings Bar */}
                <div className="settings-bar">
                    <div className="setting">
                        <label>Items:</label>
                        <select value={count} onChange={(e) => changeCount(Number(e.target.value))}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                        </select>
                    </div>
                    <div className="setting">
                        <button
                            className="btn btn-small"
                            onClick={() => setShowNumpad(!showNumpad)}
                        >
                            {showNumpad ? '🙈 Hide' : '🔢 Show'} Numpad
                        </button>
                    </div>
                    {bestKpm > 0 && (
                        <div className="best-badge">
                            🏆 Best: {bestKpm} KPM
                        </div>
                    )}
                </div>

                {!result ? (
                    <>
                        {/* Stats Bar */}
                        <div className="stats-bar">
                            <div className="stat">
                                <span className="stat-icon">⏱️</span>
                                <span className="stat-value">{elapsedTime}s</span>
                            </div>
                            <div className="stat">
                                <span className="stat-icon">🎯</span>
                                <span className="stat-value">{liveAccuracy}%</span>
                            </div>
                            <div className="stat">
                                <span className="stat-icon">📝</span>
                                <span className="stat-value">{input.length}/{numbers.length}</span>
                            </div>
                        </div>

                        {/* Numbers Display */}
                        <div className="numbers-display">
                            {numbers.split('').map((char, i) => (
                                <span
                                    key={i}
                                    className={
                                        i < input.length
                                            ? (input[i] === char ? 'correct' : 'incorrect')
                                            : i === input.length
                                                ? 'current'
                                                : ''
                                    }
                                >
                                    {char}
                                </span>
                            ))}
                        </div>

                        {/* Input */}
                        <textarea
                            ref={inputRef}
                            className="form-input"
                            value={input}
                            onChange={handleInput}
                            placeholder="Use your numpad to type the numbers above..."
                            rows={3}
                            autoFocus
                            spellCheck={false}
                        />

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="btn btn-secondary" onClick={restart}>
                                🔄 New Numbers
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => finishTest()}
                                disabled={!started}
                            >
                                ✅ Finish Test
                            </button>
                        </div>

                        {/* Visual Numpad */}
                        {showNumpad && (
                            <div className="visual-numpad">
                                <h4>Numpad Reference</h4>
                                <div className="numpad-grid">
                                    {NUMPAD_LAYOUT.map((row, rowIndex) => (
                                        <div key={rowIndex} className="numpad-row">
                                            {row.map((key) => (
                                                <div
                                                    key={key}
                                                    className={`numpad-key ${currentChar === key ? 'highlight' : ''}`}
                                                >
                                                    {key}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <p className="numpad-tip">💡 Use your right hand with fingers on 4-5-6</p>
                            </div>
                        )}
                    </>
                ) : (
                    /* Results */
                    <div className="result-box">
                        <h2>🎉 Results</h2>
                        <div className="result-grid">
                            <div className="result-item highlight">
                                <span className="result-label">Speed</span>
                                <span className="result-value">{result.kpm} KPM</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">Accuracy</span>
                                <span className="result-value">{result.accuracy}%</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">Correct</span>
                                <span className="result-value">{result.correct}/{result.total}</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">Time</span>
                                <span className="result-value">{result.time}s</span>
                            </div>
                        </div>
                        {result.kpm >= bestKpm && bestKpm > 0 && (
                            <div className="new-record">🏆 New Personal Best!</div>
                        )}
                        <div className="result-actions">
                            <button className="btn btn-primary" onClick={restart}>Try Again</button>
                        </div>
                    </div>
                )}

                {/* History */}
                {history.length > 0 && (
                    <div className="history-section">
                        <div className="history-header">
                            <h3>📊 Recent Sessions</h3>
                            <button className="btn-clear" onClick={clearHistory}>Clear</button>
                        </div>
                        <div className="history-summary">
                            <div className="summary-stat">
                                <span>Sessions</span>
                                <strong>{history.length}</strong>
                            </div>
                            <div className="summary-stat">
                                <span>Avg KPM</span>
                                <strong>{avgKpm}</strong>
                            </div>
                            <div className="summary-stat">
                                <span>Best KPM</span>
                                <strong>{Math.max(...history.map(h => h.kpm))}</strong>
                            </div>
                        </div>
                        <div className="history-list">
                            {history.slice(0, 5).map((h, i) => (
                                <div key={i} className="history-item">
                                    <span className="history-mode">{PRACTICE_MODES[h.mode]?.icon} {PRACTICE_MODES[h.mode]?.name || h.mode}</span>
                                    <span>{h.kpm} KPM</span>
                                    <span>{h.accuracy}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .numpad-test {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .mode-selector {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }

                .mode-btn {
                    padding: var(--spacing-sm);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }

                .mode-btn:hover {
                    border-color: var(--accent-primary);
                }

                .mode-btn.active {
                    border-color: var(--accent-primary);
                    background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.1), transparent);
                }

                .mode-icon {
                    display: block;
                    font-size: var(--text-xl);
                    margin-bottom: 4px;
                }

                .mode-name {
                    font-size: var(--text-xs);
                    font-weight: 600;
                }

                .settings-bar {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    flex-wrap: wrap;
                }

                .setting {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                }

                .setting label {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                .setting select {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                }

                .btn-small {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    font-size: var(--text-sm);
                }

                .best-badge {
                    margin-left: auto;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: linear-gradient(135deg, #F59E0B, #D97706);
                    color: white;
                    border-radius: 20px;
                    font-size: var(--text-sm);
                    font-weight: 600;
                }

                .stats-bar {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-xl);
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                }

                .stat {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                }

                .stat-icon { font-size: var(--text-lg); }
                .stat-value { font-weight: 600; font-family: var(--font-mono); }

                .numbers-display {
                    background: var(--bg-secondary);
                    padding: var(--spacing-xl);
                    border-radius: var(--radius);
                    font-family: var(--font-mono);
                    font-size: var(--text-xl);
                    line-height: 2;
                    margin-bottom: var(--spacing-lg);
                    word-break: break-all;
                    letter-spacing: 1px;
                }

                .numbers-display .correct { color: var(--success); }
                .numbers-display .incorrect { 
                    color: var(--error); 
                    background: rgba(239, 68, 68, 0.2);
                    text-decoration: underline wavy;
                }
                .numbers-display .current { 
                    background: var(--warning); 
                    padding: 2px 4px; 
                    border-radius: 4px;
                    color: #000;
                }

                .form-input {
                    width: 100%;
                    margin-bottom: var(--spacing-md);
                    font-family: var(--font-mono);
                }

                .action-buttons {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }

                .visual-numpad {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    text-align: center;
                    margin-bottom: var(--spacing-lg);
                }

                .visual-numpad h4 {
                    margin: 0 0 var(--spacing-md);
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                .numpad-grid {
                    display: inline-flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .numpad-row {
                    display: flex;
                    gap: 6px;
                    justify-content: center;
                }

                .numpad-key {
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary);
                    border: 2px solid var(--border-color);
                    border-radius: 8px;
                    font-size: var(--text-lg);
                    font-weight: 700;
                    font-family: var(--font-mono);
                    transition: all 0.15s ease;
                }

                .numpad-key.highlight {
                    background: var(--success);
                    color: white;
                    border-color: var(--success);
                    transform: scale(1.1);
                    box-shadow: 0 0 15px var(--success);
                }

                .numpad-tip {
                    margin: var(--spacing-md) 0 0;
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }

                .result-box {
                    text-align: center;
                    padding: var(--spacing-xl);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    margin-bottom: var(--spacing-lg);
                }

                .result-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--spacing-md);
                    margin: var(--spacing-lg) 0;
                }

                .result-item {
                    padding: var(--spacing-md);
                    background: var(--bg-primary);
                    border-radius: var(--radius);
                    text-align: center;
                }

                .result-item.highlight {
                    grid-column: span 2;
                    background: var(--gradient-primary);
                    color: white;
                }

                .result-item.highlight .result-label,
                .result-item.highlight .result-value { color: white; }

                .result-label {
                    display: block;
                    font-size: var(--text-sm);
                    margin-bottom: var(--spacing-xs);
                    color: var(--text-muted);
                }

                .result-value {
                    font-size: var(--text-2xl);
                    font-weight: 700;
                }

                .new-record {
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: linear-gradient(135deg, #F59E0B, #D97706);
                    color: white;
                    border-radius: 20px;
                    display: inline-block;
                    margin-bottom: var(--spacing-md);
                    font-weight: 600;
                    animation: pulse 1s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                .result-actions {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-md);
                }

                .history-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                }

                .history-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }

                .history-header h3 {
                    margin: 0;
                    font-size: var(--text-md);
                }

                .btn-clear {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: var(--text-sm);
                }

                .btn-clear:hover { color: var(--error); }

                .history-summary {
                    display: flex;
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-md);
                    padding-bottom: var(--spacing-md);
                    border-bottom: 1px solid var(--border-color);
                }

                .summary-stat {
                    text-align: center;
                }

                .summary-stat span {
                    display: block;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }

                .summary-stat strong {
                    font-size: var(--text-lg);
                    color: var(--text-primary);
                }

                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }

                .history-item {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--spacing-sm);
                    background: var(--bg-primary);
                    border-radius: var(--radius-sm);
                    font-size: var(--text-sm);
                }

                .history-mode {
                    font-weight: 600;
                    min-width: 140px;
                }

                @media (max-width: 768px) {
                    .mode-selector {
                        grid-template-columns: repeat(3, 1fr);
                    }

                    .numpad-key {
                        width: 42px;
                        height: 42px;
                    }
                }

                @media (max-width: 480px) {
                    .mode-selector {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .settings-bar {
                        justify-content: center;
                    }

                    .best-badge {
                        margin-left: 0;
                        width: 100%;
                        text-align: center;
                    }

                    .numbers-display {
                        font-size: var(--text-md);
                        padding: var(--spacing-md);
                    }
                }
            `}</style>
        </ToolLayout>
    );
};

export default NumpadTest;
