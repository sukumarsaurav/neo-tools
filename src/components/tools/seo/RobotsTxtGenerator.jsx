import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

// Predefined templates
const TEMPLATES = {
    default: { name: 'Default (Allow All)', rules: [{ userAgent: '*', disallow: '', allow: '' }], sitemap: '' },
    wordpress: { name: 'WordPress', rules: [{ userAgent: '*', disallow: '/wp-admin/\n/wp-includes/\n/wp-content/plugins/\n/trackback/\n/feed/', allow: '/wp-admin/admin-ajax.php' }], sitemap: '/sitemap.xml' },
    ecommerce: { name: 'E-Commerce', rules: [{ userAgent: '*', disallow: '/cart/\n/checkout/\n/my-account/\n/wishlist/\n/search/\n/*?add-to-cart=*\n/*?orderby=*', allow: '' }], sitemap: '/sitemap.xml' },
    blockAI: {
        name: 'Block AI Crawlers', rules: [
            { userAgent: '*', disallow: '', allow: '' },
            { userAgent: 'GPTBot', disallow: '/', allow: '' },
            { userAgent: 'ChatGPT-User', disallow: '/', allow: '' },
            { userAgent: 'CCBot', disallow: '/', allow: '' },
            { userAgent: 'anthropic-ai', disallow: '/', allow: '' },
            { userAgent: 'Google-Extended', disallow: '/', allow: '' }
        ], sitemap: ''
    },
    restrictive: { name: 'Restrictive (Block Most)', rules: [{ userAgent: '*', disallow: '/admin/\n/private/\n/api/\n/tmp/\n/cache/\n/*.json$\n/*.xml$', allow: '/api/public/' }], sitemap: '' }
};

const RobotsTxtGenerator = () => {
    const toast = useToast();
    const [rules, setRules] = useState([{ userAgent: '*', disallow: '', allow: '' }]);
    const [sitemap, setSitemap] = useState('');
    const [crawlDelay, setCrawlDelay] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'robots-txt-generator').slice(0, 3);

    // Apply template
    const applyTemplate = (key) => {
        const template = TEMPLATES[key];
        setRules(template.rules.map(r => ({ ...r })));
        if (template.sitemap) setSitemap(template.sitemap);
        toast.success(`${template.name} template applied`);
    };

    // Add/remove rules
    const addRule = () => setRules([...rules, { userAgent: '*', disallow: '', allow: '' }]);
    const removeRule = (index) => setRules(rules.filter((_, i) => i !== index));
    const updateRule = (index, field, value) => {
        const updated = [...rules];
        updated[index][field] = value;
        setRules(updated);
    };

    const generateCode = () => {
        let code = '';
        rules.forEach(rule => {
            code += `User-agent: ${rule.userAgent}\n`;
            if (rule.disallow) rule.disallow.split('\n').filter(d => d.trim()).forEach(d => { code += `Disallow: ${d.trim()}\n`; });
            if (rule.allow) rule.allow.split('\n').filter(a => a.trim()).forEach(a => { code += `Allow: ${a.trim()}\n`; });
            if (crawlDelay && rule.userAgent === '*') code += `Crawl-delay: ${crawlDelay}\n`;
            code += '\n';
        });
        if (sitemap) code += `Sitemap: ${sitemap}\n`;
        return code.trim();
    };

    const copyCode = () => { navigator.clipboard.writeText(generateCode()); toast.success('Robots.txt copied!'); };
    const download = () => {
        const blob = new Blob([generateCode()], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'robots.txt';
        a.click();
    };

    const faqs = [
        { question: 'What is robots.txt?', answer: 'Robots.txt is a file that tells search engine crawlers which pages to access or not access on your website. It\'s placed in the root directory.' },
        { question: 'Does robots.txt block pages from indexing?', answer: 'No, robots.txt only blocks crawling. To prevent indexing, use the "noindex" meta tag. Blocked pages can still appear in search if linked from other sites.' },
        { question: 'How do I block AI crawlers?', answer: 'Add specific User-agent rules for AI bots like GPTBot, CCBot, or anthropic-ai with Disallow: / to prevent them from crawling your content.' }
    ];

    const seoContent = (<><h2>Robots.txt Generator</h2><p>Create a robots.txt file with templates for WordPress, E-Commerce, or custom rules. Block AI crawlers and control search engine access.</p></>);

    return (
        <ToolLayout title="Robots.txt Generator" description="Generate robots.txt file with templates and multi-user-agent support." keywords={['robots.txt generator', 'robots file', 'SEO robots', 'block AI crawlers']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                {/* Templates */}
                <div className="templates-section">
                    <label className="form-label">Quick Templates</label>
                    <div className="template-btns">
                        {Object.entries(TEMPLATES).map(([key, template]) => (
                            <button key={key} className="template-btn" onClick={() => applyTemplate(key)}>{template.name}</button>
                        ))}
                    </div>
                </div>

                {/* Rules */}
                <div className="rules-section">
                    <h4>📋 User-Agent Rules ({rules.length})</h4>
                    {rules.map((rule, index) => (
                        <div key={index} className="rule-item">
                            <div className="rule-header">
                                <select value={rule.userAgent} onChange={(e) => updateRule(index, 'userAgent', e.target.value)}>
                                    <option value="*">* (All bots)</option>
                                    <option value="Googlebot">Googlebot</option>
                                    <option value="Bingbot">Bingbot</option>
                                    <option value="GPTBot">GPTBot (OpenAI)</option>
                                    <option value="ChatGPT-User">ChatGPT-User</option>
                                    <option value="CCBot">CCBot (Common Crawl)</option>
                                    <option value="anthropic-ai">Anthropic AI</option>
                                    <option value="Google-Extended">Google-Extended (Bard)</option>
                                </select>
                                {rules.length > 1 && <button className="remove-btn" onClick={() => removeRule(index)}>✕</button>}
                            </div>
                            <div className="rule-fields">
                                <div>
                                    <label>Disallow (one per line)</label>
                                    <textarea value={rule.disallow} onChange={(e) => updateRule(index, 'disallow', e.target.value)} rows={3} placeholder="/admin/&#10;/private/" />
                                </div>
                                <div>
                                    <label>Allow (one per line)</label>
                                    <textarea value={rule.allow} onChange={(e) => updateRule(index, 'allow', e.target.value)} rows={3} placeholder="/public/" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="add-btn" onClick={addRule}>+ Add User-Agent Rule</button>
                </div>

                {/* Global settings */}
                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Sitemap URL</label>
                        <input type="url" className="form-input" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Crawl Delay (seconds)</label>
                        <input type="number" className="form-input" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="10" min="0" />
                    </div>
                </div>

                {/* Output */}
                <div className="code-output">
                    <pre>{generateCode()}</pre>
                    <div className="btn-group">
                        <button className="copy-btn" onClick={copyCode}>📋 Copy</button>
                        <button className="copy-btn" onClick={download}>⬇️ Download</button>
                    </div>
                </div>
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .templates-section{margin-bottom:var(--spacing-lg)}
                .template-btns{display:flex;flex-wrap:wrap;gap:var(--spacing-sm)}
                .template-btn{padding:var(--spacing-xs) var(--spacing-md);background:var(--bg-secondary);border:1px solid var(--platinum);border-radius:20px;cursor:pointer;font-size:var(--text-sm);transition:all 0.2s}
                .template-btn:hover{background:var(--yinmn-blue);color:white;border-color:var(--yinmn-blue)}
                .rules-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .rules-section h4{margin:0 0 var(--spacing-md) 0}
                .rule-item{background:white;padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:3px solid var(--yinmn-blue)}
                .rule-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-sm)}
                .rule-header select{flex:1;padding:var(--spacing-sm);border:1px solid var(--platinum);border-radius:var(--radius);font-weight:500}
                .remove-btn{background:#dc3545;color:white;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;margin-left:var(--spacing-sm)}
                .rule-fields{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}
                .rule-fields label{display:block;font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px}
                .rule-fields textarea{width:100%;padding:var(--spacing-sm);border:1px solid var(--platinum);border-radius:var(--radius);font-family:var(--font-mono);font-size:var(--text-sm)}
                .add-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);cursor:pointer}
                .form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}
                .code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}
                .code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}
                .btn-group{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);display:flex;gap:var(--spacing-xs)}
                .copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}
                @media(max-width:600px){.form-row,.rule-fields{grid-template-columns:1fr}}
            `}</style>
        </ToolLayout>
    );
};

export default RobotsTxtGenerator;

