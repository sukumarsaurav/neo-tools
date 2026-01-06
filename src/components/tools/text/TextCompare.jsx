import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const TextCompare = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [mode, setMode] = useState('words'); // 'words', 'lines', 'chars'
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'text-compare').slice(0, 3);

    const result = useMemo(() => {
        if (!text1.trim() && !text2.trim()) return null;

        if (mode === 'words') {
            const words1 = text1.split(/\s+/).filter(w => w);
            const words2 = text2.split(/\s+/).filter(w => w);
            const set1 = new Set(words1.map(w => w.toLowerCase()));
            const set2 = new Set(words2.map(w => w.toLowerCase()));
            const common = [...set1].filter(w => set2.has(w));
            const onlyIn1 = [...set1].filter(w => !set2.has(w));
            const onlyIn2 = [...set2].filter(w => !set1.has(w));
            const similarity = set1.size + set2.size > 0 ? Math.round((common.length * 2 / (set1.size + set2.size)) * 100) : 0;

            return {
                common,
                onlyIn1,
                onlyIn2,
                similarity,
                words1: set1.size,
                words2: set2.size,
                type: 'words'
            };
        } else if (mode === 'lines') {
            const lines1 = text1.split('\n').filter(l => l.trim());
            const lines2 = text2.split('\n').filter(l => l.trim());

            // Simple line-by-line diff
            const maxLines = Math.max(lines1.length, lines2.length);
            const diff = [];

            for (let i = 0; i < maxLines; i++) {
                const l1 = lines1[i] || '';
                const l2 = lines2[i] || '';

                if (l1 === l2) {
                    diff.push({ type: 'same', line: i + 1, text: l1 });
                } else if (!l1) {
                    diff.push({ type: 'added', line: i + 1, text: l2 });
                } else if (!l2) {
                    diff.push({ type: 'removed', line: i + 1, text: l1 });
                } else {
                    diff.push({ type: 'changed', line: i + 1, text1: l1, text2: l2 });
                }
            }

            const same = diff.filter(d => d.type === 'same').length;
            const similarity = maxLines > 0 ? Math.round((same / maxLines) * 100) : 0;

            return {
                diff,
                similarity,
                lines1: lines1.length,
                lines2: lines2.length,
                added: diff.filter(d => d.type === 'added').length,
                removed: diff.filter(d => d.type === 'removed').length,
                changed: diff.filter(d => d.type === 'changed').length,
                type: 'lines'
            };
        } else {
            // Character comparison
            const chars1 = text1.length;
            const chars2 = text2.length;
            const identical = text1 === text2;

            // Find first difference
            let firstDiff = -1;
            for (let i = 0; i < Math.min(chars1, chars2); i++) {
                if (text1[i] !== text2[i]) {
                    firstDiff = i;
                    break;
                }
            }
            if (firstDiff === -1 && chars1 !== chars2) {
                firstDiff = Math.min(chars1, chars2);
            }

            return {
                chars1,
                chars2,
                identical,
                firstDiff,
                similarity: identical ? 100 : 0,
                type: 'chars'
            };
        }
    }, [text1, text2, mode]);

    const swapTexts = () => {
        const temp = text1;
        setText1(text2);
        setText2(temp);
        toast.info('Texts swapped!');
    };

    const clearAll = () => {
        setText1('');
        setText2('');
    };

    const faqs = [
        { question: 'How is similarity calculated?', answer: 'For words: Jaccard-like similarity (2 × common words) / (total unique words). For lines: percentage of identical lines.' },
        { question: 'Is comparison case-sensitive?', answer: 'Word comparison is case-insensitive. Line and character comparison are case-sensitive.' }
    ];

    const seoContent = (<><h2>Text Compare Tool</h2><p>Compare two texts and find differences. Choose between word, line, or character comparison modes.</p></>);

    const getSimilarityColor = (similarity) => {
        if (similarity >= 80) return '#22c55e';
        if (similarity >= 50) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <ToolLayout title="Text Compare Tool" description="Compare two texts to find similarities and differences." keywords={['text compare', 'diff tool', 'text difference', 'compare text']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="mode-toggle">
                    <button className={`mode-btn ${mode === 'words' ? 'active' : ''}`} onClick={() => setMode('words')}>
                        🔤 Words
                    </button>
                    <button className={`mode-btn ${mode === 'lines' ? 'active' : ''}`} onClick={() => setMode('lines')}>
                        📄 Lines
                    </button>
                    <button className={`mode-btn ${mode === 'chars' ? 'active' : ''}`} onClick={() => setMode('chars')}>
                        📝 Characters
                    </button>
                </div>

                <div className="compare-inputs">
                    <div className="input-group">
                        <div className="input-header">
                            <label className="form-label">Text 1</label>
                            <ClearButton onClear={() => setText1('')} hasContent={text1.length > 0} size="sm" label="" />
                        </div>
                        <textarea className="form-input" value={text1} onChange={(e) => setText1(e.target.value)} rows={6} placeholder="First text..." />
                    </div>

                    <button className="swap-btn" onClick={swapTexts} title="Swap texts">
                        ⇄
                    </button>

                    <div className="input-group">
                        <div className="input-header">
                            <label className="form-label">Text 2</label>
                            <ClearButton onClear={() => setText2('')} hasContent={text2.length > 0} size="sm" label="" />
                        </div>
                        <textarea className="form-input" value={text2} onChange={(e) => setText2(e.target.value)} rows={6} placeholder="Second text..." />
                    </div>
                </div>

                {result && (
                    <div className="result-section">
                        <div className="similarity-display" style={{ '--sim-color': getSimilarityColor(result.similarity) }}>
                            <div className="similarity-circle">
                                <span className="similarity-value">{result.similarity}%</span>
                            </div>
                            <span className="similarity-label">Similarity</span>
                        </div>

                        {result.type === 'words' && (
                            <>
                                <div className="stats-grid">
                                    <div className="stat"><span className="stat-value">{result.words1}</span><span className="stat-label">Unique in Text 1</span></div>
                                    <div className="stat"><span className="stat-value">{result.words2}</span><span className="stat-label">Unique in Text 2</span></div>
                                    <div className="stat highlight"><span className="stat-value">{result.common.length}</span><span className="stat-label">Common Words</span></div>
                                    <div className="stat removed"><span className="stat-value">{result.onlyIn1.length}</span><span className="stat-label">Only in Text 1</span></div>
                                    <div className="stat added"><span className="stat-value">{result.onlyIn2.length}</span><span className="stat-label">Only in Text 2</span></div>
                                </div>

                                {result.common.length > 0 && (
                                    <div className="word-section">
                                        <h4 className="section-title">Common Words</h4>
                                        <div className="word-tags">
                                            {result.common.slice(0, 20).map((w, i) => (
                                                <span key={i} className="word-tag common">{w}</span>
                                            ))}
                                            {result.common.length > 20 && <span className="more-tag">+{result.common.length - 20} more</span>}
                                        </div>
                                    </div>
                                )}

                                {result.onlyIn1.length > 0 && (
                                    <div className="word-section">
                                        <h4 className="section-title">Only in Text 1</h4>
                                        <div className="word-tags">
                                            {result.onlyIn1.slice(0, 15).map((w, i) => (
                                                <span key={i} className="word-tag only1">{w}</span>
                                            ))}
                                            {result.onlyIn1.length > 15 && <span className="more-tag">+{result.onlyIn1.length - 15} more</span>}
                                        </div>
                                    </div>
                                )}

                                {result.onlyIn2.length > 0 && (
                                    <div className="word-section">
                                        <h4 className="section-title">Only in Text 2</h4>
                                        <div className="word-tags">
                                            {result.onlyIn2.slice(0, 15).map((w, i) => (
                                                <span key={i} className="word-tag only2">{w}</span>
                                            ))}
                                            {result.onlyIn2.length > 15 && <span className="more-tag">+{result.onlyIn2.length - 15} more</span>}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {result.type === 'lines' && (
                            <>
                                <div className="stats-grid">
                                    <div className="stat"><span className="stat-value">{result.lines1}</span><span className="stat-label">Lines in Text 1</span></div>
                                    <div className="stat"><span className="stat-value">{result.lines2}</span><span className="stat-label">Lines in Text 2</span></div>
                                    <div className="stat added"><span className="stat-value">+{result.added}</span><span className="stat-label">Added</span></div>
                                    <div className="stat removed"><span className="stat-value">-{result.removed}</span><span className="stat-label">Removed</span></div>
                                    <div className="stat changed"><span className="stat-value">~{result.changed}</span><span className="stat-label">Changed</span></div>
                                </div>

                                <div className="diff-view">
                                    {result.diff.slice(0, 20).map((d, i) => (
                                        <div key={i} className={`diff-line ${d.type}`}>
                                            <span className="line-num">{d.line}</span>
                                            {d.type === 'changed' ? (
                                                <div className="changed-content">
                                                    <div className="old-text">- {d.text1}</div>
                                                    <div className="new-text">+ {d.text2}</div>
                                                </div>
                                            ) : (
                                                <span className="line-text">
                                                    {d.type === 'removed' && '- '}
                                                    {d.type === 'added' && '+ '}
                                                    {d.text}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {result.diff.length > 20 && (
                                        <div className="more-lines">... and {result.diff.length - 20} more lines</div>
                                    )}
                                </div>
                            </>
                        )}

                        {result.type === 'chars' && (
                            <div className="char-result">
                                <div className="stats-grid">
                                    <div className="stat"><span className="stat-value">{result.chars1}</span><span className="stat-label">Chars in Text 1</span></div>
                                    <div className="stat"><span className="stat-value">{result.chars2}</span><span className="stat-label">Chars in Text 2</span></div>
                                    <div className="stat"><span className="stat-value">{Math.abs(result.chars1 - result.chars2)}</span><span className="stat-label">Difference</span></div>
                                </div>
                                {result.identical ? (
                                    <div className="identical-badge">✓ Texts are identical</div>
                                ) : result.firstDiff >= 0 && (
                                    <div className="first-diff">
                                        First difference at position: <strong>{result.firstDiff + 1}</strong>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 900px; margin: 0 auto; }
                .mode-toggle {
                    display: flex;
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                    justify-content: center;
                }
                .mode-btn {
                    padding: var(--spacing-sm) var(--spacing-lg);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    background: var(--bg-secondary);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .mode-btn.active {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.1);
                    color: var(--yinmn-blue);
                }
                .compare-inputs {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: var(--spacing-md);
                    align-items: start;
                }
                .input-group { display: flex; flex-direction: column; }
                .input-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-xs);
                }
                .swap-btn {
                    align-self: center;
                    margin-top: 30px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid var(--platinum);
                    background: white;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .swap-btn:hover {
                    background: var(--yinmn-blue);
                    color: white;
                    border-color: var(--yinmn-blue);
                    transform: rotate(180deg);
                }
                .form-input {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    transition: border-color 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .result-section {
                    margin-top: var(--spacing-xl);
                }
                .similarity-display {
                    text-align: center;
                    margin-bottom: var(--spacing-lg);
                }
                .similarity-circle {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: var(--bg-secondary);
                    border: 4px solid var(--sim-color);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: var(--spacing-xs);
                }
                .similarity-value {
                    font-size: var(--text-3xl);
                    font-weight: 700;
                    color: var(--sim-color);
                }
                .similarity-label {
                    color: var(--text-muted);
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }
                .stat {
                    background: var(--bg-secondary);
                    padding: var(--spacing-sm);
                    border-radius: var(--radius);
                    text-align: center;
                }
                .stat-value {
                    display: block;
                    font-size: var(--text-xl);
                    font-weight: 700;
                }
                .stat-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                .stat.highlight .stat-value { color: var(--yinmn-blue); }
                .stat.added .stat-value { color: #22c55e; }
                .stat.removed .stat-value { color: #ef4444; }
                .stat.changed .stat-value { color: #f59e0b; }
                
                .word-section { margin-top: var(--spacing-lg); }
                .section-title {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-sm);
                }
                .word-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-xs);
                }
                .word-tag {
                    padding: 4px 10px;
                    border-radius: var(--radius);
                    font-size: var(--text-sm);
                }
                .word-tag.common { background: #dbeafe; color: #1e40af; }
                .word-tag.only1 { background: #fef2f2; color: #b91c1c; }
                .word-tag.only2 { background: #dcfce7; color: #166534; }
                .more-tag {
                    color: var(--text-muted);
                    font-size: var(--text-sm);
                    font-style: italic;
                }
                
                .diff-view {
                    background: #1e293b;
                    border-radius: var(--radius);
                    overflow: hidden;
                    font-family: var(--font-mono, monospace);
                    font-size: var(--text-sm);
                }
                .diff-line {
                    display: flex;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border-bottom: 1px solid #334155;
                }
                .diff-line.same { color: #94a3b8; }
                .diff-line.added { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
                .diff-line.removed { background: rgba(239, 68, 68, 0.1); color: #f87171; }
                .diff-line.changed { background: rgba(245, 158, 11, 0.1); }
                .line-num {
                    color: #64748b;
                    min-width: 30px;
                    text-align: right;
                    margin-right: var(--spacing-sm);
                }
                .changed-content {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .old-text { color: #f87171; }
                .new-text { color: #4ade80; }
                .more-lines {
                    padding: var(--spacing-sm);
                    color: #64748b;
                    text-align: center;
                }
                
                .identical-badge {
                    background: #dcfce7;
                    color: #166534;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    text-align: center;
                    font-weight: 600;
                }
                .first-diff {
                    background: #fef3c7;
                    color: #92400e;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    text-align: center;
                }
                
                @media(max-width: 768px) {
                    .compare-inputs { grid-template-columns: 1fr; }
                    .swap-btn { 
                        margin: var(--spacing-sm) auto;
                        transform: rotate(90deg);
                    }
                    .swap-btn:hover { transform: rotate(270deg); }
                    .stats-grid { grid-template-columns: repeat(3, 1fr); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default TextCompare;
