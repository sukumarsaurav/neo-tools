import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const RoiCalculator = () => {
    const [investment, setInvestment] = useState('');
    const [returns, setReturns] = useState('');
    const [years, setYears] = useState('1');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'finance' && t.id !== 'roi-calculator').slice(0, 3);

    const calculate = () => {
        const inv = parseFloat(investment);
        const ret = parseFloat(returns);
        const y = parseFloat(years);
        if (isNaN(inv) || isNaN(ret) || isNaN(y) || inv <= 0) { alert('Please enter valid values'); return; }

        const gain = ret - inv;
        const roi = (gain / inv) * 100;
        const annualizedRoi = (Math.pow(ret / inv, 1 / y) - 1) * 100;

        setResult({ investment: inv.toFixed(0), returns: ret.toFixed(0), gain: gain.toFixed(0), roi: roi.toFixed(2), annualizedRoi: annualizedRoi.toFixed(2), years: y, isProfit: gain >= 0 });
    };

    const faqs = [
        { question: 'What is ROI?', answer: 'ROI (Return on Investment) measures the profitability of an investment as a percentage. ROI = (Gain - Cost) / Cost × 100. A positive ROI means profit, negative means loss.' },
        { question: 'What is annualized ROI?', answer: 'Annualized ROI converts the total ROI to a yearly rate, allowing comparison of investments with different time periods. It accounts for compounding effects.' },
        { question: 'What is a good ROI?', answer: 'A "good" ROI depends on the investment type. Stock market historically returns 10-12% annually, real estate 8-10%, FDs 6-8%. Higher risk investments should have higher expected ROI.' },
        { question: 'How is ROI different from profit?', answer: 'Profit is the absolute amount gained (₹10,000). ROI is the percentage return relative to investment (10% on ₹100,000). ROI helps compare investments of different sizes.' }
    ];

    const seoContent = (
        <>
            <h2>ROI Calculator</h2>
            <p>Calculate the return on investment for any project, business venture, or financial investment. Compare profitability across different opportunities.</p>
            <h3>Understanding ROI</h3>
            <p>ROI helps you evaluate the efficiency of an investment. A 50% ROI means you earned ₹50 for every ₹100 invested. Annualized ROI adjusts for time, letting you compare a 2-year investment with a 5-year one.</p>
            <h3>Limitations of ROI</h3>
            <ul><li>Doesn't account for time value of money</li><li>Ignores risk differences between investments</li><li>May not include all costs (taxes, fees, opportunity cost)</li></ul>
        </>
    );

    return (
        <ToolLayout title="ROI Calculator" description="Calculate return on investment percentage. Find out how profitable your investments or business projects are." keywords={['ROI calculator', 'return on investment', 'investment return calculator', 'profit percentage calculator']} category="finance" categoryName="Financial & Business" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Initial Investment (₹)</label><input type="number" className="form-input" value={investment} onChange={(e) => setInvestment(e.target.value)} placeholder="e.g., 100000" min="0" /></div>
                    <div className="form-group"><label className="form-label">Final Value / Returns (₹)</label><input type="number" className="form-input" value={returns} onChange={(e) => setReturns(e.target.value)} placeholder="e.g., 150000" min="0" /></div>
                    <div className="form-group"><label className="form-label">Investment Period (Years)</label><input type="number" className="form-input" value={years} onChange={(e) => setYears(e.target.value)} placeholder="e.g., 3" min="0.1" step="0.1" /></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={calculate}>Calculate ROI</button>
                {result && (
                    <div className="result-box">
                        <div className="result-grid">
                            <div className="result-item"><span className="result-label">Investment</span><span className="result-value">₹{parseInt(result.investment).toLocaleString()}</span></div>
                            <div className="result-item"><span className="result-label">Final Value</span><span className="result-value">₹{parseInt(result.returns).toLocaleString()}</span></div>
                            <div className="result-item"><span className="result-label">{result.isProfit ? 'Profit' : 'Loss'}</span><span className="result-value" style={{ color: result.isProfit ? 'var(--success)' : 'var(--error)' }}>{result.isProfit ? '+' : ''}₹{parseInt(result.gain).toLocaleString()}</span></div>
                            <div className="result-item highlight"><span className="result-label">Total ROI</span><span className="result-value" style={{ color: result.isProfit ? 'var(--success)' : 'var(--error)' }}>{result.roi}%</span></div>
                            <div className="result-item highlight"><span className="result-label">Annualized ROI ({result.years} yrs)</span><span className="result-value" style={{ color: result.isProfit ? 'var(--success)' : 'var(--error)' }}>{result.annualizedRoi}% p.a.</span></div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:600px;margin:0 auto}.form-row{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md)}.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md)}.result-item{padding:var(--spacing-md);background:var(--bg-secondary);border-radius:var(--radius);text-align:center}.result-item.highlight{background:rgba(72,86,150,0.1)}.result-label{display:block;font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--spacing-xs)}.result-value{font-size:var(--text-xl);font-weight:700;color:var(--text-dark)}@media(max-width:480px){.form-row,.result-grid{grid-template-columns:1fr}}`}</style>
        </ToolLayout>
    );
};

export default RoiCalculator;
