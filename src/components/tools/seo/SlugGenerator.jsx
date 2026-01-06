import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const SlugGenerator = () => {
    const [text, setText] = useState('');
    const [separator, setSeparator] = useState('-');
    const [lowercase, setLowercase] = useState(true);
    const [slug, setSlug] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'slug-generator').slice(0, 3);

    const generate = () => {
        let result = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, separator);
        if (lowercase) result = result.toLowerCase();
        setSlug(result);
    };

    const copySlug = () => { navigator.clipboard.writeText(slug); alert('Copied!'); };

    const faqs = [
        { question: 'What is a URL slug?', answer: 'A slug is the URL-friendly part of a web address that identifies a page. Example: in "example.com/my-blog-post", "my-blog-post" is the slug.' },
        { question: 'Why are slugs important for SEO?', answer: 'SEO-friendly slugs help search engines understand page content. Include keywords, keep them short, use hyphens not underscores.' }
    ];

    const seoContent = (<><h2>URL Slug Generator</h2><p>Convert text to SEO-friendly URL slugs. Remove special characters, normalize accents, and create clean URLs for better SEO.</p></>);

    return (
        <ToolLayout title="URL Slug Generator" description="Convert text to SEO-friendly URL slugs. Create clean, readable URLs." keywords={['slug generator', 'URL slug', 'SEO URL', 'permalink generator']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Enter Text</label><input type="text" className="form-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="My Amazing Blog Post Title!" /></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Separator</label><select className="form-select" value={separator} onChange={(e) => setSeparator(e.target.value)}><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select></div>
                    <label className="checkbox-label"><input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} /> Convert to lowercase</label>
                </div>
                <button className="btn btn-primary btn-lg" onClick={generate}>Generate Slug</button>
                {slug && (
                    <div className="result-box">
                        <div className="slug-display"><code>{slug}</code><button className="copy-btn" onClick={copySlug}>📋</button></div>
                        <p className="preview">URL Preview: example.com/<strong>{slug}</strong></p>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:600px;margin:0 auto}.form-row{display:flex;gap:var(--spacing-md);align-items:center;margin-bottom:var(--spacing-md)}.form-row .form-group{flex:1}.checkbox-label{display:flex;align-items:center;gap:var(--spacing-sm)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.slug-display{display:flex;gap:var(--spacing-sm);align-items:center;justify-content:center}.slug-display code{font-size:var(--text-xl);background:var(--bg-secondary);padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius)}.copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm);border-radius:var(--radius);cursor:pointer}.preview{text-align:center;margin-top:var(--spacing-md);color:var(--text-muted)}`}</style>
        </ToolLayout>
    );
};

export default SlugGenerator;
