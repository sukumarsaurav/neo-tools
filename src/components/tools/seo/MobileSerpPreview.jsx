import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const MobileSerpPreview = () => {
    const toast = useToast();
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [favicon, setFavicon] = useState('');
    const [breadcrumbs, setBreadcrumbs] = useState('');
    const [sitelinks, setSitelinks] = useState([]);
    const [showDate, setShowDate] = useState(false);
    const [resultType, setResultType] = useState('standard');

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'mobile-serp-preview').slice(0, 3);

    // Character limits
    const TITLE_OPTIMAL = 50;
    const TITLE_MAX = 60;
    const DESC_OPTIMAL = 120;
    const DESC_MAX = 155;

    const getTitleStatus = () => {
        const len = title.length;
        if (len === 0) return { status: 'empty', color: '#ccc' };
        if (len <= TITLE_OPTIMAL) return { status: 'good', color: '#28a745' };
        if (len <= TITLE_MAX) return { status: 'warning', color: '#ffc107' };
        return { status: 'danger', color: '#dc3545' };
    };

    const getDescStatus = () => {
        const len = description.length;
        if (len === 0) return { status: 'empty', color: '#ccc' };
        if (len <= DESC_OPTIMAL) return { status: 'good', color: '#28a745' };
        if (len <= DESC_MAX) return { status: 'warning', color: '#ffc107' };
        return { status: 'danger', color: '#dc3545' };
    };

    // Extract domain from URL
    const getDomain = () => {
        if (!url) return 'example.com';
        try {
            const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
            return urlObj.hostname;
        } catch {
            return url.split('/')[0] || 'example.com';
        }
    };

    // Get breadcrumb path
    const getBreadcrumbPath = () => {
        if (breadcrumbs) return breadcrumbs;
        if (!url) return '';
        try {
            const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
            const path = urlObj.pathname.split('/').filter(p => p).slice(0, 2);
            return path.join(' › ');
        } catch {
            return '';
        }
    };

    // Truncate for display
    const truncateTitle = (text, max = 60) => {
        if (text.length <= max) return text;
        return text.slice(0, max - 3) + '...';
    };

    const truncateDesc = (text, max = 155) => {
        if (text.length <= max) return text;
        return text.slice(0, max - 3) + '...';
    };

    const faqs = [
        { question: 'Why preview mobile SERP?', answer: 'Over 60% of searches happen on mobile. Mobile SERP displays differ from desktop—titles and descriptions are truncated differently, and users see fewer characters.' },
        { question: 'What\'s the ideal title length for mobile?', answer: 'Keep titles under 50-55 characters for mobile to avoid truncation. Google may show 50-60 characters on mobile vs 60-70 on desktop.' },
        { question: 'How long should meta descriptions be?', answer: 'For mobile, aim for 120-155 characters. Mobile shows fewer characters than desktop, so front-load important information.' }
    ];

    const seoContent = (<><h2>Mobile SERP Preview</h2><p>Preview how your page appears in mobile Google search results. Optimize titles and descriptions for mobile users.</p></>);

    return (
        <ToolLayout title="Mobile SERP Preview" description="Preview how your page looks in mobile Google search results. Optimize for mobile-first indexing." keywords={['mobile SERP preview', 'mobile search results', 'mobile SEO', 'SERP simulator']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-section">
                    {/* Inputs */}
                    <div className="input-group">
                        <label className="form-label">
                            Page Title
                            <span className="char-count" style={{ color: getTitleStatus().color }}>
                                {title.length}/{TITLE_MAX}
                            </span>
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Your Page Title | Brand Name"
                            style={{ borderColor: getTitleStatus().color }}
                        />
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(100, (title.length / TITLE_MAX) * 100)}%`, background: getTitleStatus().color }}></div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="form-label">Page URL</label>
                        <input
                            type="text"
                            className="form-input"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/page-url"
                        />
                    </div>

                    <div className="input-group">
                        <label className="form-label">
                            Meta Description
                            <span className="char-count" style={{ color: getDescStatus().color }}>
                                {description.length}/{DESC_MAX}
                            </span>
                        </label>
                        <textarea
                            className="form-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A compelling description of your page content..."
                            rows={3}
                            style={{ borderColor: getDescStatus().color }}
                        />
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min(100, (description.length / DESC_MAX) * 100)}%`, background: getDescStatus().color }}></div>
                        </div>
                    </div>

                    <div className="input-row">
                        <div className="input-group">
                            <label className="form-label">Breadcrumbs (optional)</label>
                            <input type="text" className="form-input" value={breadcrumbs} onChange={(e) => setBreadcrumbs(e.target.value)} placeholder="Category › Subcategory" />
                        </div>
                        <label className="checkbox-label">
                            <input type="checkbox" checked={showDate} onChange={(e) => setShowDate(e.target.checked)} />
                            Show date
                        </label>
                    </div>
                </div>

                {/* Mobile Preview */}
                <div className="preview-section">
                    <h4>📱 Mobile Preview</h4>
                    <div className="mobile-frame">
                        <div className="mobile-header">
                            <div className="status-bar">
                                <span>9:41</span>
                                <div className="status-icons">
                                    <span>📶</span>
                                    <span>🔋</span>
                                </div>
                            </div>
                            <div className="search-bar">
                                <span className="search-icon">🔍</span>
                                <span className="search-text">your search query</span>
                            </div>
                        </div>

                        <div className="serp-result">
                            <div className="result-site">
                                <div className="site-favicon">
                                    {favicon ? <img src={favicon} alt="" /> : <span className="default-favicon">🌐</span>}
                                </div>
                                <div className="site-info">
                                    <div className="site-name">{getDomain()}</div>
                                    <div className="site-url">
                                        {getDomain()}
                                        {getBreadcrumbPath() && <span className="breadcrumb"> › {getBreadcrumbPath()}</span>}
                                    </div>
                                </div>
                                <span className="menu-dots">⋮</span>
                            </div>

                            <div className="result-title">
                                {truncateTitle(title || 'Your Page Title Goes Here')}
                            </div>

                            <div className="result-snippet">
                                {showDate && <span className="date">Jan 7, 2026 — </span>}
                                {truncateDesc(description || 'Your meta description will appear here. Write a compelling summary that encourages users to click through to your page.')}
                            </div>
                        </div>

                        {/* Additional result for context */}
                        <div className="serp-result faded">
                            <div className="result-site">
                                <div className="site-favicon"><span className="default-favicon">🌐</span></div>
                                <div className="site-info">
                                    <div className="site-name">competitor.com</div>
                                    <div className="site-url">competitor.com › page</div>
                                </div>
                            </div>
                            <div className="result-title">Competitor Result Title</div>
                            <div className="result-snippet">This shows how your result compares to others...</div>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="tips-section">
                    <h4>💡 Mobile SEO Tips</h4>
                    <div className="tips-grid">
                        <div className="tip">
                            <span className="tip-icon">📏</span>
                            <div>
                                <strong>Title: 50-55 chars</strong>
                                <p>Mobile shows less than desktop</p>
                            </div>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">📝</span>
                            <div>
                                <strong>Description: 120-155 chars</strong>
                                <p>Front-load important info</p>
                            </div>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">🎯</span>
                            <div>
                                <strong>Include keywords</strong>
                                <p>They appear bold in results</p>
                            </div>
                        </div>
                        <div className="tip">
                            <span className="tip-icon">📞</span>
                            <div>
                                <strong>Add CTA</strong>
                                <p>Encourage clicks with action words</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .form-section{margin-bottom:var(--spacing-lg)}
                .input-group{margin-bottom:var(--spacing-md)}
                .form-label{display:flex;justify-content:space-between;margin-bottom:var(--spacing-xs);font-weight:500}
                .char-count{font-size:var(--text-sm);font-weight:normal}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);transition:border-color 0.2s}
                .progress-bar{height:4px;background:var(--platinum);border-radius:2px;margin-top:4px;overflow:hidden}
                .progress-fill{height:100%;transition:width 0.2s,background 0.2s}
                .input-row{display:flex;gap:var(--spacing-md);align-items:end}
                .input-row .input-group{flex:1}
                .checkbox-label{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;white-space:nowrap}
                .preview-section{margin-bottom:var(--spacing-lg)}
                .preview-section h4{margin-bottom:var(--spacing-md)}
                .mobile-frame{max-width:375px;margin:0 auto;background:#f8f9fa;border-radius:24px;padding:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15)}
                .mobile-header{background:white;border-radius:16px 16px 0 0;padding:8px 16px}
                .status-bar{display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px}
                .search-bar{background:#f1f3f4;border-radius:20px;padding:8px 16px;display:flex;align-items:center;gap:8px}
                .search-icon{font-size:14px}
                .search-text{color:#5f6368;font-size:14px}
                .serp-result{background:white;padding:12px 16px;border-bottom:1px solid #e0e0e0}
                .serp-result.faded{opacity:0.5}
                .result-site{display:flex;align-items:center;gap:8px;margin-bottom:8px}
                .site-favicon{width:28px;height:28px;border-radius:50%;background:#f1f3f4;display:flex;align-items:center;justify-content:center}
                .site-favicon img{width:16px;height:16px}
                .default-favicon{font-size:12px}
                .site-info{flex:1}
                .site-name{font-size:12px;color:#202124}
                .site-url{font-size:12px;color:#5f6368}
                .breadcrumb{color:#5f6368}
                .menu-dots{color:#5f6368}
                .result-title{font-size:18px;color:#1a0dab;line-height:1.3;margin-bottom:4px}
                .result-snippet{font-size:13px;color:#4d5156;line-height:1.5}
                .date{color:#70757a}
                .tips-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius)}
                .tips-section h4{margin:0 0 var(--spacing-md) 0}
                .tips-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--spacing-md)}
                .tip{display:flex;gap:var(--spacing-sm);background:white;padding:var(--spacing-md);border-radius:var(--radius)}
                .tip-icon{font-size:1.5rem}
                .tip strong{display:block;margin-bottom:2px}
                .tip p{margin:0;font-size:var(--text-sm);color:var(--text-muted)}
                @media(max-width:600px){.tips-grid{grid-template-columns:1fr}}
            `}</style>
        </ToolLayout>
    );
};

export default MobileSerpPreview;
