import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, ResultActions } from './shared';

const InflationCalculator = () => {
    const [amount, setAmount] = useState(100000);
    const [rate, setRate] = useState(6);
    const [years, setYears] = useState(10);
    const [result, setResult] = useState(null);
    const [mode, setMode] = useState('future'); // future, past

    const relatedTools = toolsData.tools.filter(t => t.category === 'finance' && t.id !== 'inflation-calculator').slice(0, 3);

    // Historical inflation data for India
    const historicalRates = [
        { year: '2024', rate: '5.4%' },
        { year: '2023', rate: '5.7%' },
        { year: '2022', rate: '6.7%' },
        { year: '2021', rate: '5.1%' },
        { year: '2020', rate: '6.2%' }
    ];

    // Real-time calculation
    useEffect(() => {
        if (amount > 0 && years > 0) {
            calculate();
        }
    }, [amount, rate, years, mode]);

    const calculate = () => {
        const amt = parseFloat(amount);
        const r = parseFloat(rate) / 100;
        const y = parseFloat(years);

        if (isNaN(amt) || isNaN(r) || isNaN(y) || amt <= 0 || y <= 0) return;

        if (mode === 'future') {
            // Future value (cost of same goods)
            const futureValue = amt * Math.pow(1 + r, y);
            // Purchasing power (what today's money will buy in future)
            const purchasingPower = amt / Math.pow(1 + r, y);
            const lostValue = amt - purchasingPower;
            const percentageLost = ((lostValue / amt) * 100).toFixed(1);

            setResult({
                original: amt.toFixed(0),
                futureValue: futureValue.toFixed(0),
                purchasingPower: purchasingPower.toFixed(0),
                lostValue: lostValue.toFixed(0),
                percentageLost,
                years: y,
                rate: rate,
                mode: 'future'
            });
        } else {
            // Past value (what past money is worth today)
            const pastValue = amt / Math.pow(1 + r, y);
            const gainedValue = amt - pastValue;
            const percentageGained = ((gainedValue / pastValue) * 100).toFixed(1);

            setResult({
                original: amt.toFixed(0),
                pastValue: pastValue.toFixed(0),
                todayValue: amt.toFixed(0),
                gainedValue: gainedValue.toFixed(0),
                percentageGained,
                years: y,
                rate: rate,
                mode: 'past'
            });
        }
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';
        if (result.mode === 'future') {
            return `Inflation Calculator Results
============================
Current Amount: ₹${parseInt(result.original).toLocaleString('en-IN')}
Inflation Rate: ${result.rate}% p.a.
Time Period: ${result.years} years

Future Cost of Same Goods: ₹${parseInt(result.futureValue).toLocaleString('en-IN')}
Real Purchasing Power: ₹${parseInt(result.purchasingPower).toLocaleString('en-IN')}
Value Lost to Inflation: ₹${parseInt(result.lostValue).toLocaleString('en-IN')} (${result.percentageLost}%)`;
        } else {
            return `Inflation Calculator Results
============================
Today's Amount: ₹${parseInt(result.original).toLocaleString('en-IN')}
Inflation Rate: ${result.rate}% p.a.
Time Period: ${result.years} years ago

Equivalent Value ${result.years} Years Ago: ₹${parseInt(result.pastValue).toLocaleString('en-IN')}
Price Increase: ₹${parseInt(result.gainedValue).toLocaleString('en-IN')} (${result.percentageGained}%)`;
        }
    };

    const faqs = [
        { question: 'What is inflation?', answer: 'Inflation is the rate at which the general level of prices for goods and services rises, causing purchasing power to fall. A 6% inflation means prices increase by 6% each year on average.' },
        { question: 'How does inflation affect savings?', answer: 'If your savings earn less than the inflation rate, your money loses purchasing power. ₹100 today can buy less next year if inflation is high and returns are low.' },
        { question: 'What is the current inflation rate in India?', answer: 'India\'s retail inflation (CPI) typically ranges between 4-7%. RBI targets to maintain inflation around 4% with a tolerance band of +/- 2%.' },
        { question: 'How to beat inflation?', answer: 'Invest in assets that historically beat inflation: equity (stocks/mutual funds), real estate, or gold. FDs and savings accounts often fail to beat inflation after taxes.' }
    ];

    const seoContent = (
        <>
            <h2>Inflation Calculator</h2>
            <p>Understand how inflation erodes the value of your money over time. This calculator shows what your current money will be worth in the future and what future costs will equal in today's terms.</p>
            <h3>The Hidden Tax of Inflation</h3>
            <p>Inflation is often called the "hidden tax" because it reduces your purchasing power without taking money from your wallet. At 6% annual inflation, prices roughly double every 12 years.</p>
            <h3>Why Your Returns Must Beat Inflation</h3>
            <p>If your investments earn 7% but inflation is 6%, your real return is only 1%. This is why equity investments, despite being volatile, are often recommended for long-term wealth building.</p>
        </>
    );

    return (
        <ToolLayout
            title="Inflation Calculator"
            description="Calculate how inflation affects your money's purchasing power. See the real value of money over time."
            keywords={['inflation calculator', 'purchasing power calculator', 'cost of inflation', 'real value calculator']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Mode Toggle */}
                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${mode === 'future' ? 'active' : ''}`}
                        onClick={() => setMode('future')}
                    >
                        <span className="mode-icon">🔮</span>
                        <span className="mode-text">
                            <strong>Future Impact</strong>
                            <small>What will ₹X be worth in Y years?</small>
                        </span>
                    </button>
                    <button
                        className={`mode-btn ${mode === 'past' ? 'active' : ''}`}
                        onClick={() => setMode('past')}
                    >
                        <span className="mode-icon">⏳</span>
                        <span className="mode-text">
                            <strong>Past Comparison</strong>
                            <small>What was ₹X worth Y years ago?</small>
                        </span>
                    </button>
                </div>

                {/* Amount Slider */}
                <SliderInput
                    id="inflation-amount"
                    label={mode === 'future' ? 'Current Amount' : 'Today\'s Amount'}
                    value={amount}
                    onChange={setAmount}
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

                {/* Inflation Rate Slider */}
                <SliderInput
                    id="inflation-rate"
                    label="Inflation Rate (% p.a.)"
                    value={rate}
                    onChange={setRate}
                    min={2}
                    max={12}
                    step={0.5}
                    suffix="%"
                    tickMarks={[2, 4, 6, 8, 10, 12]}
                    formatValue={(val) => val.toFixed(1)}
                />

                {/* Years Slider */}
                <SliderInput
                    id="inflation-years"
                    label={`Time Period (${mode === 'future' ? 'Years Ahead' : 'Years Ago'})`}
                    value={years}
                    onChange={setYears}
                    min={1}
                    max={30}
                    step={1}
                    suffix=" yrs"
                    tickMarks={[5, 10, 15, 20, 25, 30]}
                    formatValue={(val) => val.toString()}
                />

                {result && (
                    <div className="result-box">
                        {result.mode === 'future' ? (
                            <>
                                <div className="inflation-visual">
                                    <div className="visual-item start">
                                        <span className="visual-label">Today</span>
                                        <span className="visual-value">₹{parseInt(result.original).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="visual-arrow">
                                        <span className="arrow-line"></span>
                                        <span className="arrow-info">{result.years} years @ {result.rate}%</span>
                                    </div>
                                    <div className="visual-item end">
                                        <span className="visual-label">Purchasing Power</span>
                                        <span className="visual-value">₹{parseInt(result.purchasingPower).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="result-grid">
                                    <div className="result-item">
                                        <span className="result-label">Future Cost of Same Goods</span>
                                        <span className="result-value" style={{ color: 'var(--error)' }}>
                                            ₹{parseInt(result.futureValue).toLocaleString('en-IN')}
                                        </span>
                                        <span className="result-note">You'll need this much to buy what ₹{parseInt(result.original).toLocaleString('en-IN')} buys today</span>
                                    </div>
                                    <div className="result-item warning">
                                        <span className="result-label">Value Lost to Inflation</span>
                                        <span className="result-value">
                                            -₹{parseInt(result.lostValue).toLocaleString('en-IN')}
                                        </span>
                                        <span className="result-note">{result.percentageLost}% of your money's purchasing power</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="inflation-visual">
                                    <div className="visual-item start">
                                        <span className="visual-label">{result.years} Years Ago</span>
                                        <span className="visual-value">₹{parseInt(result.pastValue).toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="visual-arrow">
                                        <span className="arrow-line"></span>
                                        <span className="arrow-info">{result.years} years @ {result.rate}%</span>
                                    </div>
                                    <div className="visual-item end">
                                        <span className="visual-label">Today's Value</span>
                                        <span className="visual-value">₹{parseInt(result.todayValue).toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <div className="result-item highlight">
                                    <span className="result-label">₹{parseInt(result.todayValue).toLocaleString('en-IN')} today was equivalent to</span>
                                    <span className="result-value">₹{parseInt(result.pastValue).toLocaleString('en-IN')}</span>
                                    <span className="result-note">{result.years} years ago ({result.percentageGained}% increase due to inflation)</span>
                                </div>
                            </>
                        )}

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="Inflation Calculator Result"
                            shareText={result.mode === 'future'
                                ? `₹${parseInt(result.original).toLocaleString('en-IN')} today will have purchasing power of only ₹${parseInt(result.purchasingPower).toLocaleString('en-IN')} in ${result.years} years at ${result.rate}% inflation!`
                                : `₹${parseInt(result.todayValue).toLocaleString('en-IN')} today was worth ₹${parseInt(result.pastValue).toLocaleString('en-IN')} just ${result.years} years ago!`
                            }
                            toolName="inflation-calculator"
                        />
                    </div>
                )}

                {/* Historical Rates Reference */}
                <div className="historical-section">
                    <h3>📊 Historical Inflation Rates (India)</h3>
                    <div className="historical-grid">
                        {historicalRates.map((item, idx) => (
                            <div key={idx} className="historical-item">
                                <span className="historical-year">{item.year}</span>
                                <span className="historical-rate">{item.rate}</span>
                            </div>
                        ))}
                    </div>
                    <p className="historical-note">Based on Consumer Price Index (CPI) data</p>
                </div>
            </div>

            <style>{`
        .tool-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .mode-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition);
          text-align: left;
          font-family: inherit;
        }

        .mode-btn:hover {
          border-color: var(--pumpkin);
        }

        .mode-btn.active {
          background: rgba(252, 122, 30, 0.1);
          border-color: var(--pumpkin);
        }

        .mode-icon {
          font-size: 2rem;
        }

        .mode-text {
          display: flex;
          flex-direction: column;
        }

        .mode-text strong {
          color: var(--text-dark);
        }

        .mode-text small {
          color: var(--text-muted);
          font-size: var(--text-xs);
        }

        .inflation-visual {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
        }

        .visual-item {
          text-align: center;
        }

        .visual-item.end {
          background: rgba(252, 122, 30, 0.1);
          padding: var(--spacing-md);
          border-radius: var(--radius);
          border: 2px solid var(--pumpkin);
        }

        .visual-label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .visual-value {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-dark);
        }

        .visual-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          flex: 1;
          padding: 0 var(--spacing-md);
        }

        .arrow-line {
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, var(--yinmn-blue), var(--pumpkin));
          position: relative;
        }

        .arrow-line::after {
          content: '→';
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--pumpkin);
          font-size: var(--text-lg);
        }

        .arrow-info {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .result-item {
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          text-align: center;
        }

        .result-item.warning {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid var(--error);
        }

        .result-item.highlight {
          background: rgba(72, 86, 150, 0.1);
          border: 2px solid var(--yinmn-blue);
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
          display: block;
        }

        .result-note {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
        }

        .historical-section {
          margin-top: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }

        .historical-section h3 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: var(--text-base);
        }

        .historical-grid {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }

        .historical-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-primary);
          border-radius: var(--radius);
          min-width: 70px;
        }

        .historical-year {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .historical-rate {
          font-weight: 600;
          color: var(--pumpkin);
        }

        .historical-note {
          margin: var(--spacing-sm) 0 0 0;
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .mode-toggle {
            grid-template-columns: 1fr;
          }

          .inflation-visual {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .visual-arrow {
            transform: rotate(90deg);
            padding: var(--spacing-md) 0;
          }

          .result-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default InflationCalculator;
