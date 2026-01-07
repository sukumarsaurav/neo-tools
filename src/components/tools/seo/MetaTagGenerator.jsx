import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const MetaTagGenerator = () => {
    const toast = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [author, setAuthor] = useState('');
    const [robots, setRobots] = useState('index, follow');
    const [viewport, setViewport] = useState(true);
    const [charset, setCharset] = useState(true);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'meta-tag-generator').slice(0, 3);

    // Character limit color coding
    const getCharStatus = (current, optimal, max) => {
        if (current <= optimal) return 'good';
        if (current <= max) return 'warning';
        return 'danger';
    };

    const titleStatus = getCharStatus(title.length, 50, 60);
    const descStatus = getCharStatus(description.length, 140, 160);

    const generateCode = () => {
        let code = '';
        if (charset) code += '<meta charset="UTF-8">\n';
        if (viewport) code += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
        if (title) code += `<title>${title}</title>\n<meta property="og:title" content="${title}">\n`;
        if (description) code += `<meta name="description" content="${description}">\n<meta property="og:description" content="${description}">\n`;
        if (keywords) code += `<meta name="keywords" content="${keywords}">\n`;
        if (author) code += `<meta name="author" content="${author}">\n`;
        code += `<meta name="robots" content="${robots}">\n`;
        return code;
    };

    const copyCode = () => { navigator.clipboard.writeText(generateCode()); toast.success('Copied to clipboard!'); };

    const faqs = [
        { question: 'What are meta tags?', answer: 'Meta tags are HTML elements that provide information about a webpage to search engines and browsers. They affect SEO and how your page appears in search results.' },
        { question: 'How long should meta title be?', answer: '50-60 characters is optimal for titles. Google typically shows 50-60 characters in search results before truncating.' },
        { question: 'How long should meta description be?', answer: '150-160 characters is ideal. Google may show up to 155-160 characters before truncating with ellipsis.' }
    ];

    const seoContent = (<><h2>Meta Tag Generator</h2><p>Generate essential HTML meta tags for better SEO. Meta tags help search engines understand your page content and display rich snippets in search results.</p></>);

    return (
        <ToolLayout title="Meta Tag Generator" description="Generate SEO-friendly meta tags for your website. Create title, description, keywords, and Open Graph tags." keywords={['meta tag generator', 'SEO tags', 'meta description generator', 'title tag generator']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group">
                    <label className="form-label">Page Title <span className={`char-count ${titleStatus}`}>({title.length}/60)</span></label>
                    <input type="text" className={`form-input ${titleStatus}`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your page title" maxLength="70" />
                    <div className="char-bar"><div className={`char-progress ${titleStatus}`} style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }}></div></div>
                </div>
                <div className="form-group">
                    <label className="form-label">Description <span className={`char-count ${descStatus}`}>({description.length}/160)</span></label>
                    <textarea className={`form-input ${descStatus}`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Your page description" maxLength="200" rows={3} />
                    <div className="char-bar"><div className={`char-progress ${descStatus}`} style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }}></div></div>
                </div>
                <div className="form-group"><label className="form-label">Keywords (comma-separated)</label><input type="text" className="form-input" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="keyword1, keyword2, keyword3" /></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Author</label><input type="text" className="form-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name" /></div>
                    <div className="form-group"><label className="form-label">Robots</label><select className="form-select" value={robots} onChange={(e) => setRobots(e.target.value)}><option value="index, follow">index, follow</option><option value="noindex, follow">noindex, follow</option><option value="index, nofollow">index, nofollow</option><option value="noindex, nofollow">noindex, nofollow</option></select></div>
                </div>
                <div className="checkboxes"><label><input type="checkbox" checked={charset} onChange={(e) => setCharset(e.target.checked)} /> Include charset</label><label><input type="checkbox" checked={viewport} onChange={(e) => setViewport(e.target.checked)} /> Include viewport</label></div>
                <div className="code-output"><pre>{generateCode()}</pre><button className="copy-btn" onClick={copyCode}>📋 Copy Code</button></div>
            </div>
            <style>{`
                .tool-form{max-width:700px;margin:0 auto}
                .form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);font-family:inherit;transition:border-color 0.2s}
                .form-input.good{border-color:#28a745}
                .form-input.warning{border-color:#ffc107}
                .form-input.danger{border-color:#dc3545}
                .char-count{font-weight:600;margin-left:var(--spacing-xs)}
                .char-count.good{color:#28a745}
                .char-count.warning{color:#ffc107}
                .char-count.danger{color:#dc3545}
                .char-bar{height:4px;background:var(--platinum);border-radius:2px;margin-top:4px;overflow:hidden}
                .char-progress{height:100%;border-radius:2px;transition:width 0.2s,background 0.2s}
                .char-progress.good{background:#28a745}
                .char-progress.warning{background:#ffc107}
                .char-progress.danger{background:#dc3545}
                .checkboxes{display:flex;gap:var(--spacing-lg);margin-bottom:var(--spacing-lg)}
                .checkboxes label{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer}
                .code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}
                .code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;word-break:break-all;margin:0}
                .copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}
            `}</style>
        </ToolLayout>
    );
};

export default MetaTagGenerator;

