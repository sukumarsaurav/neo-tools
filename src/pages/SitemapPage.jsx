import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import toolsData from '../data/tools.json';

const SitemapPage = () => {
    const { categories, tools } = toolsData;

    const toolsByCategory = categories.map(category => ({
        ...category,
        tools: tools.filter(tool => tool.category === category.id)
    }));

    return (
        <>
            <Helmet>
                <title>Sitemap | NeoWebTools</title>
                <meta name="description" content="Browse all 100+ free tools on NeoWebTools. Find calculators, converters, generators, and utilities organized by category." />
                <link rel="canonical" href="https://neofreetools.online/sitemap" />
            </Helmet>
            <Header />
            <main className="page-container">
                <div className="container">
                    <div className="sitemap-content">
                        <h1>Sitemap</h1>
                        <p className="sitemap-intro">
                            Browse all our free online tools organized by category.
                        </p>

                        <section className="main-pages">
                            <h2>📄 Main Pages</h2>
                            <ul className="page-list">
                                <li><Link to="/">🏠 Home</Link></li>
                                <li><Link to="/about">ℹ️ About Us</Link></li>
                                <li><Link to="/contact">📧 Contact Us</Link></li>
                                <li><Link to="/privacy">🔒 Privacy Policy</Link></li>
                                <li><Link to="/terms">📜 Terms of Service</Link></li>
                            </ul>
                        </section>

                        {toolsByCategory.map(category => (
                            <section key={category.id} className="category-section">
                                <h2>
                                    {category.icon} {category.name}
                                    <span className="tool-count">({category.tools.length} tools)</span>
                                </h2>
                                <ul className="tools-list">
                                    {category.tools.map(tool => (
                                        <li key={tool.id}>
                                            <Link to={tool.path}>
                                                <span className="tool-icon">{tool.icon}</span>
                                                <span className="tool-name">{tool.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}

                        <section className="xml-sitemap">
                            <h2>🤖 For Search Engines</h2>
                            <p>
                                Looking for the XML sitemap? It's available at{' '}
                                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                                    /sitemap.xml
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
            <style>{sitemapStyles}</style>
        </>
    );
};

const sitemapStyles = `
    .page-container {
        min-height: 70vh;
        padding: var(--spacing-xl) 0;
    }
    .sitemap-content {
        max-width: 1000px;
        margin: 0 auto;
    }
    .sitemap-content h1 {
        font-size: var(--text-3xl, 2rem);
        text-align: center;
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary, #1a1a2e);
    }
    .sitemap-intro {
        text-align: center;
        color: var(--text-muted, #666);
        margin-bottom: var(--spacing-2xl);
    }
    .main-pages,
    .category-section,
    .xml-sitemap {
        background: var(--bg-primary, #fff);
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg, 12px);
        box-shadow: var(--shadow-sm);
        margin-bottom: var(--spacing-lg);
    }
    .sitemap-content h2 {
        font-size: var(--text-xl, 1.25rem);
        margin-bottom: var(--spacing-lg);
        color: var(--text-primary, #1a1a2e);
        border-bottom: 2px solid var(--platinum, #e0e0e0);
        padding-bottom: var(--spacing-sm);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }
    .tool-count {
        font-size: var(--text-sm);
        font-weight: normal;
        color: var(--text-muted);
    }
    .page-list {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--spacing-sm);
    }
    .page-list li a {
        color: var(--text-secondary);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        border-radius: var(--radius);
        transition: background 0.2s;
    }
    .page-list li a:hover {
        background: var(--bg-secondary, #f5f5f5);
        color: var(--pumpkin, #fc7a1e);
    }
    .tools-list {
        list-style: none;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--spacing-sm);
    }
    .tools-list li a {
        color: var(--text-secondary);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        border-radius: var(--radius);
        transition: background 0.2s;
    }
    .tools-list li a:hover {
        background: var(--bg-secondary, #f5f5f5);
        color: var(--pumpkin, #fc7a1e);
    }
    .tool-icon {
        font-size: 1.2rem;
    }
    .xml-sitemap p {
        color: var(--text-secondary);
    }
    .xml-sitemap a {
        color: var(--pumpkin, #fc7a1e);
        font-family: monospace;
    }
    @media (max-width: 480px) {
        .tools-list {
            grid-template-columns: 1fr;
        }
    }
`;

export default SitemapPage;
