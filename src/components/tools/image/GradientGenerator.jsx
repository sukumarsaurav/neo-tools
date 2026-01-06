import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import '../../../styles/tools.css';

const GradientGenerator = () => {
    const [colors, setColors] = useState(['#485696', '#fc7a1e']);
    const [direction, setDirection] = useState('to right');
    const [type, setType] = useState('linear');
    const [angle, setAngle] = useState(90);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'gradient-generator').slice(0, 3);

    const addColor = () => {
        if (colors.length < 5) {
            setColors([...colors, '#ffffff']);
            toast.info('Color stop added');
        } else {
            toast.warning('Maximum 5 colors allowed');
        }
    };

    const removeColor = (index) => {
        if (colors.length > 2) {
            setColors(colors.filter((_, i) => i !== index));
            toast.info('Color stop removed');
        } else {
            toast.warning('Minimum 2 colors required');
        }
    };

    const updateColor = (index, value) => {
        const newColors = [...colors];
        newColors[index] = value;
        setColors(newColors);
    };

    // Generate gradient string
    const gradient = type === 'linear'
        ? `linear-gradient(${direction === 'custom' ? `${angle}deg` : direction}, ${colors.join(', ')})`
        : type === 'radial'
            ? `radial-gradient(circle, ${colors.join(', ')})`
            : `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;

    const cssCode = `background: ${gradient};`;

    const copyCode = () => {
        navigator.clipboard.writeText(cssCode);
        toast.success('CSS copied to clipboard!');
    };

    const copyGradientOnly = () => {
        navigator.clipboard.writeText(gradient);
        toast.success('Gradient value copied!');
    };

    const directions = [
        { value: 'to right', label: 'Left → Right' },
        { value: 'to left', label: 'Right → Left' },
        { value: 'to bottom', label: 'Top → Bottom' },
        { value: 'to top', label: 'Bottom → Top' },
        { value: 'to bottom right', label: 'Diagonal ↘' },
        { value: 'to top right', label: 'Diagonal ↗' },
        { value: 'to bottom left', label: 'Diagonal ↙' },
        { value: 'to top left', label: 'Diagonal ↖' },
        { value: 'custom', label: 'Custom Angle' }
    ];

    const presets = [
        { name: 'Sunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3'] },
        { name: 'Ocean', colors: ['#0093E9', '#80D0C7'] },
        { name: 'Purple Dream', colors: ['#667eea', '#764ba2'] },
        { name: 'Fresh Mint', colors: ['#11998e', '#38ef7d'] },
        { name: 'Royal', colors: ['#141E30', '#243B55'] },
        { name: 'Aurora', colors: ['#00c6ff', '#0072ff', '#7c3aed'] }
    ];

    const applyPreset = (preset) => {
        setColors(preset.colors);
        toast.success(`Applied "${preset.name}" preset`);
    };

    const faqs = [
        { question: 'What is a CSS gradient?', answer: 'A gradient is a smooth transition between colors. Linear gradients flow in a direction, radial gradients radiate from a center point, and conic gradients rotate around a center.' },
        { question: 'When to use gradients?', answer: 'Gradients add depth and visual interest to buttons, backgrounds, banners, and UI elements. They create modern, dynamic designs.' },
        { question: 'How many colors can I use?', answer: 'Our generator supports 2-5 color stops. More stops create more complex transitions but may impact performance.' }
    ];

    const seoContent = (
        <>
            <h2>CSS Gradient Generator</h2>
            <p>Create beautiful CSS gradients for your website. Generate linear, radial, and conic gradients with multiple color stops, custom angles, and preset templates.</p>
        </>
    );

    return (
        <ToolLayout
            title="CSS Gradient Generator"
            description="Create beautiful CSS gradients with custom colors. Generate linear, radial, and conic gradients."
            keywords={['gradient generator', 'CSS gradient', 'color gradient', 'gradient maker']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Preview */}
                <div
                    className="gradient-preview"
                    style={{ background: gradient }}
                    role="img"
                    aria-label="Gradient preview"
                />

                {/* Presets */}
                <div className="presets-section">
                    <label className="form-label">Quick Presets</label>
                    <div className="presets-grid">
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                className="preset-swatch"
                                style={{ background: `linear-gradient(to right, ${preset.colors.join(', ')})` }}
                                onClick={() => applyPreset(preset)}
                                aria-label={`Apply ${preset.name} preset`}
                                title={preset.name}
                            />
                        ))}
                    </div>
                </div>

                {/* Color Stops */}
                <div className="colors-section">
                    <div className="section-header">
                        <label className="form-label">Color Stops</label>
                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={addColor}
                            disabled={colors.length >= 5}
                            aria-label="Add color stop"
                        >
                            + Add
                        </button>
                    </div>
                    <div className="color-stops">
                        {colors.map((color, index) => (
                            <div key={index} className="color-stop">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                    className="color-input"
                                    aria-label={`Color stop ${index + 1}`}
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                    className="form-input color-text"
                                    aria-label={`Color stop ${index + 1} hex value`}
                                />
                                {colors.length > 2 && (
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeColor(index)}
                                        aria-label={`Remove color stop ${index + 1}`}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Type & Direction */}
                <div className="options-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="gradient-type">Type</label>
                        <select
                            id="gradient-type"
                            className="form-select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="linear">Linear</option>
                            <option value="radial">Radial</option>
                            <option value="conic">Conic</option>
                        </select>
                    </div>

                    {type === 'linear' && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="gradient-direction">Direction</label>
                            <select
                                id="gradient-direction"
                                className="form-select"
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                            >
                                {directions.map(d => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(direction === 'custom' || type === 'conic') && (
                        <div className="form-group">
                            <label className="form-label" htmlFor="gradient-angle">Angle ({angle}°)</label>
                            <input
                                id="gradient-angle"
                                type="range"
                                min="0"
                                max="360"
                                value={angle}
                                onChange={(e) => setAngle(parseInt(e.target.value))}
                                className="angle-slider"
                            />
                        </div>
                    )}
                </div>

                {/* Output */}
                <div className="code-output">
                    <code>{cssCode}</code>
                    <div className="code-actions">
                        <button
                            className="copy-btn"
                            onClick={copyCode}
                            aria-label="Copy full CSS"
                        >
                            📋 CSS
                        </button>
                        <button
                            className="copy-btn"
                            onClick={copyGradientOnly}
                            aria-label="Copy gradient value only"
                        >
                            📋 Value
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .tool-form { max-width: 600px; margin: 0 auto; }
        
        .gradient-preview {
          height: 200px;
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .presets-section {
          margin-bottom: var(--spacing-lg);
        }
        
        .presets-grid {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .preset-swatch {
          width: 50px;
          height: 30px;
          border: 2px solid transparent;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .preset-swatch:hover {
          transform: scale(1.1);
          border-color: var(--yinmn-blue);
        }
        
        .colors-section {
          margin-bottom: var(--spacing-lg);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }
        
        .color-stops {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .color-stop {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }
        
        .color-stop .color-input {
          width: 50px;
          height: 40px;
          border: none;
          padding: 0;
          cursor: pointer;
          border-radius: var(--radius);
        }
        
        .color-stop .color-text {
          flex: 1;
          font-family: var(--font-mono);
          text-transform: uppercase;
        }
        
        .remove-btn {
          width: 32px;
          height: 32px;
          background: var(--error);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }
        
        .remove-btn:hover {
          opacity: 0.8;
        }
        
        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-sm);
        }
        
        .options-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        
        .angle-slider {
          width: 100%;
        }
        
        .code-output {
          background: var(--bg-dark, #1a1a2e);
          color: #f0f0f0;
          padding: var(--spacing-md);
          border-radius: var(--radius);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }
        
        .code-output code {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          word-break: break-all;
          flex: 1;
        }
        
        .code-actions {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .copy-btn {
          background: var(--yinmn-blue);
          color: white;
          border: none;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
          transition: background 0.2s ease;
        }
        
        .copy-btn:hover {
          background: var(--yinmn-blue-dark, #3a4576);
        }
      `}</style>
        </ToolLayout>
    );
};

export default GradientGenerator;
