import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const BacklinkStrategyPlanner = () => {
    const [niche, setNiche] = useState('');
    const [contentTypes, setContentTypes] = useState(['blog']);
    const [authorityLevel, setAuthorityLevel] = useState('low');
    const [plan, setPlan] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'backlink-strategy-planner').slice(0, 3);

    const tactics = {
        guestPosting: {
            label: '✍️ Guest Posting',
            description: 'Write articles for other sites in exchange for backlinks',
            difficulty: 'medium',
            impact: 'high',
            steps: [
                'Identify 20+ sites in your niche accepting guest posts',
                'Analyze their content and audience',
                'Craft personalized pitch emails',
                'Write high-quality, unique content',
                'Include 1-2 contextual links to your site'
            ],
            template: `Subject: Guest Post Idea for [Site Name]

Hi [Name],

I've been a reader of [Site Name] for a while and love your content on [Topic].

I'd like to contribute a guest post on "[Proposed Topic]" that I think your audience would find valuable. Here's a brief outline:

[Outline Points]

My background: [Brief bio]

Would you be open to this? I'm happy to adjust based on your editorial guidelines.

Best,
[Your Name]`
        },
        resourceLinkBuilding: {
            label: '📚 Resource Link Building',
            description: 'Get listed on resource pages and industry roundups',
            difficulty: 'medium',
            impact: 'medium',
            steps: [
                'Search for resource pages: "[niche] + resources" or "[niche] + useful links"',
                'Compile a list of relevant resource pages',
                'Ensure you have linkable content that fits their list',
                'Reach out with a concise request to be included',
                'Follow up after 1-2 weeks if no response'
            ],
            template: `Subject: Resource Addition Suggestion for [Page Title]

Hi [Name],

I came across your excellent resource page on [Topic]: [URL]

I noticed you link to resources about [Specific Topic]. I recently created a [comprehensive guide/tool/resource] that covers [Brief Description]: [Your URL]

I thought it might be a valuable addition for your readers.

Thanks for putting together such a helpful resource!

Best,
[Your Name]`
        },
        brokenLinkBuilding: {
            label: '🔗 Broken Link Building',
            description: 'Find broken links on other sites and offer your content as replacement',
            difficulty: 'medium',
            impact: 'high',
            steps: [
                'Find resource pages with multiple outbound links',
                'Use a tool to check for broken links',
                'Create or identify content that could replace broken ones',
                'Reach out to webmaster with helpful suggestion',
                'Offer your content as alternative resource'
            ],
            template: `Subject: Broken Link on [Page Title]

Hi [Name],

I was reading your excellent post on [Topic] and noticed that one of your links seems to be broken:

Broken link: [Broken URL]
On page: [Their Page URL]

I actually have a similar resource that covers [Topic]: [Your URL]

Happy to help you update it, or no worries if you have another resource in mind!

Best,
[Your Name]`
        },
        skyscraper: {
            label: '🏗️ Skyscraper Technique',
            description: 'Create better content than top-ranked pages and reach out to linkers',
            difficulty: 'high',
            impact: 'high',
            steps: [
                'Find popular content with many backlinks in your niche',
                'Create significantly better content (longer, updated, better design)',
                'Find sites linking to original content',
                'Reach out explaining your improved version',
                'Suggest they update their link to your resource'
            ],
            template: `Subject: Updated Resource on [Topic]

Hi [Name],

I noticed you linked to [Original Article] in your post about [Topic].

I recently created an updated, more comprehensive version that includes:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

Here's the link: [Your URL]

Thought it might be worth checking out as a potential replacement for your readers!

Best,
[Your Name]`
        },
        haro: {
            label: '📰 HARO/Journalist Outreach',
            description: 'Respond to journalist queries for quotes and backlinks',
            difficulty: 'low',
            impact: 'high',
            steps: [
                'Sign up for HARO, Qwoted, or similar platforms',
                'Set up alerts for your niche keywords',
                'Respond quickly to relevant queries (within hours)',
                'Provide genuine expert insights with bio and credentials',
                'Include your website URL in response'
            ],
            template: null
        },
        digitalPR: {
            label: '📣 Digital PR',
            description: 'Create newsworthy content that attracts media coverage',
            difficulty: 'high',
            impact: 'high',
            steps: [
                'Create original research, surveys, or data studies',
                'Build a media list of relevant journalists',
                'Craft compelling press angles',
                'Pitch journalists with exclusive data',
                'Follow up and offer additional assets'
            ],
            template: `Subject: [Data-Driven Headline That Creates Curiosity]

Hi [Name],

[Opening hook with key stat or finding]

I'm reaching out because I recently conducted [research type] that reveals [surprising finding].

Key findings:
• [Stat 1]
• [Stat 2]
• [Stat 3]

I'd be happy to provide exclusive data, quotes, or graphics for your story.

[Link to full research]

Best,
[Your Name]
[Title/Credentials]`
        }
    };

    const toggleContentType = (type) => {
        if (contentTypes.includes(type)) {
            if (contentTypes.length > 1) setContentTypes(contentTypes.filter(t => t !== type));
        } else {
            setContentTypes([...contentTypes, type]);
        }
    };

    const generatePlan = () => {
        if (!niche.trim()) { alert('Please enter your niche/industry'); return; }

        const recommended = [];

        // Filter tactics based on authority level
        Object.entries(tactics).forEach(([key, tactic]) => {
            if (authorityLevel === 'low' && tactic.difficulty === 'high') return;
            if (authorityLevel === 'high' || (authorityLevel === 'medium' && tactic.difficulty !== 'high') || (authorityLevel === 'low' && tactic.difficulty === 'low')) {
                recommended.push({ key, ...tactic });
            } else if (authorityLevel === 'medium' || authorityLevel === 'low') {
                recommended.push({ key, ...tactic });
            }
        });

        const monthlyGoals = {
            low: { links: '2-5', guestPosts: '1-2', outreach: '50 emails' },
            medium: { links: '5-10', guestPosts: '2-4', outreach: '100 emails' },
            high: { links: '10-20', guestPosts: '4-8', outreach: '200 emails' }
        };

        setPlan({
            niche,
            authorityLevel,
            tactics: recommended,
            goals: monthlyGoals[authorityLevel]
        });
    };

    const exportMarkdown = () => {
        if (!plan) return;
        let md = `# Backlink Strategy Plan\n\n`;
        md += `**Niche:** ${plan.niche}\n`;
        md += `**Authority Level:** ${plan.authorityLevel}\n`;
        md += `**Generated:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

        md += `## Monthly Goals\n`;
        md += `- New backlinks: ${plan.goals.links}\n`;
        md += `- Guest posts: ${plan.goals.guestPosts}\n`;
        md += `- Outreach volume: ${plan.goals.outreach}\n\n`;

        md += `## Recommended Tactics\n\n`;
        plan.tactics.forEach(tactic => {
            md += `### ${tactic.label}\n`;
            md += `${tactic.description}\n\n`;
            md += `**Steps:**\n`;
            tactic.steps.forEach((step, i) => { md += `${i + 1}. ${step}\n`; });
            if (tactic.template) {
                md += `\n**Outreach Template:**\n\`\`\`\n${tactic.template}\n\`\`\`\n`;
            }
            md += '\n';
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backlink-strategy-plan.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const faqs = [
        { question: 'How many backlinks do I need?', answer: 'Quality over quantity. A few links from high-authority sites are worth more than many low-quality links. Focus on relevant, authoritative sources in your niche.' },
        { question: 'How long does link building take?', answer: 'Link building is a long-term strategy. Expect 3-6 months to see meaningful results. Consistency in outreach and content creation is key.' },
        { question: 'What makes a good backlink?', answer: 'The best backlinks come from relevant, authoritative sites in your niche, are editorially placed within content, and use natural anchor text.' }
    ];

    const seoContent = (<><h2>Backlink Strategy Planner</h2><p>Create a comprehensive link building roadmap with recommended tactics, outreach templates, and monthly goals tailored to your authority level.</p></>);

    return (
        <ToolLayout title="Backlink Strategy Planner" description="Generate a link building roadmap with tactics, outreach templates, and monthly goals." keywords={['backlink strategy', 'link building', 'outreach templates', 'SEO backlinks', 'guest posting']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="backlink-container">
                <div className="backlink-form">
                    <div className="form-group">
                        <label className="form-label">Your Niche/Industry</label>
                        <input type="text" className="form-input" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., Digital Marketing, SaaS, Health & Fitness" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Current Authority Level</label>
                        <div className="level-options">
                            {['low', 'medium', 'high'].map(level => (
                                <button key={level} className={`level-btn ${authorityLevel === level ? 'active' : ''}`} onClick={() => setAuthorityLevel(level)}>
                                    {level === 'low' && '🌱 Low (DA < 20)'}
                                    {level === 'medium' && '📈 Medium (DA 20-40)'}
                                    {level === 'high' && '🚀 High (DA 40+)'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generatePlan}>🔗 Generate Strategy</button>
                </div>

                {plan && (
                    <div className="plan-output">
                        <div className="plan-header">
                            <div>
                                <h3>Backlink Strategy for {plan.niche}</h3>
                                <p className="plan-meta">Authority: {plan.authorityLevel}</p>
                            </div>
                            <button className="btn-export" onClick={exportMarkdown}>📄 Download Plan</button>
                        </div>

                        {/* Goals */}
                        <div className="goals-section">
                            <h4>🎯 Monthly Goals</h4>
                            <div className="goals-grid">
                                <div className="goal-card"><span className="goal-value">{plan.goals.links}</span><span className="goal-label">New Backlinks</span></div>
                                <div className="goal-card"><span className="goal-value">{plan.goals.guestPosts}</span><span className="goal-label">Guest Posts</span></div>
                                <div className="goal-card"><span className="goal-value">{plan.goals.outreach}</span><span className="goal-label">Outreach Emails</span></div>
                            </div>
                        </div>

                        {/* Tactics */}
                        <div className="tactics-section">
                            <h4>📋 Recommended Tactics</h4>
                            {plan.tactics.map((tactic, idx) => (
                                <details key={idx} className="tactic-card">
                                    <summary>
                                        <div className="tactic-header">
                                            <span className="tactic-title">{tactic.label}</span>
                                            <div className="tactic-badges">
                                                <span className={`badge difficulty ${tactic.difficulty}`}>{tactic.difficulty}</span>
                                                <span className={`badge impact ${tactic.impact}`}>{tactic.impact} impact</span>
                                            </div>
                                        </div>
                                        <p className="tactic-desc">{tactic.description}</p>
                                    </summary>
                                    <div className="tactic-content">
                                        <h5>Steps:</h5>
                                        <ol className="steps-list">
                                            {tactic.steps.map((step, i) => (
                                                <li key={i}><input type="checkbox" id={`step-${idx}-${i}`} /><label htmlFor={`step-${idx}-${i}`}>{step}</label></li>
                                            ))}
                                        </ol>
                                        {tactic.template && (
                                            <div className="template-section">
                                                <h5>📧 Outreach Template:</h5>
                                                <pre className="template-code">{tactic.template}</pre>
                                                <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(tactic.template); alert('Template copied!'); }}>📋 Copy Template</button>
                                            </div>
                                        )}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .backlink-container { max-width: 900px; margin: 0 auto; }
                .backlink-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-input { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .level-options { display: flex; gap: var(--spacing-sm, 10px); flex-wrap: wrap; margin-top: var(--spacing-sm, 8px); }
                .level-btn { flex: 1; min-width: 150px; padding: var(--spacing-md, 14px); background: white; border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); cursor: pointer; transition: all 0.2s; text-align: center; }
                .level-btn:hover { border-color: var(--yinmn-blue, #485696); }
                .level-btn.active { background: var(--yinmn-blue, #485696); color: white; border-color: var(--yinmn-blue, #485696); }
                .plan-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .plan-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .plan-header h3 { margin: 0; }
                .plan-meta { color: var(--text-muted, #666); margin-top: 4px; text-transform: capitalize; }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .goals-section { margin-bottom: var(--spacing-xl, 32px); }
                .goals-section h4, .tactics-section h4 { margin-bottom: var(--spacing-md, 16px); }
                .goals-grid { display: flex; gap: var(--spacing-md, 16px); flex-wrap: wrap; }
                .goal-card { flex: 1; min-width: 120px; text-align: center; padding: var(--spacing-lg, 24px); background: linear-gradient(135deg, #667eea15, #764ba215); border-radius: var(--radius, 8px); }
                .goal-value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--yinmn-blue, #485696); }
                .goal-label { font-size: var(--text-sm, 14px); color: var(--text-muted, #666); }
                .tactic-card { background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-md, 16px); overflow: hidden; }
                .tactic-card summary { padding: var(--spacing-md, 16px); cursor: pointer; list-style: none; }
                .tactic-card summary::-webkit-details-marker { display: none; }
                .tactic-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-sm, 10px); }
                .tactic-title { font-weight: 600; font-size: 1.1rem; }
                .tactic-badges { display: flex; gap: var(--spacing-xs, 6px); }
                .badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; text-transform: capitalize; }
                .badge.difficulty.low { background: #28a74520; color: #28a745; }
                .badge.difficulty.medium { background: #ffc10720; color: #d39e00; }
                .badge.difficulty.high { background: #dc354520; color: #dc3545; }
                .badge.impact.high { background: #007bff20; color: #007bff; }
                .badge.impact.medium { background: #17a2b820; color: #17a2b8; }
                .tactic-desc { font-size: var(--text-sm, 14px); color: var(--text-muted, #666); margin-top: var(--spacing-xs, 6px); }
                .tactic-content { padding: 0 var(--spacing-md, 16px) var(--spacing-md, 16px); }
                .tactic-content h5 { margin: var(--spacing-md, 16px) 0 var(--spacing-sm, 10px) 0; }
                .steps-list { padding-left: 20px; }
                .steps-list li { margin-bottom: var(--spacing-sm, 10px); display: flex; align-items: flex-start; gap: var(--spacing-sm, 8px); }
                .steps-list input { margin-top: 4px; }
                .steps-list label { cursor: pointer; }
                .template-section { margin-top: var(--spacing-lg, 24px); }
                .template-code { background: #1e1e1e; color: #f0f0f0; padding: var(--spacing-md, 16px); border-radius: var(--radius, 6px); font-family: var(--font-mono, monospace); font-size: var(--text-sm, 13px); white-space: pre-wrap; overflow-x: auto; }
                .copy-btn { margin-top: var(--spacing-sm, 10px); padding: var(--spacing-xs, 8px) var(--spacing-md, 16px); background: var(--yinmn-blue, #485696); color: white; border: none; border-radius: var(--radius, 6px); cursor: pointer; }
                @media (max-width: 600px) {
                    .level-options { flex-direction: column; }
                    .goals-grid { flex-direction: column; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default BacklinkStrategyPlanner;
