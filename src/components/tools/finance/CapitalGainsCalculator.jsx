import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { ResultActions } from './shared';
import { CII_TABLE, getFiscalYear, getCII, calculateIndexedCost } from './shared/CIITable';

// Asset types with holding period for LTCG classification
const ASSET_TYPES = [
    {
        id: 'listed-shares',
        name: 'Listed Shares / Equity MF',
        icon: '📈',
        ltcgPeriodMonths: 12,
        stcgRate: 15,
        ltcgRate: 10,
        ltcgExemption: 100000, // Rs 1 Lakh exemption
        indexationAllowed: false,
        notes: 'LTCG above ₹1 Lakh taxed at 10% without indexation'
    },
    {
        id: 'unlisted-shares',
        name: 'Unlisted Shares',
        icon: '📊',
        ltcgPeriodMonths: 24,
        stcgRate: 'slab',
        ltcgRate: 20,
        indexationAllowed: true,
        notes: 'LTCG taxed at 20% with indexation benefit'
    },
    {
        id: 'real-estate',
        name: 'Real Estate / Property',
        icon: '🏠',
        ltcgPeriodMonths: 24,
        stcgRate: 'slab',
        ltcgRate: 20,
        indexationAllowed: true,
        notes: 'LTCG taxed at 20% with indexation. Can save tax via Section 54/54F'
    },
    {
        id: 'debt-mf',
        name: 'Debt Mutual Funds',
        icon: '💵',
        ltcgPeriodMonths: 36,
        stcgRate: 'slab',
        ltcgRate: 'slab', // Changed from April 2023
        indexationAllowed: false,
        notes: 'From April 2023, taxed as per income slab (no indexation)'
    },
    {
        id: 'gold',
        name: 'Gold / Gold ETF / Bonds',
        icon: '🥇',
        ltcgPeriodMonths: 36,
        stcgRate: 'slab',
        ltcgRate: 20,
        indexationAllowed: true,
        notes: 'LTCG taxed at 20% with indexation'
    },
    {
        id: 'other-assets',
        name: 'Other Capital Assets',
        icon: '📦',
        ltcgPeriodMonths: 36,
        stcgRate: 'slab',
        ltcgRate: 20,
        indexationAllowed: true,
        notes: 'LTCG taxed at 20% with indexation'
    }
];

// Grandfather clause date for listed shares
const GRANDFATHER_DATE = new Date('2018-01-31');

const CapitalGainsCalculator = () => {
    const [selectedAsset, setSelectedAsset] = useState(ASSET_TYPES[0]);
    const [purchaseDate, setPurchaseDate] = useState('');
    const [purchaseCost, setPurchaseCost] = useState('');
    const [saleDate, setSaleDate] = useState('');
    const [saleValue, setSaleValue] = useState('');
    const [expenses, setExpenses] = useState('');
    const [fairMarketValue, setFairMarketValue] = useState(''); // For grandfather clause
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'capital-gains-calculator')
        .slice(0, 3);

    // Calculate on input change
    useEffect(() => {
        calculateCapitalGains();
    }, [selectedAsset, purchaseDate, purchaseCost, saleDate, saleValue, expenses, fairMarketValue]);

    const calculateCapitalGains = () => {
        const purchase = parseFloat(purchaseCost) || 0;
        const sale = parseFloat(saleValue) || 0;
        const exp = parseFloat(expenses) || 0;
        const fmv = parseFloat(fairMarketValue) || 0;

        if (!purchaseDate || !saleDate || purchase <= 0 || sale <= 0) {
            setResult(null);
            return;
        }

        const purchaseDateObj = new Date(purchaseDate);
        const saleDateObj = new Date(saleDate);

        // Calculate holding period in months
        const holdingMonths = Math.floor(
            (saleDateObj - purchaseDateObj) / (1000 * 60 * 60 * 24 * 30)
        );

        // Determine if LTCG or STCG
        const isLTCG = holdingMonths >= selectedAsset.ltcgPeriodMonths;

        // Get fiscal years
        const purchaseFY = getFiscalYear(purchaseDate);
        const saleFY = getFiscalYear(saleDate);

        // Calculate cost of acquisition
        let costOfAcquisition = purchase;
        let indexedCost = null;
        let indexationDetails = null;

        // For listed shares bought before Feb 1, 2018, apply grandfather clause
        if (selectedAsset.id === 'listed-shares' && isLTCG && purchaseDateObj < GRANDFATHER_DATE) {
            // Grandfather clause: Cost = Higher of (Actual cost, Lower of (FMV, Sale Price))
            const effectiveFMV = Math.min(fmv || sale, sale);
            costOfAcquisition = Math.max(purchase, effectiveFMV);
        }

        // Calculate indexed cost if applicable
        if (selectedAsset.indexationAllowed && isLTCG) {
            const purchaseCII = getCII(purchaseFY);
            const saleCII = getCII(saleFY);

            if (purchaseCII && saleCII) {
                indexedCost = (costOfAcquisition * saleCII) / purchaseCII;
                indexationDetails = {
                    purchaseFY,
                    purchaseCII,
                    saleFY,
                    saleCII
                };
            }
        }

        // Calculate capital gain
        const effectiveCost = indexedCost || costOfAcquisition;
        const capitalGain = sale - effectiveCost - exp;

        // Determine tax rate
        let taxRate;
        let taxAmount = 0;
        let taxableGain = capitalGain;

        if (isLTCG) {
            if (selectedAsset.ltcgRate === 'slab') {
                taxRate = 'As per Income Slab';
                taxAmount = null; // User needs to apply their slab
            } else {
                taxRate = selectedAsset.ltcgRate;

                // Apply exemption for listed shares
                if (selectedAsset.id === 'listed-shares' && selectedAsset.ltcgExemption) {
                    taxableGain = Math.max(0, capitalGain - selectedAsset.ltcgExemption);
                }

                taxAmount = (taxableGain * taxRate) / 100;
            }
        } else {
            if (selectedAsset.stcgRate === 'slab') {
                taxRate = 'As per Income Slab';
                taxAmount = null;
            } else {
                taxRate = selectedAsset.stcgRate;
                taxAmount = (capitalGain * taxRate) / 100;
            }
        }

        setResult({
            assetType: selectedAsset.name,
            purchaseDate,
            saleDate,
            holdingMonths,
            holdingYears: (holdingMonths / 12).toFixed(1),
            isLTCG,
            purchaseCost: purchase,
            costOfAcquisition,
            indexedCost,
            indexationDetails,
            saleValue: sale,
            expenses: exp,
            capitalGain,
            taxableGain,
            taxRate,
            taxAmount,
            exemption: selectedAsset.id === 'listed-shares' ? selectedAsset.ltcgExemption : null,
            grandfatherApplied: selectedAsset.id === 'listed-shares' && isLTCG && purchaseDateObj < GRANDFATHER_DATE
        });
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';
        return `Capital Gains Calculation
========================
Asset Type: ${result.assetType}
Purchase Date: ${result.purchaseDate}
Sale Date: ${result.saleDate}
Holding Period: ${result.holdingYears} years (${result.holdingMonths} months)
Type: ${result.isLTCG ? 'Long Term Capital Gain' : 'Short Term Capital Gain'}

Purchase Cost: ₹${result.purchaseCost.toLocaleString('en-IN')}
${result.indexedCost ? `Indexed Cost: ₹${result.indexedCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : ''}
Sale Value: ₹${result.saleValue.toLocaleString('en-IN')}
Expenses: ₹${result.expenses.toLocaleString('en-IN')}

Capital Gain: ₹${result.capitalGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
Tax Rate: ${typeof result.taxRate === 'number' ? result.taxRate + '%' : result.taxRate}
${result.taxAmount !== null ? `Tax Liability: ₹${result.taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : ''}`;
    };

    const faqs = [
        {
            question: 'What is the difference between STCG and LTCG?',
            answer: 'Short Term Capital Gain (STCG) applies when you sell an asset before completing the minimum holding period. Long Term Capital Gain (LTCG) applies when you hold beyond this period. The holding period varies by asset type: 12 months for listed shares, 24 months for property, 36 months for debt funds and gold.'
        },
        {
            question: 'What is indexation benefit?',
            answer: 'Indexation allows you to increase your purchase cost based on inflation (measured by Cost Inflation Index). This reduces your taxable capital gain. It applies only to LTCG on certain assets like property, unlisted shares, and gold.'
        },
        {
            question: 'What is the grandfather clause for shares?',
            answer: 'For listed shares bought before Feb 1, 2018, the cost of acquisition for LTCG calculation is the higher of: (a) actual purchase cost, or (b) lower of FMV as on Jan 31, 2018 and sale price. This was introduced when LTCG on shares became taxable from April 2018.'
        },
        {
            question: 'How can I save tax on LTCG from property sale?',
            answer: 'You can save tax by: (1) Investing in another house within 2 years under Section 54, (2) Investing in capital gains bonds (54EC) like NHAI/REC within 6 months, (3) Investing in CGAS account if not able to invest immediately.'
        },
        {
            question: 'Is LTCG on debt funds taxable with indexation?',
            answer: 'From April 2023, debt funds held for any period are taxed as per your income slab rate without indexation benefit. The earlier 20% with indexation for LTCG no longer applies.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is Capital Gains Tax?</h2>
            <p>
                Capital Gains Tax is the tax you pay on profit from selling a capital asset like
                shares, property, gold, or mutual funds. The tax rate depends on the type of asset
                and how long you held it before selling.
            </p>

            <h2>LTCG Holding Periods</h2>
            <ul>
                <li><strong>12 months:</strong> Listed equity shares, equity mutual funds</li>
                <li><strong>24 months:</strong> Unlisted shares, real estate (from FY 2017-18)</li>
                <li><strong>36 months:</strong> Debt funds, gold, other assets</li>
            </ul>

            <h2>Tax Rates</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>Asset Type</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>STCG Rate</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ddd' }}>LTCG Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {ASSET_TYPES.map(asset => (
                        <tr key={asset.id}>
                            <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{asset.name}</td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                {asset.stcgRate === 'slab' ? 'Slab Rate' : `${asset.stcgRate}%`}
                            </td>
                            <td style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                {asset.ltcgRate === 'slab' ? 'Slab Rate' : `${asset.ltcgRate}%`}
                                {asset.indexationAllowed && ' (with indexation)'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Cost Inflation Index (CII)</h2>
            <p>
                CII is notified by the government each year to account for inflation. Your indexed cost
                equals: Purchase Cost × (CII of Sale Year / CII of Purchase Year). This reduces your
                effective capital gain for tax purposes.
            </p>
        </>
    );

    return (
        <ToolLayout
            title="Capital Gains Calculator"
            description="Calculate Short Term and Long Term Capital Gains tax on shares, property, gold, and mutual funds with automatic indexation."
            keywords={['capital gains calculator', 'LTCG calculator', 'STCG calculator', 'indexation calculator', 'property capital gains', 'share LTCG tax']}
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
                        {ASSET_TYPES.map((asset) => (
                            <button
                                key={asset.id}
                                className={`asset-card ${selectedAsset.id === asset.id ? 'active' : ''}`}
                                onClick={() => setSelectedAsset(asset)}
                            >
                                <span className="asset-icon">{asset.icon}</span>
                                <span className="asset-name">{asset.name}</span>
                                <span className="asset-period">LTCG: ≥{asset.ltcgPeriodMonths} months</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Asset Info */}
                <div className="asset-info">
                    <p>{selectedAsset.notes}</p>
                    <div className="tax-badges">
                        <span className="badge">
                            STCG: {selectedAsset.stcgRate === 'slab' ? 'Slab Rate' : `${selectedAsset.stcgRate}%`}
                        </span>
                        <span className="badge">
                            LTCG: {selectedAsset.ltcgRate === 'slab' ? 'Slab Rate' : `${selectedAsset.ltcgRate}%`}
                        </span>
                        {selectedAsset.indexationAllowed && (
                            <span className="badge success">Indexation Available</span>
                        )}
                    </div>
                </div>

                {/* Input Form */}
                <div className="input-grid">
                    <div className="form-group">
                        <label className="form-label">Purchase Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Purchase Cost (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={purchaseCost}
                            onChange={(e) => setPurchaseCost(e.target.value)}
                            placeholder="e.g., 500000"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Sale Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={saleDate}
                            onChange={(e) => setSaleDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Sale Value (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={saleValue}
                            onChange={(e) => setSaleValue(e.target.value)}
                            placeholder="e.g., 750000"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Expenses (Brokerage, etc.) (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={expenses}
                            onChange={(e) => setExpenses(e.target.value)}
                            placeholder="e.g., 5000"
                        />
                    </div>

                    {/* FMV Input for Grandfather Clause */}
                    {selectedAsset.id === 'listed-shares' && purchaseDate && new Date(purchaseDate) < GRANDFATHER_DATE && (
                        <div className="form-group">
                            <label className="form-label">
                                FMV as on 31-Jan-2018 (₹)
                                <span className="info-tip" title="Fair Market Value on Jan 31, 2018 for grandfather clause">ⓘ</span>
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                value={fairMarketValue}
                                onChange={(e) => setFairMarketValue(e.target.value)}
                                placeholder="Highest price on NSE/BSE on Jan 31, 2018"
                            />
                        </div>
                    )}
                </div>

                {/* Results */}
                {result && (
                    <div className="result-box">
                        {/* Holding Period Visual */}
                        <div className="holding-period">
                            <div className="period-line">
                                <div className="period-start">
                                    <span className="period-date">{result.purchaseDate}</span>
                                    <span className="period-label">Purchase</span>
                                </div>
                                <div className={`period-bar ${result.isLTCG ? 'ltcg' : 'stcg'}`}>
                                    <span>{result.holdingYears} years ({result.holdingMonths} months)</span>
                                </div>
                                <div className="period-end">
                                    <span className="period-date">{result.saleDate}</span>
                                    <span className="period-label">Sale</span>
                                </div>
                            </div>
                            <div className={`gain-type-badge ${result.isLTCG ? 'ltcg' : 'stcg'}`}>
                                {result.isLTCG ? '📈 Long Term Capital Gain' : '📊 Short Term Capital Gain'}
                            </div>
                        </div>

                        {/* Calculation Breakdown */}
                        <div className="calculation-breakdown">
                            <div className="calc-row">
                                <span>Sale Value</span>
                                <span>₹{result.saleValue.toLocaleString('en-IN')}</span>
                            </div>
                            {result.expenses > 0 && (
                                <div className="calc-row deduction">
                                    <span>Less: Expenses</span>
                                    <span>- ₹{result.expenses.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="calc-row">
                                <span>Net Sale Value</span>
                                <span>₹{(result.saleValue - result.expenses).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="calc-row deduction">
                                <span>
                                    Less: {result.indexedCost ? 'Indexed Cost' : 'Cost of Acquisition'}
                                    {result.grandfatherApplied && ' (Grandfather Clause Applied)'}
                                </span>
                                <span>
                                    - ₹{(result.indexedCost || result.costOfAcquisition).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </span>
                            </div>

                            {result.indexationDetails && (
                                <div className="indexation-info">
                                    <small>
                                        Indexation: ₹{result.purchaseCost.toLocaleString('en-IN')} ×
                                        ({result.indexationDetails.saleCII} ÷ {result.indexationDetails.purchaseCII}) =
                                        ₹{result.indexedCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </small>
                                </div>
                            )}

                            <div className={`calc-row total ${result.capitalGain >= 0 ? 'gain' : 'loss'}`}>
                                <span>Capital {result.capitalGain >= 0 ? 'Gain' : 'Loss'}</span>
                                <span>₹{Math.abs(result.capitalGain).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            </div>

                            {result.exemption && result.isLTCG && result.capitalGain > 0 && (
                                <div className="calc-row exemption">
                                    <span>Less: Exemption (Section 112A)</span>
                                    <span>- ₹{Math.min(result.exemption, result.capitalGain).toLocaleString('en-IN')}</span>
                                </div>
                            )}

                            <div className="calc-row tax-row">
                                <span>
                                    Tax @ {typeof result.taxRate === 'number' ? `${result.taxRate}%` : result.taxRate}
                                </span>
                                <span>
                                    {result.taxAmount !== null
                                        ? `₹${result.taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                                        : 'Apply your slab rate'
                                    }
                                </span>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="summary-grid">
                            <div className={`summary-card ${result.capitalGain >= 0 ? 'gain' : 'loss'}`}>
                                <span className="summary-label">Capital {result.capitalGain >= 0 ? 'Gain' : 'Loss'}</span>
                                <span className="summary-value">
                                    {result.capitalGain >= 0 ? '+' : '-'}₹{Math.abs(result.capitalGain).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div className="summary-card tax">
                                <span className="summary-label">Tax Liability</span>
                                <span className="summary-value">
                                    {result.taxAmount !== null
                                        ? `₹${result.taxAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                                        : 'Slab Rate'
                                    }
                                </span>
                            </div>
                        </div>

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="Capital Gains Calculation"
                            shareText={`My ${result.isLTCG ? 'Long Term' : 'Short Term'} Capital Gain on ${result.assetType}: ₹${result.capitalGain.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                            toolName="capital-gains-calculator"
                        />
                    </div>
                )}

                {/* CII Reference Table */}
                <div className="cii-reference">
                    <h4>📊 Cost Inflation Index Reference</h4>
                    <div className="cii-grid">
                        {Object.entries(CII_TABLE).slice(-10).map(([fy, cii]) => (
                            <div key={fy} className="cii-item">
                                <span className="cii-fy">{fy}</span>
                                <span className="cii-value">{cii}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .tool-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .asset-selection {
          margin-bottom: var(--spacing-xl);
        }

        .asset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }

        .asset-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
          text-align: center;
        }

        .asset-card:hover {
          border-color: var(--yinmn-blue);
        }

        .asset-card.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
        }

        .asset-icon {
          font-size: 2rem;
          margin-bottom: var(--spacing-xs);
        }

        .asset-name {
          font-weight: 600;
          font-size: var(--text-sm);
          color: var(--text-dark);
        }

        .asset-period {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
        }

        .asset-info {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
          border-left: 4px solid var(--yinmn-blue);
        }

        .asset-info p {
          margin: 0 0 var(--spacing-sm) 0;
          font-size: var(--text-sm);
        }

        .tax-badges {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .badge {
          background: rgba(72, 86, 150, 0.1);
          color: var(--yinmn-blue);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--text-xs);
          font-weight: 500;
        }

        .badge.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }

        .input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .info-tip {
          margin-left: var(--spacing-xs);
          cursor: help;
          opacity: 0.7;
        }

        .holding-period {
          margin-bottom: var(--spacing-lg);
        }

        .period-line {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-md);
        }

        .period-start, .period-end {
          text-align: center;
        }

        .period-date {
          display: block;
          font-weight: 600;
          font-size: var(--text-sm);
        }

        .period-label {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .period-bar {
          flex: 1;
          height: 30px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .period-bar.ltcg {
          background: var(--success);
        }

        .period-bar.stcg {
          background: var(--warning);
        }

        .gain-type-badge {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius);
          font-weight: 600;
        }

        .gain-type-badge.ltcg {
          background: rgba(16, 185, 129, 0.1);
          color: var(--success);
        }

        .gain-type-badge.stcg {
          background: rgba(251, 191, 36, 0.1);
          color: var(--warning);
        }

        .calculation-breakdown {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
        }

        .calc-row {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          border-bottom: 1px dashed var(--platinum);
        }

        .calc-row:last-child {
          border-bottom: none;
        }

        .calc-row.deduction {
          color: var(--text-muted);
        }

        .calc-row.total {
          font-weight: 700;
          font-size: var(--text-lg);
          padding-top: var(--spacing-md);
          border-bottom: none;
        }

        .calc-row.total.gain {
          color: var(--success);
        }

        .calc-row.total.loss {
          color: var(--error);
        }

        .calc-row.exemption {
          color: var(--success);
        }

        .calc-row.tax-row {
          background: var(--gradient-primary);
          color: white;
          margin: var(--spacing-md) calc(-1 * var(--spacing-lg));
          margin-bottom: calc(-1 * var(--spacing-lg));
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: 0 0 var(--radius) var(--radius);
          font-weight: 600;
        }

        .indexation-info {
          padding: var(--spacing-sm);
          background: rgba(72, 86, 150, 0.05);
          border-radius: var(--radius-sm);
          margin: var(--spacing-sm) 0;
        }

        .indexation-info small {
          color: var(--text-muted);
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

        .summary-card.gain {
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid var(--success);
        }

        .summary-card.loss {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid var(--error);
        }

        .summary-card.tax {
          background: rgba(72, 86, 150, 0.1);
          border: 2px solid var(--yinmn-blue);
        }

        .summary-label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .summary-value {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--text-dark);
        }

        .cii-reference {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-top: var(--spacing-xl);
        }

        .cii-reference h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .cii-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--spacing-sm);
        }

        .cii-item {
          text-align: center;
          padding: var(--spacing-sm);
          background: var(--bg-primary);
          border-radius: var(--radius-sm);
        }

        .cii-fy {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .cii-value {
          font-weight: 600;
          color: var(--text-dark);
        }

        @media (max-width: 768px) {
          .asset-grid {
            grid-template-columns: 1fr 1fr;
          }

          .input-grid {
            grid-template-columns: 1fr;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .cii-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .period-line {
            flex-direction: column;
          }

          .period-bar {
            width: 100%;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default CapitalGainsCalculator;
