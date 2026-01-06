import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import ClearButton from '../../ui/ClearButton';

const BinaryToText = () => {
    const [binary, setBinary] = useState('');
    const [text, setText] = useState('');
    const [format, setFormat] = useState('binary'); // 'binary', 'hex', 'decimal'
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'binary-to-text').slice(0, 3);

    const convert = () => {
        if (!binary.trim()) {
            toast.warning('Please enter some data to convert');
            return;
        }

        try {
            const values = binary.trim().split(/\s+/);
            let result = '';

            if (format === 'binary') {
                result = values.map(b => {
                    const num = parseInt(b, 2);
                    if (isNaN(num)) throw new Error('Invalid binary');
                    return String.fromCharCode(num);
                }).join('');
            } else if (format === 'hex') {
                result = values.map(h => {
                    const num = parseInt(h, 16);
                    if (isNaN(num)) throw new Error('Invalid hex');
                    return String.fromCharCode(num);
                }).join('');
            } else if (format === 'decimal') {
                result = values.map(d => {
                    const num = parseInt(d, 10);
                    if (isNaN(num)) throw new Error('Invalid decimal');
                    return String.fromCharCode(num);
                }).join('');
            }

            setText(result);
            toast.success('Converted successfully!');
        } catch (e) {
            setText('');
            toast.error('Invalid input format');
        }
    };

    const loadExample = () => {
        if (format === 'binary') {
            setBinary('01001000 01100101 01101100 01101100 01101111');
        } else if (format === 'hex') {
            setBinary('48 65 6c 6c 6f');
        } else {
            setBinary('72 101 108 108 111');
        }
    };

    const faqs = [
        { question: 'What formats are supported?', answer: 'Binary (8-bit bytes like 01001000), Hexadecimal (like 48 65), and Decimal ASCII codes (like 72 101).' },
        { question: 'How should values be separated?', answer: 'Separate each byte/value with spaces. The tool will convert each value to its corresponding character.' }
    ];

    const seoContent = (<><h2>Binary to Text Converter</h2><p>Convert binary, hexadecimal, or decimal codes back to readable text. Decode binary data to reveal the original message.</p></>);

    return (
        <ToolLayout title="Binary to Text Converter" description="Convert binary, hex, or decimal codes to readable text." keywords={['binary to text', 'binary decoder', 'hex decoder', 'binary converter']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="format-toggle">
                    <button className={`format-btn ${format === 'binary' ? 'active' : ''}`} onClick={() => setFormat('binary')}>
                        Binary (01010)
                    </button>
                    <button className={`format-btn ${format === 'hex' ? 'active' : ''}`} onClick={() => setFormat('hex')}>
                        Hexadecimal (4A)
                    </button>
                    <button className={`format-btn ${format === 'decimal' ? 'active' : ''}`} onClick={() => setFormat('decimal')}>
                        Decimal (65)
                    </button>
                </div>

                <div className="input-header">
                    <label className="form-label">
                        Enter {format === 'binary' ? 'Binary' : format === 'hex' ? 'Hexadecimal' : 'Decimal'} (space-separated)
                    </label>
                    <div className="header-actions">
                        <button className="example-btn" onClick={loadExample}>Load Example</button>
                        <ClearButton onClear={() => { setBinary(''); setText(''); }} hasContent={binary.length > 0} size="sm" />
                    </div>
                </div>
                <textarea
                    className="form-input code-input"
                    value={binary}
                    onChange={(e) => setBinary(e.target.value)}
                    rows={4}
                    placeholder={format === 'binary' ? '01001000 01100101 01101100 01101100 01101111' : format === 'hex' ? '48 65 6c 6c 6f' : '72 101 108 108 111'}
                />

                <button className="btn btn-primary btn-lg convert-btn" onClick={convert}>
                    🔄 Convert to Text
                </button>

                {text && (
                    <div className="result-box">
                        <div className="result-header">
                            <span className="result-title">Decoded Text</span>
                            <CopyButton text={text} label="Copy" size="sm" />
                        </div>
                        <div className="text-output">{text}</div>
                    </div>
                )}
            </div>
            <style>{`
                .tool-form { max-width: 700px; margin: 0 auto; }
                .format-toggle {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
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
                    font-size: var(--text-sm);
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
                    flex-wrap: wrap;
                    gap: var(--spacing-sm);
                }
                .header-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .example-btn {
                    padding: var(--spacing-xs) var(--spacing-sm);
                    border: 1px solid var(--platinum);
                    border-radius: var(--radius);
                    background: transparent;
                    cursor: pointer;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    transition: all 0.2s;
                }
                .example-btn:hover {
                    background: var(--bg-secondary);
                    color: var(--yinmn-blue);
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
                .code-input {
                    font-family: var(--font-mono, monospace);
                    letter-spacing: 1px;
                }
                .convert-btn {
                    width: 100%;
                    margin-top: var(--spacing-md);
                    padding: var(--spacing-md);
                    font-size: var(--text-lg);
                }
                .result-box {
                    margin-top: var(--spacing-lg);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    padding: var(--spacing-md);
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
                .text-output {
                    background: white;
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    font-size: var(--text-xl);
                    text-align: center;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    word-break: break-word;
                }
                @media(max-width: 480px) {
                    .format-toggle { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default BinaryToText;
