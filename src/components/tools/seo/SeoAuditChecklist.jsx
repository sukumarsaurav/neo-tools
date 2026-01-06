import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const SeoAuditChecklist = () => {
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [websiteType, setWebsiteType] = useState('blog');
    const [businessGoal, setBusinessGoal] = useState('traffic');
    const [seoLevel, setSeoLevel] = useState('beginner');
    const [checklist, setChecklist] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'seo-audit-checklist').slice(0, 3);

    const checklistData = {
        technical: {
            label: '⚙️ Technical SEO',
            items: {
                beginner: [
                    { task: 'Verify website is accessible (not returning 404/500 errors)', priority: 'high' },
                    { task: 'Ensure HTTPS/SSL certificate is installed and working', priority: 'high' },
                    { task: 'Check that robots.txt file exists and is correctly configured', priority: 'high' },
                    { task: 'Create and submit XML sitemap to Google Search Console', priority: 'high' },
                    { task: 'Set up Google Search Console and verify ownership', priority: 'high' },
                    { task: 'Ensure website is mobile-friendly (responsive design)', priority: 'high' }
                ],
                intermediate: [
                    { task: 'Audit Core Web Vitals (LCP, FID, CLS) in PageSpeed Insights', priority: 'high' },
                    { task: 'Check and fix any crawl errors in Search Console', priority: 'high' },
                    { task: 'Implement proper canonical tags on all pages', priority: 'medium' },
                    { task: 'Review and optimize URL structure for SEO', priority: 'medium' },
                    { task: 'Set up proper 301 redirects for any changed URLs', priority: 'medium' },
                    { task: 'Implement structured data/schema markup on key pages', priority: 'medium' }
                ],
                advanced: [
                    { task: 'Analyze and optimize crawl budget efficiency', priority: 'medium' },
                    { task: 'Implement hreflang tags for international sites', priority: 'medium' },
                    { task: 'Set up log file analysis for crawler behavior', priority: 'low' },
                    { task: 'Optimize server response times (TTFB < 200ms)', priority: 'high' },
                    { task: 'Implement preloading for critical resources', priority: 'medium' },
                    { task: 'Review and optimize JavaScript rendering for SEO', priority: 'high' }
                ]
            }
        },
        onPage: {
            label: '📄 On-Page SEO',
            items: {
                beginner: [
                    { task: 'Write unique, compelling title tags for each page (50-60 chars)', priority: 'high' },
                    { task: 'Create unique meta descriptions for each page (150-160 chars)', priority: 'high' },
                    { task: 'Use only one H1 tag per page with target keyword', priority: 'high' },
                    { task: 'Add alt text to all images with descriptive text', priority: 'medium' },
                    { task: 'Ensure content is at least 300+ words on main pages', priority: 'medium' },
                    { task: 'Include target keywords naturally in content', priority: 'medium' }
                ],
                intermediate: [
                    { task: 'Optimize heading hierarchy (H1 → H2 → H3)', priority: 'medium' },
                    { task: 'Add internal links to related content (3-5 per page)', priority: 'high' },
                    { task: 'Optimize images (compress, WebP format, lazy loading)', priority: 'medium' },
                    { task: 'Ensure content matches search intent for target keywords', priority: 'high' },
                    { task: 'Add FAQ sections with schema markup', priority: 'medium' },
                    { task: 'Implement breadcrumb navigation with schema', priority: 'medium' }
                ],
                advanced: [
                    { task: 'Conduct content gap analysis vs. competitors', priority: 'high' },
                    { task: 'Optimize for featured snippets and rich results', priority: 'medium' },
                    { task: 'Implement topic clustering strategy', priority: 'high' },
                    { task: 'A/B test title tags and meta descriptions', priority: 'low' },
                    { task: 'Create comprehensive cornerstone content (2000+ words)', priority: 'medium' },
                    { task: 'Optimize for People Also Ask (PAA) sections', priority: 'medium' }
                ]
            }
        },
        offPage: {
            label: '🔗 Off-Page SEO',
            items: {
                beginner: [
                    { task: 'Claim Google Business Profile (for local businesses)', priority: 'high' },
                    { task: 'Set up social media profiles with consistent NAP info', priority: 'medium' },
                    { task: 'Submit to major business directories (Yelp, Yellow Pages)', priority: 'medium' },
                    { task: 'Encourage customers to leave Google reviews', priority: 'medium' }
                ],
                intermediate: [
                    { task: 'Conduct backlink audit and disavow toxic links', priority: 'high' },
                    { task: 'Identify and pursue guest posting opportunities', priority: 'medium' },
                    { task: 'Build relationships with industry influencers', priority: 'medium' },
                    { task: 'Create shareable content (infographics, studies)', priority: 'medium' },
                    { task: 'Monitor brand mentions and convert to backlinks', priority: 'medium' }
                ],
                advanced: [
                    { task: 'Develop digital PR strategy for high-authority links', priority: 'high' },
                    { task: 'Create data-driven content for natural link building', priority: 'high' },
                    { task: 'Build strategic partnerships for co-marketing', priority: 'medium' },
                    { task: 'Conduct competitor backlink gap analysis', priority: 'high' },
                    { task: 'Implement broken link building campaigns', priority: 'medium' }
                ]
            }
        },
        content: {
            label: '✍️ Content Strategy',
            items: {
                beginner: [
                    { task: 'Create a basic keyword list for your niche', priority: 'high' },
                    { task: 'Write at least 5-10 foundational blog posts', priority: 'medium' },
                    { task: 'Ensure all content is original and not duplicated', priority: 'high' },
                    { task: 'Add clear calls-to-action (CTAs) to content', priority: 'medium' }
                ],
                intermediate: [
                    { task: 'Develop a content calendar for consistent publishing', priority: 'high' },
                    { task: 'Update and refresh older content (at least quarterly)', priority: 'medium' },
                    { task: 'Create content for each stage of buyer journey', priority: 'medium' },
                    { task: 'Implement content repurposing strategy', priority: 'low' }
                ],
                advanced: [
                    { task: 'Build content hubs around primary topics', priority: 'high' },
                    { task: 'Create proprietary research and data studies', priority: 'medium' },
                    { task: 'Develop video content strategy alongside blog', priority: 'medium' },
                    { task: 'Implement personalized content recommendations', priority: 'low' }
                ]
            }
        },
        analytics: {
            label: '📊 Analytics & Tracking',
            items: {
                beginner: [
                    { task: 'Install Google Analytics 4 and verify tracking', priority: 'high' },
                    { task: 'Set up Google Search Console', priority: 'high' },
                    { task: 'Configure basic conversion goals (contact forms, signups)', priority: 'medium' }
                ],
                intermediate: [
                    { task: 'Set up UTM tracking for marketing campaigns', priority: 'medium' },
                    { task: 'Create custom dashboards for SEO metrics', priority: 'medium' },
                    { task: 'Set up rank tracking for target keywords', priority: 'high' },
                    { task: 'Monitor and analyze user behavior (scroll depth, engagement)', priority: 'medium' }
                ],
                advanced: [
                    { task: 'Implement enhanced e-commerce tracking', priority: 'high' },
                    { task: 'Set up attribution modeling for conversions', priority: 'medium' },
                    { task: 'Create automated SEO reporting dashboards', priority: 'medium' },
                    { task: 'Integrate CRM with analytics for full-funnel tracking', priority: 'low' }
                ]
            }
        }
    };

    // Goal-specific items
    const goalItems = {
        traffic: [
            { task: 'Identify 20+ high-volume keywords in your niche', priority: 'high', category: 'content' },
            { task: 'Analyze top 10 competitors for content gaps', priority: 'high', category: 'content' },
            { task: 'Plan to publish at least 4-8 new articles monthly', priority: 'medium', category: 'content' }
        ],
        local: [
            { task: 'Optimize Google Business Profile with photos and posts', priority: 'high', category: 'offPage' },
            { task: 'Build citations on 20+ local business directories', priority: 'high', category: 'offPage' },
            { task: 'Create location-specific landing pages', priority: 'medium', category: 'onPage' },
            { task: 'Encourage and respond to customer reviews', priority: 'high', category: 'offPage' }
        ],
        international: [
            { task: 'Implement hreflang tags for all language versions', priority: 'high', category: 'technical' },
            { task: 'Use country-specific domains or subdirectories', priority: 'medium', category: 'technical' },
            { task: 'Translate (not just translate) content for local markets', priority: 'high', category: 'content' }
        ],
        brand: [
            { task: 'Create branded content and thought leadership pieces', priority: 'high', category: 'content' },
            { task: 'Build presence on industry publications', priority: 'medium', category: 'offPage' },
            { task: 'Monitor brand mentions and sentiment', priority: 'medium', category: 'analytics' }
        ],
        ecommerce: [
            { task: 'Implement product schema on all product pages', priority: 'high', category: 'technical' },
            { task: 'Optimize product titles and descriptions for search', priority: 'high', category: 'onPage' },
            { task: 'Create category page content with buying guides', priority: 'medium', category: 'content' },
            { task: 'Set up review schema for product ratings', priority: 'high', category: 'technical' }
        ]
    };

    const generateChecklist = () => {
        const levels = ['beginner'];
        if (seoLevel === 'intermediate' || seoLevel === 'advanced') levels.push('intermediate');
        if (seoLevel === 'advanced') levels.push('advanced');

        const result = {};
        Object.entries(checklistData).forEach(([key, section]) => {
            result[key] = {
                label: section.label,
                items: levels.flatMap(level => section.items[level] || [])
            };
        });

        // Add goal-specific items
        const goals = goalItems[businessGoal] || [];
        goals.forEach(item => {
            if (result[item.category]) {
                result[item.category].items.push({ ...item, isGoalSpecific: true });
            }
        });

        // Add e-commerce specific items if type is ecommerce
        if (websiteType === 'ecommerce') {
            goalItems.ecommerce.forEach(item => {
                if (result[item.category] && !result[item.category].items.find(i => i.task === item.task)) {
                    result[item.category].items.push({ ...item, isTypeSpecific: true });
                }
            });
        }

        setChecklist(result);
    };

    const exportMarkdown = () => {
        if (!checklist) return;
        let md = `# SEO Audit Checklist\n\n`;
        md += `**Website:** ${websiteUrl || 'Not specified'}\n`;
        md += `**Type:** ${websiteType}\n`;
        md += `**Goal:** ${businessGoal}\n`;
        md += `**Level:** ${seoLevel}\n\n`;
        md += `Generated on: ${new Date().toLocaleDateString()}\n\n---\n\n`;

        Object.values(checklist).forEach(section => {
            md += `## ${section.label}\n\n`;
            section.items.forEach(item => {
                const priority = item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢';
                md += `- [ ] ${priority} ${item.task}\n`;
            });
            md += '\n';
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'seo-audit-checklist.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        if (!checklist) return;
        const data = {
            metadata: { websiteUrl, websiteType, businessGoal, seoLevel, generatedAt: new Date().toISOString() },
            checklist
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'seo-audit-checklist.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getTotalItems = () => {
        if (!checklist) return 0;
        return Object.values(checklist).reduce((sum, section) => sum + section.items.length, 0);
    };

    const faqs = [
        { question: 'What is an SEO audit?', answer: 'An SEO audit is a comprehensive analysis of your website to identify issues affecting search visibility and rankings. It covers technical, on-page, off-page, and content factors.' },
        { question: 'How often should I do an SEO audit?', answer: 'Full audits should be done quarterly. However, you should monitor key metrics weekly and address critical issues immediately.' },
        { question: 'What tools do I need for an SEO audit?', answer: 'Essential tools include Google Search Console (free), Google Analytics (free), and specialized tools like Screaming Frog, Ahrefs, or SEMrush for deeper analysis.' }
    ];

    const seoContent = (<><h2>SEO Audit Checklist Generator</h2><p>Generate a customized SEO audit checklist based on your website type, business goals, and current SEO expertise level. Perfect for creating a systematic approach to improving your search rankings.</p></>);

    return (
        <ToolLayout title="SEO Audit Checklist Generator" description="Generate a customized SEO audit checklist for your website based on type, goals, and expertise level." keywords={['SEO audit', 'SEO checklist', 'website audit', 'technical SEO', 'SEO planning']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="audit-container">
                <div className="audit-form">
                    <div className="form-group">
                        <label className="form-label">Website URL (optional)</label>
                        <input type="url" className="form-input" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yourwebsite.com" />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Website Type</label>
                            <select className="form-select" value={websiteType} onChange={(e) => setWebsiteType(e.target.value)}>
                                <option value="blog">Blog / Content Site</option>
                                <option value="ecommerce">E-commerce / Online Store</option>
                                <option value="saas">SaaS / Software</option>
                                <option value="portfolio">Portfolio / Agency</option>
                                <option value="local">Local Business</option>
                                <option value="news">News / Media</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Primary Business Goal</label>
                            <select className="form-select" value={businessGoal} onChange={(e) => setBusinessGoal(e.target.value)}>
                                <option value="traffic">Increase Organic Traffic</option>
                                <option value="local">Improve Local SEO</option>
                                <option value="international">International/Multi-language</option>
                                <option value="brand">Build Brand Authority</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Current SEO Experience Level</label>
                        <div className="level-selector">
                            {['beginner', 'intermediate', 'advanced'].map(level => (
                                <button key={level} className={`level-btn ${seoLevel === level ? 'active' : ''}`} onClick={() => setSeoLevel(level)}>
                                    {level === 'beginner' && '🌱'} {level === 'intermediate' && '📈'} {level === 'advanced' && '🚀'}
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generateChecklist}>📋 Generate Checklist</button>
                </div>

                {checklist && (
                    <div className="checklist-output">
                        <div className="checklist-header">
                            <div>
                                <h3>Your SEO Audit Checklist</h3>
                                <p className="checklist-count">{getTotalItems()} tasks across {Object.keys(checklist).length} categories</p>
                            </div>
                            <div className="export-btns">
                                <button className="btn-export" onClick={exportMarkdown}>📄 Download MD</button>
                                <button className="btn-export" onClick={exportJSON}>{ } Download JSON</button>
                            </div>
                        </div>

                        <div className="priority-legend">
                            <span className="legend-item"><span className="priority-dot high"></span> High Priority</span>
                            <span className="legend-item"><span className="priority-dot medium"></span> Medium Priority</span>
                            <span className="legend-item"><span className="priority-dot low"></span> Low Priority</span>
                        </div>

                        {Object.entries(checklist).map(([key, section]) => (
                            <div key={key} className="checklist-section">
                                <h4>{section.label}</h4>
                                <ul className="checklist-items">
                                    {section.items.map((item, idx) => (
                                        <li key={idx} className={`checklist-item ${item.priority}`}>
                                            <input type="checkbox" id={`${key}-${idx}`} />
                                            <label htmlFor={`${key}-${idx}`}>
                                                {item.task}
                                                {item.isGoalSpecific && <span className="tag goal">Goal-specific</span>}
                                                {item.isTypeSpecific && <span className="tag type">Type-specific</span>}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .audit-container { max-width: 900px; margin: 0 auto; }
                .audit-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md, 16px); }
                .form-input, .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .form-input:focus, .form-select:focus { outline: none; border-color: var(--yinmn-blue, #485696); }
                .level-selector { display: flex; gap: var(--spacing-sm, 12px); flex-wrap: wrap; }
                .level-btn { flex: 1; min-width: 120px; padding: var(--spacing-md, 16px); background: white; border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); cursor: pointer; font-weight: 500; transition: all 0.2s; }
                .level-btn:hover { border-color: var(--yinmn-blue, #485696); }
                .level-btn.active { background: var(--yinmn-blue, #485696); color: white; border-color: var(--yinmn-blue, #485696); }
                .checklist-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .checklist-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); padding-bottom: var(--spacing-md, 16px); border-bottom: 1px solid var(--platinum, #e0e0e0); }
                .checklist-header h3 { margin: 0; }
                .checklist-count { color: var(--text-muted, #666); font-size: var(--text-sm, 14px); margin-top: 4px; }
                .export-btns { display: flex; gap: var(--spacing-sm, 8px); }
                .btn-export { padding: var(--spacing-xs, 8px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; font-size: var(--text-sm, 14px); }
                .btn-export:hover { background: var(--platinum, #e0e0e0); }
                .priority-legend { display: flex; gap: var(--spacing-lg, 24px); margin-bottom: var(--spacing-lg, 24px); font-size: var(--text-sm, 14px); flex-wrap: wrap; }
                .legend-item { display: flex; align-items: center; gap: var(--spacing-xs, 6px); }
                .priority-dot { width: 12px; height: 12px; border-radius: 50%; }
                .priority-dot.high { background: #dc3545; }
                .priority-dot.medium { background: #ffc107; }
                .priority-dot.low { background: #28a745; }
                .checklist-section { margin-bottom: var(--spacing-xl, 32px); }
                .checklist-section h4 { font-size: 1.1rem; margin-bottom: var(--spacing-md, 16px); padding-bottom: var(--spacing-xs, 8px); border-bottom: 2px solid var(--yinmn-blue, #485696); }
                .checklist-items { list-style: none; padding: 0; margin: 0; }
                .checklist-item { display: flex; align-items: flex-start; gap: var(--spacing-sm, 12px); padding: var(--spacing-sm, 12px); border-radius: var(--radius, 6px); margin-bottom: var(--spacing-xs, 8px); transition: background 0.2s; }
                .checklist-item:hover { background: var(--bg-secondary, #f9f9f9); }
                .checklist-item.high { border-left: 3px solid #dc3545; }
                .checklist-item.medium { border-left: 3px solid #ffc107; }
                .checklist-item.low { border-left: 3px solid #28a745; }
                .checklist-item input[type="checkbox"] { margin-top: 4px; width: 18px; height: 18px; cursor: pointer; }
                .checklist-item label { cursor: pointer; line-height: 1.5; flex: 1; }
                .tag { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 10px; margin-left: 8px; font-weight: 500; }
                .tag.goal { background: #e3f2fd; color: #1565c0; }
                .tag.type { background: #f3e5f5; color: #7b1fa2; }
                @media (max-width: 600px) {
                    .form-row { grid-template-columns: 1fr; }
                    .checklist-header { flex-direction: column; }
                    .level-selector { flex-direction: column; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default SeoAuditChecklist;
