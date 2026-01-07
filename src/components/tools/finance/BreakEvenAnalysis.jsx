import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, ResultActions } from './shared';

const BreakEvenAnalysis = () => {
    const [fixedCosts, setFixedCosts] = useState([
        { name: 'Rent', amount: 50000 },
        { name: 'Salaries', amount: 150000 },
        { name: 'Utilities', amount: 10000 },
    ]);
    const [variableCostPerUnit, setVariableCostPerUnit] = useState(100);
    const [sellingPricePerUnit, setSellingPricePerUnit] = useState(200);
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'break-even-analysis')
        .slice(0, 3);

    // Calculate on input change
    useEffect(() => {
        calculateBreakEven();
    }, [fixedCosts, variableCostPerUnit, sellingPricePerUnit]);

    const calculateBreakEven = () => {
        const totalFixedCosts = fixedCosts.reduce((sum, fc) => sum + (parseFloat(fc.amount) || 0), 0);
        const vcPerUnit = parseFloat(variableCostPerUnit) || 0;
        const spPerUnit = parseFloat(sellingPricePerUnit) || 0;

        if (spPerUnit <= vcPerUnit) {
            setResult({
                error: 'Selling price must be greater than variable cost per unit'
            });
            return;
        }

        // Contribution Margin = Selling Price - Variable Cost
        const contributionMargin = spPerUnit - vcPerUnit;
        const contributionMarginRatio = (contributionMargin / spPerUnit) * 100;

        // Break-Even Units = Fixed Costs / Contribution Margin
        const breakEvenUnits = totalFixedCosts / contributionMargin;
        const breakEvenRevenue = breakEvenUnits * spPerUnit;

        // Profit at different volumes
        const profitAnalysis = [50, 75, 100, 125, 150, 200].map(percent => {
            const units = Math.round(breakEvenUnits * (percent / 100));
            const revenue = units * spPerUnit;
            const totalCosts = totalFixedCosts + (units * vcPerUnit);
            const profit = revenue - totalCosts;
            return { percent, units, revenue, totalCosts, profit };
        });

        setResult({
            totalFixedCosts,
            variableCostPerUnit: vcPerUnit,
            sellingPricePerUnit: spPerUnit,
            contributionMargin,
            contributionMarginRatio,
            breakEvenUnits: Math.ceil(breakEvenUnits),
            breakEvenRevenue,
            profitAnalysis
        });
    };

    // Add fixed cost
    const addFixedCost = () => {
        setFixedCosts([...fixedCosts, { name: '', amount: 0 }]);
    };

    // Remove fixed cost
    const removeFixedCost = (index) => {
        setFixedCosts(fixedCosts.filter((_, i) => i !== index));
    };

    // Update fixed cost
    const updateFixedCost = (index, field, value) => {
        const updated = [...fixedCosts];
        updated[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
        setFixedCosts(updated);
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result || result.error) return '';
        return `Break-Even Analysis
========================
Fixed Costs: ₹${result.totalFixedCosts.toLocaleString('en-IN')}
Variable Cost per Unit: ₹${result.variableCostPerUnit.toLocaleString('en-IN')}
Selling Price per Unit: ₹${result.sellingPricePerUnit.toLocaleString('en-IN')}

Contribution Margin: ₹${result.contributionMargin.toLocaleString('en-IN')} (${result.contributionMarginRatio.toFixed(1)}%)
Break-Even Units: ${result.breakEvenUnits.toLocaleString('en-IN')}
Break-Even Revenue: ₹${result.breakEvenRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    };

    const faqs = [
        {
            question: 'What is Break-Even Analysis?',
            answer: 'Break-Even Analysis determines the point at which total costs equal total revenue, meaning no profit or loss. It helps businesses understand how many units they need to sell to cover all expenses.'
        },
        {
            question: 'What is Contribution Margin?',
            answer: 'Contribution Margin is the difference between selling price and variable cost per unit. It represents the portion of each sale that contributes to covering fixed costs and generating profit.'
        },
        {
            question: 'How is Break-Even Point calculated?',
            answer: 'Break-Even Point (in units) = Total Fixed Costs ÷ Contribution Margin per Unit. In revenue terms, it\'s Break-Even Units × Selling Price.'
        },
        {
            question: 'What are Fixed Costs vs Variable Costs?',
            answer: 'Fixed costs remain constant regardless of production volume (rent, salaries). Variable costs change with production levels (raw materials, direct labor per unit).'
        },
        {
            question: 'How can I use this analysis for pricing decisions?',
            answer: 'Use the sensitivity analysis to see how different prices affect your break-even point. A higher price means fewer units needed to break even, but may reduce demand.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is Break-Even Analysis?</h2>
            <p>
                Break-Even Analysis is a financial calculation that determines when a business
                will be able to cover all its expenses and begin making a profit. It's a crucial
                tool for pricing decisions, business planning, and financial forecasting.
            </p>

            <h2>Key Formulas</h2>
            <ul>
                <li><strong>Contribution Margin:</strong> Selling Price - Variable Cost per Unit</li>
                <li><strong>Contribution Margin Ratio:</strong> (Contribution Margin ÷ Selling Price) × 100</li>
                <li><strong>Break-Even Units:</strong> Fixed Costs ÷ Contribution Margin per Unit</li>
                <li><strong>Break-Even Revenue:</strong> Break-Even Units × Selling Price</li>
            </ul>

            <h2>Benefits of Break-Even Analysis</h2>
            <ul>
                <li>Helps set realistic sales targets</li>
                <li>Guides pricing strategy decisions</li>
                <li>Assesses viability of new products or services</li>
                <li>Identifies the impact of cost changes on profitability</li>
                <li>Supports investor presentations and business plans</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Break-Even Analysis Tool"
            description="Calculate break-even point, contribution margin, and profitability analysis. Essential for business planning and pricing decisions."
            keywords={['break-even calculator', 'contribution margin', 'break-even point', 'profitability analysis', 'business planning', 'pricing strategy']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Fixed Costs Section */}
                <div className="section-card">
                    <h3>📌 Fixed Costs (Monthly)</h3>
                    <div className="fixed-costs-list">
                        {fixedCosts.map((fc, index) => (
                            <div key={index} className="fixed-cost-row">
                                <input
                                    type="text"
                                    className="form-input name-input"
                                    value={fc.name}
                                    onChange={(e) => updateFixedCost(index, 'name', e.target.value)}
                                    placeholder="Cost name"
                                />
                                <div className="amount-input-wrapper">
                                    <span className="input-prefix">₹</span>
                                    <input
                                        type="number"
                                        className="form-input amount-input"
                                        value={fc.amount || ''}
                                        onChange={(e) => updateFixedCost(index, 'amount', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                                {fixedCosts.length > 1 && (
                                    <button
                                        className="btn-icon btn-remove"
                                        onClick={() => removeFixedCost(index)}
                                        title="Remove"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button className="btn btn-secondary" onClick={addFixedCost}>
                            + Add Fixed Cost
                        </button>
                    </div>
                    <div className="total-fixed">
                        Total Fixed Costs: ₹{fixedCosts.reduce((sum, fc) => sum + (fc.amount || 0), 0).toLocaleString('en-IN')}
                    </div>
                </div>

                {/* Variable Cost & Selling Price */}
                <div className="pricing-section">
                    <div className="pricing-card">
                        <label className="form-label">Variable Cost per Unit</label>
                        <div className="amount-input-wrapper">
                            <span className="input-prefix">₹</span>
                            <input
                                type="number"
                                className="form-input"
                                value={variableCostPerUnit}
                                onChange={(e) => setVariableCostPerUnit(e.target.value)}
                            />
                        </div>
                        <small>Direct material, labor, etc. per unit</small>
                    </div>
                    <div className="pricing-card">
                        <label className="form-label">Selling Price per Unit</label>
                        <div className="amount-input-wrapper">
                            <span className="input-prefix">₹</span>
                            <input
                                type="number"
                                className="form-input"
                                value={sellingPricePerUnit}
                                onChange={(e) => setSellingPricePerUnit(e.target.value)}
                            />
                        </div>
                        <small>Price at which you sell each unit</small>
                    </div>
                </div>

                {/* Results */}
                {result && !result.error && (
                    <div className="result-box">
                        {/* Key Metrics */}
                        <div className="metrics-grid">
                            <div className="metric-card primary">
                                <span className="metric-icon">🎯</span>
                                <span className="metric-label">Break-Even Point</span>
                                <span className="metric-value">{result.breakEvenUnits.toLocaleString('en-IN')} units</span>
                                <span className="metric-sub">₹{result.breakEvenRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} revenue</span>
                            </div>
                            <div className="metric-card">
                                <span className="metric-icon">💰</span>
                                <span className="metric-label">Contribution Margin</span>
                                <span className="metric-value">₹{result.contributionMargin.toLocaleString('en-IN')}</span>
                                <span className="metric-sub">{result.contributionMarginRatio.toFixed(1)}% of selling price</span>
                            </div>
                        </div>

                        {/* Visual Chart */}
                        <div className="chart-section">
                            <h4>📊 Profit/Loss by Sales Volume</h4>
                            <div className="bar-chart">
                                {result.profitAnalysis.map((pa, idx) => (
                                    <div key={idx} className="chart-bar-container">
                                        <div className="bar-label">{pa.percent}%</div>
                                        <div className="bar-wrapper">
                                            <div
                                                className={`chart-bar ${pa.profit >= 0 ? 'profit' : 'loss'}`}
                                                style={{
                                                    height: `${Math.min(100, Math.abs(pa.profit) / (result.totalFixedCosts * 0.5) * 50 + 10)}%`
                                                }}
                                            >
                                                <span className="bar-value">
                                                    {pa.profit >= 0 ? '+' : ''}₹{(pa.profit / 1000).toFixed(0)}K
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bar-units">{pa.units.toLocaleString('en-IN')} units</div>
                                    </div>
                                ))}
                            </div>
                            <div className="chart-legend">
                                <span className="legend-item profit">■ Profit</span>
                                <span className="legend-item loss">■ Loss</span>
                                <span className="legend-break">Break-even at {result.breakEvenUnits.toLocaleString('en-IN')} units</span>
                            </div>
                        </div>

                        {/* Detailed Table */}
                        <div className="analysis-table-section">
                            <h4>📋 Sensitivity Analysis</h4>
                            <table className="analysis-table">
                                <thead>
                                    <tr>
                                        <th>Volume</th>
                                        <th>Units</th>
                                        <th>Revenue</th>
                                        <th>Total Costs</th>
                                        <th>Profit/Loss</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.profitAnalysis.map((pa, idx) => (
                                        <tr key={idx} className={pa.percent === 100 ? 'highlight' : ''}>
                                            <td>{pa.percent}% of BE</td>
                                            <td>{pa.units.toLocaleString('en-IN')}</td>
                                            <td>₹{pa.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                                            <td>₹{pa.totalCosts.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                                            <td className={pa.profit >= 0 ? 'profit' : 'loss'}>
                                                {pa.profit >= 0 ? '+' : ''}₹{pa.profit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="Break-Even Analysis"
                            shareText={`Break-even at ${result.breakEvenUnits.toLocaleString('en-IN')} units (₹${result.breakEvenRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} revenue)`}
                            toolName="break-even-analysis"
                        />
                    </div>
                )}

                {result && result.error && (
                    <div className="error-box">
                        ⚠️ {result.error}
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .section-card {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
        }

        .section-card h3 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: var(--text-lg);
        }

        .fixed-costs-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .fixed-cost-row {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .name-input {
          flex: 1;
        }

        .amount-input-wrapper {
          display: flex;
          align-items: stretch;
          flex: 1;
        }

        .input-prefix {
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-sm);
          background: var(--bg-tertiary);
          border: 2px solid var(--platinum);
          border-right: none;
          border-radius: var(--radius) 0 0 var(--radius);
          font-weight: 600;
          color: var(--text-muted);
        }

        .amount-input {
          border-radius: 0 var(--radius) var(--radius) 0 !important;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-lg);
        }

        .btn-remove {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .btn-remove:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .total-fixed {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 2px dashed var(--platinum);
          font-weight: 600;
          font-size: var(--text-lg);
          color: var(--text-dark);
        }

        .pricing-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .pricing-card {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
        }

        .pricing-card small {
          display: block;
          margin-top: var(--spacing-xs);
          color: var(--text-muted);
          font-size: var(--text-xs);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .metric-card {
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          border: 2px solid var(--platinum);
        }

        .metric-card.primary {
          background: var(--gradient-primary);
          color: var(--white);
          border: none;
        }

        .metric-icon {
          display: block;
          font-size: 2rem;
          margin-bottom: var(--spacing-sm);
        }

        .metric-label {
          display: block;
          font-size: var(--text-sm);
          opacity: 0.9;
        }

        .metric-value {
          display: block;
          font-size: var(--text-3xl);
          font-weight: 700;
          margin: var(--spacing-xs) 0;
        }

        .metric-sub {
          font-size: var(--text-sm);
          opacity: 0.8;
        }

        .metric-card.primary .metric-label,
        .metric-card.primary .metric-sub {
          color: rgba(255,255,255,0.9);
        }

        .chart-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
        }

        .chart-section h4 {
          margin: 0 0 var(--spacing-lg) 0;
        }

        .bar-chart {
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          height: 200px;
          padding: var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius);
        }

        .chart-bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: calc(100% / 6 - 10px);
        }

        .bar-label {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .bar-wrapper {
          height: 150px;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .chart-bar {
          width: 80%;
          border-radius: var(--radius) var(--radius) 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: var(--spacing-xs);
          min-height: 30px;
        }

        .chart-bar.profit {
          background: var(--success);
        }

        .chart-bar.loss {
          background: var(--error);
        }

        .bar-value {
          color: white;
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .bar-units {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
          text-align: center;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-md);
          font-size: var(--text-sm);
        }

        .legend-item.profit {
          color: var(--success);
        }

        .legend-item.loss {
          color: var(--error);
        }

        .legend-break {
          color: var(--text-muted);
        }

        .analysis-table-section {
          margin-bottom: var(--spacing-lg);
        }

        .analysis-table-section h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .analysis-table {
          width: 100%;
          border-collapse: collapse;
        }

        .analysis-table th,
        .analysis-table td {
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: right;
          border-bottom: 1px solid var(--platinum);
        }

        .analysis-table th {
          background: var(--bg-secondary);
          font-weight: 600;
        }

        .analysis-table th:first-child,
        .analysis-table td:first-child {
          text-align: left;
        }

        .analysis-table tr.highlight {
          background: rgba(72, 86, 150, 0.1);
          font-weight: 600;
        }

        .analysis-table td.profit {
          color: var(--success);
          font-weight: 600;
        }

        .analysis-table td.loss {
          color: var(--error);
          font-weight: 600;
        }

        .error-box {
          padding: var(--spacing-lg);
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid var(--error);
          border-radius: var(--radius);
          color: var(--error);
          text-align: center;
        }

        @media (max-width: 768px) {
          .pricing-section,
          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .fixed-cost-row {
            flex-wrap: wrap;
          }

          .name-input {
            width: 100%;
          }

          .bar-chart {
            height: 180px;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default BreakEvenAnalysis;
