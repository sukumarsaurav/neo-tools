import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const SitemapGenerator = () => {
    const [urls, setUrls] = useState('https://example.com/\nhttps://example.com/about\nhttps://example.com/contact');
    const [changefreq, setChangefreq] = useState('weekly');
    const [priority, setPriority] = useState('0.8');

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'sitemap-generator').slice(0, 3);

    const generateSitemap = () => {
        const urlList = urls.split('\n').filter(u => u.trim());
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        urlList.forEach(url => {
            xml += `  <url>\n    <loc>${url.trim()}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
        });
        xml += '</urlset>';
        return xml;
    };

    const copyCode = () => { navigator.clipboard.writeText(generateSitemap()); alert('Copied!'); };
    const download = () => { const blob = new Blob([generateSitemap()], { type: 'text/xml' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'sitemap.xml'; a.click(); };

    const faqs = [
        { question: 'What is a sitemap?', answer: 'A sitemap is an XML file that lists all pages on your website, helping search engines discover and crawl your content efficiently.' },
        { question: 'Where to place sitemap.xml?', answer: 'Place sitemap.xml in your root directory (example.com/sitemap.xml) and submit it to Google Search Console.' }
    ];

    const seoContent = (<><h2>XML Sitemap Generator</h2><p>Create a sitemap.xml file for better search engine crawling. Sitemaps help search engines discover all your pages.</p></>);

    return (
        <ToolLayout title="XML Sitemap Generator" description="Generate XML sitemap for your website. Help search engines discover your pages." keywords={['sitemap generator', 'XML sitemap', 'sitemap.xml', 'SEO sitemap']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">URLs (one per line)</label><textarea className="form-input" value={urls} onChange={(e) => setUrls(e.target.value)} rows={6} placeholder="https://example.com/&#10;https://example.com/about" /></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Change Frequency</label><select className="form-select" value={changefreq} onChange={(e) => setChangefreq(e.target.value)}><option value="always">Always</option><option value="hourly">Hourly</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
                    <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="1.0">1.0</option><option value="0.8">0.8</option><option value="0.6">0.6</option><option value="0.4">0.4</option></select></div>
                </div>
                <div className="code-output"><pre>{generateSitemap()}</pre><div className="btn-group"><button className="copy-btn" onClick={copyCode}>📋 Copy</button><button className="copy-btn" onClick={download}>⬇️ Download</button></div></div>
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}.code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0;max-height:300px;overflow:auto}.btn-group{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:flex;gap:var(--spacing-xs)}.copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default SitemapGenerator;
