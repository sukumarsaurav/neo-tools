import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const CanonicalUrlGenerator = () => {
    const toast = useToast();
    const [baseUrl, setBaseUrl] = useState('');
    const [variations, setVariations] = useState([
        { url: '', isCanonical: true }
    ]);
    const [includeProtocol, setIncludeProtocol] = useState(true);
    const [forceHttps, setForceHttps] = useState(true);
    const [removeTrailingSlash, setRemoveTrailingSlash] = useState(false);
    const [removeWww, setRemoveWww] = useState(false);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'canonical-url-generator').slice(0, 3);

    // Add/remove URL variations
    const addVariation = () => setVariations([...variations, { url: '', isCanonical: false }]);
    const removeVariation = (index) => {
        if (variations.length <= 1) { toast.warning('At least one URL is required'); return; }
        const newVariations = variations.filter((_, i) => i !== index);
        // Ensure at least one is canonical
        if (!newVariations.some(v => v.isCanonical)) {
            newVariations[0].isCanonical = true;
        }
        setVariations(newVariations);
    };
    const updateVariation = (index, field, value) => {
        const updated = [...variations];
        if (field === 'isCanonical' && value) {
            // Only one can be canonical
            updated.forEach((v, i) => v.isCanonical = i === index);
        } else {
            updated[index][field] = value;
        }
        setVariations(updated);
    };

    // Normalize URL
    const normalizeUrl = (url) => {
        if (!url) return '';
        let normalized = url.trim();

        // Add protocol if missing
        if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
            normalized = (forceHttps ? 'https://' : 'http://') + normalized;
        }

        // Force HTTPS
        if (forceHttps && normalized.startsWith('http://')) {
            normalized = normalized.replace('http://', 'https://');
        }

        // Remove www
        if (removeWww) {
            normalized = normalized.replace(/^(https?:\/\/)www\./, '$1');
        }

        // Handle trailing slash
        if (removeTrailingSlash && normalized.endsWith('/') && normalized.split('/').length > 4) {
            normalized = normalized.slice(0, -1);
        }

        return normalized;
    };

    const getCanonicalUrl = () => {
        const canonical = variations.find(v => v.isCanonical);
        return canonical ? normalizeUrl(canonical.url) : '';
    };

    const generateCode = () => {
        const canonicalUrl = getCanonicalUrl();
        if (!canonicalUrl) return '<!-- No canonical URL specified -->';

        return `<link rel="canonical" href="${canonicalUrl}" />`;
    };

    const generateAllTags = () => {
        const canonicalUrl = getCanonicalUrl();
        if (!canonicalUrl) return '';

        let html = `<!-- Canonical Tag -->\n`;
        html += `<link rel="canonical" href="${canonicalUrl}" />\n\n`;

        // Self-referencing for all variations
        const nonCanonical = variations.filter(v => !v.isCanonical && v.url.trim());
        if (nonCanonical.length > 0) {
            html += `<!-- Alternative URLs should also point to canonical -->\n`;
            html += `<!-- Place this same tag on all URL variations: -->\n`;
            nonCanonical.forEach(v => {
                html += `<!-- ${normalizeUrl(v.url)} → canonical: ${canonicalUrl} -->\n`;
            });
        }

        return html.trim();
    };

    const copyCode = () => {
        if (!getCanonicalUrl()) { toast.warning('Please enter a canonical URL'); return; }
        navigator.clipboard.writeText(generateCode());
        toast.success('Canonical tag copied!');
    };

    const faqs = [
        { question: 'What is a canonical URL?', answer: 'A canonical URL is the preferred version of a page when multiple URLs can access the same content. It tells search engines which version to index and rank.' },
        { question: 'When do I need canonical tags?', answer: 'Use canonical tags when: content is accessible via multiple URLs, you have www/non-www versions, HTTP/HTTPS versions, pages with URL parameters, or syndicated content.' },
        { question: 'Should every page have a canonical tag?', answer: 'Yes! Even if a page has only one URL, a self-referencing canonical tag is recommended. It protects against accidental duplicate content from URL parameters or tracking codes.' }
    ];

    const seoContent = (<><h2>Canonical URL Generator</h2><p>Generate canonical tags to prevent duplicate content issues. Specify the preferred URL version for search engines to index.</p></>);

    return (
        <ToolLayout title="Canonical URL Generator" description="Generate canonical tags to avoid duplicate content. Specify preferred URL versions for search engines." keywords={['canonical URL', 'canonical tag generator', 'duplicate content', 'SEO canonical']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                {/* Options */}
                <div className="options-section">
                    <h4>⚙️ URL Normalization Options</h4>
                    <div className="options-grid">
                        <label className="checkbox-label">
                            <input type="checkbox" checked={forceHttps} onChange={(e) => setForceHttps(e.target.checked)} />
                            Force HTTPS
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" checked={removeWww} onChange={(e) => setRemoveWww(e.target.checked)} />
                            Remove www
                        </label>
                        <label className="checkbox-label">
                            <input type="checkbox" checked={removeTrailingSlash} onChange={(e) => setRemoveTrailingSlash(e.target.checked)} />
                            Remove trailing slash
                        </label>
                    </div>
                </div>

                {/* URL Variations */}
                <div className="variations-section">
                    <h4>🔗 URL Variations</h4>
                    <p className="section-desc">Add all URL variations that point to the same content. Select which one should be the canonical version.</p>

                    {variations.map((v, index) => (
                        <div key={index} className={`variation-item ${v.isCanonical ? 'is-canonical' : ''}`}>
                            <div className="variation-header">
                                <label className="radio-label">
                                    <input type="radio" name="canonical" checked={v.isCanonical} onChange={() => updateVariation(index, 'isCanonical', true)} />
                                    <span className={v.isCanonical ? 'canonical-badge' : ''}>
                                        {v.isCanonical ? '★ Canonical' : 'Set as canonical'}
                                    </span>
                                </label>
                                {variations.length > 1 && (
                                    <button className="remove-btn" onClick={() => removeVariation(index)}>✕</button>
                                )}
                            </div>
                            <input
                                type="url"
                                className="form-input"
                                value={v.url}
                                onChange={(e) => updateVariation(index, 'url', e.target.value)}
                                placeholder="https://example.com/page"
                            />
                            {v.url && (
                                <div className="normalized-preview">
                                    Normalized: {normalizeUrl(v.url)}
                                </div>
                            )}
                        </div>
                    ))}
                    <button className="add-btn" onClick={addVariation}>+ Add URL Variation</button>
                </div>

                {/* Output */}
                <div className="code-output">
                    <pre>{generateAllTags()}</pre>
                    <button className="copy-btn" onClick={copyCode}>📋 Copy Tag</button>
                </div>

                {/* Tips */}
                <div className="tips-section">
                    <h4>💡 Best Practices</h4>
                    <ul>
                        <li>Use absolute URLs with full protocol (https://)</li>
                        <li>Be consistent with www/non-www</li>
                        <li>Self-reference on every page (point to itself)</li>
                        <li>Combine with 301 redirects when possible</li>
                    </ul>
                </div>
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .options-section,.variations-section,.tips-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .options-section h4,.variations-section h4,.tips-section h4{margin:0 0 var(--spacing-md) 0}
                .section-desc{color:var(--text-muted);font-size:var(--text-sm);margin-bottom:var(--spacing-md)}
                .options-grid{display:flex;flex-wrap:wrap;gap:var(--spacing-lg)}
                .checkbox-label{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer}
                .variation-item{background:white;padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:3px solid var(--platinum)}
                .variation-item.is-canonical{border-left-color:var(--yinmn-blue);background:#f0f4ff}
                .variation-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-sm)}
                .radio-label{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer}
                .canonical-badge{color:var(--yinmn-blue);font-weight:600}
                .remove-btn{background:#dc3545;color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:12px}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}
                .normalized-preview{font-family:var(--font-mono);font-size:var(--text-sm);color:var(--text-muted);margin-top:var(--spacing-xs);padding:4px 8px;background:var(--bg-secondary);border-radius:4px}
                .add-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);cursor:pointer}
                .code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-bottom:var(--spacing-lg)}
                .code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}
                .copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}
                .tips-section ul{margin:0;padding-left:var(--spacing-lg)}
                .tips-section li{margin-bottom:var(--spacing-xs);color:var(--text-muted)}
            `}</style>
        </ToolLayout>
    );
};

export default CanonicalUrlGenerator;
