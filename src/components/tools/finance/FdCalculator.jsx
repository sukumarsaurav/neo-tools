import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, DonutChart, ResultActions } from './shared';

const FdCalculator = () => {
    const [principal, setPrincipal] = useState(100000);
    const [rate, setRate] = useState(7.5);
    const [tenure, setTenure] = useState(5);
    const [tenureType, setTenureType] = useState('years');
    const [compoundFreq, setCompoundFreq] = useState('quarterly');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'fd-calculator')
        .slice(0, 3);

    // Common FD rates for reference
    const bankRates = [
        { name: 'SBI', rate: '3.0% - 7.25%' },
        { name: 'HDFC Bank', rate: '3.0% - 7.20%' },
        { name: 'ICICI Bank', rate: '3.0% - 7.25%' },
        { name: 'Axis Bank', rate: '3.0% - 7.20%' },
        { name: 'Small Finance Banks', rate: 'Up to 8.50%' }
    ];

    // Real-time calculation
    useEffect(() => {
        if (principal > 0 && rate > 0 && tenure > 0) {
            calculate();
        }
    }, [principal, rate, tenure, tenureType, compoundFreq]);

    const calculate = () => {
        const P = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        let t = parseFloat(tenure);

        if (tenureType === 'months') {
            t = t / 12;
        }

        if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || r <= 0 || t <= 0) {
            return;
        }

        // Compounding frequency (n)
        let n;
        switch (compoundFreq) {
            case 'monthly': n = 12; break;
            case 'quarterly': n = 4; break;
            case 'half-yearly': n = 2; break;
            case 'yearly': n = 1; break;
            default: n = 4;
        }

        // Compound Interest Formula: A = P(1 + r/n)^(nt)
        const maturityAmount = P * Math.pow(1 + r / n, n * t);
        const interestEarned = maturityAmount - P;

        // Calculate effective annual rate
        const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

        setResult({
            principal: P.toFixed(0),
            maturityAmount: maturityAmount.toFixed(0),
            interestEarned: interestEarned.toFixed(0),
            rate: rate,
            effectiveRate: effectiveRate.toFixed(2),
            tenureYears: t.toFixed(2),
            compounding: compoundFreq
        });
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';
        return `FD Calculator Results
========================
Principal Amount: ₹${parseInt(result.principal).toLocaleString('en-IN')}
Interest Rate: ${result.rate}% p.a.
Tenure: ${tenureType === 'years' ? tenure + ' years' : tenure + ' months'}
Compounding: ${compoundFreq.charAt(0).toUpperCase() + compoundFreq.slice(1)}

Interest Earned: ₹${parseInt(result.interestEarned).toLocaleString('en-IN')}
Maturity Amount: ₹${parseInt(result.maturityAmount).toLocaleString('en-IN')}
Effective Rate: ${result.effectiveRate}% p.a.`;
    };

    // Donut chart data
    const chartSegments = result ? [
        {
            value: parseFloat(result.principal),
            label: 'Principal',
            color: 'var(--yinmn-blue)'
        },
        {
            value: parseFloat(result.interestEarned),
            label: 'Interest',
            color: 'var(--success)'
        }
    ] : [];

    const faqs = [
        {
            question: 'What is a Fixed Deposit (FD)?',
            answer: 'A Fixed Deposit is a financial instrument where you deposit a lump sum amount with a bank or NBFC for a fixed tenure at a predetermined interest rate. FDs are considered safe investments with guaranteed returns.'
        },
        {
            question: 'How is FD interest calculated?',
            answer: 'FD interest is calculated using compound interest formula: A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency (4 for quarterly), and t is time in years.'
        },
        {
            question: 'What is the minimum and maximum FD tenure?',
            answer: 'FD tenure typically ranges from 7 days to 10 years. Different banks may have different minimum and maximum tenure options. Interest rates usually vary based on the tenure selected.'
        },
        {
            question: 'Is FD interest taxable?',
            answer: 'Yes, FD interest is taxable as per your income tax slab. Banks deduct TDS (Tax Deducted at Source) at 10% if annual interest exceeds ₹40,000 (₹50,000 for senior citizens). You can submit Form 15G/15H to avoid TDS if your income is below taxable limit.'
        },
        {
            question: 'What happens if I break FD before maturity?',
            answer: 'Premature FD withdrawal is allowed but attracts a penalty, typically 0.5% to 1% reduction in the applicable interest rate. Some banks may have lock-in periods for certain FD schemes.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is an FD Calculator?</h2>
            <p>
                An FD (Fixed Deposit) Calculator is a financial tool that helps you estimate the maturity amount
                and interest earned on your fixed deposit investment. By entering the principal amount, interest
                rate, tenure, and compounding frequency, you can instantly calculate your returns.
            </p>

            <h2>Understanding Fixed Deposits</h2>
            <p>
                Fixed Deposits are one of the most popular and safest investment options in India. They offer
                guaranteed returns at fixed interest rates, making them ideal for risk-averse investors. Key
                features include:
            </p>
            <ul>
                <li><strong>Guaranteed Returns:</strong> Interest rate is fixed at the time of investment</li>
                <li><strong>DICGC Insurance:</strong> Deposits up to ₹5 lakh are insured per depositor per bank</li>
                <li><strong>Flexible Tenure:</strong> Choose from 7 days to 10 years</li>
                <li><strong>Loan Facility:</strong> Get loans against FD up to 90% of deposit value</li>
            </ul>

            <h2>Types of Fixed Deposits</h2>
            <ul>
                <li><strong>Regular FD:</strong> Standard fixed deposit with interest paid at maturity or periodically</li>
                <li><strong>Tax Saving FD:</strong> 5-year lock-in FD with tax deduction under Section 80C (up to ₹1.5 lakh)</li>
                <li><strong>Senior Citizen FD:</strong> Higher interest rates (0.25-0.75% extra) for those above 60 years</li>
                <li><strong>Cumulative FD:</strong> Interest compounded and paid at maturity</li>
                <li><strong>Non-Cumulative FD:</strong> Interest paid monthly, quarterly, half-yearly, or yearly</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="FD Calculator"
            description="Calculate Fixed Deposit maturity amount and interest earned. Compare FD returns with different tenures and interest rates."
            keywords={['FD calculator', 'fixed deposit calculator', 'FD interest calculator', 'FD maturity calculator', 'bank FD calculator']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Principal Amount Slider */}
                <SliderInput
                    id="fd-principal"
                    label="Principal Amount"
                    value={principal}
                    onChange={setPrincipal}
                    min={10000}
                    max={10000000}
                    step={10000}
                    prefix="₹"
                    tickMarks={[100000, 500000, 1000000, 5000000, 10000000]}
                    formatValue={(val) => {
                        if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
                        if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                        return val.toLocaleString('en-IN');
                    }}
                />

                {/* Interest Rate Slider */}
                <SliderInput
                    id="fd-rate"
                    label="Interest Rate (% p.a.)"
                    value={rate}
                    onChange={setRate}
                    min={3}
                    max={10}
                    step={0.1}
                    suffix="%"
                    tickMarks={[3, 5, 6, 7, 8, 9, 10]}
                    formatValue={(val) => val.toFixed(1)}
                />

                {/* Tenure with Type Toggle */}
                <div className="tenure-container">
                    <div className="tenure-type-toggle">
                        <button
                            className={`tenure-btn ${tenureType === 'years' ? 'active' : ''}`}
                            onClick={() => {
                                if (tenureType === 'months') {
                                    setTenure(Math.max(1, Math.round(tenure / 12)));
                                }
                                setTenureType('years');
                            }}
                        >
                            Years
                        </button>
                        <button
                            className={`tenure-btn ${tenureType === 'months' ? 'active' : ''}`}
                            onClick={() => {
                                if (tenureType === 'years') {
                                    setTenure(tenure * 12);
                                }
                                setTenureType('months');
                            }}
                        >
                            Months
                        </button>
                    </div>
                    <SliderInput
                        id="fd-tenure"
                        label={`Tenure (${tenureType})`}
                        value={tenure}
                        onChange={setTenure}
                        min={tenureType === 'years' ? 1 : 3}
                        max={tenureType === 'years' ? 10 : 120}
                        step={tenureType === 'years' ? 1 : 3}
                        suffix={tenureType === 'years' ? ' yrs' : ' mo'}
                        tickMarks={tenureType === 'years' ? [1, 2, 3, 5, 7, 10] : [12, 24, 36, 60, 84, 120]}
                        formatValue={(val) => val.toString()}
                    />
                </div>

                {/* Compounding Frequency */}
                <div className="form-group">
                    <label className="form-label">Interest Compounding</label>
                    <div className="compound-options">
                        {['monthly', 'quarterly', 'half-yearly', 'yearly'].map(freq => (
                            <button
                                key={freq}
                                className={`compound-btn ${compoundFreq === freq ? 'active' : ''}`}
                                onClick={() => setCompoundFreq(freq)}
                            >
                                {freq.charAt(0).toUpperCase() + freq.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {result && (
                    <>
                        {/* Donut Chart */}
                        <div className="chart-section">
                            <DonutChart
                                segments={chartSegments}
                                centerValue={`₹${parseInt(result.maturityAmount) >= 100000
                                    ? (parseInt(result.maturityAmount) / 100000).toFixed(2) + 'L'
                                    : parseInt(result.maturityAmount).toLocaleString('en-IN')}`}
                                centerLabel="Maturity Value"
                                size={220}
                                strokeWidth={35}
                            />
                        </div>

                        {/* Results Grid */}
                        <div className="result-box">
                            <div className="result-grid">
                                <div className="result-item">
                                    <span className="result-label">Principal Amount</span>
                                    <span className="result-value">₹{parseInt(result.principal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Interest Earned</span>
                                    <span className="result-value" style={{ color: 'var(--success)' }}>
                                        +₹{parseInt(result.interestEarned).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="result-item highlight">
                                    <span className="result-label">Maturity Amount</span>
                                    <span className="result-value">₹{parseInt(result.maturityAmount).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="result-summary">
                                <p>
                                    Your FD of <strong>₹{parseInt(result.principal).toLocaleString('en-IN')}</strong> at <strong>{result.rate}% p.a.</strong>
                                    ({result.compounding} compounding) for <strong>{result.tenureYears} years</strong> will grow to
                                    <strong> ₹{parseInt(result.maturityAmount).toLocaleString('en-IN')}</strong>.
                                </p>
                                <p className="effective-rate">
                                    Effective Annual Rate: <strong>{result.effectiveRate}%</strong>
                                </p>
                            </div>

                            <ResultActions
                                copyText={getCopyText()}
                                shareTitle="FD Calculator Result"
                                shareText={`My FD of ₹${parseInt(result.principal).toLocaleString('en-IN')} at ${result.rate}% for ${result.tenureYears} years will mature to ₹${parseInt(result.maturityAmount).toLocaleString('en-IN')}!`}
                                toolName="fd-calculator"
                            />
                        </div>

                        {/* Bank Rates Reference */}
                        <div className="bank-rates-section">
                            <h3>📊 Current FD Rates (Approximate)</h3>
                            <div className="bank-rates-grid">
                                {bankRates.map((bank, index) => (
                                    <div key={index} className="bank-rate-card">
                                        <span className="bank-name">{bank.name}</span>
                                        <span className="bank-rate">{bank.rate}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="rates-note">* Rates are indicative. Check with banks for current rates.</p>
                        </div>
                    </>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .tenure-container {
          position: relative;
        }

        .tenure-type-toggle {
          display: flex;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }

        .tenure-btn {
          padding: var(--spacing-xs) var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-size: var(--text-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
        }

        .tenure-btn.active {
          background: var(--yinmn-blue);
          border-color: var(--yinmn-blue);
          color: white;
        }

        .compound-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-sm);
        }

        .compound-btn {
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-size: var(--text-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
        }

        .compound-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
          color: var(--yinmn-blue);
        }

        .compound-btn:hover:not(.active) {
          border-color: var(--yinmn-blue);
        }

        .chart-section {
          display: flex;
          justify-content: center;
          margin: var(--spacing-xl) 0;
        }

        .result-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }

        .result-item {
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          text-align: center;
        }

        .result-item.highlight {
          grid-column: span 2;
          background: var(--gradient-accent);
          color: var(--white);
        }

        .result-item.highlight .result-label,
        .result-item.highlight .result-value {
          color: var(--white);
        }

        .result-label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .result-value {
          font-size: var(--text-2xl);
          font-weight: 700;
          color: var(--text-dark);
        }

        .result-summary {
          margin-top: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          text-align: center;
        }

        .result-summary p {
          margin: 0;
          color: var(--text-light);
          line-height: 1.6;
        }

        .effective-rate {
          margin-top: var(--spacing-sm) !important;
          font-size: var(--text-sm);
          color: var(--text-muted) !important;
        }

        .bank-rates-section {
          margin-top: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }

        .bank-rates-section h3 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: var(--text-lg);
        }

        .bank-rates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-sm);
        }

        .bank-rate-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius);
        }

        .bank-name {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .bank-rate {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--success);
        }

        .rates-note {
          margin: var(--spacing-sm) 0 0 0;
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-align: center;
        }

        @media (max-width: 480px) {
          .compound-options {
            grid-template-columns: repeat(2, 1fr);
          }

          .result-grid {
            grid-template-columns: 1fr;
          }

          .result-item.highlight {
            grid-column: span 1;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default FdCalculator;
