import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, integrate with a backend or form service like Formspree
        setSubmitted(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Helmet>
                <title>Contact Us | NeoWebTools</title>
                <meta name="description" content="Contact NeoWebTools team. Get in touch for support, feedback, or partnership inquiries." />
                <link rel="canonical" href="https://www.neofreetools.online/contact" />
            </Helmet>
            <Header />
            <main className="page-container">
                <div className="container">
                    <div className="contact-content">
                        <h1>Contact Us</h1>
                        <p className="contact-intro">
                            Have a question, suggestion, or found a bug? We'd love to hear from you!
                        </p>

                        <div className="contact-grid">
                            <div className="contact-info">
                                <div className="info-card">
                                    <span className="info-icon">📧</span>
                                    <h3>Email</h3>
                                    <a href="mailto:contact@neofreetools.online">contact@neofreetools.online</a>
                                </div>

                                <div className="info-card">
                                    <span className="info-icon">⏰</span>
                                    <h3>Response Time</h3>
                                    <p>We typically respond within 24-48 hours</p>
                                </div>

                                <div className="info-card">
                                    <span className="info-icon">💡</span>
                                    <h3>Feature Requests</h3>
                                    <p>We welcome suggestions for new tools!</p>
                                </div>
                            </div>

                            <div className="contact-form-wrapper">
                                {submitted ? (
                                    <div className="success-message">
                                        <span className="success-icon">✅</span>
                                        <h3>Thank You!</h3>
                                        <p>Your message has been sent. We'll get back to you soon.</p>
                                    </div>
                                ) : (
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder="your@email.com"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="subject">Subject</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="bug">Bug Report</option>
                                                <option value="feature">Feature Request</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="message">Message</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows="5"
                                                placeholder="Your message..."
                                            />
                                        </div>

                                        <button type="submit" className="submit-btn">
                                            Send Message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <style>{contactStyles}</style>
        </>
    );
};

const contactStyles = `
    .page-container {
        min-height: 70vh;
        padding: var(--spacing-xl) 0;
    }
    .contact-content {
        max-width: 1000px;
        margin: 0 auto;
    }
    .contact-content h1 {
        font-size: var(--text-3xl, 2rem);
        text-align: center;
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary, #1a1a2e);
    }
    .contact-intro {
        text-align: center;
        color: var(--text-muted, #666);
        margin-bottom: var(--spacing-2xl);
    }
    .contact-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: var(--spacing-xl);
    }
    .contact-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
    .info-card {
        background: var(--bg-primary, #fff);
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg, 12px);
        box-shadow: var(--shadow-sm);
        text-align: center;
    }
    .info-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: var(--spacing-sm);
    }
    .info-card h3 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
    }
    .info-card a, .info-card p {
        color: var(--text-muted, #666);
        font-size: var(--text-sm);
    }
    .info-card a:hover {
        color: var(--pumpkin, #fc7a1e);
    }
    .contact-form-wrapper {
        background: var(--bg-primary, #fff);
        padding: var(--spacing-xl);
        border-radius: var(--radius-lg, 12px);
        box-shadow: var(--shadow-sm);
    }
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
    .form-group label {
        display: block;
        font-weight: 500;
        margin-bottom: var(--spacing-xs);
        color: var(--text-primary);
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--platinum, #e0e0e0);
        border-radius: var(--radius);
        font-size: var(--text-base);
        transition: border-color 0.2s;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--pumpkin, #fc7a1e);
    }
    .submit-btn {
        background: var(--pumpkin, #fc7a1e);
        color: white;
        padding: var(--spacing-md) var(--spacing-xl);
        border: none;
        border-radius: var(--radius);
        font-size: var(--text-base);
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s, transform 0.2s;
    }
    .submit-btn:hover {
        background: var(--sunset, #f9c784);
        transform: translateY(-2px);
    }
    .success-message {
        text-align: center;
        padding: var(--spacing-2xl);
    }
    .success-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: var(--spacing-md);
    }
    .success-message h3 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
    }
    @media (max-width: 768px) {
        .contact-grid {
            grid-template-columns: 1fr;
        }
        .contact-info {
            flex-direction: row;
            flex-wrap: wrap;
        }
        .info-card {
            flex: 1;
            min-width: 150px;
        }
    }
`;

export default ContactUs;
