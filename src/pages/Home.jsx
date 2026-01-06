import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AdBox from '../components/layout/AdBox';
import toolsData from '../data/tools.json';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredTools = useMemo(() => {
    let tools = toolsData.tools;

    if (activeCategory !== 'all') {
      tools = tools.filter(t => t.category === activeCategory);
    }

    if (searchQuery) {
      tools = tools.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return tools;
  }, [searchQuery, activeCategory]);

  const popularTools = toolsData.tools.filter(t => t.popular);

  return (
    <>
      <Helmet>
        <title>NeoWebTools - Free Online Tools for Finance, SEO, Developers & More</title>
        <meta name="description" content="Free online tools including GST calculator, EMI calculator, QR code generator, JSON formatter, and 60+ more utilities. No registration required." />
        <meta name="keywords" content="free online tools, GST calculator, EMI calculator, SEO tools, developer tools, QR generator" />
        <link rel="canonical" href="https://neowebtools.com" />

        <meta property="og:title" content="NeoWebTools - Free Online Tools" />
        <meta property="og:description" content="60+ free online tools for finance, SEO, development, and more." />
        <meta property="og:type" content="website" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "NeoWebTools",
            "url": "https://neowebtools.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://neowebtools.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <Header />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h1>Free Online Tools</h1>
            <p>60+ powerful tools for finance, SEO, development, and more. No registration required.</p>

            <div className="hero-search">
              <input
                type="text"
                placeholder="Search for tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">60+</span>
                <span className="stat-label">Tools</span>
              </div>
              <div className="stat">
                <span className="stat-value">6</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat">
                <span className="stat-value">100%</span>
                <span className="stat-label">Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Top Ad */}
        <AdBox type="top-banner" />

        {/* Categories */}
        <section className="section categories-section">
          <div className="container">
            <h2 className="section-title">Browse by Category</h2>
            <div className="categories-grid">
              {toolsData.categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="category-card"
                  style={{ '--accent-color': cat.color }}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                  <span className="category-count">
                    {toolsData.tools.filter(t => t.category === cat.id).length} tools
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Tools */}
        <section className="section popular-section">
          <div className="container">
            <h2 className="section-title">Popular Tools</h2>
            <p className="section-subtitle">Most used tools by our community</p>

            <div className="tool-grid">
              {popularTools.map(tool => (
                <Link key={tool.id} to={tool.path} className="tool-card">
                  <span className="tool-card-icon">{tool.icon}</span>
                  <div className="tool-card-title">{tool.name}</div>
                  <div className="tool-card-description">{tool.description}</div>
                  <span className="tool-card-badge">Popular</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Middle Ad */}
        <AdBox type="in-content" />

        {/* All Tools Section */}
        <section className="section all-tools-section">
          <div className="container">
            <h2 className="section-title">All Tools</h2>

            {/* Category Pills */}
            <div className="category-pills">
              <button
                className={`category-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All
              </button>
              {toolsData.categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <div className="tool-grid">
              {filteredTools.map(tool => (
                <Link key={tool.id} to={tool.path} className="tool-card">
                  <span className="tool-card-icon">{tool.icon}</span>
                  <div className="tool-card-title">{tool.name}</div>
                  <div className="tool-card-description">{tool.description}</div>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="no-results">
                <p>No tools found matching your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="section features-section">
          <div className="container">
            <h2 className="section-title">Why Choose NeoWebTools?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">⚡</span>
                <h3>Lightning Fast</h3>
                <p>All tools run instantly in your browser with no server delays.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🔒</span>
                <h3>Privacy First</h3>
                <p>Your data never leaves your browser. We don't store anything.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">💯</span>
                <h3>100% Free</h3>
                <p>All tools are completely free with no hidden charges.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📱</span>
                <h3>Mobile Friendly</h3>
                <p>Works perfectly on all devices - desktop, tablet, and mobile.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Ad */}
        <AdBox type="in-article" />
      </main>

      <Footer />

      <style>{`
        .hero {
          background: var(--gradient-primary);
          color: var(--white);
          padding: var(--spacing-3xl) 0;
          text-align: center;
        }

        .hero h1 {
          color: var(--white);
          font-size: var(--text-5xl);
          margin-bottom: var(--spacing-md);
          animation: fadeIn 0.5s ease forwards;
        }

        .hero p {
          color: rgba(255, 255, 255, 0.9);
          font-size: var(--text-xl);
          margin-bottom: var(--spacing-xl);
        }

        .hero-search {
          max-width: 500px;
          margin: 0 auto var(--spacing-xl);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: var(--spacing-3xl);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: var(--text-4xl);
          font-weight: 700;
        }

        .stat-label {
          font-size: var(--text-sm);
          opacity: 0.8;
        }

        .categories-section {
          background: var(--bg-secondary);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .category-card {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          text-decoration: none;
          transition: all var(--transition);
          border-left: 4px solid var(--accent-color);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .category-icon {
          font-size: var(--text-4xl);
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .category-name {
          font-size: var(--text-xl);
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: var(--spacing-sm);
        }

        .category-desc {
          font-size: var(--text-sm);
          color: var(--text-light);
          margin-bottom: var(--spacing-md);
        }

        .category-count {
          font-size: var(--text-sm);
          color: #555555; /* Darker color for WCAG AA compliance instead of accent-color */
          font-weight: 600;
        }

        .popular-section {
          background: var(--bg-primary);
        }

        .tool-card {
          position: relative;
        }

        .tool-card-badge {
          position: absolute;
          top: var(--spacing-sm);
          right: var(--spacing-sm);
          background: var(--gradient-accent);
          color: var(--white);
          font-size: var(--text-xs);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .all-tools-section {
          background: var(--bg-secondary);
        }

        .no-results {
          text-align: center;
          padding: var(--spacing-3xl);
          color: var(--text-muted);
        }

        .features-section {
          background: var(--bg-primary);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }

        .feature-card {
          text-align: center;
          padding: var(--spacing-xl);
        }

        .feature-icon {
          font-size: var(--text-4xl);
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .feature-card h3 {
          font-size: var(--text-lg);
          margin-bottom: var(--spacing-sm);
        }

        .feature-card p {
          font-size: var(--text-sm);
          color: var(--text-light);
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: var(--text-3xl);
          }

          .hero p {
            font-size: var(--text-base);
          }

          .hero-stats {
            gap: var(--spacing-xl);
          }

          .stat-value {
            font-size: var(--text-2xl);
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default Home;
