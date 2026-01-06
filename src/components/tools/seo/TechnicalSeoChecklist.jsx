import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const TechnicalSeoChecklist = () => {
    const [platform, setPlatform] = useState('wordpress');
    const [priorities, setPriorities] = useState({ crawlability: true, performance: true, mobile: true, security: true, indexing: true });
    const [checklist, setChecklist] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'technical-seo-checklist').slice(0, 3);

    const checklistData = {
        crawlability: {
            label: '🕷️ Crawlability & Indexing',
            icon: '🕷️',
            items: [
                { task: 'Verify robots.txt allows crawling of important pages', priority: 'high', effort: 'low', impact: 'high', guide: 'Check robots.txt at your-site.com/robots.txt. Ensure important sections are not blocked.' },
                { task: 'Create and submit XML sitemap to Google Search Console', priority: 'high', effort: 'low', impact: 'high', guide: 'Generate sitemap using your CMS or tool. Submit in GSC > Sitemaps.' },
                { task: 'Check for crawl errors in Google Search Console', priority: 'high', effort: 'medium', impact: 'high', guide: 'GSC > Pages report. Look for 404s, server errors, and blocked pages.' },
                { task: 'Implement proper canonical tags on all pages', priority: 'high', effort: 'medium', impact: 'high', guide: 'Add <link rel="canonical" href="preferred-url"> in head section.' },
                { task: 'Fix broken internal links (404 errors)', priority: 'high', effort: 'medium', impact: 'high', guide: 'Use Screaming Frog or GSC to find and fix broken links.' },
                { task: 'Ensure proper use of noindex/nofollow directives', priority: 'medium', effort: 'low', impact: 'medium', guide: 'Only noindex pages you truly want hidden (admin, thank you pages, etc.).' },
                { task: 'Check for orphan pages (pages with no internal links)', priority: 'medium', effort: 'medium', impact: 'medium', guide: 'Audit site structure. Every important page should have internal links.' },
                { task: 'Verify proper redirect chains (avoid redirect loops)', priority: 'medium', effort: 'medium', impact: 'medium', guide: 'Use Screaming Frog to detect redirect chains. Aim for single 301 redirects.' }
            ]
        },
        performance: {
            label: '⚡ Performance & Core Web Vitals',
            icon: '⚡',
            items: [
                { task: 'Achieve LCP (Largest Contentful Paint) < 2.5 seconds', priority: 'high', effort: 'high', impact: 'high', guide: 'Optimize hero images, use CDN, implement lazy loading for below-fold images.' },
                { task: 'Achieve FID/INP (Interaction to Next Paint) < 200ms', priority: 'high', effort: 'high', impact: 'high', guide: 'Minimize JavaScript execution time, code-split large bundles.' },
                { task: 'Achieve CLS (Cumulative Layout Shift) < 0.1', priority: 'high', effort: 'medium', impact: 'high', guide: 'Set explicit width/height on images , reserve space for ads/embeds.' },
                { task: 'Enable GZIP/Brotli compression', priority: 'high', effort: 'low', impact: 'high', guide: 'Enable in server config (.htaccess for Apache, nginx.conf for NGINX).' },
                { task: 'Minify CSS, JavaScript, and HTML', priority: 'medium', effort: 'low', impact: 'medium', guide: 'Use build tools or plugins to minify assets automatically.' },
                { task: 'Optimize and compress images (WebP format)', priority: 'high', effort: 'medium', impact: 'high', guide: 'Convert images to WebP, compress without quality loss, use srcset.' },
                { task: 'Implement browser caching with proper headers', priority: 'medium', effort: 'low', impact: 'medium', guide: 'Set Cache-Control headers for static assets (images, CSS, JS).' },
                { task: 'Use a Content Delivery Network (CDN)', priority: 'medium', effort: 'medium', impact: 'high', guide: 'Cloudflare (free tier), AWS CloudFront, or similar for global distribution.' },
                { task: 'Reduce server response time (TTFB < 200ms)', priority: 'high', effort: 'high', impact: 'high', guide: 'Optimize database queries, use caching, upgrade hosting if needed.' },
                { task: 'Eliminate render-blocking resources', priority: 'medium', effort: 'medium', impact: 'medium', guide: 'Defer non-critical JS/CSS, inline critical CSS.' }
            ]
        },
        mobile: {
            label: '📱 Mobile & Responsiveness',
            icon: '📱',
            items: [
                { task: 'Ensure website passes Google Mobile-Friendly Test', priority: 'high', effort: 'varies', impact: 'high', guide: 'Test at search.google.com/test/mobile-friendly.' },
                { task: 'Verify proper viewport meta tag is set', priority: 'high', effort: 'low', impact: 'high', guide: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' },
                { task: 'Ensure tap targets are at least 48x48 pixels', priority: 'medium', effort: 'medium', impact: 'medium', guide: 'Buttons and links should be easy to tap without zooming.' },
                { task: 'Avoid horizontal scrolling on mobile devices', priority: 'high', effort: 'medium', impact: 'high', guide: 'Check for overflow issues, use max-width: 100% on images.' },
                { task: 'Font sizes are readable without zooming (16px+ base)', priority: 'medium', effort: 'low', impact: 'medium', guide: 'Set base font-size to 16px or larger for body text.' },
                { task: 'Forms are easy to complete on mobile', priority: 'medium', effort: 'medium', impact: 'medium', guide: 'Use proper input types (email, tel), avoid complex forms.' },
                { task: 'Content is not hidden behind interstitials/pop-ups', priority: 'high', effort: 'low', impact: 'high', guide: 'Google penalizes intrusive interstitials on mobile.' }
            ]
        },
        security: {
            label: '🔒 Security & HTTPS',
            icon: '🔒',
            items: [
                { task: 'Ensure entire site uses HTTPS', priority: 'high', effort: 'medium', impact: 'high', guide: 'Install SSL certificate, redirect all HTTP to HTTPS.' },
                { task: 'Fix mixed content warnings (HTTP resources on HTTPS)', priority: 'high', effort: 'medium', impact: 'high', guide: 'Update all internal links/resources to use HTTPS or protocol-relative URLs.' },
                { task: 'SSL certificate is valid and not expiring soon', priority: 'high', effort: 'low', impact: 'high', guide: 'Check SSL status, set up auto-renewal.' },
                { task: 'Implement HSTS (HTTP Strict Transport Security)', priority: 'medium', effort: 'low', impact: 'medium', guide: 'Add Strict-Transport-Security header to force HTTPS.' },
                { task: 'Set up Content Security Policy (CSP) headers', priority: 'low', effort: 'high', impact: 'medium', guide: 'Define allowed sources for scripts, styles, images.' },
                { task: 'Protect against clickjacking (X-Frame-Options)', priority: 'low', effort: 'low', impact: 'low', guide: 'Add X-Frame-Options: SAMEORIGIN header.' },
                { task: 'Use secure cookies with HttpOnly and Secure flags', priority: 'medium', effort: 'medium', impact: 'medium', guide: 'Set cookie flags in server/application configuration.' }
            ]
        },
        indexing: {
            label: '📋 Structured Data & Rich Results',
            icon: '📋',
            items: [
                { task: 'Implement Organization schema on homepage', priority: 'medium', effort: 'low', impact: 'medium', guide: 'Add JSON-LD script with @type: Organization, name, logo, url.' },
                { task: 'Add Breadcrumb schema to all pages', priority: 'medium', effort: 'medium', impact: 'medium', guide: 'Implement BreadcrumbList schema for navigation structure.' },
                { task: 'Implement Article schema on blog posts', priority: 'high', effort: 'medium', impact: 'high', guide: 'Add Article or BlogPosting schema with headline, author, datePublished.' },
                { task: 'Add FAQ schema to FAQ pages/sections', priority: 'medium', effort: 'low', impact: 'high', guide: 'Use FAQPage schema for question-answer content.' },
                { task: 'Implement Product schema for e-commerce', priority: 'high', effort: 'medium', impact: 'high', guide: 'Add Product schema with name, price, availability, reviews.' },
                { task: 'Add LocalBusiness schema for local businesses', priority: 'high', effort: 'low', impact: 'high', guide: 'Include address, phone, opening hours, geo coordinates.' },
                { task: 'Test structured data in Rich Results Test', priority: 'high', effort: 'low', impact: 'high', guide: 'Validate at search.google.com/test/rich-results.' },
                { task: 'Monitor structured data errors in Search Console', priority: 'medium', effort: 'low', impact: 'medium', guide: 'Check GSC > Enhancements for schema issues.' }
            ]
        }
    };

    const platformTips = {
        wordpress: [
            'Install Yoast SEO or RankMath for technical SEO basics',
            'Use WP Rocket or W3 Total Cache for performance',
            'Enable automatic sitemap generation in SEO plugin'
        ],
        shopify: [
            'Technical SEO is mostly handled by Shopify',
            'Focus on image optimization and app performance',
            'Use apps like Plug in SEO for additional checks'
        ],
        wix: [
            'Use Wix SEO Wizard for basic setup',
            'Performance optimization options are limited',
            'Consider migrating for advanced technical needs'
        ],
        custom: [
            'Implement all technical SEO elements manually',
            'Use server-level caching and optimization',
            'Consider using a headless CMS for better performance'
        ],
        react: [
            'Implement SSR or SSG for SEO (Next.js, Gatsby)',
            'Ensure proper meta tag management (react-helmet)',
            'Pre-render pages for search engine crawling'
        ],
        nextjs: [
            'Use getStaticProps/getServerSideProps for SEO pages',
            'Implement next/head for meta tags',
            'Use next/image for automatic image optimization'
        ]
    };

    const generateChecklist = () => {
        const result = {};
        Object.entries(checklistData).forEach(([key, section]) => {
            if (priorities[key]) {
                result[key] = { ...section };
            }
        });
        setChecklist(result);
    };

    const getEffortBadge = (effort) => {
        const colors = { low: '#28a745', medium: '#ffc107', high: '#dc3545' };
        return <span className="effort-badge" style={{ background: colors[effort] }}>{effort}</span>;
    };

    const getImpactBadge = (impact) => {
        const colors = { low: '#6c757d', medium: '#17a2b8', high: '#007bff' };
        return <span className="impact-badge" style={{ background: colors[impact] }}>{impact} impact</span>;
    };

    const exportMarkdown = () => {
        if (!checklist) return;
        let md = `# Technical SEO Checklist\n\n`;
        md += `**Platform:** ${platform}\n`;
        md += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
        md += `## Platform-Specific Tips\n`;
        (platformTips[platform] || []).forEach(tip => { md += `- ${tip}\n`; });
        md += `\n---\n\n`;

        Object.values(checklist).forEach(section => {
            md += `## ${section.label}\n\n`;
            section.items.forEach(item => {
                const priority = item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢';
                md += `- [ ] ${priority} **${item.task}**\n`;
                md += `  - Effort: ${item.effort} | Impact: ${item.impact}\n`;
                md += `  - Guide: ${item.guide}\n\n`;
            });
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'technical-seo-checklist.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const togglePriority = (key) => {
        setPriorities(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getTotalItems = () => {
        if (!checklist) return 0;
        return Object.values(checklist).reduce((sum, section) => sum + section.items.length, 0);
    };

    const faqs = [
        { question: 'What is Technical SEO?', answer: 'Technical SEO refers to optimizations that help search engines crawl, index, and render your website effectively. It includes site speed, mobile-friendliness, security, and structured data.' },
        { question: 'How do Core Web Vitals affect SEO?', answer: 'Core Web Vitals (LCP, FID/INP, CLS) are ranking factors. Sites with good Core Web Vitals scores have a ranking advantage over competitors with poor scores.' },
        { question: 'Which technical issues should I fix first?', answer: 'Focus on high-priority, high-impact items first: HTTPS, mobile-friendliness, Core Web Vitals, and crawlability. Then move to structured data and advanced optimizations.' }
    ];

    const seoContent = (<><h2>Technical SEO Checklist Generator</h2><p>Get a prioritized technical SEO audit checklist with effort/impact ratings and implementation guides. Customize based on your platform and focus areas.</p></>);

    return (
        <ToolLayout title="Technical SEO Checklist Generator" description="Generate a prioritized technical SEO checklist with implementation guides for crawlability, performance, mobile, and security." keywords={['technical SEO', 'Core Web Vitals', 'SEO audit', 'page speed', 'mobile SEO']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tech-container">
                <div className="tech-form">
                    <div className="form-group">
                        <label className="form-label">Your Platform</label>
                        <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                            <option value="wordpress">WordPress</option>
                            <option value="shopify">Shopify</option>
                            <option value="wix">Wix</option>
                            <option value="nextjs">Next.js</option>
                            <option value="react">React (SPA)</option>
                            <option value="custom">Custom / Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Focus Areas</label>
                        <div className="focus-toggles">
                            {Object.entries(checklistData).map(([key, section]) => (
                                <button key={key} className={`toggle-btn ${priorities[key] ? 'active' : ''}`} onClick={() => togglePriority(key)}>
                                    {section.icon} {section.label.replace(/^[^\s]+\s/, '')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generateChecklist}>⚙️ Generate Checklist</button>
                </div>

                {checklist && (
                    <div className="checklist-output">
                        <div className="checklist-header">
                            <div>
                                <h3>Technical SEO Checklist</h3>
                                <p className="checklist-meta">{getTotalItems()} tasks • Platform: {platform}</p>
                            </div>
                            <button className="btn-export" onClick={exportMarkdown}>📄 Download Markdown</button>
                        </div>

                        {/* Platform Tips */}
                        <div className="platform-tips">
                            <h4>💡 {platform.charAt(0).toUpperCase() + platform.slice(1)} Tips</h4>
                            <ul>
                                {(platformTips[platform] || []).map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="legend">
                            <span><strong>Priority:</strong> 🔴 High 🟡 Medium 🟢 Low</span>
                            <span><strong>Effort:</strong> <span className="effort-badge" style={{ background: '#28a745' }}>low</span> <span className="effort-badge" style={{ background: '#ffc107' }}>medium</span> <span className="effort-badge" style={{ background: '#dc3545' }}>high</span></span>
                        </div>

                        {Object.entries(checklist).map(([key, section]) => (
                            <div key={key} className="tech-section">
                                <h4>{section.label}</h4>
                                <div className="tech-items">
                                    {section.items.map((item, idx) => (
                                        <div key={idx} className={`tech-item priority-${item.priority}`}>
                                            <div className="item-header">
                                                <input type="checkbox" id={`tech-${key}-${idx}`} />
                                                <label htmlFor={`tech-${key}-${idx}`} className="item-task">
                                                    {item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'} {item.task}
                                                </label>
                                            </div>
                                            <div className="item-meta">
                                                {getEffortBadge(item.effort)}
                                                {getImpactBadge(item.impact)}
                                            </div>
                                            <div className="item-guide">
                                                <strong>How to:</strong> {item.guide}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .tech-container { max-width: 900px; margin: 0 auto; }
                .tech-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .focus-toggles { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); margin-top: var(--spacing-sm, 8px); }
                .toggle-btn { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: white; border: 2px solid var(--platinum, #e0e0e0); border-radius: 20px; cursor: pointer; font-size: var(--text-sm, 14px); transition: all 0.2s; }
                .toggle-btn:hover { border-color: var(--yinmn-blue, #485696); }
                .toggle-btn.active { background: var(--yinmn-blue, #485696); color: white; border-color: var(--yinmn-blue, #485696); }
                .checklist-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .checklist-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .checklist-header h3 { margin: 0; }
                .checklist-meta { color: var(--text-muted, #666); font-size: var(--text-sm, 14px); margin-top: 4px; }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .btn-export:hover { background: var(--platinum, #e0e0e0); }
                .platform-tips { background: linear-gradient(135deg, #667eea15, #764ba215); padding: var(--spacing-md, 16px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-lg, 24px); border-left: 4px solid #667eea; }
                .platform-tips h4 { margin: 0 0 var(--spacing-sm, 12px) 0; }
                .platform-tips ul { margin: 0; padding-left: 20px; }
                .platform-tips li { margin-bottom: var(--spacing-xs, 6px); }
                .legend { display: flex; flex-wrap: wrap; gap: var(--spacing-lg, 24px); font-size: var(--text-sm, 14px); margin-bottom: var(--spacing-lg, 24px); padding: var(--spacing-sm, 12px); background: var(--bg-secondary, #f5f5f5); border-radius: var(--radius, 6px); }
                .tech-section { margin-bottom: var(--spacing-xl, 32px); }
                .tech-section h4 { font-size: 1.1rem; margin-bottom: var(--spacing-md, 16px); padding-bottom: var(--spacing-xs, 8px); border-bottom: 2px solid var(--yinmn-blue, #485696); }
                .tech-items { display: flex; flex-direction: column; gap: var(--spacing-md, 16px); }
                .tech-item { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-md, 16px); border-radius: var(--radius, 8px); transition: all 0.2s; }
                .tech-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .tech-item.priority-high { border-left: 4px solid #dc3545; }
                .tech-item.priority-medium { border-left: 4px solid #ffc107; }
                .tech-item.priority-low { border-left: 4px solid #28a745; }
                .item-header { display: flex; align-items: flex-start; gap: var(--spacing-sm, 10px); margin-bottom: var(--spacing-sm, 10px); }
                .item-header input { margin-top: 4px; width: 18px; height: 18px; }
                .item-task { font-weight: 500; cursor: pointer; flex: 1; }
                .item-meta { display: flex; gap: var(--spacing-sm, 10px); margin-bottom: var(--spacing-sm, 10px); }
                .effort-badge, .impact-badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; color: white; font-weight: 500; text-transform: uppercase; }
                .item-guide { font-size: var(--text-sm, 13px); color: var(--text-muted, #666); line-height: 1.5; padding: var(--spacing-sm, 10px); background: white; border-radius: var(--radius, 6px); }
                @media (max-width: 600px) {
                    .checklist-header { flex-direction: column; }
                    .legend { flex-direction: column; gap: var(--spacing-sm, 8px); }
                    .focus-toggles { flex-direction: column; }
                    .toggle-btn { width: 100%; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default TechnicalSeoChecklist;
