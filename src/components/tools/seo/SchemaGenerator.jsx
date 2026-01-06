import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const SchemaGenerator = () => {
    const [schemaType, setSchemaType] = useState('Organization');
    const [data, setData] = useState({ name: '', url: '', logo: '', description: '', email: '', phone: '', address: '' });

    const relatedTools = toolsData.tools.filter(t => t.category === 'seo' && t.id !== 'schema-generator').slice(0, 3);

    const generateSchema = () => {
        let schema = { '@context': 'https://schema.org' };
        if (schemaType === 'Organization') {
            schema = { ...schema, '@type': 'Organization', name: data.name, url: data.url, logo: data.logo, description: data.description, email: data.email, telephone: data.phone };
        } else if (schemaType === 'LocalBusiness') {
            schema = { ...schema, '@type': 'LocalBusiness', name: data.name, url: data.url, telephone: data.phone, address: { '@type': 'PostalAddress', streetAddress: data.address } };
        } else if (schemaType === 'Article') {
            schema = { ...schema, '@type': 'Article', headline: data.name, description: data.description, author: { '@type': 'Person', name: data.email } };
        } else if (schemaType === 'Product') {
            schema = { ...schema, '@type': 'Product', name: data.name, description: data.description, image: data.logo };
        }
        return JSON.stringify(schema, null, 2);
    };

    const copyCode = () => { navigator.clipboard.writeText(`<script type="application/ld+json">\n${generateSchema()}\n</script>`); alert('Copied!'); };

    const faqs = [
        { question: 'What is Schema markup?', answer: 'Schema markup is structured data that helps search engines understand your content and display rich snippets like star ratings, prices, and FAQs in search results.' },
        { question: 'Does Schema improve SEO?', answer: 'Yes! Schema markup helps search engines understand your content better and can result in enhanced search listings (rich snippets) which improve click-through rates.' }
    ];

    const seoContent = (<><h2>Schema Markup Generator</h2><p>Generate JSON-LD structured data for better search engine visibility. Schema markup helps Google understand your content and display rich results.</p></>);

    return (
        <ToolLayout title="Schema Markup Generator" description="Generate JSON-LD structured data for Organizations, Products, Articles, and more." keywords={['schema generator', 'JSON-LD generator', 'structured data', 'rich snippets', 'schema markup']} category="seo" categoryName="SEO & Webmaster" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Schema Type</label><select className="form-select" value={schemaType} onChange={(e) => setSchemaType(e.target.value)}><option value="Organization">Organization</option><option value="LocalBusiness">Local Business</option><option value="Article">Article</option><option value="Product">Product</option></select></div>
                <div className="form-group"><label className="form-label">Name</label><input type="text" className="form-input" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Business/Article/Product name" /></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">URL</label><input type="url" className="form-input" value={data.url} onChange={(e) => setData({ ...data, url: e.target.value })} placeholder="https://example.com" /></div>
                    <div className="form-group"><label className="form-label">Logo/Image URL</label><input type="url" className="form-input" value={data.logo} onChange={(e) => setData({ ...data, logo: e.target.value })} placeholder="https://example.com/logo.png" /></div>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Brief description" rows={2} /></div>
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Email/Author</label><input type="text" className="form-input" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="contact@example.com" /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input type="text" className="form-input" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+1-234-567-8900" /></div>
                </div>
                <div className="code-output"><pre>{`<script type="application/ld+json">\n${generateSchema()}\n</script>`}</pre><button className="copy-btn" onClick={copyCode}>📋 Copy</button></div>
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.code-output{background:var(--bg-dark);color:#f0f0f0;padding:var(--spacing-lg);border-radius:var(--radius);position:relative;margin-top:var(--spacing-lg)}.code-output pre{font-family:var(--font-mono);font-size:var(--text-sm);white-space:pre-wrap;margin:0}.copy-btn{position:absolute;top:var(--spacing-sm);right:var(--spacing-sm);background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs) var(--spacing-sm);border-radius:var(--radius);cursor:pointer}@media(max-width:480px){.form-row{grid-template-columns:1fr}}`}</style>
        </ToolLayout>
    );
};

export default SchemaGenerator;
