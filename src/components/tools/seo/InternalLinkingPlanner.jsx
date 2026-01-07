import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const InternalLinkingPlanner = () => {
    const toast = useToast();
    const [pages, setPages] = useState('');
    const [pillarPages, setPillarPages] = useState([]);
    const [linkingPlan, setLinkingPlan] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'internal-linking-planner').slice(0, 3);

    const parsePages = () => {
        return pages.split('\n').map(p => p.trim()).filter(p => p.length > 0).map((p, i) => ({
            id: i,
            title: p,
            isPillar: pillarPages.includes(i)
        }));
    };

    const generatePlan = () => {
        const pageList = parsePages();
        if (pageList.length < 3) {
            toast.warning('Please enter at least 3 pages for a meaningful linking structure');
            return;
        }
        if (pillarPages.length === 0) {
            toast.warning('Please select at least one pillar/hub page');
            return;
        }

        const pillars = pageList.filter(p => p.isPillar);
        const clusters = pageList.filter(p => !p.isPillar);

        // Distribute cluster pages among pillars
        const pillarClusters = {};
        pillars.forEach(p => { pillarClusters[p.id] = []; });

        clusters.forEach((cluster, idx) => {
            const pillarId = pillars[idx % pillars.length].id;
            pillarClusters[pillarId].push(cluster);
        });

        // Generate linking suggestions
        const suggestions = [];

        // Pillar to cluster links
        pillars.forEach(pillar => {
            const clusterPages = pillarClusters[pillar.id];
            clusterPages.forEach(cluster => {
                suggestions.push({
                    from: pillar.title,
                    to: cluster.title,
                    type: 'pillar-to-cluster',
                    reason: 'Hub page linking to supporting content'
                });
            });
        });

        // Cluster to pillar links
        clusters.forEach(cluster => {
            const assignedPillar = pillars.find(p => pillarClusters[p.id].includes(cluster));
            if (assignedPillar) {
                suggestions.push({
                    from: cluster.title,
                    to: assignedPillar.title,
                    type: 'cluster-to-pillar',
                    reason: 'Supporting content linking back to hub'
                });
            }
        });

        // Inter-cluster links (within same pillar)
        pillars.forEach(pillar => {
            const clusterPages = pillarClusters[pillar.id];
            for (let i = 0; i < clusterPages.length; i++) {
                for (let j = i + 1; j < clusterPages.length && j < i + 3; j++) {
                    suggestions.push({
                        from: clusterPages[i].title,
                        to: clusterPages[j].title,
                        type: 'cluster-to-cluster',
                        reason: 'Related content within same topic cluster'
                    });
                }
            }
        });

        setLinkingPlan({
            pillars,
            clusters,
            pillarClusters,
            suggestions,
            totalPages: pageList.length,
            totalLinks: suggestions.length
        });
    };

    const togglePillar = (idx) => {
        if (pillarPages.includes(idx)) {
            setPillarPages(pillarPages.filter(p => p !== idx));
        } else {
            setPillarPages([...pillarPages, idx]);
        }
    };

    const exportMarkdown = () => {
        if (!linkingPlan) return;
        let md = `# Internal Linking Plan\n\n`;
        md += `Generated: ${new Date().toLocaleDateString()}\n\n`;
        md += `## Summary\n- **Total Pages:** ${linkingPlan.totalPages}\n- **Pillar Pages:** ${linkingPlan.pillars.length}\n- **Cluster Pages:** ${linkingPlan.clusters.length}\n- **Suggested Links:** ${linkingPlan.totalLinks}\n\n`;

        md += `## Site Structure\n\n`;
        linkingPlan.pillars.forEach(pillar => {
            md += `### 🏛️ ${pillar.title} (Pillar)\n`;
            const clusters = linkingPlan.pillarClusters[pillar.id];
            clusters.forEach(c => { md += `- ${c.title}\n`; });
            md += '\n';
        });

        md += `## Linking Checklist\n\n`;
        linkingPlan.suggestions.forEach(s => {
            const icon = s.type === 'pillar-to-cluster' ? '🔽' : s.type === 'cluster-to-pillar' ? '🔼' : '↔️';
            md += `- [ ] ${icon} **${s.from}** → **${s.to}**\n  - _${s.reason}_\n\n`;
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'internal-linking-plan.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const faqs = [
        { question: 'What is internal linking?', answer: 'Internal linking connects pages within your website. It helps search engines understand your site structure and distributes page authority throughout your site.' },
        { question: 'What is a pillar/hub page?', answer: 'A pillar page is a comprehensive resource on a broad topic that links to related cluster content. It acts as the hub of a topic cluster.' },
        { question: 'How many internal links per page?', answer: 'Aim for 3-5 relevant internal links per page. Focus on contextual links within content rather than just navigation links.' }
    ];

    const seoContent = (<><h2>Internal Linking Structure Planner</h2><p>Plan your site&apos;s internal linking structure using the hub-and-spoke (pillar-cluster) model. Create a systematic approach to internal linking for better SEO.</p></>);

    return (
        <ToolLayout title="Internal Linking Structure Planner" description="Plan your site's internal linking with hub-and-spoke content clusters for better SEO." keywords={['internal linking', 'site structure', 'pillar pages', 'content clusters', 'SEO architecture']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="linking-container">
                <div className="linking-form">
                    <div className="form-group">
                        <label className="form-label">Enter Your Pages (one per line)</label>
                        <textarea className="form-input" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="Homepage&#10;Complete Guide to SEO&#10;Keyword Research Tips&#10;On-Page SEO Basics&#10;Technical SEO Checklist&#10;Link Building Strategies" rows={8} />
                    </div>

                    {pages.trim().length > 0 && (
                        <div className="page-selector">
                            <label className="form-label">Select Pillar/Hub Pages (click to toggle)</label>
                            <div className="page-list">
                                {parsePages().map((page, idx) => (
                                    <button key={idx} className={`page-btn ${page.isPillar ? 'pillar' : 'cluster'}`} onClick={() => togglePillar(idx)}>
                                        {page.isPillar ? '🏛️' : '📄'} {page.title}
                                    </button>
                                ))}
                            </div>
                            <p className="helper-text">Selected {pillarPages.length} pillar page(s)</p>
                        </div>
                    )}

                    <button className="btn btn-primary btn-lg" onClick={generatePlan}>🔗 Generate Linking Plan</button>
                </div>

                {linkingPlan && (
                    <div className="plan-output">
                        <div className="plan-header">
                            <div>
                                <h3>Internal Linking Plan</h3>
                                <p className="plan-meta">{linkingPlan.totalLinks} links across {linkingPlan.totalPages} pages</p>
                            </div>
                            <button className="btn-export" onClick={exportMarkdown}>📄 Download Plan</button>
                        </div>

                        {/* Stats */}
                        <div className="plan-stats">
                            <div className="stat"><span className="stat-icon">🏛️</span><span className="stat-value">{linkingPlan.pillars.length}</span><span className="stat-label">Pillar Pages</span></div>
                            <div className="stat"><span className="stat-icon">📄</span><span className="stat-value">{linkingPlan.clusters.length}</span><span className="stat-label">Cluster Pages</span></div>
                            <div className="stat"><span className="stat-icon">🔗</span><span className="stat-value">{linkingPlan.totalLinks}</span><span className="stat-label">Total Links</span></div>
                        </div>

                        {/* Visual Structure */}
                        <div className="structure-visual">
                            <h4>📊 Content Structure</h4>
                            {linkingPlan.pillars.map(pillar => (
                                <div key={pillar.id} className="pillar-group">
                                    <div className="pillar-card">🏛️ {pillar.title}</div>
                                    <div className="cluster-cards">
                                        {linkingPlan.pillarClusters[pillar.id].map(cluster => (
                                            <div key={cluster.id} className="cluster-card">📄 {cluster.title}</div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Linking Checklist */}
                        <div className="linking-checklist">
                            <h4>✅ Linking Checklist</h4>
                            <div className="link-list">
                                {linkingPlan.suggestions.map((s, idx) => (
                                    <div key={idx} className={`link-item ${s.type}`}>
                                        <input type="checkbox" id={`link-${idx}`} />
                                        <label htmlFor={`link-${idx}`}>
                                            <span className="link-arrow">
                                                {s.type === 'pillar-to-cluster' ? '🔽' : s.type === 'cluster-to-pillar' ? '🔼' : '↔️'}
                                            </span>
                                            <strong>{s.from}</strong> → <strong>{s.to}</strong>
                                            <span className="link-reason">{s.reason}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .linking-container { max-width: 900px; margin: 0 auto; }
                .linking-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-input { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; font-family: var(--font-mono, monospace); }
                .page-selector { margin: var(--spacing-lg, 24px) 0; }
                .page-list { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); margin-top: var(--spacing-sm, 8px); }
                .page-btn { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); border: 2px solid var(--platinum, #e0e0e0); border-radius: 20px; background: white; cursor: pointer; font-size: var(--text-sm, 14px); transition: all 0.2s; text-align: left; }
                .page-btn:hover { border-color: var(--yinmn-blue, #485696); }
                .page-btn.pillar { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-color: transparent; }
                .helper-text { font-size: var(--text-sm, 13px); color: var(--text-muted, #666); margin-top: var(--spacing-sm, 8px); }
                .plan-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .plan-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .plan-header h3 { margin: 0; }
                .plan-meta { color: var(--text-muted, #666); font-size: var(--text-sm, 14px); margin-top: 4px; }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .plan-stats { display: flex; gap: var(--spacing-lg, 24px); margin-bottom: var(--spacing-lg, 24px); }
                .stat { display: flex; align-items: center; gap: var(--spacing-sm, 10px); padding: var(--spacing-md, 16px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 8px); }
                .stat-icon { font-size: 1.5rem; }
                .stat-value { font-size: 1.5rem; font-weight: 700; color: var(--yinmn-blue, #485696); }
                .stat-label { font-size: var(--text-sm, 13px); color: var(--text-muted, #666); }
                .structure-visual { margin-bottom: var(--spacing-xl, 32px); }
                .structure-visual h4, .linking-checklist h4 { margin-bottom: var(--spacing-md, 16px); }
                .pillar-group { margin-bottom: var(--spacing-lg, 24px); }
                .pillar-card { display: inline-block; padding: var(--spacing-md, 16px) var(--spacing-lg, 24px); background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: var(--radius, 8px); font-weight: 600; margin-bottom: var(--spacing-sm, 10px); }
                .cluster-cards { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); padding-left: var(--spacing-xl, 32px); border-left: 3px solid var(--yinmn-blue, #485696); }
                .cluster-card { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border-radius: var(--radius, 6px); font-size: var(--text-sm, 14px); }
                .link-list { display: flex; flex-direction: column; gap: var(--spacing-sm, 10px); }
                .link-item { display: flex; align-items: flex-start; gap: var(--spacing-sm, 10px); padding: var(--spacing-md, 16px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 8px); border-left: 3px solid var(--platinum, #ccc); }
                .link-item.pillar-to-cluster { border-left-color: #667eea; }
                .link-item.cluster-to-pillar { border-left-color: #28a745; }
                .link-item.cluster-to-cluster { border-left-color: #17a2b8; }
                .link-item input { margin-top: 4px; }
                .link-item label { cursor: pointer; flex: 1; }
                .link-arrow { margin-right: var(--spacing-xs, 6px); }
                .link-reason { display: block; font-size: var(--text-sm, 13px); color: var(--text-muted, #666); margin-top: 4px; }
                @media (max-width: 600px) {
                    .plan-stats { flex-direction: column; }
                    .plan-header { flex-direction: column; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default InternalLinkingPlanner;
