import { useState, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const JavaScriptMinifier = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'javascript-minifier').slice(0, 3);

    const minify = useCallback(async () => {
        if (!input.trim()) {
            setError('Please enter JavaScript code');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const { minify: terserMinify } = await import('terser');
            const result = await terserMinify(input, {
                compress: {
                    dead_code: true,
                    drop_debugger: true,
                    conditionals: true,
                    evaluate: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    sequences: true,
                },
                mangle: true,
                format: {
                    comments: false
                }
            });

            if (result.code) {
                const original = new Blob([input]).size;
                const minified = new Blob([result.code]).size;
                const saved = original - minified;
                const percent = original > 0 ? Math.round((saved / original) * 100) : 0;

                setOutput(result.code);
                setStats({ original, minified, saved, percent });
                setError('');
            }
        } catch (err) {
            setError(`Minification error: ${err.message}`);
            setOutput('');
            setStats(null);
        } finally {
            setIsProcessing(false);
        }
    }, [input]);

    const beautify = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter JavaScript code');
            return;
        }

        try {
            // Simple beautifier - add proper indentation
            let formatted = input
                .replace(/([{;])\s*/g, '$1\n')
                .replace(/\}/g, '\n}')
                .replace(/,\s*/g, ', ')
                .replace(/\n\s*\n/g, '\n');

            // Add indentation
            const lines = formatted.split('\n');
            let indent = 0;
            const indented = lines.map(line => {
                const trimmed = line.trim();
                if (!trimmed) return '';

                if (trimmed.startsWith('}') || trimmed.startsWith(')') || trimmed.startsWith(']')) {
                    indent = Math.max(0, indent - 1);
                }

                const result = '  '.repeat(indent) + trimmed;

                if (trimmed.endsWith('{') || trimmed.endsWith('(') || trimmed.endsWith('[')) {
                    indent++;
                }

                return result;
            }).filter(Boolean).join('\n');

            setOutput(indented);
            setStats(null);
            setError('');
        } catch (err) {
            setError(`Beautify error: ${err.message}`);
        }
    }, [input]);

    const copy = () => {
        navigator.clipboard.writeText(output);
        // Simple feedback
        const btn = document.querySelector('.js-copy-btn');
        if (btn) {
            btn.textContent = '✓ Copied';
            setTimeout(() => btn.textContent = '📋 Copy', 1500);
        }
    };

    const clear = () => {
        setInput('');
        setOutput('');
        setStats(null);
        setError('');
    };

    const loadSample = () => {
        setInput(`// Sample JavaScript
function greet(name) {
    const message = "Hello, " + name + "!";
    console.log(message);
    return message;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(function(n) {
    return n * 2;
});

class Calculator {
    constructor() {
        this.result = 0;
    }
    
    add(value) {
        this.result += value;
        return this;
    }
    
    subtract(value) {
        this.result -= value;
        return this;
    }
    
    getResult() {
        return this.result;
    }
}`);
        setOutput('');
        setStats(null);
        setError('');
    };

    const faqs = [
        { question: 'Why minify JavaScript?', answer: 'Minified JavaScript loads faster, reduces bandwidth usage, and improves page performance. Essential for production websites.' },
        { question: 'What does minification do?', answer: 'It removes whitespace, comments, shortens variable names, and optimizes code structure while preserving functionality.' },
        { question: 'Is minified code reversible?', answer: 'Not completely. While you can beautify minified code, original variable names and comments are lost forever.' }
    ];

    const seoContent = (
        <>
            <h2>JavaScript Minifier & Beautifier</h2>
            <p>Minify JavaScript code to reduce file size and improve page load speed. Our tool uses Terser, the same minifier used by modern build tools like Webpack and Rollup.</p>
            <h3>Features</h3>
            <ul>
                <li><strong>Advanced Compression:</strong> Dead code elimination, constant folding, and more</li>
                <li><strong>Variable Mangling:</strong> Shortens variable names for smaller output</li>
                <li><strong>Size Statistics:</strong> See exactly how much space you saved</li>
                <li><strong>Beautify Mode:</strong> Format minified code for readability</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="JavaScript Minifier & Beautifier"
            description="Minify or beautify JavaScript code. Reduce JS file size for faster loading using Terser."
            keywords={['JavaScript minifier', 'minify JS', 'JavaScript beautifier', 'compress JavaScript', 'terser']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="form-group">
                    <div className="label-row">
                        <label className="form-label">Input JavaScript</label>
                        <button className="link-btn" onClick={loadSample}>Load Sample</button>
                    </div>
                    <textarea
                        className="form-input mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={12}
                        placeholder="Paste your JavaScript code here..."
                        spellCheck={false}
                    />
                </div>

                <div className="btn-group">
                    <button
                        className="btn btn-primary"
                        onClick={minify}
                        disabled={isProcessing}
                    >
                        {isProcessing ? '⏳ Minifying...' : '🗜️ Minify'}
                    </button>
                    <button className="btn btn-secondary" onClick={beautify}>✨ Beautify</button>
                    <button className="btn btn-outline" onClick={clear}>🗑️ Clear</button>
                </div>

                {error && <div className="error-box">{error}</div>}

                {stats && (
                    <div className="stats-box">
                        <div className="stat">
                            <span className="stat-label">Original</span>
                            <span className="stat-value">{stats.original.toLocaleString()} bytes</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Minified</span>
                            <span className="stat-value">{stats.minified.toLocaleString()} bytes</span>
                        </div>
                        <div className="stat highlight">
                            <span className="stat-label">Saved</span>
                            <span className="stat-value">{stats.saved.toLocaleString()} bytes ({stats.percent}%)</span>
                        </div>
                    </div>
                )}

                {output && (
                    <div className="result-section">
                        <div className="label-row">
                            <label className="form-label">Output</label>
                            <button className="copy-btn js-copy-btn" onClick={copy}>📋 Copy</button>
                        </div>
                        <textarea
                            className="form-input mono output"
                            value={output}
                            readOnly
                            rows={12}
                        />
                    </div>
                )}
            </div>

            <style>{`
                .tool-form {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .form-group {
                    margin-bottom: var(--spacing-lg);
                }
                .label-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: var(--spacing-sm);
                }
                .form-label {
                    font-weight: 600;
                    color: var(--jet);
                }
                .link-btn {
                    background: none;
                    border: none;
                    color: var(--yinmn-blue);
                    cursor: pointer;
                    font-size: var(--text-sm);
                    text-decoration: underline;
                }
                .link-btn:hover {
                    color: var(--oxford-blue);
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
                .form-input.mono {
                    font-family: var(--font-mono);
                    font-size: var(--text-sm);
                    line-height: 1.5;
                }
                .form-input.output {
                    background: var(--ghost-white);
                }
                .btn-group {
                    display: flex;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }
                .btn {
                    padding: var(--spacing-sm) var(--spacing-lg);
                    border-radius: var(--radius);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 2px solid transparent;
                }
                .btn-primary {
                    background: linear-gradient(135deg, var(--yinmn-blue), var(--oxford-blue));
                    color: white;
                }
                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(66, 90, 157, 0.3);
                }
                .btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .btn-secondary {
                    background: var(--ghost-white);
                    color: var(--jet);
                    border-color: var(--platinum);
                }
                .btn-secondary:hover {
                    background: var(--platinum);
                }
                .btn-outline {
                    background: transparent;
                    color: var(--jet);
                    border-color: var(--platinum);
                }
                .btn-outline:hover {
                    background: var(--ghost-white);
                }
                .error-box {
                    background: linear-gradient(135deg, #fee2e2, #fecaca);
                    color: #991b1b;
                    padding: var(--spacing-md);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                    border-left: 4px solid #ef4444;
                }
                .stats-box {
                    display: flex;
                    gap: var(--spacing-lg);
                    background: linear-gradient(135deg, var(--ghost-white), #f0f4ff);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    margin-bottom: var(--spacing-lg);
                    flex-wrap: wrap;
                }
                .stat {
                    flex: 1;
                    min-width: 120px;
                    text-align: center;
                }
                .stat-label {
                    display: block;
                    font-size: var(--text-sm);
                    color: var(--dim-gray);
                    margin-bottom: var(--spacing-xs);
                }
                .stat-value {
                    font-weight: 700;
                    font-size: var(--text-lg);
                    color: var(--jet);
                }
                .stat.highlight .stat-value {
                    color: var(--success);
                }
                .result-section {
                    margin-top: var(--spacing-lg);
                }
                .copy-btn {
                    background: var(--yinmn-blue);
                    color: white;
                    border: none;
                    padding: var(--spacing-xs) var(--spacing-md);
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: var(--text-sm);
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .copy-btn:hover {
                    background: var(--oxford-blue);
                }
            `}</style>
        </ToolLayout>
    );
};

export default JavaScriptMinifier;
