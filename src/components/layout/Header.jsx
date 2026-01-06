import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toolsData from '../../data/tools.json';
import useDarkMode from '../../hooks/useDarkMode';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const { isDark, toggle } = useDarkMode();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      const results = toolsData.tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  // Get tools for a specific category
  const getToolsForCategory = (categoryId) => {
    return toolsData.tools.filter(tool => tool.category === categoryId);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Left Side: Logo + Navigation */}
          <div className="header-left">
            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-icon">🛠️</span>
              <span className="logo-text">NeoWeb<span className="logo-accent">Tools</span></span>
            </Link>

            {/* Desktop Navigation - All categories with dropdowns */}
            <nav className="nav-desktop">
              {toolsData.categories.map(cat => (
                <div
                  key={cat.id}
                  className="nav-dropdown"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={`/category/${cat.id}`}
                    className={location.pathname.includes(cat.id) ? 'active' : ''}
                  >
                    <span className="nav-label">{cat.name}</span>
                    <span className={`nav-arrow ${activeDropdown === cat.id ? 'open' : ''}`}>▾</span>
                  </Link>
                  {activeDropdown === cat.id && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        {cat.name}
                      </div>
                      <div className="dropdown-tools">
                        {getToolsForCategory(cat.id).slice(0, 8).map(tool => (
                          <Link
                            key={tool.id}
                            to={tool.path}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                      <Link
                        to={`/category/${cat.id}`}
                        className="dropdown-view-all"
                        onClick={() => setActiveDropdown(null)}
                      >
                        View all {cat.name} tools →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right Side: Dark Mode Toggle + Search Icon */}
          <div className="header-right">
            <button
              className="theme-toggle-btn"
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <div className="header-search">
              <button
                className="search-toggle-btn"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Toggle search"
              >
                🔍
              </button>
              {isSearchOpen && (
                <div className="search-dropdown-container">
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="header-search-input"
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <div className="search-dropdown">
                      {searchResults.map(tool => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          onClick={clearSearch}
                          className="search-result"
                        >
                          <span className="search-result-icon">{tool.icon}</span>
                          <div>
                            <div className="search-result-name">{tool.name}</div>
                            <div className="search-result-desc">{tool.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="nav-mobile">
            <div className="mobile-search">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={handleSearch}
                className="form-input"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mobile-search-results">
                {searchResults.map(tool => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    onClick={() => { clearSearch(); setIsMenuOpen(false); }}
                    className="search-result"
                  >
                    <span>{tool.icon}</span> {tool.name}
                  </Link>
                ))}
              </div>
            )}
            <div className="mobile-category-title">Categories</div>
            {toolsData.categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                onClick={() => setIsMenuOpen(false)}
                className="mobile-category-link"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .header {
          background: var(--bg-primary);
          border-bottom: 1px solid var(--platinum);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) 0;
          gap: var(--spacing-md);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .header-right {
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          font-size: var(--text-xl);
          font-weight: 700;
          white-space: nowrap;
        }

        .logo-icon {
          font-size: var(--text-2xl);
        }

        .logo-text {
          color: var(--text-dark);
        }

        .logo-accent {
          color: var(--pumpkin);
        }

        .nav-desktop {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .nav-desktop .nav-dropdown > a {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          font-size: var(--text-sm);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius);
          transition: all var(--transition);
          white-space: nowrap;
        }

        .nav-desktop .nav-dropdown > a:hover,
        .nav-desktop .nav-dropdown > a.active {
          color: var(--yinmn-blue);
          background: rgba(72, 86, 150, 0.08);
        }

        .nav-arrow {
          font-size: var(--text-sm);
          transition: transform var(--transition);
          opacity: 0.7;
        }

        .nav-arrow.open {
          transform: rotate(180deg);
        }

        .nav-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--bg-primary);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          min-width: 280px;
          padding: var(--spacing-sm);
          z-index: 1000;
        }

        .dropdown-header {
          font-weight: 600;
          padding: var(--spacing-sm) var(--spacing-md);
          border-bottom: 1px solid var(--platinum);
          margin-bottom: var(--spacing-sm);
          color: var(--text-dark);
        }

        .dropdown-tools {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2px;
        }

        .dropdown-tools a {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius-sm);
          color: var(--text-light);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: all var(--transition);
        }

        .dropdown-tools a:hover {
          background: var(--bg-secondary);
          color: var(--text-dark);
        }

        .dropdown-tool-icon {
          font-size: var(--text-base);
        }

        .dropdown-view-all {
          display: block;
          padding: var(--spacing-sm) var(--spacing-md);
          margin-top: var(--spacing-sm);
          border-top: 1px solid var(--platinum);
          color: var(--yinmn-blue);
          text-decoration: none;
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .dropdown-view-all:hover {
          color: var(--pumpkin);
        }

        .theme-toggle-btn {
          background: none;
          border: none;
          font-size: var(--text-xl);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--radius);
          transition: all var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .theme-toggle-btn:hover {
          background: var(--bg-secondary);
          transform: rotate(15deg);
        }

        .header-search {
          position: relative;
        }

        .search-toggle-btn {
          background: none;
          border: none;
          font-size: var(--text-xl);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--radius);
          transition: all var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-toggle-btn:hover {
          background: var(--bg-secondary);
        }

        .search-dropdown-container {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 300px;
          z-index: 1000;
        }

        .header-search-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          font-size: var(--text-sm);
          background: var(--bg-primary);
          box-shadow: var(--shadow-lg);
          transition: all var(--transition);
        }

        .header-search-input:focus {
          outline: none;
          border-color: var(--yinmn-blue);
        }

        .search-dropdown {
          margin-top: var(--spacing-xs);
          background: var(--bg-primary);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          max-height: 400px;
          overflow-y: auto;
        }

        .search-result {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-md);
          text-decoration: none;
          transition: background var(--transition);
        }

        .search-result:hover {
          background: var(--bg-secondary);
        }

        .search-result-icon {
          font-size: var(--text-xl);
        }

        .search-result-name {
          font-weight: 500;
          color: var(--text-dark);
        }

        .search-result-desc {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          font-size: var(--text-xl);
          cursor: pointer;
          color: var(--text-dark);
        }

        .nav-mobile {
          display: none;
          flex-direction: column;
          padding: var(--spacing-md) 0;
          border-top: 1px solid var(--platinum);
        }

        .nav-mobile a {
          padding: var(--spacing-sm) 0;
          color: var(--text-dark);
          text-decoration: none;
        }

        .mobile-category-title {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-top: var(--spacing-md);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .mobile-category-link {
          padding-left: var(--spacing-md) !important;
        }

        .mobile-search {
          margin-bottom: var(--spacing-md);
        }

        .mobile-search-results {
          margin-bottom: var(--spacing-md);
          padding: var(--spacing-sm);
          background: var(--bg-secondary);
          border-radius: var(--radius);
        }

        @media (max-width: 1200px) {
          .nav-label {
            display: none;
          }
          .nav-desktop .nav-dropdown > a {
            padding: var(--spacing-xs);
          }
          .nav-icon {
            font-size: var(--text-lg);
          }
        }

        @media (max-width: 900px) {
          .nav-desktop,
          .header-right {
            display: none;
          }

          .menu-toggle {
            display: block;
          }

          .nav-mobile {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
