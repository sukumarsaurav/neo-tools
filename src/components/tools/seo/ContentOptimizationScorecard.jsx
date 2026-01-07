import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const ContentOptimizationScorecard = () => {
    const toast = useToast();
    const [content, setContent] = useState('');
    const [targetKeyword, setTargetKeyword] = useState('');
    const [targetAudience, setTargetAudience] = useState('general');
    const [analysis, setAnalysis] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'content-optimization-scorecard').slice(0, 3);

    const analyzeContent = () => {
        if (!content.trim()) { toast.warning('Please enter content to analyze'); return; }
        if (!targetKeyword.trim()) { toast.warning('Please enter a target keyword'); return; }

        const text = content.trim();
        const keyword = targetKeyword.toLowerCase().trim();

        // Word count
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        // Keyword analysis
        const keywordRegex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        const keywordCount = (text.match(keywordRegex) || []).length;
        const keywordDensity = wordCount > 0 ? ((keywordCount / wordCount) * 100).toFixed(2) : 0;

        // Sentence analysis
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgSentenceLength = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;

        // Paragraph analysis
        const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

        // Heading detection (lines that look like headings)
        const headingPatterns = text.match(/^#+\s.+$|^[A-Z][^.!?]*:?\s*$/gm) || [];

        // Readability (simplified Flesch-Kincaid)
        const syllables = text.toLowerCase().replace(/[^a-z]/g, '').split('').filter((c, i, arr) => {
            return 'aeiou'.includes(c) && (i === 0 || !'aeiou'.includes(arr[i - 1]));
        }).length || 1;
        const avgSyllablesPerWord = syllables / Math.max(wordCount, 1);
        const fleschScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)));

        // Reading level interpretation
        const getReadingLevel = (score) => {
            if (score >= 90) return { level: '5th Grade', desc: 'Very Easy' };
            if (score >= 80) return { level: '6th Grade', desc: 'Easy' };
            if (score >= 70) return { level: '7th Grade', desc: 'Fairly Easy' };
            if (score >= 60) return { level: '8-9th Grade', desc: 'Standard' };
            if (score >= 50) return { level: '10-12th Grade', desc: 'Fairly Difficult' };
            if (score >= 30) return { level: 'College', desc: 'Difficult' };
            return { level: 'Graduate', desc: 'Very Difficult' };
        };
        const readingLevel = getReadingLevel(fleschScore);

        // Reading time (average 200-250 wpm)
        const readingTimeMinutes = Math.ceil(wordCount / 225);

        // Score calculations
        const scores = {
            wordCount: wordCount >= 300 && wordCount <= 500 ? 70 : wordCount >= 1000 && wordCount <= 2500 ? 100 : wordCount > 2500 ? 90 : wordCount >= 500 ? 85 : 50,
            keywordDensity: keywordDensity >= 0.5 && keywordDensity <= 2.5 ? 100 : keywordDensity > 2.5 && keywordDensity <= 4 ? 70 : keywordDensity > 4 ? 40 : 60,
            readability: fleschScore >= 60 ? 100 : fleschScore >= 40 ? 80 : fleschScore >= 20 ? 60 : 40,
            structure: headingPatterns.length >= 3 ? 100 : headingPatterns.length >= 1 ? 70 : 40,
            paragraphs: paragraphs.length >= 5 ? 100 : paragraphs.length >= 3 ? 80 : 50
        };

        const totalScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);

        const suggestions = [];

        // Word count suggestions
        if (wordCount < 300) suggestions.push({ type: 'critical', text: 'Content is too short. Aim for at least 1,000 words for comprehensive coverage.' });
        else if (wordCount < 1000) suggestions.push({ type: 'warning', text: 'Consider expanding content to 1,500-2,500 words for better ranking potential.' });
        else if (wordCount > 3000) suggestions.push({ type: 'info', text: 'Long content is good, but ensure it stays focused and well-organized.' });

        // Keyword suggestions
        if (keywordDensity < 0.5) suggestions.push({ type: 'warning', text: `Keyword "${targetKeyword}" appears too infrequently. Try using it more naturally in the content.` });
        else if (keywordDensity > 3) suggestions.push({ type: 'warning', text: `Keyword density (${keywordDensity}%) is high. Avoid keyword stuffing—use synonyms and related terms.` });

        // Readability suggestions
        if (avgSentenceLength > 25) suggestions.push({ type: 'warning', text: 'Sentences are too long on average. Break them up for better readability.' });
        if (fleschScore < 50) suggestions.push({ type: 'warning', text: 'Content may be too complex. Simplify language for your target audience.' });

        // Structure suggestions
        if (headingPatterns.length < 3) suggestions.push({ type: 'warning', text: 'Add more headings (H2, H3) to improve content structure and scannability.' });
        if (paragraphs.length < 5) suggestions.push({ type: 'info', text: 'Break content into more paragraphs for easier reading.' });

        // Additional suggestions
        if (!text.toLowerCase().includes(keyword)) suggestions.push({ type: 'critical', text: `Target keyword "${targetKeyword}" not found in content!` });
        if (text.length > 100 && !text.slice(0, 200).toLowerCase().includes(keyword)) {
            suggestions.push({ type: 'warning', text: 'Include target keyword in the first 100-200 words of content.' });
        }

        const grade = totalScore >= 90 ? 'A' : totalScore >= 80 ? 'B' : totalScore >= 70 ? 'C' : totalScore >= 60 ? 'D' : 'F';

        setAnalysis({
            wordCount,
            keywordCount,
            keywordDensity,
            sentences: sentences.length,
            avgSentenceLength,
            paragraphs: paragraphs.length,
            headings: headingPatterns.length,
            fleschScore: Math.round(fleschScore),
            readingLevel,
            readingTimeMinutes,
            scores,
            totalScore,
            grade,
            suggestions
        });
    };

    const getGradeColor = (grade) => {
        const colors = { 'A': '#28a745', 'B': '#20c997', 'C': '#ffc107', 'D': '#fd7e14', 'F': '#dc3545' };
        return colors[grade] || '#666';
    };

    const getScoreBar = (score) => {
        const color = score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545';
        return (
            <div className="score-bar">
                <div className="score-fill" style={{ width: `${score}%`, background: color }}></div>
            </div>
        );
    };

    const faqs = [
        { question: 'What is a good content score?', answer: 'Aim for 80+ (B grade or higher). This indicates well-optimized content with good structure, appropriate keyword usage, and readable text.' },
        { question: 'What is ideal keyword density?', answer: 'Generally 1-2% is optimal. Higher density may seem spammy, while lower may not signal relevance to search engines.' },
        { question: 'How long should my content be?', answer: 'For most topics, 1,500-2,500 words perform well in search. However, quality and comprehensiveness matter more than word count alone.' }
    ];

    const seoContent = (<><h2>Content Optimization Scorecard</h2><p>Analyze your content for SEO optimization. Get scores for word count, keyword density, readability, and structure with actionable improvement suggestions.</p></>);

    return (
        <ToolLayout title="Content Optimization Scorecard" description="Analyze your content and get optimization scores with actionable SEO improvement suggestions." keywords={['content optimization', 'SEO score', 'content analysis', 'keyword density', 'readability']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="scorecard-container">
                <div className="scorecard-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Target Keyword</label>
                            <input type="text" className="form-input" value={targetKeyword} onChange={(e) => setTargetKeyword(e.target.value)} placeholder="e.g., content marketing" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Target Audience</label>
                            <select className="form-select" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
                                <option value="general">General Audience</option>
                                <option value="business">Business Professionals</option>
                                <option value="technical">Technical Audience</option>
                                <option value="beginners">Beginners</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Paste Your Content</label>
                        <textarea className="form-input content-area" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your article or page content here for analysis..." rows={12} />
                        <div className="character-count">{content.length} characters</div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={analyzeContent}>📊 Analyze Content</button>
                </div>

                {analysis && (
                    <div className="analysis-output">
                        {/* Main Score */}
                        <div className="main-score" style={{ borderColor: getGradeColor(analysis.grade) }}>
                            <div className="grade" style={{ color: getGradeColor(analysis.grade) }}>{analysis.grade}</div>
                            <div className="score-number">{analysis.totalScore}/100</div>
                            <div className="score-label">Overall Score</div>
                        </div>

                        {/* Quick Stats */}
                        <div className="quick-stats">
                            <div className="stat"><span className="stat-value">{analysis.wordCount}</span><span className="stat-label">Words</span></div>
                            <div className="stat"><span className="stat-value">{analysis.sentences}</span><span className="stat-label">Sentences</span></div>
                            <div className="stat"><span className="stat-value">{analysis.paragraphs}</span><span className="stat-label">Paragraphs</span></div>
                            <div className="stat"><span className="stat-value">{analysis.keywordCount}</span><span className="stat-label">Keyword Uses</span></div>
                            <div className="stat"><span className="stat-value">{analysis.keywordDensity}%</span><span className="stat-label">Keyword Density</span></div>
                            <div className="stat"><span className="stat-value">{analysis.readingTimeMinutes} min</span><span className="stat-label">Read Time</span></div>
                            <div className="stat"><span className="stat-value">{analysis.readingLevel.level}</span><span className="stat-label">Reading Level</span></div>
                        </div>

                        {/* Detailed Scores */}
                        <div className="detailed-scores">
                            <h3>Detailed Analysis</h3>
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Word Count</span>
                                    <span className="score-value">{analysis.scores.wordCount}/100</span>
                                </div>
                                {getScoreBar(analysis.scores.wordCount)}
                                <p className="score-note">{analysis.wordCount} words (recommended: 1,000-2,500)</p>
                            </div>
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Keyword Optimization</span>
                                    <span className="score-value">{analysis.scores.keywordDensity}/100</span>
                                </div>
                                {getScoreBar(analysis.scores.keywordDensity)}
                                <p className="score-note">{analysis.keywordDensity}% density (recommended: 1-2.5%)</p>
                            </div>
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Readability</span>
                                    <span className="score-value">{analysis.scores.readability}/100</span>
                                </div>
                                {getScoreBar(analysis.scores.readability)}
                                <p className="score-note">Flesch score: {analysis.fleschScore} (higher = easier to read)</p>
                            </div>
                            <div className="score-item">
                                <div className="score-header">
                                    <span>Content Structure</span>
                                    <span className="score-value">{analysis.scores.structure}/100</span>
                                </div>
                                {getScoreBar(analysis.scores.structure)}
                                <p className="score-note">{analysis.headings} headings detected</p>
                            </div>
                        </div>

                        {/* Suggestions */}
                        {analysis.suggestions.length > 0 && (
                            <div className="suggestions">
                                <h3>💡 Improvement Suggestions</h3>
                                <div className="suggestion-list">
                                    {analysis.suggestions.map((s, idx) => (
                                        <div key={idx} className={`suggestion ${s.type}`}>
                                            <span className="suggestion-icon">
                                                {s.type === 'critical' ? '🔴' : s.type === 'warning' ? '🟡' : 'ℹ️'}
                                            </span>
                                            <span>{s.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                .scorecard-container { max-width: 900px; margin: 0 auto; }
                .scorecard-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md, 16px); }
                .form-input, .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .content-area { font-family: inherit; line-height: 1.6; resize: vertical; min-height: 200px; }
                .character-count { text-align: right; font-size: var(--text-sm, 13px); color: var(--text-muted, #666); margin-top: 4px; }
                .analysis-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .main-score { text-align: center; padding: var(--spacing-xl, 40px); border: 4px solid; border-radius: var(--radius, 12px); margin-bottom: var(--spacing-lg, 24px); background: linear-gradient(135deg, #f8f9fa, white); }
                .grade { font-size: 4rem; font-weight: 800; line-height: 1; }
                .score-number { font-size: 1.5rem; font-weight: 600; margin-top: var(--spacing-sm, 8px); }
                .score-label { font-size: var(--text-sm, 14px); color: var(--text-muted, #666); margin-top: 4px; }
                .quick-stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); }
                .stat { text-align: center; padding: var(--spacing-md, 16px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 8px); }
                .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: var(--yinmn-blue, #485696); }
                .stat-label { font-size: var(--text-xs, 12px); color: var(--text-muted, #666); }
                .detailed-scores { margin-bottom: var(--spacing-lg, 24px); }
                .detailed-scores h3, .suggestions h3 { margin-bottom: var(--spacing-md, 16px); }
                .score-item { margin-bottom: var(--spacing-lg, 20px); }
                .score-header { display: flex; justify-content: space-between; margin-bottom: var(--spacing-xs, 6px); font-weight: 500; }
                .score-value { color: var(--yinmn-blue, #485696); }
                .score-bar { height: 8px; background: var(--platinum, #e0e0e0); border-radius: 4px; overflow: hidden; }
                .score-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
                .score-note { font-size: var(--text-sm, 13px); color: var(--text-muted, #666); margin-top: 4px; }
                .suggestions { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 20px); border-radius: var(--radius, 8px); }
                .suggestion-list { display: flex; flex-direction: column; gap: var(--spacing-sm, 10px); }
                .suggestion { display: flex; align-items: flex-start; gap: var(--spacing-sm, 10px); padding: var(--spacing-sm, 12px); background: white; border-radius: var(--radius, 6px); border-left: 3px solid; }
                .suggestion.critical { border-color: #dc3545; }
                .suggestion.warning { border-color: #ffc107; }
                .suggestion.info { border-color: #17a2b8; }
                .suggestion-icon { font-size: 1rem; }
                @media (max-width: 768px) {
                    .form-row { grid-template-columns: 1fr; }
                    .quick-stats { grid-template-columns: repeat(3, 1fr); }
                    .grade { font-size: 3rem; }
                }
                @media (max-width: 480px) {
                    .quick-stats { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>
        </ToolLayout>
    );
};

export default ContentOptimizationScorecard;
