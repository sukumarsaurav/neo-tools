import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const KeywordDensity = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'keyword-density').slice(0, 3);

    const analyze = () => {
        if (!text.trim()) { alert('Enter some text'); return; }
        const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
        const totalWords = words.length;
        const freq = {};
        words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
        const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
        const keywords = sorted.map(([word, count]) => ({ word, count, density: ((count / totalWords) * 100).toFixed(2) }));
        setResult({ totalWords, keywords });
    };

    const faqs = [
        { question: 'What is keyword density?', answer: 'Keyword density is the percentage of times a keyword appears in text compared to total words. Formula: (Keyword Count / Total Words) × 100.' },
        { question: 'What is optimal keyword density?', answer: 'Generally 1-2% is considered optimal. Higher density may seem spammy to search engines, while lower may not signal relevance.' }
    ];

    const seoContent = (<><h2>Keyword Density Checker</h2><p>Analyze keyword density in your content. Find the most frequently used words and optimize your content for SEO.</p></>);

    return (
        <ToolLayout title="Keyword Density Checker" description="Analyze keyword density and word frequency in your content for SEO optimization." keywords={['keyword density', 'keyword checker', 'SEO analyzer', 'word frequency']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Enter your content</label><textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste your article or page content here..." /></div>
                <button className="btn btn-primary btn-lg" onClick={analyze}>Analyze</button>
                {result && (
                    <div className="result-box">
                        <p className="total">Total Words: <strong>{result.totalWords}</strong></p>
                        <h4>Top Keywords</h4>
                        <div className="keywords-table">
                            <div className="table-header"><span>Keyword</span><span>Count</span><span>Density</span></div>
                            {result.keywords.map((k, i) => (
                                <div key={i} className="table-row"><span>{k.word}</span><span>{k.count}</span><span>{k.density}%</span></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.total{font-size:var(--text-lg);margin-bottom:var(--spacing-md)}.keywords-table{background:var(--bg-secondary);border-radius:var(--radius);overflow:hidden}.table-header,.table-row{display:grid;grid-template-columns:2fr 1fr 1fr;padding:var(--spacing-sm) var(--spacing-md)}.table-header{background:var(--yinmn-blue);color:white;font-weight:600}.table-row:nth-child(even){background:var(--bg-primary)}`}</style>
        </ToolLayout>
    );
};

export default KeywordDensity;
