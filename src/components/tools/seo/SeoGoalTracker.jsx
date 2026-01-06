import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const SeoGoalTracker = () => {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [goals, setGoals] = useState(['traffic', 'rankings']);
    const [timeframe, setTimeframe] = useState('quarterly');
    const [template, setTemplate] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'seo-goal-tracker').slice(0, 3);

    const goalOptions = [
        { id: 'traffic', label: '📈 Increase Organic Traffic', icon: '📈' },
        { id: 'rankings', label: '🎯 Improve Keyword Rankings', icon: '🎯' },
        { id: 'backlinks', label: '🔗 Build Quality Backlinks', icon: '🔗' },
        { id: 'conversions', label: '💰 Increase Conversions', icon: '💰' },
        { id: 'local', label: '📍 Improve Local Visibility', icon: '📍' },
        { id: 'authority', label: '🏆 Build Domain Authority', icon: '🏆' }
    ];

    const toggleGoal = (goalId) => {
        if (goals.includes(goalId)) {
            if (goals.length > 1) setGoals(goals.filter(g => g !== goalId));
        } else {
            setGoals([...goals, goalId]);
        }
    };

    const generateTemplate = () => {
        if (!websiteUrl.trim()) { alert('Please enter your website URL'); return; }

        const kpis = {
            traffic: [
                { name: 'Monthly Organic Sessions', target: '+20%', current: '', unit: 'sessions' },
                { name: 'Organic Users', target: '+15%', current: '', unit: 'users' },
                { name: 'Bounce Rate', target: '-5%', current: '', unit: '%' },
                { name: 'Pages per Session', target: '+10%', current: '', unit: 'pages' }
            ],
            rankings: [
                { name: 'Keywords in Top 3', target: '+5', current: '', unit: 'keywords' },
                { name: 'Keywords in Top 10', target: '+15', current: '', unit: 'keywords' },
                { name: 'Average Position (main KWs)', target: '-3', current: '', unit: 'position' },
                { name: 'Featured Snippets Won', target: '+2', current: '', unit: 'snippets' }
            ],
            backlinks: [
                { name: 'Total Referring Domains', target: '+10', current: '', unit: 'domains' },
                { name: 'High DA (50+) Backlinks', target: '+3', current: '', unit: 'links' },
                { name: 'Guest Posts Published', target: '4', current: '', unit: 'posts' },
                { name: 'Broken Link Building Wins', target: '2', current: '', unit: 'links' }
            ],
            conversions: [
                { name: 'Organic Conversion Rate', target: '+0.5%', current: '', unit: '%' },
                { name: 'Organic Revenue', target: '+25%', current: '', unit: '$' },
                { name: 'Lead Form Submissions', target: '+20%', current: '', unit: 'leads' },
                { name: 'Cost per Acquisition', target: '-10%', current: '', unit: '$' }
            ],
            local: [
                { name: 'Google Business Profile Views', target: '+30%', current: '', unit: 'views' },
                { name: 'Direction Requests', target: '+20%', current: '', unit: 'requests' },
                { name: 'Phone Calls from GBP', target: '+15%', current: '', unit: 'calls' },
                { name: 'Google Reviews', target: '+10', current: '', unit: 'reviews' }
            ],
            authority: [
                { name: 'Domain Authority (DR/DA)', target: '+5', current: '', unit: 'score' },
                { name: 'Brand Mentions', target: '+10', current: '', unit: 'mentions' },
                { name: 'Referring Domains Quality', target: '+15%', current: '', unit: '%' }
            ]
        };

        const periods = timeframe === 'quarterly' ? ['Month 1', 'Month 2', 'Month 3'] :
            ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const milestones = {
            quarterly: [
                { week: 'Week 1-2', tasks: 'Baseline metrics, audit completion' },
                { week: 'Week 3-4', tasks: 'Technical fixes, content optimization' },
                { week: 'Week 5-8', tasks: 'Content creation, link building outreach' },
                { week: 'Week 9-12', tasks: 'Analysis, reporting, strategy refinement' }
            ],
            yearly: [
                { week: 'Q1', tasks: 'Foundation: Technical SEO, content audit' },
                { week: 'Q2', tasks: 'Growth: Content creation, link building' },
                { week: 'Q3', tasks: 'Scale: Expand content, increase outreach' },
                { week: 'Q4', tasks: 'Optimize: Review, refine, plan next year' }
            ]
        };

        const selectedKpis = goals.flatMap(g => kpis[g] || []);

        setTemplate({
            websiteUrl,
            goals: goals.map(g => goalOptions.find(o => o.id === g)),
            timeframe,
            kpis: selectedKpis,
            periods,
            milestones: milestones[timeframe] || milestones.quarterly
        });
    };

    const exportMarkdown = () => {
        if (!template) return;
        let md = `# SEO Goal Tracker\n\n`;
        md += `**Website:** ${template.websiteUrl}\n`;
        md += `**Timeframe:** ${template.timeframe}\n`;
        md += `**Goals:** ${template.goals.map(g => g.label).join(', ')}\n`;
        md += `**Generated:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

        md += `## KPI Tracking\n\n`;
        md += `| KPI | Target | Baseline | ${template.periods.join(' | ')} |\n`;
        md += `|-----|--------|----------|${template.periods.map(() => '---').join('|')}|\n`;
        template.kpis.forEach(kpi => {
            md += `| ${kpi.name} | ${kpi.target} | | ${template.periods.map(() => '').join(' | ')} |\n`;
        });

        md += `\n## Milestones\n\n`;
        template.milestones.forEach(m => {
            md += `### ${m.week}\n- ${m.tasks}\n\n`;
        });

        md += `## Monthly Report Template\n\n`;
        md += `### Executive Summary\n- Overall progress:\n- Key wins:\n- Challenges:\n\n`;
        md += `### Traffic & Rankings\n- Organic sessions:\n- Keyword improvements:\n\n`;
        md += `### Actions Completed\n- [ ] Action 1\n- [ ] Action 2\n\n`;
        md += `### Next Month Priorities\n- Priority 1\n- Priority 2\n`;

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'seo-goal-tracker.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const faqs = [
        { question: 'What SEO KPIs should I track?', answer: 'Focus on organic traffic, keyword rankings, conversions, and backlink growth. Choose KPIs that align with your specific business goals.' },
        { question: 'How often should I review SEO metrics?', answer: 'Weekly for quick checks, monthly for detailed analysis, quarterly for strategy review. Avoid checking rankings daily as they fluctuate.' },
        { question: 'What is a realistic SEO goal?', answer: 'Expect 3-6 months for noticeable results. A 10-25% traffic increase per quarter is a reasonable goal for established sites.' }
    ];

    const seoContent = (<><h2>SEO Goal Tracker & KPI Dashboard Template</h2><p>Create a structured SEO goal tracking template with KPIs, milestones, and reporting frameworks tailored to your objectives.</p></>);

    return (
        <ToolLayout title="SEO Goal Tracker & KPI Dashboard" description="Generate SEO goal tracking templates with KPIs, milestones, and reporting frameworks." keywords={['SEO goals', 'KPI tracking', 'SEO metrics', 'SEO dashboard', 'performance tracking']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tracker-container">
                <div className="tracker-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Website URL</label>
                            <input type="url" className="form-input" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yourwebsite.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tracking Timeframe</label>
                            <select className="form-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
                                <option value="quarterly">Quarterly (3 months)</option>
                                <option value="yearly">Yearly (12 months)</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Select Your Goals</label>
                        <div className="goal-options">
                            {goalOptions.map(option => (
                                <button key={option.id} className={`goal-btn ${goals.includes(option.id) ? 'active' : ''}`} onClick={() => toggleGoal(option.id)}>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generateTemplate}>📊 Generate Tracker</button>
                </div>

                {template && (
                    <div className="tracker-output">
                        <div className="tracker-header">
                            <div>
                                <h3>SEO Goal Tracker</h3>
                                <p className="tracker-meta">{template.websiteUrl} • {template.timeframe}</p>
                            </div>
                            <button className="btn-export" onClick={exportMarkdown}>📄 Download Template</button>
                        </div>

                        {/* Goals Summary */}
                        <div className="goals-summary">
                            {template.goals.map((goal, idx) => (
                                <div key={idx} className="goal-badge">{goal.icon} {goal.label.replace(/^[^\s]+\s/, '')}</div>
                            ))}
                        </div>

                        {/* KPI Tracking Table */}
                        <div className="section">
                            <h4>📈 KPI Tracking</h4>
                            <div className="kpi-scroll">
                                <table className="kpi-table">
                                    <thead>
                                        <tr>
                                            <th>KPI</th>
                                            <th>Target</th>
                                            <th>Baseline</th>
                                            {template.periods.map((p, i) => <th key={i}>{p}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {template.kpis.map((kpi, idx) => (
                                            <tr key={idx}>
                                                <td><div className="kpi-name">{kpi.name}</div><div className="kpi-unit">{kpi.unit}</div></td>
                                                <td className="target-cell">{kpi.target}</td>
                                                <td><input type="text" placeholder="—" /></td>
                                                {template.periods.map((_, i) => <td key={i}><input type="text" placeholder="—" /></td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className="section">
                            <h4>🎯 Milestones</h4>
                            <div className="milestone-list">
                                {template.milestones.map((m, idx) => (
                                    <div key={idx} className="milestone-card">
                                        <div className="milestone-period">{m.week}</div>
                                        <div className="milestone-tasks">{m.tasks}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Report Template */}
                        <div className="section">
                            <h4>📋 Monthly Report Template</h4>
                            <div className="report-template">
                                <div className="report-section">
                                    <h5>Executive Summary</h5>
                                    <textarea placeholder="Overall progress, key wins, challenges..."></textarea>
                                </div>
                                <div className="report-section">
                                    <h5>Traffic & Rankings</h5>
                                    <textarea placeholder="Organic sessions change, keyword movements..."></textarea>
                                </div>
                                <div className="report-section">
                                    <h5>Actions Completed</h5>
                                    <textarea placeholder="List completed tasks this month..."></textarea>
                                </div>
                                <div className="report-section">
                                    <h5>Next Month Priorities</h5>
                                    <textarea placeholder="Top priorities for next month..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .tracker-container { max-width: 1000px; margin: 0 auto; }
                .tracker-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md, 16px); }
                .form-input, .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .goal-options { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); margin-top: var(--spacing-sm, 8px); }
                .goal-btn { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: white; border: 2px solid var(--platinum, #e0e0e0); border-radius: 20px; cursor: pointer; font-size: var(--text-sm, 14px); transition: all 0.2s; }
                .goal-btn:hover { border-color: var(--yinmn-blue, #485696); }
                .goal-btn.active { background: var(--yinmn-blue, #485696); color: white; border-color: var(--yinmn-blue, #485696); }
                .tracker-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .tracker-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .tracker-header h3 { margin: 0; }
                .tracker-meta { color: var(--text-muted, #666); margin-top: 4px; }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .goals-summary { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); margin-bottom: var(--spacing-lg, 24px); }
                .goal-badge { padding: var(--spacing-xs, 8px) var(--spacing-md, 16px); background: linear-gradient(135deg, #667eea20, #764ba220); border-radius: 20px; font-size: var(--text-sm, 14px); font-weight: 500; }
                .section { margin-bottom: var(--spacing-xl, 32px); }
                .section h4 { margin-bottom: var(--spacing-md, 16px); }
                .kpi-scroll { overflow-x: auto; }
                .kpi-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm, 14px); }
                .kpi-table th, .kpi-table td { padding: var(--spacing-sm, 10px); border: 1px solid var(--platinum, #e0e0e0); }
                .kpi-table th { background: var(--yinmn-blue, #485696); color: white; text-align: left; white-space: nowrap; }
                .kpi-name { font-weight: 500; }
                .kpi-unit { font-size: var(--text-xs, 11px); color: var(--text-muted, #666); }
                .target-cell { background: #28a74510; font-weight: 600; color: #28a745; }
                .kpi-table input { width: 60px; padding: 6px; border: 1px solid var(--platinum, #e0e0e0); border-radius: 4px; text-align: center; }
                .milestone-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md, 16px); }
                .milestone-card { padding: var(--spacing-md, 16px); background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: var(--radius, 8px); border-left: 4px solid var(--yinmn-blue, #485696); }
                .milestone-period { font-weight: 700; margin-bottom: var(--spacing-xs, 6px); }
                .milestone-tasks { font-size: var(--text-sm, 14px); color: var(--text-muted, #666); }
                .report-template { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md, 16px); }
                .report-section { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-md, 16px); border-radius: var(--radius, 8px); }
                .report-section h5 { margin: 0 0 var(--spacing-sm, 10px) 0; }
                .report-section textarea { width: 100%; min-height: 80px; padding: var(--spacing-sm, 10px); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); resize: vertical; }
                @media (max-width: 768px) {
                    .form-row, .report-template { grid-template-columns: 1fr; }
                    .kpi-table input { width: 50px; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default SeoGoalTracker;
