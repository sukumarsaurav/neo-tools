import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const RedirectChainAnalyzer = () => {
    const toast = useToast();
    const [redirects, setRedirects] = useState([
        { from: '', to: '', status: '301' }
    ]);
    const [analysis, setAnalysis] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'redirect-chain-analyzer').slice(0, 3);

    // Add/remove redirects
    const addRedirect = () => setRedirects([...redirects, { from: '', to: '', status: '301' }]);
    const removeRedirect = (index) => {
        if (redirects.length <= 1) { toast.warning('At least one redirect is required'); return; }
        setRedirects(redirects.filter((_, i) => i !== index));
    };
    const updateRedirect = (index, field, value) => {
        const updated = [...redirects];
        updated[index][field] = value;
        setRedirects(updated);
    };

    // Normalize URL for comparison
    const normalizeUrl = (url) => {
        if (!url) return '';
        let normalized = url.trim().toLowerCase();
        if (!normalized.startsWith('http')) {
            normalized = 'https://' + normalized;
        }
        // Remove trailing slash for comparison
        return normalized.replace(/\/$/, '');
    };

    // Analyze redirect chain
    const analyzeChain = () => {
        const validRedirects = redirects.filter(r => r.from.trim() && r.to.trim());

        if (validRedirects.length === 0) {
            toast.warning('Please add at least one redirect with From and To URLs');
            return;
        }

        // Build redirect map
        const redirectMap = new Map();
        validRedirects.forEach(r => {
            redirectMap.set(normalizeUrl(r.from), { to: normalizeUrl(r.to), status: r.status });
        });

        // Find chains
        const chains = [];
        const visited = new Set();

        validRedirects.forEach(r => {
            const startUrl = normalizeUrl(r.from);
            if (visited.has(startUrl)) return;

            const chain = [];
            let current = startUrl;
            const chainVisited = new Set();

            while (redirectMap.has(current) && !chainVisited.has(current)) {
                const redirect = redirectMap.get(current);
                chain.push({ from: current, to: redirect.to, status: redirect.status });
                chainVisited.add(current);
                visited.add(current);
                current = redirect.to;
            }

            if (chain.length > 0) {
                chains.push({
                    chain,
                    length: chain.length,
                    finalDestination: current,
                    hasLoop: chainVisited.has(current)
                });
            }
        });

        // Calculate issues
        const issues = [];
        let totalHops = 0;

        chains.forEach((c, idx) => {
            totalHops += c.length;

            if (c.hasLoop) {
                issues.push({ type: 'critical', text: `Chain ${idx + 1} contains a redirect loop! This causes infinite redirects.` });
            }

            if (c.length > 3) {
                issues.push({ type: 'critical', text: `Chain ${idx + 1} has ${c.length} hops. Reduce to 1 redirect for best SEO.` });
            } else if (c.length > 1) {
                issues.push({ type: 'warning', text: `Chain ${idx + 1} has ${c.length} hops. Consider consolidating to a single redirect.` });
            }

            // Check for mixed status codes
            const statuses = new Set(c.chain.map(r => r.status));
            if (statuses.has('302') && c.length > 1) {
                issues.push({ type: 'warning', text: `Chain ${idx + 1} uses 302 (temporary) redirects in a chain. Consider using 301 for permanent redirects.` });
            }
        });

        // Calculate score
        let score = 100;
        chains.forEach(c => {
            if (c.hasLoop) score -= 50;
            else if (c.length > 3) score -= 30;
            else if (c.length > 1) score -= 10 * (c.length - 1);
        });
        score = Math.max(0, score);

        setAnalysis({
            chains,
            totalRedirects: validRedirects.length,
            totalHops,
            issues,
            score
        });
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#28a745';
        if (score >= 60) return '#ffc107';
        return '#dc3545';
    };

    const faqs = [
        { question: 'What is a redirect chain?', answer: 'A redirect chain occurs when a URL redirects to another URL, which then redirects to yet another. For example: A → B → C. This slows down page load and dilutes link equity.' },
        { question: 'Why are redirect chains bad for SEO?', answer: 'Each redirect adds latency and loses about 10-15% of link equity. Chains with 4+ hops may cause crawlers to stop following, resulting in lost page authority.' },
        { question: '301 vs 302 redirect?', answer: '301 is permanent (passes most link equity), 302 is temporary (passes less equity). Use 301 for permanent URL changes and 302 only for truly temporary situations.' }
    ];

    const seoContent = (<><h2>Redirect Chain Analyzer</h2><p>Analyze your redirect chains to identify issues. Long chains hurt SEO by losing link equity and slowing page loads.</p></>);

    return (
        <ToolLayout title="Redirect Chain Analyzer" description="Analyze redirect chains for SEO issues. Find loops, long chains, and get optimization recommendations." keywords={['redirect chain', 'redirect analyzer', '301 redirect', 'SEO redirects']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                {/* Redirect Inputs */}
                <div className="redirects-section">
                    <h4>🔄 Redirect Rules ({redirects.length})</h4>
                    <p className="section-desc">Enter your redirect rules to analyze the chain. Add the From URL and where it redirects To.</p>

                    {redirects.map((r, index) => (
                        <div key={index} className="redirect-item">
                            <div className="redirect-row">
                                <div className="url-input">
                                    <label>From URL</label>
                                    <input type="text" value={r.from} onChange={(e) => updateRedirect(index, 'from', e.target.value)} placeholder="https://example.com/old-page" />
                                </div>
                                <span className="arrow">→</span>
                                <div className="url-input">
                                    <label>To URL</label>
                                    <input type="text" value={r.to} onChange={(e) => updateRedirect(index, 'to', e.target.value)} placeholder="https://example.com/new-page" />
                                </div>
                                <div className="status-select">
                                    <label>Status</label>
                                    <select value={r.status} onChange={(e) => updateRedirect(index, 'status', e.target.value)}>
                                        <option value="301">301 (Permanent)</option>
                                        <option value="302">302 (Temporary)</option>
                                        <option value="307">307 (Temp Strict)</option>
                                        <option value="308">308 (Perm Strict)</option>
                                    </select>
                                </div>
                                {redirects.length > 1 && (
                                    <button className="remove-btn" onClick={() => removeRedirect(index)}>✕</button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button className="add-btn" onClick={addRedirect}>+ Add Redirect</button>
                </div>

                <button className="btn btn-primary btn-lg" onClick={analyzeChain}>🔍 Analyze Chain</button>

                {/* Analysis Results */}
                {analysis && (
                    <div className="analysis-output">
                        {/* Score */}
                        <div className="score-card" style={{ borderColor: getScoreColor(analysis.score) }}>
                            <div className="score-value" style={{ color: getScoreColor(analysis.score) }}>{analysis.score}</div>
                            <div className="score-label">Redirect Health Score</div>
                        </div>

                        {/* Stats */}
                        <div className="stats-grid">
                            <div className="stat"><span className="stat-value">{analysis.totalRedirects}</span><span className="stat-label">Redirects</span></div>
                            <div className="stat"><span className="stat-value">{analysis.chains.length}</span><span className="stat-label">Chains</span></div>
                            <div className="stat"><span className="stat-value">{analysis.totalHops}</span><span className="stat-label">Total Hops</span></div>
                        </div>

                        {/* Chain Visualization */}
                        {analysis.chains.map((c, idx) => (
                            <div key={idx} className={`chain-view ${c.hasLoop ? 'has-loop' : c.length > 2 ? 'long-chain' : 'good-chain'}`}>
                                <h4>Chain {idx + 1} {c.hasLoop && '⚠️ LOOP'}</h4>
                                <div className="chain-steps">
                                    {c.chain.map((step, i) => (
                                        <div key={i} className="chain-step">
                                            <div className="step-url">{step.from}</div>
                                            <div className="step-arrow">
                                                <span className={`status-badge s${step.status}`}>{step.status}</span>
                                                →
                                            </div>
                                        </div>
                                    ))}
                                    <div className="chain-step final">
                                        <div className="step-url">{c.finalDestination}</div>
                                        <span className="final-badge">Final</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Issues */}
                        {analysis.issues.length > 0 && (
                            <div className="issues-section">
                                <h4>💡 Recommendations</h4>
                                <div className="issues-list">
                                    {analysis.issues.map((issue, i) => (
                                        <div key={i} className={`issue ${issue.type}`}>
                                            <span>{issue.type === 'critical' ? '🔴' : '🟡'}</span>
                                            <span>{issue.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysis.issues.length === 0 && (
                            <div className="success-message">✅ Great! No redirect chain issues found.</div>
                        )}
                    </div>
                )}
            </div>
            <style>{`
                .tool-form{max-width:900px;margin:0 auto}
                .redirects-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .redirects-section h4{margin:0 0 var(--spacing-sm) 0}
                .section-desc{color:var(--text-muted);font-size:var(--text-sm);margin-bottom:var(--spacing-md)}
                .redirect-item{background:white;padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:3px solid var(--yinmn-blue)}
                .redirect-row{display:grid;grid-template-columns:1fr auto 1fr auto auto;gap:var(--spacing-sm);align-items:end}
                .url-input label,.status-select label{display:block;font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px}
                .url-input input,.status-select select{width:100%;padding:8px;border:1px solid var(--platinum);border-radius:var(--radius)}
                .arrow{font-size:1.5rem;color:var(--yinmn-blue);padding:0 var(--spacing-xs)}
                .status-select{width:140px}
                .remove-btn{background:#dc3545;color:white;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer}
                .add-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);cursor:pointer}
                .analysis-output{margin-top:var(--spacing-lg)}
                .score-card{text-align:center;padding:var(--spacing-lg);border:3px solid;border-radius:var(--radius);background:white;margin-bottom:var(--spacing-lg)}
                .score-value{font-size:3rem;font-weight:800}
                .score-label{color:var(--text-muted)}
                .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}
                .stat{text-align:center;padding:var(--spacing-md);background:var(--bg-secondary);border-radius:var(--radius)}
                .stat-value{display:block;font-size:1.5rem;font-weight:700;color:var(--yinmn-blue)}
                .stat-label{font-size:var(--text-sm);color:var(--text-muted)}
                .chain-view{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:4px solid}
                .chain-view.good-chain{border-color:#28a745}
                .chain-view.long-chain{border-color:#ffc107}
                .chain-view.has-loop{border-color:#dc3545;background:#fff5f5}
                .chain-view h4{margin:0 0 var(--spacing-md) 0}
                .chain-steps{display:flex;flex-wrap:wrap;align-items:center;gap:var(--spacing-sm)}
                .chain-step{display:flex;align-items:center;gap:var(--spacing-xs)}
                .step-url{background:white;padding:6px 12px;border-radius:var(--radius);font-family:var(--font-mono);font-size:var(--text-sm);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
                .step-arrow{display:flex;align-items:center;gap:4px;color:var(--text-muted)}
                .status-badge{font-size:10px;padding:2px 6px;border-radius:3px;color:white}
                .status-badge.s301{background:#28a745}
                .status-badge.s302{background:#ffc107;color:#333}
                .status-badge.s307,.status-badge.s308{background:#17a2b8}
                .chain-step.final .step-url{border:2px solid #28a745}
                .final-badge{background:#28a745;color:white;padding:2px 8px;border-radius:3px;font-size:var(--text-xs)}
                .issues-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-top:var(--spacing-lg)}
                .issues-section h4{margin:0 0 var(--spacing-md) 0}
                .issues-list{display:flex;flex-direction:column;gap:var(--spacing-sm)}
                .issue{display:flex;gap:var(--spacing-sm);padding:var(--spacing-sm);background:white;border-radius:var(--radius);border-left:3px solid}
                .issue.critical{border-color:#dc3545}
                .issue.warning{border-color:#ffc107}
                .success-message{background:#28a74515;color:#28a745;padding:var(--spacing-lg);border-radius:var(--radius);text-align:center;font-weight:600}
                @media(max-width:768px){.redirect-row{grid-template-columns:1fr}.arrow{transform:rotate(90deg);justify-self:center}}
            `}</style>
        </ToolLayout>
    );
};

export default RedirectChainAnalyzer;
