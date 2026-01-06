import { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import { createCanvas, downloadDataUrl } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const PatternGenerator = () => {
    const [patternType, setPatternType] = useState('stripes');
    const [primaryColor, setPrimaryColor] = useState('#485696');
    const [secondaryColor, setSecondaryColor] = useState('#ffffff');
    const [tertiaryColor, setTertiaryColor] = useState('#e8e8e8');
    const [size, setSize] = useState(40);
    const [rotation, setRotation] = useState(0);
    const [spacing, setSpacing] = useState(10);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [preview, setPreview] = useState(null);
    const [canvasSize, setCanvasSize] = useState(400);

    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'pattern-generator').slice(0, 3);

    const patternTypes = [
        { id: 'stripes', name: 'Stripes', icon: '▤' },
        { id: 'dots', name: 'Polka Dots', icon: '●' },
        { id: 'grid', name: 'Grid', icon: '▦' },
        { id: 'checkerboard', name: 'Checkerboard', icon: '⬛' },
        { id: 'diagonal', name: 'Diagonal Lines', icon: '╲' },
        { id: 'zigzag', name: 'Zigzag', icon: '⚡' },
        { id: 'circles', name: 'Concentric Circles', icon: '◎' },
        { id: 'triangles', name: 'Triangles', icon: '△' },
        { id: 'hexagons', name: 'Hexagons', icon: '⬡' },
        { id: 'waves', name: 'Waves', icon: '〰' }
    ];

    // Generate pattern
    const generatePattern = useCallback(() => {
        const { canvas, ctx } = createCanvas(canvasSize, canvasSize);

        // Fill background
        ctx.fillStyle = secondaryColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        ctx.fillStyle = primaryColor;
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = strokeWidth;

        // Apply rotation
        if (rotation !== 0) {
            ctx.save();
            ctx.translate(canvasSize / 2, canvasSize / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-canvasSize / 2, -canvasSize / 2);
        }

        switch (patternType) {
            case 'stripes':
                for (let x = -canvasSize; x < canvasSize * 2; x += size + spacing) {
                    ctx.fillRect(x, -canvasSize, size, canvasSize * 3);
                }
                break;

            case 'dots':
                for (let y = 0; y < canvasSize; y += size + spacing) {
                    for (let x = 0; x < canvasSize; x += size + spacing) {
                        ctx.beginPath();
                        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                break;

            case 'grid':
                for (let x = 0; x <= canvasSize; x += size) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvasSize);
                    ctx.stroke();
                }
                for (let y = 0; y <= canvasSize; y += size) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvasSize, y);
                    ctx.stroke();
                }
                break;

            case 'checkerboard':
                for (let y = 0; y < canvasSize; y += size) {
                    for (let x = 0; x < canvasSize; x += size) {
                        if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
                            ctx.fillRect(x, y, size, size);
                        }
                    }
                }
                break;

            case 'diagonal':
                for (let i = -canvasSize * 2; i < canvasSize * 2; i += size) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i + canvasSize, canvasSize);
                    ctx.stroke();
                }
                break;

            case 'zigzag':
                const zigHeight = size;
                const zigWidth = size / 2;
                for (let y = 0; y < canvasSize; y += zigHeight + spacing) {
                    ctx.beginPath();
                    for (let x = 0; x < canvasSize; x += zigWidth * 2) {
                        ctx.lineTo(x, y);
                        ctx.lineTo(x + zigWidth, y + zigHeight);
                        ctx.lineTo(x + zigWidth * 2, y);
                    }
                    ctx.stroke();
                }
                break;

            case 'circles':
                const centerX = canvasSize / 2;
                const centerY = canvasSize / 2;
                for (let r = size; r < canvasSize; r += size + spacing) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                    ctx.stroke();
                }
                break;

            case 'triangles':
                const triSize = size;
                for (let y = 0; y < canvasSize; y += triSize * 0.866) {
                    const offset = (Math.floor(y / (triSize * 0.866)) % 2) * (triSize / 2);
                    for (let x = -triSize + offset; x < canvasSize; x += triSize) {
                        ctx.beginPath();
                        ctx.moveTo(x, y + triSize * 0.866);
                        ctx.lineTo(x + triSize / 2, y);
                        ctx.lineTo(x + triSize, y + triSize * 0.866);
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
                break;

            case 'hexagons':
                const hexSize = size / 2;
                const hexHeight = hexSize * Math.sqrt(3);
                for (let row = 0; row < canvasSize / hexHeight + 1; row++) {
                    for (let col = 0; col < canvasSize / (hexSize * 1.5) + 1; col++) {
                        const x = col * hexSize * 1.5;
                        const y = row * hexHeight + (col % 2 ? hexHeight / 2 : 0);
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            const angle = (Math.PI / 3) * i;
                            const px = x + hexSize * Math.cos(angle);
                            const py = y + hexSize * Math.sin(angle);
                            if (i === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                }
                break;

            case 'waves':
                for (let y = 0; y < canvasSize; y += size + spacing) {
                    ctx.beginPath();
                    for (let x = 0; x <= canvasSize; x += 2) {
                        const waveY = y + Math.sin((x / size) * Math.PI * 2) * (size / 4);
                        if (x === 0) ctx.moveTo(x, waveY);
                        else ctx.lineTo(x, waveY);
                    }
                    ctx.stroke();
                }
                break;
        }

        if (rotation !== 0) {
            ctx.restore();
        }

        setPreview(canvas.toDataURL('image/png'));
    }, [patternType, primaryColor, secondaryColor, size, rotation, spacing, strokeWidth, canvasSize]);

    // Update preview on settings change
    useEffect(() => {
        generatePattern();
    }, [generatePattern]);

    const download = () => {
        if (!preview) return;
        downloadDataUrl(preview, `pattern-${patternType}.png`);
        toast.success('Downloaded!');
    };

    const copyCssPattern = () => {
        const css = `background-image: url("${preview}");
background-repeat: repeat;
background-size: ${canvasSize}px ${canvasSize}px;`;
        navigator.clipboard.writeText(css);
        toast.success('CSS copied!');
    };

    const faqs = [
        { question: 'What patterns are available?', answer: 'Stripes, polka dots, grid, checkerboard, diagonal lines, zigzag, concentric circles, triangles, hexagons, and waves.' },
        { question: 'Can I use these patterns commercially?', answer: 'Yes! Generated patterns are royalty-free. Use them for any purpose.' },
        { question: 'How do I use the pattern as a CSS background?', answer: 'Click "Copy CSS" to get the CSS code with the pattern as a background-image.' }
    ];

    const seoContent = (
        <>
            <h2>Pattern Generator</h2>
            <p>Create seamless repeating patterns for backgrounds, designs, and graphics. Choose from 10 pattern types with customizable colors, sizes, and rotation. Download as PNG or copy CSS code.</p>
        </>
    );

    return (
        <ToolLayout
            title="Pattern Generator"
            description="Create seamless repeating patterns. Generate stripes, dots, grids, and more."
            keywords={['pattern generator', 'seamless pattern', 'background pattern', 'repeating pattern']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form tool-form-wide">
                <div className="pattern-editor">
                    {/* Preview */}
                    <div className="preview-section">
                        {preview && (
                            <div
                                className="pattern-preview"
                                style={{
                                    backgroundImage: `url(${preview})`,
                                    backgroundRepeat: 'repeat',
                                    backgroundSize: `${canvasSize / 2}px ${canvasSize / 2}px`
                                }}
                            />
                        )}
                    </div>

                    {/* Settings */}
                    <div className="settings-panel">
                        {/* Pattern Type */}
                        <div className="form-group">
                            <label className="form-label">Pattern Type</label>
                            <div className="pattern-grid">
                                {patternTypes.map(type => (
                                    <button
                                        key={type.id}
                                        className={`pattern-btn ${patternType === type.id ? 'active' : ''}`}
                                        onClick={() => setPatternType(type.id)}
                                        title={type.name}
                                    >
                                        <span className="pattern-icon">{type.icon}</span>
                                        <span className="pattern-name">{type.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="color-row">
                            <div className="form-group">
                                <label className="form-label">Primary</label>
                                <input
                                    type="color"
                                    value={primaryColor}
                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                    className="color-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Background</label>
                                <input
                                    type="color"
                                    value={secondaryColor}
                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                    className="color-input"
                                />
                            </div>
                        </div>

                        {/* Size & Spacing */}
                        <div className="form-group">
                            <label className="form-label">Size: {size}px</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Spacing: {spacing}px</label>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={spacing}
                                onChange={(e) => setSpacing(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Stroke Width: {strokeWidth}px</label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={strokeWidth}
                                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Rotation: {rotation}°</label>
                            <input
                                type="range"
                                min="0"
                                max="90"
                                value={rotation}
                                onChange={(e) => setRotation(parseInt(e.target.value))}
                            />
                        </div>

                        {/* Actions */}
                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={download}>
                                ⬇️ Download PNG
                            </button>
                            <button className="btn btn-secondary" onClick={copyCssPattern}>
                                📋 Copy CSS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .tool-form-wide { max-width: 1000px; }
        
        .pattern-editor {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .preview-section {
          background: #f0f0f0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          min-height: 400px;
        }
        
        .pattern-preview {
          width: 100%;
          height: 100%;
          min-height: 400px;
        }
        
        .settings-panel {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-xs);
          max-height: 200px;
          overflow-y: auto;
        }
        
        .pattern-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-sm);
          background: white;
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .pattern-btn:hover {
          border-color: var(--yinmn-blue);
        }
        
        .pattern-btn.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }
        
        .pattern-icon {
          font-size: 20px;
          margin-bottom: 2px;
        }
        
        .pattern-name {
          font-size: var(--text-xs);
        }
        
        .color-row {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .color-row .form-group {
          flex: 1;
        }
        
        .color-input {
          width: 100%;
          height: 40px;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
        }
        
        .action-buttons {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .action-buttons .btn {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .pattern-editor {
            grid-template-columns: 1fr;
          }
          
          .pattern-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default PatternGenerator;
