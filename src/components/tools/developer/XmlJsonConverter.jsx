import { useState, useCallback } from 'react';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const XmlJsonConverter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('xmlToJson');
    const [error, setError] = useState('');
    const [options, setOptions] = useState({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        indentSize: 2
    });

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'xml-json-converter').slice(0, 3);

    const convert = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter some content to convert');
            return;
        }

        try {
            if (mode === 'xmlToJson') {
                const parser = new XMLParser({
                    ignoreAttributes: options.ignoreAttributes,
                    attributeNamePrefix: options.attributeNamePrefix,
                    allowBooleanAttributes: true
                });
                const result = parser.parse(input);
                setOutput(JSON.stringify(result, null, options.indentSize));
            } else {
                const parsed = JSON.parse(input);
                const builder = new XMLBuilder({
                    ignoreAttributes: options.ignoreAttributes,
                    attributeNamePrefix: options.attributeNamePrefix,
                    format: true,
                    indentBy: ' '.repeat(options.indentSize)
                });
                setOutput(builder.build(parsed));
            }
            setError('');
        } catch (err) {
            setError(`Conversion error: ${err.message}`);
            setOutput('');
        }
    }, [input, mode, options]);

    const swap = () => {
        setInput(output);
        setOutput('');
        setMode(mode === 'xmlToJson' ? 'jsonToXml' : 'xmlToJson');
        setError('');
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        const btn = document.querySelector('.xml-copy-btn');
        if (btn) {
            btn.textContent = '✓ Copied';
            setTimeout(() => btn.textContent = '📋 Copy', 1500);
        }
    };

    const clear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    const loadSample = () => {
        if (mode === 'xmlToJson') {
            setInput(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction" isbn="978-0-123456-78-9">
    <title lang="en">The Great Novel</title>
    <author>John Smith</author>
    <year>2024</year>
    <price currency="USD">29.99</price>
  </book>
  <book category="non-fiction" isbn="978-0-987654-32-1">
    <title lang="en">Learning XML</title>
    <author>Jane Doe</author>
    <year>2023</year>
    <price currency="USD">39.99</price>
  </book>
  <metadata>
    <updated>2024-01-15</updated>
    <total>2</total>
  </metadata>
</bookstore>`);
        } else {
            setInput(`{
  "bookstore": {
    "book": [
      {
        "@_category": "fiction",
        "@_isbn": "978-0-123456-78-9",
        "title": "The Great Novel",
        "author": "John Smith",
        "year": 2024,
        "price": 29.99
      },
      {
        "@_category": "non-fiction",
        "@_isbn": "978-0-987654-32-1",
        "title": "Learning XML",
        "author": "Jane Doe",
        "year": 2023,
        "price": 39.99
      }
    ],
    "metadata": {
      "updated": "2024-01-15",
      "total": 2
    }
  }
}`);
        }
        setOutput('');
        setError('');
    };

    const faqs = [
        { question: 'How are XML attributes handled?', answer: 'Attributes are prefixed with "@_" by default (e.g., @_id, @_class). You can ignore attributes or customize the prefix in the options.' },
        { question: 'What about namespaces?', answer: 'XML namespaces are preserved in the conversion. The parser handles namespace prefixes correctly.' },
        { question: 'Can I convert invalid XML?', answer: 'The converter requires well-formed XML. Invalid XML will produce an error with details about the issue.' }
    ];

    const seoContent = (
        <>
            <h2>XML ↔ JSON Converter</h2>
            <p>Convert between XML and JSON formats. Transform API responses, configuration files, and data structures with full attribute support.</p>
            <h3>Features</h3>
            <ul>
                <li><strong>Bi-directional:</strong> Convert XML to JSON or JSON to XML</li>
                <li><strong>Attribute Handling:</strong> Preserve or ignore XML attributes</li>
                <li><strong>Pretty Print:</strong> Formatted output with customizable indentation</li>
                <li><strong>Error Details:</strong> Clear error messages for invalid input</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="XML ↔ JSON Converter"
            description="Convert between XML and JSON formats. Transform data structures with full attribute support."
            keywords={['XML to JSON', 'JSON to XML', 'XML converter', 'JSON converter', 'data transformation']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'xmlToJson' ? 'active' : ''}`}
                        onClick={() => { setMode('xmlToJson'); setInput(''); setOutput(''); setError(''); }}
                    >
                        XML → JSON
                    </button>
                    <button
                        className={`mode-btn ${mode === 'jsonToXml' ? 'active' : ''}`}
                        onClick={() => { setMode('jsonToXml'); setInput(''); setOutput(''); setError(''); }}
                    >
                        JSON → XML
                    </button>
                </div>

                <div className="options-row">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.ignoreAttributes}
                            onChange={(e) => setOptions({ ...options, ignoreAttributes: e.target.checked })}
                        />
                        Ignore Attributes
                    </label>
                    <div className="option-group">
                        <label className="option-label">Indent</label>
                        <select
                            className="form-select"
                            value={options.indentSize}
                            onChange={(e) => setOptions({ ...options, indentSize: parseInt(e.target.value) })}
                        >
                            <option value={2}>2 spaces</option>
                            <option value={4}>4 spaces</option>
                        </select>
                    </div>
                </div>

                <div className="converter-grid">
                    <div className="input-section">
                        <div className="label-row">
                            <label className="form-label">
                                Input {mode === 'xmlToJson' ? 'XML' : 'JSON'}
                            </label>
                            <button className="link-btn" onClick={loadSample}>Load Sample</button>
                        </div>
                        <textarea
                            className="form-input mono"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={18}
                            placeholder={mode === 'xmlToJson' ? 'Paste your XML here...' : 'Paste your JSON here...'}
                            spellCheck={false}
                        />
                    </div>

                    <div className="output-section">
                        <div className="label-row">
                            <label className="form-label">
                                Output {mode === 'xmlToJson' ? 'JSON' : 'XML'}
                            </label>
                            {output && <button className="copy-btn xml-copy-btn" onClick={copy}>📋 Copy</button>}
                        </div>
                        <textarea
                            className="form-input mono output"
                            value={output}
                            readOnly
                            rows={18}
                            placeholder="Converted output will appear here..."
                        />
                    </div>
                </div>

                <div className="btn-group-center">
                    <button className="btn btn-primary" onClick={convert}>🔄 Convert</button>
                    <button className="btn btn-secondary" onClick={swap} disabled={!output}>⇄ Swap</button>
                    <button className="btn btn-outline" onClick={clear}>🗑️ Clear</button>
                </div>

                {error && <div className="error-box">{error}</div>}
            </div>

            <style>{`
                .tool-form { max-width: 1100px; margin: 0 auto; }
                .mode-selector { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg); background: var(--ghost-white); padding: var(--spacing-sm); border-radius: var(--radius); }
                .mode-btn { flex: 1; padding: var(--spacing-sm) var(--spacing-md); border: 2px solid transparent; background: transparent; border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .mode-btn:hover { background: white; }
                .mode-btn.active { background: white; border-color: var(--yinmn-blue); color: var(--yinmn-blue); }
                .options-row { display: flex; gap: var(--spacing-xl); align-items: center; margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: var(--ghost-white); border-radius: var(--radius); flex-wrap: wrap; }
                .checkbox-label { display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; font-size: var(--text-sm); }
                .checkbox-label input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--yinmn-blue); cursor: pointer; }
                .option-group { display: flex; align-items: center; gap: var(--spacing-sm); }
                .option-label { font-size: var(--text-sm); font-weight: 500; color: var(--dim-gray); }
                .form-select { padding: var(--spacing-sm) var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-sm); cursor: pointer; background: white; }
                .converter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg); }
                @media (max-width: 768px) { .converter-grid { grid-template-columns: 1fr; } }
                .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm); }
                .form-label { font-weight: 600; color: var(--jet); }
                .link-btn { background: none; border: none; color: var(--yinmn-blue); cursor: pointer; font-size: var(--text-sm); text-decoration: underline; }
                .form-input { width: 100%; padding: var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-base); transition: border-color 0.2s; resize: vertical; }
                .form-input:focus { outline: none; border-color: var(--yinmn-blue); }
                .form-input.mono { font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.5; }
                .form-input.output { background: var(--ghost-white); }
                .btn-group-center { display: flex; justify-content: center; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); flex-wrap: wrap; }
                .btn { padding: var(--spacing-sm) var(--spacing-lg); border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
                .btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .btn-primary { background: linear-gradient(135deg, var(--yinmn-blue), var(--oxford-blue)); color: white; }
                .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(66, 90, 157, 0.3); }
                .btn-secondary { background: var(--ghost-white); color: var(--jet); border-color: var(--platinum); }
                .btn-secondary:hover:not(:disabled) { background: var(--platinum); }
                .btn-outline { background: transparent; color: var(--jet); border-color: var(--platinum); }
                .btn-outline:hover { background: var(--ghost-white); }
                .error-box { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; padding: var(--spacing-md); border-radius: var(--radius); border-left: 4px solid #ef4444; }
                .copy-btn { background: var(--yinmn-blue); color: white; border: none; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius); cursor: pointer; font-size: var(--text-sm); font-weight: 500; transition: all 0.2s; }
                .copy-btn:hover { background: var(--oxford-blue); }
            `}</style>
        </ToolLayout>
    );
};

export default XmlJsonConverter;
