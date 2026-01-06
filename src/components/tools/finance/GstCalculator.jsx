import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { SliderInput, ResultActions } from './shared';

const GstCalculator = () => {
    const [amount, setAmount] = useState(10000);
    const [gstRate, setGstRate] = useState(18);
    const [calcType, setCalcType] = useState('exclusive');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'gst-calculator')
        .slice(0, 3);

    // GST Rate presets
    const gstPresets = [
        { rate: 5, label: '5%', items: 'Sugar, tea, edible oils' },
        { rate: 12, label: '12%', items: 'Processed foods, computers' },
        { rate: 18, label: '18%', items: 'Most goods & services' },
        { rate: 28, label: '28%', items: 'Luxury items, automobiles' }
    ];

    // Real-time calculation
    useEffect(() => {
        if (amount > 0) {
            calculate();
        }
    }, [amount, gstRate, calcType]);

    const calculate = () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0) {
            return;
        }

        const rate = parseFloat(gstRate);
        let gstAmount, netAmount, totalAmount, cgst, sgst;

        if (calcType === 'exclusive') {
            // GST Exclusive: Add GST to amount
            netAmount = amt;
            gstAmount = (amt * rate) / 100;
            totalAmount = amt + gstAmount;
        } else {
            // GST Inclusive: Extract GST from amount
            totalAmount = amt;
            gstAmount = (amt * rate) / (100 + rate);
            netAmount = amt - gstAmount;
        }

        cgst = gstAmount / 2;
        sgst = gstAmount / 2;

        setResult({
            netAmount: netAmount.toFixed(2),
            gstAmount: gstAmount.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            cgst: cgst.toFixed(2),
            sgst: sgst.toFixed(2),
            rate: rate
        });
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';
        return `GST Calculator Results
========================
Calculation Type: GST ${calcType === 'exclusive' ? 'Exclusive (Add GST)' : 'Inclusive (Extract GST)'}
GST Rate: ${result.rate}%

Net Amount: ₹${parseFloat(result.netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
GST Amount: ₹${parseFloat(result.gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
  - CGST (${result.rate / 2}%): ₹${parseFloat(result.cgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
  - SGST (${result.rate / 2}%): ₹${parseFloat(result.sgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
Total Amount: ₹${parseFloat(result.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    };

    const faqs = [
        {
            question: 'What is GST?',
            answer: 'GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services in India. It replaced multiple cascading taxes and created a unified national market.'
        },
        {
            question: 'What is the difference between GST Exclusive and GST Inclusive?',
            answer: 'GST Exclusive means the GST is added on top of the base price (e.g., ₹100 + 18% GST = ₹118). GST Inclusive means the GST is already included in the total price, and you need to extract it (e.g., ₹118 includes ₹18 GST).'
        },
        {
            question: 'What are CGST and SGST?',
            answer: 'CGST (Central GST) and SGST (State GST) are components of GST for intra-state transactions. For interstate transactions, IGST (Integrated GST) is charged. CGST goes to the Central Government and SGST goes to the State Government.'
        },
        {
            question: 'What are the GST slab rates in India?',
            answer: 'India has four GST slab rates: 5%, 12%, 18%, and 28%. Essential items are taxed at lower rates while luxury and sin goods attract higher rates. Some items like fresh food and healthcare are exempt from GST.'
        },
        {
            question: 'How to calculate GST manually?',
            answer: 'For GST Exclusive: GST Amount = (Original Price × GST Rate) / 100. Total = Original Price + GST Amount. For GST Inclusive: GST Amount = (Total Price × GST Rate) / (100 + GST Rate).'
        }
    ];

    const seoContent = (
        <>
            <h2>What is GST Calculator?</h2>
            <p>
                A GST Calculator is an essential online tool that helps businesses, accountants, and individuals
                calculate Goods and Services Tax quickly and accurately. Whether you need to add GST to a base price
                (GST Exclusive) or extract GST from a total amount (GST Inclusive), this calculator simplifies
                the entire process.
            </p>

            <h2>Understanding GST in India</h2>
            <p>
                The Goods and Services Tax (GST) was introduced in India on July 1, 2017, replacing multiple
                indirect taxes like VAT, Service Tax, and Excise Duty. GST is a destination-based tax that
                is levied at each stage of the supply chain, from manufacturing to final consumption.
            </p>

            <h3>GST Tax Slabs</h3>
            <ul>
                <li><strong>0% GST:</strong> Essential items like fresh vegetables, fruits, milk, eggs, and healthcare services</li>
                <li><strong>5% GST:</strong> Basic necessities like sugar, tea, edible oils, and economy class air travel</li>
                <li><strong>12% GST:</strong> Processed foods, computers, mobile phones, and business class air travel</li>
                <li><strong>18% GST:</strong> Most goods and services including restaurants, IT services, and electronics</li>
                <li><strong>28% GST:</strong> Luxury items like automobiles, aerated drinks, and tobacco products</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="GST Calculator"
            description="Calculate GST amount, CGST, SGST, and total price instantly. Add or extract GST with our free online GST calculator."
            keywords={['GST calculator', 'GST calculation', 'CGST SGST calculator', 'GST exclusive', 'GST inclusive', 'Indian GST', 'tax calculator']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Calculation Type Toggle */}
                <div className="calc-type-toggle">
                    <button
                        className={`calc-type-btn ${calcType === 'exclusive' ? 'active' : ''}`}
                        onClick={() => setCalcType('exclusive')}
                    >
                        <span className="calc-icon">➕</span>
                        <span className="calc-text">
                            <strong>GST Exclusive</strong>
                            <small>Add GST to amount</small>
                        </span>
                    </button>
                    <button
                        className={`calc-type-btn ${calcType === 'inclusive' ? 'active' : ''}`}
                        onClick={() => setCalcType('inclusive')}
                    >
                        <span className="calc-icon">➖</span>
                        <span className="calc-text">
                            <strong>GST Inclusive</strong>
                            <small>Extract GST from amount</small>
                        </span>
                    </button>
                </div>

                {/* Amount Slider */}
                <SliderInput
                    id="gst-amount"
                    label={calcType === 'exclusive' ? 'Net Amount (Before GST)' : 'Total Amount (Including GST)'}
                    value={amount}
                    onChange={setAmount}
                    min={100}
                    max={1000000}
                    step={100}
                    prefix="₹"
                    tickMarks={[10000, 50000, 100000, 500000, 1000000]}
                    formatValue={(val) => {
                        if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                        return val.toLocaleString('en-IN');
                    }}
                />

                {/* GST Rate Presets */}
                <div className="form-group">
                    <label className="form-label">GST Rate</label>
                    <div className="gst-presets">
                        {gstPresets.map(preset => (
                            <button
                                key={preset.rate}
                                className={`gst-preset-btn ${gstRate === preset.rate ? 'active' : ''}`}
                                onClick={() => setGstRate(preset.rate)}
                            >
                                <span className="preset-rate">{preset.label}</span>
                                <span className="preset-items">{preset.items}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {result && (
                    <div className="result-box">
                        <div className="result-flow">
                            <div className="flow-item start">
                                <span className="flow-label">
                                    {calcType === 'exclusive' ? 'Net Amount' : 'Total Amount'}
                                </span>
                                <span className="flow-value">₹{parseFloat(calcType === 'exclusive' ? result.netAmount : result.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="flow-arrow">
                                {calcType === 'exclusive' ? '+ GST →' : '- GST →'}
                            </div>

                            <div className="flow-item end">
                                <span className="flow-label">
                                    {calcType === 'exclusive' ? 'Total Amount' : 'Net Amount'}
                                </span>
                                <span className="flow-value">₹{parseFloat(calcType === 'exclusive' ? result.totalAmount : result.netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="gst-breakdown">
                            <h4>GST Breakdown ({result.rate}%)</h4>
                            <div className="breakdown-grid">
                                <div className="breakdown-item">
                                    <span className="breakdown-label">Total GST</span>
                                    <span className="breakdown-value highlight">₹{parseFloat(result.gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="breakdown-label">CGST ({result.rate / 2}%)</span>
                                    <span className="breakdown-value">₹{parseFloat(result.cgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="breakdown-item">
                                    <span className="breakdown-label">SGST ({result.rate / 2}%)</span>
                                    <span className="breakdown-value">₹{parseFloat(result.sgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                            <p className="igst-note">
                                💡 For inter-state transactions, IGST of {result.rate}% applies instead of CGST + SGST
                            </p>
                        </div>

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="GST Calculator Result"
                            shareText={`GST Calculation: ₹${parseFloat(result.netAmount).toLocaleString('en-IN')} + ${result.rate}% GST = ₹${parseFloat(result.totalAmount).toLocaleString('en-IN')}`}
                            toolName="gst-calculator"
                        />
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .calc-type-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .calc-type-btn {
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

        .calc-type-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .calc-type-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
        }

        .calc-icon {
          font-size: 1.5rem;
        }

        .calc-text {
          display: flex;
          flex-direction: column;
        }

        .calc-text strong {
          color: var(--text-dark);
          font-size: var(--text-base);
        }

        .calc-text small {
          color: var(--text-muted);
          font-size: var(--text-xs);
        }

        .gst-presets {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-sm);
        }

        .gst-preset-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-md) var(--spacing-sm);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
        }

        .gst-preset-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .gst-preset-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
        }

        .preset-rate {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-dark);
        }

        .gst-preset-btn.active .preset-rate {
          color: var(--yinmn-blue);
        }

        .preset-items {
          font-size: var(--text-xs);
          color: var(--text-muted);
          text-align: center;
          line-height: 1.2;
        }

        .result-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
        }

        .flow-item {
          display: flex;
          flex-direction: column;
          text-align: center;
          flex: 1;
        }

        .flow-item.end {
          background: var(--gradient-primary);
          color: white;
          padding: var(--spacing-md);
          border-radius: var(--radius);
          margin: calc(-1 * var(--spacing-md));
          margin-left: 0;
        }

        .flow-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .flow-item.end .flow-label {
          color: rgba(255, 255, 255, 0.8);
        }

        .flow-value {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--text-dark);
        }

        .flow-item.end .flow-value {
          color: white;
        }

        .flow-arrow {
          font-weight: 600;
          color: var(--yinmn-blue);
          white-space: nowrap;
        }

        .gst-breakdown {
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius);
        }

        .gst-breakdown h4 {
          margin: 0 0 var(--spacing-md) 0;
          font-size: var(--text-base);
          color: var(--text-dark);
        }

        .breakdown-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
        }

        .breakdown-item {
          text-align: center;
          padding: var(--spacing-sm);
          background: var(--bg-primary);
          border-radius: var(--radius);
        }

        .breakdown-label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .breakdown-value {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-dark);
        }

        .breakdown-value.highlight {
          color: var(--yinmn-blue);
        }

        .igst-note {
          margin: var(--spacing-md) 0 0 0;
          font-size: var(--text-sm);
          color: var(--text-muted);
          text-align: center;
        }

        @media (max-width: 480px) {
          .calc-type-toggle {
            grid-template-columns: 1fr;
          }

          .gst-presets {
            grid-template-columns: repeat(2, 1fr);
          }

          .result-flow {
            flex-direction: column;
            text-align: center;
          }

          .flow-arrow {
            transform: rotate(90deg);
          }

          .flow-item.end {
            margin: 0;
            margin-top: var(--spacing-sm);
            width: 100%;
          }

          .breakdown-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default GstCalculator;
