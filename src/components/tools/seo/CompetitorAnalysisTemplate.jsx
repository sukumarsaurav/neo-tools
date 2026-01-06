import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const CompetitorAnalysisTemplate = () => {
    const [yourDomain, setYourDomain] = useState('');
    const [competitors, setCompetitors] = useState('');
    const [industry, setIndustry] = useState('general');
    const [template, setTemplate] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'competitor-analysis-template').slice(0, 3);

    const industries = [
        { id: 'general', label: 'General / Other' },
        { id: 'ecommerce', label: 'E-commerce' },
        { id: 'saas', label: 'SaaS / Software' },
        { id: 'local', label: 'Local Business' },
        { id: 'blog', label: 'Blog / Content' },
        { id: 'agency', label: 'Agency / Services' }
    ];

    const generateTemplate = () => {
        if (!yourDomain.trim()) { alert('Please enter your domain'); return; }

        const competitorList = competitors.split('\n').map(c => c.trim()).filter(c => c.length > 0).slice(0, 5);
        if (competitorList.length === 0) { alert('Please enter at least one competitor domain'); return; }

        const metrics = [
            {
                category: 'Domain Authority', metrics: [
                    { name: 'Domain Authority (DA/DR)', description: 'Overall domain strength (Moz DA or Ahrefs DR)', type: 'number' },
                    { name: 'Total Backlinks', description: 'Number of referring domains linking to site', type: 'number' },
                    { name: 'Domain Age', description: 'How long the domain has been registered', type: 'text' }
                ]
            },
            {
                category: 'Organic Traffic', metrics: [
                    { name: 'Monthly Organic Traffic', description: 'Estimated monthly organic visitors', type: 'number' },
                    { name: 'Organic Keywords', description: 'Number of ranking keywords', type: 'number' },
                    { name: 'Traffic Growth (6mo)', description: 'Traffic change over past 6 months', type: 'trend' }
                ]
            },
            {
                category: 'Content', metrics: [
                    { name: 'Total Indexed Pages', description: 'Number of pages indexed by Google', type: 'number' },
                    { name: 'Blog Post Frequency', description: 'How often they publish new content', type: 'text' },
                    { name: 'Content Types', description: 'Types of content (blog, video, guides, etc.)', type: 'text' }
                ]
            },
            {
                category: 'Keywords', metrics: [
                    { name: 'Top 3 Ranking Keywords', description: 'Keywords ranking in positions 1-3', type: 'number' },
                    { name: 'Top 10 Ranking Keywords', description: 'Keywords ranking in positions 1-10', type: 'number' },
                    { name: 'Keyword Overlap %', description: 'Keywords both you and competitor rank for', type: 'percentage' }
                ]
            },
            {
                category: 'Technical', metrics: [
                    { name: 'Page Speed Score', description: 'Google PageSpeed Insights score', type: 'number' },
                    { name: 'Mobile Friendly', description: 'Passes mobile-friendly test', type: 'boolean' },
                    { name: 'Core Web Vitals', description: 'Passes Core Web Vitals assessment', type: 'boolean' }
                ]
            }
        ];

        const swotTemplate = {
            strengths: [
                'What keywords do you rank higher for?',
                'What content types are you strong in?',
                'What is your unique value proposition?'
            ],
            weaknesses: [
                'Where do competitors outrank you?',
                'What content gaps exist on your site?',
                'What technical issues need fixing?'
            ],
            opportunities: [
                'Keywords competitors rank for but you don\'t',
                'Content topics competitors haven\'t covered',
                'Backlink sources competitors are missing'
            ],
            threats: [
                'Competitors with significantly higher DA',
                'New competitors entering the market',
                'Algorithm updates affecting your niche'
            ]
        };

        const actionItems = [
            { task: 'Identify top 10 keywords each competitor ranks for', priority: 'high' },
            { task: 'Analyze competitor content that ranks well', priority: 'high' },
            { task: 'Find competitor backlink sources to target', priority: 'high' },
            { task: 'Map content gaps vs. competitors', priority: 'medium' },
            { task: 'Compare on-page SEO elements (titles, meta)', priority: 'medium' },
            { task: 'Analyze competitor site structure', priority: 'low' },
            { task: 'Monitor competitor new content weekly', priority: 'medium' }
        ];

        setTemplate({
            yourDomain,
            competitors: competitorList,
            industry,
            metrics,
            swotTemplate,
            actionItems
        });
    };

    const exportMarkdown = () => {
        if (!template) return;
        let md = `# Competitor Analysis Template\n\n`;
        md += `**Your Domain:** ${template.yourDomain}\n`;
        md += `**Industry:** ${template.industry}\n`;
        md += `**Competitors:** ${template.competitors.join(', ')}\n`;
        md += `**Generated:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

        md += `## Competitor Comparison Matrix\n\n`;
        md += `| Metric | ${template.yourDomain} | ${template.competitors.join(' | ')} |\n`;
        md += `|--------|${'-'.repeat(template.yourDomain.length + 2)}|${template.competitors.map(c => '-'.repeat(c.length + 2)).join('|')}|\n`;

        template.metrics.forEach(category => {
            md += `| **${category.category}** | | ${template.competitors.map(() => '').join(' | ')} |\n`;
            category.metrics.forEach(m => {
                md += `| ${m.name} | | ${template.competitors.map(() => '').join(' | ')} |\n`;
            });
        });

        md += `\n## SWOT Analysis\n\n`;
        md += `### Strengths\n`;
        template.swotTemplate.strengths.forEach(q => { md += `- [ ] ${q}\n`; });
        md += `\n### Weaknesses\n`;
        template.swotTemplate.weaknesses.forEach(q => { md += `- [ ] ${q}\n`; });
        md += `\n### Opportunities\n`;
        template.swotTemplate.opportunities.forEach(q => { md += `- [ ] ${q}\n`; });
        md += `\n### Threats\n`;
        template.swotTemplate.threats.forEach(q => { md += `- [ ] ${q}\n`; });

        md += `\n## Action Items\n\n`;
        template.actionItems.forEach(item => {
            const icon = item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢';
            md += `- [ ] ${icon} ${item.task}\n`;
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'competitor-analysis-template.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const faqs = [
        { question: 'Why do competitor analysis?', answer: 'Competitor analysis reveals keyword opportunities, content gaps, and link building targets. It helps you understand what works in your industry and where you can differentiate.' },
        { question: 'How often should I analyze competitors?', answer: 'Do a deep analysis quarterly. Monitor competitor new content and rankings monthly or weekly for major competitors.' },
        { question: 'What tools can I use?', answer: 'Ahrefs, SEMrush, Moz, SpyFu, and SimilarWeb are popular tools. Google Search Console and free tools like Ubersuggest can also help.' }
    ];

    const seoContent = (<><h2>Competitor Analysis Template Generator</h2><p>Create a structured framework for analyzing your SEO competitors. Get a comparison matrix, SWOT analysis template, and actionable next steps.</p></>);

    return (
        <ToolLayout title="Competitor Analysis Template Generator" description="Generate a structured SEO competitor analysis framework with comparison metrics and SWOT analysis." keywords={['competitor analysis', 'SEO comparison', 'competitive research', 'SWOT analysis', 'market research']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="comp-container">
                <div className="comp-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Your Domain</label>
                            <input type="text" className="form-input" value={yourDomain} onChange={(e) => setYourDomain(e.target.value)} placeholder="yourdomain.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Industry</label>
                            <select className="form-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                                {industries.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Competitor Domains (one per line, max 5)</label>
                        <textarea className="form-input" value={competitors} onChange={(e) => setCompetitors(e.target.value)} placeholder="competitor1.com&#10;competitor2.com&#10;competitor3.com" rows={4} />
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generateTemplate}>📊 Generate Template</button>
                </div>

                {template && (
                    <div className="template-output">
                        <div className="template-header">
                            <div>
                                <h3>Competitor Analysis: {template.yourDomain}</h3>
                                <p className="template-meta">vs. {template.competitors.length} competitor(s)</p>
                            </div>
                            <button className="btn-export" onClick={exportMarkdown}>📄 Download Template</button>
                        </div>

                        {/* Comparison Matrix */}
                        <div className="section">
                            <h4>📊 Comparison Matrix</h4>
                            <div className="matrix-scroll">
                                <table className="comparison-matrix">
                                    <thead>
                                        <tr>
                                            <th>Metric</th>
                                            <th className="your-domain">{template.yourDomain}</th>
                                            {template.competitors.map((c, i) => <th key={i}>{c}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {template.metrics.map((category, catIdx) => (
                                            <>
                                                <tr key={`cat-${catIdx}`} className="category-row">
                                                    <td colSpan={template.competitors.length + 2}><strong>{category.category}</strong></td>
                                                </tr>
                                                {category.metrics.map((m, mIdx) => (
                                                    <tr key={`m-${catIdx}-${mIdx}`}>
                                                        <td>
                                                            <div className="metric-name">{m.name}</div>
                                                            <div className="metric-desc">{m.description}</div>
                                                        </td>
                                                        <td className="your-domain"><input type="text" placeholder="—" /></td>
                                                        {template.competitors.map((_, i) => <td key={i}><input type="text" placeholder="—" /></td>)}
                                                    </tr>
                                                ))}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SWOT */}
                        <div className="section">
                            <h4>🎯 SWOT Analysis</h4>
                            <div className="swot-grid">
                                <div className="swot-card strengths">
                                    <h5>💪 Strengths</h5>
                                    {template.swotTemplate.strengths.map((q, i) => (
                                        <div key={i} className="swot-item">
                                            <input type="checkbox" id={`str-${i}`} />
                                            <label htmlFor={`str-${i}`}>{q}</label>
                                        </div>
                                    ))}
                                    <textarea placeholder="Notes..."></textarea>
                                </div>
                                <div className="swot-card weaknesses">
                                    <h5>⚠️ Weaknesses</h5>
                                    {template.swotTemplate.weaknesses.map((q, i) => (
                                        <div key={i} className="swot-item">
                                            <input type="checkbox" id={`weak-${i}`} />
                                            <label htmlFor={`weak-${i}`}>{q}</label>
                                        </div>
                                    ))}
                                    <textarea placeholder="Notes..."></textarea>
                                </div>
                                <div className="swot-card opportunities">
                                    <h5>🚀 Opportunities</h5>
                                    {template.swotTemplate.opportunities.map((q, i) => (
                                        <div key={i} className="swot-item">
                                            <input type="checkbox" id={`opp-${i}`} />
                                            <label htmlFor={`opp-${i}`}>{q}</label>
                                        </div>
                                    ))}
                                    <textarea placeholder="Notes..."></textarea>
                                </div>
                                <div className="swot-card threats">
                                    <h5>🛑 Threats</h5>
                                    {template.swotTemplate.threats.map((q, i) => (
                                        <div key={i} className="swot-item">
                                            <input type="checkbox" id={`thr-${i}`} />
                                            <label htmlFor={`thr-${i}`}>{q}</label>
                                        </div>
                                    ))}
                                    <textarea placeholder="Notes..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Action Items */}
                        <div className="section">
                            <h4>✅ Action Items</h4>
                            <div className="action-list">
                                {template.actionItems.map((item, idx) => (
                                    <div key={idx} className={`action-item ${item.priority}`}>
                                        <input type="checkbox" id={`action-${idx}`} />
                                        <label htmlFor={`action-${idx}`}>{item.task}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .comp-container { max-width: 1000px; margin: 0 auto; }
                .comp-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md, 16px); }
                .form-input, .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .template-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .template-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .template-header h3 { margin: 0; }
                .template-meta { color: var(--text-muted, #666); margin-top: 4px; }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .section { margin-bottom: var(--spacing-xl, 32px); }
                .section h4 { margin-bottom: var(--spacing-md, 16px); }
                .matrix-scroll { overflow-x: auto; }
                .comparison-matrix { width: 100%; border-collapse: collapse; font-size: var(--text-sm, 14px); }
                .comparison-matrix th, .comparison-matrix td { padding: var(--spacing-sm, 12px); border: 1px solid var(--platinum, #e0e0e0); text-align: left; }
                .comparison-matrix th { background: var(--yinmn-blue, #485696); color: white; }
                .comparison-matrix th.your-domain { background: #28a745; }
                .comparison-matrix td.your-domain { background: #28a74510; }
                .category-row td { background: var(--bg-secondary, #f5f5f5); }
                .metric-name { font-weight: 500; }
                .metric-desc { font-size: var(--text-xs, 12px); color: var(--text-muted, #666); }
                .comparison-matrix input { width: 100%; padding: 6px; border: 1px solid var(--platinum, #e0e0e0); border-radius: 4px; text-align: center; }
                .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md, 16px); }
                .swot-card { padding: var(--spacing-md, 16px); border-radius: var(--radius, 8px); }
                .swot-card h5 { margin: 0 0 var(--spacing-md, 16px) 0; }
                .swot-card.strengths { background: #28a74515; border: 1px solid #28a74540; }
                .swot-card.weaknesses { background: #dc354515; border: 1px solid #dc354540; }
                .swot-card.opportunities { background: #007bff15; border: 1px solid #007bff40; }
                .swot-card.threats { background: #ffc10715; border: 1px solid #ffc10740; }
                .swot-item { display: flex; align-items: flex-start; gap: var(--spacing-xs, 6px); margin-bottom: var(--spacing-xs, 8px); font-size: var(--text-sm, 14px); }
                .swot-card textarea { width: 100%; margin-top: var(--spacing-sm, 10px); padding: var(--spacing-sm, 10px); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); resize: vertical; min-height: 60px; }
                .action-list { display: flex; flex-direction: column; gap: var(--spacing-sm, 10px); }
                .action-item { display: flex; align-items: center; gap: var(--spacing-sm, 10px); padding: var(--spacing-sm, 12px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 6px); border-left: 3px solid var(--platinum, #ccc); }
                .action-item.high { border-left-color: #dc3545; }
                .action-item.medium { border-left-color: #ffc107; }
                .action-item.low { border-left-color: #28a745; }
                @media (max-width: 768px) {
                    .form-row, .swot-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default CompetitorAnalysisTemplate;
