import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, ResultActions } from './shared';

// Asset categories with depreciation rates
const ASSET_CATEGORIES = [
    {
        id: 'computers',
        name: 'Computers & Laptops',
        companiesActRate: 33.33,
        companiesActMethod: 'SLM',
        incomeTaxRate: 40,
        incomeTaxMethod: 'WDV',
        usefulLife: 3
    },
    {
        id: 'plant-machinery',
        name: 'Plant & Machinery',
        companiesActRate: 15,
        companiesActMethod: 'SLM',
        incomeTaxRate: 15,
        incomeTaxMethod: 'WDV',
        usefulLife: 10
    },
    {
        id: 'furniture',
        name: 'Furniture & Fixtures',
        companiesActRate: 10,
        companiesActMethod: 'SLM',
        incomeTaxRate: 10,
        incomeTaxMethod: 'WDV',
        usefulLife: 10
    },
    {
        id: 'vehicles',
        name: 'Motor Vehicles',
        companiesActRate: 15,
        companiesActMethod: 'SLM',
        incomeTaxRate: 15,
        incomeTaxMethod: 'WDV',
        usefulLife: 8
    },
    {
        id: 'buildings',
        name: 'Buildings',
        companiesActRate: 5,
        companiesActMethod: 'SLM',
        incomeTaxRate: 10,
        incomeTaxMethod: 'WDV',
        usefulLife: 30
    },
    {
        id: 'office-equipment',
        name: 'Office Equipment',
        companiesActRate: 15,
        companiesActMethod: 'SLM',
        incomeTaxRate: 15,
        incomeTaxMethod: 'WDV',
        usefulLife: 5
    },
    {
        id: 'intangible',
        name: 'Intangible Assets',
        companiesActRate: 20,
        companiesActMethod: 'SLM',
        incomeTaxRate: 25,
        incomeTaxMethod: 'WDV',
        usefulLife: 5
    },
    {
        id: 'electrical',
        name: 'Electrical Installations',
        companiesActRate: 10,
        companiesActMethod: 'SLM',
        incomeTaxRate: 10,
        incomeTaxMethod: 'WDV',
        usefulLife: 10
    }
];

const DepreciationCalculator = () => {
    const [assetValue, setAssetValue] = useState(500000);
    const [selectedAsset, setSelectedAsset] = useState(ASSET_CATEGORIES[0]);
    const [purchaseDate, setPurchaseDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [yearsToCalculate, setYearsToCalculate] = useState(5);
    const [depreciationMode, setDepreciationMode] = useState('both'); // companies-act, income-tax, both
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'depreciation-calculator')
        .slice(0, 3);

    // Calculate depreciation on change
    useEffect(() => {
        calculateDepreciation();
    }, [assetValue, selectedAsset, purchaseDate, yearsToCalculate]);

    // Calculate first year depreciation ratio based on purchase date
    const getFirstYearRatio = () => {
        const date = new Date(purchaseDate);
        const fiscalYearStart = new Date(date.getFullYear(), 3, 1); // April 1
        if (date < fiscalYearStart) {
            fiscalYearStart.setFullYear(fiscalYearStart.getFullYear() - 1);
        }
        const fiscalYearEnd = new Date(fiscalYearStart.getFullYear() + 1, 2, 31); // March 31

        // Calculate remaining days in fiscal year
        const totalDays = 365;
        const remainingDays = Math.ceil((fiscalYearEnd - date) / (1000 * 60 * 60 * 24));

        // Income tax: If asset used < 180 days, 50% depreciation
        const months = remainingDays / 30;
        return {
            fullYearRatio: remainingDays / totalDays,
            itRatio: months < 6 ? 0.5 : 1 // IT Act: Half if < 180 days
        };
    };

    const calculateDepreciation = () => {
        if (assetValue <= 0) {
            setResult(null);
            return;
        }

        const { itRatio } = getFirstYearRatio();

        // Companies Act Calculation (SLM - Straight Line Method)
        const caRate = selectedAsset.companiesActRate / 100;
        const caSchedule = [];
        let caOpeningValue = assetValue;

        for (let year = 1; year <= yearsToCalculate; year++) {
            const depreciation = assetValue * caRate;
            const closingValue = Math.max(0, caOpeningValue - depreciation);
            caSchedule.push({
                year,
                openingValue: caOpeningValue,
                depreciation: Math.min(depreciation, caOpeningValue),
                closingValue
            });
            caOpeningValue = closingValue;
            if (caOpeningValue === 0) break;
        }

        // Income Tax Calculation (WDV - Written Down Value)
        const itRate = selectedAsset.incomeTaxRate / 100;
        const itSchedule = [];
        let itOpeningValue = assetValue;

        for (let year = 1; year <= yearsToCalculate; year++) {
            const effectiveRate = year === 1 ? itRate * itRatio : itRate;
            const depreciation = itOpeningValue * effectiveRate;
            const closingValue = itOpeningValue - depreciation;
            itSchedule.push({
                year,
                openingValue: itOpeningValue,
                rate: effectiveRate * 100,
                depreciation,
                closingValue
            });
            itOpeningValue = closingValue;
        }

        // Calculate totals
        const caTotalDepreciation = caSchedule.reduce((sum, y) => sum + y.depreciation, 0);
        const itTotalDepreciation = itSchedule.reduce((sum, y) => sum + y.depreciation, 0);

        setResult({
            assetValue,
            assetType: selectedAsset.name,
            companiesAct: {
                rate: selectedAsset.companiesActRate,
                method: selectedAsset.companiesActMethod,
                schedule: caSchedule,
                totalDepreciation: caTotalDepreciation,
                finalValue: caSchedule[caSchedule.length - 1]?.closingValue || 0
            },
            incomeTax: {
                rate: selectedAsset.incomeTaxRate,
                method: selectedAsset.incomeTaxMethod,
                schedule: itSchedule,
                totalDepreciation: itTotalDepreciation,
                finalValue: itSchedule[itSchedule.length - 1]?.closingValue || 0
            }
        });
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';

        let text = `Depreciation Schedule - ${result.assetType}
Original Value: ₹${result.assetValue.toLocaleString('en-IN')}
Years: ${yearsToCalculate}

COMPANIES ACT (${result.companiesAct.method} @ ${result.companiesAct.rate}%)
`;
        result.companiesAct.schedule.forEach(row => {
            text += `Year ${row.year}: Depreciation ₹${row.depreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\n`;
        });
        text += `Total: ₹${result.companiesAct.totalDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}

INCOME TAX (${result.incomeTax.method} @ ${result.incomeTax.rate}%)
`;
        result.incomeTax.schedule.forEach(row => {
            text += `Year ${row.year}: Depreciation ₹${row.depreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\n`;
        });
        text += `Total: ₹${result.incomeTax.totalDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

        return text;
    };

    // Export to CSV
    const exportToCSV = () => {
        if (!result) return;

        let csv = 'Year,Companies Act Opening,CA Depreciation,CA Closing,IT Opening,IT Rate %,IT Depreciation,IT Closing\n';

        for (let i = 0; i < Math.max(result.companiesAct.schedule.length, result.incomeTax.schedule.length); i++) {
            const ca = result.companiesAct.schedule[i] || {};
            const it = result.incomeTax.schedule[i] || {};
            csv += `${i + 1},${ca.openingValue?.toFixed(2) || ''},${ca.depreciation?.toFixed(2) || ''},${ca.closingValue?.toFixed(2) || ''},${it.openingValue?.toFixed(2) || ''},${it.rate?.toFixed(1) || ''},${it.depreciation?.toFixed(2) || ''},${it.closingValue?.toFixed(2) || ''}\n`;
        }

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `depreciation_${selectedAsset.id}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const faqs = [
        {
            question: 'What is the difference between SLM and WDV?',
            answer: 'SLM (Straight Line Method) charges equal depreciation every year based on original cost. WDV (Written Down Value) charges depreciation on the reduced balance each year, resulting in higher depreciation in initial years.'
        },
        {
            question: 'Why are there two depreciation calculations?',
            answer: 'Companies Act depreciation is used for book/accounting purposes and financial statements. Income Tax depreciation is used for computing taxable income. The rates and methods differ, creating timing differences.'
        },
        {
            question: 'What is the 180-day rule for Income Tax depreciation?',
            answer: 'Under Income Tax Act, if an asset is put to use for less than 180 days in the financial year, only 50% of the normal depreciation can be claimed for that year.'
        },
        {
            question: 'Can I claim depreciation on used/second-hand assets?',
            answer: 'Yes, depreciation can be claimed on second-hand assets. The actual cost of acquisition is considered as the asset value, and normal depreciation rates apply based on the asset type.'
        },
        {
            question: 'What is the depreciation rate for computers under Income Tax?',
            answer: 'Computers and related equipment attract 40% depreciation under Income Tax Act (WDV method) - one of the highest rates, reflecting the rapid obsolescence of technology.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is a Depreciation Calculator?</h2>
            <p>
                A Depreciation Calculator helps businesses and professionals compute the allowable
                depreciation on fixed assets under both Companies Act 2013 and Income Tax Act. Understanding
                depreciation is crucial for accurate financial reporting and tax planning.
            </p>

            <h2>Depreciation Methods</h2>
            <ul>
                <li><strong>Straight Line Method (SLM):</strong> Used under Companies Act. Same depreciation amount every year. Formula: (Cost - Residual Value) / Useful Life</li>
                <li><strong>Written Down Value (WDV):</strong> Used under Income Tax Act. Depreciation on reduced balance. Higher initial depreciation, decreasing over time.</li>
            </ul>

            <h2>Common Depreciation Rates</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Asset Type</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Companies Act (SLM)</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Income Tax (WDV)</th>
                    </tr>
                </thead>
                <tbody>
                    {ASSET_CATEGORIES.map(asset => (
                        <tr key={asset.id}>
                            <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{asset.name}</td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>{asset.companiesActRate}%</td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>{asset.incomeTaxRate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Key Differences</h2>
            <ul>
                <li><strong>Purpose:</strong> Companies Act for books, Income Tax for tax returns</li>
                <li><strong>Method:</strong> SLM vs WDV creates different expense patterns</li>
                <li><strong>First Year:</strong> IT allows only 50% if used for &lt;180 days</li>
                <li><strong>Result:</strong> Creates deferred tax assets/liabilities</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Depreciation Calculator"
            description="Calculate asset depreciation under Companies Act 2013 and Income Tax Act. Compare SLM vs WDV methods with multi-year schedule."
            keywords={['depreciation calculator', 'Companies Act depreciation', 'Income Tax depreciation', 'WDV depreciation', 'SLM depreciation', 'asset depreciation India']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Asset Type Selection */}
                <div className="asset-selection">
                    <label className="form-label">Select Asset Type</label>
                    <div className="asset-grid">
                        {ASSET_CATEGORIES.map((asset) => (
                            <button
                                key={asset.id}
                                className={`asset-card ${selectedAsset.id === asset.id ? 'active' : ''}`}
                                onClick={() => setSelectedAsset(asset)}
                            >
                                <span className="asset-name">{asset.name}</span>
                                <span className="asset-rates">
                                    CA: {asset.companiesActRate}% | IT: {asset.incomeTaxRate}%
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Asset Value Slider */}
                <SliderInput
                    id="asset-value"
                    label="Asset Value (₹)"
                    value={assetValue}
                    onChange={setAssetValue}
                    min={10000}
                    max={100000000}
                    step={10000}
                    prefix="₹"
                    tickMarks={[100000, 1000000, 10000000, 50000000, 100000000]}
                    formatValue={(val) => {
                        if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
                        if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                        return val.toLocaleString('en-IN');
                    }}
                />

                {/* Purchase Date & Years */}
                <div className="input-row">
                    <div className="form-group">
                        <label className="form-label">Date of Purchase</label>
                        <input
                            type="date"
                            className="form-input"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Calculate for (Years)</label>
                        <select
                            className="form-select"
                            value={yearsToCalculate}
                            onChange={(e) => setYearsToCalculate(parseInt(e.target.value))}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(y => (
                                <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Asset Info Card */}
                <div className="asset-info">
                    <h4>{selectedAsset.name}</h4>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Companies Act</span>
                            <span className="info-value">{selectedAsset.companiesActRate}% {selectedAsset.companiesActMethod}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Income Tax</span>
                            <span className="info-value">{selectedAsset.incomeTaxRate}% {selectedAsset.incomeTaxMethod}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Useful Life</span>
                            <span className="info-value">{selectedAsset.usefulLife} years</span>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {result && (
                    <div className="result-box">
                        {/* Summary Cards */}
                        <div className="summary-grid">
                            <div className="summary-card companies-act">
                                <h4>📊 Companies Act ({result.companiesAct.method})</h4>
                                <div className="summary-value">
                                    ₹{result.companiesAct.totalDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </div>
                                <div className="summary-label">Total Depreciation over {yearsToCalculate} years</div>
                                <div className="summary-final">
                                    Book Value: ₹{result.companiesAct.finalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </div>
                            </div>
                            <div className="summary-card income-tax">
                                <h4>📋 Income Tax ({result.incomeTax.method})</h4>
                                <div className="summary-value">
                                    ₹{result.incomeTax.totalDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </div>
                                <div className="summary-label">Total Depreciation over {yearsToCalculate} years</div>
                                <div className="summary-final">
                                    WDV Value: ₹{result.incomeTax.finalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </div>
                            </div>
                        </div>

                        {/* Comparison Bar */}
                        <div className="comparison-bar">
                            <div className="comparison-label">Depreciation Comparison</div>
                            <div className="bar-container">
                                <div
                                    className="bar companies-act"
                                    style={{ width: `${(result.companiesAct.totalDepreciation / assetValue) * 100}%` }}
                                >
                                    <span>CA: {((result.companiesAct.totalDepreciation / assetValue) * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                            <div className="bar-container">
                                <div
                                    className="bar income-tax"
                                    style={{ width: `${(result.incomeTax.totalDepreciation / assetValue) * 100}%` }}
                                >
                                    <span>IT: {((result.incomeTax.totalDepreciation / assetValue) * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Schedule */}
                        <div className="schedule-section">
                            <h4>📅 Year-wise Depreciation Schedule</h4>
                            <div className="schedule-table-wrapper">
                                <table className="schedule-table">
                                    <thead>
                                        <tr>
                                            <th rowSpan="2">Year</th>
                                            <th colSpan="3" className="header-ca">Companies Act (SLM @ {result.companiesAct.rate}%)</th>
                                            <th colSpan="3" className="header-it">Income Tax (WDV @ {result.incomeTax.rate}%)</th>
                                        </tr>
                                        <tr>
                                            <th className="header-ca">Opening</th>
                                            <th className="header-ca">Depreciation</th>
                                            <th className="header-ca">Closing</th>
                                            <th className="header-it">Opening</th>
                                            <th className="header-it">Depreciation</th>
                                            <th className="header-it">Closing</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.companiesAct.schedule.map((caRow, idx) => {
                                            const itRow = result.incomeTax.schedule[idx];
                                            return (
                                                <tr key={idx}>
                                                    <td>{caRow?.year || itRow?.year}</td>
                                                    <td>₹{caRow?.openingValue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '-'}</td>
                                                    <td>₹{caRow?.depreciation?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '-'}</td>
                                                    <td>₹{caRow?.closingValue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '-'}</td>
                                                    <td>₹{itRow?.openingValue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '-'}</td>
                                                    <td>₹{itRow?.depreciation?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '-'}</td>
                                                    <td>₹{itRow?.closingValue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-row">
                            <button className="btn btn-secondary" onClick={exportToCSV}>
                                📥 Export to CSV
                            </button>
                            <ResultActions
                                copyText={getCopyText()}
                                shareTitle="Depreciation Calculation"
                                shareText={`Depreciation for ${selectedAsset.name} worth ₹${assetValue.toLocaleString('en-IN')}: CA: ₹${result.companiesAct.totalDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}, IT: ₹${result.incomeTax.totalDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                                toolName="depreciation-calculator"
                            />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 900px;
          margin: 0 auto;
        }

        .asset-selection {
          margin-bottom: var(--spacing-xl);
        }

        .asset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }

        .asset-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
          text-align: left;
        }

        .asset-card:hover {
          border-color: var(--yinmn-blue);
        }

        .asset-card.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
        }

        .asset-name {
          font-weight: 600;
          font-size: var(--text-sm);
          color: var(--text-dark);
          margin-bottom: var(--spacing-xs);
        }

        .asset-rates {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-select {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-family: inherit;
          font-size: var(--text-base);
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .asset-info {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
          border-left: 4px solid var(--yinmn-blue);
        }

        .asset-info h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
        }

        .info-item {
          text-align: center;
        }

        .info-label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .info-value {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--text-dark);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .summary-card {
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          text-align: center;
        }

        .summary-card.companies-act {
          background: linear-gradient(135deg, rgba(72, 86, 150, 0.1), rgba(72, 86, 150, 0.05));
          border: 2px solid var(--yinmn-blue);
        }

        .summary-card.income-tax {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          border: 2px solid var(--success);
        }

        .summary-card h4 {
          margin: 0 0 var(--spacing-sm) 0;
          font-size: var(--text-sm);
        }

        .summary-value {
          font-size: var(--text-3xl);
          font-weight: 700;
          color: var(--text-dark);
        }

        .summary-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
        }

        .summary-final {
          margin-top: var(--spacing-sm);
          font-size: var(--text-sm);
          color: var(--text-muted);
          padding-top: var(--spacing-sm);
          border-top: 1px dashed var(--platinum);
        }

        .comparison-bar {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
        }

        .comparison-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-sm);
        }

        .bar-container {
          height: 30px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-xs);
          overflow: hidden;
        }

        .bar {
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-sm);
          color: white;
          font-size: var(--text-sm);
          font-weight: 500;
          transition: width 0.5s ease;
        }

        .bar.companies-act {
          background: var(--yinmn-blue);
        }

        .bar.income-tax {
          background: var(--success);
        }

        .schedule-section {
          margin-bottom: var(--spacing-lg);
        }

        .schedule-section h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .schedule-table-wrapper {
          overflow-x: auto;
        }

        .schedule-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm);
        }

        .schedule-table th,
        .schedule-table td {
          padding: var(--spacing-sm);
          text-align: right;
          border: 1px solid var(--platinum);
        }

        .schedule-table th {
          background: var(--bg-tertiary);
          font-weight: 600;
        }

        .schedule-table th:first-child,
        .schedule-table td:first-child {
          text-align: center;
        }

        .header-ca {
          background: rgba(72, 86, 150, 0.1) !important;
        }

        .header-it {
          background: rgba(16, 185, 129, 0.1) !important;
        }

        .action-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .asset-grid {
            grid-template-columns: 1fr 1fr;
          }

          .input-row {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-sm);
          }

          .schedule-table {
            font-size: var(--text-xs);
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default DepreciationCalculator;
