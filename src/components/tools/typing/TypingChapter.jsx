import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ToolLayout from '../../layout/ToolLayout';
import VirtualKeyboard from './VirtualKeyboard';
import {
    getChapterById,
    generatePracticeText,
    calculateStars,
    isChapterUnlocked,
    getPhases
} from '../../../data/typingChapters';

const TypingChapter = () => {
    const { chapterId } = useParams();
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const [chapter, setChapter] = useState(null);
    const [practiceText, setPracticeText] = useState('');
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState({});
    const [pressedKey, setPressedKey] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('typingProgress');
        if (saved) {
            setProgress(JSON.parse(saved));
        }
    }, []);

    // Load chapter data
    useEffect(() => {
        const id = parseInt(chapterId);
        const chapterData = getChapterById(id);

        if (!chapterData) {
            navigate('/tools/typing-test');
            return;
        }

        // Check if unlocked
        const saved = localStorage.getItem('typingProgress');
        const savedProgress = saved ? JSON.parse(saved) : {};

        if (!isChapterUnlocked(id, savedProgress)) {
            navigate('/tools/typing-test');
            return;
        }

        setChapter(chapterData);
        setPracticeText(generatePracticeText(chapterData));
        setInput('');
        setStarted(false);
        setFinished(false);
        setResult(null);
        setElapsedTime(0);
    }, [chapterId, navigate]);

    // Timer
    useEffect(() => {
        let interval;
        if (started && !finished) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [started, finished, startTime]);

    const handleInputChange = (e) => {
        const value = e.target.value;

        if (!started && value.length > 0) {
            setStarted(true);
            setStartTime(Date.now());
        }

        setInput(value);

        // Track pressed key for keyboard highlight
        if (value.length > input.length) {
            setPressedKey(value[value.length - 1]);
            setTimeout(() => setPressedKey(''), 100);
        }

        if (value.length >= practiceText.length) {
            finishTest(value);
        }
    };

    const finishTest = useCallback((typedText) => {
        setFinished(true);
        const endTime = Date.now();
        const timeInMinutes = (endTime - startTime) / 60000;
        const words = typedText.trim().split(/\s+/).length;
        const wpm = Math.round(words / timeInMinutes);

        let correct = 0;
        let errors = [];
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === practiceText[i]) {
                correct++;
            } else {
                errors.push({ index: i, expected: practiceText[i], actual: typedText[i] });
            }
        }
        const accuracy = Math.round((correct / typedText.length) * 100);
        const stars = calculateStars(wpm, accuracy, chapter);

        const testResult = {
            wpm,
            accuracy,
            time: Math.round(timeInMinutes * 60),
            chars: typedText.length,
            errors: errors.length,
            stars
        };

        setResult(testResult);

        // Save progress
        const newProgress = { ...progress };
        const currentBest = newProgress[chapter.id];

        if (!currentBest || stars > currentBest.stars ||
            (stars === currentBest.stars && wpm > currentBest.wpm)) {
            newProgress[chapter.id] = {
                stars,
                wpm,
                accuracy,
                completedAt: new Date().toISOString()
            };
            setProgress(newProgress);
            localStorage.setItem('typingProgress', JSON.stringify(newProgress));
        }
    }, [startTime, practiceText, chapter, progress]);

    const restart = () => {
        setPracticeText(generatePracticeText(chapter));
        setInput('');
        setStarted(false);
        setFinished(false);
        setResult(null);
        setElapsedTime(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const nextChapter = () => {
        const nextId = chapter.id + 1;
        if (nextId <= 30) {
            navigate(`/tools/typing-chapter/${nextId}`);
        } else {
            navigate('/tools/typing-test');
        }
    };

    const currentChar = practiceText[input.length] || '';

    if (!chapter) {
        return null;
    }

    const renderStars = (count, size = 24) => {
        return (
            <div className="stars-display">
                {[1, 2, 3].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= count ? 'filled' : 'empty'}`}
                        style={{ fontSize: size }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const faqs = [
        { question: 'How do I unlock the next chapter?', answer: 'Complete the current chapter with at least 1 star to unlock the next one.' },
        { question: 'How are stars calculated?', answer: `Stars are based on WPM and accuracy. For this chapter: 1★ = ${chapter.starThresholds[1].wpm} WPM/${chapter.starThresholds[1].accuracy}%, 2★ = ${chapter.starThresholds[2].wpm} WPM/${chapter.starThresholds[2].accuracy}%, 3★ = ${chapter.starThresholds[3].wpm} WPM/${chapter.starThresholds[3].accuracy}%` }
    ];

    const seoContent = (
        <>
            <h2>Chapter {chapter.id}: {chapter.title}</h2>
            <p>{chapter.description}. Focus on the {chapter.focusKeys.length > 0 ? `keys: ${chapter.focusKeys.join(', ')}` : 'speed and accuracy'}.</p>
        </>
    );

    return (
        <ToolLayout
            title={`Chapter ${chapter.id}: ${chapter.title}`}
            description={chapter.description}
            keywords={['typing practice', 'learn typing', `chapter ${chapter.id}`, ...chapter.focusKeys]}
            category="typing"
            categoryName="Typing & Education"
            faqs={faqs}
            seoContent={seoContent}
        >
            <div className="chapter-container">
                {/* Chapter Header */}
                <div className="chapter-header">
                    <Link to="/tools/typing-test" className="back-link">← All Chapters</Link>
                    <div className="chapter-info">
                        <span className="phase-badge">{chapter.phase}</span>
                        <h2>Chapter {chapter.id}: {chapter.title}</h2>
                        <p>{chapter.description}</p>
                    </div>
                    <div className="chapter-goals">
                        <div className="goal">
                            <span className="goal-label">Target</span>
                            <span className="goal-value">{chapter.targetWPM} WPM</span>
                        </div>
                        <div className="goal">
                            <span className="goal-label">Min Accuracy</span>
                            <span className="goal-value">{chapter.minimumAccuracy}%</span>
                        </div>
                        {chapter.focusKeys.length > 0 && (
                            <div className="goal focus-keys">
                                <span className="goal-label">Focus Keys</span>
                                <span className="goal-value keys">{chapter.focusKeys.slice(0, 8).join(' ')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {!finished ? (
                    <>
                        {/* Stats Bar */}
                        <div className="stats-bar">
                            <div className="stat">
                                <span className="stat-icon">⏱️</span>
                                <span className="stat-value">{elapsedTime}s</span>
                            </div>
                            <div className="stat">
                                <span className="stat-icon">📝</span>
                                <span className="stat-value">{input.length} / {practiceText.length}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-icon">🎯</span>
                                <span className="stat-value">
                                    {input.length > 0
                                        ? Math.round((practiceText.split('').slice(0, input.length).filter((c, i) => c === input[i]).length / input.length) * 100)
                                        : 100}%
                                </span>
                            </div>
                        </div>

                        {/* Text to Type */}
                        <div className="text-to-type">
                            {practiceText.split('').map((char, i) => {
                                let className = 'char';
                                if (i < input.length) {
                                    className += input[i] === char ? ' correct' : ' incorrect';
                                } else if (i === input.length) {
                                    className += ' current';
                                }
                                return (
                                    <span key={i} className={className}>
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <textarea
                            ref={inputRef}
                            className="typing-input"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Click here and start typing..."
                            autoFocus
                            disabled={finished}
                            spellCheck={false}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                        />

                        {/* Virtual Keyboard */}
                        <VirtualKeyboard
                            currentKey={currentChar}
                            focusKeys={chapter.focusKeys}
                            pressedKey={pressedKey}
                            showFingerColors={true}
                            compact={window.innerWidth < 768}
                        />
                    </>
                ) : (
                    /* Results Screen */
                    <div className="result-container">
                        <div className="result-header">
                            <h2>Chapter Complete!</h2>
                            {renderStars(result.stars, 40)}
                            {result.stars === 3 && <span className="perfect-badge">🏆 Perfect!</span>}
                        </div>

                        <div className="result-grid">
                            <div className="result-item primary">
                                <span className="result-icon">⚡</span>
                                <span className="result-value">{result.wpm}</span>
                                <span className="result-label">WPM</span>
                            </div>
                            <div className="result-item">
                                <span className="result-icon">🎯</span>
                                <span className="result-value">{result.accuracy}%</span>
                                <span className="result-label">Accuracy</span>
                            </div>
                            <div className="result-item">
                                <span className="result-icon">⏱️</span>
                                <span className="result-value">{result.time}s</span>
                                <span className="result-label">Time</span>
                            </div>
                            <div className="result-item">
                                <span className="result-icon">❌</span>
                                <span className="result-value">{result.errors}</span>
                                <span className="result-label">Errors</span>
                            </div>
                        </div>

                        {/* Star Thresholds */}
                        <div className="thresholds">
                            <h4>Star Requirements:</h4>
                            <div className="threshold-list">
                                {[1, 2, 3].map((star) => (
                                    <div
                                        key={star}
                                        className={`threshold ${result.stars >= star ? 'achieved' : ''}`}
                                    >
                                        <span className="threshold-stars">{renderStars(star, 16)}</span>
                                        <span className="threshold-req">
                                            {chapter.starThresholds[star].wpm} WPM / {chapter.starThresholds[star].accuracy}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="result-actions">
                            <button className="btn btn-secondary" onClick={restart}>
                                🔄 Try Again
                            </button>
                            {result.stars > 0 && chapter.id < 30 && (
                                <button className="btn btn-primary" onClick={nextChapter}>
                                    Next Chapter →
                                </button>
                            )}
                            <Link to="/tools/typing-test" className="btn btn-outline">
                                All Chapters
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .chapter-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .chapter-header {
          margin-bottom: var(--spacing-xl);
        }

        .back-link {
          color: var(--text-muted);
          text-decoration: none;
          font-size: var(--text-sm);
          display: inline-block;
          margin-bottom: var(--spacing-sm);
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--accent-primary);
        }

        .phase-badge {
          display: inline-block;
          padding: 4px 12px;
          background: var(--gradient-primary);
          color: white;
          border-radius: 20px;
          font-size: var(--text-xs);
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
        }

        .chapter-info h2 {
          margin: 0 0 var(--spacing-xs);
          color: var(--text-primary);
        }

        .chapter-info p {
          color: var(--text-muted);
          margin: 0;
        }

        .chapter-goals {
          display: flex;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-md);
          flex-wrap: wrap;
        }

        .goal {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .goal-label {
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .goal-value {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
        }

        .goal-value.keys {
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 4px;
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

        .stat-icon {
          font-size: var(--text-lg);
        }

        .stat-value {
          font-weight: 600;
          font-family: var(--font-mono);
        }

        .text-to-type {
          background: var(--bg-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          font-size: var(--text-xl);
          line-height: 2;
          margin-bottom: var(--spacing-lg);
          font-family: var(--font-mono);
          letter-spacing: 1px;
          min-height: 120px;
          word-break: break-word;
        }

        .char {
          transition: all 0.1s ease;
        }

        .char.correct {
          color: #10B981;
        }

        .char.incorrect {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.2);
          text-decoration: underline wavy #EF4444;
        }

        .char.current {
          background: #F59E0B;
          color: #000;
          padding: 2px 1px;
          border-radius: 3px;
          animation: pulse 0.8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .typing-input {
          width: 100%;
          height: 80px;
          padding: var(--spacing-md);
          font-size: var(--text-lg);
          font-family: var(--font-mono);
          border: 2px solid var(--border-color);
          border-radius: var(--radius);
          background: var(--bg-primary);
          color: var(--text-primary);
          resize: none;
          margin-bottom: var(--spacing-lg);
          transition: border-color 0.2s;
        }

        .typing-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        /* Results */
        .result-container {
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }

        .result-header {
          margin-bottom: var(--spacing-xl);
        }

        .result-header h2 {
          margin: 0 0 var(--spacing-md);
        }

        .stars-display {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .star {
          transition: transform 0.3s ease;
        }

        .star.filled {
          color: #F59E0B;
          text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }

        .star.empty {
          color: var(--text-muted);
          opacity: 0.3;
        }

        .perfect-badge {
          display: inline-block;
          margin-top: var(--spacing-sm);
          padding: 4px 16px;
          background: linear-gradient(135deg, #F59E0B, #D97706);
          color: white;
          border-radius: 20px;
          font-weight: 600;
          animation: shine 2s ease-in-out infinite;
        }

        @keyframes shine {
          0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.5); }
          50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.8); }
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .result-item {
          padding: var(--spacing-lg);
          background: var(--bg-primary);
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .result-item.primary {
          background: var(--gradient-primary);
          color: white;
        }

        .result-item.primary .result-label {
          color: rgba(255,255,255,0.8);
        }

        .result-icon {
          font-size: 24px;
        }

        .result-value {
          font-size: var(--text-2xl);
          font-weight: 700;
        }

        .result-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .thresholds {
          margin-bottom: var(--spacing-xl);
          padding: var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius);
        }

        .thresholds h4 {
          margin: 0 0 var(--spacing-sm);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .threshold-list {
          display: flex;
          justify-content: center;
          gap: var(--spacing-lg);
          flex-wrap: wrap;
        }

        .threshold {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          opacity: 0.5;
        }

        .threshold.achieved {
          opacity: 1;
        }

        .threshold-req {
          font-size: var(--text-sm);
          font-family: var(--font-mono);
        }

        .result-actions {
          display: flex;
          justify-content: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid var(--border-color);
          color: var(--text-primary);
        }

        .btn-outline:hover {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }

        @media (max-width: 768px) {
          .chapter-goals {
            gap: var(--spacing-md);
          }

          .stats-bar {
            gap: var(--spacing-md);
          }

          .text-to-type {
            font-size: var(--text-md);
            padding: var(--spacing-md);
            line-height: 1.8;
          }

          .result-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .threshold-list {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default TypingChapter;
