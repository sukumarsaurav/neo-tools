import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AboutUs = () => {
    return (
        <>
            <Helmet>
                <title>About Us | NeoWebTools</title>
                <meta name="description" content="Learn about NeoWebTools - free online tools for developers, SEO professionals, and creatives. Our mission is to provide simple, fast, and free utilities." />
                <link rel="canonical" href="https://www.neofreetools.online/about" />
            </Helmet>
            <Header />
            <main className="page-container">
                <div className="container">
                    <div className="about-content">
                        <h1>About NeoWebTools</h1>

                        <section className="about-hero">
                            <p className="hero-text">
                                100+ free online tools for developers, SEO professionals, and creatives.
                                No signup required. No data stored. Just simple, fast, and free utilities.
                            </p>
                        </section>

                        <section className="about-section">
                            <h2>🎯 Our Mission</h2>
                            <p>
                                We believe that essential web tools should be free and accessible to everyone.
                                Our mission is to provide a comprehensive collection of online utilities that
                                help developers, designers, and professionals work more efficiently.
                            </p>
                        </section>

                        <section className="about-section">
                            <h2>⚡ What Makes Us Different</h2>
                            <div className="features-grid">
                                <div className="feature-card">
                                    <span className="feature-icon">🔒</span>
                                    <h3>Privacy First</h3>
                                    <p>All tools run in your browser. Your data never leaves your device.</p>
                                </div>
                                <div className="feature-card">
                                    <span className="feature-icon">⚡</span>
                                    <h3>Lightning Fast</h3>
                                    <p>No server processing means instant results for all operations.</p>
                                </div>
                                <div className="feature-card">
                                    <span className="feature-icon">🆓</span>
                                    <h3>100% Free</h3>
                                    <p>No hidden fees, no premium tiers, no registration required.</p>
                                </div>
                                <div className="feature-card">
                                    <span className="feature-icon">📱</span>
                                    <h3>Mobile Friendly</h3>
                                    <p>All tools work perfectly on desktop, tablet, and mobile devices.</p>
                                </div>
                            </div>
                        </section>

                        <section className="about-section">
                            <h2>🛠️ Our Tool Categories</h2>
                            <div className="categories-grid">
                                <div className="category-item">
                                    <span>💰</span>
                                    <h4>Financial Tools</h4>
                                    <p>GST, EMI, SIP, FD calculators and more</p>
                                </div>
                                <div className="category-item">
                                    <span>🔍</span>
                                    <h4>SEO Tools</h4>
                                    <p>Meta tags, sitemaps, schema generators</p>
                                </div>
                                <div className="category-item">
                                    <span>🎨</span>
                                    <h4>Image Tools</h4>
                                    <p>Resize, compress, convert, and edit images</p>
                                </div>
                                <div className="category-item">
                                    <span>📝</span>
                                    <h4>Text Tools</h4>
                                    <p>Count, convert, format, and analyze text</p>
                                </div>
                                <div className="category-item">
                                    <span>⌨️</span>
                                    <h4>Typing Tools</h4>
                                    <p>Speed tests, practice, and education</p>
                                </div>
                                <div className="category-item">
                                    <span>⚙️</span>
                                    <h4>Developer Tools</h4>
                                    <p>JSON, encoders, converters, formatters</p>
                                </div>
                            </div>
                        </section>

                        <section className="about-section">
                            <h2>💻 Built With Modern Tech</h2>
                            <p>
                                NeoWebTools is built using React and Vite, ensuring fast load times and
                                smooth user experience. We use modern web standards and follow best
                                practices for performance and accessibility.
                            </p>
                        </section>

                        <section className="about-section cta-section">
                            <h2>Get In Touch</h2>
                            <p>
                                Have suggestions for new tools? Found a bug? Want to collaborate?
                            </p>
                            <a href="/contact" className="cta-button">Contact Us</a>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
            <style>{aboutStyles}</style>
        </>
    );
};

const aboutStyles = `
    .page-container {
        min-height: 70vh;
        padding: var(--spacing-xl) 0;
    }
    .about-content {
        max-width: 900px;
        margin: 0 auto;
    }
    .about-content h1 {
        font-size: var(--text-3xl, 2rem);
        text-align: center;
        margin-bottom: var(--spacing-xl);
        color: var(--text-primary, #1a1a2e);
    }
    .about-hero {
        background: linear-gradient(135deg, var(--pumpkin, #fc7a1e) 0%, var(--sunset, #f9c784) 100%);
        padding: var(--spacing-2xl);
        border-radius: var(--radius-lg, 12px);
        margin-bottom: var(--spacing-2xl);
        text-align: center;
    }
    .hero-text {
        color: white;
        font-size: var(--text-xl);
        font-weight: 500;
        margin: 0;
        line-height: 1.6;
    }
    .about-section {
        background: var(--bg-primary, #fff);
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg, 12px);
        box-shadow: var(--shadow-sm);
        margin-bottom: var(--spacing-xl);
    }
    .about-section h2 {
        font-size: var(--text-xl, 1.25rem);
        margin-bottom: var(--spacing-md);
        color: var(--text-primary, #1a1a2e);
    }
    .about-section p {
        color: var(--text-secondary, #444);
        line-height: 1.7;
    }
    .features-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
    }
    .feature-card {
        background: var(--bg-secondary, #f8f8f8);
        padding: var(--spacing-lg);
        border-radius: var(--radius);
        text-align: center;
    }
    .feature-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: var(--spacing-sm);
    }
    .feature-card h3 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
    }
    .feature-card p {
        font-size: var(--text-sm);
        margin: 0;
    }
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
    }
    .category-item {
        text-align: center;
        padding: var(--spacing-md);
    }
    .category-item span {
        font-size: 2rem;
        display: block;
        margin-bottom: var(--spacing-sm);
    }
    .category-item h4 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-xs);
    }
    .category-item p {
        font-size: var(--text-sm);
        margin: 0;
    }
    .cta-section {
        text-align: center;
    }
    .cta-button {
        display: inline-block;
        background: var(--pumpkin, #fc7a1e);
        color: white;
        padding: var(--spacing-md) var(--spacing-2xl);
        border-radius: var(--radius);
        text-decoration: none;
        font-weight: 600;
        margin-top: var(--spacing-md);
        transition: background 0.2s, transform 0.2s;
    }
    .cta-button:hover {
        background: var(--sunset, #f9c784);
        transform: translateY(-2px);
    }
    @media (max-width: 768px) {
        .features-grid,
        .categories-grid {
            grid-template-columns: 1fr;
        }
    }
`;

export default AboutUs;
