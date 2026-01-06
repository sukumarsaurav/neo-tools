import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const InterestCalculator = () => {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [timeUnit, setTimeUnit] = useState('years');
    const [compoundFreq, setCompoundFreq] = useState('yearly');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'finance' && t.id !== 'interest-calculator').slice(0, 3);

    const calculate = () => {
        const P = parseFloat(principal);
        const R = parseFloat(rate) / 100;
        let T = parseFloat(time);
        if (timeUnit === 'months') T = T / 12;

        if (isNaN(P) || isNaN(R) || isNaN(T) || P <= 0 || R <= 0 || T <= 0) {
            alert('Please enter valid values');
            return;
        }

        // Simple Interest: SI = P * R * T
        const simpleInterest = P * R * T;
        const simpleTotal = P + simpleInterest;

        // Compound Interest: A = P(1 + r/n)^(nt)
        const freqMap = { yearly: 1, 'half-yearly': 2, quarterly: 4, monthly: 12 };
        const n = freqMap[compoundFreq];
        const compoundTotal = P * Math.pow(1 + R / n, n * T);
        const compoundInterest = compoundTotal - P;

        setResult({
            principal: P.toFixed(2),
            simple: { interest: simpleInterest.toFixed(2), total: simpleTotal.toFixed(2) },
            compound: { interest: compoundInterest.toFixed(2), total: compoundTotal.toFixed(2) }
        });
    };

    const faqs = [
        { question: 'What is the difference between simple and compound interest?', answer: 'Simple interest is calculated only on the principal amount, while compound interest is calculated on the principal plus any accumulated interest. Compound interest grows faster over time.' },
        { question: 'How is simple interest calculated?', answer: 'Simple Interest = Principal × Rate × Time. For example, ₹10,000 at 10% for 2 years = ₹10,000 × 0.10 × 2 = ₹2,000 interest.' },
        { question: 'How is compound interest calculated?', answer: 'Compound Interest = P(1 + r/n)^(nt) - P, where P is principal, r is annual rate, n is compounding frequency, and t is time in years.' },
        { question: 'Which is better: simple or compound interest?', answer: 'For borrowers, simple interest is better as you pay less. For investors, compound interest is better as you earn more. The difference becomes significant over longer periods.' }
    ];

    const seoContent = (
        <>
            <h2>Simple & Compound Interest Calculator</h2>
            <p>This calculator helps you compare simple and compound interest on your investments or loans. Understanding both concepts is essential for making informed financial decisions.</p>
            <h3>Simple Interest</h3>
            <p>Simple interest is calculated only on the original principal. Formula: SI = P × R × T. It's typically used for short-term loans and some savings accounts.</p>
            <h3>Compound Interest</h3>
            <p>Compound interest is calculated on both principal and accumulated interest. This "interest on interest" effect leads to exponential growth over time, making it powerful for long-term investments.</p>
            <h3>Power of Compounding</h3>
            <p>The more frequently interest compounds, the higher the effective yield. Monthly compounding produces more than annual compounding for the same stated rate.</p>
        </>
    );

    return (
        <ToolLayout title="Simple & Compound Interest Calculator" description="Calculate and compare simple and compound interest on investments. See how compounding frequency affects your returns." keywords={['interest calculator', 'simple interest', 'compound interest', 'investment calculator']} category="finance" categoryName="Financial & Business" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Principal Amount (₹)</label><input type="number" className="form-input" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="e.g., 100000" min="0" /></div>
                    <div className="form-group"><label className="form-label">Interest Rate (% p.a.)</label><input type="number" className="form-input" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g., 8" min="0" step="0.1" /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Time Period</label><input type="number" className="form-input" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 5" min="1" /></div>
                    <div className="form-group"><label className="form-label">Time Unit</label><select className="form-select" value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}><option value="years">Years</option><option value="months">Months</option></select></div>
                    <div className="form-group"><label className="form-label">Compound Frequency</label><select className="form-select" value={compoundFreq} onChange={(e) => setCompoundFreq(e.target.value)}><option value="yearly">Yearly</option><option value="half-yearly">Half-Yearly</option><option value="quarterly">Quarterly</option><option value="monthly">Monthly</option></select></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={calculate}>Calculate Interest</button>
                {result && (
                    <div className="result-box">
                        <div className="comparison-grid">
                            <div className="comparison-card">
                                <h4>Simple Interest</h4>
                                <div className="result-item"><span className="result-label">Interest Earned</span><span className="result-value">₹{parseInt(result.simple.interest).toLocaleString()}</span></div>
                                <div className="result-item"><span className="result-label">Total Amount</span><span className="result-value">₹{parseInt(result.simple.total).toLocaleString()}</span></div>
                            </div>
                            <div className="comparison-card highlight">
                                <h4>Compound Interest</h4>
                                <div className="result-item"><span className="result-label">Interest Earned</span><span className="result-value">₹{parseInt(result.compound.interest).toLocaleString()}</span></div>
                                <div className="result-item"><span className="result-label">Total Amount</span><span className="result-value">₹{parseInt(result.compound.total).toLocaleString()}</span></div>
                            </div>
                        </div>
                        <p className="diff-note">Compound interest earns ₹{(result.compound.interest - result.simple.interest).toFixed(2)} more than simple interest!</p>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--spacing-md)}.comparison-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.comparison-card{padding:var(--spacing-lg);background:var(--bg-secondary);border-radius:var(--radius);text-align:center}.comparison-card h4{margin-bottom:var(--spacing-md)}.comparison-card.highlight{background:rgba(72,86,150,0.1);border:2px solid var(--yinmn-blue)}.result-item{margin-bottom:var(--spacing-sm)}.result-label{display:block;font-size:var(--text-sm);color:var(--text-muted)}.result-value{font-size:var(--text-xl);font-weight:700;color:var(--text-dark)}.diff-note{text-align:center;margin-top:var(--spacing-md);color:var(--success);font-weight:500}@media(max-width:480px){.comparison-grid{grid-template-columns:1fr}}`}</style>
        </ToolLayout>
    );
};

export default InterestCalculator;
