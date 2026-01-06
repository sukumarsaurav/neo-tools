import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const MODES = {
    whatIs: { name: 'What is X% of Y?', icon: '🔢', desc: 'Find percentage of a number' },
    whatPercent: { name: 'X is what % of Y?', icon: '📊', desc: 'Find percentage ratio' },
    percentChange: { name: 'Percent Change', icon: '📈', desc: 'Increase or decrease %' },
    percentOf: { name: 'X% more/less than Y', icon: '➕', desc: 'Add or subtract percent' },
    tip: { name: 'Tip Calculator', icon: '💰', desc: 'Calculate tips' },
    discount: { name: 'Discount Calculator', icon: '🏷️', desc: 'Find sale price' }
};

const TIP_PRESETS = [10, 15, 18, 20, 25];

const PercentageCalculator = () => {
    const [mode, setMode] = useState('whatIs');
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [tipPercent, setTipPercent] = useState(15);
    const [splitBy, setSplitBy] = useState(1);
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'typing' && t.id !== 'percentage-calculator').slice(0, 3);

    const calculate = () => {
        const v1 = parseFloat(value1) || 0;
        const v2 = parseFloat(value2) || 0;

        let calculation = null;

        switch (mode) {
            case 'whatIs':
                // What is X% of Y?
                calculation = {
                    result: (v1 / 100) * v2,
                    formula: `${v1}% of ${v2}`,
                    steps: [
                        `Convert percentage to decimal: ${v1}% ÷ 100 = ${v1 / 100}`,
                        `Multiply by the number: ${v1 / 100} × ${v2} = ${(v1 / 100) * v2}`
                    ]
                };
                break;

            case 'whatPercent':
                // X is what % of Y?
                calculation = {
                    result: v2 !== 0 ? (v1 / v2) * 100 : 0,
                    formula: `${v1} is what % of ${v2}`,
                    steps: [
                        `Divide first number by second: ${v1} ÷ ${v2} = ${(v1 / v2).toFixed(4)}`,
                        `Multiply by 100: ${(v1 / v2).toFixed(4)} × 100 = ${((v1 / v2) * 100).toFixed(2)}%`
                    ]
                };
                break;

            case 'percentChange':
                // Percent change from X to Y
                calculation = {
                    result: v1 !== 0 ? ((v2 - v1) / v1) * 100 : 0,
                    formula: `Change from ${v1} to ${v2}`,
                    isIncrease: v2 >= v1,
                    steps: [
                        `Find the difference: ${v2} - ${v1} = ${v2 - v1}`,
                        `Divide by original: ${v2 - v1} ÷ ${v1} = ${((v2 - v1) / v1).toFixed(4)}`,
                        `Multiply by 100: ${((v2 - v1) / v1).toFixed(4)} × 100 = ${(((v2 - v1) / v1) * 100).toFixed(2)}%`
                    ]
                };
                break;

            case 'percentOf':
                // X% more/less than Y
                const more = v2 * (1 + v1 / 100);
                const less = v2 * (1 - v1 / 100);
                calculation = {
                    result: more,
                    resultLess: less,
                    formula: `${v1}% of ${v2}`,
                    steps: [
                        `${v1}% more: ${v2} × (1 + ${v1}/100) = ${v2} × ${(1 + v1 / 100).toFixed(4)} = ${more.toFixed(2)}`,
                        `${v1}% less: ${v2} × (1 - ${v1}/100) = ${v2} × ${(1 - v1 / 100).toFixed(4)} = ${less.toFixed(2)}`
                    ]
                };
                break;

            case 'tip':
                const tip = v1 * (tipPercent / 100);
                const total = v1 + tip;
                const perPerson = splitBy > 0 ? total / splitBy : total;
                calculation = {
                    billAmount: v1,
                    tipAmount: tip,
                    total: total,
                    perPerson: perPerson,
                    tipPercent: tipPercent,
                    splitBy: splitBy
                };
                break;

            case 'discount':
                const discountAmount = v2 * (v1 / 100);
                const salePrice = v2 - discountAmount;
                calculation = {
                    originalPrice: v2,
                    discountPercent: v1,
                    discountAmount: discountAmount,
                    salePrice: salePrice,
                    savings: discountAmount,
                    steps: [
                        `Discount amount: ${v2} × ${v1}% = ${v2} × ${v1 / 100} = $${discountAmount.toFixed(2)}`,
                        `Sale price: $${v2} - $${discountAmount.toFixed(2)} = $${salePrice.toFixed(2)}`
                    ]
                };
                break;
        }

        setResult(calculation);
    };

    const faqs = [
        { question: 'How to calculate percentage?', answer: 'Percentage = (Part / Whole) × 100. For example, 25 out of 100 = 25%.' },
        { question: 'How to find percentage of a number?', answer: 'Multiply the number by the percentage divided by 100. Example: 20% of 50 = 50 × 0.20 = 10.' }
    ];

    const seoContent = (<><h2>Percentage Calculator</h2><p>Calculate percentages with multiple modes including tip calculator, discount finder, and step-by-step solutions.</p></>);

    return (
        <ToolLayout title="Percentage Calculator" description="Calculate percentages with multiple modes and step-by-step solutions." keywords={['percentage calculator', 'percent change', 'tip calculator', 'discount calculator']} category="typing" categoryName="Typing & Education" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="percentage-calculator">
                {/* Mode Selector */}
                <div className="mode-selector">
                    {Object.entries(MODES).map(([key, data]) => (
                        <button
                            key={key}
                            className={`mode-btn ${mode === key ? 'active' : ''}`}
                            onClick={() => { setMode(key); setResult(null); }}
                        >
                            <span className="mode-icon">{data.icon}</span>
                            <span className="mode-name">{data.name}</span>
                        </button>
                    ))}
                </div>

                {/* Input Section */}
                <div className="input-section">
                    {mode === 'whatIs' && (
                        <div className="inline-form">
                            <span>What is</span>
                            <input type="number" className="form-input inline" value={value1} onChange={(e) => setValue1(e.target.value)} placeholder="X" />
                            <span>% of</span>
                            <input type="number" className="form-input inline" value={value2} onChange={(e) => setValue2(e.target.value)} placeholder="Y" />
                            <span>?</span>
                        </div>
                    )}

                    {mode === 'whatPercent' && (
                        <div className="inline-form">
                            <input type="number" className="form-input inline" value={value1} onChange={(e) => setValue1(e.target.value)} placeholder="X" />
                            <span>is what % of</span>
                            <input type="number" className="form-input inline" value={value2} onChange={(e) => setValue2(e.target.value)} placeholder="Y" />
                            <span>?</span>
                        </div>
                    )}

                    {mode === 'percentChange' && (
                        <div className="inline-form">
                            <span>From</span>
                            <input type="number" className="form-input inline" value={value1} onChange={(e) => setValue1(e.target.value)} placeholder="Old" />
                            <span>to</span>
                            <input type="number" className="form-input inline" value={value2} onChange={(e) => setValue2(e.target.value)} placeholder="New" />
                        </div>
                    )}

                    {mode === 'percentOf' && (
                        <div className="inline-form">
                            <input type="number" className="form-input inline" value={value1} onChange={(e) => setValue1(e.target.value)} placeholder="X" />
                            <span>% more/less than</span>
                            <input type="number" className="form-input inline" value={value2} onChange={(e) => setValue2(e.target.value)} placeholder="Y" />
                        </div>
                    )}

                    {mode === 'tip' && (
                        <div className="tip-form">
                            <div className="input-row">
                                <label>Bill Amount ($)</label>
                                <input type="number" className="form-input" value={value1} onChange={(e) => setValue1(e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="tip-presets">
                                {TIP_PRESETS.map(t => (
                                    <button
                                        key={t}
                                        className={`preset-btn ${tipPercent === t ? 'active' : ''}`}
                                        onClick={() => setTipPercent(t)}
                                    >
                                        {t}%
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    className="form-input custom-tip"
                                    value={tipPercent}
                                    onChange={(e) => setTipPercent(parseFloat(e.target.value) || 0)}
                                    placeholder="Custom"
                                />
                            </div>
                            <div className="input-row">
                                <label>Split by</label>
                                <input type="number" className="form-input" value={splitBy} onChange={(e) => setSplitBy(parseInt(e.target.value) || 1)} min="1" />
                            </div>
                        </div>
                    )}

                    {mode === 'discount' && (
                        <div className="discount-form">
                            <div className="input-row">
                                <label>Original Price ($)</label>
                                <input type="number" className="form-input" value={value2} onChange={(e) => setValue2(e.target.value)} placeholder="0.00" />
                            </div>
                            <div className="input-row">
                                <label>Discount (%)</label>
                                <input type="number" className="form-input" value={value1} onChange={(e) => setValue1(e.target.value)} placeholder="0" />
                            </div>
                        </div>
                    )}

                    <button className="btn btn-primary btn-lg" onClick={calculate}>Calculate</button>
                </div>

                {/* Results */}
                {result && (
                    <div className="result-section">
                        {(mode === 'whatIs' || mode === 'whatPercent') && (
                            <div className="result-main">
                                <span className="result-value">{result.result.toFixed(2)}{mode === 'whatPercent' ? '%' : ''}</span>
                            </div>
                        )}

                        {mode === 'percentChange' && (
                            <div className={`result-main ${result.isIncrease ? 'increase' : 'decrease'}`}>
                                <span className="result-icon">{result.isIncrease ? '📈' : '📉'}</span>
                                <span className="result-value">{Math.abs(result.result).toFixed(2)}%</span>
                                <span className="result-type">{result.isIncrease ? 'Increase' : 'Decrease'}</span>
                            </div>
                        )}

                        {mode === 'percentOf' && (
                            <div className="result-dual">
                                <div className="result-card increase">
                                    <span className="result-icon">➕</span>
                                    <span className="result-value">{result.result.toFixed(2)}</span>
                                    <span className="result-label">{value1}% more</span>
                                </div>
                                <div className="result-card decrease">
                                    <span className="result-icon">➖</span>
                                    <span className="result-value">{result.resultLess.toFixed(2)}</span>
                                    <span className="result-label">{value1}% less</span>
                                </div>
                            </div>
                        )}

                        {mode === 'tip' && (
                            <div className="tip-result">
                                <div className="tip-grid">
                                    <div className="tip-item">
                                        <span className="tip-label">Tip ({result.tipPercent}%)</span>
                                        <span className="tip-value">${result.tipAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="tip-item highlight">
                                        <span className="tip-label">Total</span>
                                        <span className="tip-value">${result.total.toFixed(2)}</span>
                                    </div>
                                    {result.splitBy > 1 && (
                                        <div className="tip-item split">
                                            <span className="tip-label">Per Person ({result.splitBy})</span>
                                            <span className="tip-value">${result.perPerson.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {mode === 'discount' && (
                            <div className="discount-result">
                                <div className="price-comparison">
                                    <div className="original-price">
                                        <span className="price-label">Original</span>
                                        <span className="price-value strikethrough">${result.originalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="arrow">→</div>
                                    <div className="sale-price">
                                        <span className="price-label">Sale Price</span>
                                        <span className="price-value">${result.salePrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="savings-badge">
                                    You save ${result.savings.toFixed(2)} ({result.discountPercent}% off)
                                </div>
                            </div>
                        )}

                        {/* Step-by-step solution */}
                        {result.steps && (
                            <div className="steps-section">
                                <h4>📝 Step-by-step Solution</h4>
                                <ol className="steps-list">
                                    {result.steps.map((step, i) => (
                                        <li key={i}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .percentage-calculator {
                    max-width: 700px;
                    margin: 0 auto;
                }

                .mode-selector {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--spacing-sm);
                    margin-bottom: var(--spacing-xl);
                }

                .mode-btn {
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }

                .mode-btn:hover { border-color: var(--accent-primary); }
                .mode-btn.active { 
                    border-color: var(--accent-primary);
                    background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.1), transparent);
                }

                .mode-icon { display: block; font-size: var(--text-xl); margin-bottom: 4px; }
                .mode-name { font-size: var(--text-xs); font-weight: 600; }

                .input-section {
                    text-align: center;
                    margin-bottom: var(--spacing-xl);
                }

                .inline-form {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-sm);
                    flex-wrap: wrap;
                    margin-bottom: var(--spacing-lg);
                    font-size: var(--text-lg);
                }

                .form-input.inline {
                    max-width: 100px;
                    text-align: center;
                    font-size: var(--text-lg);
                }

                .tip-form, .discount-form {
                    max-width: 400px;
                    margin: 0 auto var(--spacing-lg);
                }

                .input-row {
                    margin-bottom: var(--spacing-md);
                }

                .input-row label {
                    display: block;
                    margin-bottom: var(--spacing-xs);
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .tip-presets {
                    display: flex;
                    gap: var(--spacing-xs);
                    margin-bottom: var(--spacing-md);
                    flex-wrap: wrap;
                }

                .preset-btn {
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: var(--bg-secondary);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .preset-btn:hover { border-color: var(--accent-primary); }
                .preset-btn.active { 
                    background: var(--accent-primary);
                    color: white;
                    border-color: var(--accent-primary);
                }

                .custom-tip { max-width: 80px; }

                .result-section {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-lg);
                }

                .result-main {
                    text-align: center;
                    padding: var(--spacing-xl);
                    background: var(--gradient-primary);
                    border-radius: var(--radius-lg);
                    color: white;
                }

                .result-main.increase { background: linear-gradient(135deg, #10B981, #059669); }
                .result-main.decrease { background: linear-gradient(135deg, #EF4444, #DC2626); }

                .result-icon { display: block; font-size: 48px; margin-bottom: var(--spacing-sm); }
                .result-value { font-size: var(--text-4xl); font-weight: 700; }
                .result-type { display: block; font-size: var(--text-sm); opacity: 0.8; }

                .result-dual {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--spacing-md);
                }

                .result-card {
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                    text-align: center;
                    color: white;
                }

                .result-card.increase { background: linear-gradient(135deg, #10B981, #059669); }
                .result-card.decrease { background: linear-gradient(135deg, #EF4444, #DC2626); }

                .result-label { display: block; font-size: var(--text-sm); opacity: 0.8; }

                .tip-grid {
                    display: flex;
                    gap: var(--spacing-md);
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .tip-item {
                    padding: var(--spacing-lg);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    text-align: center;
                    min-width: 120px;
                }

                .tip-item.highlight {
                    background: var(--gradient-primary);
                    color: white;
                }

                .tip-item.split {
                    background: linear-gradient(135deg, #8B5CF6, #6366F1);
                    color: white;
                }

                .tip-label { display: block; font-size: var(--text-sm); margin-bottom: var(--spacing-xs); }
                .tip-value { font-size: var(--text-2xl); font-weight: 700; }

                .discount-result {
                    text-align: center;
                }

                .price-comparison {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-md);
                }

                .original-price, .sale-price {
                    padding: var(--spacing-lg);
                    background: var(--bg-secondary);
                    border-radius: var(--radius);
                    text-align: center;
                }

                .sale-price {
                    background: var(--gradient-primary);
                    color: white;
                }

                .price-label { display: block; font-size: var(--text-sm); margin-bottom: var(--spacing-xs); }
                .price-value { font-size: var(--text-2xl); font-weight: 700; }
                .price-value.strikethrough { text-decoration: line-through; color: var(--text-muted); }

                .arrow { font-size: var(--text-2xl); color: var(--text-muted); }

                .savings-badge {
                    display: inline-block;
                    padding: var(--spacing-sm) var(--spacing-lg);
                    background: linear-gradient(135deg, #10B981, #059669);
                    color: white;
                    border-radius: 20px;
                    font-weight: 600;
                }

                .steps-section {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius);
                }

                .steps-section h4 {
                    margin: 0 0 var(--spacing-md);
                    font-size: var(--text-md);
                }

                .steps-list {
                    margin: 0;
                    padding-left: var(--spacing-lg);
                }

                .steps-list li {
                    margin-bottom: var(--spacing-sm);
                    font-family: var(--font-mono);
                    font-size: var(--text-sm);
                }

                @media (max-width: 600px) {
                    .mode-selector {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .inline-form {
                        font-size: var(--text-md);
                    }
                }
            `}</style>
        </ToolLayout>
    );
};

export default PercentageCalculator;
