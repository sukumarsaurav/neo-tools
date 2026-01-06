import { useState, useCallback, useMemo } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';

// SVG Generation Algorithms
const generateBlob = (complexity, smoothness, seed) => {
    const points = [];
    const numPoints = complexity;
    const angleStep = (Math.PI * 2) / numPoints;
    const random = seededRandom(seed);

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep;
        const radius = 40 + random() * 20 * (smoothness / 100);
        points.push({
            x: 50 + Math.cos(angle) * radius,
            y: 50 + Math.sin(angle) * radius
        });
    }

    return pointsToSmoothPath(points, true);
};

const generateWave = (layers, amplitude, frequency, height = 100) => {
    const paths = [];
    for (let l = 0; l < layers; l++) {
        const y = height - (l * (height / (layers + 1)));
        const amp = amplitude * (1 - l * 0.15);
        let path = `M0,${y}`;
        for (let x = 0; x <= 100; x += 2) {
            const wave = Math.sin((x / 100) * Math.PI * frequency + l) * amp;
            path += ` L${x},${y - wave}`;
        }
        path += ` L100,${height} L0,${height} Z`;
        paths.push(path);
    }
    return paths;
};

const generateCircles = (count, blur, seed) => {
    const circles = [];
    const random = seededRandom(seed);
    for (let i = 0; i < count; i++) {
        circles.push({
            cx: 20 + random() * 60,
            cy: 20 + random() * 60,
            r: 15 + random() * 25,
            opacity: 0.3 + random() * 0.5
        });
    }
    return circles;
};

const generateScatter = (count, sizeVariance, seed) => {
    const blobs = [];
    const random = seededRandom(seed);
    for (let i = 0; i < count; i++) {
        const size = 5 + random() * 15 * (sizeVariance / 100);
        blobs.push({
            x: random() * 90 + 5,
            y: random() * 90 + 5,
            path: generateBlob(5 + Math.floor(random() * 4), 70, seed + i),
            scale: size / 50,
            opacity: 0.4 + random() * 0.4
        });
    }
    return blobs;
};

const generatePeaks = (layers, peakHeight, jaggedness, seed) => {
    const paths = [];
    const random = seededRandom(seed);
    for (let l = 0; l < layers; l++) {
        const baseY = 100 - (l + 1) * (peakHeight / layers);
        let path = `M0,100 L0,${baseY + random() * 10}`;
        const segments = 8 + l * 2;
        for (let i = 1; i <= segments; i++) {
            const x = (i / segments) * 100;
            const y = baseY + (random() - 0.5) * jaggedness * 0.5;
            path += ` L${x},${y}`;
        }
        path += ` L100,100 Z`;
        paths.push(path);
    }
    return paths;
};

const generateLowPoly = (cellSize, variance, seed) => {
    const triangles = [];
    const random = seededRandom(seed);
    const cols = Math.ceil(100 / cellSize) + 1;
    const rows = Math.ceil(100 / cellSize) + 1;
    const points = [];

    for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
            const vx = (variance / 100) * cellSize * (random() - 0.5);
            const vy = (variance / 100) * cellSize * (random() - 0.5);
            points[r][c] = { x: c * cellSize + vx, y: r * cellSize + vy };
        }
    }

    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
            triangles.push([points[r][c], points[r][c + 1], points[r + 1][c]]);
            triangles.push([points[r][c + 1], points[r + 1][c + 1], points[r + 1][c]]);
        }
    }
    return triangles;
};

// Utility functions
function seededRandom(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function pointsToSmoothPath(points, closed = false) {
    if (points.length < 2) return '';
    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return closed ? path + ' Z' : path;
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const GENERATORS = ['blob', 'wave', 'circles', 'scatter', 'scene', 'layeredWaves', 'lowPoly', 'peaks'];
const GENERATOR_LABELS = {
    blob: '🫧 Blob', wave: '🌊 Wave', circles: '⭕ Circles', scatter: '✨ Scatter',
    scene: '🎭 Scene', layeredWaves: '📊 Layers', lowPoly: '📐 Low Poly', peaks: '⛰️ Peaks'
};

const PRESETS = [
    { name: 'Sunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3'] },
    { name: 'Ocean', colors: ['#0093e9', '#80d0c7', '#1a535c'] },
    { name: 'Pastel', colors: ['#ffd6e0', '#c9f0ff', '#d4edda'] },
    { name: 'Night', colors: ['#0f0f23', '#1a1a3e', '#2d2d5a'] },
    { name: 'Forest', colors: ['#1a472a', '#2d5a27', '#5a8f29'] },
    { name: 'Fire', colors: ['#ff4500', '#ff6347', '#ffa500'] }
];

const SvgBackgroundGenerator = () => {
    const [activeGen, setActiveGen] = useState('blob');
    const [colors, setColors] = useState(['#667eea', '#764ba2', '#f093fb']);
    const [seed, setSeed] = useState(Math.floor(Math.random() * 10000));
    const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

    // Blob controls
    const [blobComplexity, setBlobComplexity] = useState(6);
    const [blobSmoothness, setBlobSmoothness] = useState(70);

    // Wave controls
    const [waveLayers, setWaveLayers] = useState(3);
    const [waveAmplitude, setWaveAmplitude] = useState(15);
    const [waveFrequency, setWaveFrequency] = useState(2);

    // Circle controls
    const [circleCount, setCircleCount] = useState(5);
    const [circleBlur, setCircleBlur] = useState(40);

    // Scatter controls
    const [scatterCount, setScatterCount] = useState(8);
    const [scatterVariance, setScatterVariance] = useState(50);

    // Peaks controls
    const [peakLayers, setPeakLayers] = useState(5);
    const [peakHeight, setPeakHeight] = useState(60);
    const [peakJaggedness, setPeakJaggedness] = useState(40);

    // Low poly controls
    const [polyCellSize, setPolyCellSize] = useState(15);
    const [polyVariance, setPolyVariance] = useState(40);

    const relatedTools = toolsData.tools.filter(t => t.category === 'image').slice(0, 3);

    const randomize = useCallback(() => setSeed(Math.floor(Math.random() * 10000)), []);

    const addColor = () => colors.length < 5 && setColors([...colors, '#ffffff']);
    const removeColor = (i) => colors.length > 2 && setColors(colors.filter((_, idx) => idx !== i));
    const updateColor = (i, c) => { const n = [...colors]; n[i] = c; setColors(n); };

    // Generate SVG content based on active generator
    const svgContent = useMemo(() => {
        const defs = `<defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">${colors.map((c, i) => `<stop offset="${(i / (colors.length - 1)) * 100}%" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;

        switch (activeGen) {
            case 'blob': {
                const path = generateBlob(blobComplexity, blobSmoothness, seed);
                return `${defs}<path d="${path}" fill="url(#grad)"/>`;
            }
            case 'wave': {
                const paths = generateWave(waveLayers, waveAmplitude, waveFrequency);
                return paths.map((p, i) => `<path d="${p}" fill="${colors[i % colors.length]}" opacity="${0.5 + i * 0.15}"/>`).join('');
            }
            case 'circles': {
                const circles = generateCircles(circleCount, circleBlur, seed);
                const blur = `<defs><filter id="blur"><feGaussianBlur stdDeviation="${circleBlur / 5}"/></filter></defs>`;
                return blur + circles.map((c, i) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${colors[i % colors.length]}" opacity="${c.opacity}" filter="url(#blur)"/>`).join('');
            }
            case 'scatter': {
                const blobs = generateScatter(scatterCount, scatterVariance, seed);
                return blobs.map((b, i) => `<g transform="translate(${b.x},${b.y}) scale(${b.scale})"><path d="${b.path}" fill="${colors[i % colors.length]}" opacity="${b.opacity}"/></g>`).join('');
            }
            case 'scene': {
                const layers = [0.3, 0.5, 0.7].map((s, i) => {
                    const path = generateBlob(6 + i, 60, seed + i * 100);
                    return `<g transform="translate(${20 + i * 15},${60 - i * 10}) scale(${s})"><path d="${path}" fill="${colors[i % colors.length]}" opacity="${0.6 + i * 0.15}"/></g>`;
                });
                return layers.join('');
            }
            case 'layeredWaves': {
                const paths = generateWave(4, 20, 3, 100);
                return paths.map((p, i) => `<path d="${p}" fill="${colors[i % colors.length]}"/>`).join('');
            }
            case 'lowPoly': {
                const triangles = generateLowPoly(polyCellSize, polyVariance, seed);
                const random = seededRandom(seed);
                return triangles.map((t, i) => {
                    const baseColor = colors[Math.floor(random() * colors.length)];
                    const shade = adjustColor(baseColor, (random() - 0.5) * 50);
                    return `<polygon points="${t.map(p => `${p.x},${p.y}`).join(' ')}" fill="${shade}"/>`;
                }).join('');
            }
            case 'peaks': {
                const paths = generatePeaks(peakLayers, peakHeight, peakJaggedness, seed);
                return paths.map((p, i) => `<path d="${p}" fill="${colors[i % colors.length]}"/>`).join('');
            }
            default: return '';
        }
    }, [activeGen, colors, seed, blobComplexity, blobSmoothness, waveLayers, waveAmplitude, waveFrequency, circleCount, circleBlur, scatterCount, scatterVariance, peakLayers, peakHeight, peakJaggedness, polyCellSize, polyVariance]);

    const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">${svgContent}</svg>`;

    const copySvg = () => { navigator.clipboard.writeText(fullSvg); };
    const copyCss = () => {
        const encoded = `data:image/svg+xml,${encodeURIComponent(fullSvg)}`;
        navigator.clipboard.writeText(`background-image: url("${encoded}");`);
    };
    const downloadSvg = () => {
        const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${activeGen}-bg.svg`; a.click();
        URL.revokeObjectURL(url);
    };
    const downloadPng = () => {
        const canvas = document.createElement('canvas');
        canvas.width = dimensions.width; canvas.height = dimensions.height;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
            const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = `${activeGen}-bg.png`; a.click();
        };
        img.src = `data:image/svg+xml,${encodeURIComponent(fullSvg)}`;
    };

    const renderControls = () => {
        switch (activeGen) {
            case 'blob': return (<>
                <div className="ctrl"><label>Complexity: {blobComplexity}</label><input type="range" min="3" max="12" value={blobComplexity} onChange={e => setBlobComplexity(+e.target.value)} /></div>
                <div className="ctrl"><label>Smoothness: {blobSmoothness}%</label><input type="range" min="20" max="100" value={blobSmoothness} onChange={e => setBlobSmoothness(+e.target.value)} /></div>
            </>);
            case 'wave': return (<>
                <div className="ctrl"><label>Layers: {waveLayers}</label><input type="range" min="1" max="5" value={waveLayers} onChange={e => setWaveLayers(+e.target.value)} /></div>
                <div className="ctrl"><label>Amplitude: {waveAmplitude}</label><input type="range" min="5" max="40" value={waveAmplitude} onChange={e => setWaveAmplitude(+e.target.value)} /></div>
                <div className="ctrl"><label>Frequency: {waveFrequency}</label><input type="range" min="1" max="5" value={waveFrequency} onChange={e => setWaveFrequency(+e.target.value)} /></div>
            </>);
            case 'circles': return (<>
                <div className="ctrl"><label>Count: {circleCount}</label><input type="range" min="2" max="10" value={circleCount} onChange={e => setCircleCount(+e.target.value)} /></div>
                <div className="ctrl"><label>Blur: {circleBlur}%</label><input type="range" min="0" max="100" value={circleBlur} onChange={e => setCircleBlur(+e.target.value)} /></div>
            </>);
            case 'scatter': return (<>
                <div className="ctrl"><label>Count: {scatterCount}</label><input type="range" min="3" max="20" value={scatterCount} onChange={e => setScatterCount(+e.target.value)} /></div>
                <div className="ctrl"><label>Size Variance: {scatterVariance}%</label><input type="range" min="10" max="100" value={scatterVariance} onChange={e => setScatterVariance(+e.target.value)} /></div>
            </>);
            case 'peaks': return (<>
                <div className="ctrl"><label>Layers: {peakLayers}</label><input type="range" min="3" max="8" value={peakLayers} onChange={e => setPeakLayers(+e.target.value)} /></div>
                <div className="ctrl"><label>Height: {peakHeight}%</label><input type="range" min="30" max="90" value={peakHeight} onChange={e => setPeakHeight(+e.target.value)} /></div>
                <div className="ctrl"><label>Jaggedness: {peakJaggedness}%</label><input type="range" min="10" max="80" value={peakJaggedness} onChange={e => setPeakJaggedness(+e.target.value)} /></div>
            </>);
            case 'lowPoly': return (<>
                <div className="ctrl"><label>Cell Size: {polyCellSize}</label><input type="range" min="8" max="30" value={polyCellSize} onChange={e => setPolyCellSize(+e.target.value)} /></div>
                <div className="ctrl"><label>Variance: {polyVariance}%</label><input type="range" min="0" max="80" value={polyVariance} onChange={e => setPolyVariance(+e.target.value)} /></div>
            </>);
            default: return <p className="hint">Adjust colors and randomize for variations</p>;
        }
    };

    const faqs = [
        { question: 'What formats can I export?', answer: 'SVG (scalable vector), PNG (raster at custom dimensions), or copy the code directly for use in CSS or HTML.' },
        { question: 'Are these backgrounds free to use?', answer: 'Yes! All generated backgrounds are royalty-free for personal and commercial use.' }
    ];

    return (
        <ToolLayout title="SVG Background Generator" description="Create beautiful SVG backgrounds with blobs, waves, gradients, and geometric patterns."
            keywords={['SVG background', 'blob generator', 'wave generator', 'background maker']} category="image" categoryName="Image & Design"
            faqs={faqs} relatedTools={relatedTools} seoContent={<><h2>SVG Background Generator</h2><p>Create stunning backgrounds for websites and apps.</p></>}>
            <div className="svg-gen">
                <div className="tabs">
                    {GENERATORS.map(g => (
                        <button key={g} className={`tab ${activeGen === g ? 'active' : ''}`} onClick={() => setActiveGen(g)}>
                            {GENERATOR_LABELS[g]}
                        </button>
                    ))}
                </div>

                <div className="preview" dangerouslySetInnerHTML={{ __html: fullSvg }} />

                <div className="controls-grid">
                    <div className="panel">
                        <h4>🎨 Colors</h4>
                        <div className="color-row">
                            {colors.map((c, i) => (
                                <div key={i} className="color-item">
                                    <input type="color" value={c} onChange={e => updateColor(i, e.target.value)} />
                                    {colors.length > 2 && <button className="x-btn" onClick={() => removeColor(i)}>×</button>}
                                </div>
                            ))}
                            {colors.length < 5 && <button className="add-btn" onClick={addColor}>+</button>}
                        </div>
                        <div className="presets">
                            {PRESETS.map(p => (
                                <button key={p.name} className="preset" style={{ background: `linear-gradient(90deg, ${p.colors.join(',')})` }}
                                    onClick={() => setColors(p.colors)} title={p.name} />
                            ))}
                        </div>
                    </div>

                    <div className="panel">
                        <h4>⚙️ Controls</h4>
                        {renderControls()}
                        <button className="rand-btn" onClick={randomize}>🎲 Randomize</button>
                    </div>
                </div>

                <div className="export-row">
                    <div className="dims">
                        <input type="number" value={dimensions.width} onChange={e => setDimensions({ ...dimensions, width: +e.target.value })} /> ×
                        <input type="number" value={dimensions.height} onChange={e => setDimensions({ ...dimensions, height: +e.target.value })} /> px
                    </div>
                    <div className="export-btns">
                        <button onClick={downloadSvg}>⬇️ SVG</button>
                        <button onClick={downloadPng}>⬇️ PNG</button>
                        <button onClick={copySvg}>📋 SVG Code</button>
                        <button onClick={copyCss}>📋 CSS</button>
                    </div>
                </div>
            </div>

            <style>{`
                .svg-gen{max-width:900px;margin:0 auto}
                .tabs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:16px;background:var(--ghost-white);padding:8px;border-radius:var(--radius)}
                .tab{flex:1;min-width:90px;padding:8px 4px;border:2px solid transparent;background:transparent;border-radius:var(--radius);cursor:pointer;font-size:13px;font-weight:500;transition:all .2s}
                .tab:hover{background:white}
                .tab.active{background:white;border-color:var(--yinmn-blue);color:var(--yinmn-blue)}
                .preview{height:280px;border-radius:var(--radius-lg);overflow:hidden;margin-bottom:20px;box-shadow:0 4px 20px rgba(0,0,0,.1)}
                .preview svg{width:100%;height:100%}
                .controls-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
                @media(max-width:600px){.controls-grid{grid-template-columns:1fr}}
                .panel{background:var(--ghost-white);padding:16px;border-radius:var(--radius)}
                .panel h4{margin:0 0 12px;font-size:14px}
                .color-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
                .color-item{position:relative}
                .color-item input[type="color"]{width:40px;height:40px;border:none;border-radius:8px;cursor:pointer}
                .x-btn{position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:#ef4444;color:white;border:none;border-radius:50%;cursor:pointer;font-size:12px}
                .add-btn{width:40px;height:40px;border:2px dashed var(--platinum);background:transparent;border-radius:8px;cursor:pointer;font-size:20px;color:var(--dim-gray)}
                .presets{display:flex;gap:6px;flex-wrap:wrap}
                .preset{width:36px;height:20px;border:2px solid transparent;border-radius:4px;cursor:pointer;transition:all .2s}
                .preset:hover{transform:scale(1.1);border-color:var(--jet)}
                .ctrl{margin-bottom:12px}
                .ctrl label{display:block;font-size:12px;color:var(--dim-gray);margin-bottom:4px}
                .ctrl input[type="range"]{width:100%}
                .hint{font-size:13px;color:var(--dim-gray);margin:0}
                .rand-btn{width:100%;padding:10px;background:linear-gradient(135deg,var(--yinmn-blue),var(--oxford-blue));color:white;border:none;border-radius:var(--radius);cursor:pointer;font-weight:600;margin-top:8px}
                .rand-btn:hover{opacity:.9}
                .export-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding:16px;background:var(--ghost-white);border-radius:var(--radius)}
                .dims{display:flex;align-items:center;gap:8px}
                .dims input{width:80px;padding:8px;border:2px solid var(--platinum);border-radius:var(--radius);text-align:center;font-size:14px}
                .export-btns{display:flex;gap:8px;flex-wrap:wrap}
                .export-btns button{padding:8px 16px;background:var(--yinmn-blue);color:white;border:none;border-radius:var(--radius);cursor:pointer;font-size:13px;font-weight:500}
                .export-btns button:hover{background:var(--oxford-blue)}
            `}</style>
        </ToolLayout>
    );
};

export default SvgBackgroundGenerator;
