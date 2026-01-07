import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

// Common stop words to filter
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you',
    'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
    'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here',
    'there', 'then', 'if', 'into', 'about', 'up', 'out', 'any', 'over', 'even'
]);

const KeywordDensity = () => {
    const toast = useToast();
    const [text, setText] = useState('');
    const [targetKeyword, setTargetKeyword] = useState('');
    const [filterStopWords, setFilterStopWords] = useState(true);
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'keyword-density').slice(0, 3);

    // Get density status for color coding
    const getDensityStatus = (density) => {
        const d = parseFloat(density);
        if (d >= 1 && d <= 2) return 'optimal';
        if (d > 2 && d <= 3) return 'warning';
        if (d > 3) return 'danger';
        return 'low';
    };

    // Generate n-grams from words array
    const getNgrams = (words, n) => {
        const ngrams = {};
        for (let i = 0; i <= words.length - n; i++) {
            const ngram = words.slice(i, i + n).join(' ');
            ngrams[ngram] = (ngrams[ngram] || 0) + 1;
        }
        return Object.entries(ngrams)
            .filter(([, count]) => count > 1) // Only phrases appearing more than once
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    };

    const analyze = () => {
        if (!text.trim()) { toast.warning('Please enter some text'); return; }

        // Clean and tokenize
        const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
        let words = cleanText.split(/\s+/).filter(w => w.length > 2);
        const totalWords = words.length;

        // Filter stop words if enabled
        const filteredWords = filterStopWords
            ? words.filter(w => !STOP_WORDS.has(w))
            : words;

        // Single word frequency
        const freq = {};
        filteredWords.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 15);
        const keywords = sorted.map(([word, count]) => ({
            word,
            count,
            density: ((count / totalWords) * 100).toFixed(2)
        }));

        // N-grams (use all words for context)
        const bigrams = getNgrams(words, 2);
        const trigrams = getNgrams(words, 3);

        // Target keyword analysis
        let targetAnalysis = null;
        if (targetKeyword.trim()) {
            const targetLower = targetKeyword.toLowerCase().trim();
            const targetRegex = new RegExp(targetLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const targetCount = (text.match(targetRegex) || []).length;
            const targetDensity = ((targetCount / totalWords) * 100).toFixed(2);
            targetAnalysis = {
                keyword: targetKeyword.trim(),
                count: targetCount,
                density: targetDensity,
                status: getDensityStatus(targetDensity)
            };
        }

        setResult({
            totalWords,
            uniqueWords: Object.keys(freq).length,
            keywords,
            bigrams: bigrams.map(([phrase, count]) => ({ phrase, count, density: ((count / totalWords) * 100).toFixed(2) })),
            trigrams: trigrams.map(([phrase, count]) => ({ phrase, count, density: ((count / totalWords) * 100).toFixed(2) })),
            targetAnalysis
        });
    };

    const faqs = [
        { question: 'What is keyword density?', answer: 'Keyword density is the percentage of times a keyword appears in text compared to total words. Formula: (Keyword Count / Total Words) × 100.' },
        { question: 'What is optimal keyword density?', answer: 'Generally 1-2% is considered optimal. Higher density may seem spammy to search engines, while lower may not signal relevance.' },
        { question: 'What are stop words?', answer: 'Stop words are common words like "the", "a", "and", etc. that are often filtered out because they don\'t carry meaningful content.' }
    ];

    const seoContent = (<><h2>Keyword Density Checker</h2><p>Analyze keyword density in your content. Find the most frequently used words and phrases with stop word filtering for more accurate SEO analysis.</p></>);

    return (
        <ToolLayout title="Keyword Density Checker" description="Analyze keyword density and word frequency in your content for SEO optimization." keywords={['keyword density', 'keyword checker', 'SEO analyzer', 'word frequency']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group">
                    <label className="form-label">Target Keyword (optional)</label>
                    <input type="text" className="form-input" value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} placeholder="e.g., content marketing" />
                </div>
                <div className="form-group">
                    <label className="form-label">Enter your content</label>
                    <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste your article or page content here..." />
                    <div className="char-count">{text.length} characters</div>
                </div>
                <div className="options-row">
                    <label className="checkbox-label">
                        <input type="checkbox" checked={filterStopWords} onChange={(e) => setFilterStopWords(e.target.checked)} />
                        Filter stop words (the, a, and, etc.)
                    </label>
                </div>
                <button className="btn btn-primary btn-lg" onClick={analyze}>🔍 Analyze</button>

                {result && (
                    <div className="result-box">
                        {/* Stats Summary */}
                        <div className="stats-grid">
                            <div className="stat-card"><span className="stat-value">{result.totalWords}</span><span className="stat-label">Total Words</span></div>
                            <div className="stat-card"><span className="stat-value">{result.uniqueWords}</span><span className="stat-label">Unique Words</span></div>
                        </div>

                        {/* Target Keyword Analysis */}
                        {result.targetAnalysis && (
                            <div className={`target-box ${result.targetAnalysis.status}`}>
                                <h4>🎯 Target Keyword Analysis</h4>
                                <div className="target-stats">
                                    <span>"{result.targetAnalysis.keyword}"</span>
                                    <span>Appears <strong>{result.targetAnalysis.count}</strong> times</span>
                                    <span className={`density-badge ${result.targetAnalysis.status}`}>
                                        {result.targetAnalysis.density}% density
                                    </span>
                                </div>
                                <div className="density-feedback">
                                    {result.targetAnalysis.status === 'optimal' && '✅ Optimal density (1-2%)'}
                                    {result.targetAnalysis.status === 'warning' && '⚠️ Slightly high (2-3%)'}
                                    {result.targetAnalysis.status === 'danger' && '🔴 Over-optimized (>3%)'}
                                    {result.targetAnalysis.status === 'low' && '📉 Low density (<1%)'}
                                </div>
                            </div>
                        )}

                        {/* Single Keywords */}
                        <div className="section">
                            <h4>📊 Top Single Keywords</h4>
                            <div className="keywords-table">
                                <div className="table-header"><span>Keyword</span><span>Count</span><span>Density</span></div>
                                {result.keywords.map((k, i) => (
                                    <div key={i} className="table-row">
                                        <span>{k.word}</span>
                                        <span>{k.count}</span>
                                        <span className={getDensityStatus(k.density)}>{k.density}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bigrams */}
                        {result.bigrams.length > 0 && (
                            <div className="section">
                                <h4>📝 Two-Word Phrases (Bigrams)</h4>
                                <div className="keywords-table">
                                    <div className="table-header"><span>Phrase</span><span>Count</span><span>Density</span></div>
                                    {result.bigrams.map((k, i) => (
                                        <div key={i} className="table-row">
                                            <span>{k.phrase}</span>
                                            <span>{k.count}</span>
                                            <span>{k.density}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trigrams */}
                        {result.trigrams.length > 0 && (
                            <div className="section">
                                <h4>📋 Three-Word Phrases (Trigrams)</h4>
                                <div className="keywords-table">
                                    <div className="table-header"><span>Phrase</span><span>Count</span><span>Density</span></div>
                                    {result.trigrams.map((k, i) => (
                                        <div key={i} className="table-row">
                                            <span>{k.phrase}</span>
                                            <span>{k.count}</span>
                                            <span>{k.density}%</span>
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
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}
                .char-count{text-align:right;font-size:var(--text-sm);color:var(--text-muted);margin-top:4px}
                .options-row{display:flex;gap:var(--spacing-lg);margin-bottom:var(--spacing-lg)}
                .checkbox-label{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer}
                .stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}
                .stat-card{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);text-align:center}
                .stat-value{display:block;font-size:2rem;font-weight:700;color:var(--yinmn-blue)}
                .stat-label{font-size:var(--text-sm);color:var(--text-muted)}
                .target-box{padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg);border-left:4px solid}
                .target-box.optimal{background:#28a74515;border-color:#28a745}
                .target-box.warning{background:#ffc10715;border-color:#ffc107}
                .target-box.danger{background:#dc354515;border-color:#dc3545}
                .target-box.low{background:#17a2b815;border-color:#17a2b8}
                .target-box h4{margin:0 0 var(--spacing-sm) 0}
                .target-stats{display:flex;flex-wrap:wrap;gap:var(--spacing-md);align-items:center;margin-bottom:var(--spacing-sm)}
                .density-badge{padding:4px 10px;border-radius:20px;font-weight:600;font-size:var(--text-sm)}
                .density-badge.optimal{background:#28a745;color:white}
                .density-badge.warning{background:#ffc107;color:#333}
                .density-badge.danger{background:#dc3545;color:white}
                .density-badge.low{background:#17a2b8;color:white}
                .density-feedback{font-size:var(--text-sm)}
                .section{margin-bottom:var(--spacing-lg)}
                .section h4{margin-bottom:var(--spacing-sm)}
                .keywords-table{background:var(--bg-secondary);border-radius:var(--radius);overflow:hidden}
                .table-header,.table-row{display:grid;grid-template-columns:2fr 1fr 1fr;padding:var(--spacing-sm) var(--spacing-md)}
                .table-header{background:var(--yinmn-blue);color:white;font-weight:600}
                .table-row:nth-child(even){background:var(--bg-primary)}
                .optimal{color:#28a745;font-weight:600}
                .warning{color:#ffc107;font-weight:600}
                .danger{color:#dc3545;font-weight:600}
                .low{color:#17a2b8;font-weight:600}
                @media(max-width:600px){.stats-grid{grid-template-columns:1fr}}
            `}</style>
        </ToolLayout>
    );
};

export default KeywordDensity;

