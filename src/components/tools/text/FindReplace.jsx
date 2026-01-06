import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const FindReplace = () => {
    const [text, setText] = useState('');
    const [find, setFind] = useState('');
    const [replace, setReplace] = useState('');
    const [result, setResult] = useState('');
    const [count, setCount] = useState(0);
    const [caseSensitive, setCaseSensitive] = useState(true);
    const [wholeWord, setWholeWord] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'find-replace').slice(0, 3);

    // Live match count
    const matchInfo = useMemo(() => {
        if (!find || !text) return { count: 0, positions: [] };

        try {
            let pattern = find;
            if (!useRegex) {
                pattern = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            if (wholeWord) {
                pattern = `\\b${pattern}\\b`;
            }

            const flags = caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(pattern, flags);
            const matches = text.match(regex) || [];
            return { count: matches.length };
        } catch (e) {
            return { count: 0, error: true };
        }
    }, [text, find, caseSensitive, wholeWord, useRegex]);

    const doReplace = () => {
        if (!find) {
            toast.warning('Enter text to find');
            return;
        }
        if (!text) {
            toast.warning('Enter some text first');
            return;
        }

        try {
            let pattern = find;
            if (!useRegex) {
                pattern = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
            if (wholeWord) {
                pattern = `\\b${pattern}\\b`;
            }

            const flags = caseSensitive ? 'g' : 'gi';
            const regex = new RegExp(pattern, flags);
            const matches = (text.match(regex) || []).length;
            const replaced = text.replace(regex, replace);

            setResult(replaced);
            setCount(matches);

            if (matches > 0) {
                toast.success(`Replaced ${matches} occurrence${matches > 1 ? 's' : ''}`);
            } else {
                toast.info('No matches found');
            }
        } catch (e) {
            toast.error('Invalid regex pattern');
        }
    };

    const clearAll = () => {
        setText('');
        setFind('');
        setReplace('');
        setResult('');
        setCount(0);
    };

    const faqs = [
        { question: 'Can I use regular expressions?', answer: 'Yes! Enable the "Use Regex" option to use regex patterns. For example, use "\\d+" to match numbers.' },
        { question: 'What is Whole Word matching?', answer: 'Whole Word only matches complete words, not parts of words. "cat" won\'t match "category".' }
    ];

    const seoContent = (<><h2>Find and Replace Tool</h2><p>Find and replace text instantly. Supports case-sensitive, whole word, and regex matching. Replace multiple occurrences at once.</p></>);

    return (
        <ToolLayout title="Find and Replace" description="Find and replace text in your content. Supports regex and whole word matching." keywords={['find and replace', 'text replace', 'search replace', 'find text', 'regex replace']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Your Text</label>
                    <ClearButton onClear={clearAll} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Enter your text here..." />

                <div className="find-replace-row">
                    <div className="form-group">
                        <label className="form-label">
                            Find
                            {matchInfo.count > 0 && (
                                <span className="match-badge">{matchInfo.count} match{matchInfo.count > 1 ? 'es' : ''}</span>
                            )}
                            {matchInfo.error && <span className="error-badge">Invalid regex</span>}
                        </label>
                        <input
                            type="text"
                            className={`form-input ${matchInfo.error ? 'input-error' : ''}`}
                            value={find}
                            onChange={(e) => setFind(e.target.value)}
                            placeholder="Text to find..."
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Replace with</label>
                        <input
                            type="text"
                            className="form-input"
                            value={replace}
                            onChange={(e) => setReplace(e.target.value)}
                            placeholder="Replacement text..."
                        />
                    </div>
                </div>

                <div className="options-row">
                    <label className="checkbox-item">
                        <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
                        <span>Case sensitive</span>
                    </label>
                    <label className="checkbox-item">
                        <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} />
                        <span>Whole word</span>
                    </label>
                    <label className="checkbox-item">
                        <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
                        <span>Use Regex</span>
                    </label>
                </div>

                <button className="btn btn-primary btn-lg replace-btn" onClick={doReplace}>
                    🔄 Replace All
                </button>

                {result && (
                    <div className="result-section">
                        <div className="result-header">
                            <span className="result-title">
                                Result
                                <span className="replaced-count">({count} replaced)</span>
                            </span>
                            <div className="result-actions">
                                <CopyButton text={result} label="Copy" size="sm" />
                                <DownloadButton content={result} filename="replaced-text.txt" label="Download" size="sm" />
                            </div>
                        </div>
                        <textarea className="form-input result-textarea" value={result} readOnly rows={6} />
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
                .form-input.input-error {
                    border-color: #ef4444;
                }
                .find-replace-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                    margin: var(--spacing-lg) 0;
                }
                .form-group { display: flex; flex-direction: column; }
                .form-label {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    font-weight: 500;
                    margin-bottom: var(--spacing-xs);
                }
                .match-badge {
                    background: #dcfce7;
                    color: #166534;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: var(--text-xs);
                    font-weight: 600;
                }
                .error-badge {
                    background: #fef2f2;
                    color: #b91c1c;
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: var(--text-xs);
                    font-weight: 600;
                }
                .options-row {
                    display: flex;
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }
                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    cursor: pointer;
                    font-size: var(--text-sm);
                }
                .replace-btn {
                    width: 100%;
                    padding: var(--spacing-md);
                    font-size: var(--text-lg);
                }
                .result-section {
                    margin-top: var(--spacing-lg);
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                }
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }
                .result-title {
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .replaced-count {
                    color: var(--success);
                    font-weight: 500;
                    font-size: var(--text-sm);
                }
                .result-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .result-textarea {
                    background: white;
                }
                @media(max-width: 480px) {
                    .find-replace-row { grid-template-columns: 1fr; }
                    .options-row { flex-direction: column; gap: var(--spacing-sm); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default FindReplace;
