import { useState, useEffect, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const MultiplicationTable = () => {
    const [number, setNumber] = useState(7);
    const [range, setRange] = useState(12);
    const [mode, setMode] = useState('table'); // table, practice, quiz, timer
    const [showAnswers, setShowAnswers] = useState(true);
    const [practiceAnswers, setPracticeAnswers] = useState({});

    // Quiz state
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizIndex, setQuizIndex] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState('');
    const [quizScore, setQuizScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [quizResults, setQuizResults] = useState([]);

    // Timer state
    const [timerStarted, setTimerStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [timerScore, setTimerScore] = useState(0);
    const [timerQuestions, setTimerQuestions] = useState([]);
    const [timerIndex, setTimerIndex] = useState(0);
    const [timerAnswer, setTimerAnswer] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'multiplication-table').slice(0, 3);

    // Generate random questions
    const generateQuestions = useCallback((count = 10) => {
        const questions = [];
        for (let i = 0; i < count; i++) {
            const a = Math.floor(Math.random() * 12) + 1;
            const b = Math.floor(Math.random() * 12) + 1;
            questions.push({ a, b, answer: a * b });
        }
        return questions;
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!timerStarted || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    setTimerStarted(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerStarted, timeLeft]);

    const startQuiz = () => {
        const questions = generateQuestions(10);
        setQuizQuestions(questions);
        setQuizIndex(0);
        setQuizScore(0);
        setQuizComplete(false);
        setQuizResults([]);
        setQuizAnswer('');
    };

    const submitQuizAnswer = () => {
        const current = quizQuestions[quizIndex];
        const isCorrect = parseInt(quizAnswer) === current.answer;

        setQuizResults([...quizResults, { ...current, userAnswer: quizAnswer, correct: isCorrect }]);
        if (isCorrect) setQuizScore(s => s + 1);

        if (quizIndex + 1 >= quizQuestions.length) {
            setQuizComplete(true);
        } else {
            setQuizIndex(i => i + 1);
            setQuizAnswer('');
        }
    };

    const startTimer = () => {
        setTimerQuestions(generateQuestions(100));
        setTimerIndex(0);
        setTimerScore(0);
        setTimeLeft(60);
        setTimerStarted(true);
        setTimerAnswer('');
    };

    const submitTimerAnswer = () => {
        const current = timerQuestions[timerIndex];
        if (parseInt(timerAnswer) === current.answer) {
            setTimerScore(s => s + 1);
        }
        setTimerIndex(i => i + 1);
        setTimerAnswer('');
    };

    const handlePracticeInput = (i, value) => {
        setPracticeAnswers(prev => ({ ...prev, [i]: value }));
    };

    const checkPracticeAnswers = () => {
        setShowAnswers(true);
    };

    const tableData = Array.from({ length: range }, (_, i) => ({
        multiplier: i + 1,
        result: number * (i + 1)
    }));

    const faqs = [
        { question: 'How to memorize multiplication tables?', answer: 'Practice regularly, use mnemonic devices, focus on difficult facts, and use visual patterns. The quiz and timer modes help reinforce memory.' },
        { question: 'What multiplication tables should kids know?', answer: 'Most curricula expect students to know 1-12 times tables by the end of 4th or 5th grade.' }
    ];

    const seoContent = (<><h2>Multiplication Table</h2><p>Practice multiplication tables with interactive modes including quizzes and timed challenges.</p></>);

    return (
        <ToolLayout title="Multiplication Table" description="Learn and practice multiplication tables with quiz, practice, and timed challenges." keywords={['multiplication table', 'times tables', 'math practice', 'multiplication quiz']} category="typing" categoryName="Typing & Education" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="multiplication-tool">
                {/* Mode Selector */}
                <div className="mode-selector">
                    <button className={`mode-btn ${mode === 'table' ? 'active' : ''}`} onClick={() => setMode('table')}>
                        📊 Table
                    </button>
                    <button className={`mode-btn ${mode === 'practice' ? 'active' : ''}`} onClick={() => { setMode('practice'); setShowAnswers(false); setPracticeAnswers({}); }}>
                        ✏️ Practice
                    </button>
                    <button className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`} onClick={() => { setMode('quiz'); startQuiz(); }}>
                        ❓ Quiz
                    </button>
                    <button className={`mode-btn ${mode === 'timer' ? 'active' : ''}`} onClick={() => setMode('timer')}>
                        ⏱️ Timer Challenge
                    </button>
                </div>

                {/* Settings for Table/Practice modes */}
                {(mode === 'table' || mode === 'practice') && (
                    <div className="settings-bar">
                        <div className="setting">
                            <label>Number:</label>
                            <input
                                type="number"
                                className="form-input small"
                                value={number}
                                onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
                                min="1"
                                max="100"
                            />
                        </div>
                        <div className="setting">
                            <label>Range:</label>
                            <select className="form-select" value={range} onChange={(e) => setRange(parseInt(e.target.value))}>
                                <option value={10}>1-10</option>
                                <option value={12}>1-12</option>
                                <option value={15}>1-15</option>
                                <option value={20}>1-20</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* TABLE MODE */}
                {mode === 'table' && (
                    <div className="table-container">
                        <h2 className="table-title">{number} × Table</h2>
                        <div className="table-grid">
                            {tableData.map((row, i) => (
                                <div key={i} className="table-row">
                                    <span className="equation">{number} × {row.multiplier}</span>
                                    <span className="equals">=</span>
                                    <span className="result">{row.result}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PRACTICE MODE */}
                {mode === 'practice' && (
                    <div className="practice-container">
                        <h2 className="table-title">{number} × Table - Practice</h2>
                        <div className="practice-grid">
                            {tableData.map((row, i) => {
                                const userAnswer = practiceAnswers[i] || '';
                                const isCorrect = parseInt(userAnswer) === row.result;
                                const isWrong = userAnswer && !isCorrect;

                                return (
                                    <div key={i} className={`practice-row ${showAnswers ? (isCorrect ? 'correct' : isWrong ? 'wrong' : '') : ''}`}>
                                        <span className="equation">{number} × {row.multiplier} =</span>
                                        <input
                                            type="number"
                                            className="form-input answer-input"
                                            value={userAnswer}
                                            onChange={(e) => handlePracticeInput(i, e.target.value)}
                                            placeholder="?"
                                        />
                                        {showAnswers && isWrong && (
                                            <span className="correct-answer">✓ {row.result}</span>
                                        )}
                                        {showAnswers && isCorrect && (
                                            <span className="check">✓</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <button className="btn btn-primary" onClick={checkPracticeAnswers}>
                            Check Answers
                        </button>
                    </div>
                )}

                {/* QUIZ MODE */}
                {mode === 'quiz' && (
                    <div className="quiz-container">
                        {!quizComplete ? (
                            <>
                                <div className="quiz-progress">
                                    Question {quizIndex + 1} of {quizQuestions.length}
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${((quizIndex) / quizQuestions.length) * 100}%` }}></div>
                                    </div>
                                </div>

                                {quizQuestions[quizIndex] && (
                                    <div className="quiz-question">
                                        <div className="question-display">
                                            <span className="question-num">{quizQuestions[quizIndex].a}</span>
                                            <span className="question-op">×</span>
                                            <span className="question-num">{quizQuestions[quizIndex].b}</span>
                                            <span className="question-eq">=</span>
                                            <input
                                                type="number"
                                                className="form-input quiz-input"
                                                value={quizAnswer}
                                                onChange={(e) => setQuizAnswer(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && submitQuizAnswer()}
                                                autoFocus
                                            />
                                        </div>
                                        <button className="btn btn-primary" onClick={submitQuizAnswer}>
                                            Submit
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="quiz-results">
                                <h2>🎉 Quiz Complete!</h2>
                                <div className="score-display">
                                    <span className="score">{quizScore}/{quizQuestions.length}</span>
                                    <span className="percent">{Math.round((quizScore / quizQuestions.length) * 100)}%</span>
                                </div>

                                <div className="results-list">
                                    {quizResults.map((r, i) => (
                                        <div key={i} className={`result-item ${r.correct ? 'correct' : 'wrong'}`}>
                                            <span>{r.a} × {r.b} = {r.answer}</span>
                                            {!r.correct && <span className="your-answer">Your answer: {r.userAnswer}</span>}
                                        </div>
                                    ))}
                                </div>

                                <button className="btn btn-primary" onClick={startQuiz}>Try Again</button>
                            </div>
                        )}
                    </div>
                )}

                {/* TIMER MODE */}
                {mode === 'timer' && (
                    <div className="timer-container">
                        {!timerStarted && timeLeft === 60 ? (
                            <div className="timer-start">
                                <h2>⏱️ 60-Second Challenge</h2>
                                <p>Answer as many multiplication questions as you can in 60 seconds!</p>
                                <button className="btn btn-primary btn-lg" onClick={startTimer}>Start Challenge</button>
                            </div>
                        ) : timerStarted ? (
                            <>
                                <div className="timer-header">
                                    <div className="timer-display">
                                        <span className="time">{timeLeft}s</span>
                                    </div>
                                    <div className="timer-score">
                                        Score: <strong>{timerScore}</strong>
                                    </div>
                                </div>

                                {timerQuestions[timerIndex] && (
                                    <div className="timer-question">
                                        <div className="question-display">
                                            <span className="question-num">{timerQuestions[timerIndex].a}</span>
                                            <span className="question-op">×</span>
                                            <span className="question-num">{timerQuestions[timerIndex].b}</span>
                                            <span className="question-eq">=</span>
                                            <input
                                                type="number"
                                                className="form-input timer-input"
                                                value={timerAnswer}
                                                onChange={(e) => setTimerAnswer(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && submitTimerAnswer()}
                                                autoFocus
                                            />
                                        </div>
                                        <button className="btn btn-primary" onClick={submitTimerAnswer}>→</button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="timer-results">
                                <h2>⏱️ Time's Up!</h2>
                                <div className="final-score">
                                    <span className="score-label">Your Score</span>
                                    <span className="score-value">{timerScore}</span>
                                    <span className="score-sublabel">correct answers</span>
                                </div>
                                <button className="btn btn-primary" onClick={startTimer}>Play Again</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .multiplication-tool {
                    max-width: 700px;
                    margin: 0 auto;
                }

                .mode-selector {
                    display: flex;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }

                .mode-btn {
                    flex: 1;
                    min-width: 120px;
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .mode-btn:hover { border-color: var(--accent-primary); }
                .mode-btn.active { 
                    border-color: var(--accent-primary);
                    background: var(--accent-primary);
                    color: white;
                }

                .settings-bar {
                    display: flex;
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-lg);
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    flex-wrap: wrap;
                }

                .setting {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }

                .setting label { font-weight: 600; color: var(--text-muted); }
                .form-input.small { max-width: 80px; }
                .form-select { max-width: 100px; }

                .table-title {
                    text-align: center;
                    margin-bottom: var(--spacing-lg);
                }

                .table-container, .practice-container {
                    background: var(--bg-secondary);
                    padding: var(--spacing-xl);
                    border-radius: var(--radius-lg);
                }

                .table-grid, .practice-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: var(--spacing-sm);
                }

                .table-row, .practice-row {
                    display: flex;
                    align-items: center;
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: var(--bg-primary);
                    border-radius: var(--radius);
                    gap: var(--spacing-sm);
                }

                .equation { font-family: var(--font-mono); }
                .equals { color: var(--text-muted); }
                .result { font-weight: 700; color: var(--accent-primary); }

                .practice-row.correct { background: rgba(16, 185, 129, 0.2); }
                .practice-row.wrong { background: rgba(239, 68, 68, 0.2); }

                .answer-input { max-width: 70px; }
                .correct-answer { color: var(--success); font-weight: 600; }
                .check { color: var(--success); font-size: var(--text-xl); }

                .quiz-container, .timer-container {
                    text-align: center;
                    padding: var(--spacing-xl);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                }

                .quiz-progress {
                    margin-bottom: var(--spacing-xl);
                }

                .progress-bar {
                    height: 8px;
                    background: var(--bg-tertiary);
                    border-radius: 4px;
                    margin-top: var(--spacing-sm);
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--accent-primary);
                    transition: width 0.3s ease;
                }

                .question-display {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }

                .question-num {
                    font-size: var(--text-4xl);
                    font-weight: 700;
                }

                .question-op, .question-eq {
                    font-size: var(--text-2xl);
                    color: var(--text-muted);
                }

                .quiz-input, .timer-input {
                    max-width: 100px;
                    font-size: var(--text-2xl);
                    text-align: center;
                }

                .score-display, .final-score {
                    padding: var(--spacing-xl);
                    background: var(--gradient-primary);
                    border-radius: var(--radius-lg);
                    color: white;
                    margin: var(--spacing-lg) 0;
                }

                .score { font-size: var(--text-5xl); font-weight: 700; }
                .percent { display: block; font-size: var(--text-xl); opacity: 0.8; }

                .results-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                    margin-bottom: var(--spacing-lg);
                    max-height: 200px;
                    overflow-y: auto;
                }

                .result-item {
                    padding: var(--spacing-sm);
                    background: var(--bg-primary);
                    border-radius: var(--radius-sm);
                    display: flex;
                    justify-content: space-between;
                }

                .result-item.correct { border-left: 3px solid var(--success); }
                .result-item.wrong { border-left: 3px solid var(--error); }
                .your-answer { color: var(--error); font-size: var(--text-sm); }

                .timer-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: var(--spacing-xl);
                    padding: var(--spacing-md);
                    background: var(--bg-primary);
                    border-radius: var(--radius);
                }

                .timer-display .time {
                    font-size: var(--text-3xl);
                    font-weight: 700;
                    color: var(--warning);
                }

                .timer-score { font-size: var(--text-lg); }
                .timer-score strong { color: var(--success); }

                .score-label { display: block; font-size: var(--text-sm); opacity: 0.8; }
                .score-value { display: block; font-size: var(--text-5xl); font-weight: 700; }
                .score-sublabel { display: block; font-size: var(--text-sm); opacity: 0.8; }

                .timer-start h2 { margin-bottom: var(--spacing-md); }
                .timer-start p { color: var(--text-muted); margin-bottom: var(--spacing-lg); }

                @media (max-width: 600px) {
                    .table-grid, .practice-grid {
                        grid-template-columns: 1fr;
                    }

                    .question-num { font-size: var(--text-2xl); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default MultiplicationTable;
