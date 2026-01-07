import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { ResultActions } from './shared';

// Indian Number Words
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

// Convert number less than 100 to words
const convertTwoDigit = (num) => {
    if (num < 20) return ONES[num];
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return TENS[ten] + (one > 0 ? ' ' + ONES[one] : '');
};

// Convert number less than 1000 to words
const convertThreeDigit = (num) => {
    if (num === 0) return '';
    if (num < 100) return convertTwoDigit(num);
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return ONES[hundred] + ' Hundred' + (remainder > 0 ? ' ' + convertTwoDigit(remainder) : '');
};

// Main conversion function for Indian system
const numberToWordsIndian = (num) => {
    // Handle zero
    if (num === 0) return 'Zero';

    // Handle negative
    let prefix = '';
    if (num < 0) {
        prefix = 'Minus ';
        num = Math.abs(num);
    }

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = num.toString().split('.');
    let n = parseInt(integerPart);

    // Validate range (up to 99,99,99,99,99,999 = 99 Kharab, but we'll limit to 99 Crore for practical use)
    if (n > 999999999999) {
        return 'Number too large (max: 99,99,99,99,99,999)';
    }

    let words = '';

    // Crores (1,00,00,000 and above)
    if (n >= 10000000) {
        const crores = Math.floor(n / 10000000);
        if (crores >= 100) {
            words += convertThreeDigit(crores) + ' Crore ';
        } else {
            words += convertTwoDigit(crores) + ' Crore ';
        }
        n %= 10000000;
    }

    // Lakhs (1,00,000 to 99,99,999)
    if (n >= 100000) {
        const lakhs = Math.floor(n / 100000);
        words += convertTwoDigit(lakhs) + ' Lakh ';
        n %= 100000;
    }

    // Thousands (1,000 to 99,999)
    if (n >= 1000) {
        const thousands = Math.floor(n / 1000);
        words += convertTwoDigit(thousands) + ' Thousand ';
        n %= 1000;
    }

    // Hundreds and below
    if (n > 0) {
        words += convertThreeDigit(n);
    }

    // Handle decimal (paise)
    let paiseWords = '';
    if (decimalPart) {
        const paise = parseInt(decimalPart.padEnd(2, '0').slice(0, 2));
        if (paise > 0) {
            paiseWords = convertTwoDigit(paise) + ' Paise';
        }
    }

    return { prefix, mainWords: words.trim(), paiseWords };
};

// Format number with Indian commas
const formatIndianNumber = (num) => {
    if (!num && num !== 0) return '';
    const str = num.toString();
    const [integer, decimal] = str.split('.');

    // Indian format: 12,34,56,789
    let result = '';
    let count = 0;
    for (let i = integer.length - 1; i >= 0; i--) {
        if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
            result = ',' + result;
        }
        result = integer[i] + result;
        count++;
    }

    return decimal ? result + '.' + decimal : result;
};

const NumberToWords = () => {
    const [inputNumber, setInputNumber] = useState('');
    const [includeRupees, setIncludeRupees] = useState(true);
    const [includeOnly, setIncludeOnly] = useState(true);
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'number-to-words')
        .slice(0, 3);

    // Real-time conversion
    useEffect(() => {
        if (inputNumber.trim()) {
            // Remove commas and parse
            const cleanNumber = inputNumber.replace(/,/g, '');
            const num = parseFloat(cleanNumber);

            if (!isNaN(num)) {
                const converted = numberToWordsIndian(num);
                if (typeof converted === 'string') {
                    // Error message
                    setResult({ error: converted });
                } else {
                    setResult({
                        number: num,
                        formatted: formatIndianNumber(cleanNumber),
                        ...converted
                    });
                }
            } else {
                setResult({ error: 'Please enter a valid number' });
            }
        } else {
            setResult(null);
        }
    }, [inputNumber]);

    // Build final result string
    const getFinalWords = () => {
        if (!result || result.error) return '';

        let words = '';
        if (result.prefix) words += result.prefix;
        if (includeRupees) words += 'Rupees ';
        words += result.mainWords;
        if (result.paiseWords) {
            words += ' and ' + result.paiseWords;
        }
        if (includeOnly) words += ' Only';

        return words;
    };

    // Generate copy text
    const getCopyText = () => {
        return getFinalWords();
    };

    // Quick examples
    const examples = [
        { value: '12345', label: '₹12,345' },
        { value: '100000', label: '₹1,00,000 (1 Lakh)' },
        { value: '1234567', label: '₹12,34,567' },
        { value: '10000000', label: '₹1,00,00,000 (1 Crore)' },
        { value: '999999999', label: '₹99,99,99,999' },
        { value: '50000.50', label: '₹50,000.50' },
    ];

    const faqs = [
        {
            question: 'Why is Indian numbering different from Western numbering?',
            answer: 'Indian numbering uses Lakh (1,00,000) and Crore (1,00,00,000) instead of Million and Billion. Commas are placed after every two digits after the first three, reflecting the Lakh and Crore system used in South Asia.'
        },
        {
            question: 'When do I need to write amounts in words?',
            answer: 'Numbers in words are required on cheques, demand drafts, legal agreements, contracts, promissory notes, and many official documents to prevent alteration and ensure clarity.'
        },
        {
            question: 'How are paise handled in the conversion?',
            answer: 'Paise (decimal part) are converted separately and added after "and". For example, ₹1234.50 becomes "Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only".'
        },
        {
            question: 'What is the maximum number this converter can handle?',
            answer: 'This converter handles numbers up to 99,99,99,99,99,999 (approximately 100 Kharab or 100 Trillion), which covers virtually all practical business and legal requirements.'
        },
        {
            question: 'Why add "Only" at the end?',
            answer: '"Only" is added to indicate that the amount is complete and no additional digits should be added. This is a standard practice in financial and legal documents to prevent fraud.'
        }
    ];

    const seoContent = (
        <>
            <h2>Number to Words Converter (Indian Format)</h2>
            <p>
                Convert any number to words in the Indian numbering format with Lakhs and Crores.
                Perfect for cheques, legal documents, contracts, and financial transactions where
                amounts must be written in words.
            </p>

            <h2>Indian Numbering System</h2>
            <p>
                The Indian numbering system differs from the Western system in its use of Lakhs (100,000)
                and Crores (10,000,000) instead of Millions and Billions. The comma placement also follows
                a unique pattern:
            </p>
            <ul>
                <li><strong>1,000:</strong> One Thousand</li>
                <li><strong>10,000:</strong> Ten Thousand</li>
                <li><strong>1,00,000:</strong> One Lakh</li>
                <li><strong>10,00,000:</strong> Ten Lakh</li>
                <li><strong>1,00,00,000:</strong> One Crore</li>
                <li><strong>10,00,00,000:</strong> Ten Crore</li>
            </ul>

            <h2>Usage in Official Documents</h2>
            <p>
                Writing amounts in words is mandatory in several scenarios:
            </p>
            <ul>
                <li><strong>Cheques:</strong> Both numeric and word formats are required</li>
                <li><strong>Demand Drafts:</strong> Legal requirement for banks</li>
                <li><strong>Contracts:</strong> Prevents ambiguity in agreements</li>
                <li><strong>Legal Notices:</strong> Court documents require amounts in words</li>
                <li><strong>Sale Deeds:</strong> Property transactions must include word format</li>
            </ul>

            <h2>Best Practices</h2>
            <ol>
                <li>Always start with "Rupees" for Indian currency</li>
                <li>End with "Only" to prevent additions</li>
                <li>Include paise when dealing with decimal amounts</li>
                <li>Cross-verify the numeric and word amounts</li>
                <li>Use proper capitalization for formal documents</li>
            </ol>
        </>
    );

    return (
        <ToolLayout
            title="Number to Words Converter"
            description="Convert numbers to words in Indian format (Lakhs, Crores). Perfect for cheques, legal documents, and contracts. Supports paise and large amounts."
            keywords={['number to words', 'Indian number format', 'cheque amount in words', 'lakh crore converter', 'rupees in words', 'amount to words']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Number Input */}
                <div className="input-section">
                    <label className="form-label">Enter Amount</label>
                    <div className="input-wrapper">
                        <span className="input-prefix">₹</span>
                        <input
                            type="text"
                            className="form-input number-input"
                            value={inputNumber}
                            onChange={(e) => {
                                // Allow numbers, commas, and one decimal point
                                const val = e.target.value.replace(/[^0-9,.-]/g, '');
                                setInputNumber(val);
                            }}
                            placeholder="e.g., 12,34,567 or 1234567.50"
                        />
                    </div>
                    {result && !result.error && (
                        <div className="formatted-number">
                            Formatted: ₹{result.formatted}
                        </div>
                    )}
                </div>

                {/* Options */}
                <div className="options-section">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={includeRupees}
                            onChange={(e) => setIncludeRupees(e.target.checked)}
                        />
                        <span>Include "Rupees" prefix</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={includeOnly}
                            onChange={(e) => setIncludeOnly(e.target.checked)}
                        />
                        <span>Include "Only" suffix</span>
                    </label>
                </div>

                {/* Result */}
                {result && (
                    <div className={`result-box ${result.error ? 'error' : ''}`}>
                        {result.error ? (
                            <div className="error-message">⚠️ {result.error}</div>
                        ) : (
                            <>
                                <div className="words-result">
                                    <span className="result-label">Amount in Words</span>
                                    <p className="result-words">{getFinalWords()}</p>
                                </div>
                                <ResultActions
                                    copyText={getCopyText()}
                                    shareTitle="Number to Words Result"
                                    shareText={`₹${result.formatted} = ${getFinalWords()}`}
                                    toolName="number-to-words"
                                />
                            </>
                        )}
                    </div>
                )}

                {/* Quick Examples */}
                <div className="examples-section">
                    <h4>Quick Examples</h4>
                    <div className="examples-grid">
                        {examples.map((ex, i) => (
                            <button
                                key={i}
                                className="example-btn"
                                onClick={() => setInputNumber(ex.value)}
                            >
                                {ex.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reference Table */}
                <div className="reference-section">
                    <h4>Indian Numbering Reference</h4>
                    <table className="reference-table">
                        <thead>
                            <tr>
                                <th>Number</th>
                                <th>Indian Format</th>
                                <th>In Words</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1,000</td>
                                <td>1,000</td>
                                <td>One Thousand</td>
                            </tr>
                            <tr>
                                <td>10,000</td>
                                <td>10,000</td>
                                <td>Ten Thousand</td>
                            </tr>
                            <tr>
                                <td>100,000</td>
                                <td>1,00,000</td>
                                <td>One Lakh</td>
                            </tr>
                            <tr>
                                <td>1,000,000</td>
                                <td>10,00,000</td>
                                <td>Ten Lakh</td>
                            </tr>
                            <tr>
                                <td>10,000,000</td>
                                <td>1,00,00,000</td>
                                <td>One Crore</td>
                            </tr>
                            <tr>
                                <td>100,000,000</td>
                                <td>10,00,00,000</td>
                                <td>Ten Crore</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
        .tool-form {
          max-width: 700px;
          margin: 0 auto;
        }

        .input-section {
          margin-bottom: var(--spacing-xl);
        }

        .input-wrapper {
          display: flex;
          align-items: stretch;
        }

        .input-prefix {
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-right: none;
          border-radius: var(--radius) 0 0 var(--radius);
          font-size: var(--text-xl);
          font-weight: 600;
          color: var(--text-muted);
        }

        .number-input {
          flex: 1;
          font-size: var(--text-xl);
          font-family: monospace;
          letter-spacing: 1px;
          border-radius: 0 var(--radius) var(--radius) 0 !important;
        }

        .formatted-number {
          margin-top: var(--spacing-sm);
          font-size: var(--text-sm);
          color: var(--text-muted);
          font-family: monospace;
        }

        .options-section {
          display: flex;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
          flex-wrap: wrap;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
          font-size: var(--text-base);
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .result-box {
          background: linear-gradient(135deg, rgba(72, 86, 150, 0.1), rgba(72, 86, 150, 0.05));
          border: 2px solid var(--yinmn-blue);
          padding: var(--spacing-xl);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
        }

        .result-box.error {
          background: rgba(239, 68, 68, 0.1);
          border-color: var(--error);
        }

        .error-message {
          color: var(--error);
          font-size: var(--text-lg);
        }

        .words-result {
          margin-bottom: var(--spacing-lg);
        }

        .result-label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-sm);
        }

        .result-words {
          font-size: var(--text-xl);
          font-weight: 500;
          color: var(--text-dark);
          line-height: 1.5;
          margin: 0;
          background: var(--bg-primary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          border-left: 4px solid var(--yinmn-blue);
        }

        .examples-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-xl);
        }

        .examples-section h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .examples-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: var(--spacing-sm);
        }

        .example-btn {
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-primary);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
          transition: all var(--transition);
          text-align: left;
          font-family: inherit;
        }

        .example-btn:hover {
          border-color: var(--yinmn-blue);
          background: rgba(72, 86, 150, 0.1);
        }

        .reference-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius);
        }

        .reference-section h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .reference-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm);
        }

        .reference-table th,
        .reference-table td {
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: left;
          border-bottom: 1px solid var(--platinum);
        }

        .reference-table th {
          background: var(--bg-tertiary);
          font-weight: 600;
        }

        .reference-table tr:last-child td {
          border-bottom: none;
        }

        .reference-table tr:hover td {
          background: rgba(72, 86, 150, 0.05);
        }

        @media (max-width: 480px) {
          .options-section {
            flex-direction: column;
            gap: var(--spacing-md);
          }

          .examples-grid {
            grid-template-columns: 1fr 1fr;
          }

          .result-words {
            font-size: var(--text-lg);
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default NumberToWords;
