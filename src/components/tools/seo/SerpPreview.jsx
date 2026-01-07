import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const SerpPreview = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'serp-preview').slice(0, 3);

    // Character limit color coding
    const getCharStatus = (current, optimal, max) => {
        if (current <= optimal) return 'good';
        if (current <= max) return 'warning';
        return 'danger';
    };

    const titleStatus = getCharStatus(title.length, 50, 60);
    const descStatus = getCharStatus(description.length, 140, 160);

    const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const truncTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
    const truncDesc = description.length > 160 ? description.slice(0, 157) + '...' : description;

    const faqs = [
        { question: 'What is SERP?', answer: 'SERP stands for Search Engine Results Page. It\'s what you see when you search on Google. Previewing how your page appears helps optimize click-through rates.' },
        { question: 'Why preview SERP snippets?', answer: 'Seeing how your page will look in search results helps you craft better titles and descriptions that get more clicks.' }
    ];

    const seoContent = (<><h2>Google SERP Preview Tool</h2><p>Preview how your webpage will appear in Google search results. Optimize your title and meta description for better click-through rates.</p></>);

    return (
        <ToolLayout title="Google SERP Snippet Preview" description="Preview how your page will appear in Google search results. Optimize title and description." keywords={['SERP preview', 'Google snippet preview', 'SEO preview', 'meta preview']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group">
                    <label className="form-label">Page Title <span className={`char-count ${titleStatus}`}>({title.length}/60)</span></label>
                    <input type="text" className={`form-input ${titleStatus}`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your Page Title - Brand Name" />
                    <div className="char-bar"><div className={`char-progress ${titleStatus}`} style={{ width: `${Math.min(100, (title.length / 60) * 100)}%` }}></div></div>
                </div>
                <div className="form-group"><label className="form-label">URL</label><input type="url" className="form-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" /></div>
                <div className="form-group">
                    <label className="form-label">Meta Description <span className={`char-count ${descStatus}`}>({description.length}/160)</span></label>
                    <textarea className={`form-input ${descStatus}`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Your compelling meta description that makes users want to click..." rows={3} />
                    <div className="char-bar"><div className={`char-progress ${descStatus}`} style={{ width: `${Math.min(100, (description.length / 160) * 100)}%` }}></div></div>
                </div>

                <h3>Preview</h3>
                <div className="serp-preview">
                    <div className="serp-item">
                        <div className="serp-url">{displayUrl || 'example.com'}</div>
                        <div className="serp-title">{truncTitle || 'Your Page Title'}</div>
                        <div className="serp-desc">{truncDesc || 'Your meta description will appear here. Write a compelling description to increase click-through rates from search results.'}</div>
                    </div>
                </div>
                <div className="tips"><strong>Tips:</strong> Keep title under 60 chars, description under 160 chars. Include target keywords naturally. Make it compelling to get clicks!</div>
            </div>
            <style>{`
                .tool-form{max-width:700px;margin:0 auto}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);transition:border-color 0.2s}
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
                .serp-preview{background:white;padding:var(--spacing-lg);border-radius:var(--radius);border:1px solid var(--platinum);margin:var(--spacing-lg) 0}
                .serp-item{max-width:600px}
                .serp-url{font-size:14px;color:#202124;line-height:1.3;margin-bottom:4px}
                .serp-title{font-size:20px;color:#1a0dab;line-height:1.3;margin-bottom:4px;text-decoration:none;cursor:pointer}
                .serp-title:hover{text-decoration:underline}
                .serp-desc{font-size:14px;color:#4d5156;line-height:1.58}
                .tips{background:var(--bg-secondary);padding:var(--spacing-md);border-radius:var(--radius);font-size:var(--text-sm);color:var(--text-light)}
            `}</style>
        </ToolLayout>
    );
};

export default SerpPreview;

