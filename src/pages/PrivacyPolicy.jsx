import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | NeoWebTools</title>
                <meta name="description" content="Privacy Policy for NeoWebTools. Learn how we collect, use, and protect your information." />
                <link rel="canonical" href="https://www.neofreetools.online/privacy" />
            </Helmet>
            <Header />
            <main className="page-container">
                <div className="container">
                    <div className="legal-content">
                        <h1>Privacy Policy</h1>
                        <p className="last-updated">Last Updated: January 2026</p>

                        <section>
                            <h2>1. Introduction</h2>
                            <p>
                                Welcome to NeoWebTools ("we," "our," or "us"). We respect your privacy and are committed
                                to protecting your personal data. This privacy policy explains how we collect, use, and
                                safeguard your information when you visit our website.
                            </p>
                        </section>

                        <section>
                            <h2>2. Information We Collect</h2>
                            <h3>2.1 Automatically Collected Information</h3>
                            <p>When you visit our website, we may automatically collect:</p>
                            <ul>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Referring website</li>
                                <li>Pages visited and time spent</li>
                                <li>IP address (anonymized)</li>
                            </ul>

                            <h3>2.2 Information You Provide</h3>
                            <p>
                                Most of our tools work entirely in your browser. We do not collect or store
                                the data you input into our tools (such as images, text, or calculations).
                            </p>
                        </section>

                        <section>
                            <h2>3. How We Use Your Information</h2>
                            <p>We use the collected information to:</p>
                            <ul>
                                <li>Improve our website and tools</li>
                                <li>Analyze usage patterns</li>
                                <li>Ensure security and prevent abuse</li>
                                <li>Display relevant advertisements</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Cookies and Tracking</h2>
                            <p>
                                We use cookies and similar technologies to enhance your experience. These include:
                            </p>
                            <ul>
                                <li><strong>Essential Cookies:</strong> Required for site functionality</li>
                                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                                <li><strong>Advertising Cookies:</strong> Used by our advertising partners (Google AdSense) to show relevant ads</li>
                            </ul>
                        </section>

                        <section>
                            <h2>5. Third-Party Services</h2>
                            <p>We use the following third-party services:</p>
                            <ul>
                                <li><strong>Google AdSense:</strong> For displaying advertisements</li>
                                <li><strong>Google Analytics:</strong> For website analytics</li>
                                <li><strong>Vercel:</strong> For hosting our website</li>
                            </ul>
                            <p>
                                These services may collect information according to their own privacy policies.
                            </p>
                        </section>

                        <section>
                            <h2>6. Data Security</h2>
                            <p>
                                We implement appropriate security measures to protect your information.
                                All data processing occurs in your browser, and we do not store sensitive
                                information on our servers.
                            </p>
                        </section>

                        <section>
                            <h2>7. Your Rights</h2>
                            <p>You have the right to:</p>
                            <ul>
                                <li>Access information we hold about you</li>
                                <li>Request deletion of your data</li>
                                <li>Opt-out of advertising cookies</li>
                                <li>Disable cookies in your browser settings</li>
                            </ul>
                        </section>

                        <section>
                            <h2>8. Children's Privacy</h2>
                            <p>
                                Our website is not intended for children under 13. We do not knowingly
                                collect information from children.
                            </p>
                        </section>

                        <section>
                            <h2>9. Changes to This Policy</h2>
                            <p>
                                We may update this privacy policy from time to time. Changes will be
                                posted on this page with an updated revision date.
                            </p>
                        </section>

                        <section>
                            <h2>10. Contact Us</h2>
                            <p>
                                If you have questions about this privacy policy, please contact us at{' '}
                                <a href="mailto:contact@neofreetools.online">contact@neofreetools.online</a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
            <style>{legalStyles}</style>
        </>
    );
};

const legalStyles = `
    .page-container {
        min-height: 70vh;
        padding: var(--spacing-xl) 0;
    }
    .legal-content {
        max-width: 800px;
        margin: 0 auto;
        padding: var(--spacing-xl);
        background: var(--bg-primary, #fff);
        border-radius: var(--radius-lg, 12px);
        box-shadow: var(--shadow-sm);
    }
    .legal-content h1 {
        font-size: var(--text-3xl, 2rem);
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary, #1a1a2e);
    }
    .last-updated {
        color: var(--text-muted, #666);
        font-size: var(--text-sm);
        margin-bottom: var(--spacing-xl);
    }
    .legal-content section {
        margin-bottom: var(--spacing-xl);
    }
    .legal-content h2 {
        font-size: var(--text-xl, 1.25rem);
        margin-bottom: var(--spacing-md);
        color: var(--text-primary, #1a1a2e);
        border-bottom: 2px solid var(--platinum, #e0e0e0);
        padding-bottom: var(--spacing-sm);
    }
    .legal-content h3 {
        font-size: var(--text-lg, 1.1rem);
        margin: var(--spacing-md) 0 var(--spacing-sm);
        color: var(--text-secondary, #333);
    }
    .legal-content p {
        color: var(--text-secondary, #444);
        line-height: 1.7;
        margin-bottom: var(--spacing-md);
    }
    .legal-content ul {
        margin-left: var(--spacing-lg);
        margin-bottom: var(--spacing-md);
    }
    .legal-content li {
        color: var(--text-secondary, #444);
        line-height: 1.7;
        margin-bottom: var(--spacing-sm);
    }
    .legal-content a {
        color: var(--pumpkin, #fc7a1e);
        text-decoration: none;
    }
    .legal-content a:hover {
        text-decoration: underline;
    }
`;

export default PrivacyPolicy;
