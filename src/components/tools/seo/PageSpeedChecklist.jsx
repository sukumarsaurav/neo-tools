import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const PageSpeedChecklist = () => {
    const [platform, setPlatform] = useState('wordpress');
    const [focus, setFocus] = useState(['images', 'javascript', 'caching']);
    const [checklist, setChecklist] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'page-speed-checklist').slice(0, 3);

    const focusAreas = [
        { id: 'images', label: '🖼️ Images', icon: '🖼️' },
        { id: 'javascript', label: '📜 JavaScript', icon: '📜' },
        { id: 'css', label: '🎨 CSS', icon: '🎨' },
        { id: 'caching', label: '💾 Caching', icon: '💾' },
        { id: 'server', label: '🖥️ Server', icon: '🖥️' },
        { id: 'fonts', label: '🔤 Fonts', icon: '🔤' }
    ];

    const optimizations = {
        images: {
            label: '🖼️ Image Optimization',
            items: [
                { task: 'Convert images to WebP format', impact: 'high', effort: 'low', guide: 'Use tools like Squoosh or ImageMagick to bulk convert' },
                { task: 'Compress images without quality loss', impact: 'high', effort: 'low', guide: 'Use TinyPNG or ShortPixel for lossy/lossless compression' },
                { task: 'Implement lazy loading for below-fold images', impact: 'high', effort: 'low', guide: 'Add loading="lazy" attribute or use Intersection Observer' },
                { task: 'Specify width and height attributes', impact: 'medium', effort: 'low', guide: 'Prevents CLS by reserving space during load' },
                { task: 'Use responsive images with srcset', impact: 'medium', effort: 'medium', guide: 'Serve appropriately sized images for each viewport' },
                { task: 'Use CDN for image delivery', impact: 'high', effort: 'medium', guide: 'Cloudinary, Imgix, or Cloudflare Images for edge delivery' }
            ]
        },
        javascript: {
            label: '📜 JavaScript Optimization',
            items: [
                { task: 'Defer non-critical JavaScript', impact: 'high', effort: 'low', guide: 'Add defer attribute to non-essential scripts' },
                { task: 'Remove unused JavaScript', impact: 'high', effort: 'medium', guide: 'Use Chrome DevTools Coverage to find unused code' },
                { task: 'Minify JavaScript files', impact: 'medium', effort: 'low', guide: 'Use Terser, UglifyJS, or build tools with minification' },
                { task: 'Code-split large bundles', impact: 'high', effort: 'high', guide: 'Import dynamically with import() for route-based splitting' },
                { task: 'Avoid long main-thread tasks', impact: 'high', effort: 'high', guide: 'Break up tasks, use requestIdleCallback or Web Workers' },
                { task: 'Remove render-blocking scripts', impact: 'high', effort: 'medium', guide: 'Move scripts to end of body or use async/defer' }
            ]
        },
        css: {
            label: '🎨 CSS Optimization',
            items: [
                { task: 'Inline critical CSS', impact: 'high', effort: 'medium', guide: 'Extract above-fold CSS and inline in <head>' },
                { task: 'Remove unused CSS', impact: 'high', effort: 'medium', guide: 'Use PurgeCSS or UnCSS to remove unused styles' },
                { task: 'Minify CSS files', impact: 'medium', effort: 'low', guide: 'Use cssnano or clean-css in build process' },
                { task: 'Avoid CSS @import', impact: 'medium', effort: 'low', guide: 'Replace with <link> tags for parallel loading' },
                { task: 'Reduce CSS specificity complexity', impact: 'low', effort: 'medium', guide: 'Simpler selectors = faster processing' },
                { task: 'Use CSS containment where appropriate', impact: 'medium', effort: 'low', guide: 'Add contain: layout for isolated components' }
            ]
        },
        caching: {
            label: '💾 Caching Strategy',
            items: [
                { task: 'Set proper Cache-Control headers', impact: 'high', effort: 'low', guide: 'max-age=31536000 for static assets, stale-while-revalidate' },
                { task: 'Implement service worker caching', impact: 'medium', effort: 'high', guide: 'Cache static assets for offline access and faster loads' },
                { task: 'Use browser caching effectively', impact: 'high', effort: 'low', guide: 'Configure ETag and Last-Modified headers' },
                { task: 'Implement page caching', impact: 'high', effort: 'medium', guide: 'Full-page cache for static/semi-static pages' },
                { task: 'Use CDN for static asset caching', impact: 'high', effort: 'medium', guide: 'Cloudflare, Fastly, or AWS CloudFront' },
                { task: 'Enable compression (gzip/Brotli)', impact: 'high', effort: 'low', guide: 'Configure in server settings, Brotli preferred' }
            ]
        },
        server: {
            label: '🖥️ Server Optimization',
            items: [
                { task: 'Reduce Time to First Byte (TTFB)', impact: 'high', effort: 'varies', guide: 'Target < 200ms. Optimize database, use caching, upgrade hosting' },
                { task: 'Use HTTP/2 or HTTP/3', impact: 'medium', effort: 'low', guide: 'Enable on server for multiplexing benefits' },
                { task: 'Implement preconnect for third-parties', impact: 'medium', effort: 'low', guide: '<link rel="preconnect" href="domain"> for critical origins' },
                { task: 'Use DNS prefetching', impact: 'low', effort: 'low', guide: '<link rel="dns-prefetch" href="domain">' },
                { task: 'Optimize database queries', impact: 'high', effort: 'high', guide: 'Add indexes, optimize slow queries, use query caching' },
                { task: 'Consider edge computing', impact: 'medium', effort: 'high', guide: 'Use Cloudflare Workers or Vercel Edge Functions' }
            ]
        },
        fonts: {
            label: '🔤 Font Optimization',
            items: [
                { task: 'Use font-display: swap', impact: 'medium', effort: 'low', guide: 'Prevents invisible text during font load' },
                { task: 'Preload critical fonts', impact: 'medium', effort: 'low', guide: '<link rel="preload" as="font" type="font/woff2" crossorigin>' },
                { task: 'Subset fonts to needed characters', impact: 'medium', effort: 'medium', guide: 'Use tools like glyphhanger to subset fonts' },
                { task: 'Use system fonts where possible', impact: 'low', effort: 'low', guide: 'System fonts = zero load time' },
                { task: 'Host fonts locally when possible', impact: 'low', effort: 'low', guide: 'Avoids extra DNS lookup and connection' },
                { task: 'Use variable fonts to reduce files', impact: 'medium', effort: 'low', guide: 'One file for all weights/styles' }
            ]
        }
    };

    const platformTools = {
        wordpress: ['WP Rocket', 'Autoptimize', 'ShortPixel', 'LiteSpeed Cache'],
        shopify: ['TinyIMG', 'Booster', 'PageSpeed Monitor'],
        nextjs: ['next/image', 'next/script', 'Vercel Analytics'],
        react: ['React.lazy()', 'Lighthouse CI', 'Webpack Bundle Analyzer'],
        custom: ['Lighthouse', 'WebPageTest', 'GTmetrix', 'Chrome DevTools']
    };

    const toggleFocus = (id) => {
        if (focus.includes(id)) {
            if (focus.length > 1) setFocus(focus.filter(f => f !== id));
        } else {
            setFocus([...focus, id]);
        }
    };

    const generateChecklist = () => {
        const result = {};
        focus.forEach(f => {
            if (optimizations[f]) {
                result[f] = optimizations[f];
            }
        });
        setChecklist({
            platform,
            tools: platformTools[platform] || platformTools.custom,
            optimizations: result
        });
    };

    const getTotalItems = () => {
        if (!checklist) return 0;
        return Object.values(checklist.optimizations).reduce((sum, section) => sum + section.items.length, 0);
    };

    const exportMarkdown = () => {
        if (!checklist) return;
        let md = `# Page Speed Optimization Checklist\n\n`;
        md += `**Platform:** ${checklist.platform}\n`;
        md += `**Recommended Tools:** ${checklist.tools.join(', ')}\n`;
        md += `**Generated:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

        Object.values(checklist.optimizations).forEach(section => {
            md += `## ${section.label}\n\n`;
            section.items.forEach(item => {
                const impact = item.impact === 'high' ? '🔴' : item.impact === 'medium' ? '🟡' : '🟢';
                md += `- [ ] ${impact} **${item.task}**\n`;
                md += `  - Impact: ${item.impact} | Effort: ${item.effort}\n`;
                md += `  - How: ${item.guide}\n\n`;
            });
        });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'page-speed-checklist.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const faqs = [
        { question: 'What is a good page speed score?', answer: 'Aim for 90+ in Google PageSpeed Insights. Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1.' },
        { question: 'Does page speed affect SEO?', answer: 'Yes! Page speed is a confirmed Google ranking factor. Fast sites also have lower bounce rates and higher conversions.' },
        { question: 'What should I optimize first?', answer: 'Start with high-impact, low-effort items: image optimization, compression, caching headers. Then tackle JavaScript optimization.' }
    ];

    const seoContent = (<><h2>Page Speed Optimization Checklist</h2><p>Generate a prioritized checklist for improving your website&apos;s loading speed with impact ratings, effort levels, and implementation guides.</p></>);

    return (
        <ToolLayout title="Page Speed Optimization Checklist" description="Generate a prioritized page speed optimization checklist with impact ratings and implementation guides." keywords={['page speed', 'Core Web Vitals', 'performance optimization', 'LCP', 'website speed']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="speed-container">
                <div className="speed-form">
                    <div className="form-group">
                        <label className="form-label">Your Platform</label>
                        <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                            <option value="wordpress">WordPress</option>
                            <option value="shopify">Shopify</option>
                            <option value="nextjs">Next.js</option>
                            <option value="react">React (SPA)</option>
                            <option value="custom">Custom / Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Focus Areas</label>
                        <div className="focus-options">
                            {focusAreas.map(area => (
                                <button key={area.id} className={`focus-btn ${focus.includes(area.id) ? 'active' : ''}`} onClick={() => toggleFocus(area.id)}>
                                    {area.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generateChecklist}>⚡ Generate Checklist</button>
                </div>

                {checklist && (
                    <div className="checklist-output">
                        <div className="checklist-header">
                            <div>
                                <h3>Page Speed Optimization Checklist</h3>
                                <p className="checklist-meta">{getTotalItems()} optimizations for {checklist.platform}</p>
                            </div>
                            <button className="btn-export" onClick={exportMarkdown}>📄 Download</button>
                        </div>

                        {/* Recommended Tools */}
                        <div className="tools-section">
                            <h4>🛠️ Recommended Tools for {checklist.platform}</h4>
                            <div className="tools-list">
                                {checklist.tools.map((tool, idx) => (
                                    <span key={idx} className="tool-badge">{tool}</span>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="legend">
                            <span><strong>Impact:</strong> 🔴 High 🟡 Medium 🟢 Low</span>
                            <span><strong>Effort:</strong> Low → Medium → High</span>
                        </div>

                        {/* Optimization Sections */}
                        {Object.entries(checklist.optimizations).map(([key, section]) => (
                            <div key={key} className="opt-section">
                                <h4>{section.label}</h4>
                                <div className="opt-items">
                                    {section.items.map((item, idx) => (
                                        <div key={idx} className={`opt-item impact-${item.impact}`}>
                                            <div className="item-check">
                                                <input type="checkbox" id={`${key}-${idx}`} />
                                            </div>
                                            <div className="item-content">
                                                <label htmlFor={`${key}-${idx}`} className="item-task">
                                                    {item.impact === 'high' ? '🔴' : item.impact === 'medium' ? '🟡' : '🟢'} {item.task}
                                                </label>
                                                <div className="item-meta">
                                                    <span className={`effort-badge ${item.effort}`}>{item.effort} effort</span>
                                                </div>
                                                <div className="item-guide">💡 {item.guide}</div>
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
                .speed-container { max-width: 900px; margin: 0 auto; }
                .speed-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .focus-options { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); margin-top: var(--spacing-sm, 8px); }
                .focus-btn { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: white; border: 2px solid var(--platinum, #e0e0e0); border-radius: 20px; cursor: pointer; font-size: var(--text-sm, 14px); transition: all 0.2s; }
                .focus-btn:hover { border-color: var(--yinmn-blue, #485696); }
                .focus-btn.active { background: var(--yinmn-blue, #485696); color: white; border-color: var(--yinmn-blue, #485696); }
                .checklist-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .checklist-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .checklist-header h3 { margin: 0; }
                .checklist-meta { color: var(--text-muted, #666); margin-top: 4px; }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .tools-section { margin-bottom: var(--spacing-lg, 24px); }
                .tools-section h4 { margin-bottom: var(--spacing-sm, 12px); }
                .tools-list { display: flex; flex-wrap: wrap; gap: var(--spacing-sm, 10px); }
                .tool-badge { padding: var(--spacing-xs, 8px) var(--spacing-md, 16px); background: linear-gradient(135deg, #667eea20, #764ba220); border-radius: 20px; font-size: var(--text-sm, 14px); font-weight: 500; }
                .legend { display: flex; flex-wrap: wrap; gap: var(--spacing-lg, 24px); font-size: var(--text-sm, 14px); padding: var(--spacing-sm, 12px); background: var(--bg-secondary, #f5f5f5); border-radius: var(--radius, 6px); margin-bottom: var(--spacing-lg, 24px); }
                .opt-section { margin-bottom: var(--spacing-xl, 32px); }
                .opt-section h4 { margin-bottom: var(--spacing-md, 16px); padding-bottom: var(--spacing-xs, 8px); border-bottom: 2px solid var(--yinmn-blue, #485696); }
                .opt-items { display: flex; flex-direction: column; gap: var(--spacing-md, 16px); }
                .opt-item { display: flex; gap: var(--spacing-sm, 12px); padding: var(--spacing-md, 16px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 8px); border-left: 4px solid transparent; }
                .opt-item.impact-high { border-left-color: #dc3545; }
                .opt-item.impact-medium { border-left-color: #ffc107; }
                .opt-item.impact-low { border-left-color: #28a745; }
                .item-check { padding-top: 4px; }
                .item-check input { width: 18px; height: 18px; }
                .item-content { flex: 1; }
                .item-task { font-weight: 500; cursor: pointer; display: block; margin-bottom: var(--spacing-xs, 6px); }
                .item-meta { margin-bottom: var(--spacing-xs, 6px); }
                .effort-badge { padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 500; text-transform: capitalize; }
                .effort-badge.low { background: #28a74520; color: #28a745; }
                .effort-badge.medium { background: #ffc10720; color: #d39e00; }
                .effort-badge.high { background: #dc354520; color: #dc3545; }
                .effort-badge.varies { background: #17a2b820; color: #17a2b8; }
                .item-guide { font-size: var(--text-sm, 13px); color: var(--text-muted, #666); padding: var(--spacing-sm, 10px); background: white; border-radius: var(--radius, 6px); margin-top: var(--spacing-xs, 6px); }
                @media (max-width: 600px) {
                    .focus-options { flex-direction: column; }
                    .legend { flex-direction: column; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default PageSpeedChecklist;
