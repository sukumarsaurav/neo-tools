import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const HeadingAnalyzer = () => {
    const toast = useToast();
    const [htmlContent, setHtmlContent] = useState('');
    const [analysis, setAnalysis] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'heading-analyzer').slice(0, 3);

    const analyzeHeadings = () => {
        if (!htmlContent.trim()) { toast.warning('Please enter HTML content'); return; }

        // Extract headings using regex
        const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
        const headings = [];
        let match;

        while ((match = headingRegex.exec(htmlContent)) !== null) {
            const level = parseInt(match[1]);
            const text = match[2].replace(/<[^>]*>/g, '').trim();
            headings.push({ level, text, tag: `H${level}` });
        }

        if (headings.length === 0) {
            toast.info('No headings found in the content');
            setAnalysis({ headings: [], issues: [{ type: 'critical', text: 'No headings found in the content' }], score: 0 });
            return;
        }

        // Analyze structure
        const issues = [];
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        headings.forEach(h => counts[h.level]++);

        // Check for H1
        if (counts[1] === 0) {
            issues.push({ type: 'critical', text: 'Missing H1 tag. Every page should have exactly one H1.' });
        } else if (counts[1] > 1) {
            issues.push({ type: 'warning', text: `Multiple H1 tags found (${counts[1]}). Recommended to have only one H1 per page.` });
        }

        // Check hierarchy
        let prevLevel = 0;
        headings.forEach((h, i) => {
            if (prevLevel > 0 && h.level > prevLevel + 1) {
                issues.push({ type: 'warning', text: `Skipped heading level: H${prevLevel} → H${h.level} (heading #${i + 1}: "${h.text.slice(0, 30)}...")` });
            }
            prevLevel = h.level;
        });

        // Check for empty headings
        headings.forEach((h, i) => {
            if (!h.text || h.text.length < 2) {
                issues.push({ type: 'critical', text: `Empty or very short heading found at position ${i + 1}` });
            }
        });

        // Check heading lengths
        headings.forEach((h, i) => {
            if (h.text.length > 70) {
                issues.push({ type: 'info', text: `H${h.level} heading is quite long (${h.text.length} chars): "${h.text.slice(0, 40)}..."` });
            }
        });

        // Check if first heading is H1
        if (headings.length > 0 && headings[0].level !== 1) {
            issues.push({ type: 'warning', text: `First heading is H${headings[0].level}, not H1. Consider starting with H1.` });
        }

        // Calculate score
        let score = 100;
        issues.forEach(issue => {
            if (issue.type === 'critical') score -= 25;
            else if (issue.type === 'warning') score -= 10;
            else score -= 5;
        });
        score = Math.max(0, score);

        setAnalysis({ headings, counts, issues, score });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    };

    const faqs = [
        { question: 'Why is heading structure important?', answer: 'Proper heading structure helps search engines understand your content hierarchy and improves accessibility for screen readers. It also helps readers scan your content.' },
        { question: 'How many H1 tags should I have?', answer: 'Best practice is to have exactly one H1 tag per page, representing the main topic. Use H2-H6 for subheadings.' },
        { question: 'What is heading hierarchy?', answer: 'Heading hierarchy means using headings in order (H1 → H2 → H3) without skipping levels. For example, going from H1 directly to H3 skips H2 and breaks the hierarchy.' }
    ];

    const seoContent = (<><h2>Heading Analyzer</h2><p>Analyze HTML heading structure for SEO. Check for proper H1 usage, heading hierarchy, and get recommendations for improvement.</p></>);

    return (
        <ToolLayout title="Heading Structure Analyzer" description="Analyze HTML heading structure for SEO. Check H1-H6 hierarchy and get optimization recommendations." keywords={['heading analyzer', 'H1 checker', 'heading structure', 'SEO headings']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group">
                    <label className="form-label">Paste HTML Content</label>
                    <textarea className="form-input" value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} rows={10} placeholder="<h1>Main Title</h1>&#10;<h2>Section 1</h2>&#10;<p>Content...</p>&#10;<h3>Subsection 1.1</h3>" />
                </div>
                <button className="btn btn-primary btn-lg" onClick={analyzeHeadings}>🔍 Analyze Headings</button>

                {analysis && (
                    <div className="analysis-output">
                        {/* Score */}
                        <div className="score-card" style={{ borderColor: getScoreColor(analysis.score) }}>
                            <div className="score-value" style={{ color: getScoreColor(analysis.score) }}>{analysis.score}</div>
                            <div className="score-label">Heading Score</div>
                        </div>

                        {/* Heading Counts */}
                        {analysis.counts && (
                            <div className="counts-grid">
                                {[1, 2, 3, 4, 5, 6].map(level => (
                                    <div key={level} className={`count-item ${analysis.counts[level] > 0 ? 'active' : ''}`}>
                                        <span className="count-tag">H{level}</span>
                                        <span className="count-value">{analysis.counts[level]}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Heading Structure */}
                        {analysis.headings.length > 0 && (
                            <div className="structure-section">
                                <h4>📋 Heading Structure</h4>
                                <div className="heading-tree">
                                    {analysis.headings.map((h, i) => (
                                        <div key={i} className="heading-item" style={{ paddingLeft: `${(h.level - 1) * 20}px` }}>
                                            <span className={`heading-tag h${h.level}`}>{h.tag}</span>
                                            <span className="heading-text">{h.text.length > 60 ? h.text.slice(0, 60) + '...' : h.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Issues */}
                        {analysis.issues.length > 0 && (
                            <div className="issues-section">
                                <h4>💡 Recommendations</h4>
                                <div className="issues-list">
                                    {analysis.issues.map((issue, i) => (
                                        <div key={i} className={`issue ${issue.type}`}>
                                            <span className="issue-icon">
                                                {issue.type === 'critical' ? '🔴' : issue.type === 'warning' ? '🟡' : 'ℹ️'}
                                            </span>
                                            <span>{issue.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysis.issues.length === 0 && (
                            <div className="success-message">✅ Great! Your heading structure looks good.</div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                .tool-form{max-width:800px;margin:0 auto}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);font-family:var(--font-mono);font-size:var(--text-sm)}
                .analysis-output{margin-top:var(--spacing-lg)}
                .score-card{text-align:center;padding:var(--spacing-lg);border:3px solid;border-radius:var(--radius);background:white;margin-bottom:var(--spacing-lg)}
                .score-value{font-size:3rem;font-weight:800}
                .score-label{color:var(--text-muted)}
                .counts-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:var(--spacing-sm);margin-bottom:var(--spacing-lg)}
                .count-item{text-align:center;padding:var(--spacing-sm);background:var(--bg-secondary);border-radius:var(--radius);opacity:0.5}
                .count-item.active{opacity:1;background:var(--yinmn-blue);color:white}
                .count-tag{display:block;font-weight:700}
                .count-value{font-size:var(--text-lg)}
                .structure-section,.issues-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .structure-section h4,.issues-section h4{margin:0 0 var(--spacing-md) 0}
                .heading-tree{font-family:var(--font-mono)}
                .heading-item{padding:6px 0;display:flex;align-items:center;gap:var(--spacing-sm)}
                .heading-tag{font-size:var(--text-xs);font-weight:700;padding:2px 6px;border-radius:3px;color:white}
                .heading-tag.h1{background:#dc3545}
                .heading-tag.h2{background:#fd7e14}
                .heading-tag.h3{background:#ffc107;color:#333}
                .heading-tag.h4{background:#28a745}
                .heading-tag.h5{background:#17a2b8}
                .heading-tag.h6{background:#6c757d}
                .heading-text{font-size:var(--text-sm)}
                .issues-list{display:flex;flex-direction:column;gap:var(--spacing-sm)}
                .issue{display:flex;align-items:flex-start;gap:var(--spacing-sm);padding:var(--spacing-sm);background:white;border-radius:var(--radius);border-left:3px solid}
                .issue.critical{border-color:#dc3545}
                .issue.warning{border-color:#ffc107}
                .issue.info{border-color:#17a2b8}
                .success-message{background:#28a74515;color:#28a745;padding:var(--spacing-lg);border-radius:var(--radius);text-align:center;font-weight:600}
                @media(max-width:600px){.counts-grid{grid-template-columns:repeat(3,1fr)}}
            `}</style>
        </ToolLayout>
    );
};

export default HeadingAnalyzer;
