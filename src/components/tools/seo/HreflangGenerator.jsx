import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

// Common language/region codes
const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' }
];

const REGIONS = [
    { code: '', name: 'No region (language only)' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'MX', name: 'Mexico' },
    { code: 'BR', name: 'Brazil' },
    { code: 'IN', name: 'India' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' }
];

const HreflangGenerator = () => {
    const toast = useToast();
    const [entries, setEntries] = useState([
        { lang: 'en', region: 'US', url: 'https://example.com/' },
        { lang: 'es', region: '', url: 'https://example.com/es/' }
    ]);
    const [includeXDefault, setIncludeXDefault] = useState(true);
    const [xDefaultIndex, setXDefaultIndex] = useState(0);
    const [outputFormat, setOutputFormat] = useState('html');

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'hreflang-generator').slice(0, 3);

    // Add/remove entries
    const addEntry = () => setEntries([...entries, { lang: 'en', region: '', url: '' }]);
    const removeEntry = (index) => {
        if (entries.length <= 1) { toast.warning('At least one entry is required'); return; }
        setEntries(entries.filter((_, i) => i !== index));
        if (xDefaultIndex >= entries.length - 1) setXDefaultIndex(0);
    };
    const updateEntry = (index, field, value) => {
        const updated = [...entries];
        updated[index][field] = value;
        setEntries(updated);
    };

    // Generate hreflang code
    const getHreflangCode = (entry) => {
        return entry.region ? `${entry.lang}-${entry.region}` : entry.lang;
    };

    const generateCode = () => {
        const validEntries = entries.filter(e => e.url.trim());
        if (validEntries.length === 0) return '<!-- No valid URLs provided -->';

        if (outputFormat === 'html') {
            let html = '';
            validEntries.forEach(entry => {
                html += `<link rel="alternate" hreflang="${getHreflangCode(entry)}" href="${entry.url}" />\n`;
            });
            if (includeXDefault && validEntries[xDefaultIndex]) {
                html += `<link rel="alternate" hreflang="x-default" href="${validEntries[xDefaultIndex].url}" />\n`;
            }
            return html.trim();
        } else {
            // XML sitemap format
            let xml = '<!-- Add inside each <url> in your sitemap -->\n';
            validEntries.forEach(entry => {
                xml += `<xhtml:link rel="alternate" hreflang="${getHreflangCode(entry)}" href="${entry.url}" />\n`;
            });
            if (includeXDefault && validEntries[xDefaultIndex]) {
                xml += `<xhtml:link rel="alternate" hreflang="x-default" href="${validEntries[xDefaultIndex].url}" />\n`;
            }
            return xml.trim();
        }
    };

    const copyCode = () => {
        const validEntries = entries.filter(e => e.url.trim());
        if (validEntries.length === 0) { toast.warning('Please add at least one valid URL'); return; }
        navigator.clipboard.writeText(generateCode());
        toast.success('Hreflang tags copied!');
    };

    const faqs = [
        { question: 'What is hreflang?', answer: 'Hreflang is an HTML attribute that tells search engines which language and regional targeting a page has. It helps serve the right version of your content to users based on their location and language preferences.' },
        { question: 'When should I use hreflang?', answer: 'Use hreflang when you have multiple versions of the same content in different languages or for different regions. For example, English content for US and UK, or Spanish content for Spain and Mexico.' },
        { question: 'What is x-default?', answer: 'The x-default hreflang value specifies the default page to show when no other language/region matches the user. Usually set to your main or English version.' }
    ];

    const seoContent = (<><h2>Hreflang Tag Generator</h2><p>Generate hreflang tags for multilingual and multi-regional websites. Help search engines serve the right language version to users.</p></>);

    return (
        <ToolLayout title="Hreflang Tag Generator" description="Generate hreflang tags for international SEO. Create language and region targeting for multilingual websites." keywords={['hreflang generator', 'international SEO', 'multilingual SEO', 'language targeting']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                {/* Options */}
                <div className="options-row">
                    <div className="form-group">
                        <label className="form-label">Output Format</label>
                        <select className="form-select" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
                            <option value="html">HTML Link Tags</option>
                            <option value="xml">XML Sitemap Format</option>
                        </select>
                    </div>
                    <label className="checkbox-label">
                        <input type="checkbox" checked={includeXDefault} onChange={(e) => setIncludeXDefault(e.target.checked)} />
                        Include x-default
                    </label>
                </div>

                {/* Entries */}
                <div className="entries-section">
                    <h4>🌍 Language Versions ({entries.length})</h4>
                    {entries.map((entry, index) => (
                        <div key={index} className="entry-item">
                            <div className="entry-header">
                                <span>Version {index + 1}</span>
                                <div className="entry-actions">
                                    {includeXDefault && (
                                        <label className="default-label">
                                            <input type="radio" name="xdefault" checked={xDefaultIndex === index} onChange={() => setXDefaultIndex(index)} />
                                            x-default
                                        </label>
                                    )}
                                    {entries.length > 1 && <button className="remove-btn" onClick={() => removeEntry(index)}>✕</button>}
                                </div>
                            </div>
                            <div className="entry-fields">
                                <div>
                                    <label>Language</label>
                                    <select value={entry.lang} onChange={(e) => updateEntry(index, 'lang', e.target.value)}>
                                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name} ({l.code})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Region (optional)</label>
                                    <select value={entry.region} onChange={(e) => updateEntry(index, 'region', e.target.value)}>
                                        {REGIONS.map(r => <option key={r.code} value={r.code}>{r.name}{r.code ? ` (${r.code})` : ''}</option>)}
                                    </select>
                                </div>
                                <div className="url-field">
                                    <label>URL</label>
                                    <input type="url" value={entry.url} onChange={(e) => updateEntry(index, 'url', e.target.value)} placeholder="https://example.com/page" />
                                </div>
                            </div>
                            <div className="hreflang-preview">
                                hreflang="{getHreflangCode(entry)}"
                            </div>
                        </div>
                    ))}
                    <button className="add-btn" onClick={addEntry}>+ Add Language Version</button>
                </div>

                {/* Output */}
                <div className="code-output">
                    <pre>{generateCode()}</pre>
                    <button className="copy-btn" onClick={copyCode}>📋 Copy</button>
                </div>
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .options-row{display:flex;gap:var(--spacing-lg);align-items:center;margin-bottom:var(--spacing-lg);flex-wrap:wrap}
                .options-row .form-group{flex:1;min-width:200px}
                .form-select{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}
                .checkbox-label{display:flex;align-items:center;gap:var(--spacing-sm);cursor:pointer;white-space:nowrap}
                .entries-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .entries-section h4{margin:0 0 var(--spacing-md) 0}
                .entry-item{background:white;padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:3px solid var(--yinmn-blue)}
                .entry-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-sm);font-weight:600}
                .entry-actions{display:flex;align-items:center;gap:var(--spacing-md)}
                .default-label{display:flex;align-items:center;gap:4px;font-size:var(--text-sm);font-weight:normal}
                .remove-btn{background:#dc3545;color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:12px}
                .entry-fields{display:grid;grid-template-columns:1fr 1fr 2fr;gap:var(--spacing-sm)}
                .entry-fields label{display:block;font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px}
                .entry-fields select,.entry-fields input{width:100%;padding:8px;border:1px solid var(--platinum);border-radius:var(--radius)}
                .url-field{grid-column:span 1}
                .hreflang-preview{margin-top:var(--spacing-sm);font-family:var(--font-mono);font-size:var(--text-sm);color:var(--yinmn-blue);background:var(--bg-secondary);padding:4px 8px;border-radius:4px;display:inline-block}
                .add-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);cursor:pointer}
                .code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative}
                .code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}
                .copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}
                @media(max-width:600px){.entry-fields{grid-template-columns:1fr}.url-field{grid-column:span 1}}
            `}</style>
        </ToolLayout>
    );
};

export default HreflangGenerator;
