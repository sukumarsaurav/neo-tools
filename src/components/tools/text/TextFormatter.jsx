import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const TextFormatter = () => {
    const [text, setText] = useState('');
    const [options, setOptions] = useState({
        trimLines: true,
        removeExtraSpaces: true,
        removeEmptyLines: false,
        removeAllLineBreaks: false,
        tabsToSpaces: false,
        spacesToTabs: false,
        removeHtml: false,
        standardizeQuotes: false,
        trimWhitespace: true
    });
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'text-formatter').slice(0, 3);

    const formattedText = useMemo(() => {
        if (!text) return '';

        let result = text;

        // Remove HTML tags
        if (options.removeHtml) {
            result = result.replace(/<[^>]*>/g, '');
        }

        // Standardize quotes
        if (options.standardizeQuotes) {
            result = result.replace(/[""]/g, '"').replace(/['']/g, "'");
        }

        // Tabs to spaces
        if (options.tabsToSpaces) {
            result = result.replace(/\t/g, '    ');
        }

        // Spaces to tabs
        if (options.spacesToTabs) {
            result = result.replace(/    /g, '\t');
        }

        // Process line by line
        let lines = result.split('\n');

        // Trim each line
        if (options.trimLines) {
            lines = lines.map(line => line.trim());
        }

        // Remove extra spaces within lines
        if (options.removeExtraSpaces) {
            lines = lines.map(line => line.replace(/  +/g, ' '));
        }

        // Remove empty lines
        if (options.removeEmptyLines) {
            lines = lines.filter(line => line.trim() !== '');
        }

        result = lines.join('\n');

        // Remove all line breaks
        if (options.removeAllLineBreaks) {
            result = result.replace(/\n+/g, ' ').replace(/  +/g, ' ');
        }

        // Trim leading/trailing whitespace
        if (options.trimWhitespace) {
            result = result.trim();
        }

        return result;
    }, [text, options]);

    const stats = useMemo(() => {
        return {
            originalChars: text.length,
            formattedChars: formattedText.length,
            removed: text.length - formattedText.length,
            originalLines: text.split('\n').length,
            formattedLines: formattedText.split('\n').length
        };
    }, [text, formattedText]);

    const toggleOption = (key) => {
        // Handle mutually exclusive options
        if (key === 'tabsToSpaces' && options.spacesToTabs) {
            setOptions({ ...options, tabsToSpaces: true, spacesToTabs: false });
        } else if (key === 'spacesToTabs' && options.tabsToSpaces) {
            setOptions({ ...options, spacesToTabs: true, tabsToSpaces: false });
        } else {
            setOptions({ ...options, [key]: !options[key] });
        }
    };

    const applyPreset = (preset) => {
        switch (preset) {
            case 'clean':
                setOptions({
                    trimLines: true,
                    removeExtraSpaces: true,
                    removeEmptyLines: true,
                    removeAllLineBreaks: false,
                    tabsToSpaces: false,
                    spacesToTabs: false,
                    removeHtml: false,
                    standardizeQuotes: true,
                    trimWhitespace: true
                });
                break;
            case 'minify':
                setOptions({
                    trimLines: true,
                    removeExtraSpaces: true,
                    removeEmptyLines: true,
                    removeAllLineBreaks: true,
                    tabsToSpaces: false,
                    spacesToTabs: false,
                    removeHtml: false,
                    standardizeQuotes: false,
                    trimWhitespace: true
                });
                break;
            case 'code':
                setOptions({
                    trimLines: false,
                    removeExtraSpaces: false,
                    removeEmptyLines: false,
                    removeAllLineBreaks: false,
                    tabsToSpaces: true,
                    spacesToTabs: false,
                    removeHtml: false,
                    standardizeQuotes: false,
                    trimWhitespace: true
                });
                break;
        }
        toast.success('Preset applied!');
    };

    const faqs = [
        { question: 'What does "Trim Lines" do?', answer: 'Removes leading and trailing whitespace from each line, but keeps the content of the line intact.' },
        { question: 'How do presets work?', answer: 'Presets are pre-configured combinations of options for common use cases. Click a preset to instantly apply those settings.' }
    ];

    const seoContent = (<><h2>Text Formatter</h2><p>Clean up and format your text. Remove extra whitespace, empty lines, HTML tags, and more. Perfect for cleaning up copied content.</p></>);

    return (
        <ToolLayout title="Text Formatter" description="Format and clean up text by removing extra whitespace, empty lines, and more." keywords={['text formatter', 'clean text', 'remove whitespace', 'format text']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Paste your text</label>
                    <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste messy text here..." />

                <div className="presets-row">
                    <span className="preset-label">Quick Presets:</span>
                    <button className="preset-btn" onClick={() => applyPreset('clean')}>🧹 Clean</button>
                    <button className="preset-btn" onClick={() => applyPreset('minify')}>📦 Minify</button>
                    <button className="preset-btn" onClick={() => applyPreset('code')}>💻 Code</button>
                </div>

                <div className="options-grid">
                    <label className={`option-item ${options.trimLines ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.trimLines} onChange={() => toggleOption('trimLines')} />
                        <span className="option-text">Trim each line</span>
                    </label>
                    <label className={`option-item ${options.removeExtraSpaces ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.removeExtraSpaces} onChange={() => toggleOption('removeExtraSpaces')} />
                        <span className="option-text">Remove extra spaces</span>
                    </label>
                    <label className={`option-item ${options.removeEmptyLines ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.removeEmptyLines} onChange={() => toggleOption('removeEmptyLines')} />
                        <span className="option-text">Remove empty lines</span>
                    </label>
                    <label className={`option-item ${options.removeAllLineBreaks ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.removeAllLineBreaks} onChange={() => toggleOption('removeAllLineBreaks')} />
                        <span className="option-text">Remove all line breaks</span>
                    </label>
                    <label className={`option-item ${options.tabsToSpaces ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.tabsToSpaces} onChange={() => toggleOption('tabsToSpaces')} />
                        <span className="option-text">Convert tabs to spaces</span>
                    </label>
                    <label className={`option-item ${options.spacesToTabs ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.spacesToTabs} onChange={() => toggleOption('spacesToTabs')} />
                        <span className="option-text">Convert spaces to tabs</span>
                    </label>
                    <label className={`option-item ${options.removeHtml ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.removeHtml} onChange={() => toggleOption('removeHtml')} />
                        <span className="option-text">Remove HTML tags</span>
                    </label>
                    <label className={`option-item ${options.standardizeQuotes ? 'active' : ''}`}>
                        <input type="checkbox" checked={options.standardizeQuotes} onChange={() => toggleOption('standardizeQuotes')} />
                        <span className="option-text">Standardize quotes</span>
                    </label>
                </div>

                {text && stats.removed !== 0 && (
                    <div className="stats-bar">
                        <div className="stat">
                            <span className="stat-value">{stats.originalChars}</span>
                            <span className="stat-label">Original</span>
                        </div>
                        <span className="stat-arrow">→</span>
                        <div className="stat highlight">
                            <span className="stat-value">{stats.formattedChars}</span>
                            <span className="stat-label">Formatted</span>
                        </div>
                        <div className="stat removed">
                            <span className="stat-value">{stats.removed > 0 ? `-${stats.removed}` : `+${Math.abs(stats.removed)}`}</span>
                            <span className="stat-label">Chars</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{stats.originalLines} → {stats.formattedLines}</span>
                            <span className="stat-label">Lines</span>
                        </div>
                    </div>
                )}

                {formattedText && (
                    <div className="result-section">
                        <div className="result-header">
                            <label className="form-label">Formatted Text</label>
                            <div className="result-actions">
                                <CopyButton text={formattedText} label="Copy" size="sm" />
                                <DownloadButton content={formattedText} filename="formatted-text.txt" label="Download" size="sm" />
                            </div>
                        </div>
                        <textarea className="form-input result-textarea" value={formattedText} readOnly rows={8} />
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
                .form-input {
                    width: 100%;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    font-size: var(--text-base);
                    transition: border-color 0.2s;
                    resize: vertical;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .presets-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    margin: var(--spacing-md) 0;
                    flex-wrap: wrap;
                }
                .preset-label {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }
                .preset-btn {
                    padding: var(--spacing-xs) var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    background: white;
                    cursor: pointer;
                    font-size: var(--text-sm);
                    transition: all 0.2s;
                }
                .preset-btn:hover {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.1);
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }
                .option-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-sm);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: var(--text-sm);
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                .option-item:hover {
                    background: var(--platinum);
                }
                .option-item.active {
                    background: rgba(72, 86, 150, 0.1);
                    border-color: var(--yinmn-blue);
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
                .stat { text-align: center; }
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
                .stat.removed .stat-value { color: #22c55e; }
                .stat-arrow {
                    font-size: var(--text-lg);
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
                .result-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .result-textarea {
                    background: white;
                }
                @media(max-width: 768px) {
                    .options-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media(max-width: 480px) {
                    .options-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default TextFormatter;
