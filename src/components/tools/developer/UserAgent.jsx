import { useState, useEffect, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const UserAgent = () => {
    const [ua, setUa] = useState('');
    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'user-agent').slice(0, 3);

    useEffect(() => { setUa(navigator.userAgent); }, []);

    const parsed = useMemo(() => {
        if (!ua) return null;
        const getBrowser = () => {
            if (ua.includes('Firefox')) return { name: 'Firefox', icon: '🦊' };
            if (ua.includes('Edg')) return { name: 'Edge', icon: '🌐' };
            if (ua.includes('Chrome')) return { name: 'Chrome', icon: '🌀' };
            if (ua.includes('Safari')) return { name: 'Safari', icon: '🧭' };
            return { name: 'Unknown', icon: '❓' };
        };
        const getOS = () => {
            if (ua.includes('Windows NT 10')) return 'Windows 10/11';
            if (ua.includes('Windows')) return 'Windows';
            if (ua.includes('Mac OS X')) return 'macOS';
            if (ua.includes('Android')) return 'Android';
            if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
            if (ua.includes('Linux')) return 'Linux';
            return 'Unknown';
        };
        const getDevice = () => {
            if (/iPhone|Android.*Mobile/i.test(ua)) return 'Mobile';
            if (/iPad|Android(?!.*Mobile)/i.test(ua)) return 'Tablet';
            return 'Desktop';
        };
        const browser = getBrowser();
        const vMatch = ua.match(new RegExp(`${browser.name === 'Edge' ? 'Edg' : browser.name}/([\\d.]+)`));
        return {
            browser, os: getOS(), device: getDevice(), version: vMatch?.[1] || 'Unknown',
            mobile: /Mobile|Android|iPhone/i.test(ua), touch: 'ontouchstart' in window
        };
    }, [ua]);

    const copy = () => { navigator.clipboard.writeText(ua); };

    const faqs = [
        { question: 'What is a user agent?', answer: 'A user agent is a string that identifies your browser and OS to websites.' }
    ];

    return (
        <ToolLayout title="What Is My User Agent" description="View and parse your browser's user agent string."
            keywords={['user agent', 'browser info', 'browser detection']} category="developer" categoryName="Developer & Utility"
            faqs={faqs} relatedTools={relatedTools} seoContent={<><h2>User Agent Checker</h2><p>View your browser info.</p></>}>
            <div className="tool-form">
                <div className="ua-box">
                    <div className="ua-label">Your User Agent</div>
                    <div className="ua-string">{ua}</div>
                    <button className="copy-btn" onClick={copy}>📋 Copy</button>
                </div>
                {parsed && (
                    <div className="parsed-grid">
                        <div className="parsed-card main">
                            <span className="icon">{parsed.browser.icon}</span>
                            <div><div className="value">{parsed.browser.name}</div><div className="label">Browser</div></div>
                            <div className="version">v{parsed.version}</div>
                        </div>
                        <div className="parsed-card"><span className="icon">💻</span><div><div className="value">{parsed.os}</div><div className="label">Operating System</div></div></div>
                        <div className="parsed-card"><span className="icon">{parsed.device === 'Mobile' ? '📱' : parsed.device === 'Tablet' ? '📱' : '🖥️'}</span><div><div className="value">{parsed.device}</div><div className="label">Device Type</div></div></div>
                        <div className="parsed-card"><span className="icon">👆</span><div><div className="value">{parsed.touch ? 'Yes' : 'No'}</div><div className="label">Touch Support</div></div></div>
                    </div>
                )}
                <div className="info-section">
                    <h3>Additional Info</h3>
                    <div className="info-list">
                        <div className="info-row"><span>Language</span><strong>{navigator.language}</strong></div>
                        <div className="info-row"><span>Cookies Enabled</span><strong>{navigator.cookieEnabled ? 'Yes' : 'No'}</strong></div>
                        <div className="info-row"><span>Do Not Track</span><strong>{navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled'}</strong></div>
                        <div className="info-row"><span>Platform</span><strong>{navigator.platform}</strong></div>
                    </div>
                </div>
            </div>
            <style>{`
                .tool-form{max-width:700px;margin:0 auto}
                .ua-box{background:var(--ghost-white);padding:var(--spacing-lg);border-radius:var(--radius);margin-bottom:var(--spacing-lg);position:relative}
                .ua-label{font-size:var(--text-sm);color:var(--dim-gray);margin-bottom:var(--spacing-sm)}
                .ua-string{font-family:var(--font-mono);font-size:var(--text-sm);word-break:break-all;line-height:1.6}
                .copy-btn{position:absolute;top:var(--spacing-md);right:var(--spacing-md);background:var(--yinmn-blue);color:white;border:none;padding:6px 12px;border-radius:var(--radius);cursor:pointer;font-size:var(--text-sm)}
                .parsed-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}
                .parsed-card{display:flex;align-items:center;gap:var(--spacing-md);padding:var(--spacing-md);background:var(--ghost-white);border-radius:var(--radius)}
                .parsed-card.main{grid-column:span 2;background:linear-gradient(135deg,var(--yinmn-blue),var(--oxford-blue));color:white}
                .parsed-card .icon{font-size:var(--text-2xl)}
                .parsed-card .value{font-weight:600}
                .parsed-card .label{font-size:var(--text-xs);opacity:0.7}
                .parsed-card .version{margin-left:auto;opacity:0.8}
                .info-section h3{margin-bottom:var(--spacing-md)}
                .info-list{display:flex;flex-direction:column;gap:4px}
                .info-row{display:flex;justify-content:space-between;padding:var(--spacing-sm) var(--spacing-md);background:var(--ghost-white);border-radius:var(--radius)}
                .info-row span{color:var(--dim-gray)}
                @media(max-width:500px){.parsed-grid{grid-template-columns:1fr}.parsed-card.main{grid-column:span 1}}
            `}</style>
        </ToolLayout>
    );
};

export default UserAgent;
