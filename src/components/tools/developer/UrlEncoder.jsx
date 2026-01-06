import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const UrlEncoder = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'url-encoder').slice(0, 3);

    const encode = () => setOutput(encodeURIComponent(input));
    const decode = () => { try { setOutput(decodeURIComponent(input)); } catch { setOutput('Invalid encoded string'); } };
    const copy = () => { navigator.clipboard.writeText(output); alert('Copied!'); };

    const faqs = [
        { question: 'Why URL encode?', answer: 'URLs can only contain ASCII characters. Spaces, special characters, and non-ASCII must be encoded for safe transmission.' },
        { question: 'What characters are encoded?', answer: 'Spaces become %20, & becomes %26, etc. Letters, numbers, and -_.~ remain unchanged.' }
    ];

    const seoContent = (<><h2>URL Encoder/Decoder</h2><p>Encode special characters for URLs or decode URL-encoded strings. Essential for working with query parameters and API requests.</p></>);

    return (
        <ToolLayout title="URL Encoder/Decoder" description="Encode and decode URL strings. Handle special characters in URLs safely." keywords={['URL encoder', 'URL decoder', 'percent encoding', 'encode URL']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Input</label><textarea className="form-input" value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder="Hello World! Special chars: @#$%^&*" /></div>
                <div className="btn-group"><button className="btn btn-primary" onClick={encode}>Encode</button><button className="btn btn-secondary" onClick={decode}>Decode</button></div>
                {output && <div className="result-box"><textarea className="form-input mono" value={output} readOnly rows={4} /><button className="copy-btn" onClick={copy}>📋</button></div>}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-input{width:100%;padding:var(--spacing-md);border:2px solid var(--platinum);border-radius:var(--radius)}.form-input.mono{font-family:var(--font-mono)}.btn-group{display:flex;gap:var(--spacing-md);margin:var(--spacing-md) 0}.result-box{position:relative}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default UrlEncoder;
