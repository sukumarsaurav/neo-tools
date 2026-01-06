import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const TwitterCardGenerator = () => {
    const [data, setData] = useState({ card: 'summary_large_image', title: '', description: '', image: '', site: '', creator: '' });
    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'twitter-card-generator').slice(0, 3);

    const generateCode = () => {
        let code = `<meta name="twitter:card" content="${data.card}">\n`;
        if (data.title) code += `<meta name="twitter:title" content="${data.title}">\n`;
        if (data.description) code += `<meta name="twitter:description" content="${data.description}">\n`;
        if (data.image) code += `<meta name="twitter:image" content="${data.image}">\n`;
        if (data.site) code += `<meta name="twitter:site" content="${data.site}">\n`;
        if (data.creator) code += `<meta name="twitter:creator" content="${data.creator}">\n`;
        return code;
    };

    const copyCode = () => { navigator.clipboard.writeText(generateCode()); alert('Copied!'); };

    const faqs = [
        { question: 'What are Twitter Cards?', answer: 'Twitter Cards are HTML meta tags that control how content appears when shared on Twitter (X), including title, description, and image.' },
        { question: 'What card types are available?', answer: 'summary (small image), summary_large_image (large image), app (app download), and player (video/audio).' }
    ];

    const seoContent = (<><h2>Twitter Card Generator</h2><p>Generate Twitter Card meta tags for enhanced Twitter/X sharing. Make your shared links stand out with rich media previews.</p></>);

    return (
        <ToolLayout title="Twitter Card Generator" description="Generate Twitter Card meta tags for rich Twitter/X previews when sharing links." keywords={['Twitter Card generator', 'Twitter meta tags', 'X Card tags', 'social sharing']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Card Type</label><select className="form-select" value={data.card} onChange={(e) => setData({ ...data, card: e.target.value })}><option value="summary">Summary</option><option value="summary_large_image">Summary Large Image</option></select></div>
                <div className="form-group"><label className="form-label">Title</label><input type="text" className="form-input" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="Tweet title" /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={2} placeholder="Brief description" /></div>
                <div className="form-group"><label className="form-label">Image URL</label><input type="url" className="form-input" value={data.image} onChange={(e) => setData({ ...data, image: e.target.value })} placeholder="https://example.com/image.jpg" /></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">@site (your account)</label><input type="text" className="form-input" value={data.site} onChange={(e) => setData({ ...data, site: e.target.value })} placeholder="@yoursite" /></div>
                    <div className="form-group"><label className="form-label">@creator (author)</label><input type="text" className="form-input" value={data.creator} onChange={(e) => setData({ ...data, creator: e.target.value })} placeholder="@author" /></div>
                </div>
                <div className="code-output"><pre>{generateCode()}</pre><button className="copy-btn" onClick={copyCode}>📋 Copy</button></div>
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}.code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default TwitterCardGenerator;
