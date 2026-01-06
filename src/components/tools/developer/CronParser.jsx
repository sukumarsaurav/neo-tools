import { useState, useCallback, useMemo } from 'react';
import cronstrue from 'cronstrue';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const CronParser = () => {
    const [expression, setExpression] = useState('0 0 * * *');
    const [description, setDescription] = useState('');
    const [nextRuns, setNextRuns] = useState([]);
    const [error, setError] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'cron-parser').slice(0, 3);

    const presets = [
        { label: 'Every minute', value: '* * * * *' },
        { label: 'Every 5 minutes', value: '*/5 * * * *' },
        { label: 'Every 15 minutes', value: '*/15 * * * *' },
        { label: 'Every hour', value: '0 * * * *' },
        { label: 'Every 6 hours', value: '0 */6 * * *' },
        { label: 'Every day at midnight', value: '0 0 * * *' },
        { label: 'Every day at noon', value: '0 12 * * *' },
        { label: 'Every day at 9 AM', value: '0 9 * * *' },
        { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
        { label: 'Every weekday at 9 AM', value: '0 9 * * 1-5' },
        { label: 'Every weekend at 10 AM', value: '0 10 * * 0,6' },
        { label: 'Every 1st of month', value: '0 0 1 * *' },
        { label: 'Every quarter start', value: '0 0 1 1,4,7,10 *' },
        { label: 'Every year on Jan 1', value: '0 0 1 1 *' }
    ];

    const parseCron = useCallback(() => {
        if (!expression.trim()) {
            setError('Please enter a cron expression');
            return;
        }

        try {
            // Parse using cronstrue
            const humanReadable = cronstrue.toString(expression, {
                use24HourTimeFormat: false,
                verbose: true
            });

            setDescription(humanReadable);

            // Calculate next run times
            const runs = getNextRuns(expression, 10);
            setNextRuns(runs);
            setError('');
        } catch (err) {
            setError(`Invalid cron expression: ${err.message || 'Please check the syntax'}`);
            setDescription('');
            setNextRuns([]);
        }
    }, [expression]);

    // Calculate next N run times for a cron expression
    const getNextRuns = (cronExpr, count) => {
        const parts = cronExpr.trim().split(/\s+/);
        if (parts.length < 5) return [];

        const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
        const runs = [];
        let current = new Date();
        current.setSeconds(0);
        current.setMilliseconds(0);

        // Simple parser for common patterns
        const parseField = (field, min, max) => {
            if (field === '*') return Array.from({ length: max - min + 1 }, (_, i) => min + i);
            if (field.includes('/')) {
                const [, step] = field.split('/');
                return Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(v => v % parseInt(step) === 0);
            }
            if (field.includes('-')) {
                const [start, end] = field.split('-').map(Number);
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            }
            if (field.includes(',')) {
                return field.split(',').map(Number);
            }
            return [parseInt(field)];
        };

        const minutes = parseField(minute, 0, 59);
        const hours = parseField(hour, 0, 23);
        const daysOfMonth = parseField(dayOfMonth, 1, 31);
        const months = parseField(month, 1, 12);
        const daysOfWeek = parseField(dayOfWeek, 0, 6);

        const maxIterations = 366 * 24 * 60; // Maximum 1 year of minutes
        let iterations = 0;

        while (runs.length < count && iterations < maxIterations) {
            current = new Date(current.getTime() + 60000); // Add 1 minute
            iterations++;

            const m = current.getMinutes();
            const h = current.getHours();
            const dom = current.getDate();
            const mon = current.getMonth() + 1;
            const dow = current.getDay();

            if (
                minutes.includes(m) &&
                hours.includes(h) &&
                (dayOfMonth === '*' || daysOfMonth.includes(dom)) &&
                (month === '*' || months.includes(mon)) &&
                (dayOfWeek === '*' || daysOfWeek.includes(dow))
            ) {
                runs.push(new Date(current));
            }
        }

        return runs;
    };

    // Parse on expression change with debounce
    useMemo(() => {
        if (expression.trim()) {
            const timer = setTimeout(parseCron, 300);
            return () => clearTimeout(timer);
        }
    }, [expression, parseCron]);

    const applyPreset = (preset) => {
        setExpression(preset.value);
    };

    const copy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const formatDate = (date) => {
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeUntil = (date) => {
        const now = new Date();
        const diff = date - now;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `in ${days}d ${hours % 24}h`;
        if (hours > 0) return `in ${hours}h ${minutes % 60}m`;
        return `in ${minutes}m`;
    };

    const faqs = [
        { question: 'What is a cron expression?', answer: 'A cron expression is a string of 5 fields representing minute, hour, day of month, month, and day of week. It defines when a scheduled task should run.' },
        { question: 'What do the fields mean?', answer: 'The 5 fields are: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, Sunday=0). Use * for any value, */n for every n, and ranges like 1-5.' },
        { question: 'How do I schedule for weekdays only?', answer: 'Use 1-5 in the day of week field (Monday-Friday). For example: "0 9 * * 1-5" runs at 9 AM every weekday.' }
    ];

    const seoContent = (
        <>
            <h2>Cron Expression Parser & Generator</h2>
            <p>Parse cron expressions to human-readable descriptions and see upcoming execution times. Perfect for scheduling tasks in Linux, macOS, or any cron-compatible system.</p>
            <h3>Cron Syntax Reference</h3>
            <table className="cron-ref-table">
                <thead>
                    <tr><th>Field</th><th>Values</th><th>Special Characters</th></tr>
                </thead>
                <tbody>
                    <tr><td>Minute</td><td>0-59</td><td>* , - /</td></tr>
                    <tr><td>Hour</td><td>0-23</td><td>* , - /</td></tr>
                    <tr><td>Day of Month</td><td>1-31</td><td>* , - /</td></tr>
                    <tr><td>Month</td><td>1-12</td><td>* , - /</td></tr>
                    <tr><td>Day of Week</td><td>0-6 (Sun=0)</td><td>* , - /</td></tr>
                </tbody>
            </table>
        </>
    );

    return (
        <ToolLayout
            title="Cron Expression Parser"
            description="Parse cron expressions to human-readable format. View next scheduled run times and use common presets."
            keywords={['cron parser', 'cron expression', 'cron generator', 'crontab', 'schedule']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="expression-section">
                    <label className="form-label">Cron Expression</label>
                    <div className="expression-input-row">
                        <input
                            type="text"
                            className="form-input mono expression-input"
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                            placeholder="* * * * *"
                            spellCheck={false}
                        />
                        <button className="copy-btn" onClick={() => copy(expression)}>📋</button>
                    </div>
                    <div className="field-labels">
                        <span>Minute</span>
                        <span>Hour</span>
                        <span>Day (M)</span>
                        <span>Month</span>
                        <span>Day (W)</span>
                    </div>
                </div>

                {error && <div className="error-box">{error}</div>}

                {description && (
                    <div className="description-box">
                        <div className="description-icon">🕐</div>
                        <div className="description-text">{description}</div>
                    </div>
                )}

                {nextRuns.length > 0 && (
                    <div className="next-runs-section">
                        <h3 className="section-title">Next 10 Scheduled Runs</h3>
                        <div className="runs-list">
                            {nextRuns.map((run, idx) => (
                                <div key={idx} className="run-item">
                                    <span className="run-number">#{idx + 1}</span>
                                    <span className="run-date">{formatDate(run)}</span>
                                    <span className="run-relative">{getTimeUntil(run)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="presets-section">
                    <h3 className="section-title">Common Presets</h3>
                    <div className="presets-grid">
                        {presets.map((preset, idx) => (
                            <button
                                key={idx}
                                className={`preset-btn ${expression === preset.value ? 'active' : ''}`}
                                onClick={() => applyPreset(preset)}
                            >
                                <span className="preset-label">{preset.label}</span>
                                <code className="preset-value">{preset.value}</code>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="help-section">
                    <h3 className="section-title">Quick Reference</h3>
                    <div className="help-grid">
                        <div className="help-item">
                            <code>*</code>
                            <span>Any value</span>
                        </div>
                        <div className="help-item">
                            <code>*/n</code>
                            <span>Every n units</span>
                        </div>
                        <div className="help-item">
                            <code>1,3,5</code>
                            <span>Specific values</span>
                        </div>
                        <div className="help-item">
                            <code>1-5</code>
                            <span>Range of values</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .tool-form { max-width: 800px; margin: 0 auto; }
                .form-label { font-weight: 600; color: var(--jet); display: block; margin-bottom: var(--spacing-sm); }
                .expression-section { margin-bottom: var(--spacing-xl); }
                .expression-input-row { display: flex; gap: var(--spacing-sm); }
                .expression-input { flex: 1; font-size: var(--text-xl); text-align: center; letter-spacing: 0.15em; padding: var(--spacing-lg); border: 2px solid var(--platinum); border-radius: var(--radius); }
                .expression-input:focus { outline: none; border-color: var(--yinmn-blue); }
                .form-input.mono { font-family: var(--font-mono); }
                .field-labels { display: flex; justify-content: space-around; margin-top: var(--spacing-sm); padding: 0 var(--spacing-xl); }
                .field-labels span { font-size: var(--text-xs); color: var(--dim-gray); text-align: center; }
                .copy-btn { background: var(--yinmn-blue); color: white; border: none; padding: var(--spacing-md); border-radius: var(--radius); cursor: pointer; font-size: var(--text-lg); }
                .copy-btn:hover { background: var(--oxford-blue); }
                .error-box { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; padding: var(--spacing-md); border-radius: var(--radius); margin-bottom: var(--spacing-lg); border-left: 4px solid #ef4444; }
                .description-box { display: flex; align-items: center; gap: var(--spacing-md); background: linear-gradient(135deg, #ecfdf5, #d1fae5); padding: var(--spacing-lg); border-radius: var(--radius); margin-bottom: var(--spacing-xl); border-left: 4px solid #10b981; }
                .description-icon { font-size: var(--text-2xl); }
                .description-text { font-size: var(--text-lg); font-weight: 500; color: #065f46; }
                .section-title { font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--spacing-md); color: var(--jet); }
                .next-runs-section { margin-bottom: var(--spacing-xl); }
                .runs-list { display: flex; flex-direction: column; gap: var(--spacing-xs); }
                .run-item { display: flex; align-items: center; gap: var(--spacing-md); padding: var(--spacing-sm) var(--spacing-md); background: var(--ghost-white); border-radius: var(--radius); }
                .run-number { font-weight: 600; color: var(--yinmn-blue); min-width: 30px; }
                .run-date { flex: 1; font-family: var(--font-mono); font-size: var(--text-sm); }
                .run-relative { font-size: var(--text-sm); color: var(--dim-gray); min-width: 80px; text-align: right; }
                .presets-section { margin-bottom: var(--spacing-xl); }
                .presets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: var(--spacing-sm); }
                .preset-btn { display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-xs); padding: var(--spacing-sm) var(--spacing-md); background: var(--ghost-white); border: 2px solid var(--platinum); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; text-align: left; }
                .preset-btn:hover { border-color: var(--yinmn-blue); background: white; }
                .preset-btn.active { border-color: var(--yinmn-blue); background: linear-gradient(135deg, #eff6ff, #dbeafe); }
                .preset-label { font-size: var(--text-sm); font-weight: 500; }
                .preset-value { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--dim-gray); }
                .help-section { background: var(--ghost-white); padding: var(--spacing-lg); border-radius: var(--radius); }
                .help-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--spacing-md); }
                .help-item { display: flex; align-items: center; gap: var(--spacing-sm); }
                .help-item code { background: white; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--radius-sm); font-family: var(--font-mono); border: 1px solid var(--platinum); }
                .help-item span { font-size: var(--text-sm); color: var(--dim-gray); }
                .cron-ref-table { width: 100%; border-collapse: collapse; margin-top: var(--spacing-md); }
                .cron-ref-table th, .cron-ref-table td { padding: var(--spacing-sm); border: 1px solid var(--platinum); text-align: left; }
                .cron-ref-table th { background: var(--ghost-white); font-weight: 600; }
            `}</style>
        </ToolLayout>
    );
};

export default CronParser;
