import { useState, useEffect, useCallback, useRef } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const Stopwatch = () => {
    const [mode, setMode] = useState('stopwatch');

    // Stopwatch state
    const [stopwatchTime, setStopwatchTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const intervalRef = useRef(null);

    // Timer state
    const [timerInput, setTimerInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
    const [timerTime, setTimerTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerComplete, setTimerComplete] = useState(false);
    const timerIntervalRef = useRef(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'stopwatch').slice(0, 3);

    // Stopwatch functions
    const startStopwatch = useCallback(() => {
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            setStopwatchTime(prev => prev + 10);
        }, 10);
    }, []);

    const stopStopwatch = useCallback(() => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    const resetStopwatch = useCallback(() => {
        stopStopwatch();
        setStopwatchTime(0);
        setLaps([]);
    }, [stopStopwatch]);

    const addLap = useCallback(() => {
        const prevLap = laps.length > 0 ? laps[0].total : 0;
        setLaps(prev => [{
            number: prev.length + 1,
            time: stopwatchTime - prevLap,
            total: stopwatchTime
        }, ...prev]);
    }, [stopwatchTime, laps]);

    // Timer functions
    const startTimer = useCallback(() => {
        if (timerTime === 0) {
            const totalMs = (timerInput.hours * 3600 + timerInput.minutes * 60 + timerInput.seconds) * 1000;
            if (totalMs === 0) return;
            setTimerTime(totalMs);
        }
        setIsTimerRunning(true);
        setTimerComplete(false);
        timerIntervalRef.current = setInterval(() => {
            setTimerTime(prev => {
                if (prev <= 10) {
                    clearInterval(timerIntervalRef.current);
                    setIsTimerRunning(false);
                    setTimerComplete(true);
                    return 0;
                }
                return prev - 10;
            });
        }, 10);
    }, [timerTime, timerInput]);

    const pauseTimer = useCallback(() => {
        setIsTimerRunning(false);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    }, []);

    const resetTimer = useCallback(() => {
        pauseTimer();
        setTimerTime(0);
        setTimerComplete(false);
    }, [pauseTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, []);

    const formatTime = (ms, showMs = true) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);

        if (hours > 0) {
            return showMs
                ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
                : `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return showMs
            ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
            : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const presets = [
        { label: '1 min', seconds: 60 },
        { label: '5 min', seconds: 300 },
        { label: '10 min', seconds: 600 },
        { label: '15 min', seconds: 900 },
        { label: '30 min', seconds: 1800 },
        { label: '1 hour', seconds: 3600 }
    ];

    const applyPreset = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        setTimerInput({ hours: hrs, minutes: mins, seconds: secs });
        setTimerTime(0);
        setTimerComplete(false);
    };

    const faqs = [
        { question: 'How accurate is the stopwatch?', answer: 'The stopwatch is accurate to 10 milliseconds, which is suitable for most timing needs.' },
        { question: 'Can I use the timer in the background?', answer: 'Yes, the timer continues to run even if you switch to another tab. You\'ll see the completion when you return.' },
        { question: 'What happens when the timer ends?', answer: 'The timer displays a completion message. Note: Browser notifications require permission.' }
    ];

    const seoContent = (
        <>
            <h2>Online Stopwatch & Countdown Timer</h2>
            <p>Free online stopwatch and countdown timer. Track time with lap functionality, or set countdown timers with preset options.</p>
        </>
    );

    return (
        <ToolLayout
            title="Stopwatch & Timer"
            description="Online stopwatch with lap times and countdown timer with presets."
            keywords={['stopwatch', 'timer', 'countdown', 'lap timer', 'online stopwatch']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'stopwatch' ? 'active' : ''}`}
                        onClick={() => setMode('stopwatch')}
                    >
                        ⏱️ Stopwatch
                    </button>
                    <button
                        className={`mode-btn ${mode === 'timer' ? 'active' : ''}`}
                        onClick={() => setMode('timer')}
                    >
                        ⏰ Timer
                    </button>
                </div>

                {mode === 'stopwatch' ? (
                    <div className="stopwatch-section">
                        <div className="time-display">
                            {formatTime(stopwatchTime)}
                        </div>
                        <div className="controls">
                            {!isRunning ? (
                                <button className="btn btn-primary btn-lg" onClick={startStopwatch}>
                                    ▶️ Start
                                </button>
                            ) : (
                                <button className="btn btn-warning btn-lg" onClick={stopStopwatch}>
                                    ⏸️ Pause
                                </button>
                            )}
                            <button className="btn btn-secondary" onClick={addLap} disabled={!isRunning && stopwatchTime === 0}>
                                🏁 Lap
                            </button>
                            <button className="btn btn-outline" onClick={resetStopwatch}>
                                🔄 Reset
                            </button>
                        </div>
                        {laps.length > 0 && (
                            <div className="laps-section">
                                <h3>Laps</h3>
                                <div className="laps-list">
                                    {laps.map((lap, idx) => (
                                        <div key={idx} className="lap-item">
                                            <span className="lap-number">Lap {lap.number}</span>
                                            <span className="lap-time">{formatTime(lap.time)}</span>
                                            <span className="lap-total">{formatTime(lap.total)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="timer-section">
                        {timerTime === 0 && !timerComplete ? (
                            <>
                                <div className="timer-input">
                                    <div className="time-field">
                                        <input
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={timerInput.hours}
                                            onChange={(e) => setTimerInput({ ...timerInput, hours: parseInt(e.target.value) || 0 })}
                                        />
                                        <label>Hours</label>
                                    </div>
                                    <span className="separator">:</span>
                                    <div className="time-field">
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={timerInput.minutes}
                                            onChange={(e) => setTimerInput({ ...timerInput, minutes: parseInt(e.target.value) || 0 })}
                                        />
                                        <label>Minutes</label>
                                    </div>
                                    <span className="separator">:</span>
                                    <div className="time-field">
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={timerInput.seconds}
                                            onChange={(e) => setTimerInput({ ...timerInput, seconds: parseInt(e.target.value) || 0 })}
                                        />
                                        <label>Seconds</label>
                                    </div>
                                </div>
                                <div className="presets">
                                    {presets.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            className="preset-btn"
                                            onClick={() => applyPreset(preset.seconds)}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={`time-display ${timerComplete ? 'complete' : ''}`}>
                                {timerComplete ? '🎉 Time\'s Up!' : formatTime(timerTime, false)}
                            </div>
                        )}
                        <div className="controls">
                            {!isTimerRunning ? (
                                <button className="btn btn-primary btn-lg" onClick={startTimer}>
                                    ▶️ Start
                                </button>
                            ) : (
                                <button className="btn btn-warning btn-lg" onClick={pauseTimer}>
                                    ⏸️ Pause
                                </button>
                            )}
                            <button className="btn btn-outline" onClick={resetTimer}>
                                🔄 Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .tool-form { max-width: 600px; margin: 0 auto; }
                .mode-selector { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-xl); background: var(--ghost-white); padding: var(--spacing-sm); border-radius: var(--radius); }
                .mode-btn { flex: 1; padding: var(--spacing-md); border: 2px solid transparent; background: transparent; border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: var(--text-lg); }
                .mode-btn:hover { background: white; }
                .mode-btn.active { background: white; border-color: var(--yinmn-blue); color: var(--yinmn-blue); }
                .time-display { font-family: var(--font-mono); font-size: 4rem; text-align: center; padding: var(--spacing-xl); color: var(--jet); font-weight: 700; }
                .time-display.complete { color: var(--success); animation: pulse 1s infinite; }
                @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                .controls { display: flex; justify-content: center; gap: var(--spacing-md); margin: var(--spacing-xl) 0; flex-wrap: wrap; }
                .btn { padding: var(--spacing-sm) var(--spacing-lg); border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
                .btn-lg { padding: var(--spacing-md) var(--spacing-xl); font-size: var(--text-lg); }
                .btn-primary { background: linear-gradient(135deg, var(--yinmn-blue), var(--oxford-blue)); color: white; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(66, 90, 157, 0.3); }
                .btn-warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
                .btn-secondary { background: var(--ghost-white); color: var(--jet); border-color: var(--platinum); }
                .btn-secondary:hover:not(:disabled) { background: var(--platinum); }
                .btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-outline { background: transparent; color: var(--jet); border-color: var(--platinum); }
                .btn-outline:hover { background: var(--ghost-white); }
                .laps-section { margin-top: var(--spacing-xl); }
                .laps-section h3 { text-align: center; margin-bottom: var(--spacing-md); }
                .laps-list { max-height: 300px; overflow-y: auto; }
                .lap-item { display: grid; grid-template-columns: 80px 1fr 1fr; gap: var(--spacing-md); padding: var(--spacing-sm) var(--spacing-md); background: var(--ghost-white); border-radius: var(--radius); margin-bottom: var(--spacing-xs); font-family: var(--font-mono); }
                .lap-number { font-weight: 600; }
                .lap-time { color: var(--yinmn-blue); }
                .lap-total { color: var(--dim-gray); text-align: right; }
                .timer-input { display: flex; justify-content: center; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
                .time-field { display: flex; flex-direction: column; align-items: center; }
                .time-field input { width: 80px; font-size: var(--text-2xl); text-align: center; padding: var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-family: var(--font-mono); }
                .time-field input:focus { outline: none; border-color: var(--yinmn-blue); }
                .time-field label { font-size: var(--text-sm); color: var(--dim-gray); margin-top: var(--spacing-xs); }
                .separator { font-size: var(--text-2xl); font-weight: 700; color: var(--dim-gray); }
                .presets { display: flex; justify-content: center; gap: var(--spacing-sm); flex-wrap: wrap; margin-bottom: var(--spacing-lg); }
                .preset-btn { padding: var(--spacing-xs) var(--spacing-md); background: var(--ghost-white); border: 2px solid var(--platinum); border-radius: var(--radius); cursor: pointer; font-size: var(--text-sm); transition: all 0.2s; }
                .preset-btn:hover { border-color: var(--yinmn-blue); background: white; }
                @media (max-width: 480px) { .time-display { font-size: 2.5rem; } .time-field input { width: 60px; font-size: var(--text-xl); } }
            `}</style>
        </ToolLayout>
    );
};

export default Stopwatch;
