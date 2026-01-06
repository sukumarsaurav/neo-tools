import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const Base64Encoder = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'base64-encoder').slice(0, 3);

    const encode = () => { try { setOutput(btoa(unescape(encodeURIComponent(input)))); } catch (e) { setOutput('Error: ' + e.message); } };
    const decode = () => { try { setOutput(decodeURIComponent(escape(atob(input)))); } catch (e) { setOutput('Invalid Base64 string'); } };
    const copy = () => { navigator.clipboard.writeText(output); alert('Copied!'); };

    const faqs = [
        { question: 'What is Base64?', answer: 'Base64 encodes binary data as ASCII text. Used for embedding data in URLs, emails, and data URIs. Output is ~33% larger than input.' },
        { question: 'When to use Base64?', answer: 'For transmitting binary over text-only channels, embedding images in CSS/HTML, or encoding authentication credentials.' }
    ];

    const seoContent = (<><h2>Base64 Encoder/Decoder</h2><p>Encode text to Base64 or decode Base64 strings. Works with Unicode text including emojis and special characters.</p></>);

    return (
        <ToolLayout title="Base64 Encoder/Decoder" description="Encode text to Base64 or decode Base64 strings back to text." keywords={['Base64 encoder', 'Base64 decoder', 'encode Base64', 'decode Base64']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Input</label><textarea className="form-input" value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder="Enter text to encode or Base64 to decode..." /></div>
                <div className="btn-group"><button className="btn btn-primary" onClick={encode}>Encode</button><button className="btn btn-secondary" onClick={decode}>Decode</button></div>
                {output && <div className="result-box"><textarea className="form-input mono" value={output} readOnly rows={4} /><button className="copy-btn" onClick={copy}>📋</button></div>}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-input{width:100%;padding:var(--spacing-md);border:2px solid var(--platinum);border-radius:var(--radius)}.form-input.mono{font-family:var(--font-mono)}.btn-group{display:flex;gap:var(--spacing-md);margin:var(--spacing-md) 0}.result-box{position:relative}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default Base64Encoder;
