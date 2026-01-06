import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const HtmlEncoder = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'html-encoder').slice(0, 3);

    const encode = () => {
        const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        setOutput(input.replace(/[&<>"']/g, c => entities[c]));
    };

    const decode = () => {
        const el = document.createElement('div');
        el.innerHTML = input;
        setOutput(el.textContent || el.innerText);
    };

    const copy = () => { navigator.clipboard.writeText(output); alert('Copied!'); };

    const faqs = [
        { question: 'Why encode HTML?', answer: 'Encoding prevents XSS attacks and ensures special characters display correctly. <script> becomes &lt;script&gt;.' },
        { question: 'What characters are encoded?', answer: '< > & " \' are encoded to their HTML entity equivalents: &lt; &gt; &amp; &quot; &#39;' }
    ];

    const seoContent = (<><h2>HTML Encoder/Decoder</h2><p>Encode special characters to HTML entities or decode HTML entities back to characters. Essential for web security and display.</p></>);

    return (
        <ToolLayout title="HTML Encoder/Decoder" description="Encode and decode HTML entities. Prevent XSS and display special characters." keywords={['HTML encoder', 'HTML decoder', 'HTML entities', 'encode HTML']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Input</label><textarea className="form-input" value={input} onChange={(e) => setInput(e.target.value)} rows={5} placeholder="<div>Hello & World</div>" /></div>
                <div className="btn-group"><button className="btn btn-primary" onClick={encode}>Encode</button><button className="btn btn-secondary" onClick={decode}>Decode</button></div>
                {output && <div className="result-box"><textarea className="form-input mono" value={output} readOnly rows={5} /><button className="copy-btn" onClick={copy}>📋</button></div>}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-input{width:100%;padding:var(--spacing-md);border:2px solid var(--platinum);border-radius:var(--radius)}.form-input.mono{font-family:var(--font-mono)}.btn-group{display:flex;gap:var(--spacing-md);margin:var(--spacing-md) 0}.result-box{position:relative}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default HtmlEncoder;
