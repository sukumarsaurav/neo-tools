import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const JsonFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'json-formatter').slice(0, 3);

    const format = (indent = 2) => {
        try { setOutput(JSON.stringify(JSON.parse(input), null, indent)); setError(''); }
        catch (e) { setError('Invalid JSON: ' + e.message); setOutput(''); }
    };

    const minify = () => {
        try { setOutput(JSON.stringify(JSON.parse(input))); setError(''); }
        catch (e) { setError('Invalid JSON: ' + e.message); setOutput(''); }
    };

    const copy = () => { navigator.clipboard.writeText(output); alert('Copied!'); };

    const faqs = [
        { question: 'What is JSON?', answer: 'JSON (JavaScript Object Notation) is a lightweight data format. It\'s human-readable and widely used for data exchange between servers and web apps.' },
        { question: 'Why format JSON?', answer: 'Formatted JSON is easier to read and debug. Minified JSON is smaller and better for production use.' }
    ];

    const seoContent = (<><h2>JSON Formatter & Validator</h2><p>Format, validate, and beautify JSON data. Minify JSON for production or pretty-print for debugging.</p></>);

    return (
        <ToolLayout title="JSON Formatter & Validator" description="Format, validate, and beautify JSON. Minify or pretty-print JSON data." keywords={['JSON formatter', 'JSON validator', 'JSON beautify', 'format JSON']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Input JSON</label><textarea className="form-input mono" value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder='{"name": "example", "value": 123}' /></div>
                <div className="btn-group"><button className="btn btn-primary" onClick={() => format(2)}>Format</button><button className="btn btn-secondary" onClick={() => format(4)}>Format (4 spaces)</button><button className="btn btn-secondary" onClick={minify}>Minify</button></div>
                {error && <p className="error">{error}</p>}
                {output && <div className="result-box"><textarea className="form-input mono" value={output} readOnly rows={8} /><button className="copy-btn" onClick={copy}>📋</button></div>}
            </div>
            <style>{`.tool-form{max-width:800px;margin:0 auto}.form-input{width:100%;padding:var(--spacing-md);border:2px solid var(--platinum);border-radius:var(--radius)}.form-input.mono{font-family:var(--font-mono);font-size:var(--text-sm)}.btn-group{display:flex;gap:var(--spacing-md);margin:var(--spacing-md) 0}.error{color:var(--error);margin-bottom:var(--spacing-md)}.result-box{position:relative}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default JsonFormatter;
