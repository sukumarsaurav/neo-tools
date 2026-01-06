import { useState, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const DateCalculator = () => {
    const [mode, setMode] = useState('difference');

    // Difference mode state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Add/Subtract mode state
    const [baseDate, setBaseDate] = useState('');
    const [operation, setOperation] = useState('add');
    const [amount, setAmount] = useState({ days: 0, weeks: 0, months: 0, years: 0 });

    // Options
    const [excludeWeekends, setExcludeWeekends] = useState(false);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'date-calculator').slice(0, 3);

    const difference = useMemo(() => {
        if (!startDate || !endDate) return null;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

        let diffTime = end - start;
        const isNegative = diffTime < 0;
        diffTime = Math.abs(diffTime);

        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Calculate business days if needed
        let businessDays = 0;
        if (excludeWeekends) {
            const current = new Date(Math.min(start, end));
            const endCheck = new Date(Math.max(start, end));
            while (current < endCheck) {
                const day = current.getDay();
                if (day !== 0 && day !== 6) businessDays++;
                current.setDate(current.getDate() + 1);
            }
        }

        // Break down into years, months, weeks, days
        const years = Math.floor(totalDays / 365);
        const remainingAfterYears = totalDays % 365;
        const months = Math.floor(remainingAfterYears / 30);
        const remainingAfterMonths = remainingAfterYears % 30;
        const weeks = Math.floor(remainingAfterMonths / 7);
        const days = remainingAfterMonths % 7;

        return {
            isNegative,
            totalDays,
            businessDays: excludeWeekends ? businessDays : null,
            breakdown: { years, months, weeks, days },
            totalWeeks: Math.floor(totalDays / 7),
            totalMonths: Math.floor(totalDays / 30),
            totalHours: totalDays * 24,
            totalMinutes: totalDays * 24 * 60
        };
    }, [startDate, endDate, excludeWeekends]);

    const calculatedDate = useMemo(() => {
        if (!baseDate) return null;

        const base = new Date(baseDate);
        if (isNaN(base.getTime())) return null;

        const multiplier = operation === 'add' ? 1 : -1;

        // Add/subtract in order
        base.setFullYear(base.getFullYear() + (amount.years * multiplier));
        base.setMonth(base.getMonth() + (amount.months * multiplier));

        const totalDays = (amount.weeks * 7 + amount.days) * multiplier;

        if (excludeWeekends) {
            let daysToAdd = Math.abs(totalDays);
            const direction = totalDays >= 0 ? 1 : -1;
            while (daysToAdd > 0) {
                base.setDate(base.getDate() + direction);
                const day = base.getDay();
                if (day !== 0 && day !== 6) daysToAdd--;
            }
        } else {
            base.setDate(base.getDate() + totalDays);
        }

        return base;
    }, [baseDate, operation, amount, excludeWeekends]);

    const setToday = (setter) => {
        setter(new Date().toISOString().split('T')[0]);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const faqs = [
        { question: 'How are business days calculated?', answer: 'Business days exclude Saturdays and Sundays. Holidays are not excluded in this calculator.' },
        { question: 'Does it account for leap years?', answer: 'Yes, the calculator uses JavaScript\'s native Date object which correctly handles leap years.' },
        { question: 'What\'s the maximum date range?', answer: 'You can calculate differences between any dates supported by JavaScript (years 0 to 275760 AD).' }
    ];

    const seoContent = (
        <>
            <h2>Date Difference Calculator</h2>
            <p>Calculate the difference between two dates in days, weeks, months, and years. Add or subtract time from any date with business day support.</p>
        </>
    );

    return (
        <ToolLayout
            title="Date Difference Calculator"
            description="Calculate days between dates or add/subtract time. Business day support included."
            keywords={['date calculator', 'days between dates', 'date difference', 'business days', 'add days']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="mode-selector">
                    <button
                        className={`mode-btn ${mode === 'difference' ? 'active' : ''}`}
                        onClick={() => setMode('difference')}
                    >
                        📅 Date Difference
                    </button>
                    <button
                        className={`mode-btn ${mode === 'calculate' ? 'active' : ''}`}
                        onClick={() => setMode('calculate')}
                    >
                        ➕ Add/Subtract
                    </button>
                </div>

                <div className="options-bar">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={excludeWeekends}
                            onChange={(e) => setExcludeWeekends(e.target.checked)}
                        />
                        Exclude weekends (business days only)
                    </label>
                </div>

                {mode === 'difference' ? (
                    <div className="difference-section">
                        <div className="date-inputs">
                            <div className="date-field">
                                <label>Start Date</label>
                                <div className="input-row">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <button className="today-btn" onClick={() => setToday(setStartDate)}>Today</button>
                                </div>
                            </div>
                            <div className="arrow">→</div>
                            <div className="date-field">
                                <label>End Date</label>
                                <div className="input-row">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <button className="today-btn" onClick={() => setToday(setEndDate)}>Today</button>
                                </div>
                            </div>
                        </div>

                        {difference && (
                            <div className="results">
                                <div className="main-result">
                                    <span className="big-number">{difference.isNegative ? '-' : ''}{difference.totalDays}</span>
                                    <span className="label">days</span>
                                </div>

                                {difference.businessDays !== null && (
                                    <div className="sub-result">
                                        <span className="number">{difference.businessDays}</span>
                                        <span className="label">business days</span>
                                    </div>
                                )}

                                <div className="breakdown">
                                    <h4>Breakdown</h4>
                                    <div className="breakdown-grid">
                                        {difference.breakdown.years > 0 && (
                                            <div className="breakdown-item">{difference.breakdown.years}y</div>
                                        )}
                                        {difference.breakdown.months > 0 && (
                                            <div className="breakdown-item">{difference.breakdown.months}mo</div>
                                        )}
                                        {difference.breakdown.weeks > 0 && (
                                            <div className="breakdown-item">{difference.breakdown.weeks}w</div>
                                        )}
                                        <div className="breakdown-item">{difference.breakdown.days}d</div>
                                    </div>
                                </div>

                                <div className="alternative-units">
                                    <div className="unit">{difference.totalWeeks.toLocaleString()} weeks</div>
                                    <div className="unit">{difference.totalHours.toLocaleString()} hours</div>
                                    <div className="unit">{difference.totalMinutes.toLocaleString()} minutes</div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="calculate-section">
                        <div className="base-date-field">
                            <label>Start From</label>
                            <div className="input-row">
                                <input
                                    type="date"
                                    value={baseDate}
                                    onChange={(e) => setBaseDate(e.target.value)}
                                />
                                <button className="today-btn" onClick={() => setToday(setBaseDate)}>Today</button>
                            </div>
                        </div>

                        <div className="operation-selector">
                            <button
                                className={`op-btn ${operation === 'add' ? 'active' : ''}`}
                                onClick={() => setOperation('add')}
                            >
                                ➕ Add
                            </button>
                            <button
                                className={`op-btn ${operation === 'subtract' ? 'active' : ''}`}
                                onClick={() => setOperation('subtract')}
                            >
                                ➖ Subtract
                            </button>
                        </div>

                        <div className="amount-inputs">
                            <div className="amount-field">
                                <input
                                    type="number"
                                    min="0"
                                    value={amount.years}
                                    onChange={(e) => setAmount({ ...amount, years: parseInt(e.target.value) || 0 })}
                                />
                                <label>Years</label>
                            </div>
                            <div className="amount-field">
                                <input
                                    type="number"
                                    min="0"
                                    value={amount.months}
                                    onChange={(e) => setAmount({ ...amount, months: parseInt(e.target.value) || 0 })}
                                />
                                <label>Months</label>
                            </div>
                            <div className="amount-field">
                                <input
                                    type="number"
                                    min="0"
                                    value={amount.weeks}
                                    onChange={(e) => setAmount({ ...amount, weeks: parseInt(e.target.value) || 0 })}
                                />
                                <label>Weeks</label>
                            </div>
                            <div className="amount-field">
                                <input
                                    type="number"
                                    min="0"
                                    value={amount.days}
                                    onChange={(e) => setAmount({ ...amount, days: parseInt(e.target.value) || 0 })}
                                />
                                <label>Days</label>
                            </div>
                        </div>

                        {calculatedDate && (
                            <div className="result-date">
                                <div className="result-label">Result</div>
                                <div className="result-value">{formatDate(calculatedDate)}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .tool-form { max-width: 700px; margin: 0 auto; }
                .mode-selector { display: flex; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg); background: var(--ghost-white); padding: var(--spacing-sm); border-radius: var(--radius); }
                .mode-btn { flex: 1; padding: var(--spacing-md); border: 2px solid transparent; background: transparent; border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; }
                .mode-btn:hover { background: white; }
                .mode-btn.active { background: white; border-color: var(--yinmn-blue); color: var(--yinmn-blue); }
                .options-bar { display: flex; justify-content: center; margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: var(--ghost-white); border-radius: var(--radius); }
                .checkbox-label { display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; font-size: var(--text-sm); }
                .checkbox-label input { width: 18px; height: 18px; accent-color: var(--yinmn-blue); }
                .date-inputs { display: flex; align-items: center; gap: var(--spacing-lg); justify-content: center; flex-wrap: wrap; margin-bottom: var(--spacing-xl); }
                .date-field { display: flex; flex-direction: column; gap: var(--spacing-xs); }
                .date-field label { font-weight: 600; font-size: var(--text-sm); color: var(--dim-gray); }
                .input-row { display: flex; gap: var(--spacing-sm); }
                .input-row input[type="date"] { padding: var(--spacing-sm) var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-base); }
                .input-row input:focus { outline: none; border-color: var(--yinmn-blue); }
                .today-btn { padding: var(--spacing-xs) var(--spacing-sm); background: var(--ghost-white); border: 2px solid var(--platinum); border-radius: var(--radius); cursor: pointer; font-size: var(--text-sm); }
                .today-btn:hover { border-color: var(--yinmn-blue); }
                .arrow { font-size: var(--text-2xl); color: var(--dim-gray); }
                .results { text-align: center; }
                .main-result { margin-bottom: var(--spacing-lg); }
                .main-result .big-number { font-size: 4rem; font-weight: 700; color: var(--yinmn-blue); }
                .main-result .label { font-size: var(--text-xl); color: var(--dim-gray); margin-left: var(--spacing-sm); }
                .sub-result { margin-bottom: var(--spacing-lg); }
                .sub-result .number { font-size: var(--text-2xl); font-weight: 600; color: var(--success); }
                .sub-result .label { color: var(--dim-gray); margin-left: var(--spacing-sm); }
                .breakdown { margin-bottom: var(--spacing-lg); }
                .breakdown h4 { margin-bottom: var(--spacing-sm); color: var(--dim-gray); }
                .breakdown-grid { display: flex; gap: var(--spacing-md); justify-content: center; }
                .breakdown-item { background: var(--ghost-white); padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius); font-weight: 600; }
                .alternative-units { display: flex; gap: var(--spacing-md); justify-content: center; flex-wrap: wrap; color: var(--dim-gray); font-size: var(--text-sm); }
                .unit { background: var(--ghost-white); padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius); }
                .base-date-field { text-align: center; margin-bottom: var(--spacing-lg); }
                .base-date-field label { display: block; font-weight: 600; margin-bottom: var(--spacing-sm); }
                .base-date-field .input-row { justify-content: center; }
                .operation-selector { display: flex; gap: var(--spacing-sm); justify-content: center; margin-bottom: var(--spacing-lg); }
                .op-btn { padding: var(--spacing-sm) var(--spacing-xl); border: 2px solid var(--platinum); background: var(--ghost-white); border-radius: var(--radius); cursor: pointer; font-weight: 600; transition: all 0.2s; }
                .op-btn:hover { border-color: var(--yinmn-blue); }
                .op-btn.active { background: var(--yinmn-blue); color: white; border-color: var(--yinmn-blue); }
                .amount-inputs { display: flex; gap: var(--spacing-md); justify-content: center; margin-bottom: var(--spacing-xl); flex-wrap: wrap; }
                .amount-field { display: flex; flex-direction: column; align-items: center; }
                .amount-field input { width: 70px; padding: var(--spacing-sm); text-align: center; border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-lg); }
                .amount-field input:focus { outline: none; border-color: var(--yinmn-blue); }
                .amount-field label { font-size: var(--text-sm); color: var(--dim-gray); margin-top: var(--spacing-xs); }
                .result-date { text-align: center; padding: var(--spacing-xl); background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-radius: var(--radius); border-left: 4px solid #10b981; }
                .result-label { font-size: var(--text-sm); color: #065f46; margin-bottom: var(--spacing-sm); }
                .result-value { font-size: var(--text-xl); font-weight: 600; color: #065f46; }
                @media (max-width: 480px) { .main-result .big-number { font-size: 2.5rem; } .arrow { display: none; } }
            `}</style>
        </ToolLayout>
    );
};

export default DateCalculator;
