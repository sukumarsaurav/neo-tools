import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, ResultActions } from './shared';

// TDS Sections Data with rates
const TDS_SECTIONS = [
    {
        id: '194C',
        name: 'Section 194C - Contractors',
        description: 'Payments to contractors/sub-contractors for work contracts',
        rates: { individual: 1, company: 2 },
        threshold: 30000,
        annualThreshold: 100000,
        notes: 'Single payment > ₹30,000 or aggregate > ₹1,00,000 in a year'
    },
    {
        id: '194J',
        name: 'Section 194J - Professional/Technical Fees',
        description: 'Fees for professional or technical services',
        rates: { individual: 10, company: 10 },
        technicalRate: 2, // For technical services only
        threshold: 30000,
        notes: '2% for technical services (call centers), 10% for others'
    },
    {
        id: '194I-A',
        name: 'Section 194I(a) - Rent (Plant & Machinery)',
        description: 'Rent paid for plant, machinery, or equipment',
        rates: { individual: 2, company: 2 },
        threshold: 240000,
        notes: 'Annual rent > ₹2,40,000'
    },
    {
        id: '194I-B',
        name: 'Section 194I(b) - Rent (Land & Building)',
        description: 'Rent paid for land, building, or furniture',
        rates: { individual: 10, company: 10 },
        threshold: 240000,
        notes: 'Annual rent > ₹2,40,000'
    },
    {
        id: '194H',
        name: 'Section 194H - Commission/Brokerage',
        description: 'Commission or brokerage payments',
        rates: { individual: 5, company: 5 },
        threshold: 15000,
        notes: 'Aggregate payment > ₹15,000 in a year'
    },
    {
        id: '194A',
        name: 'Section 194A - Interest (Other than Securities)',
        description: 'Interest paid by banks, post offices, co-ops',
        rates: { individual: 10, company: 10 },
        threshold: 40000,
        seniorThreshold: 50000,
        notes: '₹40,000 for banks (₹50,000 for senior citizens)'
    },
    {
        id: '194D',
        name: 'Section 194D - Insurance Commission',
        description: 'Commission to insurance agents',
        rates: { individual: 5, company: 10 },
        threshold: 15000,
        notes: 'Commission > ₹15,000 in a year'
    },
    {
        id: '194O',
        name: 'Section 194O - E-commerce Transactions',
        description: 'Payment to e-commerce participants',
        rates: { individual: 1, company: 1 },
        threshold: 500000,
        notes: 'Gross amount > ₹5,00,000 for individual/HUF'
    },
    {
        id: '194Q',
        name: 'Section 194Q - Purchase of Goods',
        description: 'Purchase of goods from resident sellers',
        rates: { individual: 0.1, company: 0.1 },
        threshold: 5000000,
        notes: 'Purchase value > ₹50,00,000 in a year'
    },
    {
        id: '194B',
        name: 'Section 194B - Lottery/Crossword Winnings',
        description: 'Winnings from lottery, crossword puzzles, card games',
        rates: { individual: 30, company: 30 },
        threshold: 10000,
        notes: 'Winnings > ₹10,000'
    },
    {
        id: '194BB',
        name: 'Section 194BB - Horse Race Winnings',
        description: 'Winnings from horse races',
        rates: { individual: 30, company: 30 },
        threshold: 10000,
        notes: 'Winnings > ₹10,000'
    },
    {
        id: '194N',
        name: 'Section 194N - Cash Withdrawal',
        description: 'Cash withdrawal exceeding limits',
        rates: { individual: 2, company: 2 },
        threshold: 10000000,
        nonFilerRate: 5,
        notes: '2% over ₹1Cr (5% for non-filers over ₹20L)'
    }
];

const NO_PAN_RATE = 20;

const TdsCalculator = () => {
    const [selectedSection, setSelectedSection] = useState(TDS_SECTIONS[0]);
    const [amount, setAmount] = useState(100000);
    const [payeeType, setPayeeType] = useState('individual'); // individual or company
    const [noPanAvailable, setNoPanAvailable] = useState(false);
    const [isTechnicalService, setIsTechnicalService] = useState(false); // For 194J
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'tds-calculator')
        .slice(0, 3);

    // Real-time calculation
    useEffect(() => {
        calculateTds();
    }, [selectedSection, amount, payeeType, noPanAvailable, isTechnicalService]);

    const calculateTds = () => {
        if (amount <= 0) {
            setResult(null);
            return;
        }

        let applicableRate;

        if (noPanAvailable) {
            applicableRate = NO_PAN_RATE;
        } else if (selectedSection.id === '194J' && isTechnicalService) {
            applicableRate = selectedSection.technicalRate;
        } else {
            applicableRate = selectedSection.rates[payeeType];
        }

        const tdsAmount = (amount * applicableRate) / 100;
        const netAmount = amount - tdsAmount;

        setResult({
            grossAmount: amount,
            applicableRate,
            tdsAmount: tdsAmount.toFixed(2),
            netAmount: netAmount.toFixed(2),
            section: selectedSection.id,
            threshold: selectedSection.threshold,
            isAboveThreshold: amount >= selectedSection.threshold,
            noPan: noPanAvailable
        });
    };

    // Generate copy text for results
    const getCopyText = () => {
        if (!result) return '';
        return `TDS Calculation - ${selectedSection.name}
========================
Gross Amount: ₹${parseFloat(result.grossAmount).toLocaleString('en-IN')}
TDS Rate: ${result.applicableRate}%${result.noPan ? ' (No PAN - Higher Rate)' : ''}
TDS Amount: ₹${parseFloat(result.tdsAmount).toLocaleString('en-IN')}
Net Payable: ₹${parseFloat(result.netAmount).toLocaleString('en-IN')}
Threshold: ₹${result.threshold.toLocaleString('en-IN')}`;
    };

    const faqs = [
        {
            question: 'What is TDS?',
            answer: 'TDS (Tax Deducted at Source) is a means of collecting income tax at the source of income. The payer deducts tax before making payment and deposits it with the government on behalf of the payee.'
        },
        {
            question: 'What happens if PAN is not provided?',
            answer: 'If the payee does not provide PAN, TDS is deducted at a higher rate of 20% (or the applicable rate, whichever is higher) as per Section 206AA of the Income Tax Act.'
        },
        {
            question: 'What is the difference between Section 194C and 194J?',
            answer: 'Section 194C applies to payments for work contracts (construction, manufacturing, service contracts) at 1-2% rate. Section 194J applies to professional or technical services (lawyers, CAs, consultants) at 10% rate (or 2% for technical services like call centers).'
        },
        {
            question: 'When should TDS be deposited?',
            answer: 'TDS must be deposited by the 7th of the following month. For March, the deadline is 30th April. Government deductors can deposit on the same day without challan.'
        },
        {
            question: 'What are the penalties for non-deduction of TDS?',
            answer: 'Failure to deduct TDS attracts: (1) Interest at 1% per month from date of deductibility to date of deduction, (2) Interest at 1.5% per month from date of deduction to date of payment, (3) Penalty equal to the TDS amount under Section 271C.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is a TDS Calculator?</h2>
            <p>
                A TDS (Tax Deducted at Source) Calculator helps you determine the exact amount of tax
                to be deducted from various payments like professional fees, rent, contractor payments,
                and more. Our calculator covers all common TDS sections with current rates as per the
                Income Tax Act.
            </p>

            <h2>TDS Sections Covered</h2>
            <ul>
                <li><strong>Section 194C:</strong> Contractors - 1% (Individual/HUF), 2% (Others)</li>
                <li><strong>Section 194J:</strong> Professional/Technical Fees - 10% (2% for technical services)</li>
                <li><strong>Section 194I:</strong> Rent - 2% (P&M), 10% (Land/Building)</li>
                <li><strong>Section 194H:</strong> Commission/Brokerage - 5%</li>
                <li><strong>Section 194A:</strong> Interest (other than securities) - 10%</li>
                <li><strong>Section 194O:</strong> E-commerce Transactions - 1%</li>
                <li><strong>Section 194Q:</strong> Purchase of Goods - 0.1%</li>
            </ul>

            <h2>Important TDS Rules</h2>
            <ul>
                <li><strong>Threshold Limits:</strong> TDS is applicable only when payment exceeds threshold limits</li>
                <li><strong>No PAN Penalty:</strong> 20% rate applies if payee doesn't provide PAN</li>
                <li><strong>Lower Deduction Certificate:</strong> Payees can apply for lower/nil TDS under Section 197</li>
                <li><strong>TDS Returns:</strong> Quarterly returns in Form 24Q, 26Q, 27Q, 27EQ</li>
            </ul>

            <h2>TDS Deduction Timeline</h2>
            <ol>
                <li>Deduct TDS at the time of credit or payment, whichever is earlier</li>
                <li>Deposit TDS by 7th of the following month (30th April for March)</li>
                <li>File quarterly TDS returns within due dates</li>
                <li>Issue TDS certificate (Form 16/16A) to payee</li>
            </ol>
        </>
    );

    return (
        <ToolLayout
            title="TDS Calculator"
            description="Calculate Tax Deducted at Source (TDS) for various payments. Supports all major TDS sections including 194C, 194J, 194I, 194H with current rates."
            keywords={['TDS calculator', 'tax deducted at source', '194C TDS', '194J professional fees', 'TDS rate calculator', 'income tax TDS']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Section Selection */}
                <div className="section-selection">
                    <label className="form-label">Select TDS Section</label>
                    <div className="section-grid">
                        {TDS_SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                className={`section-card ${selectedSection.id === section.id ? 'active' : ''}`}
                                onClick={() => setSelectedSection(section)}
                            >
                                <span className="section-id">{section.id}</span>
                                <span className="section-name">{section.name.split(' - ')[1]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Section Info */}
                <div className="section-info">
                    <h4>{selectedSection.name}</h4>
                    <p>{selectedSection.description}</p>
                    <div className="info-badges">
                        <span className="badge">Threshold: ₹{selectedSection.threshold.toLocaleString('en-IN')}</span>
                        <span className="badge">
                            Rate: {selectedSection.rates.individual}%
                            {selectedSection.rates.individual !== selectedSection.rates.company &&
                                ` / ${selectedSection.rates.company}%`}
                        </span>
                    </div>
                    <p className="section-notes">📌 {selectedSection.notes}</p>
                </div>

                {/* Amount Slider */}
                <SliderInput
                    id="amount"
                    label="Payment Amount"
                    value={amount}
                    onChange={setAmount}
                    min={1000}
                    max={10000000}
                    step={1000}
                    prefix="₹"
                    tickMarks={[10000, 100000, 1000000, 5000000, 10000000]}
                    formatValue={(val) => {
                        if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
                        if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                        return val.toLocaleString('en-IN');
                    }}
                />

                {/* Payee Type Toggle */}
                <div className="toggle-section">
                    <label className="form-label">Payee Type</label>
                    <div className="toggle-buttons">
                        <button
                            className={`toggle-btn ${payeeType === 'individual' ? 'active' : ''}`}
                            onClick={() => setPayeeType('individual')}
                        >
                            👤 Individual/HUF
                        </button>
                        <button
                            className={`toggle-btn ${payeeType === 'company' ? 'active' : ''}`}
                            onClick={() => setPayeeType('company')}
                        >
                            🏢 Company/Firm
                        </button>
                    </div>
                </div>

                {/* Technical Services Toggle (for 194J only) */}
                {selectedSection.id === '194J' && (
                    <div className="toggle-section">
                        <label className="form-label">Service Type</label>
                        <div className="toggle-buttons">
                            <button
                                className={`toggle-btn ${!isTechnicalService ? 'active' : ''}`}
                                onClick={() => setIsTechnicalService(false)}
                            >
                                💼 Professional Services (10%)
                            </button>
                            <button
                                className={`toggle-btn ${isTechnicalService ? 'active' : ''}`}
                                onClick={() => setIsTechnicalService(true)}
                            >
                                🖥️ Technical Services (2%)
                            </button>
                        </div>
                    </div>
                )}

                {/* No PAN Toggle */}
                <div className="pan-toggle">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={noPanAvailable}
                            onChange={(e) => setNoPanAvailable(e.target.checked)}
                        />
                        <span className="checkbox-text">
                            ⚠️ PAN not available (Higher rate @ 20% applies)
                        </span>
                    </label>
                </div>

                {/* Results */}
                {result && (
                    <div className="result-box">
                        <div className="result-grid">
                            <div className="result-item">
                                <span className="result-label">Gross Amount</span>
                                <span className="result-value">₹{parseFloat(result.grossAmount).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="result-item">
                                <span className="result-label">TDS Rate</span>
                                <span className="result-value">
                                    {result.applicableRate}%
                                    {result.noPan && <span className="rate-warning"> (No PAN)</span>}
                                </span>
                            </div>
                            <div className="result-item highlight-warning">
                                <span className="result-label">TDS to Deduct</span>
                                <span className="result-value">₹{parseFloat(result.tdsAmount).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="result-item highlight">
                                <span className="result-label">Net Amount Payable</span>
                                <span className="result-value">₹{parseFloat(result.netAmount).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Threshold Warning */}
                        {!result.isAboveThreshold && (
                            <div className="threshold-warning">
                                ℹ️ Amount is below threshold (₹{result.threshold.toLocaleString('en-IN')}).
                                TDS may not be applicable for single payments below this limit.
                            </div>
                        )}

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="TDS Calculation Result"
                            shareText={`TDS on ₹${parseFloat(result.grossAmount).toLocaleString('en-IN')} under ${result.section}: ₹${parseFloat(result.tdsAmount).toLocaleString('en-IN')} at ${result.applicableRate}%`}
                            toolName="tds-calculator"
                        />
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 700px;
          margin: 0 auto;
        }

        .section-selection {
          margin-bottom: var(--spacing-xl);
        }

        .section-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }

        .section-card {
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

        .section-card:hover {
          border-color: var(--yinmn-blue);
        }

        .section-card.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
        }

        .section-id {
          font-weight: 700;
          font-size: var(--text-lg);
          color: var(--yinmn-blue);
        }

        .section-name {
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-align: center;
          margin-top: var(--spacing-xs);
        }

        .section-info {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
          border-left: 4px solid var(--yinmn-blue);
        }

        .section-info h4 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--text-dark);
        }

        .section-info p {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--text-muted);
        }

        .info-badges {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
          margin-bottom: var(--spacing-sm);
        }

        .badge {
          background: rgba(72, 86, 150, 0.1);
          color: var(--yinmn-blue);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .section-notes {
          font-size: var(--text-sm);
          font-style: italic;
          color: var(--text-muted);
        }

        .toggle-section {
          margin-bottom: var(--spacing-lg);
        }

        .toggle-buttons {
          display: flex;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-sm);
        }

        .toggle-btn {
          flex: 1;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
          font-size: var(--text-sm);
        }

        .toggle-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .toggle-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
          color: var(--yinmn-blue);
        }

        .pan-toggle {
          margin-bottom: var(--spacing-xl);
          padding: var(--spacing-md);
          background: rgba(239, 68, 68, 0.1);
          border-radius: var(--radius);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: var(--text-sm);
          color: var(--text-dark);
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

        .result-item.highlight-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: var(--white);
        }

        .result-item.highlight .result-label,
        .result-item.highlight .result-value,
        .result-item.highlight-warning .result-label,
        .result-item.highlight-warning .result-value {
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

        .rate-warning {
          font-size: var(--text-sm);
          display: block;
          color: rgba(255,255,255,0.9);
        }

        .threshold-warning {
          padding: var(--spacing-md);
          background: rgba(59, 130, 246, 0.1);
          border-radius: var(--radius);
          font-size: var(--text-sm);
          color: var(--info);
          margin-bottom: var(--spacing-md);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 600px) {
          .section-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .toggle-buttons {
            flex-direction: column;
          }

          .result-grid {
            grid-template-columns: 1fr;
          }

          .result-item.highlight,
          .result-item.highlight-warning {
            grid-column: span 1;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default TdsCalculator;
