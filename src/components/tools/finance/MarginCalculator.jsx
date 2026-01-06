import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const MarginCalculator = () => {
    const [cost, setCost] = useState('');
    const [revenue, setRevenue] = useState('');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'finance' && t.id !== 'margin-calculator').slice(0, 3);

    const calculate = () => {
        const c = parseFloat(cost);
        const r = parseFloat(revenue);
        if (isNaN(c) || isNaN(r) || c <= 0 || r <= 0) { alert('Enter valid values'); return; }

        const profit = r - c;
        const margin = (profit / r) * 100;
        const markup = (profit / c) * 100;

        setResult({ cost: c.toFixed(2), revenue: r.toFixed(2), profit: profit.toFixed(2), margin: margin.toFixed(2), markup: markup.toFixed(2) });
    };

    const faqs = [
        { question: 'What is profit margin?', answer: 'Profit margin is the percentage of revenue that is profit. Formula: (Revenue - Cost) / Revenue × 100.' },
        { question: 'What is markup?', answer: 'Markup is the percentage added to cost to get selling price. Formula: (Revenue - Cost) / Cost × 100.' },
        { question: 'Margin vs Markup difference?', answer: 'A ₹20 profit on ₹100 cost: Markup = 20% (20/100). If selling at ₹120: Margin = 16.67% (20/120). Markup is always higher.' }
    ];

    const seoContent = (<><h2>Margin & Markup Calculator</h2><p>Calculate profit margin and markup percentage for your products or services. Understand the difference and price your offerings correctly.</p></>);

    return (
        <ToolLayout title="Margin & Markup Calculator" description="Calculate profit margin and markup percentage. Essential for pricing products and services." keywords={['margin calculator', 'markup calculator', 'profit margin', 'pricing calculator']} category="finance" categoryName="Financial & Business" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Cost Price (₹)</label><input type="number" className="form-input" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g., 100" /></div>
                    <div className="form-group"><label className="form-label">Selling Price (₹)</label><input type="number" className="form-input" value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="e.g., 150" /></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={calculate}>Calculate</button>
                {result && (
                    <div className="result-box">
                        <div className="result-grid">
                            <div className="result-item"><span className="result-label">Profit</span><span className="result-value" style={{ color: result.profit > 0 ? 'var(--success)' : 'var(--error)' }}>₹{result.profit}</span></div>
                            <div className="result-item highlight"><span className="result-label">Profit Margin</span><span className="result-value">{result.margin}%</span></div>
                            <div className="result-item highlight"><span className="result-label">Markup</span><span className="result-value">{result.markup}%</span></div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:500px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.result-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--spacing-md)}.result-item{padding:var(--spacing-md);background:var(--bg-secondary);border-radius:var(--radius);text-align:center}.result-item.highlight{background:rgba(72,86,150,0.1)}.result-label{display:block;font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--spacing-xs)}.result-value{font-size:var(--text-xl);font-weight:700}@media(max-width:480px){.form-row,.result-grid{grid-template-columns:1fr}}`}</style>
        </ToolLayout>
    );
};

export default MarginCalculator;
