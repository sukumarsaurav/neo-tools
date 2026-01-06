import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const SentenceCounter = () => {
    const [text, setText] = useState('');
    const [showAll, setShowAll] = useState(false);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'sentence-counter').slice(0, 3);

    const analysis = useMemo(() => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const totalWords = text.split(/\s+/).filter(w => w).length;
        const avgWords = sentences.length > 0 ? Math.round(totalWords / sentences.length) : 0;

        const sentenceData = sentences.map((s, idx) => {
            const words = s.trim().split(/\s+/).filter(w => w).length;
            return {
                index: idx + 1,
                text: s.trim(),
                words
            };
        });

        // Find longest and shortest
        const sorted = [...sentenceData].sort((a, b) => b.words - a.words);
        const longest = sorted[0];
        const shortest = sorted[sorted.length - 1];

        // Readability indicator
        let readability = 'Good';
        if (avgWords > 25) readability = 'Complex';
        else if (avgWords > 20) readability = 'Moderate';
        else if (avgWords < 10) readability = 'Simple';

        return {
            count: sentences.length,
            avgWords,
            sentences: sentenceData,
            longest,
            shortest,
            readability
        };
    }, [text]);

    const exportReport = () => {
        const report = `Sentence Analysis Report
${'='.repeat(50)}

Total Sentences: ${analysis.count}
Average Words per Sentence: ${analysis.avgWords}
Readability: ${analysis.readability}

${analysis.longest ? `Longest Sentence (${analysis.longest.words} words):
"${analysis.longest.text}"` : ''}

${analysis.shortest ? `Shortest Sentence (${analysis.shortest.words} words):
"${analysis.shortest.text}"` : ''}

${'='.repeat(50)}
Sentence Breakdown:
${analysis.sentences.map(s => `${s.index}. [${s.words} words] ${s.text}`).join('\n')}
`;
        return report;
    };

    const faqs = [
        { question: 'What defines a sentence?', answer: 'A sentence is text ending with period (.), question mark (?), or exclamation mark (!). Multiple punctuation is treated as one ending.' },
        { question: 'What is ideal sentence length?', answer: 'For readability, 15-20 words per sentence is ideal. Vary lengths for better flow. Long sentences can be hard to read.' }
    ];

    const seoContent = (<><h2>Sentence Counter</h2><p>Count sentences in your text and analyze average sentence length. Useful for improving readability and writing clarity.</p></>);

    const displayedSentences = showAll ? analysis.sentences : analysis.sentences.slice(0, 10);

    return (
        <ToolLayout title="Sentence Counter" description="Count sentences and analyze average sentence length for better readability." keywords={['sentence counter', 'sentence length', 'readability analyzer', 'writing tool']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Enter your text</label>
                    <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Type or paste your text here..." />

                <div className="stats-grid">
                    <div className="stat primary">
                        <span className="stat-value">{analysis.count}</span>
                        <span className="stat-label">Sentences</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{analysis.avgWords}</span>
                        <span className="stat-label">Avg words/sentence</span>
                    </div>
                    <div className={`stat readability-${analysis.readability.toLowerCase()}`}>
                        <span className="stat-value">{analysis.readability}</span>
                        <span className="stat-label">Readability</span>
                    </div>
                </div>

                {analysis.longest && analysis.shortest && (
                    <div className="extremes-grid">
                        <div className="extreme-card longest">
                            <div className="extreme-header">
                                <span className="extreme-icon">📏</span>
                                <span className="extreme-title">Longest ({analysis.longest.words} words)</span>
                            </div>
                            <p className="extreme-text">"{analysis.longest.text.substring(0, 100)}{analysis.longest.text.length > 100 ? '...' : ''}"</p>
                        </div>
                        <div className="extreme-card shortest">
                            <div className="extreme-header">
                                <span className="extreme-icon">📌</span>
                                <span className="extreme-title">Shortest ({analysis.shortest.words} words)</span>
                            </div>
                            <p className="extreme-text">"{analysis.shortest.text}"</p>
                        </div>
                    </div>
                )}

                {analysis.sentences.length > 0 && (
                    <div className="breakdown-section">
                        <div className="section-header">
                            <h4 className="section-title">Sentence Breakdown</h4>
                            <div className="section-actions">
                                <DownloadButton content={exportReport()} filename="sentence-analysis.txt" label="Export" size="sm" />
                            </div>
                        </div>
                        <div className="sentences-list">
                            {displayedSentences.map((s) => (
                                <div key={s.index} className="sentence-item">
                                    <span className="sentence-num">{s.index}.</span>
                                    <span className="sentence-text">{s.text}</span>
                                    <span className={`sentence-count ${s.words > 25 ? 'long' : s.words < 10 ? 'short' : ''}`}>
                                        {s.words} words
                                    </span>
                                </div>
                            ))}
                        </div>
                        {analysis.sentences.length > 10 && (
                            <button className="show-more-btn" onClick={() => setShowAll(!showAll)}>
                                {showAll ? '▲ Show Less' : `▼ Show All (${analysis.sentences.length - 10} more)`}
                            </button>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 700px; margin: 0 auto; }
                .input-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .form-input {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-size: var(--text-base);
                    transition: border-color 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-lg);
                }
                .stat {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    text-align: center;
                }
                .stat.primary {
                    background: linear-gradient(135deg, #485696, #3d4a7a);
                    color: white;
                }
                .stat.primary .stat-value { color: white; }
                .stat.primary .stat-label { color: rgba(255,255,255,0.8); }
                .stat-value {
                    display: block;
                    font-size: var(--text-2xl);
                    font-weight: 700;
                    color: var(--yinmn-blue);
                }
                .stat-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                .stat.readability-simple .stat-value { color: #22c55e; }
                .stat.readability-good .stat-value { color: #3b82f6; }
                .stat.readability-moderate .stat-value { color: #f59e0b; }
                .stat.readability-complex .stat-value { color: #ef4444; }
                
                .extremes-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-lg);
                }
                .extreme-card {
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    border-left: 4px solid;
                }
                .extreme-card.longest {
                    background: #fef3c7;
                    border-color: #f59e0b;
                }
                .extreme-card.shortest {
                    background: #dcfce7;
                    border-color: #22c55e;
                }
                .extreme-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    margin-bottom: var(--spacing-xs);
                }
                .extreme-title {
                    font-weight: 600;
                    font-size: var(--text-sm);
                }
                .extreme-text {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    font-style: italic;
                    margin: 0;
                }
                
                .breakdown-section {
                    margin-top: var(--spacing-xl);
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                }
                .section-title {
                    font-size: var(--text-base);
                    margin: 0;
                }
                .sentences-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }
                .sentence-item {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    gap: var(--spacing-md);
                    padding: var(--spacing-sm);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    font-size: var(--text-sm);
                    align-items: center;
                }
                .sentence-num {
                    color: var(--text-muted);
                    font-weight: 500;
                    min-width: 30px;
                }
                .sentence-text {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .sentence-count {
                    color: var(--yinmn-blue);
                    font-weight: 500;
                    white-space: nowrap;
                }
                .sentence-count.long { color: #f59e0b; }
                .sentence-count.short { color: #22c55e; }
                
                .show-more-btn {
                    width: 100%;
                    padding: var(--spacing-sm);
                    margin-top: var(--spacing-sm);
                    background: transparent;
                    border: 1px dashed var(--platinum);
                    border-radius: var(--radius);
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .show-more-btn:hover {
                    background: var(--bg-secondary);
                    border-color: var(--yinmn-blue);
                    color: var(--yinmn-blue);
                }
                
                @media(max-width: 480px) {
                    .stats-grid { grid-template-columns: 1fr; }
                    .extremes-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default SentenceCounter;
