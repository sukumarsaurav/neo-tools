import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import ClearButton from '../../ui/ClearButton';

const SlugGenerator = () => {
    const [text, setText] = useState('');
    const [separator, setSeparator] = useState('-');
    const [lowercase, setLowercase] = useState(true);
    const [maxLength, setMaxLength] = useState(0);
    const [removeStopWords, setRemoveStopWords] = useState(false);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'slug-generator').slice(0, 3);

    const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these', 'those']);

    const slug = useMemo(() => {
        if (!text.trim()) return '';

        let result = text.trim();

        // Convert to lowercase if enabled
        if (lowercase) {
            result = result.toLowerCase();
        }

        // Remove accents/diacritics
        result = result.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Split into words and optionally remove stop words
        let words = result.split(/\s+/);
        if (removeStopWords) {
            words = words.filter(w => !stopWords.has(w.toLowerCase()));
        }
        result = words.join(' ');

        // Replace non-alphanumeric characters with separator
        result = result.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, separator);

        // Remove multiple consecutive separators
        const sepRegex = new RegExp(`${separator === '-' ? '\\-' : separator}+`, 'g');
        result = result.replace(sepRegex, separator);

        // Trim separators from ends
        result = result.replace(new RegExp(`^${separator === '-' ? '\\-' : separator}+|${separator === '-' ? '\\-' : separator}+$`, 'g'), '');

        // Apply max length
        if (maxLength > 0 && result.length > maxLength) {
            result = result.substring(0, maxLength);
            // Remove trailing separator if cut mid-word
            result = result.replace(new RegExp(`${separator === '-' ? '\\-' : separator}$`), '');
        }

        return result;
    }, [text, separator, lowercase, maxLength, removeStopWords]);

    const faqs = [
        { question: 'What is a URL slug?', answer: 'A slug is the URL-friendly version of a title or text. It contains only lowercase letters, numbers, and hyphens, making it readable and SEO-friendly.' },
        { question: 'Why remove stop words?', answer: 'Stop words like "the", "and", "is" add no SEO value. Removing them creates shorter, cleaner URLs that focus on keywords.' }
    ];

    const seoContent = (<><h2>Slug Generator</h2><p>Convert text into SEO-friendly URL slugs. Perfect for blog posts, product pages, and content management systems.</p></>);

    return (
        <ToolLayout title="Slug Generator" description="Generate SEO-friendly URL slugs from any text." keywords={['slug generator', 'url slug', 'seo url', 'permalink generator']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Enter title or text</label>
                    <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                </div>
                <input
                    type="text"
                    className="form-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="How to Build a Great Website in 2025"
                />

                <div className="options-grid">
                    <div className="option-group">
                        <label className="form-label">Separator</label>
                        <div className="separator-options">
                            <button
                                className={`sep-btn ${separator === '-' ? 'active' : ''}`}
                                onClick={() => setSeparator('-')}
                            >
                                Hyphen (-)
                            </button>
                            <button
                                className={`sep-btn ${separator === '_' ? 'active' : ''}`}
                                onClick={() => setSeparator('_')}
                            >
                                Underscore (_)
                            </button>
                        </div>
                    </div>

                    <div className="option-group">
                        <label className="form-label">Max Length (0 = unlimited)</label>
                        <input
                            type="number"
                            className="form-input small"
                            value={maxLength}
                            onChange={(e) => setMaxLength(Number(e.target.value))}
                            min="0"
                            max="200"
                        />
                    </div>

                    <div className="option-group checkboxes">
                        <label className="checkbox-item">
                            <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} />
                            <span>Lowercase</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" checked={removeStopWords} onChange={(e) => setRemoveStopWords(e.target.checked)} />
                            <span>Remove stop words</span>
                        </label>
                    </div>
                </div>

                {slug && (
                    <div className="result-section">
                        <div className="result-header">
                            <label className="form-label">Generated Slug</label>
                            <div className="result-info">
                                <span className="char-count">{slug.length} characters</span>
                                <CopyButton text={slug} label="Copy" size="sm" />
                            </div>
                        </div>
                        <div className="slug-display">
                            <span className="slug-prefix">example.com/</span>
                            <span className="slug-value">{slug}</span>
                        </div>
                    </div>
                )}

                <div className="examples-section">
                    <h4 className="section-title">Examples</h4>
                    <div className="examples-grid">
                        <button className="example-btn" onClick={() => setText('10 Tips for Better SEO in 2025')}>
                            10 Tips for Better SEO in 2025
                        </button>
                        <button className="example-btn" onClick={() => setText("The Ultimate Guide to React Hooks")}>
                            The Ultimate Guide to React Hooks
                        </button>
                        <button className="example-btn" onClick={() => setText('How to Cook Perfect Pasta')}>
                            How to Cook Perfect Pasta
                        </button>
                    </div>
                </div>
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
                    font-size: var(--text-lg);
                    transition: border-color 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .form-input.small {
                    width: 100px;
                    font-size: var(--text-base);
                }
                .options-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: var(--spacing-lg);
                    margin: var(--spacing-lg) 0;
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                }
                .option-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
                .separator-options { display: flex; gap: var(--spacing-xs); }
                .sep-btn {
                    flex: 1;
                    padding: var(--spacing-sm);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    background: white;
                    cursor: pointer;
                    font-size: var(--text-sm);
                    transition: all 0.2s;
                }
                .sep-btn.active {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.1);
                    color: var(--yinmn-blue);
                }
                .checkboxes {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm);
                    justify-content: center;
                }
                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    cursor: pointer;
                    font-size: var(--text-sm);
                }
                .result-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                }
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .result-info {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }
                .char-count {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                }
                .slug-display {
                    background: white;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    font-family: var(--font-mono, monospace);
                    font-size: var(--text-lg);
                    display: flex;
                    align-items: center;
                    overflow-x: auto;
                }
                .slug-prefix {
                    color: var(--text-muted);
                }
                .slug-value {
                    color: var(--yinmn-blue);
                    font-weight: 600;
                }
                .examples-section { margin-top: var(--spacing-xl); }
                .section-title {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-sm);
                }
                .examples-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }
                .example-btn {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border: 1px solid var(--platinum);
                    border-radius: var(--radius);
                    background: white;
                    font-size: var(--text-sm);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .example-btn:hover {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.05);
                }
                @media(max-width: 600px) {
                    .options-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default SlugGenerator;
