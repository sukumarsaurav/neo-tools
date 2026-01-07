import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const ReadabilityChecker = () => {
    const toast = useToast();
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'readability-checker').slice(0, 3);

    const analyzeReadability = () => {
        if (!text.trim()) { toast.warning('Please enter text to analyze'); return; }

        const cleanText = text.trim();

        // Word count
        const words = cleanText.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        if (wordCount < 10) { toast.warning('Please enter at least 10 words for accurate analysis'); return; }

        // Sentence count
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const sentenceCount = sentences.length;

        // Syllable count
        const countSyllables = (word) => {
            word = word.toLowerCase().replace(/[^a-z]/g, '');
            if (word.length <= 3) return 1;
            word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            const matches = word.match(/[aeiouy]{1,2}/g);
            return matches ? matches.length : 1;
        };
        const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

        // Character count (without spaces)
        const charCount = cleanText.replace(/\s/g, '').length;

        // Paragraph count
        const paragraphs = cleanText.split(/\n\n+/).filter(p => p.trim().length > 0);

        // Complex words (3+ syllables)
        const complexWords = words.filter(w => countSyllables(w) >= 3);

        // Average values
        const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
        const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;

        // Flesch Reading Ease
        const fleschEase = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        const fleschClamped = Math.max(0, Math.min(100, fleschEase));

        // Flesch-Kincaid Grade Level
        const fleschKincaid = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
        const gradeLevel = Math.max(0, Math.round(fleschKincaid * 10) / 10);

        // Gunning Fog Index
        const fogIndex = 0.4 * (avgWordsPerSentence + (100 * complexWords.length / wordCount));

        // SMOG Index
        const smog = 1.043 * Math.sqrt(complexWords.length * (30 / sentenceCount)) + 3.1291;

        // Coleman-Liau Index
        const L = (charCount / wordCount) * 100;
        const S = (sentenceCount / wordCount) * 100;
        const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;

        // Reading time (200 WPM)
        const readingTime = Math.ceil(wordCount / 200);

        // Determine reading level
        const getReadingLevel = (score) => {
            if (score >= 90) return { level: '5th Grade', audience: 'Very Easy to Read', color: '#28a745' };
            if (score >= 80) return { level: '6th Grade', audience: 'Easy to Read', color: '#28a745' };
            if (score >= 70) return { level: '7th Grade', audience: 'Fairly Easy', color: '#20c997' };
            if (score >= 60) return { level: '8th-9th Grade', audience: 'Plain English', color: '#17a2b8' };
            if (score >= 50) return { level: '10th-12th Grade', audience: 'Fairly Difficult', color: '#ffc107' };
            if (score >= 30) return { level: 'College', audience: 'Difficult', color: '#fd7e14' };
            return { level: 'Graduate', audience: 'Very Difficult', color: '#dc3545' };
        };

        const readingLevel = getReadingLevel(fleschClamped);

        // Suggestions
        const suggestions = [];
        if (avgWordsPerSentence > 20) {
            suggestions.push({ type: 'warning', text: `Average sentence length is ${Math.round(avgWordsPerSentence)} words. Try to keep it under 20 for better readability.` });
        }
        if (avgSyllablesPerWord > 1.7) {
            suggestions.push({ type: 'info', text: 'Consider using simpler words with fewer syllables where possible.' });
        }
        if (complexWords.length / wordCount > 0.15) {
            suggestions.push({ type: 'warning', text: `${Math.round(complexWords.length / wordCount * 100)}% of words are complex (3+ syllables). Consider simplifying.` });
        }
        if (paragraphs.length === 1 && wordCount > 100) {
            suggestions.push({ type: 'info', text: 'Consider breaking content into multiple paragraphs for easier reading.' });
        }
        if (fleschClamped < 50) {
            suggestions.push({ type: 'warning', text: 'Content may be too difficult for general audiences. Simplify if targeting a broad audience.' });
        }

        setAnalysis({
            wordCount,
            sentenceCount,
            syllableCount,
            charCount,
            paragraphCount: paragraphs.length,
            complexWordCount: complexWords.length,
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
            avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
            fleschEase: Math.round(fleschClamped * 10) / 10,
            gradeLevel,
            fogIndex: Math.round(fogIndex * 10) / 10,
            smog: Math.round(smog * 10) / 10,
            colemanLiau: Math.round(colemanLiau * 10) / 10,
            readingTime,
            readingLevel,
            suggestions
        });
    };

    const faqs = [
        { question: 'What is Flesch Reading Ease?', answer: 'A score from 0-100 measuring how easy text is to read. Higher scores mean easier reading. 60-70 is considered plain English suitable for most audiences.' },
        { question: 'What is Flesch-Kincaid Grade Level?', answer: 'Indicates the U.S. school grade level required to understand the text. For example, 8.0 means an 8th grader could understand it.' },
        { question: 'What score should I aim for?', answer: 'For web content targeting general audiences, aim for Flesch Reading Ease of 60+ (8th grade level or below). Technical content may naturally score lower.' }
    ];

    const seoContent = (<><h2>Readability Checker</h2><p>Analyze your content's readability using multiple algorithms including Flesch-Kincaid, Gunning Fog, SMOG, and Coleman-Liau indexes.</p></>);

    return (
        <ToolLayout title="Readability Checker" description="Analyze content readability with Flesch-Kincaid, Gunning Fog, SMOG, and more. Get grade level and improvement suggestions." keywords={['readability checker', 'Flesch-Kincaid', 'reading level', 'content readability']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group">
                    <label className="form-label">Enter Your Content</label>
                    <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste your article, blog post, or any text content here..." />
                    <div className="char-count">{text.length} characters | ~{text.split(/\s+/).filter(w => w).length} words</div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={analyzeReadability}>📊 Analyze Readability</button>

                {analysis && (
                    <div className="analysis-output">
                        {/* Main Score Card */}
                        <div className="main-score" style={{ borderColor: analysis.readingLevel.color }}>
                            <div className="score-value" style={{ color: analysis.readingLevel.color }}>{analysis.fleschEase}</div>
                            <div className="score-label">Flesch Reading Ease</div>
                            <div className="reading-level">{analysis.readingLevel.level}</div>
                            <div className="audience">{analysis.readingLevel.audience}</div>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-grid">
                            <div className="stat"><span className="stat-value">{analysis.wordCount}</span><span className="stat-label">Words</span></div>
                            <div className="stat"><span className="stat-value">{analysis.sentenceCount}</span><span className="stat-label">Sentences</span></div>
                            <div className="stat"><span className="stat-value">{analysis.paragraphCount}</span><span className="stat-label">Paragraphs</span></div>
                            <div className="stat"><span className="stat-value">{analysis.readingTime} min</span><span className="stat-label">Read Time</span></div>
                        </div>

                        {/* Readability Scores */}
                        <div className="scores-section">
                            <h4>📈 Readability Scores</h4>
                            <div className="scores-grid">
                                <div className="score-card">
                                    <span className="score-name">Flesch-Kincaid Grade</span>
                                    <span className="score-num">{analysis.gradeLevel}</span>
                                </div>
                                <div className="score-card">
                                    <span className="score-name">Gunning Fog Index</span>
                                    <span className="score-num">{analysis.fogIndex}</span>
                                </div>
                                <div className="score-card">
                                    <span className="score-name">SMOG Index</span>
                                    <span className="score-num">{analysis.smog}</span>
                                </div>
                                <div className="score-card">
                                    <span className="score-name">Coleman-Liau Index</span>
                                    <span className="score-num">{analysis.colemanLiau}</span>
                                </div>
                            </div>
                        </div>

                        {/* Text Statistics */}
                        <div className="stats-section">
                            <h4>📋 Text Statistics</h4>
                            <div className="stats-list">
                                <div className="stat-row"><span>Average words per sentence</span><span>{analysis.avgWordsPerSentence}</span></div>
                                <div className="stat-row"><span>Average syllables per word</span><span>{analysis.avgSyllablesPerWord}</span></div>
                                <div className="stat-row"><span>Complex words (3+ syllables)</span><span>{analysis.complexWordCount} ({Math.round(analysis.complexWordCount / analysis.wordCount * 100)}%)</span></div>
                                <div className="stat-row"><span>Characters (no spaces)</span><span>{analysis.charCount}</span></div>
                            </div>
                        </div>

                        {/* Suggestions */}
                        {analysis.suggestions.length > 0 && (
                            <div className="suggestions-section">
                                <h4>💡 Improvement Suggestions</h4>
                                <div className="suggestions-list">
                                    {analysis.suggestions.map((s, i) => (
                                        <div key={i} className={`suggestion ${s.type}`}>
                                            <span>{s.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                                            <span>{s.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);line-height:1.6}
                .char-count{text-align:right;font-size:var(--text-sm);color:var(--text-muted);margin-top:4px}
                .analysis-output{margin-top:var(--spacing-lg)}
                .main-score{text-align:center;padding:var(--spacing-xl);border:4px solid;border-radius:var(--radius);background:white;margin-bottom:var(--spacing-lg)}
                .score-value{font-size:4rem;font-weight:800;line-height:1}
                .score-label{color:var(--text-muted);margin-top:var(--spacing-xs)}
                .reading-level{font-size:1.5rem;font-weight:600;margin-top:var(--spacing-sm)}
                .audience{color:var(--text-muted)}
                .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}
                .stat{text-align:center;padding:var(--spacing-md);background:var(--bg-secondary);border-radius:var(--radius)}
                .stat-value{display:block;font-size:1.5rem;font-weight:700;color:var(--yinmn-blue)}
                .stat-label{font-size:var(--text-sm);color:var(--text-muted)}
                .scores-section,.stats-section,.suggestions-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .scores-section h4,.stats-section h4,.suggestions-section h4{margin:0 0 var(--spacing-md) 0}
                .scores-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--spacing-md)}
                .score-card{background:white;padding:var(--spacing-md);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center}
                .score-name{font-weight:500}
                .score-num{font-size:1.25rem;font-weight:700;color:var(--yinmn-blue)}
                .stats-list{display:flex;flex-direction:column;gap:var(--spacing-sm)}
                .stat-row{background:white;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);display:flex;justify-content:space-between}
                .suggestions-list{display:flex;flex-direction:column;gap:var(--spacing-sm)}
                .suggestion{display:flex;align-items:flex-start;gap:var(--spacing-sm);padding:var(--spacing-sm);background:white;border-radius:var(--radius);border-left:3px solid}
                .suggestion.warning{border-color:#ffc107}
                .suggestion.info{border-color:#17a2b8}
                @media(max-width:600px){.stats-grid{grid-template-columns:repeat(2,1fr)}.scores-grid{grid-template-columns:1fr}}
            `}</style>
        </ToolLayout>
    );
};

export default ReadabilityChecker;
