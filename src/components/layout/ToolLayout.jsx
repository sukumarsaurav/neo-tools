import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import AdBox from './AdBox';

/**
 * ToolLayout - Standard template for all tool pages
 * 
 * Structure follows AdSense-safe wireframe:
 * 1. Header
 * 2. Top Banner Ad
 * 3. Tool Title & Description
 * 4. Tool Input Section (children)
 * 5. In-Content Ad (after interaction)
 * 6. Result Section
 * 7. SEO Content
 * 8. In-Article Ad
 * 9. FAQ Section
 * 10. Related Tools
 * 11. Footer
 */
const ToolLayout = ({
  title,
  description,
  keywords = [],
  category,
  categoryName,
  children,
  seoContent,
  faqs = [],
  relatedTools = []
}) => {
  const [openFaq, setOpenFaq] = useState(null);
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Generate JSON-LD schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "description": description,
    "url": canonicalUrl,
    "applicationCategory": "Utility",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": "NeoWebTools"
    }
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      <Helmet>
        <title>{title} - Free Online Tool | NeoWebTools</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${title} - NeoWebTools`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} - NeoWebTools`} />
        <meta name="twitter:description" content={description} />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      <Header />

      <main className="tool-page">
        {/* Top Banner Ad */}
        <AdBox type="top-banner" />

        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={`/category/${category}`}>{categoryName}</Link>
            <span>/</span>
            <span className="current">{title}</span>
          </nav>

          {/* Tool Header */}
          <div className="tool-header">
            <h1>{title}</h1>
            <p className="tool-description">{description}</p>
          </div>

          {/* Tool Content (Input + Results) */}
          <div className="tool-container">
            {children}
          </div>

          {/* In-Content Ad */}
          <AdBox type="in-content" />

          {/* SEO Content */}
          {seoContent && (
            <div className="seo-content">
              {seoContent}
            </div>
          )}

          {/* In-Article Ad */}
          <AdBox type="in-article" />

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <section className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      {faq.question}
                      <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                    </button>
                    {openFaq === index && (
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="related-tools">
              <h2>Related Tools</h2>
              <div className="related-tools-grid">
                {relatedTools.map(tool => (
                  <Link key={tool.id} to={tool.path} className="tool-card">
                    <span className="tool-card-icon">{tool.icon}</span>
                    <div className="tool-card-title">{tool.name}</div>
                    <div className="tool-card-description">{tool.description}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile Anchor Ad */}
      <AdBox type="anchor" className="anchor" />

      <Footer />

      <style>{`
        .tool-page {
          min-height: 100vh;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) 0;
          font-size: var(--text-sm);
          color: var(--text-muted);
        }

        .breadcrumb a {
          color: var(--text-light);
          text-decoration: none;
        }

        .breadcrumb a:hover {
          color: var(--yinmn-blue);
        }

        .breadcrumb .current {
          color: var(--text-dark);
          font-weight: 500;
        }

        .tool-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }

        .tool-header h1 {
          font-size: var(--text-4xl);
          margin-bottom: var(--spacing-sm);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tool-description {
          font-size: var(--text-lg);
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto;
        }

        .tool-container {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .faq-section {
          margin: var(--spacing-xl) 0;
        }

        .faq-section h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--spacing-lg);
        }

        .faq-list {
          background: var(--bg-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .faq-item {
          border-bottom: 1px solid var(--platinum);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          width: 100%;
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: none;
          border: none;
          font-size: var(--text-base);
          font-weight: 600;
          color: var(--text-dark);
          cursor: pointer;
          text-align: left;
          transition: background var(--transition);
        }

        .faq-question:hover {
          background: var(--bg-secondary);
        }

        .faq-icon {
          font-size: var(--text-xl);
          color: var(--yinmn-blue);
        }

        .faq-answer {
          padding: 0 var(--spacing-lg) var(--spacing-md);
          color: var(--text-light);
          line-height: var(--leading-relaxed);
        }

        .related-tools {
          margin: var(--spacing-xl) 0;
        }

        .related-tools h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--spacing-lg);
        }

        .related-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-lg);
        }

        @media (max-width: 768px) {
          .tool-container {
            padding: var(--spacing-md);
          }

          .tool-header h1 {
            font-size: var(--text-2xl);
          }

          .tool-description {
            font-size: var(--text-base);
          }
        }
      `}</style>
    </>
  );
};

ToolLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string),
  category: PropTypes.string.isRequired,
  categoryName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  seoContent: PropTypes.node,
  faqs: PropTypes.arrayOf(PropTypes.shape({
    question: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired
  })),
  relatedTools: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.string,
    description: PropTypes.string
  }))
};

export default ToolLayout;
