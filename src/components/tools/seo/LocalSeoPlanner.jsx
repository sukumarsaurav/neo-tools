import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const LocalSeoPlanner = () => {
    const [businessName, setBusinessName] = useState('');
    const [businessType, setBusinessType] = useState('restaurant');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [plan, setPlan] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'local-seo-planner').slice(0, 3);

    const businessTypes = [
        { id: 'restaurant', label: '🍽️ Restaurant / Cafe' },
        { id: 'retail', label: '🛍️ Retail / Store' },
        { id: 'service', label: '🔧 Service Business' },
        { id: 'healthcare', label: '🏥 Healthcare / Medical' },
        { id: 'legal', label: '⚖️ Legal Services' },
        { id: 'real-estate', label: '🏠 Real Estate' },
        { id: 'automotive', label: '🚗 Automotive' },
        { id: 'fitness', label: '💪 Fitness / Gym' },
        { id: 'beauty', label: '💇 Beauty / Salon' },
        { id: 'other', label: '🏢 Other' }
    ];

    const citationSites = {
        universal: [
            { name: 'Google Business Profile', url: 'business.google.com', priority: 'high' },
            { name: 'Bing Places', url: 'bingplaces.com', priority: 'high' },
            { name: 'Apple Maps', url: 'mapsconnect.apple.com', priority: 'high' },
            { name: 'Yelp', url: 'biz.yelp.com', priority: 'high' },
            { name: 'Facebook Business', url: 'facebook.com/business', priority: 'high' },
            { name: 'Yellow Pages', url: 'yellowpages.com', priority: 'medium' },
            { name: 'Foursquare', url: 'foursquare.com', priority: 'medium' },
            { name: 'TripAdvisor', url: 'tripadvisor.com', priority: 'medium' }
        ],
        restaurant: [
            { name: 'OpenTable', url: 'restaurant.opentable.com', priority: 'high' },
            { name: 'Zomato', url: 'zomato.com', priority: 'medium' },
            { name: 'DoorDash', url: 'doordash.com', priority: 'medium' },
            { name: 'Uber Eats', url: 'ubereats.com', priority: 'medium' }
        ],
        healthcare: [
            { name: 'Healthgrades', url: 'healthgrades.com', priority: 'high' },
            { name: 'Zocdoc', url: 'zocdoc.com', priority: 'high' },
            { name: 'Vitals', url: 'vitals.com', priority: 'medium' },
            { name: 'WebMD', url: 'webmd.com', priority: 'medium' }
        ],
        legal: [
            { name: 'Avvo', url: 'avvo.com', priority: 'high' },
            { name: 'FindLaw', url: 'findlaw.com', priority: 'high' },
            { name: 'Justia', url: 'justia.com', priority: 'medium' },
            { name: 'Martindale', url: 'martindale.com', priority: 'medium' }
        ],
        'real-estate': [
            { name: 'Zillow', url: 'zillow.com', priority: 'high' },
            { name: 'Realtor.com', url: 'realtor.com', priority: 'high' },
            { name: 'Trulia', url: 'trulia.com', priority: 'medium' },
            { name: 'Redfin', url: 'redfin.com', priority: 'medium' }
        ],
        automotive: [
            { name: 'Cars.com', url: 'cars.com', priority: 'high' },
            { name: 'AutoTrader', url: 'autotrader.com', priority: 'high' },
            { name: 'CarGurus', url: 'cargurus.com', priority: 'medium' }
        ],
        beauty: [
            { name: 'StyleSeat', url: 'styleseat.com', priority: 'high' },
            { name: 'Vagaro', url: 'vagaro.com', priority: 'medium' },
            { name: 'Booksy', url: 'booksy.com', priority: 'medium' }
        ]
    };

    const generatePlan = () => {
        if (!businessName.trim() || !city.trim()) {
            alert('Please enter business name and city');
            return;
        }

        const gbpChecklist = [
            { task: 'Claim and verify your Google Business Profile', priority: 'high' },
            { task: 'Add complete business information (name, address, phone)', priority: 'high' },
            { task: 'Select primary and secondary business categories', priority: 'high' },
            { task: 'Add business hours including special hours', priority: 'high' },
            { task: 'Write a compelling business description (750 chars)', priority: 'medium' },
            { task: 'Upload at least 10 high-quality photos', priority: 'high' },
            { task: 'Add products/services with descriptions', priority: 'medium' },
            { task: 'Create your first Google Post', priority: 'medium' },
            { task: 'Enable messaging and respond promptly', priority: 'medium' },
            { task: 'Set up booking/appointment links if applicable', priority: 'medium' }
        ];

        const napChecklist = [
            { task: `Standardize business name format: "${businessName}"`, priority: 'high' },
            { task: `Use consistent address format across all platforms`, priority: 'high' },
            { task: `Use consistent phone number format`, priority: 'high' },
            { task: 'Audit existing listings for NAP inconsistencies', priority: 'high' },
            { task: 'Update any outdated listings', priority: 'medium' }
        ];

        const contentIdeas = [
            `Best ${businessType} in ${city} - Why locals choose ${businessName}`,
            `${businessName} ${city} Guide: What to Expect`,
            `Top 10 Reasons to Visit ${businessName} in ${city}`,
            `${city} ${businessType} Reviews: ${businessName} Customer Stories`,
            `How ${businessName} Serves the ${city} ${state ? `${state} ` : ''}Community`,
            `Local Events and ${businessName}: ${city} Community Involvement`,
            `Behind the Scenes at ${businessName} ${city}`,
            `${businessType} Tips from ${businessName} ${city} Experts`
        ];

        const reviewStrategy = [
            { task: 'Respond to all reviews within 24-48 hours', priority: 'high' },
            { task: 'Thank customers for positive reviews personally', priority: 'medium' },
            { task: 'Address negative reviews professionally and offer solutions', priority: 'high' },
            { task: 'Ask satisfied customers to leave reviews (in-person)', priority: 'high' },
            { task: 'Add review links to email signatures and receipts', priority: 'medium' },
            { task: 'Create a review generation landing page', priority: 'low' }
        ];

        const citations = [
            ...citationSites.universal,
            ...(citationSites[businessType] || [])
        ];

        setPlan({
            businessName,
            businessType,
            location: `${city}${state ? `, ${state}` : ''}`,
            gbpChecklist,
            napChecklist,
            citations,
            contentIdeas,
            reviewStrategy
        });
    };

    const exportMarkdown = () => {
        if (!plan) return;
        let md = `# Local SEO Plan for ${plan.businessName}\n\n`;
        md += `**Business Type:** ${plan.businessType}\n`;
        md += `**Location:** ${plan.location}\n`;
        md += `**Generated:** ${new Date().toLocaleDateString()}\n\n---\n\n`;

        md += `## 📍 Google Business Profile Checklist\n\n`;
        plan.gbpChecklist.forEach(item => {
            const icon = item.priority === 'high' ? '🔴' : '🟡';
            md += `- [ ] ${icon} ${item.task}\n`;
        });

        md += `\n## 🏠 NAP Consistency Checklist\n\n`;
        plan.napChecklist.forEach(item => {
            md += `- [ ] ${item.task}\n`;
        });

        md += `\n## 📋 Citation Sources\n\n`;
        plan.citations.forEach(c => {
            md += `- [ ] ${c.name} (${c.url}) - ${c.priority} priority\n`;
        });

        md += `\n## ✍️ Local Content Ideas\n\n`;
        plan.contentIdeas.forEach(idea => { md += `- ${idea}\n`; });

        md += `\n## ⭐ Review Strategy\n\n`;
        plan.reviewStrategy.forEach(item => { md += `- [ ] ${item.task}\n`; });

        const blob = new Blob([md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'local-seo-plan.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const faqs = [
        { question: 'What is Local SEO?', answer: 'Local SEO optimizes your online presence to attract customers from local searches. It focuses on Google Business Profile, local citations, reviews, and location-based content.' },
        { question: 'What is NAP consistency?', answer: 'NAP stands for Name, Address, Phone. Consistency means your business information is identical across all online platforms, which builds trust with search engines.' },
        { question: 'How important are Google reviews?', answer: 'Very important! Reviews impact local rankings, click-through rates, and customer trust. Businesses with more positive reviews typically rank higher in local results.' }
    ];

    const seoContent = (<><h2>Local SEO Planner</h2><p>Generate a complete local SEO optimization plan for your business. Get checklists for Google Business Profile, NAP consistency, citations, and review strategy.</p></>);

    return (
        <ToolLayout title="Local SEO Planner" description="Create a complete local SEO optimization plan with Google Business Profile, citations, and review strategy." keywords={['local SEO', 'Google Business Profile', 'local citations', 'NAP consistency', 'local marketing']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="local-container">
                <div className="local-form">
                    <div className="form-group">
                        <label className="form-label">Business Name</label>
                        <input type="text" className="form-input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your Business Name" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Business Type</label>
                        <select className="form-select" value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
                            {businessTypes.map(bt => (
                                <option key={bt.id} value={bt.id}>{bt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">City</label>
                            <input type="text" className="form-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">State/Region (optional)</label>
                            <input type="text" className="form-input" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg" onClick={generatePlan}>📍 Generate Local SEO Plan</button>
                </div>

                {plan && (
                    <div className="plan-output">
                        <div className="plan-header">
                            <div>
                                <h3>Local SEO Plan for {plan.businessName}</h3>
                                <p className="plan-meta">📍 {plan.location}</p>
                            </div>
                            <button className="btn-export" onClick={exportMarkdown}>📄 Download Plan</button>
                        </div>

                        {/* GBP Checklist */}
                        <div className="section">
                            <h4>📍 Google Business Profile Checklist</h4>
                            <div className="checklist">
                                {plan.gbpChecklist.map((item, idx) => (
                                    <div key={idx} className={`check-item ${item.priority}`}>
                                        <input type="checkbox" id={`gbp-${idx}`} />
                                        <label htmlFor={`gbp-${idx}`}>{item.task}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NAP Checklist */}
                        <div className="section">
                            <h4>🏠 NAP Consistency</h4>
                            <div className="checklist">
                                {plan.napChecklist.map((item, idx) => (
                                    <div key={idx} className="check-item">
                                        <input type="checkbox" id={`nap-${idx}`} />
                                        <label htmlFor={`nap-${idx}`}>{item.task}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Citations */}
                        <div className="section">
                            <h4>📋 Citation Sources ({plan.citations.length})</h4>
                            <div className="citation-grid">
                                {plan.citations.map((c, idx) => (
                                    <div key={idx} className={`citation-card ${c.priority}`}>
                                        <input type="checkbox" id={`cite-${idx}`} />
                                        <label htmlFor={`cite-${idx}`}>
                                            <span className="cite-name">{c.name}</span>
                                            <span className="cite-url">{c.url}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Content Ideas */}
                        <div className="section">
                            <h4>✍️ Local Content Ideas</h4>
                            <div className="content-ideas">
                                {plan.contentIdeas.map((idea, idx) => (
                                    <div key={idx} className="idea-card">📝 {idea}</div>
                                ))}
                            </div>
                        </div>

                        {/* Review Strategy */}
                        <div className="section">
                            <h4>⭐ Review Strategy</h4>
                            <div className="checklist">
                                {plan.reviewStrategy.map((item, idx) => (
                                    <div key={idx} className={`check-item ${item.priority}`}>
                                        <input type="checkbox" id={`rev-${idx}`} />
                                        <label htmlFor={`rev-${idx}`}>{item.task}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .local-container { max-width: 900px; margin: 0 auto; }
                .local-form { background: var(--bg-secondary, #f9f9f9); padding: var(--spacing-lg, 24px); border-radius: var(--radius, 8px); margin-bottom: var(--spacing-xl, 32px); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md, 16px); }
                .form-input, .form-select { width: 100%; padding: var(--spacing-sm, 12px); border: 2px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); font-size: 1rem; }
                .plan-output { background: white; border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 8px); padding: var(--spacing-lg, 24px); }
                .plan-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: var(--spacing-md, 16px); margin-bottom: var(--spacing-lg, 24px); padding-bottom: var(--spacing-md, 16px); border-bottom: 1px solid var(--platinum, #e0e0e0); }
                .plan-header h3 { margin: 0; }
                .plan-meta { color: var(--text-muted, #666); margin-top: 4px; }
                .btn-export { padding: var(--spacing-sm, 10px) var(--spacing-md, 16px); background: var(--bg-secondary, #f5f5f5); border: 1px solid var(--platinum, #e0e0e0); border-radius: var(--radius, 6px); cursor: pointer; }
                .section { margin-bottom: var(--spacing-xl, 32px); }
                .section h4 { margin-bottom: var(--spacing-md, 16px); padding-bottom: var(--spacing-xs, 8px); border-bottom: 2px solid var(--yinmn-blue, #485696); }
                .checklist { display: flex; flex-direction: column; gap: var(--spacing-sm, 10px); }
                .check-item { display: flex; align-items: flex-start; gap: var(--spacing-sm, 10px); padding: var(--spacing-sm, 12px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 6px); border-left: 3px solid var(--platinum, #ccc); }
                .check-item.high { border-left-color: #dc3545; }
                .check-item.medium { border-left-color: #ffc107; }
                .check-item input { margin-top: 4px; }
                .check-item label { cursor: pointer; flex: 1; }
                .citation-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--spacing-md, 16px); }
                .citation-card { display: flex; align-items: flex-start; gap: var(--spacing-sm, 10px); padding: var(--spacing-md, 16px); background: var(--bg-secondary, #f9f9f9); border-radius: var(--radius, 8px); border-left: 3px solid var(--platinum, #ccc); }
                .citation-card.high { border-left-color: #dc3545; }
                .citation-card.medium { border-left-color: #ffc107; }
                .cite-name { display: block; font-weight: 600; }
                .cite-url { display: block; font-size: var(--text-sm, 13px); color: var(--text-muted, #666); }
                .content-ideas { display: flex; flex-direction: column; gap: var(--spacing-sm, 10px); }
                .idea-card { padding: var(--spacing-md, 16px); background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: var(--radius, 8px); border-left: 3px solid #667eea; }
                @media (max-width: 600px) {
                    .form-row { grid-template-columns: 1fr; }
                    .citation-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </ToolLayout>
    );
};

export default LocalSeoPlanner;
