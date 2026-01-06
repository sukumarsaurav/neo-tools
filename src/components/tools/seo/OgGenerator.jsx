import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const OgGenerator = () => {
    const [data, setData] = useState({ title: '', description: '', url: '', image: '', siteName: '', type: 'website' });
    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'og-generator').slice(0, 3);

    const generateCode = () => {
        let code = '';
        if (data.title) code += `<meta property="og:title" content="${data.title}">\n`;
        if (data.description) code += `<meta property="og:description" content="${data.description}">\n`;
        if (data.url) code += `<meta property="og:url" content="${data.url}">\n`;
        if (data.image) code += `<meta property="og:image" content="${data.image}">\n`;
        if (data.siteName) code += `<meta property="og:site_name" content="${data.siteName}">\n`;
        code += `<meta property="og:type" content="${data.type}">\n`;
        return code;
    };

    const copyCode = () => { navigator.clipboard.writeText(generateCode()); alert('Copied!'); };

    const faqs = [
        { question: 'What are Open Graph tags?', answer: 'Open Graph (OG) tags are meta tags that control how content appears when shared on social media platforms like Facebook, LinkedIn, and others.' },
        { question: 'What size should og:image be?', answer: 'Recommended size is 1200×630 pixels for optimal display across platforms. Minimum 200×200px, with file size under 8MB.' }
    ];

    const seoContent = (<><h2>Open Graph Meta Tag Generator</h2><p>Generate Open Graph meta tags for beautiful social media shares. Control how your content appears on Facebook, LinkedIn, and more.</p></>);

    return (
        <ToolLayout title="Open Graph Meta Tag Generator" description="Generate OG meta tags for social media. Control how your content appears when shared." keywords={['Open Graph generator', 'OG tags', 'social meta tags', 'Facebook meta']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Title</label><input type="text" className="form-input" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="Page Title" /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Brief description" rows={2} /></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">URL</label><input type="url" className="form-input" value={data.url} onChange={(e) => setData({ ...data, url: e.target.value })} placeholder="https://example.com" /></div>
                    <div className="form-group"><label className="form-label">Image URL</label><input type="url" className="form-input" value={data.image} onChange={(e) => setData({ ...data, image: e.target.value })} placeholder="https://example.com/image.jpg" /></div>
                </div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Site Name</label><input type="text" className="form-input" value={data.siteName} onChange={(e) => setData({ ...data, siteName: e.target.value })} placeholder="My Website" /></div>
                    <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={data.type} onChange={(e) => setData({ ...data, type: e.target.value })}><option value="website">Website</option><option value="article">Article</option><option value="product">Product</option></select></div>
                </div>
                <div className="code-output"><pre>{generateCode()}</pre><button className="copy-btn" onClick={copyCode}>📋 Copy</button></div>
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}.code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}@media(max-width:480px){.form-row{grid-template-columns:1fr}}`}</style>
        </ToolLayout>
    );
};

export default OgGenerator;
