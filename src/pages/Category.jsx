import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AdBox from '../components/layout/AdBox';
import toolsData from '../data/tools.json';

const Category = () => {
  const { categoryId } = useParams();

  const category = toolsData.categories.find(c => c.id === categoryId);
  const tools = toolsData.tools.filter(t => t.category === categoryId);

  if (!category) {
    return (
      <>
        <Header />
        <main className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h1>Category Not Found</h1>
          <p>The category you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Go Home
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} Tools - Free Online {category.name} Utilities | NeoWebTools</title>
        <meta name="description" content={`Free online ${category.name.toLowerCase()} tools: ${tools.slice(0, 5).map(t => t.name).join(', ')} and more. No registration required.`} />
        <meta name="keywords" content={`${category.name.toLowerCase()} tools, free online tools, ${tools.slice(0, 5).map(t => t.name.toLowerCase()).join(', ')}`} />
        <link rel="canonical" href={`https://www.neofreetools.online/category/${categoryId}`} />

        <meta property="og:title" content={`${category.name} Tools - NeoWebTools`} />
        <meta property="og:description" content={category.description} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      <main>
        {/* Category Hero */}
        <section className="category-hero" style={{ '--category-color': category.color }}>
          <div className="container">
            <nav className="breadcrumb-light">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Categories</span>
              <span>/</span>
              <span className="current">{category.name}</span>
            </nav>

            <div className="category-header">
              <span className="category-icon">{category.icon}</span>
              <div>
                <h1>{category.name} Tools</h1>
                <p>{category.description}</p>
                <span className="tool-count">{tools.length} tools available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Top Ad */}
        <AdBox type="top-banner" />

        {/* Tools Grid */}
        <section className="section">
          <div className="container">
            <div className="tool-grid">
              {tools.map(tool => (
                <Link key={tool.id} to={tool.path} className="tool-card">
                  <span className="tool-card-icon">{tool.icon}</span>
                  <div className="tool-card-title">{tool.name}</div>
                  <div className="tool-card-description">{tool.description}</div>
                  {tool.popular && (
                    <span className="tool-card-badge">Popular</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Middle Ad */}
        <AdBox type="in-content" />

        {/* Other Categories */}
        <section className="section other-categories">
          <div className="container">
            <h2 className="section-title">Explore Other Categories</h2>
            <div className="categories-row">
              {toolsData.categories
                .filter(c => c.id !== categoryId)
                .map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    className="category-pill-link"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))
              }
            </div>
          </div>
        </section>

        {/* Bottom Ad */}
        <AdBox type="in-article" />
      </main>

      <Footer />

      <style>{`
        .category-hero {
          background: linear-gradient(135deg, var(--category-color) 0%, color-mix(in srgb, var(--category-color) 70%, #000) 100%);
          color: var(--white);
          padding: var(--spacing-xl) 0 var(--spacing-3xl);
        }

        .breadcrumb-light {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: var(--text-sm);
          margin-bottom: var(--spacing-xl);
          opacity: 0.8;
        }

        .breadcrumb-light a {
          color: var(--white);
          text-decoration: none;
        }

        .breadcrumb-light a:hover {
          text-decoration: underline;
        }

        .breadcrumb-light .current {
          opacity: 1;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-xl);
        }

        .category-header .category-icon {
          font-size: 5rem;
        }

        .category-header h1 {
          color: var(--white);
          font-size: var(--text-4xl);
          margin-bottom: var(--spacing-sm);
        }

        .category-header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: var(--text-lg);
          margin-bottom: var(--spacing-sm);
        }

        .tool-count {
          font-size: var(--text-sm);
          opacity: 0.8;
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

        .other-categories {
          background: var(--bg-secondary);
        }

        .categories-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          justify-content: center;
        }

        .category-pill-link {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: var(--bg-primary);
          border-radius: var(--radius-full);
          text-decoration: none;
          color: var(--text-dark);
          font-weight: 500;
          transition: all var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .category-pill-link:hover {
          background: var(--yinmn-blue);
          color: var(--white);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .category-header {
            flex-direction: column;
            text-align: center;
          }

          .category-header .category-icon {
            font-size: 4rem;
          }

          .category-header h1 {
            font-size: var(--text-2xl);
          }
        }
      `}</style>
    </>
  );
};

export default Category;
