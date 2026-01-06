import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import CopyButton from '../../ui/CopyButton';
import ClearButton from '../../ui/ClearButton';

const CaseConverter = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');
    const toast = useToast();
    const relatedTools = toolsData.tools.filter(t => t.category === 'text' && t.id !== 'case-converter').slice(0, 3);

    const convert = (type) => {
        if (!text.trim()) {
            toast.warning('Please enter some text first');
            return;
        }
        let output = text;
        switch (type) {
            case 'upper': output = text.toUpperCase(); break;
            case 'lower': output = text.toLowerCase(); break;
            case 'title': output = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); break;
            case 'sentence': output = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
            case 'toggle': output = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
            case 'capitalize': output = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
            // Developer cases
            case 'camel': output = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()); break;
            case 'pascal': output = text.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase()); break;
            case 'snake': output = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, ''); break;
            case 'kebab': output = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''); break;
            case 'constant': output = text.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, ''); break;
            case 'dot': output = text.toLowerCase().replace(/\s+/g, '.').replace(/[^a-zA-Z0-9.]/g, ''); break;
            // Fun cases
            case 'alternating': output = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''); break;
            case 'inverse-alt': output = text.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''); break;
        }
        setResult(output);
        toast.success('Text converted!');
    };

    const faqs = [
        { question: 'What is Title Case?', answer: 'Title Case capitalizes the first letter of each word. Example: "hello world" becomes "Hello World".' },
        { question: 'What is camelCase?', answer: 'camelCase is used in programming where the first word is lowercase and subsequent words are capitalized. Example: "hello world" becomes "helloWorld".' }
    ];

    const seoContent = (<><h2>Case Converter</h2><p>Convert text between uppercase, lowercase, title case, sentence case, and developer cases like camelCase, snake_case, and more.</p></>);

    return (
        <ToolLayout title="Case Converter" description="Convert text between different cases: uppercase, lowercase, title case, camelCase, snake_case and more." keywords={['case converter', 'uppercase converter', 'lowercase', 'title case', 'camelCase', 'snake_case']} category="text" categoryName="Text & Content" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="input-header">
                    <label className="form-label">Enter your text</label>
                    <ClearButton onClear={() => { setText(''); setResult(''); }} hasContent={text.length > 0} size="sm" />
                </div>
                <textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Enter your text here..." />

                <div className="case-section">
                    <h4 className="section-title">📝 Text Cases</h4>
                    <div className="btn-grid">
                        <button className="btn btn-secondary" onClick={() => convert('upper')}>UPPERCASE</button>
                        <button className="btn btn-secondary" onClick={() => convert('lower')}>lowercase</button>
                        <button className="btn btn-secondary" onClick={() => convert('title')}>Title Case</button>
                        <button className="btn btn-secondary" onClick={() => convert('sentence')}>Sentence case</button>
                        <button className="btn btn-secondary" onClick={() => convert('capitalize')}>Capitalize</button>
                        <button className="btn btn-secondary" onClick={() => convert('toggle')}>tOGGLE cASE</button>
                    </div>
                </div>

                <div className="case-section">
                    <h4 className="section-title">💻 Developer Cases</h4>
                    <div className="btn-grid">
                        <button className="btn btn-dev" onClick={() => convert('camel')}>camelCase</button>
                        <button className="btn btn-dev" onClick={() => convert('pascal')}>PascalCase</button>
                        <button className="btn btn-dev" onClick={() => convert('snake')}>snake_case</button>
                        <button className="btn btn-dev" onClick={() => convert('kebab')}>kebab-case</button>
                        <button className="btn btn-dev" onClick={() => convert('constant')}>CONSTANT_CASE</button>
                        <button className="btn btn-dev" onClick={() => convert('dot')}>dot.case</button>
                    </div>
                </div>

                <div className="case-section">
                    <h4 className="section-title">🎉 Fun Cases</h4>
                    <div className="btn-grid">
                        <button className="btn btn-fun" onClick={() => convert('alternating')}>aLtErNaTiNg</button>
                        <button className="btn btn-fun" onClick={() => convert('inverse-alt')}>AlTeRnAtInG</button>
                    </div>
                </div>

                {result && (
                    <div className="result-box">
                        <div className="result-header">
                            <span className="result-title">Result</span>
                            <CopyButton text={result} label="Copy" size="sm" />
                        </div>
                        <textarea className="form-input result-textarea" value={result} readOnly rows={5} />
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
                .case-section {
                    margin-top: var(--spacing-lg);
                }
                .section-title {
                    font-size: var(--text-sm);
                    color: var(--text-muted);
                    margin-bottom: var(--spacing-sm);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .btn-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--spacing-sm);
                }
                .btn {
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--radius);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                .btn-secondary {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border-color: var(--platinum);
                }
                .btn-secondary:hover {
                    background: var(--yinmn-blue);
                    color: white;
                    border-color: var(--yinmn-blue);
                }
                .btn-dev {
                    background: linear-gradient(135deg, #1e293b, #334155);
                    color: #22d3ee;
                    font-family: var(--font-mono, monospace);
                    font-size: var(--text-sm);
                }
                .btn-dev:hover {
                    background: linear-gradient(135deg, #334155, #475569);
                    transform: translateY(-1px);
                }
                .btn-fun {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                }
                .btn-fun:hover {
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    transform: translateY(-1px);
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
                    color: var(--text-primary);
                }
                .result-textarea {
                    background: white;
                }
                @media(max-width:480px) {
                    .btn-grid { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default CaseConverter;
