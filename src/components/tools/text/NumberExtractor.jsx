import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const NumberExtractor = () => {
    const [text, setText] = useState('');
    const [extractType, setExtractType] = useState('numbers');
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'number-extractor').slice(0, 3);

    const extractedData = useMemo(() => {
        if (!text.trim()) return { items: [], stats: null };

        let items = [];
        let pattern;

        switch (extractType) {
            case 'numbers':
                pattern = /-?\d+\.?\d*/g;
                items = text.match(pattern) || [];
                break;
            case 'integers':
                pattern = /-?\d+/g;
                items = (text.match(pattern) || []).filter(n => !n.includes('.'));
                break;
            case 'decimals':
                pattern = /-?\d+\.\d+/g;
                items = text.match(pattern) || [];
                break;
            case 'emails':
                pattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                items = text.match(pattern) || [];
                break;
            case 'urls':
                pattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;
                items = text.match(pattern) || [];
                break;
            case 'phones':
                pattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
                items = text.match(pattern) || [];
                break;
            case 'hashtags':
                pattern = /#[a-zA-Z0-9_]+/g;
                items = text.match(pattern) || [];
                break;
            case 'mentions':
                pattern = /@[a-zA-Z0-9_]+/g;
                items = text.match(pattern) || [];
                break;
        }

        // Remove duplicates
        const unique = [...new Set(items)];

        // Calculate stats for numbers
        let stats = {
            total: items.length,
            unique: unique.length
        };

        if (['numbers', 'integers', 'decimals'].includes(extractType)) {
            const nums = unique.map(Number).filter(n => !isNaN(n));
            if (nums.length > 0) {
                stats.sum = nums.reduce((a, b) => a + b, 0);
                stats.average = stats.sum / nums.length;
                stats.min = Math.min(...nums);
                stats.max = Math.max(...nums);
            }
        }

        return { items: unique, stats };
    }, [text, extractType]);

    const faqs = [
        { question: 'What types of data can be extracted?', answer: 'Numbers (integers and decimals), email addresses, URLs, phone numbers, hashtags, and @mentions.' },
        { question: 'Are duplicates included?', answer: 'No, duplicates are automatically removed. Each unique item appears only once in the results.' }
    ];

    const seoContent = (<><h2>Number & Data Extractor</h2><p>Extract numbers, emails, URLs, phone numbers, and more from any text. Perfect for data mining and processing.</p></>);

    const extractTypes = [
        { id: 'numbers', label: '🔢 All Numbers', desc: 'Integers & decimals' },
        { id: 'integers', label: '1️⃣ Integers', desc: 'Whole numbers only' },
        { id: 'decimals', label: '🔣 Decimals', desc: 'Numbers with decimals' },
        { id: 'emails', label: '📧 Emails', desc: 'Email addresses' },
        { id: 'urls', label: '🔗 URLs', desc: 'Web links' },
        { id: 'phones', label: '📱 Phones', desc: 'Phone numbers' },
        { id: 'hashtags', label: '#️⃣ Hashtags', desc: '#tags' },
        { id: 'mentions', label: '@️ Mentions', desc: '@usernames' }
    ];

    return (
        <ToolLayout title="Number & Data Extractor" description="Extract numbers, emails, URLs, phone numbers, and more from text." keywords={['number extractor', 'extract emails', 'extract urls', 'data extraction']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Paste your text</label>
                    <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="The invoice total is $1,234.56. Contact us at support@example.com or call +1 (555) 123-4567. Visit https://example.com for more info. #invoice #paid @accounting" />

                <div className="extract-types">
                    <h4 className="section-title">What to Extract</h4>
                    <div className="types-grid">
                        {extractTypes.map(type => (
                            <button
                                key={type.id}
                                className={`type-btn ${extractType === type.id ? 'active' : ''}`}
                                onClick={() => setExtractType(type.id)}
                            >
                                <span className="type-label">{type.label}</span>
                                <span className="type-desc">{type.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {extractedData.items.length > 0 && (
                    <>
                        {extractedData.stats && extractedData.stats.sum !== undefined && (
                            <div className="number-stats">
                                <div className="stat">
                                    <span className="stat-value">{extractedData.stats.total}</span>
                                    <span className="stat-label">Found</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{extractedData.stats.unique}</span>
                                    <span className="stat-label">Unique</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{Math.round(extractedData.stats.sum * 100) / 100}</span>
                                    <span className="stat-label">Sum</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{Math.round(extractedData.stats.average * 100) / 100}</span>
                                    <span className="stat-label">Average</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{extractedData.stats.min}</span>
                                    <span className="stat-label">Min</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">{extractedData.stats.max}</span>
                                    <span className="stat-label">Max</span>
                                </div>
                            </div>
                        )}

                        <div className="result-section">
                            <div className="result-header">
                                <label className="form-label">
                                    Extracted ({extractedData.items.length} items)
                                </label>
                                <div className="result-actions">
                                    <CopyButton text={extractedData.items.join('\n')} label="Copy" size="sm" />
                                    <CopyButton text={extractedData.items.join(', ')} label="Copy CSV" size="sm" />
                                    <DownloadButton content={extractedData.items.join('\n')} filename={`extracted-${extractType}.txt`} label="Download" size="sm" />
                                </div>
                            </div>
                            <div className="items-grid">
                                {extractedData.items.slice(0, 50).map((item, idx) => (
                                    <div key={idx} className="item-tag">
                                        {item}
                                        <button className="copy-single" onClick={() => { navigator.clipboard.writeText(item); toast.success('Copied!'); }}>📋</button>
                                    </div>
                                ))}
                                {extractedData.items.length > 50 && (
                                    <div className="more-tag">+{extractedData.items.length - 50} more</div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {text && extractedData.items.length === 0 && (
                    <div className="no-results">
                        <span className="no-results-icon">🔍</span>
                        <span>No {extractType} found in your text</span>
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
                .extract-types { margin: var(--spacing-lg) 0; }
                .section-title {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-sm);
                }
                .types-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-sm);
                }
                .type-btn {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    background: var(--bg-secondary);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .type-btn.active {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.1);
                }
                .type-btn:hover:not(.active) {
                    border-color: var(--yinmn-blue);
                }
                .type-label {
                    font-weight: 600;
                    font-size: var(--text-base);
                }
                .type-desc {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }
                .number-stats {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }
                .stat {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    text-align: center;
                }
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
                .result-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                }
                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-md);
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }
                .result-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .items-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--spacing-xs);
                }
                .item-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: white;
                    border-radius: var(--radius);
                    font-family: var(--font-mono, monospace);
                    font-size: var(--text-sm);
                }
                .copy-single {
                    background: none;
                    border: none;
                    cursor: pointer;
                    opacity: 0.5;
                    transition: opacity 0.2s;
                    padding: 0;
                    font-size: 12px;
                }
                .copy-single:hover { opacity: 1; }
                .more-tag {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    color: var(--text-muted);
                    font-style: italic;
                }
                .no-results {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: var(--spacing-xl);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    color: var(--text-muted);
                }
                .no-results-icon {
                    font-size: var(--text-3xl);
                    margin-bottom: var(--spacing-sm);
                }
                @media(max-width: 768px) {
                    .types-grid { grid-template-columns: repeat(2, 1fr); }
                    .number-stats { grid-template-columns: repeat(3, 1fr); }
                }
                @media(max-width: 480px) {
                    .types-grid { grid-template-columns: 1fr; }
                    .number-stats { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default NumberExtractor;
