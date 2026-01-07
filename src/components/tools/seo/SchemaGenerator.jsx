import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';

const SchemaGenerator = () => {
    const toast = useToast();
    const [schemaType, setSchemaType] = useState('Organization');
    const [data, setData] = useState({ name: '', url: '', logo: '', description: '', email: '', phone: '', address: '' });
    const [faqItems, setFaqItems] = useState([{ question: '', answer: '' }]);
    const [howToSteps, setHowToSteps] = useState([{ name: '', text: '' }]);

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'schema-generator').slice(0, 3);

    // Add/remove FAQ items
    const addFaqItem = () => setFaqItems([...faqItems, { question: '', answer: '' }]);
    const removeFaqItem = (index) => setFaqItems(faqItems.filter((_, i) => i !== index));
    const updateFaqItem = (index, field, value) => {
        const updated = [...faqItems];
        updated[index][field] = value;
        setFaqItems(updated);
    };

    // Add/remove HowTo steps
    const addHowToStep = () => setHowToSteps([...howToSteps, { name: '', text: '' }]);
    const removeHowToStep = (index) => setHowToSteps(howToSteps.filter((_, i) => i !== index));
    const updateHowToStep = (index, field, value) => {
        const updated = [...howToSteps];
        updated[index][field] = value;
        setHowToSteps(updated);
    };

    const generateSchema = () => {
        let schema = { '@context': 'https://schema.org' };

        switch (schemaType) {
            case 'Organization':
                schema = { ...schema, '@type': 'Organization', name: data.name, url: data.url, logo: data.logo, description: data.description, email: data.email, telephone: data.phone };
                break;
            case 'LocalBusiness':
                schema = { ...schema, '@type': 'LocalBusiness', name: data.name, url: data.url, telephone: data.phone, address: { '@type': 'PostalAddress', streetAddress: data.address } };
                break;
            case 'Article':
                schema = { ...schema, '@type': 'Article', headline: data.name, description: data.description, author: { '@type': 'Person', name: data.email } };
                break;
            case 'Product':
                schema = { ...schema, '@type': 'Product', name: data.name, description: data.description, image: data.logo };
                break;
            case 'FAQPage':
                const validFaqs = faqItems.filter(item => item.question.trim() && item.answer.trim());
                schema = {
                    ...schema,
                    '@type': 'FAQPage',
                    mainEntity: validFaqs.map(item => ({
                        '@type': 'Question',
                        name: item.question,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: item.answer
                        }
                    }))
                };
                break;
            case 'HowTo':
                const validSteps = howToSteps.filter(step => step.name.trim() && step.text.trim());
                schema = {
                    ...schema,
                    '@type': 'HowTo',
                    name: data.name,
                    description: data.description,
                    step: validSteps.map((step, index) => ({
                        '@type': 'HowToStep',
                        position: index + 1,
                        name: step.name,
                        text: step.text
                    }))
                };
                break;
            default:
                break;
        }
        return JSON.stringify(schema, null, 2);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(`<script type="application/ld+json">\n${generateSchema()}\n</script>`);
        toast.success('Schema markup copied!');
    };

    const faqs = [
        { question: 'What is Schema markup?', answer: 'Schema markup is structured data that helps search engines understand your content and display rich snippets like star ratings, prices, and FAQs in search results.' },
        { question: 'Does Schema improve SEO?', answer: 'Yes! Schema markup helps search engines understand your content better and can result in enhanced search listings (rich snippets) which improve click-through rates.' },
        { question: 'What is FAQ Schema?', answer: 'FAQ Schema is structured data that marks up frequently asked questions. Google can display these directly in search results as expandable Q&A sections.' }
    ];

    const seoContent = (<><h2>Schema Markup Generator</h2><p>Generate JSON-LD structured data for better search engine visibility. Supports Organization, Business, Article, Product, FAQ, and HowTo schemas.</p></>);

    return (
        <ToolLayout title="Schema Markup Generator" description="Generate JSON-LD structured data for Organizations, Products, Articles, FAQs, and more." keywords={['schema generator', 'JSON-LD generator', 'structured data', 'rich snippets', 'schema markup', 'FAQ schema']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group">
                    <label className="form-label">Schema Type</label>
                    <select className="form-select" value={schemaType} onChange={(e) => setSchemaType(e.target.value)}>
                        <option value="Organization">Organization</option>
                        <option value="LocalBusiness">Local Business</option>
                        <option value="Article">Article</option>
                        <option value="Product">Product</option>
                        <option value="FAQPage">FAQ Page</option>
                        <option value="HowTo">HowTo / Tutorial</option>
                    </select>
                </div>

                {/* Standard fields for most types */}
                {schemaType !== 'FAQPage' && (
                    <>
                        <div className="form-group"><label className="form-label">Name/Title</label><input type="text" className="form-input" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Business/Article/Product name" /></div>
                        {schemaType !== 'HowTo' && (
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">URL</label><input type="url" className="form-input" value={data.url} onChange={(e) => setData({ ...data, url: e.target.value })} placeholder="https://example.com" /></div>
                                <div className="form-group"><label className="form-label">Logo/Image URL</label><input type="url" className="form-input" value={data.logo} onChange={(e) => setData({ ...data, logo: e.target.value })} placeholder="https://example.com/logo.png" /></div>
                            </div>
                        )}
                        <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Brief description" rows={2} /></div>
                        {schemaType !== 'HowTo' && (
                            <div className="form-row">
                                <div className="form-group"><label className="form-label">Email/Author</label><input type="text" className="form-input" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="contact@example.com" /></div>
                                <div className="form-group"><label className="form-label">Phone</label><input type="text" className="form-input" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+1-234-567-8900" /></div>
                            </div>
                        )}
                    </>
                )}

                {/* FAQ-specific fields */}
                {schemaType === 'FAQPage' && (
                    <div className="dynamic-section">
                        <h4>❓ FAQ Items</h4>
                        {faqItems.map((item, index) => (
                            <div key={index} className="dynamic-item">
                                <div className="item-header">
                                    <span>Q{index + 1}</span>
                                    {faqItems.length > 1 && <button className="remove-btn" onClick={() => removeFaqItem(index)}>✕</button>}
                                </div>
                                <input type="text" className="form-input" value={item.question} onChange={(e) => updateFaqItem(index, 'question', e.target.value)} placeholder="Question" />
                                <textarea className="form-input" value={item.answer} onChange={(e) => updateFaqItem(index, 'answer', e.target.value)} placeholder="Answer" rows={2} />
                            </div>
                        ))}
                        <button className="add-btn" onClick={addFaqItem}>+ Add FAQ</button>
                    </div>
                )}

                {/* HowTo-specific fields */}
                {schemaType === 'HowTo' && (
                    <div className="dynamic-section">
                        <h4>📝 Steps</h4>
                        {howToSteps.map((step, index) => (
                            <div key={index} className="dynamic-item">
                                <div className="item-header">
                                    <span>Step {index + 1}</span>
                                    {howToSteps.length > 1 && <button className="remove-btn" onClick={() => removeHowToStep(index)}>✕</button>}
                                </div>
                                <input type="text" className="form-input" value={step.name} onChange={(e) => updateHowToStep(index, 'name', e.target.value)} placeholder="Step name" />
                                <textarea className="form-input" value={step.text} onChange={(e) => updateHowToStep(index, 'text', e.target.value)} placeholder="Step instructions" rows={2} />
                            </div>
                        ))}
                        <button className="add-btn" onClick={addHowToStep}>+ Add Step</button>
                    </div>
                )}

                <div className="code-output">
                    <pre>{`<script type="application/ld+json">\n${generateSchema()}\n</script>`}</pre>
                    <button className="copy-btn" onClick={copyCode}>📋 Copy</button>
                </div>
            </div>
            <style>{`
                .tool-form{max-width:700px;margin:0 auto}
                .form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}
                .form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);margin-bottom:var(--spacing-sm)}
                .dynamic-section{background:var(--bg-secondary);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg)}
                .dynamic-section h4{margin:0 0 var(--spacing-md) 0}
                .dynamic-item{background:white;padding:var(--spacing-md);border-radius:var(--radius);margin-bottom:var(--spacing-md);border-left:3px solid var(--yinmn-blue)}
                .item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-sm);font-weight:600}
                .remove-btn{background:#dc3545;color:white;border:none;width:24px;height:24px;border-radius:50%;cursor:pointer;font-size:12px}
                .add-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-sm) var(--spacing-md);border-radius:var(--radius);cursor:pointer}
                .code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}
                .code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}
                .copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}
                @media(max-width:480px){.form-row{grid-template-columns:1fr}}
            `}</style>
        </ToolLayout>
    );
};

export default SchemaGenerator;

