import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { ResultActions } from './shared';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1000);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [result, setResult] = useState(null);

    // Expanded static rates (base: USD)
    const staticRates = {
        USD: 1,
        INR: 83.5,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 154.5,
        AUD: 1.53,
        CAD: 1.36,
        CHF: 0.88,
        CNY: 7.24,
        SGD: 1.34,
        AED: 3.67,
        SAR: 3.75,
        THB: 35.2,
        MYR: 4.72,
        HKD: 7.82,
        NZD: 1.64,
        KRW: 1380,
        ZAR: 18.9,
        SEK: 10.45,
        NOK: 10.82
    };

    const currencyInfo = {
        USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
        INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
        EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
        GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
        JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
        AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
        CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
        CHF: { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
        CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
        SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
        AED: { name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
        SAR: { name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
        THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
        MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
        HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
        NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
        KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
        ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
        SEK: { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
        NOK: { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' }
    };

    const currencies = Object.keys(staticRates);
    const relatedTools = toolsData.tools.filter(t => t.category === 'finance' && t.id !== 'currency-converter').slice(0, 3);

    // Popular pairs for quick access
    const popularPairs = [
        { from: 'USD', to: 'INR' },
        { from: 'EUR', to: 'INR' },
        { from: 'GBP', to: 'INR' },
        { from: 'AED', to: 'INR' },
        { from: 'USD', to: 'EUR' },
        { from: 'EUR', to: 'GBP' }
    ];

    // Real-time conversion
    useEffect(() => {
        if (amount > 0) {
            convert();
        }
    }, [amount, fromCurrency, toCurrency]);

    const convert = () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0) return;

        const fromRate = staticRates[fromCurrency];
        const toRate = staticRates[toCurrency];
        const converted = (amt / fromRate) * toRate;
        const rate = toRate / fromRate;
        const inverseRate = fromRate / toRate;

        setResult({
            from: amt.toFixed(2),
            to: converted.toFixed(2),
            rate: rate.toFixed(4),
            inverseRate: inverseRate.toFixed(4),
            fromCurrency,
            toCurrency
        });
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const selectPair = (from, to) => {
        setFromCurrency(from);
        setToCurrency(to);
    };

    // Generate copy text
    const getCopyText = () => {
        if (!result) return '';
        return `Currency Conversion
====================
${currencyInfo[result.fromCurrency].symbol}${parseFloat(result.from).toLocaleString()} ${result.fromCurrency} = ${currencyInfo[result.toCurrency].symbol}${parseFloat(result.to).toLocaleString()} ${result.toCurrency}

Exchange Rate: 1 ${result.fromCurrency} = ${result.rate} ${result.toCurrency}
Inverse Rate: 1 ${result.toCurrency} = ${result.inverseRate} ${result.fromCurrency}

Note: These are approximate rates for informational purposes.`;
    };

    const faqs = [
        { question: 'Are these live exchange rates?', answer: 'Currently using approximate static rates. In production, this would connect to a live exchange rate API for real-time rates.' },
        { question: 'What affects currency exchange rates?', answer: 'Interest rates, inflation, trade balances, political stability, and economic performance all influence exchange rates.' },
        { question: 'What is the best time to exchange currency?', answer: 'Currency markets are most active during overlapping trading hours. Watch for economic announcements that can cause rate fluctuations.' }
    ];

    const seoContent = (
        <>
            <h2>Currency Converter</h2>
            <p>Convert between world currencies quickly. Get approximate exchange rates for planning travel or international payments.</p>
            <h3>Understanding Exchange Rates</h3>
            <p>Exchange rates represent the value of one currency relative to another. They change constantly based on market conditions, economic indicators, and geopolitical events.</p>
        </>
    );

    return (
        <ToolLayout
            title="Currency Converter"
            description="Convert between world currencies with exchange rates."
            keywords={['currency converter', 'forex', 'exchange rate']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Popular Pairs */}
                <div className="popular-pairs">
                    <span className="pairs-label">Popular:</span>
                    {popularPairs.map((pair, idx) => (
                        <button
                            key={idx}
                            className={`pair-btn ${fromCurrency === pair.from && toCurrency === pair.to ? 'active' : ''}`}
                            onClick={() => selectPair(pair.from, pair.to)}
                        >
                            {currencyInfo[pair.from].flag} {pair.from} → {currencyInfo[pair.to].flag} {pair.to}
                        </button>
                    ))}
                </div>

                {/* Converter Card */}
                <div className="converter-card">
                    {/* From Currency */}
                    <div className="currency-input-group">
                        <label className="currency-label">From</label>
                        <div className="currency-row">
                            <input
                                type="number"
                                className="amount-input"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0"
                            />
                            <div className="currency-select-wrapper">
                                <span className="currency-flag">{currencyInfo[fromCurrency].flag}</span>
                                <select
                                    className="currency-select"
                                    value={fromCurrency}
                                    onChange={(e) => setFromCurrency(e.target.value)}
                                >
                                    {currencies.map(c => (
                                        <option key={c} value={c}>
                                            {c} - {currencyInfo[c].name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Swap Button */}
                    <button className="swap-btn" onClick={swapCurrencies} aria-label="Swap currencies">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                    </button>

                    {/* To Currency */}
                    <div className="currency-input-group">
                        <label className="currency-label">To</label>
                        <div className="currency-row">
                            <input
                                type="text"
                                className="amount-input result"
                                value={result ? parseFloat(result.to).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                readOnly
                            />
                            <div className="currency-select-wrapper">
                                <span className="currency-flag">{currencyInfo[toCurrency].flag}</span>
                                <select
                                    className="currency-select"
                                    value={toCurrency}
                                    onChange={(e) => setToCurrency(e.target.value)}
                                >
                                    {currencies.map(c => (
                                        <option key={c} value={c}>
                                            {c} - {currencyInfo[c].name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rate Info */}
                {result && (
                    <div className="result-box">
                        <div className="rate-display">
                            <div className="rate-card">
                                <span className="rate-label">Exchange Rate</span>
                                <span className="rate-value">
                                    1 {result.fromCurrency} = {result.rate} {result.toCurrency}
                                </span>
                            </div>
                            <div className="rate-card">
                                <span className="rate-label">Inverse Rate</span>
                                <span className="rate-value">
                                    1 {result.toCurrency} = {result.inverseRate} {result.fromCurrency}
                                </span>
                            </div>
                        </div>

                        <div className="conversion-summary">
                            <span className="summary-from">
                                {currencyInfo[result.fromCurrency].flag} {currencyInfo[result.fromCurrency].symbol}{parseFloat(result.from).toLocaleString()}
                            </span>
                            <span className="summary-arrow">=</span>
                            <span className="summary-to">
                                {currencyInfo[result.toCurrency].flag} {currencyInfo[result.toCurrency].symbol}{parseFloat(result.to).toLocaleString()}
                            </span>
                        </div>

                        <div className="rate-note">
                            ⚠️ Rates are approximate and for informational purposes only
                        </div>

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="Currency Conversion"
                            shareText={`${currencyInfo[result.fromCurrency].symbol}${parseFloat(result.from).toLocaleString()} ${result.fromCurrency} = ${currencyInfo[result.toCurrency].symbol}${parseFloat(result.to).toLocaleString()} ${result.toCurrency}`}
                            toolName="currency-converter"
                        />
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .popular-pairs {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .pairs-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
          font-weight: 500;
        }

        .pair-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--bg-secondary);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          font-size: var(--text-xs);
          cursor: pointer;
          transition: all var(--transition);
          font-family: inherit;
        }

        .pair-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .pair-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
          color: var(--yinmn-blue);
        }

        .converter-card {
          background: var(--bg-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
          position: relative;
        }

        .currency-input-group {
          margin-bottom: var(--spacing-lg);
        }

        .currency-input-group:last-of-type {
          margin-bottom: 0;
        }

        .currency-label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-sm);
          font-weight: 500;
        }

        .currency-row {
          display: flex;
          gap: var(--spacing-md);
        }

        .amount-input {
          flex: 2;
          padding: var(--spacing-md);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-size: var(--text-xl);
          font-weight: 700;
          font-family: inherit;
          background: var(--bg-primary);
        }

        .amount-input:focus {
          border-color: var(--yinmn-blue);
          outline: none;
        }

        .amount-input.result {
          background: rgba(72, 86, 150, 0.05);
          color: var(--yinmn-blue);
        }

        .currency-select-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-primary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
        }

        .currency-flag {
          font-size: 1.5rem;
        }

        .currency-select {
          flex: 1;
          border: none;
          background: transparent;
          font-size: var(--text-base);
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }

        .currency-select:focus {
          outline: none;
        }

        .swap-btn {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid var(--bg-secondary);
          background: var(--yinmn-blue);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition);
          z-index: 1;
        }

        .swap-btn:hover {
          transform: translate(-50%, -50%) rotate(180deg);
          background: var(--delft-blue);
        }

        .swap-btn svg {
          width: 24px;
          height: 24px;
        }

        .rate-display {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .rate-card {
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
          text-align: center;
        }

        .rate-label {
          display: block;
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-bottom: var(--spacing-xs);
        }

        .rate-value {
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text-dark);
        }

        .conversion-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--gradient-primary);
          border-radius: var(--radius);
          color: white;
          margin-bottom: var(--spacing-md);
        }

        .summary-from, .summary-to {
          font-size: var(--text-xl);
          font-weight: 700;
        }

        .summary-arrow {
          font-size: var(--text-2xl);
          opacity: 0.8;
        }

        .rate-note {
          text-align: center;
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .popular-pairs {
            justify-content: center;
          }

          .currency-row {
            flex-direction: column;
          }

          .swap-btn {
            position: relative;
            left: auto;
            top: auto;
            transform: none;
            margin: var(--spacing-md) auto;
          }

          .swap-btn:hover {
            transform: rotate(180deg);
          }

          .rate-display {
            grid-template-columns: 1fr;
          }

          .conversion-summary {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default CurrencyConverter;
