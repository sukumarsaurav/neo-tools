import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, ResultActions } from './shared';

const TaxEstimator = () => {
    const [income, setIncome] = useState(1200000);
    const [age, setAge] = useState('below60');
    const [deductions80C, setDeductions80C] = useState(150000);
    const [deductions80D, setDeductions80D] = useState(25000);
    const [hra, setHra] = useState(0);
    const [nps80CCD, setNps80CCD] = useState(0);
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'finance' && t.id !== 'tax-estimator').slice(0, 3);

    // Real-time calculation
    useEffect(() => {
        if (income > 0) {
            calculate();
        }
    }, [income, age, deductions80C, deductions80D, hra, nps80CCD]);

    const calculateNewRegime = (taxableIncome, ageGroup) => {
        // New Tax Regime FY 2024-25 slabs
        let tax = 0;
        if (taxableIncome <= 300000) tax = 0;
        else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.05;
        else if (taxableIncome <= 1000000) tax = 20000 + (taxableIncome - 700000) * 0.10;
        else if (taxableIncome <= 1200000) tax = 50000 + (taxableIncome - 1000000) * 0.15;
        else if (taxableIncome <= 1500000) tax = 80000 + (taxableIncome - 1200000) * 0.20;
        else tax = 140000 + (taxableIncome - 1500000) * 0.30;

        // Rebate u/s 87A for income up to 7L
        if (taxableIncome <= 700000) tax = 0;
        return tax;
    };

    const calculateOldRegime = (taxableIncome, ageGroup) => {
        let tax = 0;
        const exemption = ageGroup === 'below60' ? 250000 : ageGroup === '60to80' ? 300000 : 500000;

        if (taxableIncome <= exemption) tax = 0;
        else if (taxableIncome <= 500000) tax = (taxableIncome - exemption) * 0.05;
        else if (taxableIncome <= 1000000) tax = (500000 - exemption) * 0.05 + (taxableIncome - 500000) * 0.20;
        else tax = (500000 - exemption) * 0.05 + 100000 + (taxableIncome - 1000000) * 0.30;

        // Rebate u/s 87A for income up to 5L
        if (taxableIncome <= 500000) tax = 0;
        return tax;
    };

    const calculate = () => {
        const grossIncome = parseFloat(income) || 0;
        const ded80C = Math.min(parseFloat(deductions80C) || 0, 150000);
        const ded80D = Math.min(parseFloat(deductions80D) || 0, 100000);
        const hraExemption = parseFloat(hra) || 0;
        const ded80CCD = Math.min(parseFloat(nps80CCD) || 0, 50000);
        const standardDeduction = 50000;

        // New regime (minimal deductions)
        const newTaxableIncome = Math.max(0, grossIncome - standardDeduction);
        const newTax = calculateNewRegime(newTaxableIncome, age);
        const newCess = newTax * 0.04;

        // Old regime (with deductions)
        const totalOldDeductions = standardDeduction + ded80C + ded80D + hraExemption + ded80CCD;
        const oldTaxableIncome = Math.max(0, grossIncome - totalOldDeductions);
        const oldTax = calculateOldRegime(oldTaxableIncome, age);
        const oldCess = oldTax * 0.04;

        const newTotal = newTax + newCess;
        const oldTotal = oldTax + oldCess;

        setResult({
            grossIncome: grossIncome.toFixed(0),
            totalDeductions: totalOldDeductions.toFixed(0),
            new: {
                taxable: newTaxableIncome.toFixed(0),
                tax: newTax.toFixed(0),
                cess: newCess.toFixed(0),
                total: newTotal.toFixed(0),
                effectiveRate: grossIncome > 0 ? ((newTotal / grossIncome) * 100).toFixed(2) : '0'
            },
            old: {
                taxable: oldTaxableIncome.toFixed(0),
                tax: oldTax.toFixed(0),
                cess: oldCess.toFixed(0),
                total: oldTotal.toFixed(0),
                effectiveRate: grossIncome > 0 ? ((oldTotal / grossIncome) * 100).toFixed(2) : '0'
            },
            recommended: newTotal <= oldTotal ? 'new' : 'old',
            savings: Math.abs(oldTotal - newTotal).toFixed(0)
        });
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';
        return `Income Tax Calculator Results (FY 2024-25)
===========================================
Gross Income: ₹${parseInt(result.grossIncome).toLocaleString('en-IN')}

NEW TAX REGIME:
- Taxable Income: ₹${parseInt(result.new.taxable).toLocaleString('en-IN')}
- Tax: ₹${parseInt(result.new.tax).toLocaleString('en-IN')}
- Cess (4%): ₹${parseInt(result.new.cess).toLocaleString('en-IN')}
- Total Tax: ₹${parseInt(result.new.total).toLocaleString('en-IN')}
- Effective Rate: ${result.new.effectiveRate}%

OLD TAX REGIME:
- Total Deductions: ₹${parseInt(result.totalDeductions).toLocaleString('en-IN')}
- Taxable Income: ₹${parseInt(result.old.taxable).toLocaleString('en-IN')}
- Tax: ₹${parseInt(result.old.tax).toLocaleString('en-IN')}
- Cess (4%): ₹${parseInt(result.old.cess).toLocaleString('en-IN')}
- Total Tax: ₹${parseInt(result.old.total).toLocaleString('en-IN')}
- Effective Rate: ${result.old.effectiveRate}%

RECOMMENDATION: ${result.recommended === 'new' ? 'New' : 'Old'} Tax Regime
Potential Savings: ₹${parseInt(result.savings).toLocaleString('en-IN')}`;
    };

    const faqs = [
        { question: 'What is the difference between old and new tax regime?', answer: 'The new regime has lower tax rates but fewer deductions. The old regime has higher rates but allows many deductions like 80C, 80D, HRA, etc. Choose based on your deductions.' },
        { question: 'What is Section 80C deduction?', answer: 'Section 80C allows up to ₹1.5 lakh deduction for investments like PPF, ELSS, life insurance, EPF, tuition fees, etc. Available only in old regime.' },
        { question: 'What is the standard deduction?', answer: 'Standard deduction of ₹50,000 is available to all salaried employees in both tax regimes, without any documentation needed.' },
        { question: 'Is there tax rebate for low income?', answer: 'Yes, under Section 87A: In new regime, no tax up to ₹7 lakh income. In old regime, no tax up to ₹5 lakh income (after deductions).' }
    ];

    const seoContent = (
        <>
            <h2>Income Tax Calculator India</h2>
            <p>Calculate your income tax liability for FY 2024-25 under both old and new tax regimes. Compare which regime is better for your financial situation.</p>
            <h3>New Tax Regime Slabs (FY 2024-25)</h3>
            <ul>
                <li>₹0 - ₹3,00,000: Nil</li>
                <li>₹3,00,001 - ₹7,00,000: 5%</li>
                <li>₹7,00,001 - ₹10,00,000: 10%</li>
                <li>₹10,00,001 - ₹12,00,000: 15%</li>
                <li>₹12,00,001 - ₹15,00,000: 20%</li>
                <li>Above ₹15,00,000: 30%</li>
            </ul>
            <h3>Key Deductions (Old Regime)</h3>
            <ul>
                <li><strong>80C:</strong> Up to ₹1.5 lakh (PPF, ELSS, Insurance)</li>
                <li><strong>80D:</strong> Up to ₹1 lakh (Health Insurance)</li>
                <li><strong>HRA:</strong> Based on rent paid and salary</li>
                <li><strong>NPS 80CCD(1B):</strong> Additional ₹50,000</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Income Tax Calculator"
            description="Calculate income tax under old and new regime. Compare tax liability and find which regime saves more tax for FY 2024-25."
            keywords={['income tax calculator', 'tax calculator India', 'new tax regime', 'old tax regime', '80C deduction']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Annual Income Slider */}
                <SliderInput
                    id="annual-income"
                    label="Annual Gross Income"
                    value={income}
                    onChange={setIncome}
                    min={300000}
                    max={50000000}
                    step={50000}
                    prefix="₹"
                    tickMarks={[500000, 1000000, 2000000, 5000000, 10000000]}
                    formatValue={(val) => {
                        if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
                        if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                        return val.toLocaleString('en-IN');
                    }}
                />

                {/* Age Group */}
                <div className="form-group">
                    <label className="form-label">Age Group</label>
                    <div className="age-options">
                        <button
                            className={`age-btn ${age === 'below60' ? 'active' : ''}`}
                            onClick={() => setAge('below60')}
                        >
                            <span>Below 60</span>
                            <small>General</small>
                        </button>
                        <button
                            className={`age-btn ${age === '60to80' ? 'active' : ''}`}
                            onClick={() => setAge('60to80')}
                        >
                            <span>60-80 years</span>
                            <small>Senior Citizen</small>
                        </button>
                        <button
                            className={`age-btn ${age === 'above80' ? 'active' : ''}`}
                            onClick={() => setAge('above80')}
                        >
                            <span>Above 80</span>
                            <small>Super Senior</small>
                        </button>
                    </div>
                </div>

                {/* Deductions Section */}
                <div className="deductions-section">
                    <h3>📋 Deductions (for Old Regime comparison)</h3>

                    <SliderInput
                        id="deduction-80c"
                        label="Section 80C (Max ₹1.5L)"
                        value={deductions80C}
                        onChange={setDeductions80C}
                        min={0}
                        max={150000}
                        step={5000}
                        prefix="₹"
                        tickMarks={[50000, 100000, 150000]}
                        formatValue={(val) => val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${(val / 1000).toFixed(0)}K`}
                    />

                    <SliderInput
                        id="deduction-80d"
                        label="Section 80D - Health Insurance (Max ₹1L)"
                        value={deductions80D}
                        onChange={setDeductions80D}
                        min={0}
                        max={100000}
                        step={5000}
                        prefix="₹"
                        tickMarks={[25000, 50000, 75000, 100000]}
                        formatValue={(val) => val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${(val / 1000).toFixed(0)}K`}
                    />

                    <SliderInput
                        id="deduction-hra"
                        label="HRA Exemption"
                        value={hra}
                        onChange={setHra}
                        min={0}
                        max={500000}
                        step={10000}
                        prefix="₹"
                        tickMarks={[100000, 200000, 300000, 500000]}
                        formatValue={(val) => val >= 100000 ? `${(val / 100000).toFixed(1)}L` : `${(val / 1000).toFixed(0)}K`}
                    />

                    <SliderInput
                        id="deduction-nps"
                        label="NPS 80CCD(1B) (Max ₹50K)"
                        value={nps80CCD}
                        onChange={setNps80CCD}
                        min={0}
                        max={50000}
                        step={5000}
                        prefix="₹"
                        tickMarks={[10000, 25000, 50000]}
                        formatValue={(val) => `${(val / 1000).toFixed(0)}K`}
                    />
                </div>

                {result && (
                    <div className="result-box">
                        <div className="regime-comparison">
                            <div className={`regime-card ${result.recommended === 'new' ? 'recommended' : ''}`}>
                                <div className="regime-header">
                                    <h4>New Tax Regime</h4>
                                    {result.recommended === 'new' && <span className="badge">✓ Better</span>}
                                </div>
                                <div className="regime-details">
                                    <div className="detail-row">
                                        <span>Taxable Income:</span>
                                        <span>₹{parseInt(result.new.taxable).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Income Tax:</span>
                                        <span>₹{parseInt(result.new.tax).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Cess (4%):</span>
                                        <span>₹{parseInt(result.new.cess).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <div className="regime-total">
                                    <span>Total Tax:</span>
                                    <span className="total-value">₹{parseInt(result.new.total).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="effective-rate">
                                    Effective Rate: {result.new.effectiveRate}%
                                </div>
                            </div>

                            <div className="vs-divider">VS</div>

                            <div className={`regime-card ${result.recommended === 'old' ? 'recommended' : ''}`}>
                                <div className="regime-header">
                                    <h4>Old Tax Regime</h4>
                                    {result.recommended === 'old' && <span className="badge">✓ Better</span>}
                                </div>
                                <div className="regime-details">
                                    <div className="detail-row deductions">
                                        <span>Total Deductions:</span>
                                        <span className="deduction-value">-₹{parseInt(result.totalDeductions).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Taxable Income:</span>
                                        <span>₹{parseInt(result.old.taxable).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Income Tax:</span>
                                        <span>₹{parseInt(result.old.tax).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>Cess (4%):</span>
                                        <span>₹{parseInt(result.old.cess).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <div className="regime-total">
                                    <span>Total Tax:</span>
                                    <span className="total-value">₹{parseInt(result.old.total).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="effective-rate">
                                    Effective Rate: {result.old.effectiveRate}%
                                </div>
                            </div>
                        </div>

                        <div className="savings-note">
                            <span className="savings-icon">💡</span>
                            <span>
                                You can save <strong>₹{parseInt(result.savings).toLocaleString('en-IN')}</strong> by choosing the <strong>{result.recommended === 'new' ? 'New' : 'Old'} Tax Regime</strong>!
                            </span>
                        </div>

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="Income Tax Calculator Result"
                            shareText={`My tax analysis for ₹${parseInt(result.grossIncome).toLocaleString('en-IN')} income: New Regime ₹${parseInt(result.new.total).toLocaleString('en-IN')} vs Old Regime ₹${parseInt(result.old.total).toLocaleString('en-IN')}. ${result.recommended === 'new' ? 'New' : 'Old'} regime is better!`}
                            toolName="tax-estimator"
                        />
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .age-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-sm);
        }

        .age-btn {
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
        }

        .age-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .age-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
        }

        .age-btn span {
          font-weight: 600;
          color: var(--text-dark);
        }

        .age-btn small {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .deductions-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          margin: var(--spacing-lg) 0;
        }

        .deductions-section h3 {
          margin: 0 0 var(--spacing-lg) 0;
          font-size: var(--text-lg);
        }

        .regime-comparison {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--spacing-md);
          align-items: start;
        }

        .regime-card {
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border: 2px solid transparent;
        }

        .regime-card.recommended {
          background: rgba(72, 86, 150, 0.05);
          border-color: var(--yinmn-blue);
        }

        .regime-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .regime-header h4 {
          margin: 0;
          font-size: var(--text-lg);
        }

        .badge {
          background: var(--success);
          color: white;
          padding: 4px 10px;
          border-radius: var(--radius);
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .regime-details {
          margin-bottom: var(--spacing-md);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-xs) 0;
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .detail-row.deductions {
          color: var(--success);
        }

        .deduction-value {
          color: var(--success);
          font-weight: 500;
        }

        .regime-total {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius);
          font-weight: 600;
        }

        .total-value {
          font-size: var(--text-xl);
          color: var(--yinmn-blue);
        }

        .effective-rate {
          text-align: center;
          margin-top: var(--spacing-sm);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .vs-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--text-muted);
          font-size: var(--text-lg);
        }

        .savings-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-lg);
          padding: var(--spacing-md);
          background: rgba(34, 197, 94, 0.1);
          border-radius: var(--radius);
          color: var(--success);
          font-weight: 500;
        }

        .savings-icon {
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .regime-comparison {
            grid-template-columns: 1fr;
          }

          .vs-divider {
            padding: var(--spacing-md);
          }

          .age-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default TaxEstimator;
