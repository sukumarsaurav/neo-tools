import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const BrokenLinkChecker = () => {
    const [urls, setUrls] = useState('');
    const [checking, setChecking] = useState(false);
    const [results, setResults] = useState([]);
    const [progress, setProgress] = useState(0);
    const [history, setHistory] = useState([]);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'broken-link-checker').slice(0, 3);

    // Load history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('brokenLinkHistory');
        if (saved) setHistory(JSON.parse(saved).slice(0, 20));
    }, []);

    // Save history to localStorage
    const saveToHistory = (newResults) => {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            count: newResults.length,
            broken: newResults.filter(r => r.status === 'Error').length
        };
        const updated = [historyEntry, ...history].slice(0, 20);
        setHistory(updated);
        localStorage.setItem('brokenLinkHistory', JSON.stringify(updated));
    };

    const parseUrls = () => {
        return urls
            .split('\n')
            .map(u => u.trim())
            .filter(u => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://')));
    };

    const checkAllLinks = async () => {
        const urlList = parseUrls();
        if (urlList.length === 0) {
            alert('Please enter at least one valid URL (starting with http:// or https://)');
            return;
        }

        setChecking(true);
        setResults([]);
        setProgress(0);

        const newResults = [];

        for (let i = 0; i < urlList.length; i++) {
            const url = urlList[i];
            try {
                const startTime = Date.now();
                await fetch(url, { method: 'HEAD', mode: 'no-cors' });
                const responseTime = Date.now() - startTime;

                newResults.push({
                    url,
                    status: responseTime > 3000 ? 'Slow' : 'Reachable',
                    responseTime,
                    message: responseTime > 3000
                        ? 'URL is slow to respond (>3s)'
                        : 'URL appears accessible'
                });
            } catch (error) {
                newResults.push({
                    url,
                    status: 'Error',
                    responseTime: 0,
                    message: 'Could not reach URL. May be broken or blocked.'
                });
            }

            setProgress(Math.round(((i + 1) / urlList.length) * 100));
            setResults([...newResults]);
        }

        saveToHistory(newResults);
        setChecking(false);
    };

    const retryFailed = async () => {
        const failedUrls = results.filter(r => r.status === 'Error').map(r => r.url);
        if (failedUrls.length === 0) {
            alert('No failed links to retry');
            return;
        }
        setUrls(failedUrls.join('\n'));
        setTimeout(() => checkAllLinks(), 100);
    };

    const exportCSV = () => {
        if (results.length === 0) return;
        const csv = ['URL,Status,Response Time (ms),Message']
            .concat(results.map(r => `"${r.url}","${r.status}",${r.responseTime},"${r.message}"`))
            .join('\n');
        downloadFile(csv, 'link-check-results.csv', 'text/csv');
    };

    const exportJSON = () => {
        if (results.length === 0) return;
        downloadFile(JSON.stringify(results, null, 2), 'link-check-results.json', 'application/json');
    };

    const downloadFile = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyBrokenLinks = () => {
        const broken = results.filter(r => r.status === 'Error').map(r => r.url).join('\n');
        if (!broken) { alert('No broken links found'); return; }
        navigator.clipboard.writeText(broken);
        alert('Broken links copied to clipboard!');
    };

    const clearAll = () => {
        setUrls('');
        setResults([]);
        setProgress(0);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Reachable': return '✅';
            case 'Slow': return '⚠️';
            case 'Error': return '❌';
            default: return '❓';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Reachable': return 'var(--success, #28a745)';
            case 'Slow': return 'var(--warning, #ffc107)';
            case 'Error': return 'var(--error, #dc3545)';
            default: return 'var(--text-muted)';
        }
    };

    const stats = {
        total: results.length,
        reachable: results.filter(r => r.status === 'Reachable').length,
        slow: results.filter(r => r.status === 'Slow').length,
        broken: results.filter(r => r.status === 'Error').length
    };

    const faqs = [
        { question: 'Why check for broken links?', answer: 'Broken links hurt user experience and SEO. They signal to search engines that your site may be poorly maintained, potentially lowering rankings.' },
        { question: 'What causes broken links?', answer: 'Page deletions, URL changes, domain expiration, typos in links, or external sites going offline can all cause broken links.' },
        { question: 'How many URLs can I check at once?', answer: 'You can paste multiple URLs (one per line) and check them all in batch. Due to browser limitations, very large batches may take time.' }
    ];

    const seoContent = (<><h2>Broken Link Checker</h2><p>Check if URLs are accessible. Broken links hurt SEO and user experience. Regularly audit your site for broken links.</p><p><strong>Note:</strong> Due to browser security (CORS), this tool provides basic reachability checks. For comprehensive site audits, use server-side tools like Screaming Frog or Ahrefs.</p></>);

    return (
        <ToolLayout title="Broken Link Checker" description="Check if URLs are working or broken. Find and fix broken links on your website." keywords={['broken link checker', 'dead link finder', 'URL checker', 'link validator', 'batch link checker']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="blc-container">
                {/* Input Section */}
                <div className="blc-input-section">
                    <label className="form-label">Enter URLs to Check (one per line)</label>
                    <textarea
                        className="blc-textarea"
                        value={urls}
                        onChange={(e) => setUrls(e.target.value)}
                        placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                        rows={6}
                        disabled={checking}
                    />
                    <div className="blc-url-count">
                        {parseUrls().length} valid URL{parseUrls().length !== 1 ? 's' : ''} detected
                    </div>
                    <div className="blc-actions">
                        <button className="btn btn-primary btn-lg" onClick={checkAllLinks} disabled={checking}>
                            {checking ? `Checking... ${progress}%` : '🔍 Check All Links'}
                        </button>
                        <button className="btn btn-secondary" onClick={clearAll} disabled={checking}>
                            🗑️ Clear
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                {checking && (
                    <div className="blc-progress-container">
                        <div className="blc-progress-bar">
                            <div className="blc-progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="blc-progress-text">
                            Checking {results.length}/{parseUrls().length} URLs ({progress}%)
                        </div>
                    </div>
                )}

                {/* Stats Summary */}
                {results.length > 0 && (
                    <div className="blc-stats">
                        <div className="stat-card total">
                            <span className="stat-number">{stats.total}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-card success">
                            <span className="stat-number">{stats.reachable}</span>
                            <span className="stat-label">✅ OK</span>
                        </div>
                        <div className="stat-card warning">
                            <span className="stat-number">{stats.slow}</span>
                            <span className="stat-label">⚠️ Slow</span>
                        </div>
                        <div className="stat-card error">
                            <span className="stat-number">{stats.broken}</span>
                            <span className="stat-label">❌ Broken</span>
                        </div>
                    </div>
                )}

                {/* Results List */}
                {results.length > 0 && (
                    <div className="blc-results">
                        <div className="blc-results-header">
                            <h3>Results</h3>
                            <div className="blc-export-actions">
                                <button className="btn-export" onClick={exportCSV}>📄 CSV</button>
                                <button className="btn-export" onClick={exportJSON}>{ } JSON</button>
                                {stats.broken > 0 && (
                                    <>
                                        <button className="btn-export" onClick={copyBrokenLinks}>📋 Copy Broken</button>
                                        <button className="btn-export retry" onClick={retryFailed} disabled={checking}>🔄 Retry Failed</button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="blc-results-list">
                            {results.map((result, idx) => (
                                <div key={idx} className={`blc-result-card ${result.status.toLowerCase()}`}>
                                    <div className="result-icon">{getStatusIcon(result.status)}</div>
                                    <div className="result-content">
                                        <div className="result-url">{result.url}</div>
                                        <div className="result-message">{result.message}</div>
                                    </div>
                                    <div className="result-time" style={{ color: getStatusColor(result.status) }}>
                                        {result.responseTime > 0 ? `${result.responseTime}ms` : '—'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* History Panel */}
                {history.length > 0 && (
                    <div className="blc-history">
                        <h4>📜 Recent Checks</h4>
                        <div className="history-list">
                            {history.slice(0, 5).map((h, idx) => (
                                <div key={idx} className="history-item">
                                    <span className="history-time">{new Date(h.timestamp).toLocaleString()}</span>
                                    <span className="history-stats">
                                        {h.count} URLs • {h.broken} broken
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .blc-container { max-width: 800px; margin: 0 auto; }
                .blc-input-section { margin-bottom: var(--spacing-lg, 24px); }
                .blc-textarea {
                    width: 100%;
                    padding: var(--spacing-md, 16px);
                    border: 2px solid var(--platinum, #e0e0e0);
                    border-radius: var(--radius, 8px);
                    font-family: var(--font-mono, monospace);
                    font-size: var(--text-sm, 14px);
                    resize: vertical;
                    transition: border-color 0.2s;
                }
                .blc-textarea:focus {
                    outline: none;
                    border-color: var(--yinmn-blue, #485696);
                }
                .blc-url-count {
                    font-size: var(--text-sm, 14px);
                    color: var(--text-muted, #666);
                    margin-top: var(--spacing-xs, 8px);
                }
                .blc-actions {
                    display: flex;
                    gap: var(--spacing-md, 16px);
                    margin-top: var(--spacing-md, 16px);
                }
                .blc-progress-container {
                    margin: var(--spacing-lg, 24px) 0;
                }
                .blc-progress-bar {
                    width: 100%;
                    height: 12px;
                    background: var(--bg-secondary, #f5f5f5);
                    border-radius: 6px;
                    overflow: hidden;
                }
                .blc-progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--yinmn-blue, #485696), var(--success, #28a745));
                    border-radius: 6px;
                    transition: width 0.3s ease;
                }
                .blc-progress-text {
                    text-align: center;
                    margin-top: var(--spacing-sm, 8px);
                    font-size: var(--text-sm, 14px);
                    color: var(--text-muted, #666);
                }
                .blc-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-md, 16px);
                    margin-bottom: var(--spacing-lg, 24px);
                }
                .stat-card {
                    padding: var(--spacing-md, 16px);
                    border-radius: var(--radius, 8px);
                    text-align: center;
                    background: var(--bg-secondary, #f5f5f5);
                }
                .stat-card.total { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
                .stat-card.success { background: linear-gradient(135deg, #11998e, #28a745); color: white; }
                .stat-card.warning { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; }
                .stat-card.error { background: linear-gradient(135deg, #eb3349, #f45c43); color: white; }
                .stat-number { display: block; font-size: 2rem; font-weight: 700; }
                .stat-label { font-size: var(--text-sm, 14px); }
                .blc-results-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: var(--spacing-sm, 8px);
                    margin-bottom: var(--spacing-md, 16px);
                }
                .blc-results-header h3 { margin: 0; }
                .blc-export-actions {
                    display: flex;
                    gap: var(--spacing-sm, 8px);
                    flex-wrap: wrap;
                }
                .btn-export {
                    padding: var(--spacing-xs, 6px) var(--spacing-sm, 12px);
                    background: var(--bg-secondary, #f5f5f5);
                    border: 1px solid var(--platinum, #e0e0e0);
                    border-radius: var(--radius, 6px);
                    cursor: pointer;
                    font-size: var(--text-sm, 13px);
                    transition: all 0.2s;
                }
                .btn-export:hover { background: var(--platinum, #e0e0e0); }
                .btn-export.retry { background: var(--warning, #ffc107); border-color: transparent; }
                .blc-results-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-sm, 8px);
                }
                .blc-result-card {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md, 16px);
                    padding: var(--spacing-md, 16px);
                    background: white;
                    border-radius: var(--radius, 8px);
                    border-left: 4px solid transparent;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .blc-result-card.reachable { border-left-color: var(--success, #28a745); }
                .blc-result-card.slow { border-left-color: var(--warning, #ffc107); }
                .blc-result-card.error { border-left-color: var(--error, #dc3545); }
                .result-icon { font-size: 1.5rem; }
                .result-content { flex: 1; min-width: 0; }
                .result-url {
                    font-family: var(--font-mono, monospace);
                    font-size: var(--text-sm, 14px);
                    word-break: break-all;
                    color: var(--text-primary, #333);
                }
                .result-message {
                    font-size: var(--text-xs, 12px);
                    color: var(--text-muted, #666);
                    margin-top: 4px;
                }
                .result-time {
                    font-weight: 600;
                    font-size: var(--text-sm, 14px);
                    white-space: nowrap;
                }
                .blc-history {
                    margin-top: var(--spacing-xl, 32px);
                    padding: var(--spacing-md, 16px);
                    background: var(--bg-secondary, #f9f9f9);
                    border-radius: var(--radius, 8px);
                }
                .blc-history h4 { margin: 0 0 var(--spacing-md, 16px) 0; }
                .history-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-xs, 8px);
                }
                .history-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: var(--text-sm, 14px);
                    padding: var(--spacing-xs, 8px);
                    background: white;
                    border-radius: var(--radius-sm, 4px);
                }
                .history-time { color: var(--text-muted, #666); }
                .history-stats { font-weight: 500; }
                @media (max-width: 600px) {
                    .blc-stats { grid-template-columns: repeat(2, 1fr); }
                    .blc-actions { flex-direction: column; }
                    .blc-result-card { flex-wrap: wrap; }
                    .result-time { width: 100%; text-align: right; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default BrokenLinkChecker;
