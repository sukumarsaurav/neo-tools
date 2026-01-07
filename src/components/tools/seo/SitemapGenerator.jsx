import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const SitemapGenerator = () => {
    const toast = useToast();
    const [mode, setMode] = useState('simple'); // simple or advanced
    const [bulkUrls, setBulkUrls] = useState('');
    const [advancedUrls, setAdvancedUrls] = useState([
        { url: 'https://example.com/', priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] }
    ]);
    const [defaultChangefreq, setDefaultChangefreq] = useState('weekly');
    const [defaultPriority, setDefaultPriority] = useState('0.8');
    const [includeLastmod, setIncludeLastmod] = useState(true);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'sitemap-generator').slice(0, 3);

    // Add/remove URLs
    const addUrl = () => setAdvancedUrls([...advancedUrls, { url: '', priority: '0.8', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] }]);
    const removeUrl = (index) => setAdvancedUrls(advancedUrls.filter((_, i) => i !== index));
    const updateUrl = (index, field, value) => {
        const updated = [...advancedUrls];
        updated[index][field] = value;
        setAdvancedUrls(updated);
    };

    // Validate URL
    const isValidUrl = (str) => {
        try { new URL(str); return true; } catch { return false; }
    };

    // Generate sitemap XML
    const generateSitemap = () => {
        let urls = [];

        if (mode === 'simple') {
            urls = bulkUrls.split('\n')
                .map(u => u.trim())
                .filter(u => u && isValidUrl(u))
                .map(url => ({
                    url,
                    priority: defaultPriority,
                    changefreq: defaultChangefreq,
                    lastmod: includeLastmod ? new Date().toISOString().split('T')[0] : null
                }));
        } else {
            urls = advancedUrls.filter(u => u.url && isValidUrl(u.url));
        }

        if (urls.length === 0) {
            return '<!-- No valid URLs provided -->';
        }

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        urls.forEach(item => {
            xml += '  <url>\n';
            xml += `    <loc>${item.url}</loc>\n`;
            if (item.lastmod) xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
            xml += `    <priority>${item.priority}</priority>\n`;
            xml += '  </url>\n';
        });
        xml += '</urlset>';
        return xml;
    };

    const getUrlCount = () => {
        if (mode === 'simple') {
            return bulkUrls.split('\n').filter(u => u.trim() && isValidUrl(u.trim())).length;
        }
        return advancedUrls.filter(u => u.url && isValidUrl(u.url)).length;
    };

    const copyCode = () => {
        if (getUrlCount() === 0) { toast.warning('Please add valid URLs first'); return; }
        navigator.clipboard.writeText(generateSitemap());
        toast.success('Sitemap copied!');
    };

    const download = () => {
        if (getUrlCount() === 0) { toast.warning('Please add valid URLs first'); return; }
        const blob = new Blob([generateSitemap()], { type: 'text/xml' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'sitemap.xml';
        a.click();
    };

    const faqs = [
        { question: 'What is a sitemap?', answer: 'A sitemap is an XML file that lists all pages on your website, helping search engines discover and crawl your content efficiently.' },
        { question: 'Where to place sitemap.xml?', answer: 'Place sitemap.xml in your root directory (example.com/sitemap.xml) and submit it to Google Search Console.' },
        { question: 'What is lastmod?', answer: 'The lastmod tag indicates when a page was last modified. It helps search engines know when to re-crawl a page.' }
    ];

    const seoContent = (<><h2>XML Sitemap Generator</h2><p>Create a sitemap.xml file with per-URL settings for priority, change frequency, and last modified dates.</p></>);

    return (
        <ToolLayout title="XML Sitemap Generator" description="Generate XML sitemap for your website with per-URL priority, changefreq, and lastmod settings." keywords={['sitemap generator', 'XML sitemap', 'sitemap.xml', 'SEO sitemap']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                {/* Mode Toggle */}
                <div className="mode-toggle">
                    <button className={`mode-btn ${mode === 'simple' ? 'active' : ''}`} onClick={() => setMode('simple')}>Simple Mode</button>
                    <button className={`mode-btn ${mode === 'advanced' ? 'active' : ''}`} onClick={() => setMode('advanced')}>Advanced Mode</button>
                </div>

                {mode === 'simple' ? (
                    <>
                        <div className="form-group">
                            <label className="form-label">URLs (one per line)</label>
                            <textarea className="form-input" value={bulkUrls} onChange={(e) => setBulkUrls(e.target.value)} rows={8} placeholder="https://example.com/&#10;https://example.com/about&#10;https://example.com/contact" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Default Change Frequency</label>
                                <select className="form-select" value={defaultChangefreq} onChange={(e) => setDefaultChangefreq(e.target.value)}>
                                    <option value="always">Always</option>
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Default Priority</label>
                                <select className="form-select" value={defaultPriority} onChange={(e) => setDefaultPriority(e.target.value)}>
                                    <option value="1.0">1.0 (Highest)</option>
                                    <option value="0.8">0.8 (High)</option>
                                    <option value="0.6">0.6 (Medium)</option>
                                    <option value="0.4">0.4 (Low)</option>
                                    <option value="0.2">0.2 (Lowest)</option>
                                </select>
                            </div>
                        </div>
                        <label className="checkbox-label">
                            <input type="checkbox" checked={includeLastmod} onChange={(e) => setIncludeLastmod(e.target.checked)} />
                            Include lastmod (today's date)
                        </label>
                    </>
                ) : (
                    <div className="advanced-urls">
                        <h4>📄 URL List ({advancedUrls.length} URLs)</h4>
                        {advancedUrls.map((item, index) => (
                            <div key={index} className={`url-item ${!isValidUrl(item.url) && item.url ? 'invalid' : ''}`}>
                                <div className="url-header">
                                    <span>URL {index + 1}</span>
                                    {advancedUrls.length > 1 && <button className="remove-btn" onClick={() => removeUrl(index)}>✕</button>}
                                </div>
                                <input type="url" className="form-input" value={item.url} onChange={(e) => updateUrl(index, 'url', e.target.value)} placeholder="https://example.com/page" />
                                <div className="url-settings">
                                    <div>
                                        <label>Priority</label>
                                        <select value={item.priority} onChange={(e) => updateUrl(index, 'priority', e.target.value)}>
                                            <option value="1.0">1.0</option>
                                            <option value="0.8">0.8</option>
                                            <option value="0.6">0.6</option>
                                            <option value="0.4">0.4</option>
                                            <option value="0.2">0.2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Frequency</label>
                                        <select value={item.changefreq} onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}>
                                            <option value="always">Always</option>
                                            <option value="hourly">Hourly</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="yearly">Yearly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Last Modified</label>
                                        <input type="date" value={item.lastmod} onChange={(e) => updateUrl(index, 'lastmod', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="add-btn" onClick={addUrl}>+ Add URL</button>
                    </div>
                )}

                {/* Stats */}
                <div className="stats-bar">
                    <span>📊 {getUrlCount()} valid URL(s)</span>
                </div>

                {/* Output */}
                <div className="code-output">
                    <pre>{generateSitemap()}</pre>
                    <div className="btn-group">
                        <button className="copy-btn" onClick={copyCode}>📋 Copy</button>
                        <button className="copy-btn" onClick={download}>⬇️ Download</button>
                    </div>
                </div>
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .mode-toggle{display:flex;gap:var(--spacing-sm);margin-bottom:var(--spacing-lg)}
                .mode-btn{flex:1;padding:var(--spacing-sm);background:var(--bg-secondary);border:2px solid var(--platinum);border-radius:var(--radius);cursor:pointer;font-weight:500;transition:all 0.2s}
                .mode-btn.active{background:var(--yinmn-blue);color:white;border-color:var(--yinmn-blue)}
                .form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}
                .form-input,.form-select{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}
                .checkbox-label{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;margin-bottom:var(--spacing-lg)}
                .advanced-urls{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .advanced-urls h4{margin:0 0 var(--spacing-md) 0}
                .url-item{background:white;padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:3px solid var(--yinmn-blue)}
                .url-item.invalid{border-left-color:#dc3545}
                .url-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-sm);font-weight:600}
                .remove-btn{background:#dc3545;color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:12px}
                .url-settings{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-sm);margin-top:var(--spacing-sm)}
                .url-settings label{display:block;font-size:var(--text-xs);color:var(--text-muted);margin-bottom:2px}
                .url-settings select,.url-settings input{width:100%;padding:6px;border:1px solid var(--platinum);border-radius:var(--radius);font-size:var(--text-sm)}
                .add-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);cursor:pointer}
                .stats-bar{background:var(--bg-secondary);padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);font-size:var(--text-sm)}
                .code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative}
                .code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0;max-height:300px;overflow:auto}
                .btn-group{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:flex;gap:var(--spacing-xs)}
                .copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}
                @media(max-width:600px){.form-row,.url-settings{grid-template-columns:1fr}}
            `}</style>
        </ToolLayout>
    );
};

export default SitemapGenerator;

