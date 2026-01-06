import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const RobotsTxtGenerator = () => {
    const [userAgent, setUserAgent] = useState('*');
    const [disallow, setDisallow] = useState('/admin/\n/private/');
    const [allow, setAllow] = useState('');
    const [sitemap, setSitemap] = useState('');
    const [crawlDelay, setCrawlDelay] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'robots-txt-generator').slice(0, 3);

    const generateCode = () => {
        let code = `User-agent: ${userAgent}\n`;
        if (disallow) disallow.split('\n').filter(d => d.trim()).forEach(d => { code += `Disallow: ${d.trim()}\n`; });
        if (allow) allow.split('\n').filter(a => a.trim()).forEach(a => { code += `Allow: ${a.trim()}\n`; });
        if (crawlDelay) code += `Crawl-delay: ${crawlDelay}\n`;
        if (sitemap) code += `\nSitemap: ${sitemap}\n`;
        return code;
    };

    const copyCode = () => { navigator.clipboard.writeText(generateCode()); alert('Copied!'); };

    const faqs = [
        { question: 'What is robots.txt?', answer: 'Robots.txt is a file that tells search engine crawlers which pages to access or not access on your website. It\'s placed in the root directory.' },
        { question: 'Does robots.txt block pages from indexing?', answer: 'No, robots.txt only blocks crawling. To prevent indexing, use the "noindex" meta tag. Blocked pages can still appear in search if linked from other sites.' }
    ];

    const seoContent = (<><h2>Robots.txt Generator</h2><p>Create a robots.txt file to control how search engines crawl your website. Tell bots which pages to access and which to avoid.</p></>);

    return (
        <ToolLayout title="Robots.txt Generator" description="Generate robots.txt file for your website. Control search engine crawling and indexing." keywords={['robots.txt generator', 'robots file', 'SEO robots', 'crawl control']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">User-agent</label><select className="form-select" value={userAgent} onChange={(e) => setUserAgent(e.target.value)}><option value="*">* (All bots)</option><option value="Googlebot">Googlebot</option><option value="Bingbot">Bingbot</option></select></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Disallow (one per line)</label><textarea className="form-input" value={disallow} onChange={(e) => setDisallow(e.target.value)} rows={4} placeholder="/admin/&#10;/private/" /></div>
                    <div className="form-group"><label className="form-label">Allow (one per line)</label><textarea className="form-input" value={allow} onChange={(e) => setAllow(e.target.value)} rows={4} placeholder="/public/" /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Sitemap URL</label><input type="url" className="form-input" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" /></div>
                    <div className="form-group"><label className="form-label">Crawl Delay (seconds)</label><input type="number" className="form-input" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="10" min="0" /></div>
                </div>
                <div className="code-output"><pre>{generateCode()}</pre><button className="copy-btn" onClick={copyCode}>📋 Copy</button></div>
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}.code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}@media(max-width:480px){.form-row{grid-template-columns:1fr}}`}</style>
        </ToolLayout>
    );
};

export default RobotsTxtGenerator;
