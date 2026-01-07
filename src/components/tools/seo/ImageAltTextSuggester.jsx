import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const ImageAltTextSuggester = () => {
    const toast = useToast();
    const [images, setImages] = useState([{ url: '', context: '', currentAlt: '' }]);
    const [suggestions, setSuggestions] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'image-alt-text-suggester').slice(0, 3);

    // Add/remove images
    const addImage = () => setImages([...images, { url: '', context: '', currentAlt: '' }]);
    const removeImage = (index) => {
        if (images.length <= 1) { toast.warning('At least one image is required'); return; }
        setImages(images.filter((_, i) => i !== index));
    };
    const updateImage = (index, field, value) => {
        const updated = [...images];
        updated[index][field] = value;
        setImages(updated);
    };

    // Generate alt text suggestions
    const generateSuggestions = () => {
        const validImages = images.filter(img => img.url.trim() || img.context.trim());
        if (validImages.length === 0) {
            toast.warning('Please add at least one image URL or context');
            return;
        }

        const results = validImages.map((img, idx) => {
            const suggestions = [];
            const issues = [];

            // Analyze current alt text
            if (img.currentAlt) {
                const alt = img.currentAlt.trim();
                if (alt.length < 5) {
                    issues.push('Alt text is too short. Aim for 5-125 characters.');
                }
                if (alt.length > 125) {
                    issues.push('Alt text is too long. Keep under 125 characters.');
                }
                if (alt.toLowerCase().startsWith('image of') || alt.toLowerCase().startsWith('picture of')) {
                    issues.push('Avoid starting with "image of" or "picture of" - screen readers already announce it as an image.');
                }
                if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(alt)) {
                    issues.push('Alt text contains file extension. Remove it for better accessibility.');
                }
                if (alt.split(' ').length < 2) {
                    issues.push('Alt text should be descriptive, not just a single word.');
                }
            } else {
                issues.push('Missing alt text! This hurts accessibility and SEO.');
            }

            // Generate suggestions based on context
            const context = img.context.trim().toLowerCase();
            const url = img.url.trim().toLowerCase();

            // Extract potential keywords from URL
            const urlParts = url.split('/').pop()?.split(/[-_.]/) || [];
            const urlKeywords = urlParts.filter(p => p.length > 2 && !/\d+|jpg|jpeg|png|gif|webp/.test(p));

            // Build suggestion templates
            if (context) {
                // Use context to build suggestions
                suggestions.push(`${context}`);
                suggestions.push(`A ${context}`);
                if (context.length < 50) {
                    suggestions.push(`${context} - descriptive view`);
                }
            }

            if (urlKeywords.length > 0) {
                const keywordStr = urlKeywords.join(' ');
                suggestions.push(`${keywordStr.charAt(0).toUpperCase() + keywordStr.slice(1)}`);
                if (context) {
                    suggestions.push(`${keywordStr} showing ${context}`);
                }
            }

            // Generic helpful suggestions
            if (suggestions.length === 0) {
                suggestions.push('Describe what the image shows');
                suggestions.push('Include relevant keywords naturally');
                suggestions.push('Be specific but concise (5-125 chars)');
            }

            // Score the current alt text
            let score = 0;
            if (img.currentAlt) {
                const alt = img.currentAlt.trim();
                if (alt.length >= 5 && alt.length <= 125) score += 40;
                else if (alt.length > 0 && alt.length < 125) score += 20;
                if (alt.split(' ').length >= 2) score += 30;
                if (!/^(image|picture|photo|img)/i.test(alt)) score += 15;
                if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(alt)) score += 15;
            }

            return {
                index: idx + 1,
                url: img.url,
                currentAlt: img.currentAlt,
                context: img.context,
                suggestions: suggestions.slice(0, 4),
                issues,
                score
            };
        });

        setSuggestions(results);
    };

    const copyAlt = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Alt text copied!');
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 50) return '#ffc107';
        return '#dc3545';
    };

    const faqs = [
        { question: 'What is alt text?', answer: 'Alt text (alternative text) is a written description of an image. It helps screen readers describe images to visually impaired users and helps search engines understand image content.' },
        { question: 'How long should alt text be?', answer: 'Keep alt text between 5-125 characters. It should be descriptive but concise. Screen readers may cut off text that\'s too long.' },
        { question: 'When should alt text be empty?', answer: 'Use empty alt="" for purely decorative images that add no meaningful content. This tells screen readers to skip the image entirely.' }
    ];

    const seoContent = (<><h2>Image Alt Text Suggester</h2><p>Generate SEO-friendly alt text for your images. Good alt text improves accessibility and helps images rank in search.</p></>);

    return (
        <ToolLayout title="Image Alt Text Suggester" description="Generate and optimize alt text for images. Improve accessibility and image SEO." keywords={['alt text generator', 'image alt', 'image SEO', 'accessibility']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="images-section">
                    <h4>🖼️ Images ({images.length})</h4>
                    <p className="section-desc">Add image URLs and context to generate alt text suggestions.</p>

                    {images.map((img, index) => (
                        <div key={index} className="image-item">
                            <div className="image-header">
                                <span>Image {index + 1}</span>
                                {images.length > 1 && <button className="remove-btn" onClick={() => removeImage(index)}>✕</button>}
                            </div>
                            <div className="image-fields">
                                <div className="field">
                                    <label>Image URL (optional)</label>
                                    <input type="url" value={img.url} onChange={(e) => updateImage(index, 'url', e.target.value)} placeholder="https://example.com/image.jpg" />
                                </div>
                                <div className="field">
                                    <label>Image Context / Description</label>
                                    <input type="text" value={img.context} onChange={(e) => updateImage(index, 'context', e.target.value)} placeholder="e.g., product photo, team meeting, sunset landscape" />
                                </div>
                                <div className="field">
                                    <label>Current Alt Text (if any)</label>
                                    <input type="text" value={img.currentAlt} onChange={(e) => updateImage(index, 'currentAlt', e.target.value)} placeholder="existing alt text to analyze" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="add-btn" onClick={addImage}>+ Add Image</button>
                </div>

                <button className="btn btn-primary btn-lg" onClick={generateSuggestions}>✨ Generate Suggestions</button>

                {/* Results */}
                {suggestions && (
                    <div className="suggestions-output">
                        {suggestions.map((result, i) => (
                            <div key={i} className="result-card">
                                <div className="result-header">
                                    <h4>Image {result.index}</h4>
                                    <div className="score-badge" style={{ background: getScoreColor(result.score) }}>
                                        {result.score}/100
                                    </div>
                                </div>

                                {result.url && <div className="result-url">{result.url}</div>}

                                {/* Issues */}
                                {result.issues.length > 0 && (
                                    <div className="issues-box">
                                        {result.issues.map((issue, j) => (
                                            <div key={j} className="issue-item">⚠️ {issue}</div>
                                        ))}
                                    </div>
                                )}

                                {/* Suggestions */}
                                <div className="suggestions-box">
                                    <h5>💡 Suggested Alt Text</h5>
                                    {result.suggestions.map((sug, j) => (
                                        <div key={j} className="suggestion-item">
                                            <span className="suggestion-text">{sug}</span>
                                            <button className="copy-btn-sm" onClick={() => copyAlt(sug)}>Copy</button>
                                        </div>
                                    ))}
                                </div>

                                {/* Best Practices */}
                                <div className="tips-box">
                                    <strong>✅ Best Practices:</strong>
                                    <ul>
                                        <li>Be specific and descriptive</li>
                                        <li>Include relevant keywords naturally</li>
                                        <li>Don't start with "image of" or "picture of"</li>
                                        <li>Keep between 5-125 characters</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .images-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .images-section h4{margin:0 0 var(--spacing-sm) 0}
                .section-desc{color:var(--text-muted);font-size:var(--text-sm);margin-bottom:var(--spacing-md)}
                .image-item{background:white;padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:3px solid var(--yinmn-blue)}
                .image-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-sm);font-weight:600}
                .remove-btn{background:#dc3545;color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer}
                .image-fields{display:flex;flex-direction:column;gap:var(--spacing-sm)}
                .field label{display:block;font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px}
                .field input{width:100%;padding:8px;border:1px solid var(--platinum);border-radius:var(--radius)}
                .add-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);cursor:pointer}
                .suggestions-output{margin-top:var(--spacing-lg)}
                .result-card{background:white;border:1px solid var(--platinum);border-radius:var(--radius);padding:var(--spacing-lg);margin-bottom:var(--spacing-lg)}
                .result-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-md)}
                .result-header h4{margin:0}
                .score-badge{color:white;padding:4px 12px;border-radius:20px;font-weight:600;font-size:var(--text-sm)}
                .result-url{font-family:var(--font-mono);font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--spacing-md);word-break:break-all}
                .issues-box{background:#fff5f5;border:1px solid #dc354530;border-radius:var(--radius);padding:var(--spacing-md);margin-bottom:var(--spacing-md)}
                .issue-item{color:#dc3545;font-size:var(--text-sm);margin-bottom:4px}
                .suggestions-box{background:var(--bg-secondary);padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md)}
                .suggestions-box h5{margin:0 0 var(--spacing-sm) 0}
                .suggestion-item{display:flex;justify-content:space-between;align-items:center;background:white;padding:8px 12px;border-radius:var(--radius);margin-bottom:var(--spacing-xs)}
                .suggestion-text{font-family:var(--font-mono);font-size:var(--text-sm)}
                .copy-btn-sm{background:var(--yinmn-blue);color:white;border:none;padding:4px 8px;border-radius:var(--radius);cursor:pointer;font-size:var(--text-xs)}
                .tips-box{font-size:var(--text-sm);color:var(--text-muted)}
                .tips-box ul{margin:var(--spacing-xs) 0 0 var(--spacing-lg);padding:0}
                .tips-box li{margin-bottom:2px}
            `}</style>
        </ToolLayout>
    );
};

export default ImageAltTextSuggester;
