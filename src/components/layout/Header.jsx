import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toolsData from '../../data/tools.json';
import useDarkMode from '../../hooks/useDarkMode';
import logoImage from '../../assets/neo-free-tools.png';

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const location = useLocation();
  const { isDark, toggle, detectionMethod } = useDarkMode();

  // Generate tooltip text based on detection method
  const getThemeTooltip = () => {
    const modeText = isDark ? 'dark mode' : 'light mode';
    switch (detectionMethod) {
      case 'system':
        return `${isDark ? '☀️' : '🌙'} Switch theme (currently ${modeText} via system preference)`;
      case 'time':
        return `${isDark ? '☀️' : '🌙'} Switch theme (currently ${modeText} based on time of day)`;
      default:
        return `${isDark ? '☀️' : '🌙'} Switch theme (manually set to ${modeText})`;
    }
  };

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setExpandedCategories({});
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

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

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getToolsForCategory = (categoryId) => {
    return toolsData.tools.filter(tool => tool.category === categoryId);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-content">
            {/* Left Side: Logo + Navigation */}
            <div className="header-left">
              {/* Logo */}
              <Link to="/" className="logo">
                <img src={logoImage} alt="NeoFreeTools" className="logo-img" />
                <span className="logo-text">NeoFree<span className="logo-accent">Tools</span></span>
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
                aria-label={getThemeTooltip()}
                title={getThemeTooltip()}
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
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle menu"
            >
              {isDrawerOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Side Drawer */}
      <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <Link to="/" className="drawer-logo" onClick={() => setIsDrawerOpen(false)}>
            <img src={logoImage} alt="NeoFreeTools" className="logo-img" />
            <span className="logo-text">NeoFree<span className="logo-accent">Tools</span></span>
          </Link>
          <button
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Mobile Search */}
        <div className="drawer-search">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={handleSearch}
            className="drawer-search-input"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="drawer-search-results">
            {searchResults.map(tool => (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => { clearSearch(); setIsDrawerOpen(false); }}
                className="drawer-search-result"
              >
                <span className="result-icon">{tool.icon}</span>
                <span className="result-name">{tool.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Category Navigation with Dropdowns */}
        <nav className="drawer-nav">
          <div className="drawer-section-title">Categories</div>
          {toolsData.categories.map(cat => (
            <div key={cat.id} className="drawer-category">
              <div className="drawer-category-header">
                <Link
                  to={`/category/${cat.id}`}
                  className="drawer-category-link"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-name">{cat.name}</span>
                </Link>
                <button
                  className={`drawer-expand-btn ${expandedCategories[cat.id] ? 'expanded' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                  aria-label={`Expand ${cat.name}`}
                >
                  ▾
                </button>
              </div>

              {/* Category Tools Dropdown */}
              <div className={`drawer-tools ${expandedCategories[cat.id] ? 'expanded' : ''}`}>
                {getToolsForCategory(cat.id).map(tool => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="drawer-tool-link"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <span className="tool-icon">{tool.icon}</span>
                    <span className="tool-name">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Drawer Footer Links */}
        <div className="drawer-footer">
          <div className="drawer-footer-links">
            <Link to="/about" onClick={() => setIsDrawerOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setIsDrawerOpen(false)}>Contact</Link>
            <Link to="/privacy" onClick={() => setIsDrawerOpen(false)}>Privacy</Link>
          </div>
          <button
            className="drawer-theme-toggle"
            onClick={toggle}
            title={getThemeTooltip()}
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            <span className="theme-detection-hint">
              {detectionMethod === 'system' && ' (System)'}
              {detectionMethod === 'time' && ' (Auto)'}
            </span>
          </button>
        </div>
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

        .logo, .drawer-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          font-size: var(--text-xl);
          font-weight: 700;
          white-space: nowrap;
        }

        .logo-img {
          height: 32px;
          width: auto;
          object-fit: contain;
        }

        .logo-text {
          color: var(--text-dark);
        }

        .logo-accent {
          color: #d65a00; /* Darker orange for better contrast - WCAG AA compliant */
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
          padding: var(--spacing-sm);
        }

        /* ===== SIDE DRAWER STYLES ===== */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .side-drawer {
          position: fixed;
          top: 0;
          right: -320px;
          width: 300px;
          max-width: 85vw;
          height: 100vh;
          background: var(--bg-primary);
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
          z-index: 999;
          transition: right 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .side-drawer.open {
          right: 0;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid var(--platinum);
          flex-shrink: 0;
        }

        .drawer-close {
          background: none;
          border: none;
          font-size: var(--text-xl);
          cursor: pointer;
          color: var(--text-muted);
          padding: var(--spacing-xs);
          border-radius: var(--radius);
          transition: all var(--transition);
        }

        .drawer-close:hover {
          background: var(--bg-secondary);
          color: var(--text-dark);
        }

        .drawer-search {
          padding: var(--spacing-md) var(--spacing-lg);
          flex-shrink: 0;
        }

        .drawer-search-input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          font-size: var(--text-sm);
          background: var(--bg-secondary);
        }

        .drawer-search-input:focus {
          outline: none;
          border-color: var(--pumpkin);
        }

        .drawer-search-results {
          padding: 0 var(--spacing-lg);
          max-height: 200px;
          overflow-y: auto;
          flex-shrink: 0;
        }

        .drawer-search-result {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm);
          text-decoration: none;
          color: var(--text-dark);
          border-radius: var(--radius);
          transition: background var(--transition);
        }

        .drawer-search-result:hover {
          background: var(--bg-secondary);
        }

        .drawer-nav {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-md) 0;
        }

        .drawer-section-title {
          font-size: var(--text-xs);
          font-weight: 700;
          color: #555555; /* Darker color for WCAG AA compliance */
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: var(--spacing-sm) var(--spacing-lg);
        }

        .drawer-category {
          border-bottom: 1px solid var(--platinum);
        }

        .drawer-category:last-child {
          border-bottom: none;
        }

        .drawer-category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-lg);
        }

        .drawer-category-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) 0;
          text-decoration: none;
          color: var(--text-dark);
          font-weight: 500;
          flex: 1;
        }

        .cat-icon {
          font-size: var(--text-lg);
        }

        .drawer-expand-btn {
          background: none;
          border: none;
          min-width: 44px;
          min-height: 44px;
          padding: var(--spacing-md);
          cursor: pointer;
          color: #555555; /* Darker color for WCAG AA compliance */
          transition: transform var(--transition);
          font-size: var(--text-base);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer-expand-btn.expanded {
          transform: rotate(180deg);
          color: #d65a00; /* Darker orange for contrast */
        }

        .drawer-tools {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background: var(--bg-secondary);
        }

        .drawer-tools.expanded {
          max-height: 1000px;
        }

        .drawer-tool-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-lg);
          padding-left: calc(var(--spacing-lg) + var(--spacing-lg));
          text-decoration: none;
          color: var(--text-light);
          font-size: var(--text-sm);
          transition: all var(--transition);
        }

        .drawer-tool-link:hover {
          background: rgba(252, 122, 30, 0.1);
          color: var(--pumpkin);
        }

        .drawer-tool-link .tool-icon {
          font-size: var(--text-base);
          opacity: 0.8;
        }

        .drawer-footer {
          flex-shrink: 0;
          padding: var(--spacing-lg);
          border-top: 1px solid var(--platinum);
          background: var(--bg-secondary);
        }

        .drawer-footer-links {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .drawer-footer-links a {
          color: #444444; /* Darker color for WCAG AA compliance */
          text-decoration: none;
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .drawer-footer-links a:hover {
          color: #d65a00; /* Darker orange for contrast */
        }

        .drawer-theme-toggle {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          background: var(--bg-primary);
          cursor: pointer;
          font-size: var(--text-sm);
          color: var(--text-dark);
          transition: all var(--transition);
        }

        .drawer-theme-toggle:hover {
          border-color: var(--pumpkin);
        }

        .theme-detection-hint {
          font-size: var(--text-xs);
          color: var(--text-muted);
          font-weight: 400;
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
        }

        @media (min-width: 901px) {
          .side-drawer,
          .drawer-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;

