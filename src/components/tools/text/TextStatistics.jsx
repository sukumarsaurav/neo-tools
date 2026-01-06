import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const TextStatistics = () => {
    const [text, setText] = useState('');
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'text-statistics').slice(0, 3);

    const stats = useMemo(() => {
        if (!text.trim()) return null;

        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const words = text.trim().split(/\s+/).filter(w => w).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
        const lines = text.split('\n').length;

        // Word breakdown
        const allWords = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w);
        const uniqueWords = [...new Set(allWords)].length;

        // Character breakdown
        const letters = (text.match(/[a-zA-Z]/g) || []).length;
        const digits = (text.match(/\d/g) || []).length;
        const spaces = (text.match(/\s/g) || []).length;
        const punctuation = (text.match(/[.,!?;:'"()\-]/g) || []).length;
        const special = chars - letters - digits - spaces - punctuation;

        // Vowels and consonants
        const vowels = (text.toLowerCase().match(/[aeiou]/g) || []).length;
        const consonants = (text.toLowerCase().match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length;

        // Word length distribution
        const wordLengths = allWords.map(w => w.length);
        const avgWordLength = wordLengths.length > 0 ?
            Math.round(wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length * 10) / 10 : 0;
        const shortWords = wordLengths.filter(l => l <= 3).length;
        const mediumWords = wordLengths.filter(l => l > 3 && l <= 6).length;
        const longWords = wordLengths.filter(l => l > 6).length;

        // Longest and shortest word
        const longestWord = allWords.reduce((a, b) => a.length >= b.length ? a : b, '');
        const shortestWord = allWords.reduce((a, b) => a.length <= b.length ? a : b, allWords[0] || '');

        // Most frequent letters
        const letterFreq = {};
        text.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(l => {
            letterFreq[l] = (letterFreq[l] || 0) + 1;
        });
        const topLetters = Object.entries(letterFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([letter, count]) => ({ letter: letter.toUpperCase(), count, percent: Math.round((count / letters) * 1000) / 10 }));

        // Reading estimates
        const readingTime = Math.ceil(words / 200);
        const speakingTime = Math.ceil(words / 150);

        return {
            basic: { chars, charsNoSpace, words, sentences, paragraphs, lines },
            wordStats: { uniqueWords, vocabDensity: words > 0 ? Math.round((uniqueWords / words) * 100) : 0, avgWordLength, shortWords, mediumWords, longWords, longestWord, shortestWord },
            charBreakdown: { letters, digits, spaces, punctuation, special, vowels, consonants },
            topLetters,
            timeEstimates: { readingTime, speakingTime }
        };
    }, [text]);

    const exportReport = () => {
        if (!stats) return '';
        return `Text Statistics Report
${'='.repeat(50)}

BASIC COUNTS
Characters: ${stats.basic.chars}
Characters (no spaces): ${stats.basic.charsNoSpace}
Words: ${stats.basic.words}
Sentences: ${stats.basic.sentences}
Paragraphs: ${stats.basic.paragraphs}
Lines: ${stats.basic.lines}

WORD STATISTICS
Unique Words: ${stats.wordStats.uniqueWords}
Vocabulary Density: ${stats.wordStats.vocabDensity}%
Average Word Length: ${stats.wordStats.avgWordLength} characters
Short Words (≤3 chars): ${stats.wordStats.shortWords}
Medium Words (4-6 chars): ${stats.wordStats.mediumWords}
Long Words (7+ chars): ${stats.wordStats.longWords}
Longest Word: "${stats.wordStats.longestWord}"
Shortest Word: "${stats.wordStats.shortestWord}"

CHARACTER BREAKDOWN
Letters: ${stats.charBreakdown.letters}
Digits: ${stats.charBreakdown.digits}
Spaces: ${stats.charBreakdown.spaces}
Punctuation: ${stats.charBreakdown.punctuation}
Special: ${stats.charBreakdown.special}
Vowels: ${stats.charBreakdown.vowels}
Consonants: ${stats.charBreakdown.consonants}

TOP 5 LETTERS
${stats.topLetters.map((l, i) => `${i + 1}. ${l.letter} - ${l.count} times (${l.percent}%)`).join('\n')}

TIME ESTIMATES
Reading Time: ~${stats.timeEstimates.readingTime} minute(s)
Speaking Time: ~${stats.timeEstimates.speakingTime} minute(s)
`;
    };

    const faqs = [
        { question: 'What is vocabulary density?', answer: 'The ratio of unique words to total words. Higher density (closer to 100%) means more varied vocabulary. Lower density indicates repetitive word use.' },
        { question: 'How accurate are time estimates?', answer: 'Reading time assumes 200 words/minute (average adult). Speaking time uses 150 words/minute (typical presentation pace).' }
    ];

    const seoContent = (<><h2>Text Statistics</h2><p>Get comprehensive text analysis. Word counts, character breakdown, vocabulary density, letter frequency, and more. Perfect for writers and content analysts.</p></>);

    return (
        <ToolLayout title="Text Statistics" description="Get detailed text statistics including word counts, character breakdown, and vocabulary analysis." keywords={['text statistics', 'text analysis', 'word frequency', 'character count', 'vocabulary density']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Paste your text for analysis</label>
                    <div className="header-actions">
                        {stats && <DownloadButton content={exportReport()} filename="text-statistics.txt" label="Export" size="sm" />}
                        <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                    </div>
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste your text here to see comprehensive statistics..." />

                {stats && (
                    <div className="stats-container">
                        {/* Basic Counts */}
                        <div className="stats-section">
                            <h3 className="section-title">📊 Basic Counts</h3>
                            <div className="stats-grid six">
                                <div className="stat hero"><span className="stat-value">{stats.basic.words}</span><span className="stat-label">Words</span></div>
                                <div className="stat"><span className="stat-value">{stats.basic.chars}</span><span className="stat-label">Characters</span></div>
                                <div className="stat"><span className="stat-value">{stats.basic.charsNoSpace}</span><span className="stat-label">No Spaces</span></div>
                                <div className="stat"><span className="stat-value">{stats.basic.sentences}</span><span className="stat-label">Sentences</span></div>
                                <div className="stat"><span className="stat-value">{stats.basic.paragraphs}</span><span className="stat-label">Paragraphs</span></div>
                                <div className="stat"><span className="stat-value">{stats.basic.lines}</span><span className="stat-label">Lines</span></div>
                            </div>
                        </div>

                        {/* Word Statistics */}
                        <div className="stats-section">
                            <h3 className="section-title">📝 Word Analysis</h3>
                            <div className="word-analysis">
                                <div className="vocab-density">
                                    <div className="density-circle" style={{ '--density': stats.wordStats.vocabDensity }}>
                                        <span className="density-value">{stats.wordStats.vocabDensity}%</span>
                                    </div>
                                    <div className="density-info">
                                        <span className="density-label">Vocabulary Density</span>
                                        <span className="density-count">{stats.wordStats.uniqueWords} unique / {stats.basic.words} total</span>
                                    </div>
                                </div>
                                <div className="word-length-dist">
                                    <div className="length-bar">
                                        <div className="length-segment short" style={{ width: `${(stats.wordStats.shortWords / stats.basic.words) * 100}%` }} title={`Short: ${stats.wordStats.shortWords}`} />
                                        <div className="length-segment medium" style={{ width: `${(stats.wordStats.mediumWords / stats.basic.words) * 100}%` }} title={`Medium: ${stats.wordStats.mediumWords}`} />
                                        <div className="length-segment long" style={{ width: `${(stats.wordStats.longWords / stats.basic.words) * 100}%` }} title={`Long: ${stats.wordStats.longWords}`} />
                                    </div>
                                    <div className="length-legend">
                                        <span className="legend-item"><span className="dot short" /> Short (≤3)</span>
                                        <span className="legend-item"><span className="dot medium" /> Medium (4-6)</span>
                                        <span className="legend-item"><span className="dot long" /> Long (7+)</span>
                                    </div>
                                </div>
                                <div className="word-examples">
                                    <div className="example">
                                        <span className="example-label">Longest:</span>
                                        <span className="example-word">{stats.wordStats.longestWord}</span>
                                    </div>
                                    <div className="example">
                                        <span className="example-label">Avg Length:</span>
                                        <span className="example-word">{stats.wordStats.avgWordLength} chars</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Character Breakdown */}
                        <div className="stats-section">
                            <h3 className="section-title">🔤 Character Breakdown</h3>
                            <div className="char-grid">
                                <div className="char-item"><span className="char-icon">🔡</span><span className="char-value">{stats.charBreakdown.letters}</span><span className="char-label">Letters</span></div>
                                <div className="char-item"><span className="char-icon">🔢</span><span className="char-value">{stats.charBreakdown.digits}</span><span className="char-label">Digits</span></div>
                                <div className="char-item"><span className="char-icon">⬜</span><span className="char-value">{stats.charBreakdown.spaces}</span><span className="char-label">Spaces</span></div>
                                <div className="char-item"><span className="char-icon">❗</span><span className="char-value">{stats.charBreakdown.punctuation}</span><span className="char-label">Punctuation</span></div>
                                <div className="char-item"><span className="char-icon">🅰️</span><span className="char-value">{stats.charBreakdown.vowels}</span><span className="char-label">Vowels</span></div>
                                <div className="char-item"><span className="char-icon">🅱️</span><span className="char-value">{stats.charBreakdown.consonants}</span><span className="char-label">Consonants</span></div>
                            </div>
                        </div>

                        {/* Top Letters */}
                        {stats.topLetters.length > 0 && (
                            <div className="stats-section">
                                <h3 className="section-title">🏆 Top Letters</h3>
                                <div className="top-letters">
                                    {stats.topLetters.map((l, idx) => (
                                        <div key={l.letter} className="letter-item">
                                            <span className="letter-rank">#{idx + 1}</span>
                                            <span className="letter-char">{l.letter}</span>
                                            <div className="letter-bar-container">
                                                <div className="letter-bar" style={{ width: `${l.percent * 2}%` }} />
                                            </div>
                                            <span className="letter-percent">{l.percent}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Time Estimates */}
                        <div className="stats-section time-section">
                            <div className="time-card">
                                <span className="time-icon">📖</span>
                                <span className="time-value">~{stats.timeEstimates.readingTime} min</span>
                                <span className="time-label">Reading Time</span>
                            </div>
                            <div className="time-card">
                                <span className="time-icon">🎤</span>
                                <span className="time-value">~{stats.timeEstimates.speakingTime} min</span>
                                <span className="time-label">Speaking Time</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 900px; margin: 0 auto; }
                .input-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .header-actions { display: flex; gap: var(--spacing-sm); }
                .form-input {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-size: var(--text-base);
                    resize: vertical;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .stats-container { margin-top: var(--spacing-lg); }
                .stats-section {
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    padding: var(--spacing-lg);
                    margin-bottom: var(--spacing-md);
                }
                .section-title {
                    margin: 0 0 var(--spacing-md) 0;
                    font-size: var(--text-lg);
                }
                
                /* Basic Stats Grid */
                .stats-grid.six {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: var(--spacing-sm);
                }
                .stat {
                    background: white;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    text-align: center;
                }
                .stat.hero {
                    background: linear-gradient(135deg, #485696, #3d4a7a);
                    color: white;
                }
                .stat.hero .stat-value { color: white; font-size: var(--text-3xl); }
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
                
                /* Word Analysis */
                .word-analysis {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    gap: var(--spacing-lg);
                    align-items: center;
                }
                .vocab-density { display: flex; align-items: center; gap: var(--spacing-md); }
                .density-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: conic-gradient(var(--yinmn-blue) calc(var(--density) * 1%), var(--platinum) 0);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .density-circle::before {
                    content: '';
                    position: absolute;
                    width: 60px;
                    height: 60px;
                    background: white;
                    border-radius: 50%;
                }
                .density-value {
                    position: relative;
                    z-index: 1;
                    font-size: var(--text-lg);
                    font-weight: 700;
                    color: var(--yinmn-blue);
                }
                .density-info { display: flex; flex-direction: column; }
                .density-label { font-weight: 600; }
                .density-count { font-size: var(--text-sm); color: var(--text-muted); }
                .word-length-dist { flex: 1; }
                .length-bar {
                    display: flex;
                    height: 24px;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: var(--spacing-xs);
                }
                .length-segment { min-width: 4px; }
                .length-segment.short { background: #22c55e; }
                .length-segment.medium { background: #3b82f6; }
                .length-segment.long { background: #8b5cf6; }
                .length-legend {
                    display: flex;
                    gap: var(--spacing-md);
                    font-size: var(--text-xs);
                }
                .legend-item { display: flex; align-items: center; gap: 4px; }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .dot.short { background: #22c55e; }
                .dot.medium { background: #3b82f6; }
                .dot.long { background: #8b5cf6; }
                .word-examples { display: flex; flex-direction: column; gap: var(--spacing-xs); }
                .example { font-size: var(--text-sm); }
                .example-label { color: var(--text-muted); }
                .example-word { font-weight: 600; color: var(--yinmn-blue); }
                
                /* Character Grid */
                .char-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: var(--spacing-sm);
                }
                .char-item {
                    background: white;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    text-align: center;
                }
                .char-icon {
                    display: block;
                    font-size: var(--text-xl);
                    margin-bottom: var(--spacing-xs);
                }
                .char-value {
                    display: block;
                    font-size: var(--text-xl);
                    font-weight: 700;
                    color: var(--yinmn-blue);
                }
                .char-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                
                /* Top Letters */
                .top-letters {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs);
                }
                .letter-item {
                    display: grid;
                    grid-template-columns: 30px 30px 1fr 50px;
                    gap: var(--spacing-sm);
                    align-items: center;
                    padding: var(--spacing-xs);
                    background: white;
                    border-radius: var(--radius);
                }
                .letter-rank { color: var(--text-muted); font-size: var(--text-sm); }
                .letter-char {
                    width: 30px;
                    height: 30px;
                    background: var(--yinmn-blue);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }
                .letter-bar-container {
                    height: 8px;
                    background: var(--platinum);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .letter-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #485696, #6366f1);
                }
                .letter-percent {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    text-align: right;
                }
                
                /* Time Section */
                .time-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                    background: transparent;
                    padding: 0;
                }
                .time-card {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    text-align: center;
                }
                .time-icon {
                    display: block;
                    font-size: var(--text-3xl);
                    margin-bottom: var(--spacing-sm);
                }
                .time-value {
                    display: block;
                    font-size: var(--text-2xl);
                    font-weight: 700;
                    color: var(--yinmn-blue);
                }
                .time-label {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }
                
                @media(max-width: 768px) {
                    .stats-grid.six { grid-template-columns: repeat(3, 1fr); }
                    .word-analysis { grid-template-columns: 1fr; }
                    .char-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media(max-width: 480px) {
                    .stats-grid.six { grid-template-columns: repeat(2, 1fr); }
                    .char-grid { grid-template-columns: repeat(2, 1fr); }
                    .time-section { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default TextStatistics;
