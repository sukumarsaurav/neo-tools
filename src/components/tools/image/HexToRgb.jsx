import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const HexToRgb = () => {
    const [hex, setHex] = useState('#485696');
    const [rgb, setRgb] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'hex-to-rgb').slice(0, 3);

    const convert = () => {
        let h = hex.replace('#', '');
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        if (h.length !== 6) { alert('Invalid HEX color'); return; }
        const r = parseInt(h.substring(0, 2), 16);
        const g = parseInt(h.substring(2, 4), 16);
        const b = parseInt(h.substring(4, 6), 16);
        setRgb({ r, g, b });
    };

    const copyRgb = () => { navigator.clipboard.writeText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`); alert('Copied!'); };

    const faqs = [
        { question: 'How to read HEX colors?', answer: 'HEX colors are 6 characters: first 2 = red, middle 2 = green, last 2 = blue. Each pair is 00-FF (0-255 in decimal).' },
        { question: 'What is shorthand HEX?', answer: '3-character HEX like #F00 expands to #FF0000. Each character is doubled. Useful for simple colors.' }
    ];

    const seoContent = (<><h2>HEX to RGB Converter</h2><p>Convert HEX color codes to RGB values. Useful when you need RGB format for CSS, image editing, or design software.</p></>);

    return (
        <ToolLayout title="HEX to RGB Converter" description="Convert HEX color codes to RGB values instantly. Free online color converter." keywords={['HEX to RGB', 'color converter', 'HEX converter', 'RGB color']} category="image" categoryName="Image & Design" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="hex-input"><input type="color" value={hex} onChange={(e) => setHex(e.target.value)} /><input type="text" className="form-input" value={hex} onChange={(e) => setHex(e.target.value)} placeholder="#485696" /></div>
                <button className="btn btn-primary btn-lg" onClick={convert}>Convert to RGB</button>
                {rgb && (
                    <div className="result-box">
                        <div className="color-preview" style={{ background: hex }}></div>
                        <div className="rgb-values"><span>R: {rgb.r}</span><span>G: {rgb.g}</span><span>B: {rgb.b}</span></div>
                        <div className="rgb-code"><code>rgb({rgb.r}, {rgb.g}, {rgb.b})</code><button className="copy-btn" onClick={copyRgb}>📋</button></div>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:400px;margin:0 auto;text-align:center}.hex-input{display:flex;gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}.hex-input input[type="color"]{width:60px;height:44px;padding:0;border:none;cursor:pointer}.hex-input .form-input{flex:1}.color-preview{width:100px;height:100px;border-radius:var(--radius);margin:0 auto var(--spacing-md);border:2px solid var(--platinum)}.rgb-values{display:flex;justify-content:center;gap:var(--spacing-lg);margin-bottom:var(--spacing-md)}.rgb-values span{font-size:var(--text-xl);font-weight:600}.rgb-code{display:flex;gap:var(--spacing-sm);align-items:center;justify-content:center}.rgb-code code{font-size:var(--text-lg)}.copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default HexToRgb;
