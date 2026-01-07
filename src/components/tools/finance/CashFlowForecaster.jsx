import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { ResultActions } from './shared';

const MONTHS = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];

const DEFAULT_INFLOWS = [
    { name: 'Sales Revenue', values: [500000, 550000, 600000, 580000, 620000, 650000] },
    { name: 'Other Income', values: [10000, 10000, 10000, 10000, 10000, 10000] },
];

const DEFAULT_OUTFLOWS = [
    { name: 'Rent', values: [50000, 50000, 50000, 50000, 50000, 50000] },
    { name: 'Salaries', values: [200000, 200000, 200000, 200000, 200000, 200000] },
    { name: 'Utilities', values: [15000, 15000, 15000, 15000, 15000, 15000] },
    { name: 'Raw Materials', values: [150000, 165000, 180000, 174000, 186000, 195000] },
    { name: 'Loan EMI', values: [50000, 50000, 50000, 50000, 50000, 50000] },
];

const STORAGE_KEY = 'cash_flow_forecaster_data';

const CashFlowForecaster = () => {
    const [openingBalance, setOpeningBalance] = useState(200000);
    const [inflows, setInflows] = useState(DEFAULT_INFLOWS);
    const [outflows, setOutflows] = useState(DEFAULT_OUTFLOWS);
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools
        .filter(t => t.category === 'finance' && t.id !== 'cash-flow-forecaster')
        .slice(0, 3);

    // Load saved data
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setOpeningBalance(data.openingBalance);
                setInflows(data.inflows);
                setOutflows(data.outflows);
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }, []);

    // Calculate on change
    useEffect(() => {
        calculateCashFlow();
    }, [openingBalance, inflows, outflows]);

    const calculateCashFlow = () => {
        const monthlyData = [];
        let runningBalance = parseFloat(openingBalance) || 0;

        for (let i = 0; i < 6; i++) {
            const totalInflow = inflows.reduce((sum, item) => sum + (parseFloat(item.values[i]) || 0), 0);
            const totalOutflow = outflows.reduce((sum, item) => sum + (parseFloat(item.values[i]) || 0), 0);
            const netCashFlow = totalInflow - totalOutflow;
            const closingBalance = runningBalance + netCashFlow;

            monthlyData.push({
                month: MONTHS[i],
                openingBalance: runningBalance,
                totalInflow,
                totalOutflow,
                netCashFlow,
                closingBalance,
                status: closingBalance < 0 ? 'negative' : closingBalance < 50000 ? 'warning' : 'positive'
            });

            runningBalance = closingBalance;
        }

        const minBalance = Math.min(...monthlyData.map(m => m.closingBalance));
        const maxBalance = Math.max(...monthlyData.map(m => m.closingBalance));
        const totalInflow = monthlyData.reduce((sum, m) => sum + m.totalInflow, 0);
        const totalOutflow = monthlyData.reduce((sum, m) => sum + m.totalOutflow, 0);
        const negativeMonths = monthlyData.filter(m => m.closingBalance < 0);

        setResult({
            monthlyData,
            summary: {
                openingBalance,
                finalBalance: runningBalance,
                minBalance,
                maxBalance,
                totalInflow,
                totalOutflow,
                netChange: runningBalance - openingBalance,
                negativeMonths: negativeMonths.length
            }
        });
    };

    // Save to localStorage
    const saveData = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            openingBalance,
            inflows,
            outflows
        }));
        alert('Forecast saved successfully!');
    };

    // Clear saved data
    const clearSavedData = () => {
        localStorage.removeItem(STORAGE_KEY);
        setOpeningBalance(200000);
        setInflows(DEFAULT_INFLOWS);
        setOutflows(DEFAULT_OUTFLOWS);
    };

    // Update row value
    const updateValue = (type, rowIndex, monthIndex, value) => {
        const setter = type === 'inflow' ? setInflows : setOutflows;
        const data = type === 'inflow' ? [...inflows] : [...outflows];
        data[rowIndex].values[monthIndex] = parseFloat(value) || 0;
        setter(data);
    };

    // Update row name
    const updateName = (type, rowIndex, name) => {
        const setter = type === 'inflow' ? setInflows : setOutflows;
        const data = type === 'inflow' ? [...inflows] : [...outflows];
        data[rowIndex].name = name;
        setter(data);
    };

    // Add row
    const addRow = (type) => {
        const setter = type === 'inflow' ? setInflows : setOutflows;
        const data = type === 'inflow' ? [...inflows] : [...outflows];
        data.push({ name: '', values: [0, 0, 0, 0, 0, 0] });
        setter(data);
    };

    // Remove row
    const removeRow = (type, index) => {
        const setter = type === 'inflow' ? setInflows : setOutflows;
        const data = type === 'inflow' ? [...inflows] : [...outflows];
        data.splice(index, 1);
        setter(data);
    };

    // Export to CSV
    const exportToCSV = () => {
        if (!result) return;

        let csv = 'Category,Item,' + MONTHS.join(',') + '\n';

        inflows.forEach(item => {
            csv += `Inflow,${item.name},${item.values.join(',')}\n`;
        });

        outflows.forEach(item => {
            csv += `Outflow,${item.name},${item.values.join(',')}\n`;
        });

        csv += '\nSummary\n';
        csv += 'Opening Balance,' + result.monthlyData.map(m => m.openingBalance).join(',') + '\n';
        csv += 'Total Inflow,' + result.monthlyData.map(m => m.totalInflow).join(',') + '\n';
        csv += 'Total Outflow,' + result.monthlyData.map(m => m.totalOutflow).join(',') + '\n';
        csv += 'Net Cash Flow,' + result.monthlyData.map(m => m.netCashFlow).join(',') + '\n';
        csv += 'Closing Balance,' + result.monthlyData.map(m => m.closingBalance).join(',') + '\n';

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cash_flow_forecast_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getCopyText = () => {
        if (!result) return '';
        return `Cash Flow Forecast (6 Months)
================================
Opening Balance: ₹${result.summary.openingBalance.toLocaleString('en-IN')}
Total Inflows: ₹${result.summary.totalInflow.toLocaleString('en-IN')}
Total Outflows: ₹${result.summary.totalOutflow.toLocaleString('en-IN')}
Net Change: ₹${result.summary.netChange.toLocaleString('en-IN')}
Final Balance: ₹${result.summary.finalBalance.toLocaleString('en-IN')}
${result.summary.negativeMonths > 0 ? `⚠️ Warning: ${result.summary.negativeMonths} month(s) with negative balance` : ''}`;
    };

    const faqs = [
        {
            question: 'What is Cash Flow Forecasting?',
            answer: 'Cash flow forecasting predicts the future cash position of a business by estimating cash inflows and outflows over a period. It helps identify potential cash shortages and plan accordingly.'
        },
        {
            question: 'Why is cash flow management important?',
            answer: 'Even profitable businesses can fail due to cash flow problems. Managing cash flow ensures you have enough liquid funds to pay bills, employees, and suppliers on time.'
        },
        {
            question: 'What should I do if the forecast shows negative balance?',
            answer: 'Consider: (1) Delaying non-essential expenses, (2) Accelerating collections from customers, (3) Negotiating payment terms with vendors, (4) Arranging short-term credit, (5) Reducing inventory.'
        },
        {
            question: 'How often should I update my cash flow forecast?',
            answer: 'Compare actual vs forecast weekly. Update the 6-month forecast at least monthly, or immediately when significant changes occur in sales, expenses, or payment terms.'
        }
    ];

    const seoContent = (
        <>
            <h2>What is Cash Flow Forecasting?</h2>
            <p>
                Cash flow forecasting is the process of estimating your business's future cash
                position. Our 6-month forecaster helps you visualize incoming and outgoing cash,
                identify potential shortfalls, and plan for financial stability.
            </p>

            <h2>Key Features</h2>
            <ul>
                <li>6-month rolling forecast with monthly breakdown</li>
                <li>Color-coded balance status (positive, warning, negative)</li>
                <li>Multiple inflow and outflow line items</li>
                <li>Save and load your forecasts locally</li>
                <li>Export to CSV for further analysis</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Cash Flow Forecaster"
            description="6-month cash flow projection tool. Track inflows, outflows, and identify potential cash shortages with visual alerts."
            keywords={['cash flow forecast', 'cash flow projection', 'business cash flow', 'cash management', 'financial planning']}
            category="finance"
            categoryName="Financial & Business"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Opening Balance */}
                <div className="opening-balance-section">
                    <label className="form-label">Opening Cash Balance</label>
                    <div className="balance-input-wrapper">
                        <span className="input-prefix">₹</span>
                        <input
                            type="number"
                            className="form-input"
                            value={openingBalance}
                            onChange={(e) => setOpeningBalance(e.target.value)}
                        />
                    </div>
                </div>

                {/* Cash Inflows */}
                <div className="flow-section inflows">
                    <h3>📥 Cash Inflows</h3>
                    <div className="flow-table-wrapper">
                        <table className="flow-table">
                            <thead>
                                <tr>
                                    <th className="name-col">Item</th>
                                    {MONTHS.map((m, i) => <th key={i}>{m}</th>)}
                                    <th className="action-col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {inflows.map((item, rowIdx) => (
                                    <tr key={rowIdx}>
                                        <td>
                                            <input
                                                type="text"
                                                className="name-input"
                                                value={item.name}
                                                onChange={(e) => updateName('inflow', rowIdx, e.target.value)}
                                                placeholder="Item name"
                                            />
                                        </td>
                                        {item.values.map((val, monthIdx) => (
                                            <td key={monthIdx}>
                                                <input
                                                    type="number"
                                                    className="value-input"
                                                    value={val || ''}
                                                    onChange={(e) => updateValue('inflow', rowIdx, monthIdx, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <button className="btn-remove" onClick={() => removeRow('inflow', rowIdx)}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => addRow('inflow')}>+ Add Inflow</button>
                </div>

                {/* Cash Outflows */}
                <div className="flow-section outflows">
                    <h3>📤 Cash Outflows</h3>
                    <div className="flow-table-wrapper">
                        <table className="flow-table">
                            <thead>
                                <tr>
                                    <th className="name-col">Item</th>
                                    {MONTHS.map((m, i) => <th key={i}>{m}</th>)}
                                    <th className="action-col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {outflows.map((item, rowIdx) => (
                                    <tr key={rowIdx}>
                                        <td>
                                            <input
                                                type="text"
                                                className="name-input"
                                                value={item.name}
                                                onChange={(e) => updateName('outflow', rowIdx, e.target.value)}
                                                placeholder="Item name"
                                            />
                                        </td>
                                        {item.values.map((val, monthIdx) => (
                                            <td key={monthIdx}>
                                                <input
                                                    type="number"
                                                    className="value-input"
                                                    value={val || ''}
                                                    onChange={(e) => updateValue('outflow', rowIdx, monthIdx, e.target.value)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <button className="btn-remove" onClick={() => removeRow('outflow', rowIdx)}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => addRow('outflow')}>+ Add Outflow</button>
                </div>

                {/* Results */}
                {result && (
                    <div className="result-box">
                        {/* Warnings */}
                        {result.summary.negativeMonths > 0 && (
                            <div className="warning-alert">
                                ⚠️ <strong>Cash Flow Alert:</strong> {result.summary.negativeMonths} month(s) show negative closing balance.
                                Consider reducing expenses or arranging additional funding.
                            </div>
                        )}

                        {/* Summary Cards */}
                        <div className="summary-grid">
                            <div className="summary-card">
                                <span className="summary-label">Opening Balance</span>
                                <span className="summary-value">₹{result.summary.openingBalance.toLocaleString('en-IN')}</span>
                            </div>
                            <div className={`summary-card ${result.summary.finalBalance < 0 ? 'negative' : 'positive'}`}>
                                <span className="summary-label">Final Balance</span>
                                <span className="summary-value">₹{result.summary.finalBalance.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-label">Total Inflow</span>
                                <span className="summary-value inflow">+₹{result.summary.totalInflow.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="summary-card">
                                <span className="summary-label">Total Outflow</span>
                                <span className="summary-value outflow">-₹{result.summary.totalOutflow.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Monthly Summary Table */}
                        <div className="monthly-summary">
                            <h4>📊 Monthly Cash Position</h4>
                            <div className="monthly-table-wrapper">
                                <table className="monthly-table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {MONTHS.map((m, i) => <th key={i}>{m}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Opening</td>
                                            {result.monthlyData.map((m, i) => (
                                                <td key={i}>₹{m.openingBalance.toLocaleString('en-IN')}</td>
                                            ))}
                                        </tr>
                                        <tr className="inflow-row">
                                            <td>+ Inflows</td>
                                            {result.monthlyData.map((m, i) => (
                                                <td key={i}>+₹{m.totalInflow.toLocaleString('en-IN')}</td>
                                            ))}
                                        </tr>
                                        <tr className="outflow-row">
                                            <td>- Outflows</td>
                                            {result.monthlyData.map((m, i) => (
                                                <td key={i}>-₹{m.totalOutflow.toLocaleString('en-IN')}</td>
                                            ))}
                                        </tr>
                                        <tr className="net-row">
                                            <td>Net Flow</td>
                                            {result.monthlyData.map((m, i) => (
                                                <td key={i} className={m.netCashFlow >= 0 ? 'positive' : 'negative'}>
                                                    {m.netCashFlow >= 0 ? '+' : ''}₹{m.netCashFlow.toLocaleString('en-IN')}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr className="closing-row">
                                            <td><strong>Closing</strong></td>
                                            {result.monthlyData.map((m, i) => (
                                                <td key={i} className={`closing ${m.status}`}>
                                                    ₹{m.closingBalance.toLocaleString('en-IN')}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Visual Bar Chart */}
                        <div className="balance-chart">
                            <h4>📈 Balance Trend</h4>
                            <div className="chart-container">
                                {result.monthlyData.map((m, i) => (
                                    <div key={i} className="chart-bar-wrapper">
                                        <div
                                            className={`chart-bar ${m.status}`}
                                            style={{
                                                height: `${Math.min(100, Math.max(10, (Math.abs(m.closingBalance) / Math.max(Math.abs(result.summary.maxBalance), Math.abs(result.summary.minBalance), 1)) * 80))}%`,
                                                marginTop: m.closingBalance < 0 ? '50%' : 'auto',
                                                marginBottom: m.closingBalance < 0 ? 'auto' : '50%'
                                            }}
                                        >
                                            <span className="bar-value">₹{(m.closingBalance / 100000).toFixed(1)}L</span>
                                        </div>
                                        <span className="bar-month">{m.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={saveData}>💾 Save Forecast</button>
                            <button className="btn btn-secondary" onClick={exportToCSV}>📥 Export CSV</button>
                            <button className="btn btn-secondary" onClick={clearSavedData}>🗑️ Reset</button>
                            <ResultActions
                                copyText={getCopyText()}
                                shareTitle="Cash Flow Forecast"
                                shareText={`6-month forecast: Final Balance ₹${result.summary.finalBalance.toLocaleString('en-IN')}`}
                                toolName="cash-flow-forecaster"
                            />
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form {
          max-width: 1000px;
          margin: 0 auto;
        }

        .opening-balance-section {
          margin-bottom: var(--spacing-xl);
          max-width: 300px;
        }

        .balance-input-wrapper {
          display: flex;
        }

        .input-prefix {
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-sm);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-right: none;
          border-radius: var(--radius) 0 0 var(--radius);
          font-weight: 600;
        }

        .balance-input-wrapper .form-input {
          border-radius: 0 var(--radius) var(--radius) 0;
        }

        .flow-section {
          margin-bottom: var(--spacing-xl);
        }

        .flow-section h3 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .flow-section.inflows h3 {
          color: var(--success);
        }

        .flow-section.outflows h3 {
          color: var(--error);
        }

        .flow-table-wrapper {
          overflow-x: auto;
          margin-bottom: var(--spacing-sm);
        }

        .flow-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--text-sm);
        }

        .flow-table th,
        .flow-table td {
          padding: var(--spacing-xs);
          border: 1px solid var(--platinum);
        }

        .flow-table th {
          background: var(--bg-secondary);
          font-weight: 600;
          font-size: var(--text-xs);
        }

        .name-col {
          width: 150px;
        }

        .action-col {
          width: 40px;
        }

        .name-input,
        .value-input {
          width: 100%;
          padding: var(--spacing-xs);
          border: 1px solid var(--platinum);
          border-radius: var(--radius-sm);
          font-size: var(--text-sm);
          background: var(--bg-primary);
          color: var(--text-primary);
        }

        .value-input {
          text-align: right;
        }

        .btn-remove {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          border: none;
          padding: var(--spacing-xs);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .btn-sm {
          font-size: var(--text-sm);
          padding: var(--spacing-xs) var(--spacing-sm);
        }

        .warning-alert {
          padding: var(--spacing-md);
          background: rgba(251, 191, 36, 0.1);
          border: 2px solid var(--warning);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-lg);
          color: var(--warning-dark, #b45309);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .summary-card {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
          text-align: center;
        }

        .summary-card.positive {
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid var(--success);
        }

        .summary-card.negative {
          background: rgba(239, 68, 68, 0.1);
          border: 2px solid var(--error);
        }

        .summary-label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .summary-value {
          font-size: var(--text-lg);
          font-weight: 700;
        }

        .summary-value.inflow {
          color: var(--success);
        }

        .summary-value.outflow {
          color: var(--error);
        }

        .monthly-summary {
          margin-bottom: var(--spacing-xl);
        }

        .monthly-summary h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .monthly-table-wrapper {
          overflow-x: auto;
        }

        .monthly-table {
          width: 100%;
          border-collapse: collapse;
        }

        .monthly-table th,
        .monthly-table td {
          padding: var(--spacing-sm);
          border: 1px solid var(--platinum);
          text-align: right;
        }

        .monthly-table th {
          background: var(--bg-secondary);
        }

        .monthly-table td:first-child {
          text-align: left;
          font-weight: 500;
        }

        .inflow-row td {
          color: var(--success);
        }

        .outflow-row td {
          color: var(--error);
        }

        .net-row td.positive {
          color: var(--success);
        }

        .net-row td.negative {
          color: var(--error);
        }

        .closing-row {
          background: var(--bg-secondary);
        }

        .closing-row .closing {
          font-weight: 700;
        }

        .closing.positive {
          background: rgba(16, 185, 129, 0.1);
        }

        .closing.warning {
          background: rgba(251, 191, 36, 0.1);
        }

        .closing.negative {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
        }

        .balance-chart {
          margin-bottom: var(--spacing-xl);
        }

        .balance-chart h4 {
          margin: 0 0 var(--spacing-md) 0;
        }

        .chart-container {
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 200px;
          background: var(--bg-secondary);
          border-radius: var(--radius);
          padding: var(--spacing-md);
        }

        .chart-bar-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          width: calc(100% / 6);
        }

        .chart-bar {
          width: 60%;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 30px;
        }

        .chart-bar.positive {
          background: var(--success);
        }

        .chart-bar.warning {
          background: var(--warning);
        }

        .chart-bar.negative {
          background: var(--error);
        }

        .bar-value {
          color: white;
          font-size: var(--text-xs);
          font-weight: 600;
        }

        .bar-month {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
          align-items: center;
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default CashFlowForecaster;
