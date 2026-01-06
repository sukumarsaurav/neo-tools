import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const UuidGenerator = () => {
    const [uuids, setUuids] = useState([]);
    const [count, setCount] = useState(5);
    const [version, setVersion] = useState('v4');

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'uuid-generator').slice(0, 3);

    const generateUUID = () => {
        // Simple v4 UUID implementation
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    const generate = () => {
        const newUuids = [];
        for (let i = 0; i < count; i++) newUuids.push(generateUUID());
        setUuids(newUuids);
    };

    const copyOne = (uuid) => { navigator.clipboard.writeText(uuid); alert('Copied!'); };
    const copyAll = () => { navigator.clipboard.writeText(uuids.join('\n')); alert('All copied!'); };

    const faqs = [
        { question: 'What is a UUID?', answer: 'UUID (Universally Unique Identifier) is a 128-bit identifier that\'s practically unique worldwide. Used for database keys, session IDs, and more.' },
        { question: 'Is UUID truly unique?', answer: 'UUIDv4 has 122 random bits. The probability of collision is astronomically low—you\'d need trillions of UUIDs before likely seeing a duplicate.' }
    ];

    const seoContent = (<><h2>UUID Generator</h2><p>Generate random UUIDs (v4) for databases, session tokens, unique identifiers. Bulk generate multiple UUIDs at once.</p></>);

    return (
        <ToolLayout title="UUID Generator" description="Generate random UUID/GUID strings. Create unique identifiers for databases and apps." keywords={['UUID generator', 'GUID generator', 'random UUID', 'unique identifier']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-row">
                    <div className="form-group"><label className="form-label">Count</label><input type="number" className="form-input" value={count} onChange={(e) => setCount(Math.min(50, Math.max(1, e.target.value)))} min="1" max="50" /></div>
                    <div className="form-group"><label className="form-label">Version</label><select className="form-select" value={version} onChange={(e) => setVersion(e.target.value)}><option value="v4">Version 4 (Random)</option></select></div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={generate}>Generate UUIDs</button>
                {uuids.length > 0 && (
                    <div className="result-box">
                        <div className="uuid-list">{uuids.map((uuid, i) => (<div key={i} className="uuid-item"><code>{uuid}</code><button className="copy-btn" onClick={() => copyOne(uuid)}>📋</button></div>))}</div>
                        <button className="btn btn-secondary" onClick={copyAll}>Copy All</button>
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:600px;margin:0 auto}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}.form-input{width:100%;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.uuid-list{margin-bottom:var(--spacing-md)}.uuid-item{display:flex;align-items:center;gap:var(--spacing-sm);padding:var(--spacing-sm);background:var(--bg-secondary);border-radius:var(--radius);margin-bottom:var(--spacing-xs)}.uuid-item code{flex:1;font-size:var(--text-sm)}.copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default UuidGenerator;
