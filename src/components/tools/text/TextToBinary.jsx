import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import DownloadButton from '../../ui/DownloadButton';
import ClearButton from '../../ui/ClearButton';

const TextToBinary = () => {
    const [text, setText] = useState('');
    const [format, setFormat] = useState('binary'); // 'binary', 'hex', 'decimal', 'octal'
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'text-to-binary').slice(0, 3);

    const result = useMemo(() => {
        if (!text) return '';

        try {
            if (format === 'binary') {
                return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
            } else if (format === 'hex') {
                return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
            } else if (format === 'decimal') {
                return text.split('').map(c => c.charCodeAt(0).toString()).join(' ');
            } else if (format === 'octal') {
                return text.split('').map(c => c.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');
            }
        } catch (e) {
            return '';
        }
    }, [text, format]);

    const charBreakdown = useMemo(() => {
        if (!text) return [];
        return text.split('').slice(0, 20).map(c => ({
            char: c,
            code: c.charCodeAt(0),
            binary: c.charCodeAt(0).toString(2).padStart(8, '0'),
            hex: c.charCodeAt(0).toString(16).padStart(2, '0'),
            decimal: c.charCodeAt(0).toString(),
            octal: c.charCodeAt(0).toString(8).padStart(3, '0')
        }));
    }, [text]);

    const faqs = [
        { question: 'What is binary?', answer: 'Binary is the base-2 number system using only 0 and 1. Computers store all data as binary. Each character is represented as 8 bits.' },
        { question: 'What are other formats?', answer: 'Hexadecimal (base-16) uses 0-9 and A-F. Decimal is base-10. Octal (base-8) uses 0-7. All represent character codes differently.' }
    ];

    const seoContent = (<><h2>Text to Binary Converter</h2><p>Convert text to binary, hexadecimal, decimal, or octal codes. See how computers represent text data. Educational and useful for programmers.</p></>);

    return (
        <ToolLayout title="Text to Binary Converter" description="Convert text to binary, hex, decimal, or octal codes." keywords={['text to binary', 'binary converter', 'ASCII binary', 'text encoder', 'hex encoder']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="format-toggle">
                    <button className={`format-btn ${format === 'binary' ? 'active' : ''}`} onClick={() => setFormat('binary')}>
                        Binary
                    </button>
                    <button className={`format-btn ${format === 'hex' ? 'active' : ''}`} onClick={() => setFormat('hex')}>
                        Hexadecimal
                    </button>
                    <button className={`format-btn ${format === 'decimal' ? 'active' : ''}`} onClick={() => setFormat('decimal')}>
                        Decimal
                    </button>
                    <button className={`format-btn ${format === 'octal' ? 'active' : ''}`} onClick={() => setFormat('octal')}>
                        Octal
                    </button>
                </div>

                <div className="input-header">
                    <label className="form-label">Enter Text</label>
                    <ClearButton onClear={() => setText('')} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea
                    className="form-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="Type your text here..."
                />

                {result && (
                    <div className="result-box">
                        <div className="result-header">
                            <span className="result-title">
                                {format === 'binary' && '🔢 Binary'}
                                {format === 'hex' && '🔠 Hexadecimal'}
                                {format === 'decimal' && '🔟 Decimal'}
                                {format === 'octal' && '8⃣ Octal'}
                            </span>
                            <div className="result-actions">
                                <CopyButton text={result} label="Copy" size="sm" />
                                <DownloadButton content={result} filename={`encoded-${format}.txt`} label="Download" size="sm" />
                            </div>
                        </div>
                        <div className="code-output">{result}</div>
                    </div>
                )}

                {charBreakdown.length > 0 && (
                    <div className="breakdown-section">
                        <h4 className="section-title">
                            Character Breakdown
                            {text.length > 20 && <span className="muted">(showing first 20)</span>}
                        </h4>
                        <div className="breakdown-table">
                            <div className="table-header">
                                <span>Char</span>
                                <span>Binary</span>
                                <span>Hex</span>
                                <span>Dec</span>
                                <span>Oct</span>
                            </div>
                            {charBreakdown.map((c, i) => (
                                <div key={i} className={`table-row ${format}`}>
                                    <span className="char-cell">{c.char === ' ' ? '␣' : c.char}</span>
                                    <span className={format === 'binary' ? 'highlight' : ''}>{c.binary}</span>
                                    <span className={format === 'hex' ? 'highlight' : ''}>{c.hex}</span>
                                    <span className={format === 'decimal' ? 'highlight' : ''}>{c.decimal}</span>
                                    <span className={format === 'octal' ? 'highlight' : ''}>{c.octal}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 700px; margin: 0 auto; }
                .format-toggle {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-lg);
                }
                .format-btn {
                    padding: var(--spacing-sm) var(--spacing-md);
                    border: 2px solid var(--platinum);
                    border-radius: var(--radius);
                    background: var(--bg-secondary);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .format-btn.active {
                    border-color: var(--yinmn-blue);
                    background: rgba(72, 86, 150, 0.1);
                    color: var(--yinmn-blue);
                }
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
                    transition: border-color 0.2s;
                }
                .form-input:focus {
                    outline: none;
                    border-color: var(--yinmn-blue);
                }
                .result-box {
                    margin-top: var(--spacing-lg);
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    border-radius: var(--radius);
                    padding: var(--spacing-md);
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
                    color: white;
                }
                .result-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .code-output {
                    background: rgba(0, 255, 100, 0.05);
                    color: #4ade80;
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    font-family: var(--font-mono, monospace);
                    word-break: break-all;
                    line-height: 1.8;
                    font-size: var(--text-sm);
                }
                .breakdown-section {
                    margin-top: var(--spacing-xl);
                }
                .section-title {
                    font-size: var(--text-base);
                    margin-bottom: var(--spacing-md);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                }
                .muted {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    font-weight: normal;
                }
                .breakdown-table {
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    overflow: hidden;
                    font-family: var(--font-mono, monospace);
                    font-size: var(--text-sm);
                }
                .table-header, .table-row {
                    display: grid;
                    grid-template-columns: 60px repeat(4, 1fr);
                    gap: var(--spacing-sm);
                    padding: var(--spacing-sm) var(--spacing-md);
                }
                .table-header {
                    background: var(--yinmn-blue);
                    color: white;
                    font-weight: 600;
                }
                .table-row {
                    border-bottom: 1px solid var(--platinum);
                }
                .table-row:last-child {
                    border-bottom: none;
                }
                .char-cell {
                    font-weight: 600;
                    text-align: center;
                    background: white;
                    border-radius: 4px;
                    padding: 2px;
                }
                .table-row .highlight {
                    color: var(--yinmn-blue);
                    font-weight: 600;
                }
                @media(max-width: 600px) {
                    .format-toggle { grid-template-columns: repeat(2, 1fr); }
                    .table-header, .table-row { 
                        grid-template-columns: 40px repeat(4, 1fr);
                        font-size: var(--text-xs);
                    }
                }
            `}</style>
        </ToolLayout>
    );
};

export default TextToBinary;
