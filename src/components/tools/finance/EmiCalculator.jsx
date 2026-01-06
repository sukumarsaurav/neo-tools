import { useState, useEffect, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, DonutChart, ResultActions } from './shared';

const EmiCalculator = () => {
    const [principal, setPrincipal] = useState(1000000);
    const [rate, setRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [tenureType, setTenureType] = useState('years');
    const [result, setResult] = useState(null);
    const [showFullSchedule, setShowFullSchedule] = useState(false);
    const [scheduleYear, setScheduleYear] = useState(1);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'emi-calculator')
        .slice(0, 3);

    // Real-time calculation effect
    useEffect(() => {
        if (principal > 0 && rate > 0 && tenure > 0) {
            calculate();
        }
    }, [principal, rate, tenure, tenureType]);

    const calculate = () => {
        const P = parseFloat(principal);
        const R = parseFloat(rate) / 12 / 100;
        let N = parseFloat(tenure);

        if (tenureType === 'years') {
            N = N * 12;
        }

        if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R <= 0 || N <= 0) {
            return;
        }

        // EMI Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
        const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
        const totalPayment = emi * N;
        const totalInterest = totalPayment - P;

        // Generate full amortization schedule
        const schedule = [];
        let balance = P;
        for (let i = 1; i <= N; i++) {
            const interestPayment = balance * R;
            const principalPayment = emi - interestPayment;
            balance -= principalPayment;
            schedule.push({
                month: i,
                emi: emi.toFixed(2),
                principal: principalPayment.toFixed(2),
                interest: interestPayment.toFixed(2),
                balance: Math.max(0, balance).toFixed(2),
                year: Math.ceil(i / 12)
            });
        }

        setResult({
            emi: emi.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            principal: P.toFixed(2),
            months: N,
            years: Math.ceil(N / 12),
            schedule
        });
    };

    // Get visible schedule items based on year filter
    const visibleSchedule = useMemo(() => {
        if (!result) return [];
        if (showFullSchedule) {
            return result.schedule.filter(item => item.year === scheduleYear);
        }
        return result.schedule.slice(0, 12);
    }, [result, showFullSchedule, scheduleYear]);

    // Generate copy text for results
    const getCopyText = () => {
        if (!result) return '';
        return `EMI Calculation Results
========================
Loan Amount: ₹${parseInt(result.principal).toLocaleString('en-IN')}
Interest Rate: ${rate}% p.a.
Tenure: ${tenureType === 'years' ? tenure + ' years' : tenure + ' months'}

Monthly EMI: ₹${parseInt(result.emi).toLocaleString('en-IN')}
Total Interest: ₹${parseInt(result.totalInterest).toLocaleString('en-IN')}
Total Payment: ₹${parseInt(result.totalPayment).toLocaleString('en-IN')}`;
    };

    // Donut chart data
    const chartSegments = result ? [
        {
            value: parseFloat(result.principal),
            label: 'Principal',
            color: 'var(--yinmn-blue)'
        },
        {
            value: parseFloat(result.totalInterest),
            label: 'Interest',
            color: 'var(--pumpkin)'
        }
    ] : [];

    const faqs = [
        {
            question: 'What is EMI?',
            answer: 'EMI (Equated Monthly Installment) is a fixed amount paid by a borrower to a lender at a specified date each month. It includes both principal and interest components, making it easier to budget for loan repayments.'
        },
        {
            question: 'How is EMI calculated?',
            answer: 'EMI is calculated using the formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1), where P is the principal loan amount, r is the monthly interest rate, and n is the number of monthly installments.'
        },
        {
            question: 'What factors affect EMI?',
            answer: 'Three main factors affect EMI: 1) Loan amount - higher amount means higher EMI, 2) Interest rate - higher rate means higher EMI, 3) Loan tenure - longer tenure means lower EMI but higher total interest.'
        },
        {
            question: 'Is it better to have a longer or shorter loan tenure?',
            answer: 'Shorter tenure means higher EMI but less total interest paid. Longer tenure means lower EMI but more total interest. Choose based on your monthly budget and total cost preference.'
        },
        {
            question: 'Can EMI change during the loan period?',
            answer: 'For fixed-rate loans, EMI remains constant. For floating-rate loans, EMI can change when interest rates change. Some banks adjust tenure instead of EMI when rates change.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is an EMI Calculator?</h2>
            <p>
                An EMI (Equated Monthly Installment) Calculator is a powerful financial tool that helps you
                determine your monthly loan repayment amount before taking a loan. Whether you're planning to
                buy a home, car, or need a personal loan, understanding your EMI helps you budget effectively
                and choose the right loan terms.
            </p>

            <h2>Understanding EMI Components</h2>
            <p>
                Every EMI payment consists of two components that change over the loan tenure:
            </p>
            <ul>
                <li><strong>Principal Component:</strong> The portion that reduces your outstanding loan amount. This increases over time.</li>
                <li><strong>Interest Component:</strong> The cost of borrowing charged by the lender. This decreases over time.</li>
            </ul>

            <h2>Types of Loans and Typical Interest Rates</h2>
            <ul>
                <li><strong>Home Loan:</strong> 6.5% - 9% p.a. (20-30 year tenure)</li>
                <li><strong>Car Loan:</strong> 7% - 12% p.a. (3-7 year tenure)</li>
                <li><strong>Personal Loan:</strong> 10% - 24% p.a. (1-5 year tenure)</li>
                <li><strong>Education Loan:</strong> 8% - 15% p.a. (5-15 year tenure)</li>
                <li><strong>Gold Loan:</strong> 7% - 17% p.a. (1-3 year tenure)</li>
            </ul>

            <h2>EMI Calculation Formula</h2>
            <p>
                The mathematical formula for EMI calculation is:
            </p>
            <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '1rem', borderRadius: '0.5rem' }}>
                EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
            </p>
            <p>Where:</p>
            <ul>
                <li>P = Principal loan amount</li>
                <li>r = Monthly interest rate (Annual rate / 12 / 100)</li>
                <li>n = Number of monthly installments</li>
            </ul>

            <h2>Tips for Managing Your Loan EMI</h2>
            <ol>
                <li><strong>Keep EMI below 40% of income:</strong> Financial experts recommend that your total EMI should not exceed 40% of your monthly income to maintain financial stability.</li>
                <li><strong>Make prepayments:</strong> Whenever you have surplus funds, make partial prepayments to reduce principal and save on interest.</li>
                <li><strong>Balance transfer:</strong> If you find a lower interest rate, consider transferring your loan to save on interest costs.</li>
                <li><strong>Choose the right tenure:</strong> Select a tenure that balances comfortable EMI with total interest outgo.</li>
            </ol>

            <h2>Why Use Our EMI Calculator?</h2>
            <ul>
                <li><strong>Instant Results:</strong> Get EMI, total interest, and payment breakdown instantly</li>
                <li><strong>Amortization Schedule:</strong> View month-by-month payment breakdown</li>
                <li><strong>Compare Options:</strong> Try different combinations to find the best terms</li>
                <li><strong>Free & Private:</strong> No registration required, calculations done locally</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Loan / EMI Calculator"
            description="Calculate your monthly EMI for home loans, car loans, and personal loans. View amortization schedule and total interest payable."
            keywords={['EMI calculator', 'loan calculator', 'home loan EMI', 'car loan calculator', 'personal loan EMI', 'monthly installment calculator']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Loan Amount Slider */}
                <SliderInput
                    id="loan-amount"
                    label="Loan Amount"
                    value={principal}
                    onChange={setPrincipal}
                    min={50000}
                    max={50000000}
                    step={50000}
                    prefix="₹"
                    tickMarks={[1000000, 10000000, 25000000, 50000000]}
                    formatValue={(val) => {
                        if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
                        if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                        return val.toLocaleString('en-IN');
                    }}
                />

                {/* Interest Rate Slider */}
                <SliderInput
                    id="interest-rate"
                    label="Interest Rate (% per annum)"
                    value={rate}
                    onChange={setRate}
                    min={5}
                    max={20}
                    step={0.1}
                    suffix="%"
                    tickMarks={[5, 8, 10, 12, 15, 20]}
                    formatValue={(val) => val.toFixed(1)}
                />

                {/* Tenure Slider with Type Toggle */}
                <div className="tenure-container">
                    <div className="tenure-type-toggle">
                        <button
                            className={`tenure-btn ${tenureType === 'years' ? 'active' : ''}`}
                            onClick={() => {
                                if (tenureType === 'months') {
                                    setTenure(Math.round(tenure / 12));
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
                        id="loan-tenure"
                        label={`Loan Tenure (${tenureType})`}
                        value={tenure}
                        onChange={setTenure}
                        min={tenureType === 'years' ? 1 : 12}
                        max={tenureType === 'years' ? 30 : 360}
                        step={tenureType === 'years' ? 1 : 12}
                        suffix={tenureType === 'years' ? ' yrs' : ' mo'}
                        tickMarks={tenureType === 'years' ? [1, 5, 10, 15, 20, 25, 30] : [12, 60, 120, 180, 240, 360]}
                        formatValue={(val) => val.toString()}
                    />
                </div>

                {result && (
                    <>
                        {/* Donut Chart */}
                        <div className="chart-section">
                            <DonutChart
                                segments={chartSegments}
                                centerValue={`₹${parseInt(result.emi).toLocaleString('en-IN')}`}
                                centerLabel="Monthly EMI"
                                size={220}
                                strokeWidth={35}
                            />
                        </div>

                        {/* Results Grid */}
                        <div className="result-box">
                            <div className="result-grid">
                                <div className="result-item highlight">
                                    <span className="result-label">Monthly EMI</span>
                                    <span className="result-value">₹{parseInt(result.emi).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Principal Amount</span>
                                    <span className="result-value">₹{parseInt(result.principal).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Total Interest</span>
                                    <span className="result-value" style={{ color: 'var(--pumpkin)' }}>
                                        ₹{parseInt(result.totalInterest).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div className="result-item total">
                                    <span className="result-label">Total Payment</span>
                                    <span className="result-value">₹{parseInt(result.totalPayment).toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <ResultActions
                                copyText={getCopyText()}
                                shareTitle="EMI Calculator Result"
                                shareText={`My Monthly EMI for ₹${parseInt(result.principal).toLocaleString('en-IN')} loan at ${rate}% for ${tenureType === 'years' ? tenure + ' years' : tenure + ' months'} is ₹${parseInt(result.emi).toLocaleString('en-IN')}`}
                                toolName="emi-calculator"
                            />
                        </div>

                        {/* Amortization Schedule */}
                        <div className="amortization-section">
                            <div className="amortization-header">
                                <h3>Amortization Schedule</h3>
                                <div className="amortization-controls">
                                    {showFullSchedule && (
                                        <select
                                            className="year-select"
                                            value={scheduleYear}
                                            onChange={(e) => setScheduleYear(parseInt(e.target.value))}
                                        >
                                            {Array.from({ length: result.years }, (_, i) => i + 1).map(year => (
                                                <option key={year} value={year}>Year {year}</option>
                                            ))}
                                        </select>
                                    )}
                                    <button
                                        className="toggle-schedule-btn"
                                        onClick={() => setShowFullSchedule(!showFullSchedule)}
                                    >
                                        {showFullSchedule ? 'Show First 12 Months' : `View All ${result.months} Months`}
                                    </button>
                                </div>
                            </div>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>EMI</th>
                                            <th>Principal</th>
                                            <th>Interest</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleSchedule.map(row => (
                                            <tr key={row.month}>
                                                <td>{row.month}</td>
                                                <td>₹{parseInt(row.emi).toLocaleString('en-IN')}</td>
                                                <td>₹{parseInt(row.principal).toLocaleString('en-IN')}</td>
                                                <td>₹{parseInt(row.interest).toLocaleString('en-IN')}</td>
                                                <td>₹{parseInt(row.balance).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 700px;
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

        .tenure-btn:hover:not(.active) {
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
          background: rgba(72, 86, 150, 0.1);
          border: 2px solid var(--yinmn-blue);
          grid-column: span 2;
        }

        .result-item.total {
          grid-column: span 2;
          background: var(--gradient-accent);
          color: var(--white);
        }

        .result-item.total .result-label,
        .result-item.total .result-value {
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

        .amortization-section {
          margin-top: var(--spacing-xl);
        }

        .amortization-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .amortization-header h3 {
          margin: 0;
        }

        .amortization-controls {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }

        .year-select {
          padding: var(--spacing-xs) var(--spacing-sm);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-size: var(--text-sm);
          background: var(--bg-secondary);
          cursor: pointer;
        }

        .toggle-schedule-btn {
          padding: var(--spacing-xs) var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--yinmn-blue);
          border-radius: var(--radius);
          color: var(--yinmn-blue);
          font-size: var(--text-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
        }

        .toggle-schedule-btn:hover {
          background: var(--yinmn-blue);
          color: white;
        }

        @media (max-width: 480px) {
          .result-grid {
            grid-template-columns: 1fr;
          }

          .result-item.highlight,
          .result-item.total {
            grid-column: span 1;
          }

          .amortization-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .amortization-controls {
            width: 100%;
            flex-direction: column;
          }

          .toggle-schedule-btn,
          .year-select {
            width: 100%;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default EmiCalculator;
