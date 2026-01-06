import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const RegexTester = () => {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('g');
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'regex-tester').slice(0, 3);

    const test = () => {
        try {
            const regex = new RegExp(pattern, flags);
            const matches = [...text.matchAll(regex)];
            setResult({ valid: true, matches: matches.map(m => ({ match: m[0], index: m.index, groups: m.slice(1) })), total: matches.length });
        } catch (e) { setResult({ valid: false, error: e.message }); }
    };

    const faqs = [
        { question: 'What are regex flags?', answer: 'g = global (all matches), i = case-insensitive, m = multiline, s = dot matches newline, u = unicode.' },
        { question: 'Common regex patterns?', answer: 'Email: [\\w.-]+@[\\w.-]+\\.\\w+, Phone: \\d{10}, URL: https?://[\\w.-]+, Date: \\d{4}-\\d{2}-\\d{2}' }
    ];

    const seoContent = (<><h2>RegEx Tester</h2><p>Test regular expressions in real-time. See all matches with their positions and capture groups. Debug and build regex patterns quickly.</p></>);

    return (
        <ToolLayout title="RegEx Tester" description="Test and debug regular expressions. See matches in real-time with positions." keywords={['regex tester', 'regular expression', 'regex debugger', 'pattern matcher']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="regex-input"><span>/</span><input type="text" className="form-input" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="your regex pattern" /><span>/</span><input type="text" className="flags-input" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="flags" maxLength="5" /></div>
                <div className="form-group"><label className="form-label">Test String</label><textarea className="form-input" value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Enter text to test against..." /></div>
                <button className="btn btn-primary btn-lg" onClick={test}>Test</button>
                {result && (
                    <div className={`result-box ${result.valid ? '' : 'error'}`}>
                        {!result.valid ? <p className="error-msg">❌ {result.error}</p> : (
                            <>
                                <p className="match-count">✅ {result.total} match(es) found</p>
                                {result.matches.length > 0 && (
                                    <div className="matches">{result.matches.slice(0, 20).map((m, i) => (<div key={i} className="match"><span className="index">@{m.index}</span><code>{m.match}</code>{m.groups.length > 0 && <span className="groups">Groups: {m.groups.join(', ')}</span>}</div>))}</div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <style>{`.tool-form{max-width:700px;margin:0 auto}.regex-input{display:flex;align-items:center;gap:var(--spacing-xs);margin-bottom:var(--spacing-md);font-family:var(--font-mono);font-size:var(--text-lg)}.regex-input .form-input{flex:1}.flags-input{width:60px;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius);font-family:var(--font-mono)}.form-input{width:100%;padding:var(--spacing-md);border:2px solid var(--platinum);border-radius:var(--radius)}.result-box.error{border-left:4px solid var(--error)}.error-msg{color:var(--error)}.match-count{color:var(--success);font-weight:500;margin-bottom:var(--spacing-md)}.matches{max-height:300px;overflow-y:auto}.match{display:flex;gap:var(--spacing-md);padding:var(--spacing-sm);background:var(--bg-secondary);border-radius:var(--radius);margin-bottom:var(--spacing-xs);font-size:var(--text-sm)}.match .index{color:var(--text-muted)}.match code{background:rgba(72,86,150,0.1);padding:2px 6px;border-radius:4px}.match .groups{color:var(--text-muted);font-size:var(--text-xs)}`}</style>
        </ToolLayout>
    );
};

export default RegexTester;
