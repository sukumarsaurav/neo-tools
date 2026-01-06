import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const TermsOfService = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service | NeoWebTools</title>
                <meta name="description" content="Terms of Service for NeoWebTools. Read our terms and conditions for using our free online tools." />
                <link rel="canonical" href="https://neofreetools.online/terms" />
            </Helmet>
            <Header />
            <main className="page-container">
                <div className="container">
                    <div className="legal-content">
                        <h1>Terms of Service</h1>
                        <p className="last-updated">Last Updated: January 2026</p>

                        <section>
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using NeoWebTools ("the Service"), you agree to be bound by
                                these Terms of Service. If you do not agree to these terms, please do not use our website.
                            </p>
                        </section>

                        <section>
                            <h2>2. Description of Service</h2>
                            <p>
                                NeoWebTools provides free online tools for developers, SEO professionals, and creatives.
                                Our tools include calculators, converters, generators, and utilities that run entirely
                                in your browser.
                            </p>
                        </section>

                        <section>
                            <h2>3. Use of the Service</h2>
                            <h3>3.1 Permitted Use</h3>
                            <p>You may use our tools for:</p>
                            <ul>
                                <li>Personal and commercial projects</li>
                                <li>Educational purposes</li>
                                <li>Professional work</li>
                            </ul>

                            <h3>3.2 Prohibited Use</h3>
                            <p>You may not:</p>
                            <ul>
                                <li>Attempt to hack, disrupt, or abuse our services</li>
                                <li>Use automated systems to overload our servers</li>
                                <li>Copy or redistribute our website code without permission</li>
                                <li>Use our tools for illegal activities</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Intellectual Property</h2>
                            <p>
                                The NeoWebTools website, including its design, code, and content, is protected by
                                intellectual property laws. You may not reproduce, distribute, or create derivative
                                works without our written permission.
                            </p>
                            <p>
                                Content you create using our tools belongs to you. We make no claim to ownership of
                                your generated content.
                            </p>
                        </section>

                        <section>
                            <h2>5. Disclaimer of Warranties</h2>
                            <p>
                                Our tools are provided "AS IS" without warranties of any kind. We do not guarantee
                                that our tools will be error-free, accurate, or available at all times.
                            </p>
                            <p>
                                <strong>Specifically, we disclaim warranties regarding:</strong>
                            </p>
                            <ul>
                                <li>Accuracy of calculations or conversions</li>
                                <li>Suitability for any particular purpose</li>
                                <li>Uninterrupted or error-free operation</li>
                            </ul>
                        </section>

                        <section>
                            <h2>6. Limitation of Liability</h2>
                            <p>
                                To the maximum extent permitted by law, NeoWebTools shall not be liable for any
                                indirect, incidental, special, consequential, or punitive damages arising from
                                your use of our services.
                            </p>
                            <p>
                                This includes, but is not limited to:
                            </p>
                            <ul>
                                <li>Loss of data or profits</li>
                                <li>Business interruption</li>
                                <li>Errors in tool outputs</li>
                            </ul>
                        </section>

                        <section>
                            <h2>7. Third-Party Services</h2>
                            <p>
                                Our website may contain links to third-party websites or integrate third-party
                                services (such as advertising). We are not responsible for the content or practices
                                of these third parties.
                            </p>
                        </section>

                        <section>
                            <h2>8. Privacy</h2>
                            <p>
                                Your use of our services is also governed by our{' '}
                                <a href="/privacy">Privacy Policy</a>, which describes how we collect and use your information.
                            </p>
                        </section>

                        <section>
                            <h2>9. Modifications to Service</h2>
                            <p>
                                We reserve the right to modify, suspend, or discontinue any part of our service
                                at any time without notice. We may also update these terms periodically.
                            </p>
                        </section>

                        <section>
                            <h2>10. Governing Law</h2>
                            <p>
                                These terms shall be governed by and construed in accordance with applicable laws,
                                without regard to conflict of law principles.
                            </p>
                        </section>

                        <section>
                            <h2>11. Contact</h2>
                            <p>
                                For questions about these terms, please contact us at{' '}
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

export default TermsOfService;
