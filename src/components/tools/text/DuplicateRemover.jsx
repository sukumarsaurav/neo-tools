import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const DuplicateRemover = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const [stats, setStats] = useState(null);
    const [sortOption, setSortOption] = useState('none');
    const [trimLines, setTrimLines] = useState(true);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'duplicate-remover').slice(0, 3);

    const remove = (ignoreCase) => {
        if (!text.trim()) {
            toast.warning('Please enter some text first');
            return;
        }

        let lines = text.split('\n');

        // Optionally trim lines
        if (trimLines) {
            lines = lines.map(l => l.trim());
        }

        // Filter empty lines
        lines = lines.filter(l => l);

        const seen = new Set();
        const unique = [];
        const duplicates = [];

        lines.forEach(line => {
            const key = ignoreCase ? line.toLowerCase() : line;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(line);
            } else {
                duplicates.push(line);
            }
        });

        // Sort if needed
        let sortedUnique = [...unique];
        if (sortOption === 'asc') {
            sortedUnique.sort((a, b) => a.localeCompare(b));
        } else if (sortOption === 'desc') {
            sortedUnique.sort((a, b) => b.localeCompare(a));
        } else if (sortOption === 'length') {
            sortedUnique.sort((a, b) => a.length - b.length);
        } else if (sortOption === 'length-desc') {
            sortedUnique.sort((a, b) => b.length - a.length);
        }

        setResult(sortedUnique.join('\n'));
        setStats({
            original: lines.length,
            unique: unique.length,
            removed: lines.length - unique.length,
            duplicates: duplicates.slice(0, 10) // Show first 10 duplicates
        });

        if (lines.length - unique.length > 0) {
            toast.success(`Removed ${lines.length - unique.length} duplicate${lines.length - unique.length > 1 ? 's' : ''}!`);
        } else {
            toast.info('No duplicates found');
        }
    };

    const clearAll = () => {
        setText('');
        setResult('');
        setStats(null);
    };

    const faqs = [
        { question: 'How does it work?', answer: 'Enter text with one item per line. The tool removes duplicate lines, keeping only the first occurrence of each unique line.' },
        { question: 'What is case-insensitive mode?', answer: 'In case-insensitive mode, "Hello" and "hello" are considered duplicates. Only one is kept.' }
    ];

    const seoContent = (<><h2>Duplicate Line Remover</h2><p>Remove duplicate lines from your text. Clean up lists, data, or any text with repeated lines. Supports sorting and case-insensitive matching.</p></>);

    return (
        <ToolLayout title="Duplicate Line Remover" description="Remove duplicate lines from text. Clean up lists and data quickly." keywords={['remove duplicates', 'duplicate remover', 'unique lines', 'clean text']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Enter text (one item per line)</label>
                    <ClearButton onClear={clearAll} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="apple&#10;banana&#10;apple&#10;cherry&#10;banana&#10;..." />

                <div className="options-row">
                    <div className="form-group">
                        <label className="form-label">Sort result</label>
                        <select className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="none">No sorting</option>
                            <option value="asc">A → Z</option>
                            <option value="desc">Z → A</option>
                            <option value="length">Short → Long</option>
                            <option value="length-desc">Long → Short</option>
                        </select>
                    </div>
                    <label className="checkbox-item">
                        <input type="checkbox" checked={trimLines} onChange={(e) => setTrimLines(e.target.checked)} />
                        <span>Trim whitespace</span>
                    </label>
                </div>

                <div className="btn-group">
                    <button className="btn btn-primary" onClick={() => remove(false)}>
                        🎯 Remove Duplicates
                    </button>
                    <button className="btn btn-secondary" onClick={() => remove(true)}>
                        🔤 Ignore Case
                    </button>
                </div>

                {stats && (
                    <div className="stats-bar">
                        <div className="stat-item">
                            <span className="stat-value">{stats.original}</span>
                            <span className="stat-label">Original</span>
                        </div>
                        <span className="stat-arrow">→</span>
                        <div className="stat-item highlight">
                            <span className="stat-value">{stats.unique}</span>
                            <span className="stat-label">Unique</span>
                        </div>
                        <div className="stat-item removed">
                            <span className="stat-value">-{stats.removed}</span>
                            <span className="stat-label">Removed</span>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="result-section">
                        <div className="result-header">
                            <span className="result-title">Unique Lines</span>
                            <div className="result-actions">
                                <CopyButton text={result} label="Copy" size="sm" />
                                <DownloadButton content={result} filename="unique-lines.txt" label="Download" size="sm" />
                            </div>
                        </div>
                        <textarea className="form-input result-textarea" value={result} readOnly rows={8} />
                    </div>
                )}

                {stats && stats.duplicates.length > 0 && (
                    <div className="duplicates-section">
                        <h4 className="section-title">Removed Duplicates {stats.removed > 10 && `(showing 10 of ${stats.removed})`}</h4>
                        <div className="duplicates-list">
                            {stats.duplicates.map((dup, idx) => (
                                <span key={idx} className="duplicate-tag">{dup}</span>
                            ))}
                        </div>
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
                .form-input, .form-select {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-size: var(--text-base);
                    transition: border-color 0.2s;
                }
                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .options-row {
                    display: flex;
                    align-items: flex-end;
                    gap: var(--spacing-lg);
                    margin: var(--spacing-md) 0;
                    flex-wrap: wrap;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    min-width: 150px;
                }
                .form-label {
                    font-weight: 500;
                    margin-bottom: var(--spacing-xs);
                    font-size: var(--text-sm);
                }
                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    cursor: pointer;
                    padding-bottom: var(--spacing-md);
                }
                .btn-group {
                    display: flex;
                    gap: var(--spacing-md);
                    margin: var(--spacing-md) 0;
                }
                .btn {
                    flex: 1;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .stats-bar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-lg);
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                }
                .stat-item {
                    text-align: center;
                }
                .stat-value {
                    display: block;
                    font-size: var(--text-2xl);
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .stat-label {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                .stat-item.highlight .stat-value {
                    color: var(--yinmn-blue);
                }
                .stat-item.removed .stat-value {
                    color: #ef4444;
                }
                .stat-arrow {
                    font-size: var(--text-xl);
                    color: var(--text-muted);
                }
                .result-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                }
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .result-title {
                    font-weight: 600;
                }
                .result-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .result-textarea {
                    background: white;
                }
                .duplicates-section {
                    margin-top: var(--spacing-lg);
                }
                .section-title {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-sm);
                }
                .duplicates-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-xs);
                }
                .duplicate-tag {
                    background: #fef2f2;
                    color: #b91c1c;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border-radius: var(--radius);
                    font-size: var(--text-sm);
                }
                @media(max-width: 480px) {
                    .btn-group { flex-direction: column; }
                    .stats-bar { flex-wrap: wrap; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default DuplicateRemover;
