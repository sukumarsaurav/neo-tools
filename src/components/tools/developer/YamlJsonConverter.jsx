import { useState, useCallback } from 'react';
import yaml from 'js-yaml';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const YamlJsonConverter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('yamlToJson');
    const [error, setError] = useState('');
    const [indentSize, setIndentSize] = useState(2);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'yaml-json-converter').slice(0, 3);

    const convert = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter some content to convert');
            return;
        }

        try {
            if (mode === 'yamlToJson') {
                const parsed = yaml.load(input);
                setOutput(JSON.stringify(parsed, null, indentSize));
            } else {
                const parsed = JSON.parse(input);
                setOutput(yaml.dump(parsed, { indent: indentSize, lineWidth: -1 }));
            }
            setError('');
        } catch (err) {
            setError(`Conversion error: ${err.message}`);
            setOutput('');
        }
    }, [input, mode, indentSize]);

    const swap = () => {
        setInput(output);
        setOutput('');
        setMode(mode === 'yamlToJson' ? 'jsonToYaml' : 'yamlToJson');
        setError('');
    };

    const copy = () => {
        navigator.clipboard.writeText(output);
        const btn = document.querySelector('.yaml-copy-btn');
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
        if (mode === 'yamlToJson') {
            setInput(`# Sample YAML Configuration
server:
  host: localhost
  port: 8080
  ssl: true

database:
  driver: postgres
  connection:
    host: db.example.com
    port: 5432
    name: myapp
  pool:
    min: 5
    max: 20

features:
  - name: authentication
    enabled: true
  - name: caching
    enabled: true
    ttl: 3600
  - name: logging
    enabled: false`);
        } else {
            setInput(`{
  "server": {
    "host": "localhost",
    "port": 8080,
    "ssl": true
  },
  "database": {
    "driver": "postgres",
    "connection": {
      "host": "db.example.com",
      "port": 5432,
      "name": "myapp"
    }
  },
  "features": ["authentication", "caching", "logging"]
}`);
        }
        setOutput('');
        setError('');
    };

    const faqs = [
        { question: 'What is YAML?', answer: 'YAML (YAML Ain\'t Markup Language) is a human-readable data serialization format. It\'s commonly used for configuration files and data exchange.' },
        { question: 'When should I use YAML vs JSON?', answer: 'YAML is more readable and supports comments, making it ideal for configuration files. JSON is more compact and universally supported in APIs.' },
        { question: 'Does this preserve all data types?', answer: 'Yes, the converter maintains data types like strings, numbers, booleans, arrays, and nested objects during conversion.' }
    ];

    const seoContent = (
        <>
            <h2>YAML ↔ JSON Converter</h2>
            <p>Convert between YAML and JSON formats instantly. Perfect for working with configuration files, APIs, and data transformation tasks.</p>
            <h3>Features</h3>
            <ul>
                <li><strong>Bi-directional:</strong> Convert YAML to JSON or JSON to YAML</li>
                <li><strong>Customizable Indentation:</strong> Choose 2 or 4 spaces for output</li>
                <li><strong>Error Messages:</strong> Clear error reporting with details</li>
                <li><strong>Swap Function:</strong> Quickly swap input and output</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="YAML ↔ JSON Converter"
            description="Convert between YAML and JSON formats. Transform configuration files and data structures."
            keywords={['YAML to JSON', 'JSON to YAML', 'YAML converter', 'JSON converter', 'configuration converter']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'yamlToJson' ? 'active' : ''}`}
                        onClick={() => { setMode('yamlToJson'); setInput(''); setOutput(''); setError(''); }}
                    >
                        YAML → JSON
                    </button>
                    <button
                        className={`mode-btn ${mode === 'jsonToYaml' ? 'active' : ''}`}
                        onClick={() => { setMode('jsonToYaml'); setInput(''); setOutput(''); setError(''); }}
                    >
                        JSON → YAML
                    </button>
                </div>

                <div className="converter-grid">
                    <div className="input-section">
                        <div className="label-row">
                            <label className="form-label">
                                Input {mode === 'yamlToJson' ? 'YAML' : 'JSON'}
                            </label>
                            <button className="link-btn" onClick={loadSample}>Load Sample</button>
                        </div>
                        <textarea
                            className="form-input mono"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={16}
                            placeholder={mode === 'yamlToJson' ? 'Paste your YAML here...' : 'Paste your JSON here...'}
                            spellCheck={false}
                        />
                    </div>

                    <div className="output-section">
                        <div className="label-row">
                            <label className="form-label">
                                Output {mode === 'yamlToJson' ? 'JSON' : 'YAML'}
                            </label>
                            {output && <button className="copy-btn yaml-copy-btn" onClick={copy}>📋 Copy</button>}
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

                <div className="controls-row">
                    <div className="option-group">
                        <label className="option-label">Indent</label>
                        <select
                            className="form-select"
                            value={indentSize}
                            onChange={(e) => setIndentSize(parseInt(e.target.value))}
                        >
                            <option value={2}>2 spaces</option>
                            <option value={4}>4 spaces</option>
                        </select>
                    </div>

                    <div className="btn-group">
                        <button className="btn btn-primary" onClick={convert}>🔄 Convert</button>
                        <button className="btn btn-secondary" onClick={swap} disabled={!output}>⇄ Swap</button>
                        <button className="btn btn-outline" onClick={clear}>🗑️ Clear</button>
                    </div>
                </div>

                {error && <div className="error-box">{error}</div>}
            </div>

            <style>{`
                .tool-form { max-width: 1100px; margin: 0 auto; }
                .mode-selector { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg); background: var(--ghost-white); padding: var(--spacing-sm); border-radius: var(--radius); }
                .mode-btn { flex: 1; padding: var(--spacing-sm) var(--spacing-md); border: 2px solid transparent; background: transparent; border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .mode-btn:hover { background: white; }
                .mode-btn.active { background: white; border-color: var(--yinmn-blue); color: var(--yinmn-blue); }
                .converter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg); }
                @media (max-width: 768px) { .converter-grid { grid-template-columns: 1fr; } }
                .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm); }
                .form-label { font-weight: 600; color: var(--jet); }
                .link-btn { background: none; border: none; color: var(--yinmn-blue); cursor: pointer; font-size: var(--text-sm); text-decoration: underline; }
                .form-input { width: 100%; padding: var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-base); transition: border-color 0.2s; resize: vertical; }
                .form-input:focus { outline: none; border-color: var(--yinmn-blue); }
                .form-input.mono { font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.5; }
                .form-input.output { background: var(--ghost-white); }
                .form-select { padding: var(--spacing-sm) var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-sm); cursor: pointer; }
                .controls-row { display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-lg); flex-wrap: wrap; margin-bottom: var(--spacing-lg); }
                .option-group { display: flex; align-items: center; gap: var(--spacing-sm); }
                .option-label { font-size: var(--text-sm); font-weight: 500; color: var(--dim-gray); }
                .btn-group { display: flex; gap: var(--spacing-md); flex-wrap: wrap; }
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

export default YamlJsonConverter;
