import { useState, useEffect, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { ResultActions } from './shared';

// Indian National Holidays for 2024-2026
const INDIAN_HOLIDAYS = {
    '2024': [
        { date: '2024-01-26', name: 'Republic Day' },
        { date: '2024-03-08', name: 'Maha Shivaratri' },
        { date: '2024-03-25', name: 'Holi' },
        { date: '2024-03-29', name: 'Good Friday' },
        { date: '2024-04-11', name: 'Idul Fitr' },
        { date: '2024-04-17', name: 'Ram Navami' },
        { date: '2024-04-21', name: 'Mahavir Jayanti' },
        { date: '2024-05-23', name: 'Buddha Purnima' },
        { date: '2024-06-17', name: 'Eid ul-Adha' },
        { date: '2024-07-17', name: 'Muharram' },
        { date: '2024-08-15', name: 'Independence Day' },
        { date: '2024-08-26', name: 'Janmashtami' },
        { date: '2024-10-02', name: 'Gandhi Jayanti' },
        { date: '2024-10-12', name: 'Dussehra' },
        { date: '2024-11-01', name: 'Diwali' },
        { date: '2024-11-15', name: 'Guru Nanak Jayanti' },
        { date: '2024-12-25', name: 'Christmas' }
    ],
    '2025': [
        { date: '2025-01-26', name: 'Republic Day' },
        { date: '2025-02-26', name: 'Maha Shivaratri' },
        { date: '2025-03-14', name: 'Holi' },
        { date: '2025-03-30', name: 'Idul Fitr' },
        { date: '2025-04-06', name: 'Ram Navami' },
        { date: '2025-04-10', name: 'Mahavir Jayanti' },
        { date: '2025-04-18', name: 'Good Friday' },
        { date: '2025-05-12', name: 'Buddha Purnima' },
        { date: '2025-06-07', name: 'Eid ul-Adha' },
        { date: '2025-07-06', name: 'Muharram' },
        { date: '2025-08-15', name: 'Independence Day' },
        { date: '2025-08-16', name: 'Janmashtami' },
        { date: '2025-10-02', name: 'Gandhi Jayanti' },
        { date: '2025-10-02', name: 'Dussehra' },
        { date: '2025-10-20', name: 'Diwali' },
        { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
        { date: '2025-12-25', name: 'Christmas' }
    ],
    '2026': [
        { date: '2026-01-26', name: 'Republic Day' },
        { date: '2026-02-15', name: 'Maha Shivaratri' },
        { date: '2026-03-04', name: 'Holi' },
        { date: '2026-03-20', name: 'Idul Fitr' },
        { date: '2026-03-27', name: 'Ram Navami' },
        { date: '2026-03-31', name: 'Mahavir Jayanti' },
        { date: '2026-04-03', name: 'Good Friday' },
        { date: '2026-05-01', name: 'Buddha Purnima' },
        { date: '2026-05-27', name: 'Eid ul-Adha' },
        { date: '2026-06-26', name: 'Muharram' },
        { date: '2026-08-15', name: 'Independence Day' },
        { date: '2026-09-04', name: 'Janmashtami' },
        { date: '2026-10-02', name: 'Gandhi Jayanti' },
        { date: '2026-10-19', name: 'Dussehra' },
        { date: '2026-11-08', name: 'Diwali' },
        { date: '2026-11-24', name: 'Guru Nanak Jayanti' },
        { date: '2026-12-25', name: 'Christmas' }
    ]
};

const DAY_PRESETS = [7, 15, 30, 45, 60, 90, 180, 365];

const ComplianceDateCalculator = () => {
    const [mode, setMode] = useState('add'); // add or between
    const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [daysToAdd, setDaysToAdd] = useState(30);
    const [operation, setOperation] = useState('add'); // add or subtract
    const [excludeWeekends, setExcludeWeekends] = useState(false);
    const [excludeHolidays, setExcludeHolidays] = useState(false);
    const [customHolidays, setCustomHolidays] = useState([]);
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'compliance-date-calculator')
        .slice(0, 3);

    // Get all holidays as a Set for quick lookup
    const allHolidays = useMemo(() => {
        const holidays = new Set();
        Object.values(INDIAN_HOLIDAYS).forEach(yearHolidays => {
            yearHolidays.forEach(h => holidays.add(h.date));
        });
        customHolidays.forEach(h => holidays.add(h));
        return holidays;
    }, [customHolidays]);

    // Check if a date is a working day
    const isWorkingDay = (date) => {
        const d = new Date(date);
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = d.getDay();

        // Check weekends
        if (excludeWeekends && (dayOfWeek === 0 || dayOfWeek === 6)) {
            return false;
        }

        // Check holidays
        if (excludeHolidays && allHolidays.has(dateStr)) {
            return false;
        }

        return true;
    };

    // Calculate result on change
    useEffect(() => {
        if (mode === 'add') {
            calculateAddSubtract();
        } else {
            calculateDaysBetween();
        }
    }, [mode, startDate, endDate, daysToAdd, operation, excludeWeekends, excludeHolidays, customHolidays]);

    const calculateAddSubtract = () => {
        if (!startDate || !daysToAdd) {
            setResult(null);
            return;
        }

        const start = new Date(startDate);
        let currentDate = new Date(startDate);
        let daysCount = 0;
        const direction = operation === 'add' ? 1 : -1;

        // If not excluding anything, simple calculation
        if (!excludeWeekends && !excludeHolidays) {
            currentDate.setDate(currentDate.getDate() + (daysToAdd * direction));
        } else {
            // Count only working days
            while (daysCount < daysToAdd) {
                currentDate.setDate(currentDate.getDate() + direction);
                if (isWorkingDay(currentDate)) {
                    daysCount++;
                }
            }
        }

        // Calculate calendar days
        const calendarDays = Math.abs(Math.round((currentDate - start) / (1000 * 60 * 60 * 24)));

        // Count working days
        let workingDays = 0;
        let tempDate = new Date(start);
        const checkEnd = new Date(currentDate);
        while (tempDate <= checkEnd) {
            if (isWorkingDay(tempDate)) {
                workingDays++;
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }

        // Days remaining from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysFromToday = Math.ceil((currentDate - today) / (1000 * 60 * 60 * 24));

        setResult({
            mode: 'add',
            startDate,
            resultDate: currentDate.toISOString().split('T')[0],
            dayOfWeek: currentDate.toLocaleDateString('en-IN', { weekday: 'long' }),
            calendarDays,
            workingDays,
            daysFromToday,
            isPast: currentDate < today,
            operation
        });
    };

    const calculateDaysBetween = () => {
        if (!startDate || !endDate) {
            setResult(null);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            setResult({ error: 'End date must be after start date' });
            return;
        }

        const calendarDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Count working days
        let workingDays = 0;
        let weekendDays = 0;
        let holidayDays = 0;
        let tempDate = new Date(start);

        while (tempDate <= end) {
            const dateStr = tempDate.toISOString().split('T')[0];
            const dayOfWeek = tempDate.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendDays++;
            } else if (allHolidays.has(dateStr)) {
                holidayDays++;
            } else {
                workingDays++;
            }

            tempDate.setDate(tempDate.getDate() + 1);
        }

        setResult({
            mode: 'between',
            startDate,
            endDate,
            calendarDays,
            workingDays,
            weekendDays,
            holidayDays,
            weeks: Math.floor(calendarDays / 7),
            months: Math.floor(calendarDays / 30)
        });
    };

    // Add custom holiday
    const addCustomHoliday = (date) => {
        if (date && !customHolidays.includes(date)) {
            setCustomHolidays([...customHolidays, date]);
        }
    };

    // Remove custom holiday
    const removeCustomHoliday = (date) => {
        setCustomHolidays(customHolidays.filter(h => h !== date));
    };

    const getCopyText = () => {
        if (!result || result.error) return '';

        if (result.mode === 'add') {
            return `Date Calculation Result
========================
Start Date: ${result.startDate}
${result.operation === 'add' ? 'Add' : 'Subtract'} ${daysToAdd} ${excludeWeekends || excludeHolidays ? 'working' : 'calendar'} days
Result Date: ${result.resultDate} (${result.dayOfWeek})
Calendar Days: ${result.calendarDays}
Working Days: ${result.workingDays}`;
        } else {
            return `Days Between Calculation
========================
Start Date: ${result.startDate}
End Date: ${result.endDate}
Calendar Days: ${result.calendarDays}
Working Days: ${result.workingDays}
Weekend Days: ${result.weekendDays}
Holiday Days: ${result.holidayDays}`;
        }
    };

    const faqs = [
        {
            question: 'What compliance deadlines can I calculate?',
            answer: 'Common deadlines include GST return filing (GSTR-1, GSTR-3B), TDS payment (7th of following month), ITR filing, ROC filing, PF/ESI payments, and various statutory compliance dates.'
        },
        {
            question: 'Which holidays are included?',
            answer: 'The calculator includes major Indian national holidays and bank holidays for 2024-2026. You can also add custom holidays for regional or company-specific holidays.'
        },
        {
            question: 'How does working days calculation help in compliance?',
            answer: 'Many statutory deadlines are counted in "clear days" or "working days". This calculator helps you identify the actual deadline when weekends and holidays are excluded.'
        },
        {
            question: 'What are common compliance day counts?',
            answer: '15 days: GST payment, 30 days: Appeal period, 45 days: Input credit reconciliation, 60 days: Reply to notices, 90 days: Various statutory filings.'
        }
    ];

    const seoContent = (
        <>
            <h2>Compliance Date Calculator</h2>
            <p>
                Calculate compliance deadlines accurately by adding or subtracting days from any date.
                Optionally exclude weekends and Indian national holidays to find the actual working day deadline.
            </p>

            <h2>Key Features</h2>
            <ul>
                <li>Add or subtract days from any date</li>
                <li>Calculate days between two dates</li>
                <li>Exclude weekends (Saturday/Sunday)</li>
                <li>Exclude Indian national holidays (2024-2026)</li>
                <li>Add custom holidays for regional observances</li>
                <li>Quick presets for common deadline periods</li>
            </ul>

            <h2>Common Compliance Deadlines</h2>
            <ul>
                <li><strong>7 days:</strong> TDS payment (from end of month)</li>
                <li><strong>15 days:</strong> Advance tax installments, GST payment</li>
                <li><strong>30 days:</strong> Appeal against assessment orders</li>
                <li><strong>45 days:</strong> ITC reconciliation deadline</li>
                <li><strong>60 days:</strong> Reply to show cause notices</li>
                <li><strong>90 days:</strong> Various statutory filings</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Compliance Date Calculator"
            description="Calculate compliance deadlines by adding/subtracting days. Exclude weekends and Indian holidays to find accurate working day deadlines."
            keywords={['date calculator', 'compliance deadline', 'working days calculator', 'business days', 'GST due date', 'statutory deadline']}
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
                        className={`mode-btn ${mode === 'add' ? 'active' : ''}`}
                        onClick={() => setMode('add')}
                    >
                        ➕ Add/Subtract Days
                    </button>
                    <button
                        className={`mode-btn ${mode === 'between' ? 'active' : ''}`}
                        onClick={() => setMode('between')}
                    >
                        📅 Days Between Dates
                    </button>
                </div>

                {/* Add/Subtract Mode */}
                {mode === 'add' && (
                    <div className="calc-section">
                        <div className="input-row">
                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Operation</label>
                                <div className="operation-toggle">
                                    <button
                                        className={`op-btn ${operation === 'add' ? 'active' : ''}`}
                                        onClick={() => setOperation('add')}
                                    >
                                        + Add
                                    </button>
                                    <button
                                        className={`op-btn ${operation === 'subtract' ? 'active' : ''}`}
                                        onClick={() => setOperation('subtract')}
                                    >
                                        − Subtract
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Number of Days</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={daysToAdd}
                                    onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
                                    min="1"
                                />
                            </div>
                        </div>

                        {/* Presets */}
                        <div className="presets">
                            <label className="form-label">Quick Presets</label>
                            <div className="preset-buttons">
                                {DAY_PRESETS.map(days => (
                                    <button
                                        key={days}
                                        className={`preset-btn ${daysToAdd === days ? 'active' : ''}`}
                                        onClick={() => setDaysToAdd(days)}
                                    >
                                        {days} days
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Days Between Mode */}
                {mode === 'between' && (
                    <div className="calc-section">
                        <div className="input-row">
                            <div className="form-group">
                                <label className="form-label">Start Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">End Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Exclusion Options */}
                <div className="options-section">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={excludeWeekends}
                            onChange={(e) => setExcludeWeekends(e.target.checked)}
                        />
                        <span>Exclude Weekends (Saturday & Sunday)</span>
                    </label>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={excludeHolidays}
                            onChange={(e) => setExcludeHolidays(e.target.checked)}
                        />
                        <span>Exclude Indian National Holidays</span>
                    </label>
                </div>

                {/* Custom Holidays */}
                <div className="custom-holidays">
                    <label className="form-label">Custom Holidays</label>
                    <div className="holiday-input-row">
                        <input
                            type="date"
                            className="form-input"
                            id="customHolidayInput"
                        />
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                const input = document.getElementById('customHolidayInput');
                                addCustomHoliday(input.value);
                                input.value = '';
                            }}
                        >
                            + Add
                        </button>
                    </div>
                    {customHolidays.length > 0 && (
                        <div className="custom-holiday-list">
                            {customHolidays.map(date => (
                                <span key={date} className="holiday-tag">
                                    {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    <button onClick={() => removeCustomHoliday(date)}>✕</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Results */}
                {result && !result.error && (
                    <div className="result-box">
                        {result.mode === 'add' ? (
                            <>
                                <div className="result-main">
                                    <div className="result-date">
                                        <span className="date-label">Result Date</span>
                                        <span className="date-value">
                                            {new Date(result.resultDate).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    {!result.isPast && result.daysFromToday > 0 && (
                                        <div className="countdown">
                                            ⏰ {result.daysFromToday} days from today
                                        </div>
                                    )}
                                    {result.isPast && (
                                        <div className="countdown past">
                                            ⚠️ This date has already passed
                                        </div>
                                    )}
                                </div>
                                <div className="result-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Calendar Days</span>
                                        <span className="detail-value">{result.calendarDays}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Working Days</span>
                                        <span className="detail-value">{result.workingDays}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="result-main between">
                                    <div className="between-summary">
                                        <span className="big-number">{result.calendarDays}</span>
                                        <span className="big-label">Calendar Days</span>
                                    </div>
                                </div>
                                <div className="result-details four-col">
                                    <div className="detail-item">
                                        <span className="detail-label">Working Days</span>
                                        <span className="detail-value">{result.workingDays}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Weekend Days</span>
                                        <span className="detail-value">{result.weekendDays}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Holiday Days</span>
                                        <span className="detail-value">{result.holidayDays}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Weeks</span>
                                        <span className="detail-value">{result.weeks}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <ResultActions
                            copyText={getCopyText()}
                            shareTitle="Date Calculation Result"
                            shareText={result.mode === 'add'
                                ? `${daysToAdd} days from ${startDate} = ${result.resultDate}`
                                : `${result.calendarDays} days between ${startDate} and ${endDate}`
                            }
                            toolName="compliance-date-calculator"
                        />
                    </div>
                )}

                {result && result.error && (
                    <div className="error-box">⚠️ {result.error}</div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 700px;
          margin: 0 auto;
        }

        .mode-toggle {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
        }

        .mode-btn {
          flex: 1;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-family: inherit;
          font-size: var(--text-base);
          transition: all var(--transition);
        }

        .mode-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .mode-btn.active {
          background: rgba(72, 86, 150, 0.1);
          border-color: var(--yinmn-blue);
          color: var(--yinmn-blue);
        }

        .calc-section {
          margin-bottom: var(--spacing-xl);
        }

        .input-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .operation-toggle {
          display: flex;
          gap: var(--spacing-xs);
        }

        .op-btn {
          flex: 1;
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border: 1px solid var(--platinum);
          cursor: pointer;
          font-family: inherit;
          transition: all var(--transition);
        }

        .op-btn:first-child {
          border-radius: var(--radius) 0 0 var(--radius);
        }

        .op-btn:last-child {
          border-radius: 0 var(--radius) var(--radius) 0;
        }

        .op-btn.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }

        .presets {
          margin-top: var(--spacing-md);
        }

        .preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }

        .preset-btn {
          padding: var(--spacing-xs) var(--spacing-md);
          background: var(--bg-secondary);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
          transition: all var(--transition);
          font-family: inherit;
        }

        .preset-btn:hover {
          border-color: var(--yinmn-blue);
        }

        .preset-btn.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }

        .options-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
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
        }

        .custom-holidays {
          margin-bottom: var(--spacing-xl);
        }

        .holiday-input-row {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .holiday-input-row .form-input {
          flex: 1;
        }

        .custom-holiday-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }

        .holiday-tag {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          background: rgba(72, 86, 150, 0.1);
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
        }

        .holiday-tag button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--error);
          padding: 0;
          font-size: var(--text-xs);
        }

        .result-main {
          text-align: center;
          margin-bottom: var(--spacing-lg);
          padding: var(--spacing-xl);
          background: var(--gradient-primary);
          border-radius: var(--radius);
          color: white;
        }

        .result-date .date-label {
          display: block;
          font-size: var(--text-sm);
          opacity: 0.9;
        }

        .result-date .date-value {
          display: block;
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-top: var(--spacing-sm);
        }

        .countdown {
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm);
          background: rgba(255,255,255,0.2);
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
        }

        .countdown.past {
          background: rgba(239, 68, 68, 0.3);
        }

        .result-main.between {
          display: flex;
          justify-content: center;
        }

        .between-summary {
          text-align: center;
        }

        .big-number {
          display: block;
          font-size: 4rem;
          font-weight: 700;
        }

        .big-label {
          display: block;
          font-size: var(--text-sm);
          opacity: 0.9;
        }

        .result-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .result-details.four-col {
          grid-template-columns: repeat(4, 1fr);
        }

        .detail-item {
          text-align: center;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
        }

        .detail-label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .detail-value {
          display: block;
          font-size: var(--text-xl);
          font-weight: 600;
          color: var(--text-dark);
        }

        .error-box {
          padding: var(--spacing-md);
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid var(--error);
          border-radius: var(--radius);
          color: var(--error);
          text-align: center;
        }

        @media (max-width: 600px) {
          .input-row {
            grid-template-columns: 1fr;
          }

          .mode-toggle {
            flex-direction: column;
          }

          .result-details.four-col {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ComplianceDateCalculator;
