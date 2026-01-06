import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { typingChapters, getPhases, isChapterUnlocked } from '../../../data/typingChapters';

const TypingTest = () => {
    const [activeTab, setActiveTab] = useState('chapters'); // 'chapters' or 'freeplay'
    const [progress, setProgress] = useState({});
    const [text] = useState('The quick brown fox jumps over the lazy dog. Programming is the art of telling a computer what to do. Success comes from continuous effort and learning. Practice makes perfect in everything you do.');
    const [input, setInput] = useState('');
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [result, setResult] = useState(null);
    const inputRef = useRef(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'typing-test').slice(0, 3);

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('typingProgress');
        if (saved) {
            setProgress(JSON.parse(saved));
        }
    }, []);

    const phases = getPhases();

    const getTotalStars = () => {
        return Object.values(progress).reduce((sum, p) => sum + (p.stars || 0), 0);
    };

    const getCompletedChapters = () => {
        return Object.values(progress).filter(p => p.stars > 0).length;
    };

    // Free play functions
    const handleInputChange = (e) => {
        const value = e.target.value;
        if (!started) { setStarted(true); setStartTime(Date.now()); }
        setInput(value);
        if (value.length >= text.length) finishTest(value);
    };

    const finishTest = useCallback((typedText) => {
        setFinished(true);
        const endTime = Date.now();
        const timeInMinutes = (endTime - startTime) / 60000;
        const words = typedText.trim().split(/\s+/).length;
        const wpm = Math.round(words / timeInMinutes);

        let correct = 0;
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === text[i]) correct++;
        }
        const accuracy = Math.round((correct / typedText.length) * 100);

        setResult({ wpm, accuracy, time: Math.round(timeInMinutes * 60), chars: typedText.length });
    }, [startTime, text]);

    const restart = () => {
        setInput('');
        setStarted(false);
        setFinished(false);
        setResult(null);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const renderStars = (count, size = 16) => {
        return (
            <div className="stars-display" style={{ fontSize: size }}>
                {[1, 2, 3].map((star) => (
                    <span key={star} className={`star ${star <= count ? 'filled' : 'empty'}`}>★</span>
                ))}
            </div>
        );
    };

    const faqs = [
        { question: 'What is a good typing speed?', answer: 'Average: 40 WPM. Good: 50-60 WPM. Professional: 70+ WPM. Top typists: 100+ WPM.' },
        { question: 'How to improve typing speed?', answer: 'Practice daily, use proper finger placement, don\'t look at keyboard, and focus on accuracy first.' },
        { question: 'What are the 30 chapters?', answer: 'Our progressive course starts with F and J keys (your index finger anchors) and gradually introduces all keys over 30 chapters, building muscle memory systematically.' }
    ];

    const seoContent = (
        <>
            <h2>Learn Touch Typing in 30 Chapters</h2>
            <p>Master touch typing with our progressive 30-chapter course. Start from home row keys (F, J) and gradually learn the entire keyboard. Track your progress with star ratings and unlock new challenges as you improve.</p>
        </>
    );

    return (
        <ToolLayout
            title="Typing Speed Test & Practice"
            description="Test your typing speed and learn touch typing with our 30-chapter progressive course. Measure WPM, track accuracy, and improve your skills."
            keywords={['typing test', 'typing speed', 'WPM test', 'typing practice', 'learn typing', 'touch typing']}
            category="typing"
            categoryName="Typing & Education"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="typing-hub">
                {/* Stats Overview */}
                <div className="stats-overview">
                    <div className="stat-card">
                        <span className="stat-icon">📚</span>
                        <div className="stat-info">
                            <span className="stat-value">{getCompletedChapters()}/30</span>
                            <span className="stat-label">Chapters Complete</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">⭐</span>
                        <div className="stat-info">
                            <span className="stat-value">{getTotalStars()}/90</span>
                            <span className="stat-label">Stars Earned</span>
                        </div>
                    </div>
                    <div className="stat-card progress-card">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(getCompletedChapters() / 30) * 100}%` }}
                            />
                        </div>
                        <span className="stat-label">Overall Progress</span>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="tab-switcher">
                    <button
                        className={`tab ${activeTab === 'chapters' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chapters')}
                    >
                        📖 30 Chapters
                    </button>
                    <button
                        className={`tab ${activeTab === 'freeplay' ? 'active' : ''}`}
                        onClick={() => setActiveTab('freeplay')}
                    >
                        ⚡ Free Play
                    </button>
                </div>

                {activeTab === 'chapters' ? (
                    /* Chapters Grid */
                    <div className="chapters-section">
                        {phases.map((phase) => (
                            <div key={phase.number} className="phase-group">
                                <div className="phase-header">
                                    <h3>
                                        <span className="phase-number">Phase {phase.number}</span>
                                        {phase.name}
                                    </h3>
                                    <span className="phase-progress">
                                        {phase.chapters.filter(id => progress[id]?.stars > 0).length}/{phase.chapters.length} complete
                                    </span>
                                </div>
                                <div className="chapters-grid">
                                    {phase.chapters.map((chapterId) => {
                                        const chapter = typingChapters.find(c => c.id === chapterId);
                                        const isUnlocked = isChapterUnlocked(chapterId, progress);
                                        const chapterProgress = progress[chapterId];

                                        return (
                                            <Link
                                                key={chapterId}
                                                to={isUnlocked ? `/tools/typing-chapter/${chapterId}` : '#'}
                                                className={`chapter-card ${isUnlocked ? '' : 'locked'} ${chapterProgress?.stars === 3 ? 'perfect' : ''}`}
                                                onClick={(e) => !isUnlocked && e.preventDefault()}
                                            >
                                                {!isUnlocked && <div className="lock-overlay">🔒</div>}
                                                <div className="chapter-number">{chapterId}</div>
                                                <h4>{chapter.title}</h4>
                                                <p>{chapter.focusKeys.length > 0 ? chapter.focusKeys.slice(0, 4).join(' ') : 'Speed'}</p>
                                                {chapterProgress ? (
                                                    <div className="chapter-progress">
                                                        {renderStars(chapterProgress.stars, 14)}
                                                        <span className="chapter-wpm">{chapterProgress.wpm} WPM</span>
                                                    </div>
                                                ) : (
                                                    <div className="chapter-target">
                                                        Target: {chapter.targetWPM} WPM
                                                    </div>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Free Play Mode */
                    <div className="freeplay-section">
                        {!finished ? (
                            <>
                                <div className="text-to-type">
                                    {text.split('').map((char, i) => (
                                        <span key={i} className={i < input.length ? (input[i] === char ? 'correct' : 'incorrect') : i === input.length ? 'current' : ''}>{char}</span>
                                    ))}
                                </div>
                                <textarea
                                    ref={inputRef}
                                    className="typing-input"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Start typing here..."
                                    autoFocus
                                    disabled={finished}
                                    spellCheck={false}
                                />
                                {started && <p className="timer">⏱️ Time: {Math.round((Date.now() - startTime) / 1000)}s</p>}
                            </>
                        ) : (
                            <div className="result-box">
                                <h2>🎉 Results</h2>
                                <div className="result-grid">
                                    <div className="result-item highlight">
                                        <span className="result-label">Speed</span>
                                        <span className="result-value">{result.wpm} WPM</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Accuracy</span>
                                        <span className="result-value">{result.accuracy}%</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Time</span>
                                        <span className="result-value">{result.time}s</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Characters</span>
                                        <span className="result-value">{result.chars}</span>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={restart}>Try Again</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        .typing-hub {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Stats Overview */
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }

        .stat-icon {
          font-size: 32px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .progress-card {
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: var(--bg-tertiary);
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--gradient-primary);
          border-radius: 6px;
          transition: width 0.5s ease;
        }

        /* Tab Switcher */
        .tab-switcher {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
          background: var(--bg-secondary);
          padding: 6px;
          border-radius: var(--radius);
        }

        .tab {
          flex: 1;
          padding: var(--spacing-md);
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: var(--text-md);
          font-weight: 600;
          cursor: pointer;
          border-radius: var(--radius);
          transition: all 0.2s;
        }

        .tab:hover {
          color: var(--text-primary);
        }

        .tab.active {
          background: var(--bg-primary);
          color: var(--text-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Chapters Section */
        .phase-group {
          margin-bottom: var(--spacing-xl);
        }

        .phase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .phase-header h3 {
          margin: 0;
          font-size: var(--text-lg);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .phase-number {
          display: inline-block;
          padding: 2px 10px;
          background: var(--gradient-primary);
          color: white;
          border-radius: 20px;
          font-size: var(--text-xs);
          font-weight: 700;
        }

        .phase-progress {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .chapters-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--spacing-md);
        }

        .chapter-card {
          position: relative;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: var(--text-primary);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          min-height: 140px;
        }

        .chapter-card:hover:not(.locked) {
          transform: translateY(-4px);
          border-color: var(--accent-primary);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .chapter-card.locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .chapter-card.perfect {
          border-color: #F59E0B;
          background: linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05));
        }

        .lock-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 28px;
          z-index: 2;
        }

        .chapter-number {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--accent-primary);
          color: white;
          border-radius: 50%;
          font-size: var(--text-xs);
          font-weight: 700;
        }

        .chapter-card h4 {
          margin: 0 0 4px;
          font-size: var(--text-sm);
          font-weight: 600;
          padding-right: 24px;
        }

        .chapter-card p {
          margin: 0;
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 2px;
          flex: 1;
        }

        .chapter-progress, .chapter-target {
          margin-top: auto;
          padding-top: var(--spacing-sm);
          border-top: 1px solid var(--border-color);
        }

        .chapter-target {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .chapter-progress {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chapter-wpm {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--success);
        }

        .stars-display {
          display: flex;
          gap: 2px;
        }

        .star.filled {
          color: #F59E0B;
        }

        .star.empty {
          color: var(--text-muted);
          opacity: 0.3;
        }

        /* Free Play Section */
        .freeplay-section {
          max-width: 700px;
          margin: 0 auto;
        }

        .text-to-type {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          font-size: var(--text-lg);
          line-height: 1.8;
          margin-bottom: var(--spacing-lg);
        }

        .text-to-type .correct { color: #10B981; }
        .text-to-type .incorrect { color: #EF4444; text-decoration: underline wavy; }
        .text-to-type .current { background: #F59E0B; padding: 2px; border-radius: 3px; }

        .typing-input {
          width: 100%;
          height: 120px;
          padding: var(--spacing-md);
          font-size: var(--text-lg);
          border: 2px solid var(--border-color);
          border-radius: var(--radius);
          background: var(--bg-primary);
          color: var(--text-primary);
          resize: none;
        }

        .typing-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .timer {
          text-align: center;
          margin-top: var(--spacing-md);
          color: var(--text-muted);
          font-size: var(--text-lg);
        }

        .result-box {
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
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
        .result-item.highlight .result-value {
          color: white;
        }

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

        @media (max-width: 1024px) {
          .chapters-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-overview {
            grid-template-columns: 1fr 1fr;
          }

          .progress-card {
            grid-column: span 2;
          }

          .chapters-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chapter-card {
            min-height: 120px;
          }
        }

        @media (max-width: 480px) {
          .stats-overview {
            grid-template-columns: 1fr;
          }

          .progress-card {
            grid-column: span 1;
          }

          .chapters-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-sm);
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default TypingTest;
