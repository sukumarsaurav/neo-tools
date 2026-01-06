import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const CsvJsonConverter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('csvToJson');
    const [error, setError] = useState('');
    const [options, setOptions] = useState({
        delimiter: ',',
        hasHeader: true,
        indentSize: 2
    });

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'csv-json-converter').slice(0, 3);

    const convert = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter some content to convert');
            return;
        }

        try {
            if (mode === 'csvToJson') {
                const result = Papa.parse(input, {
                    delimiter: options.delimiter,
                    header: options.hasHeader,
                    skipEmptyLines: true,
                    dynamicTyping: true
                });

                if (result.errors.length > 0) {
                    setError(`Parse error: ${result.errors[0].message} (row ${result.errors[0].row})`);
                    return;
                }

                setOutput(JSON.stringify(result.data, null, options.indentSize));
            } else {
                const parsed = JSON.parse(input);
                const data = Array.isArray(parsed) ? parsed : [parsed];

                const csv = Papa.unparse(data, {
                    delimiter: options.delimiter,
                    header: options.hasHeader
                });

                setOutput(csv);
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
        setMode(mode === 'csvToJson' ? 'jsonToCsv' : 'csvToJson');
        setError('');
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        const btn = document.querySelector('.csv-copy-btn');
        if (btn) {
            btn.textContent = '✓ Copied';
            setTimeout(() => btn.textContent = '📋 Copy', 1500);
        }
    };

    const download = () => {
        const ext = mode === 'csvToJson' ? 'json' : 'csv';
        const type = mode === 'csvToJson' ? 'application/json' : 'text/csv';
        const blob = new Blob([output], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    const loadSample = () => {
        if (mode === 'csvToJson') {
            setInput(`id,name,email,age,city,active
1,John Smith,john@example.com,32,New York,true
2,Jane Doe,jane@example.com,28,Los Angeles,true
3,Bob Wilson,bob@example.com,45,Chicago,false
4,Alice Brown,alice@example.com,35,Houston,true
5,Charlie Davis,charlie@example.com,29,Phoenix,true`);
        } else {
            setInput(`[
  {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "age": 32,
    "city": "New York",
    "active": true
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "age": 28,
    "city": "Los Angeles",
    "active": true
  },
  {
    "id": 3,
    "name": "Bob Wilson",
    "email": "bob@example.com",
    "age": 45,
    "city": "Chicago",
    "active": false
  }
]`);
        }
        setOutput('');
        setError('');
    };

    const delimiters = [
        { value: ',', label: 'Comma (,)' },
        { value: ';', label: 'Semicolon (;)' },
        { value: '\t', label: 'Tab' },
        { value: '|', label: 'Pipe (|)' }
    ];

    const faqs = [
        { question: 'What delimiters are supported?', answer: 'We support comma, semicolon, tab, and pipe delimiters. Choose the one that matches your CSV format.' },
        { question: 'Does it handle quoted fields?', answer: 'Yes, the converter properly handles quoted fields, including those containing commas or newlines.' },
        { question: 'What about data types?', answer: 'Numbers and booleans are automatically detected and converted to their proper JSON types. Strings remain as strings.' }
    ];

    const seoContent = (
        <>
            <h2>CSV ↔ JSON Converter</h2>
            <p>Convert between CSV and JSON formats instantly. Perfect for data transformation, API integration, and spreadsheet processing.</p>
            <h3>Features</h3>
            <ul>
                <li><strong>Bi-directional:</strong> Convert CSV to JSON or JSON to CSV</li>
                <li><strong>Multiple Delimiters:</strong> Support for comma, semicolon, tab, and pipe</li>
                <li><strong>Header Support:</strong> Option to treat first row as headers</li>
                <li><strong>Type Detection:</strong> Automatically converts numbers and booleans</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="CSV ↔ JSON Converter"
            description="Convert between CSV and JSON formats. Transform spreadsheet data and API responses."
            keywords={['CSV to JSON', 'JSON to CSV', 'CSV converter', 'data transformation', 'spreadsheet converter']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'csvToJson' ? 'active' : ''}`}
                        onClick={() => { setMode('csvToJson'); setInput(''); setOutput(''); setError(''); }}
                    >
                        CSV → JSON
                    </button>
                    <button
                        className={`mode-btn ${mode === 'jsonToCsv' ? 'active' : ''}`}
                        onClick={() => { setMode('jsonToCsv'); setInput(''); setOutput(''); setError(''); }}
                    >
                        JSON → CSV
                    </button>
                </div>

                <div className="options-row">
                    <div className="option-group">
                        <label className="option-label">Delimiter</label>
                        <select
                            className="form-select"
                            value={options.delimiter}
                            onChange={(e) => setOptions({ ...options, delimiter: e.target.value })}
                        >
                            {delimiters.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={options.hasHeader}
                            onChange={(e) => setOptions({ ...options, hasHeader: e.target.checked })}
                        />
                        First Row is Header
                    </label>
                    <div className="option-group">
                        <label className="option-label">JSON Indent</label>
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
                                Input {mode === 'csvToJson' ? 'CSV' : 'JSON'}
                            </label>
                            <button className="link-btn" onClick={loadSample}>Load Sample</button>
                        </div>
                        <textarea
                            className="form-input mono"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={16}
                            placeholder={mode === 'csvToJson' ? 'Paste your CSV here...' : 'Paste your JSON array here...'}
                            spellCheck={false}
                        />
                    </div>

                    <div className="output-section">
                        <div className="label-row">
                            <label className="form-label">
                                Output {mode === 'csvToJson' ? 'JSON' : 'CSV'}
                            </label>
                            <div className="output-actions">
                                {output && (
                                    <>
                                        <button className="copy-btn csv-copy-btn" onClick={copy}>📋 Copy</button>
                                        <button className="copy-btn" onClick={download}>⬇️ Download</button>
                                    </>
                                )}
                            </div>
                        </div>
                        <textarea
                            className="form-input mono output"
                            value={output}
                            readOnly
                            rows={16}
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
                .output-actions { display: flex; gap: var(--spacing-sm); }
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

export default CsvJsonConverter;
