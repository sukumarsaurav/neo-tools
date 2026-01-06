import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const TimestampConverter = () => {
    const [timestamp, setTimestamp] = useState('');
    const [dateString, setDateString] = useState('');
    const [result, setResult] = useState(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'timestamp-converter').slice(0, 3);

    const now = () => {
        const ts = Math.floor(Date.now() / 1000);
        setTimestamp(ts.toString());
        convert(ts);
    };

    const convert = (ts = null) => {
        const unix = ts || parseInt(timestamp);
        if (isNaN(unix)) { setResult({ error: 'Invalid timestamp' }); return; }
        const date = new Date(unix * 1000);
        setResult({
            timestamp: unix,
            iso: date.toISOString(),
            utc: date.toUTCString(),
            local: date.toLocaleString(),
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        });
    };

    const fromDate = () => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { setResult({ error: 'Invalid date' }); return; }
        const unix = Math.floor(date.getTime() / 1000);
        setTimestamp(unix.toString());
        convert(unix);
    };

    const faqs = [
        { question: 'What is Unix timestamp?', answer: 'Unix timestamp is seconds since January 1, 1970 UTC. It\'s a universal way to represent time in computing.' },
        { question: 'Seconds vs Milliseconds?', answer: 'Unix timestamps are in seconds. JavaScript\'s Date.now() returns milliseconds. Divide by 1000 to convert.' }
    ];

    const seoContent = (<><h2>Unix Timestamp Converter</h2><p>Convert between Unix timestamps and human-readable dates. Get current timestamp or convert any date to Unix time.</p></>);

    return (
        <ToolLayout title="Unix Timestamp Converter" description="Convert Unix timestamps to dates and vice versa. Get current timestamp." keywords={['timestamp converter', 'Unix time', 'epoch converter', 'date to timestamp']} category="developer" categoryName="Developer & Utility" faqs={faqs} relatedTools={relatedTools} seoContent={seoContent}>
            <div className="tool-form">
                <div className="form-group"><label className="form-label">Unix Timestamp</label><div className="input-group"><input type="number" className="form-input" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="1704067200" /><button className="btn btn-secondary" onClick={now}>Now</button><button className="btn btn-primary" onClick={() => convert()}>Convert</button></div></div>
                <div className="divider">or</div>
                <div className="form-group"><label className="form-label">Date/Time String</label><div className="input-group"><input type="datetime-local" className="form-input" value={dateString} onChange={(e) => setDateString(e.target.value)} /><button className="btn btn-primary" onClick={fromDate}>To Timestamp</button></div></div>
                {result && !result.error && (
                    <div className="result-box">
                        <div className="result-row"><span>Timestamp</span><strong>{result.timestamp}</strong></div>
                        <div className="result-row"><span>ISO 8601</span><strong>{result.iso}</strong></div>
                        <div className="result-row"><span>UTC</span><strong>{result.utc}</strong></div>
                        <div className="result-row"><span>Local</span><strong>{result.local}</strong></div>
                    </div>
                )}
                {result?.error && <p className="error">{result.error}</p>}
            </div>
            <style>{`.tool-form{max-width:600px;margin:0 auto}.form-input{flex:1;padding:var(--spacing-sm);border:2px solid var(--platinum);border-radius:var(--radius)}.input-group{display:flex;gap:var(--spacing-sm)}.divider{text-align:center;color:var(--text-muted);margin:var(--spacing-lg) 0}.result-row{display:flex;justify-content:space-between;padding:var(--spacing-sm);background:var(--bg-secondary);margin-bottom:var(--spacing-xs);border-radius:var(--radius)}.result-row span{color:var(--text-muted)}.error{color:var(--error);text-align:center}`}</style>
        </ToolLayout>
    );
};

export default TimestampConverter;
