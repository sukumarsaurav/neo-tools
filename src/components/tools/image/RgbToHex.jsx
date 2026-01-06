import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const RgbToHex = () => {
    const [r, setR] = useState('72');
    const [g, setG] = useState('86');
    const [b, setB] = useState('150');
    const [hex, setHex] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'rgb-to-hex').slice(0, 3);

    const convert = () => {
        const toHex = (n) => Math.max(0, Math.min(255, parseInt(n) || 0)).toString(16).padStart(2, '0');
        const result = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
        setHex(result);
    };

    const copyHex = () => { navigator.clipboard.writeText(hex); alert('Copied!'); };

    const faqs = [
        { question: 'What is RGB?', answer: 'RGB stands for Red, Green, Blue. Each value ranges 0-255, representing color intensity. (255,0,0) is pure red.' },
        { question: 'What is HEX color?', answer: 'HEX is RGB in hexadecimal format. #FF0000 = RGB(255,0,0). Commonly used in web development and CSS.' }
    ];

    const seoContent = (<><h2>RGB to HEX Converter</h2><p>Convert RGB color values to HEX format for use in CSS, HTML, and design tools. Essential for web developers and designers.</p></>);

    return (
        <ToolLayout title="RGB to HEX Converter" description="Convert RGB color values to HEX format instantly. Free online color converter." keywords={['RGB to HEX', 'color converter', 'RGB converter', 'HEX color']} category="image" categoryName="Image & Design" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="rgb-inputs">
                    <div className="form-group"><label className="form-label">R (0-255)</label><input type="number" className="form-input" value={r} onChange={(e) => setR(e.target.value)} min="0" max="255" /></div>
                    <div className="form-group"><label className="form-label">G (0-255)</label><input type="number" className="form-input" value={g} onChange={(e) => setG(e.target.value)} min="0" max="255" /></div>
                    <div className="form-group"><label className="form-label">B (0-255)</label><input type="number" className="form-input" value={b} onChange={(e) => setB(e.target.value)} min="0" max="255" /></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={convert}>Convert to HEX</button>
                {hex && (
                    <div className="result-box">
                        <div className="color-preview" style={{ background: hex }}></div>
                        <div className="hex-value"><code>{hex}</code><button className="copy-btn" onClick={copyHex}>📋</button></div>
                        <p className="css-code">CSS: <code>color: {hex};</code></p>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:400px;margin:0 auto;text-align:center}.rgb-inputs{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);text-align:center}.color-preview{width:100px;height:100px;border-radius:var(--radius);margin:0 auto var(--spacing-md);border:2px solid var(--platinum)}.hex-value{display:flex;gap:var(--spacing-sm);align-items:center;justify-content:center}.hex-value code{font-size:var(--text-2xl);font-weight:600}.copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm);border-radius:var(--radius);cursor:pointer}.css-code{margin-top:var(--spacing-md);color:var(--text-muted)}`}</style>
        </ToolLayout>
    );
};

export default RgbToHex;
