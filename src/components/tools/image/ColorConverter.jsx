import { useState, useCallback, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import {
    hexToRgb, rgbToHex, hexToHsl, hslToHex, rgbToHsl, hslToRgb,
    rgbToCmyk, cmykToRgb, isValidHex, checkAccessibility,
    getTextColorForBackground, generateColorVariations, generateHarmoniousColors
} from '../../../utils/colorUtils';
import '../../../styles/tools.css';

const ColorConverter = () => {
    const [inputMode, setInputMode] = useState('hex');
    const [hex, setHex] = useState('#485696');
    const [rgb, setRgb] = useState({ r: 72, g: 86, b: 150 });
    const [hsl, setHsl] = useState({ h: 229, s: 35, l: 44 });
    const [cmyk, setCmyk] = useState({ c: 52, m: 43, y: 0, k: 41 });
    const [error, setError] = useState('');
    const [copied, setCopied] = useState('');

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'color-converter').slice(0, 3);

    // Convert from the current input mode to all other formats
    const convertFromMode = useCallback((mode, value) => {
        setError('');

        try {
            let newRgb;

            switch (mode) {
                case 'hex':
                    if (!isValidHex(value)) {
                        setError('Invalid HEX color');
                        return;
                    }
                    newRgb = hexToRgb(value);
                    break;
                case 'rgb':
                    newRgb = value;
                    break;
                case 'hsl':
                    newRgb = hslToRgb(value.h, value.s, value.l);
                    break;
                case 'cmyk':
                    newRgb = cmykToRgb(value.c, value.m, value.y, value.k);
                    break;
                default:
                    return;
            }

            // Update all values
            const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
            const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
            const newCmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b);

            setHex(newHex);
            setRgb(newRgb);
            setHsl(newHsl);
            setCmyk(newCmyk);
        } catch (e) {
            setError('Invalid color value');
        }
    }, []);

    // Handle input changes
    const handleHexChange = (value) => {
        setHex(value);
        if (value.length >= 4) {
            convertFromMode('hex', value);
        }
    };

    const handleRgbChange = (key, value) => {
        const newRgb = { ...rgb, [key]: Math.max(0, Math.min(255, parseInt(value) || 0)) };
        setRgb(newRgb);
        convertFromMode('rgb', newRgb);
    };

    const handleHslChange = (key, value) => {
        const max = key === 'h' ? 360 : 100;
        const newHsl = { ...hsl, [key]: Math.max(0, Math.min(max, parseInt(value) || 0)) };
        setHsl(newHsl);
        convertFromMode('hsl', newHsl);
    };

    const handleCmykChange = (key, value) => {
        const newCmyk = { ...cmyk, [key]: Math.max(0, Math.min(100, parseInt(value) || 0)) };
        setCmyk(newCmyk);
        convertFromMode('cmyk', newCmyk);
    };

    const handleColorPickerChange = (e) => {
        const value = e.target.value;
        setHex(value);
        convertFromMode('hex', value);
    };

    const copyToClipboard = useCallback((text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    }, []);

    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
    const rgbaString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;

    // Get accessibility info for white/black text
    const accessWhite = checkAccessibility('#FFFFFF', hex);
    const accessBlack = checkAccessibility('#000000', hex);

    const faqs = [
        {
            question: 'What is the difference between RGB and HEX?',
            answer: 'RGB uses decimal values (0-255) for red, green, and blue. HEX uses hexadecimal (00-FF) for the same. #FF0000 equals RGB(255, 0, 0) - both represent pure red.'
        },
        {
            question: 'When should I use HSL?',
            answer: 'HSL is intuitive for designers. Hue is the color (0-360°), Saturation is intensity (0-100%), Lightness is brightness (0-100%). It\'s easier to create color variations.'
        },
        {
            question: 'What is CMYK used for?',
            answer: 'CMYK (Cyan, Magenta, Yellow, Key/Black) is used for print. RGB/HEX colors may look different when printed, so designers often work in CMYK for print projects.'
        }
    ];

    const seoContent = (
        <>
            <h2>Universal Color Converter</h2>
            <p>Convert colors between HEX, RGB, HSL, and CMYK formats instantly. Check accessibility contrast ratios and copy CSS-ready color values. Essential tool for web designers and developers.</p>
        </>
    );

    return (
        <ToolLayout
            title="Color Converter"
            description="Convert colors between HEX, RGB, HSL, and CMYK formats. Free online color conversion tool."
            keywords={['color converter', 'hex to rgb', 'rgb to hex', 'hsl converter', 'cmyk converter']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Color Picker & Preview */}
                <div className="color-preview-section">
                    <div
                        className="color-preview-large"
                        style={{ background: hex }}
                    >
                        <input
                            type="color"
                            value={hex}
                            onChange={handleColorPickerChange}
                            className="color-picker-overlay"
                            aria-label="Pick color"
                        />
                        <span style={{ color: getTextColorForBackground(hex) }}>
                            Click to pick
                        </span>
                    </div>
                </div>

                {error && <p className="error-message">{error}</p>}

                {/* Color Inputs */}
                <div className="color-inputs-grid">
                    {/* HEX */}
                    <div className="color-input-card">
                        <div className="input-header">
                            <span className="input-label">HEX</span>
                            <button
                                className={`copy-btn-small ${copied === 'hex' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(hex, 'hex')}
                            >
                                {copied === 'hex' ? '✓' : '📋'}
                            </button>
                        </div>
                        <input
                            type="text"
                            className="form-input"
                            value={hex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            placeholder="#485696"
                        />
                    </div>

                    {/* RGB */}
                    <div className="color-input-card">
                        <div className="input-header">
                            <span className="input-label">RGB</span>
                            <button
                                className={`copy-btn-small ${copied === 'rgb' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(rgbString, 'rgb')}
                            >
                                {copied === 'rgb' ? '✓' : '📋'}
                            </button>
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>R</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={rgb.r}
                                    onChange={(e) => handleRgbChange('r', e.target.value)}
                                    min="0"
                                    max="255"
                                />
                            </div>
                            <div className="input-group">
                                <label>G</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={rgb.g}
                                    onChange={(e) => handleRgbChange('g', e.target.value)}
                                    min="0"
                                    max="255"
                                />
                            </div>
                            <div className="input-group">
                                <label>B</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={rgb.b}
                                    onChange={(e) => handleRgbChange('b', e.target.value)}
                                    min="0"
                                    max="255"
                                />
                            </div>
                        </div>
                    </div>

                    {/* HSL */}
                    <div className="color-input-card">
                        <div className="input-header">
                            <span className="input-label">HSL</span>
                            <button
                                className={`copy-btn-small ${copied === 'hsl' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(hslString, 'hsl')}
                            >
                                {copied === 'hsl' ? '✓' : '📋'}
                            </button>
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>H</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={hsl.h}
                                    onChange={(e) => handleHslChange('h', e.target.value)}
                                    min="0"
                                    max="360"
                                />
                            </div>
                            <div className="input-group">
                                <label>S</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={hsl.s}
                                    onChange={(e) => handleHslChange('s', e.target.value)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="input-group">
                                <label>L</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={hsl.l}
                                    onChange={(e) => handleHslChange('l', e.target.value)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CMYK */}
                    <div className="color-input-card">
                        <div className="input-header">
                            <span className="input-label">CMYK</span>
                            <button
                                className={`copy-btn-small ${copied === 'cmyk' ? 'copied' : ''}`}
                                onClick={() => copyToClipboard(cmykString, 'cmyk')}
                            >
                                {copied === 'cmyk' ? '✓' : '📋'}
                            </button>
                        </div>
                        <div className="input-row">
                            <div className="input-group">
                                <label>C</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={cmyk.c}
                                    onChange={(e) => handleCmykChange('c', e.target.value)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="input-group">
                                <label>M</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={cmyk.m}
                                    onChange={(e) => handleCmykChange('m', e.target.value)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="input-group">
                                <label>Y</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={cmyk.y}
                                    onChange={(e) => handleCmykChange('y', e.target.value)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="input-group">
                                <label>K</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={cmyk.k}
                                    onChange={(e) => handleCmykChange('k', e.target.value)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accessibility Check */}
                <div className="accessibility-section">
                    <h4>Accessibility Contrast</h4>
                    <div className="accessibility-grid">
                        <div className="accessibility-card" style={{ background: hex, color: '#FFFFFF' }}>
                            <span className="access-text">White Text</span>
                            <span className="access-ratio">{accessWhite.ratio}:1</span>
                            <div className="access-badges">
                                <span className={`access-badge ${accessWhite.AA ? 'pass' : 'fail'}`}>AA {accessWhite.AA ? '✓' : '✗'}</span>
                                <span className={`access-badge ${accessWhite.AAA ? 'pass' : 'fail'}`}>AAA {accessWhite.AAA ? '✓' : '✗'}</span>
                            </div>
                        </div>
                        <div className="accessibility-card" style={{ background: hex, color: '#000000' }}>
                            <span className="access-text">Black Text</span>
                            <span className="access-ratio">{accessBlack.ratio}:1</span>
                            <div className="access-badges">
                                <span className={`access-badge ${accessBlack.AA ? 'pass' : 'fail'}`}>AA {accessBlack.AA ? '✓' : '✗'}</span>
                                <span className={`access-badge ${accessBlack.AAA ? 'pass' : 'fail'}`}>AAA {accessBlack.AAA ? '✓' : '✗'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CSS Code Output */}
                <div className="css-output-section">
                    <h4>CSS Values</h4>
                    <div className="css-outputs">
                        <div className="code-output">
                            <code>color: {hex};</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(`color: ${hex};`, 'css1')}>📋</button>
                        </div>
                        <div className="code-output">
                            <code>color: {rgbString};</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(`color: ${rgbString};`, 'css2')}>📋</button>
                        </div>
                        <div className="code-output">
                            <code>color: {hslString};</code>
                            <button className="copy-btn" onClick={() => copyToClipboard(`color: ${hslString};`, 'css3')}>📋</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .color-preview-section {
          display: flex;
          justify-content: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .color-preview-large {
          width: 200px;
          height: 200px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .color-preview-large:hover {
          transform: scale(1.02);
        }
        
        .color-picker-overlay {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        
        .error-message {
          color: var(--error);
          text-align: center;
          margin-bottom: var(--spacing-md);
        }
        
        .color-inputs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        
        .color-input-card {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
        }
        
        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }
        
        .input-label {
          font-weight: 600;
          font-size: var(--text-lg);
        }
        
        .copy-btn-small {
          background: var(--yinmn-blue);
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: var(--radius);
          cursor: pointer;
          font-size: 12px;
        }
        
        .copy-btn-small.copied {
          background: var(--success, #28a745);
        }
        
        .input-row {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .input-group {
          flex: 1;
        }
        
        .input-group label {
          display: block;
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        
        .input-group .form-input {
          text-align: center;
          padding: var(--spacing-sm);
        }
        
        .accessibility-section {
          margin: var(--spacing-lg) 0;
        }
        
        .accessibility-section h4 {
          margin-bottom: var(--spacing-md);
        }
        
        .accessibility-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }
        
        .accessibility-card {
          padding: var(--spacing-lg);
          border-radius: var(--radius);
          text-align: center;
        }
        
        .access-text {
          display: block;
          font-weight: 600;
          font-size: var(--text-lg);
          margin-bottom: var(--spacing-xs);
        }
        
        .access-ratio {
          display: block;
          font-size: var(--text-2xl);
          font-weight: 700;
          margin-bottom: var(--spacing-sm);
        }
        
        .access-badges {
          display: flex;
          justify-content: center;
          gap: var(--spacing-sm);
        }
        
        .access-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: var(--text-xs);
          font-weight: 600;
        }
        
        .access-badge.pass {
          background: rgba(40, 167, 69, 0.3);
        }
        
        .access-badge.fail {
          background: rgba(220, 53, 69, 0.3);
        }
        
        .css-output-section h4 {
          margin-bottom: var(--spacing-md);
        }
        
        .css-outputs {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        @media (max-width: 480px) {
          .accessibility-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ColorConverter;
