import { useState, useEffect, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const WordCounter = () => {
    const [text, setText] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [wordGoal, setWordGoal] = useState(500);
    const [charGoal, setCharGoal] = useState(2000);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'word-counter').slice(0, 3);

    // Basic stats
    const stats = useMemo(() => {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
        const readingTime = Math.ceil(words / 200);
        const speakingTime = Math.ceil(words / 150);
        return { words, chars, charsNoSpace, sentences, paragraphs, readingTime, speakingTime };
    }, [text]);

    // Readability scores using Flesch-Kincaid
    const readability = useMemo(() => {
        if (stats.words < 10 || stats.sentences === 0) return null;

        const words = text.trim().split(/\s+/).filter(w => w);

        // Count syllables (approximation)
        const countSyllables = (word) => {
            word = word.toLowerCase().replace(/[^a-z]/g, '');
            if (word.length <= 3) return 1;
            word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            const matches = word.match(/[aeiouy]{1,2}/g);
            return matches ? matches.length : 1;
        };

        const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
        const avgSyllablesPerWord = totalSyllables / words.length;
        const avgWordsPerSentence = words.length / stats.sentences;

        // Flesch Reading Ease (0-100, higher = easier)
        const fleschReadingEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

        // Flesch-Kincaid Grade Level
        const fleschKincaidGrade = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;

        // Determine reading level
        let level = '';
        let color = '';
        if (fleschReadingEase >= 90) { level = 'Very Easy'; color = '#22c55e'; }
        else if (fleschReadingEase >= 80) { level = 'Easy'; color = '#84cc16'; }
        else if (fleschReadingEase >= 70) { level = 'Fairly Easy'; color = '#eab308'; }
        else if (fleschReadingEase >= 60) { level = 'Standard'; color = '#f59e0b'; }
        else if (fleschReadingEase >= 50) { level = 'Fairly Difficult'; color = '#f97316'; }
        else if (fleschReadingEase >= 30) { level = 'Difficult'; color = '#ef4444'; }
        else { level = 'Very Difficult'; color = '#dc2626'; }

        return {
            fleschReadingEase: Math.max(0, Math.min(100, Math.round(fleschReadingEase))),
            fleschKincaidGrade: Math.max(0, Math.round(fleschKincaidGrade * 10) / 10),
            avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
            level,
            color,
            totalSyllables
        };
    }, [text, stats]);

    // Keyword density analysis
    const keywordDensity = useMemo(() => {
        if (stats.words < 5) return [];

        const words = text.toLowerCase()
            .replace(/[^a-zA-Z\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2); // Ignore short words

        // Common stop words to exclude
        const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'were', 'they', 'their', 'what', 'when', 'where', 'which', 'with', 'this', 'that', 'from', 'will', 'would', 'there', 'about', 'into', 'more', 'some', 'than', 'them', 'then', 'these', 'only', 'other']);

        const wordCount = {};
        words.forEach(word => {
            if (!stopWords.has(word)) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });

        return Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, count]) => ({
                word,
                count,
                percentage: Math.round((count / stats.words) * 1000) / 10
            }));
    }, [text, stats.words]);

    const faqs = [
        { question: 'How is reading time calculated?', answer: 'Based on average reading speed of 200 words per minute. Actual time may vary based on content complexity.' },
        { question: 'What is Flesch Reading Ease?', answer: 'A score from 0-100 indicating how easy text is to read. Higher scores mean easier reading. 60-70 is considered standard.' },
        { question: 'What is Flesch-Kincaid Grade Level?', answer: 'Indicates the U.S. school grade level needed to understand the text. Grade 8 means an 8th grader can understand it.' }
    ];

    const seoContent = (<><h2>Word Counter Pro</h2><p>Count words, characters, sentences, and paragraphs. Get readability scores, keyword density analysis, and writing goals. Perfect for writers, students, and SEO professionals.</p></>);

    const wordProgress = wordGoal > 0 ? Math.min(100, (stats.words / wordGoal) * 100) : 0;
    const charProgress = charGoal > 0 ? Math.min(100, (stats.chars / charGoal) * 100) : 0;

    const exportReport = () => {
        let report = `Word Count Analysis Report
${'='.repeat(50)}

BASIC STATISTICS
Words: ${stats.words}
Characters: ${stats.chars}
Characters (no spaces): ${stats.charsNoSpace}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading Time: ${stats.readingTime} min
Speaking Time: ${stats.speakingTime} min
`;

        if (readability) {
            report += `
READABILITY ANALYSIS
Flesch Reading Ease: ${readability.fleschReadingEase}/100 (${readability.level})
Flesch-Kincaid Grade: ${readability.fleschKincaidGrade}
Average Syllables/Word: ${readability.avgSyllablesPerWord}
Average Words/Sentence: ${readability.avgWordsPerSentence}
Total Syllables: ${readability.totalSyllables}
`;
        }

        if (keywordDensity.length > 0) {
            report += `
TOP KEYWORDS
${keywordDensity.map((k, i) => `${i + 1}. "${k.word}" - ${k.count} times (${k.percentage}%)`).join('\n')}
`;
        }

        report += `
${'='.repeat(50)}
ORIGINAL TEXT:
${text}`;

        return report;
    };

    return (
        <ToolLayout title="Word Counter Pro" description="Count words, characters, sentences, and paragraphs. Get readability scores and keyword density." keywords={['word counter', 'character counter', 'readability score', 'keyword density', 'flesch kincaid']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Enter your text</label>
                    <div className="input-actions">
                        <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                    </div>
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Type or paste your text here..." />

                {/* Primary Stats Grid */}
                <div className="stats-grid primary">
                    <div className="stat hero">
                        <span className="stat-value">{stats.words}</span>
                        <span className="stat-label">Words</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.chars}</span>
                        <span className="stat-label">Characters</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.charsNoSpace}</span>
                        <span className="stat-label">No Spaces</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.sentences}</span>
                        <span className="stat-label">Sentences</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.paragraphs}</span>
                        <span className="stat-label">Paragraphs</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.readingTime}</span>
                        <span className="stat-label">Min Read</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{stats.speakingTime}</span>
                        <span className="stat-label">Min Speak</span>
                    </div>
                </div>

                {/* Readability Section */}
                {readability && (
                    <div className="readability-section">
                        <h3 className="section-title">📊 Readability Analysis</h3>
                        <div className="readability-grid">
                            <div className="readability-score main">
                                <div className="score-circle" style={{ borderColor: readability.color }}>
                                    <span className="score-value" style={{ color: readability.color }}>
                                        {readability.fleschReadingEase}
                                    </span>
                                </div>
                                <div className="score-info">
                                    <span className="score-label">Flesch Reading Ease</span>
                                    <span className="score-level" style={{ color: readability.color }}>{readability.level}</span>
                                </div>
                            </div>
                            <div className="readability-stat">
                                <span className="stat-value">{readability.fleschKincaidGrade}</span>
                                <span className="stat-label">Grade Level</span>
                                <span className="stat-hint">U.S. school grade needed</span>
                            </div>
                            <div className="readability-stat">
                                <span className="stat-value">{readability.avgWordsPerSentence}</span>
                                <span className="stat-label">Words/Sentence</span>
                                <span className="stat-hint">{readability.avgWordsPerSentence > 20 ? 'Consider shorter sentences' : 'Good length'}</span>
                            </div>
                            <div className="readability-stat">
                                <span className="stat-value">{readability.avgSyllablesPerWord}</span>
                                <span className="stat-label">Syllables/Word</span>
                                <span className="stat-hint">{readability.avgSyllablesPerWord > 1.6 ? 'Using complex words' : 'Simple vocabulary'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Keyword Density Section */}
                {keywordDensity.length > 0 && (
                    <div className="keywords-section">
                        <h3 className="section-title">🔑 Top Keywords</h3>
                        <div className="keywords-grid">
                            {keywordDensity.map((kw, idx) => (
                                <div key={kw.word} className="keyword-item">
                                    <span className="keyword-rank">#{idx + 1}</span>
                                    <span className="keyword-word">{kw.word}</span>
                                    <div className="keyword-stats">
                                        <span className="keyword-count">{kw.count}x</span>
                                        <span className="keyword-percent">{kw.percentage}%</span>
                                    </div>
                                    <div className="keyword-bar">
                                        <div className="keyword-fill" style={{ width: `${Math.min(100, kw.percentage * 10)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Writing Goals Section */}
                <div className="goals-section">
                    <button className="toggle-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                        {showAdvanced ? '▼' : '▶'} Writing Goals
                    </button>
                    {showAdvanced && (
                        <div className="goals-content">
                            <div className="goal-row">
                                <div className="goal-inputs">
                                    <label>Word Goal:</label>
                                    <input type="number" value={wordGoal} onChange={(e) => setWordGoal(Number(e.target.value))} min="0" />
                                </div>
                                <div className="goal-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${wordProgress}%`,
                                                background: wordProgress >= 100 ? '#22c55e' : '#3b82f6'
                                            }}
                                        />
                                    </div>
                                    <span className="progress-text">
                                        {stats.words} / {wordGoal} ({Math.round(wordProgress)}%)
                                    </span>
                                </div>
                            </div>
                            <div className="goal-row">
                                <div className="goal-inputs">
                                    <label>Character Goal:</label>
                                    <input type="number" value={charGoal} onChange={(e) => setCharGoal(Number(e.target.value))} min="0" />
                                </div>
                                <div className="goal-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${charProgress}%`,
                                                background: charProgress >= 100 ? '#22c55e' : '#3b82f6'
                                            }}
                                        />
                                    </div>
                                    <span className="progress-text">
                                        {stats.chars} / {charGoal} ({Math.round(charProgress)}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Export Actions */}
                {text && (
                    <div className="export-actions">
                        <CopyButton text={text} label="Copy Text" size="sm" />
                        <DownloadButton content={text} filename="text-content.txt" label="Download Text" size="sm" />
                        <DownloadButton content={exportReport()} filename="word-count-report.txt" label="Export Full Report" size="sm" />
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 800px; margin: 0 auto; }
                .input-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .input-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .form-input {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-size: var(--text-base);
                    resize: vertical;
                    transition: border-color 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                
                /* Primary Stats Grid */
                .stats-grid.primary {
                    display: grid;
                    grid-template-columns: 2fr repeat(6, 1fr);
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-lg);
                }
                .stat {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    text-align: center;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .stat:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .stat.hero {
                    background: linear-gradient(135deg, #485696, #3d4a7a);
                    color: white;
                }
                .stat.hero .stat-value { color: white; font-size: var(--text-4xl); }
                .stat.hero .stat-label { color: rgba(255,255,255,0.8); }
                .stat-value {
                    display: block;
                    font-size: var(--text-xl);
                    font-weight: 700;
                    color: var(--yinmn-blue);
                }
                .stat-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                
                /* Readability Section */
                .readability-section, .keywords-section, .goals-section {
                    margin-top: var(--spacing-xl);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    padding: var(--spacing-lg);
                }
                .section-title {
                    margin: 0 0 var(--spacing-md) 0;
                    font-size: var(--text-lg);
                    color: var(--text-primary);
                }
                .readability-grid {
                    display: grid;
                    grid-template-columns: 2fr repeat(3, 1fr);
                    gap: var(--spacing-md);
                    align-items: center;
                }
                .readability-score.main {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }
                .score-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 4px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                }
                .score-value {
                    font-size: var(--text-2xl);
                    font-weight: 700;
                }
                .score-info {
                    display: flex;
                    flex-direction: column;
                }
                .score-label {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }
                .score-level {
                    font-size: var(--text-lg);
                    font-weight: 600;
                }
                .readability-stat {
                    text-align: center;
                    background: white;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                }
                .stat-hint {
                    display: block;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-top: var(--spacing-xs);
                }
                
                /* Keywords Section */
                .keywords-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--spacing-sm);
                }
                .keyword-item {
                    display: grid;
                    grid-template-columns: 30px 1fr auto;
                    gap: var(--spacing-sm);
                    align-items: center;
                    padding: var(--spacing-sm);
                    background: white;
                    border-radius: var(--radius);
                }
                .keyword-rank {
                    color: var(--text-muted);
                    font-size: var(--text-sm);
                }
                .keyword-word {
                    font-weight: 600;
                }
                .keyword-stats {
                    display: flex;
                    gap: var(--spacing-sm);
                    font-size: var(--text-sm);
                }
                .keyword-count { color: var(--yinmn-blue); }
                .keyword-percent { color: var(--text-muted); }
                .keyword-bar {
                    grid-column: 1 / -1;
                    height: 4px;
                    background: var(--platinum);
                    border-radius: 2px;
                    overflow: hidden;
                }
                .keyword-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #485696, #6366f1);
                    transition: width 0.3s;
                }
                
                /* Goals Section */
                .toggle-btn {
                    background: none;
                    border: none;
                    font-size: var(--text-base);
                    font-weight: 600;
                    cursor: pointer;
                    color: var(--text-primary);
                    padding: 0;
                }
                .goals-content {
                    margin-top: var(--spacing-md);
                }
                .goal-row {
                    display: grid;
                    grid-template-columns: 200px 1fr;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-md);
                    align-items: center;
                }
                .goal-inputs {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .goal-inputs input {
                    width: 100px;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border: 1px solid var(--platinum);
                    border-radius: var(--radius);
                }
                .goal-progress {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }
                .progress-bar {
                    flex: 1;
                    height: 12px;
                    background: var(--platinum);
                    border-radius: 6px;
                    overflow: hidden;
                }
                .progress-fill {
                    height: 100%;
                    transition: width 0.3s, background 0.3s;
                }
                .progress-text {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    min-width: 120px;
                }
                
                /* Export Actions */
                .export-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                    margin-top: var(--spacing-lg);
                    flex-wrap: wrap;
                }
                
                @media(max-width:768px) {
                    .stats-grid.primary { grid-template-columns: repeat(4, 1fr); }
                    .stat.hero { grid-column: span 2; }
                    .readability-grid { grid-template-columns: 1fr; }
                    .keywords-grid { grid-template-columns: 1fr; }
                    .goal-row { grid-template-columns: 1fr; }
                }
                @media(max-width:480px) {
                    .stats-grid.primary { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default WordCounter;
