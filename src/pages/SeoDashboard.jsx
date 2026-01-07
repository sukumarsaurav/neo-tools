import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { getAllDrafts, clearAllDrafts } from '../hooks/useDraft';
import toolsData from '../data/tools.json';
import { useToast } from '../components/common/Toast';

const SeoDashboard = () => {
    const toast = useToast();
    const [drafts, setDrafts] = useState([]);
    const [recentTools, setRecentTools] = useState([]);

    // Get all SEO tools
    const seoTools = toolsData.tools.filter(t => t.category === 'seo');

    // Tool categories for quick access
    const toolGroups = {
        'Meta & Tags': ['meta-tag-generator', 'og-generator', 'twitter-card-generator', 'schema-generator', 'all-in-one-meta-generator'],
        'Content Analysis': ['keyword-density', 'readability-checker', 'content-optimization-scorecard', 'heading-analyzer'],
        'Technical SEO': ['robots-txt-generator', 'sitemap-generator', 'htaccess-generator', 'canonical-url-generator', 'hreflang-generator'],
        'Link & Redirect': ['broken-link-checker', 'redirect-chain-analyzer', 'slug-generator'],
        'Preview & Testing': ['serp-preview', 'mobile-serp-preview', 'image-alt-text-suggester'],
        'Planning & Audit': ['seo-audit-checklist', 'technical-seo-checklist', 'content-calendar', 'local-seo-planner', 'page-speed-checklist']
    };

    useEffect(() => {
        // Load drafts
        setDrafts(getAllDrafts());

        // Load recent tools from localStorage
        try {
            const recent = JSON.parse(localStorage.getItem('neoft_recent_seo_tools') || '[]');
            setRecentTools(recent.slice(0, 6));
        } catch {
            setRecentTools([]);
        }
    }, []);

    // Track tool usage
    const trackToolUsage = (toolId) => {
        try {
            let recent = JSON.parse(localStorage.getItem('neoft_recent_seo_tools') || '[]');
            recent = [toolId, ...recent.filter(id => id !== toolId)].slice(0, 10);
            localStorage.setItem('neoft_recent_seo_tools', JSON.stringify(recent));
        } catch { }
    };

    const handleClearAllDrafts = () => {
        clearAllDrafts();
        setDrafts([]);
        toast.success('All drafts cleared');
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getToolInfo = (key) => {
        return seoTools.find(t => t.id === key) || { name: key, path: '#', icon: '🔧' };
    };

    return (
        <>
            <Helmet>
                <title>SEO Dashboard - All SEO Tools | NeoFreeTools</title>
                <meta name="description" content="Access all 29 SEO tools from one dashboard. View saved drafts, quick access to popular tools, and organized tool categories." />
            </Helmet>
            <Header />
            <main className="dashboard-page">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <h1>🎯 SEO Dashboard</h1>
                        <p>Quick access to all {seoTools.length} SEO tools</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="quick-stats">
                        <div className="stat-card">
                            <span className="stat-icon">🔧</span>
                            <div>
                                <span className="stat-num">{seoTools.length}</span>
                                <span className="stat-label">SEO Tools</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">📝</span>
                            <div>
                                <span className="stat-num">{drafts.length}</span>
                                <span className="stat-label">Saved Drafts</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <span className="stat-icon">⏱️</span>
                            <div>
                                <span className="stat-num">{recentTools.length}</span>
                                <span className="stat-label">Recent Tools</span>
                            </div>
                        </div>
                    </div>

                    {/* Saved Drafts */}
                    {drafts.length > 0 && (
                        <section className="drafts-section">
                            <div className="section-header">
                                <h2>📄 Saved Drafts</h2>
                                <button className="btn-clear" onClick={handleClearAllDrafts}>Clear All</button>
                            </div>
                            <div className="drafts-grid">
                                {drafts.slice(0, 6).map((draft, idx) => {
                                    const tool = getToolInfo(draft.key);
                                    return (
                                        <Link key={idx} to={tool.path} className="draft-card" onClick={() => trackToolUsage(draft.key)}>
                                            <span className="draft-icon">{tool.icon}</span>
                                            <div className="draft-info">
                                                <span className="draft-name">{tool.name}</span>
                                                <span className="draft-time">Saved {formatDate(draft.savedAt)}</span>
                                            </div>
                                            <span className="draft-arrow">→</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Recent Tools */}
                    {recentTools.length > 0 && (
                        <section className="recent-section">
                            <h2>⏱️ Recently Used</h2>
                            <div className="tools-row">
                                {recentTools.map((toolId, idx) => {
                                    const tool = getToolInfo(toolId);
                                    return (
                                        <Link key={idx} to={tool.path} className="tool-chip" onClick={() => trackToolUsage(toolId)}>
                                            <span>{tool.icon}</span>
                                            <span>{tool.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Tool Categories */}
                    <section className="categories-section">
                        <h2>🗂️ Tools by Category</h2>
                        <div className="categories-grid">
                            {Object.entries(toolGroups).map(([groupName, toolIds]) => (
                                <div key={groupName} className="category-card">
                                    <h3>{groupName}</h3>
                                    <div className="category-tools">
                                        {toolIds.map(id => {
                                            const tool = seoTools.find(t => t.id === id);
                                            if (!tool) return null;
                                            return (
                                                <Link key={id} to={tool.path} className="tool-link" onClick={() => trackToolUsage(id)}>
                                                    <span>{tool.icon}</span>
                                                    <span>{tool.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* All Tools Grid */}
                    <section className="all-tools-section">
                        <h2>🔧 All SEO Tools</h2>
                        <div className="all-tools-grid">
                            {seoTools.map(tool => (
                                <Link key={tool.id} to={tool.path} className="tool-card" onClick={() => trackToolUsage(tool.id)}>
                                    <span className="tool-icon">{tool.icon}</span>
                                    <div className="tool-info">
                                        <span className="tool-name">{tool.name}</span>
                                        <span className="tool-desc">{tool.description}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
            <style>{`
                .dashboard-page{padding:var(--spacing-xl) 0;min-height:70vh}
                .dashboard-container{max-width:1200px;margin:0 auto;padding:0 var(--spacing-lg)}
                .dashboard-header{text-align:center;margin-bottom:var(--spacing-xl)}
                .dashboard-header h1{font-size:2.5rem;margin-bottom:var(--spacing-sm)}
                .dashboard-header p{color:var(--text-muted);font-size:var(--text-lg)}
                .quick-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-lg);margin-bottom:var(--spacing-xl)}
                .stat-card{display:flex;align-items:center;gap:var(--spacing-md);background:white;padding:var(--spacing-lg);border-radius:var(--radius);box-shadow:0 2px 8px rgba(0,0,0,0.05)}
                .stat-icon{font-size:2.5rem}
                .stat-num{display:block;font-size:2rem;font-weight:700;color:var(--yinmn-blue)}
                .stat-label{color:var(--text-muted);font-size:var(--text-sm)}
                .drafts-section,.recent-section,.categories-section,.all-tools-section{margin-bottom:var(--spacing-xl)}
                .section-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-md)}
                .section-header h2,.recent-section h2,.categories-section h2,.all-tools-section h2{margin:0 0 var(--spacing-md) 0;font-size:1.5rem}
                .btn-clear{background:transparent;color:#dc3545;border:1px solid #dc3545;padding:6px 12px;border-radius:var(--radius);cursor:pointer;font-size:var(--text-sm)}
                .btn-clear:hover{background:#dc3545;color:white}
                .drafts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md)}
                .draft-card{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-md);background:white;border-radius:var(--radius);border:1px solid var(--platinum);text-decoration:none;color:inherit;transition:all 0.2s}
                .draft-card:hover{border-color:var(--yinmn-blue);box-shadow:0 4px 12px rgba(0,0,0,0.1)}
                .draft-icon{font-size:1.5rem}
                .draft-info{flex:1}
                .draft-name{display:block;font-weight:600}
                .draft-time{font-size:var(--text-xs);color:var(--text-muted)}
                .draft-arrow{color:var(--yinmn-blue);font-weight:bold}
                .tools-row{display:flex;flex-wrap:wrap;gap:var(--spacing-sm)}
                .tool-chip{display:inline-flex;align-items:center;gap:var(--spacing-xs);padding:8px 16px;background:var(--bg-secondary);border-radius:20px;text-decoration:none;color:inherit;font-size:var(--text-sm);transition:all 0.2s}
                .tool-chip:hover{background:var(--yinmn-blue);color:white}
                .categories-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-lg)}
                .category-card{background:white;padding:var(--spacing-lg);border-radius:var(--radius);border:1px solid var(--platinum)}
                .category-card h3{margin:0 0 var(--spacing-md) 0;font-size:1.1rem;color:var(--yinmn-blue)}
                .category-tools{display:flex;flex-direction:column;gap:var(--spacing-xs)}
                .tool-link{display:flex;align-items:center;gap:var(--spacing-sm);padding:6px 0;text-decoration:none;color:inherit;font-size:var(--text-sm);transition:color 0.2s}
                .tool-link:hover{color:var(--yinmn-blue)}
                .all-tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md)}
                .tool-card{display:flex;gap:var(--spacing-md);padding:var(--spacing-md);background:white;border-radius:var(--radius);border:1px solid var(--platinum);text-decoration:none;color:inherit;transition:all 0.2s}
                .tool-card:hover{border-color:var(--yinmn-blue);transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}
                .tool-icon{font-size:1.5rem}
                .tool-info{flex:1}
                .tool-name{display:block;font-weight:600;margin-bottom:4px}
                .tool-desc{font-size:var(--text-xs);color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                @media(max-width:900px){.quick-stats,.drafts-grid,.categories-grid,.all-tools-grid{grid-template-columns:repeat(2,1fr)}}
                @media(max-width:600px){.quick-stats,.drafts-grid,.categories-grid,.all-tools-grid{grid-template-columns:1fr}}
            `}</style>
        </>
    );
};

export default SeoDashboard;
