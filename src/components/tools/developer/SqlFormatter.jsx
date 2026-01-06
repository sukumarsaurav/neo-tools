import { useState, useCallback } from 'react';
import { format } from 'sql-formatter';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const SqlFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [options, setOptions] = useState({
        language: 'sql',
        tabWidth: 2,
        uppercase: true,
        linesBetweenQueries: 2
    });

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'sql-formatter').slice(0, 3);

    const dialects = [
        { value: 'sql', label: 'Standard SQL' },
        { value: 'mysql', label: 'MySQL' },
        { value: 'postgresql', label: 'PostgreSQL' },
        { value: 'mariadb', label: 'MariaDB' },
        { value: 'sqlite', label: 'SQLite' },
        { value: 'bigquery', label: 'BigQuery' },
        { value: 'plsql', label: 'PL/SQL (Oracle)' },
        { value: 'transactsql', label: 'T-SQL (SQL Server)' },
        { value: 'redshift', label: 'Amazon Redshift' },
        { value: 'spark', label: 'Spark SQL' }
    ];

    const formatSQL = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter SQL code');
            return;
        }

        try {
            const formatted = format(input, {
                language: options.language,
                tabWidth: options.tabWidth,
                keywordCase: options.uppercase ? 'upper' : 'lower',
                linesBetweenQueries: options.linesBetweenQueries,
                indentStyle: 'standard'
            });

            setOutput(formatted);
            setError('');
        } catch (err) {
            setError(`Formatting error: ${err.message}`);
            setOutput('');
        }
    }, [input, options]);

    const minify = useCallback(() => {
        if (!input.trim()) {
            setError('Please enter SQL code');
            return;
        }

        try {
            const minified = input
                .replace(/--[^\n]*/g, '') // Remove single-line comments
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/\s*,\s*/g, ',') // Remove space around commas
                .replace(/\s*\(\s*/g, '(') // Remove space around (
                .replace(/\s*\)\s*/g, ')') // Remove space around )
                .trim();

            setOutput(minified);
            setError('');
        } catch (err) {
            setError(`Minification error: ${err.message}`);
        }
    }, [input]);

    const copy = () => {
        navigator.clipboard.writeText(output);
        const btn = document.querySelector('.sql-copy-btn');
        if (btn) {
            btn.textContent = '✓ Copied';
            setTimeout(() => btn.textContent = '📋 Copy', 1500);
        }
    };

    const clear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    const loadSample = () => {
        setInput(`select u.id, u.name, u.email, count(o.id) as order_count, sum(o.total) as total_spent from users u left join orders o on u.id = o.user_id where u.created_at >= '2024-01-01' and u.status = 'active' group by u.id, u.name, u.email having count(o.id) > 0 order by total_spent desc limit 100;

insert into products (name, price, category_id, created_at) values ('Widget Pro', 29.99, 5, now()), ('Gadget Plus', 49.99, 3, now());

update inventory set quantity = quantity - 1, last_updated = now() where product_id = 123 and quantity > 0;

delete from sessions where last_activity < date_sub(now(), interval 30 day);`);
        setOutput('');
        setError('');
    };

    const faqs = [
        { question: 'What SQL dialects are supported?', answer: 'We support Standard SQL, MySQL, PostgreSQL, SQLite, Oracle PL/SQL, SQL Server T-SQL, BigQuery, Redshift, and Spark SQL.' },
        { question: 'Does formatting change my queries?', answer: 'No, formatting only changes whitespace and keyword casing. Your query logic remains exactly the same.' },
        { question: 'Can I format multiple queries at once?', answer: 'Yes! Separate your queries with semicolons and they will all be formatted with proper spacing between them.' }
    ];

    const seoContent = (
        <>
            <h2>SQL Formatter & Beautifier</h2>
            <p>Format and beautify SQL queries for better readability. Supports multiple SQL dialects including MySQL, PostgreSQL, Oracle, and SQL Server.</p>
            <h3>Features</h3>
            <ul>
                <li><strong>Multiple Dialects:</strong> Support for 10+ SQL database flavors</li>
                <li><strong>Keyword Case:</strong> Automatic uppercase or lowercase keywords</li>
                <li><strong>Customizable Indentation:</strong> Choose your preferred tab width</li>
                <li><strong>Smart Formatting:</strong> Intelligent line breaks and alignment</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="SQL Formatter & Beautifier"
            description="Format and beautify SQL queries. Support for MySQL, PostgreSQL, Oracle, SQL Server and more."
            keywords={['SQL formatter', 'format SQL', 'SQL beautifier', 'SQL pretty print', 'MySQL formatter']}
            category="developer"
            categoryName="Developer & Utility"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="form-group">
                    <div className="label-row">
                        <label className="form-label">Input SQL</label>
                        <button className="link-btn" onClick={loadSample}>Load Sample</button>
                    </div>
                    <textarea
                        className="form-input mono"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={10}
                        placeholder="Paste your SQL query here..."
                        spellCheck={false}
                    />
                </div>

                <div className="options-row">
                    <div className="option-group">
                        <label className="option-label">SQL Dialect</label>
                        <select
                            className="form-select"
                            value={options.language}
                            onChange={(e) => setOptions({ ...options, language: e.target.value })}
                        >
                            {dialects.map(d => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="option-group">
                        <label className="option-label">Tab Width</label>
                        <select
                            className="form-select"
                            value={options.tabWidth}
                            onChange={(e) => setOptions({ ...options, tabWidth: parseInt(e.target.value) })}
                        >
                            <option value={2}>2 spaces</option>
                            <option value={4}>4 spaces</option>
                        </select>
                    </div>
                    <div className="option-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={options.uppercase}
                                onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                            />
                            UPPERCASE Keywords
                        </label>
                    </div>
                </div>

                <div className="btn-group">
                    <button className="btn btn-primary" onClick={formatSQL}>✨ Format SQL</button>
                    <button className="btn btn-secondary" onClick={minify}>🗜️ Minify</button>
                    <button className="btn btn-outline" onClick={clear}>🗑️ Clear</button>
                </div>

                {error && <div className="error-box">{error}</div>}

                {output && (
                    <div className="result-section">
                        <div className="label-row">
                            <label className="form-label">Formatted SQL</label>
                            <button className="copy-btn sql-copy-btn" onClick={copy}>📋 Copy</button>
                        </div>
                        <textarea
                            className="form-input mono output"
                            value={output}
                            readOnly
                            rows={14}
                        />
                    </div>
                )}
            </div>

            <style>{`
                .tool-form { max-width: 900px; margin: 0 auto; }
                .form-group { margin-bottom: var(--spacing-lg); }
                .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm); }
                .form-label { font-weight: 600; color: var(--jet); }
                .link-btn { background: none; border: none; color: var(--yinmn-blue); cursor: pointer; font-size: var(--text-sm); text-decoration: underline; }
                .link-btn:hover { color: var(--oxford-blue); }
                .form-input { width: 100%; padding: var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-base); transition: border-color 0.2s; resize: vertical; }
                .form-input:focus { outline: none; border-color: var(--yinmn-blue); }
                .form-input.mono { font-family: var(--font-mono); font-size: var(--text-sm); line-height: 1.5; }
                .form-input.output { background: var(--ghost-white); }
                .form-select { padding: var(--spacing-sm) var(--spacing-md); border: 2px solid var(--platinum); border-radius: var(--radius); font-size: var(--text-sm); cursor: pointer; min-width: 150px; }
                .form-select:focus { outline: none; border-color: var(--yinmn-blue); }
                .options-row { display: flex; gap: var(--spacing-xl); flex-wrap: wrap; margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: var(--ghost-white); border-radius: var(--radius); align-items: flex-end; }
                .option-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
                .option-label { font-size: var(--text-sm); font-weight: 500; color: var(--dim-gray); }
                .checkbox-label { display: flex; align-items: center; gap: var(--spacing-sm); cursor: pointer; font-size: var(--text-sm); padding-top: var(--spacing-md); }
                .checkbox-label input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--yinmn-blue); cursor: pointer; }
                .btn-group { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); flex-wrap: wrap; }
                .btn { padding: var(--spacing-sm) var(--spacing-lg); border-radius: var(--radius); font-weight: 600; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
                .btn-primary { background: linear-gradient(135deg, var(--yinmn-blue), var(--oxford-blue)); color: white; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(66, 90, 157, 0.3); }
                .btn-secondary { background: var(--ghost-white); color: var(--jet); border-color: var(--platinum); }
                .btn-secondary:hover { background: var(--platinum); }
                .btn-outline { background: transparent; color: var(--jet); border-color: var(--platinum); }
                .btn-outline:hover { background: var(--ghost-white); }
                .error-box { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; padding: var(--spacing-md); border-radius: var(--radius); margin-bottom: var(--spacing-lg); border-left: 4px solid #ef4444; }
                .result-section { margin-top: var(--spacing-lg); }
                .copy-btn { background: var(--yinmn-blue); color: white; border: none; padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius); cursor: pointer; font-size: var(--text-sm); font-weight: 500; transition: all 0.2s; }
                .copy-btn:hover { background: var(--oxford-blue); }
            `}</style>
        </ToolLayout>
    );
};

export default SqlFormatter;
