import { Link } from 'react-router-dom';
import toolsData from '../../data/tools.json';
import logoImage from '../../assets/neo-free-tools.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const popularTools = toolsData.tools.filter(t => t.popular).slice(0, 6);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logoImage} alt="NeoFreeTools" className="footer-logo-img" />
              <span className="logo-text">NeoFree<span className="logo-accent">Tools</span></span>
            </Link>
            <p className="footer-tagline">
              Free online tools for finance, SEO, development, and more.
              Simple, fast, and no registration required.
            </p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">𝕏</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">⌗</a>
            </div>
          </div>

          {/* Categories */}
          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              {toolsData.categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}>
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div className="footer-section">
            <h4>Popular Tools</h4>
            <ul>
              {popularTools.map(tool => (
                <li key={tool.id}>
                  <Link to={tool.path}>{tool.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} NeoWebTools. All rights reserved.</p>
          <p className="footer-credit">Free tools by <a href="https://neowebx.com" target="_blank" rel="noopener noreferrer">neowebx.com</a></p>
          <p className="footer-made">Made with ❤️ for developers & professionals</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--bg-dark);
          color: var(--white);
          padding: var(--spacing-3xl) 0 var(--spacing-lg);
          margin-top: var(--spacing-3xl);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          font-size: var(--text-xl);
          font-weight: 700;
          margin-bottom: var(--spacing-md);
        }

        .footer-logo-img {
          height: 32px;
          width: auto;
          object-fit: contain;
        }

        .footer-logo .logo-text {
          color: var(--white);
        }

        .footer-logo .logo-accent {
          color: var(--sunset);
        }

        .footer-tagline {
          color: rgba(255, 255, 255, 0.7);
          font-size: var(--text-sm);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--spacing-lg);
        }

        .social-links {
          display: flex;
          gap: var(--spacing-sm);
        }

        .social-links a {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          text-decoration: none;
          font-weight: 600;
          transition: all var(--transition);
        }

        .social-links a:hover {
          background: var(--pumpkin);
          transform: translateY(-2px);
        }

        .footer-section h4 {
          color: var(--white);
          font-size: var(--text-base);
          font-weight: 600;
          margin-bottom: var(--spacing-md);
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section li {
          margin-bottom: var(--spacing-sm);
        }

        .footer-section a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: color var(--transition);
        }

        .footer-section a:hover {
          color: var(--sunset);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-bottom p {
          color: rgba(255, 255, 255, 0.5);
          font-size: var(--text-sm);
          margin: 0;
        }

        .footer-made {
          color: rgba(255, 255, 255, 0.5);
        }

        .footer-credit {
          color: rgba(255, 255, 255, 0.5);
        }

        .footer-credit a {
          color: var(--sunset);
          text-decoration: none;
          transition: color var(--transition);
        }

        .footer-credit a:hover {
          color: var(--pumpkin);
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-lg);
          }

          .footer-brand {
            grid-column: span 2;
          }

          .footer-bottom {
            flex-direction: column;
            gap: var(--spacing-sm);
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }

          .footer-brand {
            grid-column: span 1;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
