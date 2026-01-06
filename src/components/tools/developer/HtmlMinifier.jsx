import { useState, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const HtmlMinifier = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState(null);
    const [error, setError] = useState('');
    const [options, setOptions] = useState({
        removeComments: true,
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeOptionalTags: false,
        minifyCSS: true,
        minifyJS: true
    });

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'html-minifier').slice(0, 3);

    const minify = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter HTML code');
            return;
        }

        try {
            let result = input;

            // Remove HTML comments (but keep conditional comments)
            if (options.removeComments) {
                result = result.replace(/<!--(?!\[)[\s\S]*?-->/g, '');
            }

            // Collapse whitespace between tags
            if (options.collapseWhitespace) {
                result = result
                    .replace(/>\s+</g, '><')
                    .replace(/\s{2,}/g, ' ')
                    .replace(/\n\s*\n/g, '\n')
                    .replace(/^\s+|\s+$/gm, '');
            }

            // Remove empty attributes like class=""
            if (options.removeEmptyAttributes) {
                result = result.replace(/\s+(\w+)=["']{2}/g, '');
            }

            // Remove optional closing tags
            if (options.removeOptionalTags) {
                result = result
                    .replace(/<\/li>/gi, '')
                    .replace(/<\/dt>/gi, '')
                    .replace(/<\/dd>/gi, '')
                    .replace(/<\/p>/gi, '')
                    .replace(/<\/option>/gi, '');
            }

            // Minify inline CSS
            if (options.minifyCSS) {
                result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
                    const minifiedCSS = css
                        .replace(/\/\*[\s\S]*?\*\//g, '')
                        .replace(/\s+/g, ' ')
                        .replace(/\s*{\s*/g, '{')
                        .replace(/\s*}\s*/g, '}')
                        .replace(/\s*:\s*/g, ':')
                        .replace(/\s*;\s*/g, ';')
                        .replace(/;}/g, '}')
                        .trim();
                    return match.replace(css, minifiedCSS);
                });
            }

            // Minify inline JavaScript
            if (options.minifyJS) {
                result = result.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, js) => {
                    if (!js.trim()) return match;
                    const minifiedJS = js
                        .replace(/\/\/[^\n]*/g, '')
                        .replace(/\/\*[\s\S]*?\*\//g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                    return match.replace(js, minifiedJS);
                });
            }

            result = result.trim();

            const original = new Blob([input]).size;
            const minified = new Blob([result]).size;
            const saved = original - minified;
            const percent = original > 0 ? Math.round((saved / original) * 100) : 0;

            setOutput(result);
            setStats({ original, minified, saved, percent });
            setError('');
        } catch (err) {
            setError(`Minification error: ${err.message}`);
            setOutput('');
            setStats(null);
        }
    }, [input, options]);

    const beautify = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter HTML code');
            return;
        }

        try {
            let result = input;

            // Self-closing tags
            const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

            // Add newlines after closing tags and self-closing tags
            result = result.replace(/></g, '>\n<');

            // Format with indentation
            const lines = result.split('\n');
            let indent = 0;
            const formatted = lines.map(line => {
                const trimmed = line.trim();
                if (!trimmed) return '';

                // Decrease indent for closing tags
                if (trimmed.startsWith('</')) {
                    indent = Math.max(0, indent - 1);
                }

                const indented = '  '.repeat(indent) + trimmed;

                // Increase indent for opening tags (but not self-closing)
                const tagMatch = trimmed.match(/^<([a-z0-9]+)/i);
                if (tagMatch && !selfClosing.includes(tagMatch[1].toLowerCase())) {
                    if (!trimmed.startsWith('</') && !trimmed.endsWith('/>') && !trimmed.includes('</')) {
                        indent++;
                    }
                }

                return indented;
            }).filter(Boolean).join('\n');

            setOutput(formatted);
            setStats(null);
            setError('');
        } catch (err) {
            setError(`Beautify error: ${err.message}`);
        }
    }, [input]);

    const copy = () => {
        navigator.clipboard.writeText(output);
        const btn = document.querySelector('.html-copy-btn');
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
        setInput(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: #333;
            color: white;
        }
    </style>
</head>
<body>
    <!-- Main content area -->
    <div class="container">
        <header class="header">
            <h1>Welcome to My Site</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
        
        <main>
            <article>
                <h2>Article Title</h2>
                <p>This is a sample paragraph with some text content.</p>
            </article>
        </main>
    </div>
    
    <script>
        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Page loaded');
        });
    </script>
</body>
</html>`);
        setOutput('');
        setStats(null);
        setError('');
    };

    const faqs = [
        { question: 'Why minify HTML?', answer: 'Minified HTML loads faster, reduces bandwidth, and improves page speed scores. Every byte saved helps, especially for high-traffic sites.' },
        { question: 'Will minification break my HTML?', answer: 'Proper minification preserves functionality. Our tool only removes unnecessary whitespace and comments, keeping your HTML valid.' },
        { question: 'Should I minify inline CSS and JavaScript?', answer: 'Yes, minifying inline styles and scripts provides additional size reduction. For larger scripts, consider external files with dedicated minifiers.' }
    ];

    const seoContent = (
        <>
            <h2>HTML Minifier & Beautifier</h2>
            <p>Reduce HTML file size by removing unnecessary whitespace, comments, and empty attributes. Improve page load speed and Core Web Vitals scores.</p>
            <h3>Minification Options</h3>
            <ul>
                <li><strong>Remove Comments:</strong> Strip HTML comments to reduce size</li>
                <li><strong>Collapse Whitespace:</strong> Remove extra spaces and line breaks</li>
                <li><strong>Remove Empty Attributes:</strong> Clean up empty class="" or id="" attributes</li>
                <li><strong>Minify Inline CSS/JS:</strong> Compress embedded styles and scripts</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="HTML Minifier & Beautifier"
            description="Minify or beautify HTML code. Remove comments, collapse whitespace, and optimize for faster loading."
            keywords={['HTML minifier', 'minify HTML', 'HTML beautifier', 'compress HTML', 'HTML optimizer']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="form-group">
                    <div className="label-row">
                        <label className="form-label">Input HTML</label>
                        <button className="link-btn" onClick={loadSample}>Load Sample</button>
                    </div>
                    <textarea
                        className="form-input mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={12}
                        placeholder="Paste your HTML code here..."
                        spellCheck={false}
                    />
                </div>

                <div className="options-grid">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.removeComments}
                            onChange={(e) => setOptions({ ...options, removeComments: e.target.checked })}
                        />
                        Remove Comments
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.collapseWhitespace}
                            onChange={(e) => setOptions({ ...options, collapseWhitespace: e.target.checked })}
                        />
                        Collapse Whitespace
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.removeEmptyAttributes}
                            onChange={(e) => setOptions({ ...options, removeEmptyAttributes: e.target.checked })}
                        />
                        Remove Empty Attributes
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.removeOptionalTags}
                            onChange={(e) => setOptions({ ...options, removeOptionalTags: e.target.checked })}
                        />
                        Remove Optional Tags
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.minifyCSS}
                            onChange={(e) => setOptions({ ...options, minifyCSS: e.target.checked })}
                        />
                        Minify Inline CSS
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.minifyJS}
                            onChange={(e) => setOptions({ ...options, minifyJS: e.target.checked })}
                        />
                        Minify Inline JavaScript
                    </label>
                </div>

                <div className="btn-group">
                    <button className="btn btn-primary" onClick={minify}>🗜️ Minify</button>
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
                            <button className="copy-btn html-copy-btn" onClick={copy}>📋 Copy</button>
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
                .tool-form { max-width: 900px; margin: 0 auto; }
                .form-group { margin-bottom: var(--spacing-lg); }
                .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm); }
                .form-label { font-weight: 600; color: var(--jet); }
                .link-btn { background: none; border: none; color: var(--yinmn-blue); cursor: pointer; font-size: var(--text-sm); text-decoration: underline; }
                .link-btn:hover { color: var(--oxford-blue); }
                .form-input { width: 100%; padding: var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-base); transition: border-color 0.2s; resize: vertical; }
                .form-input:focus { outline: none; border-color: var(--yinmn-blue); }
                .form-input.mono { font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.5; }
                .form-input.output { background: var(--ghost-white); }
                .options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--spacing-md); margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: var(--ghost-white); border-radius: var(--radius); }
                .checkbox-label { display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; font-size: var(--text-sm); }
                .checkbox-label input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--yinmn-blue); cursor: pointer; }
                .btn-group { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); flex-wrap: wrap; }
                .btn { padding: var(--spacing-sm) var(--spacing-lg); border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
                .btn-primary { background: linear-gradient(135deg, var(--yinmn-blue), var(--oxford-blue)); color: white; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(66, 90, 157, 0.3); }
                .btn-secondary { background: var(--ghost-white); color: var(--jet); border-color: var(--platinum); }
                .btn-secondary:hover { background: var(--platinum); }
                .btn-outline { background: transparent; color: var(--jet); border-color: var(--platinum); }
                .btn-outline:hover { background: var(--ghost-white); }
                .error-box { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; padding: var(--spacing-md); border-radius: var(--radius); margin-bottom: var(--spacing-lg); border-left: 4px solid #ef4444; }
                .stats-box { display: flex; gap: var(--spacing-lg); background: linear-gradient(135deg, var(--ghost-white), #f0f4ff); padding: var(--spacing-lg); border-radius: var(--radius); margin-bottom: var(--spacing-lg); flex-wrap: wrap; }
                .stat { flex: 1; min-width: 120px; text-align: center; }
                .stat-label { display: block; font-size: var(--text-sm); color: var(--dim-gray); margin-bottom: var(--spacing-xs); }
                .stat-value { font-weight: 700; font-size: var(--text-lg); color: var(--jet); }
                .stat.highlight .stat-value { color: var(--success); }
                .result-section { margin-top: var(--spacing-lg); }
                .copy-btn { background: var(--yinmn-blue); color: white; border: none; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius); cursor: pointer; font-size: var(--text-sm); font-weight: 500; transition: all 0.2s; }
                .copy-btn:hover { background: var(--oxford-blue); }
            `}</style>
        </ToolLayout>
    );
};

export default HtmlMinifier;
