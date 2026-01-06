import { useState, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

const ScreenResolution = () => {
    const [info, setInfo] = useState(null);
    const relatedTools = toolsData.tools.filter(t => t.category === 'developer' && t.id !== 'screen-resolution').slice(0, 3);

    useEffect(() => {
        const update = () => {
            const dpr = window.devicePixelRatio || 1;
            setInfo({
                screenW: window.screen.width, screenH: window.screen.height,
                viewW: window.innerWidth, viewH: window.innerHeight,
                availW: window.screen.availWidth, availH: window.screen.availHeight,
                colorDepth: window.screen.colorDepth, dpr,
                orientation: window.screen.orientation?.type || 'unknown',
                isMobile: /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
            });
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const copy = (text) => navigator.clipboard.writeText(text);

    const resolutions = [
        { name: 'HD (720p)', w: 1280, h: 720 }, { name: 'Full HD', w: 1920, h: 1080 },
        { name: 'QHD (1440p)', w: 2560, h: 1440 }, { name: '4K UHD', w: 3840, h: 2160 },
        { name: 'MacBook Pro 14"', w: 3024, h: 1964 }, { name: 'iPhone 15 Pro', w: 1179, h: 2556 }
    ];

    const faqs = [
        { question: 'What is device pixel ratio?', answer: 'DPR is the ratio between physical and CSS pixels. DPR of 2 means sharper HiDPI display.' }
    ];

    return (
        <ToolLayout title="Screen Resolution Checker" description="Check your screen resolution and display info."
            keywords={['screen resolution', 'viewport', 'pixel ratio']} category="developer" categoryName="Developer & Utility"
            faqs={faqs} relatedTools={relatedTools} seoContent={<><h2>Screen Resolution</h2><p>Check your display info.</p></>}>
            <div className="tool-form">
                {info && (<>
                    <div className="main-grid">
                        <div className="main-box primary">
                            <div className="value">{info.screenW} × {info.screenH}</div>
                            <div className="label">Screen Resolution</div>
                            <button className="copy-btn" onClick={() => copy(`${info.screenW}×${info.screenH}`)}>📋</button>
                        </div>
                        <div className="main-box">
                            <div className="value">{info.viewW} × {info.viewH}</div>
                            <div className="label">Viewport</div>
                        </div>
                    </div>
                    <div className="info-grid">
                        <div className="info-item"><span>Pixel Ratio</span><strong>{info.dpr}x {info.dpr > 1 ? '(HiDPI)' : ''}</strong></div>
                        <div className="info-item"><span>Color Depth</span><strong>{info.colorDepth}-bit</strong></div>
                        <div className="info-item"><span>Available</span><strong>{info.availW} × {info.availH}</strong></div>
                        <div className="info-item"><span>Device</span><strong>{info.isMobile ? 'Mobile' : 'Desktop'}</strong></div>
                    </div>
                    <h3>Common Resolutions</h3>
                    <div className="res-list">
                        {resolutions.map((r, i) => (
                            <div key={i} className={`res-item ${r.w === info.screenW && r.h === info.screenH ? 'match' : ''}`}>
                                <span>{r.name}</span><span className="mono">{r.w} × {r.h}</span>
                            </div>
                        ))}
                    </div>
                </>)}
            </div>
            <style>{`
                .tool-form{max-width:700px;margin:0 auto}
                .main-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md);margin-bottom:var(--spacing-lg)}
                .main-box{padding:var(--spacing-xl);text-align:center;border-radius:var(--radius);background:var(--ghost-white);position:relative}
                .main-box.primary{background:linear-gradient(135deg,var(--yinmn-blue),var(--oxford-blue));color:white}
                .main-box .value{font-size:var(--text-2xl);font-weight:700}
                .main-box .label{opacity:0.8;font-size:var(--text-sm)}
                .copy-btn{position:absolute;top:8px;right:8px;background:rgba(255,255,255,.2);border:none;color:white;padding:4px 8px;border-radius:4px;cursor:pointer}
                .info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--spacing-sm);margin-bottom:var(--spacing-lg)}
                .info-item{display:flex;justify-content:space-between;padding:var(--spacing-sm) var(--spacing-md);background:var(--ghost-white);border-radius:var(--radius)}
                .info-item span{color:var(--dim-gray)}
                .res-list{display:flex;flex-direction:column;gap:4px}
                .res-item{display:flex;justify-content:space-between;padding:var(--spacing-sm) var(--spacing-md);background:var(--ghost-white);border-radius:var(--radius)}
                .res-item.match{background:#d1fae5;border-left:4px solid #10b981}
                .mono{font-family:var(--font-mono);color:var(--dim-gray)}
                h3{margin:var(--spacing-lg) 0 var(--spacing-md)}
                @media(max-width:500px){.main-grid{grid-template-columns:1fr}.info-grid{grid-template-columns:1fr}}
            `}</style>
        </ToolLayout>
    );
};

export default ScreenResolution;
