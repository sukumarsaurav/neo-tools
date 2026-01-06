import { useState, useEffect, useRef } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

// Practice texts organized by difficulty
const PRACTICE_TEXTS = {
    easy: [
        'the cat sat on the mat',
        'a dog ran in the park',
        'she has a red hat',
        'we like to play games',
        'the sun is very hot'
    ],
    medium: [
        'the quick brown fox jumps over the lazy dog',
        'pack my box with five dozen liquor jugs',
        'how vexingly quick daft zebras jump',
        'sphinx of black quartz judge my vow',
        'the five boxing wizards jump quickly'
    ],
    hard: [
        'Programming requires patience, precision, and continuous practice.',
        'JavaScript frameworks like React enable modern web development.',
        'The algorithm efficiently processes complex data structures.',
        'Debugging code systematically reveals hidden logical errors.',
        'Version control systems help developers collaborate effectively.'
    ],
    expert: [
        'const handleClick = (e) => { e.preventDefault(); setState(!state); };',
        'function fetchData(url) { return fetch(url).then(res => res.json()); }',
        'export default ({ children, className }) => <div className={className}>{children}</div>;',
        'const [state, setState] = useState({ loading: false, error: null, data: [] });',
        'npm install --save-dev @types/react @types/node typescript eslint prettier'
    ]
};

const DIFFICULTY_CONFIG = {
    easy: { name: 'Easy', desc: 'Simple words & short sentences', color: '#10B981' },
    medium: { name: 'Medium', desc: 'Common English phrases', color: '#F59E0B' },
    hard: { name: 'Hard', desc: 'Complex sentences & vocabulary', color: '#EF4444' },
    expert: { name: 'Expert', desc: 'Code snippets & symbols', color: '#8B5CF6' }
};

const BlindTyping = () => {
    const [difficulty, setDifficulty] = useState('medium');
    const [textIndex, setTextIndex] = useState(0);
    const [input, setInput] = useState('');
    const [showKeyboard, setShowKeyboard] = useState(true);
    const [started, setStarted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [history, setHistory] = useState([]);
    const inputRef = useRef(null);

    const texts = PRACTICE_TEXTS[difficulty];
    const text = texts[textIndex % texts.length];
    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'blind-typing').slice(0, 3);

    const keyboard = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    const currentChar = text[input.length] || '';
    const isComplete = input.length >= text.length;

    // Load history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('blindTypingHistory');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    // Timer
    useEffect(() => {
        let interval;
        if (started && !isComplete) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [started, isComplete, startTime]);

    // Calculate stats
    const correctChars = text.split('').filter((c, i) => c === input[i]).length;
    const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
    const words = input.trim().split(/\s+/).filter(w => w.length > 0).length;
    const wpm = elapsedTime > 0 ? Math.round((words / elapsedTime) * 60) : 0;

    const handleInput = (e) => {
        const value = difficulty === 'easy' || difficulty === 'medium'
            ? e.target.value.toLowerCase()
            : e.target.value;
        if (!started && value.length > 0) {
            setStarted(true);
            setStartTime(Date.now());
        }
        setInput(value);
    };

    // Save result to history
    const saveResult = (resultData) => {
        const newHistory = [
            { ...resultData, date: new Date().toISOString(), difficulty },
            ...history
        ].slice(0, 10); // Keep last 10 results
        setHistory(newHistory);
        localStorage.setItem('blindTypingHistory', JSON.stringify(newHistory));
    };

    // Handle completion
    useEffect(() => {
        if (isComplete && started) {
            saveResult({ wpm, accuracy, time: elapsedTime });
        }
    }, [isComplete]);

    const restart = () => {
        setInput('');
        setStarted(false);
        setStartTime(null);
        setElapsedTime(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const nextText = () => {
        setTextIndex((prev) => (prev + 1) % texts.length);
        restart();
    };

    const changeDifficulty = (newDiff) => {
        setDifficulty(newDiff);
        setTextIndex(0);
        restart();
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('blindTypingHistory');
    };

    const avgWpm = history.length > 0
        ? Math.round(history.reduce((sum, h) => sum + h.wpm, 0) / history.length)
        : 0;
    const avgAccuracy = history.length > 0
        ? Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / history.length)
        : 0;

    const faqs = [
        { question: 'What is blind typing?', answer: 'Blind typing (touch typing) is typing without looking at the keyboard. Fingers stay on home row (ASDF JKL;) and reach for other keys.' },
        { question: 'How long to learn blind typing?', answer: 'With 15-30 minutes daily practice, most people develop basic touch typing in 2-4 weeks. Mastery takes a few months.' },
        { question: 'Which difficulty should I start with?', answer: 'Start with Easy if you\'re new to touch typing. Move to Medium once you can type at 30+ WPM with 90%+ accuracy.' }
    ];

    const seoContent = (<><h2>Blind Typing Practice</h2><p>Learn to type without looking at the keyboard. Practice with different difficulty levels from simple words to complex code.</p></>);

    return (
        <ToolLayout title="Blind Typing Practice" description="Practice typing without looking at the keyboard. Develop touch typing skills with multiple difficulty levels." keywords={['blind typing', 'touch typing', 'typing practice', 'learn typing']} category="typing" categoryName="Typing & Education" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="blind-typing">
                {/* Difficulty Selector */}
                <div className="difficulty-selector">
                    {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                            onClick={() => changeDifficulty(key)}
                            style={{ '--diff-color': config.color }}
                        >
                            <span className="diff-name">{config.name}</span>
                            <span className="diff-desc">{config.desc}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    <div className="stat">
                        <span className="stat-icon">⏱️</span>
                        <span className="stat-value">{elapsedTime}s</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">⚡</span>
                        <span className="stat-value">{wpm} WPM</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">🎯</span>
                        <span className="stat-value">{accuracy}%</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">📝</span>
                        <span className="stat-value">{input.length}/{text.length}</span>
                    </div>
                </div>

                {/* Text Display */}
                <div className="text-display">
                    {text.split('').map((char, i) => (
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
                            {char === ' ' ? '\u00A0' : char}
                        </span>
                    ))}
                </div>

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    className="form-input"
                    value={input}
                    onChange={handleInput}
                    placeholder="Start typing..."
                    autoComplete="off"
                    spellCheck={false}
                    disabled={isComplete}
                    autoFocus
                />

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="btn btn-secondary" onClick={() => setShowKeyboard(!showKeyboard)}>
                        {showKeyboard ? '🙈 Hide' : '⌨️ Show'} Keyboard
                    </button>
                    <button className="btn btn-secondary" onClick={nextText}>
                        🔀 Next Text
                    </button>
                    <button className="btn btn-secondary" onClick={restart}>
                        🔄 Restart
                    </button>
                </div>

                {/* Virtual Keyboard */}
                {showKeyboard && (
                    <div className="virtual-keyboard">
                        {keyboard.map((row, i) => (
                            <div key={i} className="keyboard-row">
                                {row.map(key => (
                                    <span
                                        key={key}
                                        className={`key ${key.toLowerCase() === currentChar.toLowerCase() ? 'highlight' : ''} ${['a', 's', 'd', 'f', 'j', 'k', 'l'].includes(key) ? 'home' : ''}`}
                                    >
                                        {key}
                                    </span>
                                ))}
                            </div>
                        ))}
                        <div className="keyboard-row">
                            <span className={`key space ${currentChar === ' ' ? 'highlight' : ''}`}>Space</span>
                        </div>
                    </div>
                )}

                {/* Session History */}
                {history.length > 0 && (
                    <div className="history-section">
                        <div className="history-header">
                            <h3>📊 Session History</h3>
                            <button className="btn-clear" onClick={clearHistory}>Clear</button>
                        </div>
                        <div className="history-summary">
                            <div className="summary-stat">
                                <span>Sessions</span>
                                <strong>{history.length}</strong>
                            </div>
                            <div className="summary-stat">
                                <span>Avg WPM</span>
                                <strong>{avgWpm}</strong>
                            </div>
                            <div className="summary-stat">
                                <span>Avg Accuracy</span>
                                <strong>{avgAccuracy}%</strong>
                            </div>
                        </div>
                        <div className="history-list">
                            {history.slice(0, 5).map((h, i) => (
                                <div key={i} className="history-item">
                                    <span className="history-diff" style={{ color: DIFFICULTY_CONFIG[h.difficulty]?.color }}>
                                        {DIFFICULTY_CONFIG[h.difficulty]?.name || h.difficulty}
                                    </span>
                                    <span>{h.wpm} WPM</span>
                                    <span>{h.accuracy}%</span>
                                    <span>{h.time}s</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results */}
                {isComplete && (
                    <div className="result-box">
                        <h3>🎉 Complete!</h3>
                        <div className="result-grid">
                            <div className="result-item highlight">
                                <span className="result-label">Speed</span>
                                <span className="result-value">{wpm} WPM</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">Accuracy</span>
                                <span className="result-value">{accuracy}%</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">Correct</span>
                                <span className="result-value">{correctChars}/{text.length}</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">Time</span>
                                <span className="result-value">{elapsedTime}s</span>
                            </div>
                        </div>
                        <div className="result-actions">
                            <button className="btn btn-primary" onClick={restart}>Try Again</button>
                            <button className="btn btn-secondary" onClick={nextText}>Next Text</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .blind-typing {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .difficulty-selector {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }

                .difficulty-btn {
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }

                .difficulty-btn:hover {
                    border-color: var(--diff-color);
                }

                .difficulty-btn.active {
                    border-color: var(--diff-color);
                    background: linear-gradient(135deg, var(--diff-color)10, var(--diff-color)05);
                }

                .diff-name {
                    display: block;
                    font-weight: 700;
                    font-size: var(--text-md);
                    color: var(--text-primary);
                }

                .diff-desc {
                    display: block;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-top: 2px;
                }

                .stats-bar {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-lg);
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

                .text-display {
                    background: var(--bg-secondary);
                    padding: var(--spacing-xl);
                    border-radius: var(--radius);
                    font-size: var(--text-xl);
                    font-family: var(--font-mono);
                    margin-bottom: var(--spacing-lg);
                    letter-spacing: 1px;
                    line-height: 1.8;
                    min-height: 80px;
                }

                .text-display .correct { color: var(--success); }
                .text-display .incorrect { 
                    color: var(--error); 
                    background: rgba(239, 68, 68, 0.2);
                    text-decoration: underline wavy;
                }
                .text-display .current { 
                    background: var(--warning); 
                    padding: 2px 4px; 
                    border-radius: 4px;
                    color: #000;
                    animation: pulse 0.8s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                .form-input {
                    width: 100%;
                    margin-bottom: var(--spacing-md);
                }

                .action-buttons {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }

                .virtual-keyboard {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                }

                .keyboard-row {
                    display: flex;
                    justify-content: center;
                    gap: 4px;
                    margin-bottom: 4px;
                }

                .key {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-primary);
                    border: 2px solid var(--border-color);
                    border-radius: 6px;
                    font-size: var(--text-sm);
                    text-transform: uppercase;
                    font-weight: 600;
                    transition: all 0.15s ease;
                }

                .key.home { border-bottom: 3px solid var(--accent-primary); }
                .key.highlight { 
                    background: var(--success); 
                    color: white;
                    transform: scale(1.1);
                    box-shadow: 0 0 10px var(--success);
                }
                .key.space { width: 200px; }

                .history-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
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

                .history-diff {
                    font-weight: 600;
                    min-width: 60px;
                }

                .result-box {
                    background: var(--bg-secondary);
                    padding: var(--spacing-xl);
                    border-radius: var(--radius-lg);
                    text-align: center;
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
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-xs);
                }

                .result-value {
                    font-size: var(--text-2xl);
                    font-weight: 700;
                }

                .result-actions {
                    display: flex;
                    justify-content: center;
                    gap: var(--spacing-md);
                }

                @media (max-width: 768px) {
                    .difficulty-selector {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 600px) {
                    .difficulty-selector {
                        grid-template-columns: 1fr;
                    }
                    
                    .stats-bar {
                        gap: var(--spacing-sm);
                        flex-wrap: wrap;
                    }

                    .text-display {
                        font-size: var(--text-md);
                        padding: var(--spacing-md);
                    }

                    .key {
                        width: 28px;
                        height: 32px;
                        font-size: 10px;
                    }

                    .key.space { width: 140px; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default BlindTyping;
