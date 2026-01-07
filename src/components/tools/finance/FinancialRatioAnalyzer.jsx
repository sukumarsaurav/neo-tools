import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { ResultActions } from './shared';

// Ratio categories and calculations
const RATIO_CATEGORIES = {
    liquidity: {
        name: 'Liquidity Ratios',
        icon: '💧',
        description: 'Ability to meet short-term obligations'
    },
    profitability: {
        name: 'Profitability Ratios',
        icon: '💰',
        description: 'Ability to generate profits'
    },
    solvency: {
        name: 'Solvency Ratios',
        icon: '🏦',
        description: 'Long-term financial stability'
    },
    efficiency: {
        name: 'Efficiency Ratios',
        icon: '⚡',
        description: 'Operational efficiency'
    }
};

// Industry benchmarks
const INDUSTRY_BENCHMARKS = {
    manufacturing: {
        name: 'Manufacturing',
        currentRatio: { good: 1.5, warning: 1.0 },
        quickRatio: { good: 1.0, warning: 0.5 },
        grossMargin: { good: 30, warning: 20 },
        netMargin: { good: 10, warning: 5 },
        debtEquity: { good: 1.0, warning: 2.0 },
        inventoryTurnover: { good: 6, warning: 3 }
    },
    retail: {
        name: 'Retail',
        currentRatio: { good: 1.2, warning: 0.8 },
        quickRatio: { good: 0.5, warning: 0.3 },
        grossMargin: { good: 25, warning: 15 },
        netMargin: { good: 5, warning: 2 },
        debtEquity: { good: 1.5, warning: 3.0 },
        inventoryTurnover: { good: 8, warning: 4 }
    },
    services: {
        name: 'Services',
        currentRatio: { good: 1.5, warning: 1.0 },
        quickRatio: { good: 1.2, warning: 0.8 },
        grossMargin: { good: 50, warning: 35 },
        netMargin: { good: 15, warning: 8 },
        debtEquity: { good: 0.5, warning: 1.5 },
        inventoryTurnover: { good: 0, warning: 0 }
    },
    technology: {
        name: 'Technology',
        currentRatio: { good: 2.0, warning: 1.5 },
        quickRatio: { good: 1.8, warning: 1.2 },
        grossMargin: { good: 60, warning: 45 },
        netMargin: { good: 20, warning: 10 },
        debtEquity: { good: 0.3, warning: 1.0 },
        inventoryTurnover: { good: 0, warning: 0 }
    }
};

const FinancialRatioAnalyzer = () => {
    const [industry, setIndustry] = useState('manufacturing');
    const [inputs, setInputs] = useState({
        // Balance Sheet - Assets
        currentAssets: 500000,
        inventory: 150000,
        receivables: 100000,
        cash: 50000,
        totalAssets: 1500000,
        fixedAssets: 1000000,

        // Balance Sheet - Liabilities
        currentLiabilities: 300000,
        totalLiabilities: 800000,
        longTermDebt: 500000,

        // Balance Sheet - Equity
        shareholderEquity: 700000,

        // Income Statement
        revenue: 2000000,
        costOfGoodsSold: 1400000,
        grossProfit: 600000,
        operatingExpenses: 350000,
        operatingIncome: 250000,
        interestExpense: 50000,
        netIncome: 150000,

        // Additional
        averageInventory: 140000,
        averageReceivables: 95000,
        averagePayables: 80000,
        creditPurchases: 1200000
    });

    const [expandedSections, setExpandedSections] = useState({
        assets: true,
        liabilities: true,
        income: false
    });

    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'financial-ratio-analyzer')
        .slice(0, 3);

    // Calculate ratios on input change
    useEffect(() => {
        calculateRatios();
    }, [inputs, industry]);

    const calculateRatios = () => {
        const benchmark = INDUSTRY_BENCHMARKS[industry];

        // Liquidity Ratios
        const currentRatio = inputs.currentAssets / inputs.currentLiabilities;
        const quickRatio = (inputs.currentAssets - inputs.inventory) / inputs.currentLiabilities;
        const cashRatio = inputs.cash / inputs.currentLiabilities;

        // Profitability Ratios
        const grossMargin = (inputs.grossProfit / inputs.revenue) * 100;
        const operatingMargin = (inputs.operatingIncome / inputs.revenue) * 100;
        const netMargin = (inputs.netIncome / inputs.revenue) * 100;
        const roa = (inputs.netIncome / inputs.totalAssets) * 100;
        const roe = (inputs.netIncome / inputs.shareholderEquity) * 100;

        // Solvency Ratios
        const debtEquity = inputs.totalLiabilities / inputs.shareholderEquity;
        const debtRatio = inputs.totalLiabilities / inputs.totalAssets;
        const interestCoverage = inputs.operatingIncome / inputs.interestExpense;

        // Efficiency Ratios
        const inventoryTurnover = inputs.costOfGoodsSold / inputs.averageInventory;
        const receivablesTurnover = inputs.revenue / inputs.averageReceivables;
        const payablesTurnover = inputs.creditPurchases / inputs.averagePayables;
        const daysInventory = 365 / inventoryTurnover;
        const daysReceivables = 365 / receivablesTurnover;
        const daysPayables = 365 / payablesTurnover;
        const cashConversionCycle = daysInventory + daysReceivables - daysPayables;

        // Helper to determine status
        const getStatus = (value, benchmarkKey, higherIsBetter = true) => {
            const bm = benchmark[benchmarkKey];
            if (!bm) return 'neutral';
            if (higherIsBetter) {
                if (value >= bm.good) return 'good';
                if (value >= bm.warning) return 'warning';
                return 'poor';
            } else {
                if (value <= bm.good) return 'good';
                if (value <= bm.warning) return 'warning';
                return 'poor';
            }
        };

        setResult({
            liquidity: [
                { name: 'Current Ratio', value: currentRatio.toFixed(2), unit: ':1', status: getStatus(currentRatio, 'currentRatio'), description: 'Current Assets / Current Liabilities' },
                { name: 'Quick Ratio', value: quickRatio.toFixed(2), unit: ':1', status: getStatus(quickRatio, 'quickRatio'), description: '(Current Assets - Inventory) / Current Liabilities' },
                { name: 'Cash Ratio', value: cashRatio.toFixed(2), unit: ':1', status: cashRatio >= 0.2 ? 'good' : 'warning', description: 'Cash / Current Liabilities' }
            ],
            profitability: [
                { name: 'Gross Margin', value: grossMargin.toFixed(1), unit: '%', status: getStatus(grossMargin, 'grossMargin'), description: 'Gross Profit / Revenue' },
                { name: 'Operating Margin', value: operatingMargin.toFixed(1), unit: '%', status: operatingMargin >= 10 ? 'good' : operatingMargin >= 5 ? 'warning' : 'poor', description: 'Operating Income / Revenue' },
                { name: 'Net Profit Margin', value: netMargin.toFixed(1), unit: '%', status: getStatus(netMargin, 'netMargin'), description: 'Net Income / Revenue' },
                { name: 'Return on Assets', value: roa.toFixed(1), unit: '%', status: roa >= 5 ? 'good' : roa >= 2 ? 'warning' : 'poor', description: 'Net Income / Total Assets' },
                { name: 'Return on Equity', value: roe.toFixed(1), unit: '%', status: roe >= 15 ? 'good' : roe >= 8 ? 'warning' : 'poor', description: 'Net Income / Shareholder Equity' }
            ],
            solvency: [
                { name: 'Debt to Equity', value: debtEquity.toFixed(2), unit: ':1', status: getStatus(debtEquity, 'debtEquity', false), description: 'Total Liabilities / Equity' },
                { name: 'Debt Ratio', value: (debtRatio * 100).toFixed(1), unit: '%', status: debtRatio <= 0.5 ? 'good' : debtRatio <= 0.7 ? 'warning' : 'poor', description: 'Total Liabilities / Total Assets' },
                { name: 'Interest Coverage', value: interestCoverage.toFixed(1), unit: 'x', status: interestCoverage >= 3 ? 'good' : interestCoverage >= 1.5 ? 'warning' : 'poor', description: 'Operating Income / Interest Expense' }
            ],
            efficiency: [
                { name: 'Inventory Turnover', value: inventoryTurnover.toFixed(1), unit: 'x', status: getStatus(inventoryTurnover, 'inventoryTurnover'), description: 'COGS / Average Inventory' },
                { name: 'Days Inventory', value: daysInventory.toFixed(0), unit: ' days', status: daysInventory <= 60 ? 'good' : daysInventory <= 90 ? 'warning' : 'poor', description: '365 / Inventory Turnover' },
                { name: 'Receivables Turnover', value: receivablesTurnover.toFixed(1), unit: 'x', status: receivablesTurnover >= 10 ? 'good' : receivablesTurnover >= 6 ? 'warning' : 'poor', description: 'Revenue / Average Receivables' },
                { name: 'Days Sales Outstanding', value: daysReceivables.toFixed(0), unit: ' days', status: daysReceivables <= 45 ? 'good' : daysReceivables <= 60 ? 'warning' : 'poor', description: '365 / Receivables Turnover' },
                { name: 'Cash Conversion Cycle', value: cashConversionCycle.toFixed(0), unit: ' days', status: cashConversionCycle <= 45 ? 'good' : cashConversionCycle <= 75 ? 'warning' : 'poor', description: 'Days Inventory + Days Receivables - Days Payables' }
            ]
        });
    };

    const updateInput = (field, value) => {
        setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const getCopyText = () => {
        if (!result) return '';
        let text = `Financial Ratio Analysis\n========================\n\n`;

        Object.entries(result).forEach(([category, ratios]) => {
            text += `${RATIO_CATEGORIES[category].name}\n`;
            ratios.forEach(r => {
                text += `${r.name}: ${r.value}${r.unit} (${r.status})\n`;
            });
            text += '\n';
        });

        return text;
    };

    const faqs = [
        {
            question: 'What are financial ratios?',
            answer: 'Financial ratios are quantitative measures derived from financial statements that help assess a company\'s performance, financial health, and operational efficiency. They enable comparison across time periods and against industry peers.'
        },
        {
            question: 'What is a good current ratio?',
            answer: 'Generally, a current ratio of 1.5 to 2.0 is considered healthy. Below 1.0 indicates potential liquidity issues. However, the ideal ratio varies by industry - retail typically has lower ratios than manufacturing.'
        },
        {
            question: 'How is Return on Equity (ROE) calculated?',
            answer: 'ROE = (Net Income / Shareholder Equity) × 100. It measures how effectively a company uses shareholder investment to generate profits. Higher ROE generally indicates better management efficiency.'
        },
        {
            question: 'What does the Cash Conversion Cycle indicate?',
            answer: 'The Cash Conversion Cycle measures how long cash is tied up in working capital before being converted back to cash through sales. A shorter cycle is generally better as it means faster cash generation.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is Financial Ratio Analysis?</h2>
            <p>
                Financial ratio analysis is a method of evaluating a company's financial performance
                by examining relationships between various financial statement items. Our analyzer
                covers four key categories: liquidity, profitability, solvency, and efficiency.
            </p>

            <h2>Key Ratio Categories</h2>
            <ul>
                <li><strong>Liquidity Ratios:</strong> Measure ability to pay short-term debts (Current Ratio, Quick Ratio)</li>
                <li><strong>Profitability Ratios:</strong> Measure earning capacity (Gross Margin, Net Margin, ROE)</li>
                <li><strong>Solvency Ratios:</strong> Measure long-term financial stability (Debt to Equity, Interest Coverage)</li>
                <li><strong>Efficiency Ratios:</strong> Measure operational effectiveness (Inventory Turnover, DSO)</li>
            </ul>
        </>
    );

    const inputFields = {
        assets: [
            { key: 'currentAssets', label: 'Current Assets' },
            { key: 'cash', label: 'Cash & Cash Equivalents' },
            { key: 'receivables', label: 'Accounts Receivable' },
            { key: 'inventory', label: 'Inventory' },
            { key: 'fixedAssets', label: 'Fixed Assets' },
            { key: 'totalAssets', label: 'Total Assets' }
        ],
        liabilities: [
            { key: 'currentLiabilities', label: 'Current Liabilities' },
            { key: 'longTermDebt', label: 'Long-term Debt' },
            { key: 'totalLiabilities', label: 'Total Liabilities' },
            { key: 'shareholderEquity', label: 'Shareholder Equity' }
        ],
        income: [
            { key: 'revenue', label: 'Revenue / Sales' },
            { key: 'costOfGoodsSold', label: 'Cost of Goods Sold' },
            { key: 'grossProfit', label: 'Gross Profit' },
            { key: 'operatingExpenses', label: 'Operating Expenses' },
            { key: 'operatingIncome', label: 'Operating Income (EBIT)' },
            { key: 'interestExpense', label: 'Interest Expense' },
            { key: 'netIncome', label: 'Net Income' },
            { key: 'averageInventory', label: 'Average Inventory' },
            { key: 'averageReceivables', label: 'Average Receivables' },
            { key: 'averagePayables', label: 'Average Payables' },
            { key: 'creditPurchases', label: 'Credit Purchases' }
        ]
    };

    return (
        <ToolLayout
            title="Financial Ratio Analyzer"
            description="Analyze financial health with key ratios. Calculate liquidity, profitability, solvency, and efficiency ratios with industry benchmarks."
            keywords={['financial ratios', 'ratio analysis', 'liquidity ratio', 'profitability ratio', 'ROE calculator', 'current ratio']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Industry Selection */}
                <div className="industry-section">
                    <label className="form-label">Select Industry for Benchmarks</label>
                    <div className="industry-grid">
                        {Object.entries(INDUSTRY_BENCHMARKS).map(([key, ind]) => (
                            <button
                                key={key}
                                className={`industry-btn ${industry === key ? 'active' : ''}`}
                                onClick={() => setIndustry(key)}
                            >
                                {ind.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Sections */}
                <div className="input-sections">
                    {Object.entries(inputFields).map(([section, fields]) => (
                        <div key={section} className="input-section">
                            <button
                                className="section-header"
                                onClick={() => toggleSection(section)}
                            >
                                <span>
                                    {section === 'assets' && '📊 '}
                                    {section === 'liabilities' && '📋 '}
                                    {section === 'income' && '💵 '}
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                </span>
                                <span className="toggle-icon">{expandedSections[section] ? '▼' : '▶'}</span>
                            </button>
                            {expandedSections[section] && (
                                <div className="section-content">
                                    <div className="input-grid">
                                        {fields.map(field => (
                                            <div key={field.key} className="input-item">
                                                <label>{field.label}</label>
                                                <div className="amount-wrapper">
                                                    <span>₹</span>
                                                    <input
                                                        type="number"
                                                        value={inputs[field.key] || ''}
                                                        onChange={(e) => updateInput(field.key, e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Results */}
                {result && (
                    <div className="result-box">
                        {Object.entries(result).map(([category, ratios]) => (
                            <div key={category} className="ratio-category">
                                <h4>
                                    {RATIO_CATEGORIES[category].icon} {RATIO_CATEGORIES[category].name}
                                </h4>
                                <p className="category-desc">{RATIO_CATEGORIES[category].description}</p>
                                <div className="ratios-grid">
                                    {ratios.map((ratio, idx) => (
                                        <div key={idx} className={`ratio-card ${ratio.status}`}>
                                            <div className="ratio-header">
                                                <span className="ratio-name">{ratio.name}</span>
                                                <span className={`status-badge ${ratio.status}`}>
                                                    {ratio.status === 'good' && '✓ Healthy'}
                                                    {ratio.status === 'warning' && '⚠ Caution'}
                                                    {ratio.status === 'poor' && '✗ Concern'}
                                                    {ratio.status === 'neutral' && '○ N/A'}
                                                </span>
                                            </div>
                                            <div className="ratio-value">
                                                {ratio.value}{ratio.unit}
                                            </div>
                                            <div className="ratio-formula">{ratio.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="Financial Ratio Analysis"
                            shareText="Financial health analysis with key ratios"
                            toolName="financial-ratio-analyzer"
                        />
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 900px;
          margin: 0 auto;
        }

        .industry-section {
          margin-bottom: var(--spacing-xl);
        }

        .industry-grid {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .industry-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-family: inherit;
          transition: all var(--transition);
        }

        .industry-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .industry-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
          color: var(--yinmn-blue);
        }

        .input-sections {
          margin-bottom: var(--spacing-xl);
        }

        .input-section {
          margin-bottom: var(--spacing-md);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          overflow: hidden;
        }

        .section-header {
          width: 100%;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-family: inherit;
          font-size: var(--text-base);
          font-weight: 600;
        }

        .section-content {
          padding: var(--spacing-md);
        }

        .input-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .input-item label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .amount-wrapper {
          display: flex;
          align-items: stretch;
        }

        .amount-wrapper span {
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-sm);
          background: var(--bg-tertiary);
          border: 1px solid var(--platinum);
          border-right: none;
          border-radius: var(--radius) 0 0 var(--radius);
          font-size: var(--text-sm);
        }

        .amount-wrapper input {
          flex: 1;
          padding: var(--spacing-sm);
          border: 1px solid var(--platinum);
          border-radius: 0 var(--radius) var(--radius) 0;
          font-size: var(--text-sm);
          text-align: right;
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .ratio-category {
          margin-bottom: var(--spacing-xl);
        }

        .ratio-category h4 {
          margin: 0 0 var(--spacing-xs) 0;
        }

        .category-desc {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin: 0 0 var(--spacing-md) 0;
        }

        .ratios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }

        .ratio-card {
          padding: var(--spacing-md);
          border-radius: var(--radius);
          background: var(--bg-secondary);
          border-left: 4px solid var(--platinum);
        }

        .ratio-card.good {
          border-left-color: var(--success);
        }

        .ratio-card.warning {
          border-left-color: var(--warning);
        }

        .ratio-card.poor {
          border-left-color: var(--error);
        }

        .ratio-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }

        .ratio-name {
          font-weight: 500;
          font-size: var(--text-sm);
        }

        .status-badge {
          font-size: var(--text-xs);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .status-badge.good {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }

        .status-badge.warning {
          background: rgba(251, 191, 36, 0.1);
          color: var(--warning);
        }

        .status-badge.poor {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .ratio-value {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--text-dark);
        }

        .ratio-formula {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
        }
      `}</style>
        </ToolLayout>
    );
};

export default FinancialRatioAnalyzer;
