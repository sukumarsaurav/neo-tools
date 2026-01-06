import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const HashGenerator = () => {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'hash-generator').slice(0, 3);

    const generate = async () => {
        if (!input) { alert('Enter text to hash'); return; }
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const sha256 = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        const hashBuffer1 = await crypto.subtle.digest('SHA-1', data);
        const sha1 = Array.from(new Uint8Array(hashBuffer1)).map(b => b.toString(16).padStart(2, '0')).join('');

        const hashBuffer512 = await crypto.subtle.digest('SHA-512', data);
        const sha512 = Array.from(new Uint8Array(hashBuffer512)).map(b => b.toString(16).padStart(2, '0')).join('');

        setHashes({ sha1, sha256, sha512 });
    };

    const copy = (hash) => { navigator.clipboard.writeText(hash); alert('Copied!'); };

    const faqs = [
        { question: 'What is a hash?', answer: 'A hash is a fixed-size string generated from input data. Same input always produces same hash. Used for checksums, passwords, and data integrity.' },
        { question: 'Which hash algorithm to use?', answer: 'SHA-256 is standard for most uses. SHA-1 is faster but less secure. MD5 is deprecated for security purposes.' }
    ];

    const seoContent = (<><h2>Hash Generator</h2><p>Generate SHA-1, SHA-256, and SHA-512 hashes from any text. Useful for checksums, data integrity, and security applications.</p></>);

    return (
        <ToolLayout title="Hash Generator" description="Generate SHA-1, SHA-256, SHA-512 hashes from text. Create secure hash values." keywords={['hash generator', 'SHA256', 'SHA1 generator', 'hash calculator']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Input Text</label><textarea className="form-input" value={input} onChange={(e) => setInput(e.target.value)} rows={4} placeholder="Enter text to hash..." /></div>
                <button className="btn btn-primary btn-lg" onClick={generate}>Generate Hashes</button>
                {hashes && (
                    <div className="result-box">
                        {Object.entries(hashes).map(([algo, hash]) => (
                            <div key={algo} className="hash-item"><label>{algo.toUpperCase()}</label><div className="hash-value"><code>{hash}</code><button className="copy-btn" onClick={() => copy(hash)}>📋</button></div></div>
                        ))}
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.form-input{width:100%;padding:var(--spacing-md);border:2px solid var(--platinum);border-radius:var(--radius)}.hash-item{margin-bottom:var(--spacing-md)}.hash-item label{display:block;font-weight:600;margin-bottom:var(--spacing-xs)}.hash-value{display:flex;gap:var(--spacing-sm);align-items:center}.hash-value code{flex:1;font-size:var(--text-xs);background:var(--bg-secondary);padding:var(--spacing-sm);border-radius:var(--radius);word-break:break-all}.copy-btn{background:var(--yinmn-blue);color:white;border:none;padding:var(--spacing-xs);border-radius:var(--radius);cursor:pointer}`}</style>
        </ToolLayout>
    );
};

export default HashGenerator;
