import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const CssMinifier = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'css-minifier').slice(0, 3);

    const minify = () => {
        const original = input.length;
        let minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/\s*{\s*/g, '{') // Remove space around {
            .replace(/\s*}\s*/g, '}') // Remove space around }
            .replace(/\s*:\s*/g, ':') // Remove space around :
            .replace(/\s*;\s*/g, ';') // Remove space around ;
            .replace(/\s*,\s*/g, ',') // Remove space around ,
            .replace(/;}/g, '}') // Remove last semicolon
            .trim();
        setOutput(minified);
        const saved = original - minified.length;
        const percent = original > 0 ? Math.round((saved / original) * 100) : 0;
        setStats({ original, minified: minified.length, saved, percent });
    };

    const beautify = () => {
        let formatted = input
            .replace(/}/g, '}\n\n')
            .replace(/{/g, ' {\n  ')
            .replace(/;/g, ';\n  ')
            .replace(/\n  }/g, '\n}')
            .replace(/\n\n\n+/g, '\n\n');
        setOutput(formatted.trim());
        setStats(null);
    };

    const copy = () => { navigator.clipboard.writeText(output); alert('Copied!'); };

    const faqs = [
        { question: 'Why minify CSS?', answer: 'Minified CSS loads faster, reduces bandwidth, and improves page speed. Essential for production websites.' },
        { question: 'What does minification remove?', answer: 'Removes whitespace, comments, unnecessary semicolons, and shortens properties where possible.' }
    ];

    const seoContent = (<><h2>CSS Minifier</h2><p>Minify CSS to reduce file size and improve page load speed. Also beautify minified CSS for readability.</p></>);

    return (
        <ToolLayout title="CSS Minifier" description="Minify or beautify CSS code. Reduce CSS file size for faster loading." keywords={['CSS minifier', 'minify CSS', 'CSS beautifier', 'compress CSS']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Input CSS</label><textarea className="form-input mono" value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder=".example {
  color: red;
  margin: 10px;
}" /></div>
                <div className="btn-group"><button className="btn btn-primary" onClick={minify}>Minify</button><button className="btn btn-secondary" onClick={beautify}>Beautify</button></div>
                {stats && <div className="stats">{stats.original} → {stats.minified} bytes ({stats.percent}% smaller, saved {stats.saved} bytes)</div>}
                {output && <div className="result-box"><textarea className="form-input mono" value={output} readOnly rows={8} /><button className="copy-btn" onClick={copy}>📋</button></div>}
            </div>
            <style>{`.tool-form{max-width:800px;margin:0 auto}.form-input{width:100%;padding:var(--spacing-md);border:2px solid var(--platinum);border-radius:var(--radius)}.form-input.mono{font-family:var(--font-mono);font-size:var(--text-sm)}.btn-group{display:flex;gap:var(--spacing-md);margin:var(--spacing-md) 0}.stats{text-align:center;color:var(--success);font-weight:500;margin-bottom:var(--spacing-md)}.result-box{position:relative}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default CssMinifier;
