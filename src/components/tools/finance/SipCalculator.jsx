import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, DonutChart, ResultActions } from './shared';

const SipCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
    const [expectedReturn, setExpectedReturn] = useState(12);
    const [timePeriod, setTimePeriod] = useState(10);
    const [result, setResult] = useState(null);
    const [calculationMode, setCalculationMode] = useState('regular'); // regular, goal, stepup

    // Goal-based inputs
    const [targetAmount, setTargetAmount] = useState(10000000);
    const [goalYears, setGoalYears] = useState(10);
    const [goalReturn, setGoalReturn] = useState(12);

    // Step-Up SIP inputs
    const [stepUpPercent, setStepUpPercent] = useState(10);
    const [showStepUpTable, setShowStepUpTable] = useState(false);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'sip-calculator')
        .slice(0, 3);

    // Real-time calculation
    useEffect(() => {
        if (calculationMode === 'regular') {
            if (monthlyInvestment > 0 && expectedReturn > 0 && timePeriod > 0) {
                calculateRegular();
            }
        } else if (calculationMode === 'goal') {
            if (targetAmount > 0 && goalYears > 0 && goalReturn > 0) {
                calculateGoal();
            }
        } else if (calculationMode === 'stepup') {
            if (monthlyInvestment > 0 && expectedReturn > 0 && timePeriod > 0) {
                calculateStepUp();
            }
        }
    }, [monthlyInvestment, expectedReturn, timePeriod, targetAmount, goalYears, goalReturn, calculationMode, stepUpPercent]);

    const calculateRegular = () => {
        const P = parseFloat(monthlyInvestment);
        const r = parseFloat(expectedReturn) / 12 / 100;
        const n = parseFloat(timePeriod) * 12;

        if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || n <= 0) {
            return;
        }

        // SIP Future Value Formula: FV = P × (((1 + r)^n - 1) / r) × (1 + r)
        const futureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        const totalInvestment = P * n;
        const wealthGained = futureValue - totalInvestment;

        setResult({
            futureValue: futureValue.toFixed(0),
            totalInvestment: totalInvestment.toFixed(0),
            wealthGained: wealthGained.toFixed(0),
            years: timePeriod,
            returnRate: expectedReturn,
            monthlyAmount: P,
            mode: 'regular'
        });
    };

    const calculateGoal = () => {
        const FV = parseFloat(targetAmount);
        const r = parseFloat(goalReturn) / 12 / 100;
        const n = parseFloat(goalYears) * 12;

        if (isNaN(FV) || isNaN(r) || isNaN(n) || FV <= 0 || n <= 0) {
            return;
        }

        // Reverse calculation: P = FV / (((1 + r)^n - 1) / r × (1 + r))
        const requiredSIP = FV / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
        const totalInvestment = requiredSIP * n;
        const wealthGained = FV - totalInvestment;

        setResult({
            futureValue: FV.toFixed(0),
            totalInvestment: totalInvestment.toFixed(0),
            wealthGained: wealthGained.toFixed(0),
            years: goalYears,
            returnRate: goalReturn,
            monthlyAmount: requiredSIP.toFixed(0),
            mode: 'goal'
        });
    };

    const calculateStepUp = () => {
        const P = parseFloat(monthlyInvestment);
        const r = parseFloat(expectedReturn) / 12 / 100;
        const years = parseFloat(timePeriod);
        const stepUp = parseFloat(stepUpPercent) / 100;

        if (isNaN(P) || isNaN(r) || isNaN(years) || P <= 0 || years <= 0) {
            return;
        }

        // Year-by-year calculation
        const yearlyBreakdown = [];
        let totalInvestment = 0;
        let totalFV = 0;
        let currentMonthly = P;

        for (let year = 1; year <= years; year++) {
            const monthsRemaining = (years - year + 1) * 12;
            const yearlyInvestment = currentMonthly * 12;

            // FV of this year's SIP at end of investment period
            const yearFV = currentMonthly * (((Math.pow(1 + r, monthsRemaining) - 1) / r) * (1 + r)) -
                currentMonthly * (((Math.pow(1 + r, monthsRemaining - 12) - 1) / r) * (1 + r));

            totalInvestment += yearlyInvestment;
            totalFV += yearFV;

            yearlyBreakdown.push({
                year,
                monthlySIP: currentMonthly,
                yearlyInvestment,
                cumulativeInvestment: totalInvestment
            });

            // Increase SIP for next year
            currentMonthly = currentMonthly * (1 + stepUp);
        }

        // More accurate calculation using compound formula for step-up SIP
        let accurateFV = 0;
        currentMonthly = P;

        for (let year = 1; year <= years; year++) {
            const n = (years - year + 1) * 12;
            const monthlyFV = currentMonthly * (((Math.pow(1 + r, n) - Math.pow(1 + r, n - 12)) / r) * (1 + r));
            accurateFV += monthlyFV;
            currentMonthly = currentMonthly * (1 + stepUp);
        }

        // Compare with regular SIP
        const regularFV = P * (((Math.pow(1 + r, years * 12) - 1) / r) * (1 + r));
        const regularInvestment = P * years * 12;

        const wealthGained = accurateFV - totalInvestment;
        const extraGain = accurateFV - regularFV;
        const extraInvestment = totalInvestment - regularInvestment;

        setResult({
            futureValue: accurateFV.toFixed(0),
            totalInvestment: totalInvestment.toFixed(0),
            wealthGained: wealthGained.toFixed(0),
            years: timePeriod,
            returnRate: expectedReturn,
            monthlyAmount: P,
            stepUpPercent,
            yearlyBreakdown,
            regularSIP: {
                futureValue: regularFV.toFixed(0),
                totalInvestment: regularInvestment.toFixed(0),
                wealthGained: (regularFV - regularInvestment).toFixed(0)
            },
            extraGain: extraGain.toFixed(0),
            extraInvestment: extraInvestment.toFixed(0),
            mode: 'stepup'
        });
    };

    // Generate copy text for results
    const getCopyText = () => {
        if (!result) return '';
        if (result.mode === 'regular') {
            return `SIP Calculator Results
========================
Monthly Investment: ₹${parseInt(result.monthlyAmount).toLocaleString('en-IN')}
Expected Return: ${result.returnRate}% p.a.
Time Period: ${result.years} years

Total Investment: ₹${parseInt(result.totalInvestment).toLocaleString('en-IN')}
Wealth Gained: ₹${parseInt(result.wealthGained).toLocaleString('en-IN')}
Future Value: ₹${parseInt(result.futureValue).toLocaleString('en-IN')}`;
        } else if (result.mode === 'goal') {
            return `SIP Goal Calculator Results
========================
Target Amount: ₹${parseInt(result.futureValue).toLocaleString('en-IN')}
Expected Return: ${result.returnRate}% p.a.
Time Period: ${result.years} years

Required Monthly SIP: ₹${parseInt(result.monthlyAmount).toLocaleString('en-IN')}
Total Investment: ₹${parseInt(result.totalInvestment).toLocaleString('en-IN')}
Wealth Gained: ₹${parseInt(result.wealthGained).toLocaleString('en-IN')}`;
        } else if (result.mode === 'stepup') {
            return `Step-Up SIP Calculator Results
========================
Starting Monthly SIP: ₹${parseInt(result.monthlyAmount).toLocaleString('en-IN')}
Annual Step-Up: ${result.stepUpPercent}%
Expected Return: ${result.returnRate}% p.a.
Time Period: ${result.years} years

Total Investment: ₹${parseInt(result.totalInvestment).toLocaleString('en-IN')}
Future Value: ₹${parseInt(result.futureValue).toLocaleString('en-IN')}
Wealth Gained: ₹${parseInt(result.wealthGained).toLocaleString('en-IN')}

Comparison with Regular SIP:
Extra Wealth Generated: ₹${parseInt(result.extraGain).toLocaleString('en-IN')}`;
        }
        return '';
    };

    // Donut chart data
    const chartSegments = result ? [
        {
            value: parseFloat(result.totalInvestment),
            label: 'Total Investment',
            color: 'var(--yinmn-blue)'
        },
        {
            value: parseFloat(result.wealthGained),
            label: 'Wealth Gained',
            color: 'var(--success)'
        }
    ] : [];

    const faqs = [
        {
            question: 'What is SIP?',
            answer: 'SIP (Systematic Investment Plan) is a method of investing a fixed sum regularly in mutual funds. It allows you to invest small amounts periodically instead of a lump sum, averaging out market volatility.'
        },
        {
            question: 'How does SIP work?',
            answer: 'In SIP, a fixed amount is automatically debited from your bank account and invested in your chosen mutual fund. You get units based on the current NAV (Net Asset Value). This creates rupee cost averaging over time.'
        },
        {
            question: 'What is the minimum amount for SIP?',
            answer: 'Most mutual funds allow SIP investments starting from ₹500 per month. Some funds have minimum SIP amounts of ₹100 or ₹1000 depending on the scheme.'
        },
        {
            question: 'Can I modify or stop my SIP?',
            answer: 'Yes, SIPs are flexible. You can increase, decrease, pause, or stop your SIP at any time without penalties. You can also change the SIP date or switch to a different fund.'
        },
        {
            question: 'What returns can I expect from SIP?',
            answer: 'SIP returns depend on market performance and fund selection. Historically, equity mutual funds have given 12-15% annual returns over long periods, while debt funds give 6-8%. Past performance does not guarantee future returns.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is a SIP Calculator?</h2>
            <p>
                A SIP (Systematic Investment Plan) Calculator helps you estimate the future value of your
                regular mutual fund investments. By entering your monthly investment amount, expected return
                rate, and investment duration, you can visualize how your wealth will grow over time through
                the power of compounding.
            </p>

            <h2>Understanding SIP Investment</h2>
            <p>
                SIP is one of the most popular ways to invest in mutual funds in India. Instead of investing
                a large amount at once, you invest smaller amounts regularly. This approach offers several benefits:
            </p>
            <ul>
                <li><strong>Rupee Cost Averaging:</strong> You buy more units when prices are low and fewer when prices are high, averaging out the cost over time.</li>
                <li><strong>Power of Compounding:</strong> Your returns generate additional returns, creating exponential growth over long periods.</li>
                <li><strong>Disciplined Investing:</strong> Automatic monthly deductions create a savings habit.</li>
                <li><strong>Flexibility:</strong> Start, stop, or modify anytime without penalties.</li>
            </ul>

            <h2>SIP Calculation Formula</h2>
            <p>
                The future value of SIP is calculated using this formula:
            </p>
            <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '1rem', borderRadius: '0.5rem' }}>
                FV = P × (((1 + r)^n - 1) / r) × (1 + r)
            </p>
            <p>Where:</p>
            <ul>
                <li>FV = Future Value of investment</li>
                <li>P = Monthly investment amount</li>
                <li>r = Monthly return rate (annual rate / 12 / 100)</li>
                <li>n = Total number of payments (years × 12)</li>
            </ul>

            <h2>Types of SIP</h2>
            <ul>
                <li><strong>Regular SIP:</strong> Fixed amount invested monthly</li>
                <li><strong>Top-up SIP:</strong> SIP amount increases annually by a fixed percentage</li>
                <li><strong>Trigger SIP:</strong> Investment triggered based on market conditions</li>
                <li><strong>Perpetual SIP:</strong> SIP without end date, continues until you stop</li>
            </ul>

            <h2>Tips for SIP Investment</h2>
            <ol>
                <li><strong>Start Early:</strong> The earlier you start, the more time your money has to compound.</li>
                <li><strong>Stay Consistent:</strong> Don't stop SIPs during market downturns - that's when you get more units.</li>
                <li><strong>Increase SIP Annually:</strong> Increase your SIP amount when your income rises.</li>
                <li><strong>Choose the Right Fund:</strong> Select funds based on your risk tolerance and investment horizon.</li>
                <li><strong>Review Periodically:</strong> Review your portfolio annually and rebalance if needed.</li>
            </ol>
        </>
    );

    return (
        <ToolLayout
            title="SIP Calculator"
            description="Calculate the future value of your Systematic Investment Plan (SIP). Estimate wealth creation through regular mutual fund investments."
            keywords={['SIP calculator', 'mutual fund calculator', 'SIP returns', 'investment calculator', 'wealth calculator', 'systematic investment plan']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Mode Toggle */}
                <div className="mode-toggle three-col">
                    <button
                        className={`mode-btn ${calculationMode === 'regular' ? 'active' : ''}`}
                        onClick={() => setCalculationMode('regular')}
                    >
                        <span className="mode-icon">📊</span>
                        <span className="mode-text">
                            <strong>Regular SIP</strong>
                            <small>Fixed monthly amount</small>
                        </span>
                    </button>
                    <button
                        className={`mode-btn ${calculationMode === 'stepup' ? 'active' : ''}`}
                        onClick={() => setCalculationMode('stepup')}
                    >
                        <span className="mode-icon">📈</span>
                        <span className="mode-text">
                            <strong>Step-Up SIP</strong>
                            <small>Increase SIP yearly</small>
                        </span>
                    </button>
                    <button
                        className={`mode-btn ${calculationMode === 'goal' ? 'active' : ''}`}
                        onClick={() => setCalculationMode('goal')}
                    >
                        <span className="mode-icon">🎯</span>
                        <span className="mode-text">
                            <strong>Goal SIP</strong>
                            <small>Target amount in mind</small>
                        </span>
                    </button>
                </div>

                {calculationMode === 'regular' && (
                    <>
                        {/* Monthly Investment Slider */}
                        <SliderInput
                            id="monthly-investment"
                            label="Monthly Investment"
                            value={monthlyInvestment}
                            onChange={setMonthlyInvestment}
                            min={500}
                            max={500000}
                            step={500}
                            prefix="₹"
                            tickMarks={[5000, 25000, 100000, 250000, 500000]}
                            formatValue={(val) => {
                                if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                                if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                                return val.toLocaleString('en-IN');
                            }}
                        />

                        {/* Expected Return Slider */}
                        <SliderInput
                            id="expected-return"
                            label="Expected Return Rate (% p.a.)"
                            value={expectedReturn}
                            onChange={setExpectedReturn}
                            min={6}
                            max={20}
                            step={0.5}
                            suffix="%"
                            tickMarks={[6, 8, 10, 12, 14, 16, 18, 20]}
                            formatValue={(val) => val.toFixed(1)}
                        />

                        {/* Investment Period Slider */}
                        <SliderInput
                            id="time-period"
                            label="Investment Period (Years)"
                            value={timePeriod}
                            onChange={setTimePeriod}
                            min={1}
                            max={40}
                            step={1}
                            suffix=" yrs"
                            tickMarks={[5, 10, 15, 20, 25, 30, 35, 40]}
                            formatValue={(val) => val.toString()}
                        />
                    </>
                )}

                {calculationMode === 'stepup' && (
                    <>
                        {/* Monthly Investment Slider */}
                        <SliderInput
                            id="stepup-investment"
                            label="Starting Monthly SIP"
                            value={monthlyInvestment}
                            onChange={setMonthlyInvestment}
                            min={500}
                            max={500000}
                            step={500}
                            prefix="₹"
                            tickMarks={[5000, 25000, 100000, 250000, 500000]}
                            formatValue={(val) => {
                                if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                                if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                                return val.toLocaleString('en-IN');
                            }}
                        />

                        {/* Step-Up Percentage Slider */}
                        <SliderInput
                            id="stepup-percent"
                            label="Annual Step-Up (%)"
                            value={stepUpPercent}
                            onChange={setStepUpPercent}
                            min={5}
                            max={25}
                            step={1}
                            suffix="%"
                            tickMarks={[5, 10, 15, 20, 25]}
                            formatValue={(val) => val.toString()}
                        />

                        {/* Expected Return Slider */}
                        <SliderInput
                            id="stepup-return"
                            label="Expected Return Rate (% p.a.)"
                            value={expectedReturn}
                            onChange={setExpectedReturn}
                            min={6}
                            max={20}
                            step={0.5}
                            suffix="%"
                            tickMarks={[6, 8, 10, 12, 14, 16, 18, 20]}
                            formatValue={(val) => val.toFixed(1)}
                        />

                        {/* Investment Period Slider */}
                        <SliderInput
                            id="stepup-period"
                            label="Investment Period (Years)"
                            value={timePeriod}
                            onChange={setTimePeriod}
                            min={1}
                            max={40}
                            step={1}
                            suffix=" yrs"
                            tickMarks={[5, 10, 15, 20, 25, 30, 35, 40]}
                            formatValue={(val) => val.toString()}
                        />
                    </>
                )}

                {calculationMode === 'goal' && (
                    <>
                        {/* Target Amount Slider */}
                        <SliderInput
                            id="target-amount"
                            label="Target Amount (Goal)"
                            value={targetAmount}
                            onChange={setTargetAmount}
                            min={100000}
                            max={100000000}
                            step={100000}
                            prefix="₹"
                            tickMarks={[1000000, 10000000, 50000000, 100000000]}
                            formatValue={(val) => {
                                if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
                                if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                                return val.toLocaleString('en-IN');
                            }}
                        />

                        {/* Goal Years Slider */}
                        <SliderInput
                            id="goal-years"
                            label="Time to Achieve Goal"
                            value={goalYears}
                            onChange={setGoalYears}
                            min={1}
                            max={40}
                            step={1}
                            suffix=" yrs"
                            tickMarks={[5, 10, 15, 20, 25, 30, 35, 40]}
                            formatValue={(val) => val.toString()}
                        />

                        {/* Goal Return Slider */}
                        <SliderInput
                            id="goal-return"
                            label="Expected Return Rate (% p.a.)"
                            value={goalReturn}
                            onChange={setGoalReturn}
                            min={6}
                            max={20}
                            step={0.5}
                            suffix="%"
                            tickMarks={[6, 8, 10, 12, 14, 16, 18, 20]}
                            formatValue={(val) => val.toFixed(1)}
                        />
                    </>
                )}

                {result && (
                    <>
                        {/* Donut Chart */}
                        <div className="chart-section">
                            <DonutChart
                                segments={chartSegments}
                                centerValue={`₹${parseInt(result.futureValue) >= 10000000
                                    ? (parseInt(result.futureValue) / 10000000).toFixed(2) + 'Cr'
                                    : parseInt(result.futureValue) >= 100000
                                        ? (parseInt(result.futureValue) / 100000).toFixed(2) + 'L'
                                        : parseInt(result.futureValue).toLocaleString('en-IN')}`}
                                centerLabel="Future Value"
                                size={220}
                                strokeWidth={35}
                            />
                        </div>

                        {/* Results Grid */}
                        <div className="result-box">
                            <div className="result-grid">
                                {result.mode === 'goal' && (
                                    <div className="result-item highlight goal-result">
                                        <span className="result-label">Required Monthly SIP</span>
                                        <span className="result-value">₹{parseInt(result.monthlyAmount).toLocaleString('en-IN')}</span>
                                        <span className="result-note">to reach your goal</span>
                                    </div>
                                )}
                                {result.mode === 'stepup' && (
                                    <div className="result-item highlight stepup-result">
                                        <span className="result-label">Future Value ({result.years} years @ {result.stepUpPercent}% step-up)</span>
                                        <span className="result-value">₹{parseInt(result.futureValue).toLocaleString('en-IN')}</span>
                                        <span className="result-note">with annual SIP increase</span>
                                    </div>
                                )}
                                <div className="result-item">
                                    <span className="result-label">Total Investment</span>
                                    <span className="result-value">₹{parseInt(result.totalInvestment).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Wealth Gained</span>
                                    <span className="result-value" style={{ color: 'var(--success)' }}>
                                        +₹{parseInt(result.wealthGained).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                {result.mode === 'regular' && (
                                    <div className="result-item highlight">
                                        <span className="result-label">Future Value ({result.years} years @ {result.returnRate}%)</span>
                                        <span className="result-value">₹{parseInt(result.futureValue).toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                            </div>

                            {/* Step-Up vs Regular Comparison */}
                            {result.mode === 'stepup' && result.regularSIP && (
                                <div className="stepup-comparison">
                                    <h4>📈 Step-Up SIP Advantage</h4>
                                    <div className="comparison-grid">
                                        <div className="comparison-item">
                                            <span className="comp-label">Regular SIP Future Value</span>
                                            <span className="comp-value">₹{parseInt(result.regularSIP.futureValue).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="comparison-item">
                                            <span className="comp-label">Step-Up SIP Future Value</span>
                                            <span className="comp-value highlight">₹{parseInt(result.futureValue).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="comparison-item extra-gain">
                                            <span className="comp-label">Extra Wealth with Step-Up</span>
                                            <span className="comp-value success">+₹{parseInt(result.extraGain).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="comparison-item">
                                            <span className="comp-label">Additional Investment</span>
                                            <span className="comp-value">₹{parseInt(result.extraInvestment).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Investment Growth Visualization */}
                            <div className="growth-visual">
                                <div className="growth-label">Investment Growth</div>
                                <div className="bar-chart">
                                    <div
                                        className="bar invested"
                                        style={{ width: `${(result.totalInvestment / result.futureValue) * 100}%` }}
                                    >
                                        <span>{Math.round((result.totalInvestment / result.futureValue) * 100)}%</span>
                                    </div>
                                    <div
                                        className="bar returns"
                                        style={{ width: `${(result.wealthGained / result.futureValue) * 100}%` }}
                                    >
                                        <span>{Math.round((result.wealthGained / result.futureValue) * 100)}%</span>
                                    </div>
                                </div>
                                <div className="bar-legend">
                                    <span className="legend-item"><span className="dot invested"></span> Invested</span>
                                    <span className="legend-item"><span className="dot returns"></span> Returns</span>
                                </div>
                            </div>

                            <ResultActions
                                copyText={getCopyText()}
                                shareTitle="SIP Calculator Result"
                                shareText={result.mode === 'regular'
                                    ? `Investing ₹${parseInt(result.monthlyAmount).toLocaleString('en-IN')}/month for ${result.years} years at ${result.returnRate}% returns can grow to ₹${parseInt(result.futureValue).toLocaleString('en-IN')}!`
                                    : `To achieve ₹${parseInt(result.futureValue).toLocaleString('en-IN')} in ${result.years} years, I need to invest ₹${parseInt(result.monthlyAmount).toLocaleString('en-IN')}/month via SIP!`
                                }
                                toolName="sip-calculator"
                            />
                        </div>
                    </>
                )}
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
          border-color: var(--yinmn-blue);
        }

        .mode-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
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
          font-size: var(--text-base);
        }

        .mode-text small {
          color: var(--text-muted);
          font-size: var(--text-xs);
        }

        .chart-section {
          display: flex;
          justify-content: center;
          margin: var(--spacing-xl) 0;
        }

        .result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .result-item {
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          text-align: center;
        }

        .result-item.highlight {
          grid-column: span 2;
          background: var(--gradient-primary);
          color: var(--white);
        }

        .result-item.highlight.goal-result {
          background: linear-gradient(135deg, var(--success), #059669);
        }

        .result-item.highlight .result-label,
        .result-item.highlight .result-value {
          color: var(--white);
        }

        .result-note {
          display: block;
          font-size: var(--text-xs);
          opacity: 0.9;
          margin-top: var(--spacing-xs);
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

        .growth-visual {
          margin-top: var(--spacing-md);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
        }

        .growth-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-sm);
        }

        .bar-chart {
          display: flex;
          height: 40px;
          border-radius: var(--radius);
          overflow: hidden;
        }

        .bar {
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: var(--text-sm);
          font-weight: 500;
          min-width: 40px;
        }

        .bar.invested {
          background: var(--yinmn-blue);
        }

        .bar.returns {
          background: var(--success);
        }

        .bar-legend {
          display: flex;
          gap: var(--spacing-lg);
          justify-content: center;
          margin-top: var(--spacing-sm);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 2px;
        }

        .dot.invested {
          background: var(--yinmn-blue);
        }

        .dot.returns {
          background: var(--success);
        }

        /* Three column mode toggle */
        .mode-toggle.three-col {
          grid-template-columns: repeat(3, 1fr);
        }

        .mode-toggle.three-col .mode-btn {
          padding: var(--spacing-sm);
        }

        .mode-toggle.three-col .mode-icon {
          font-size: 1.5rem;
        }

        .mode-toggle.three-col .mode-text strong {
          font-size: var(--text-sm);
        }

        /* Step-up result styling */
        .result-item.highlight.stepup-result {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }

        /* Step-up comparison section */
        .stepup-comparison {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          border-left: 4px solid #8b5cf6;
        }

        .stepup-comparison h4 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: var(--text-base);
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }

        .comparison-item {
          padding: var(--spacing-sm);
          background: var(--bg-primary);
          border-radius: var(--radius-sm);
          text-align: center;
        }

        .comparison-item.extra-gain {
          grid-column: span 2;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--success);
        }

        .comp-label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .comp-value {
          display: block;
          font-size: var(--text-lg);
          font-weight: 600;
        }

        .comp-value.highlight {
          color: #8b5cf6;
        }

        .comp-value.success {
          color: var(--success);
          font-size: var(--text-xl);
        }

        @media (max-width: 600px) {
          .mode-toggle.three-col {
            grid-template-columns: 1fr;
          }

          .comparison-grid {
            grid-template-columns: 1fr;
          }

          .comparison-item.extra-gain {
            grid-column: span 1;
          }
        }

        @media (max-width: 480px) {
          .mode-toggle {
            grid-template-columns: 1fr;
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

export default SipCalculator;
