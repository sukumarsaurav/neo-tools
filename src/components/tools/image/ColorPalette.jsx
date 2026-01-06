import { useState } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import {
    hexToHsl, hslToHex, generateHarmoniousColors, generateColorVariations,
    paletteToCss, getTextColorForBackground, getContrastRatio, hexToRgb, checkAccessibility
} from '../../../utils/colorUtils';
import '../../../styles/tools.css';

const ColorPalette = () => {
    const [baseColor, setBaseColor] = useState('#485696');
    const [palette, setPalette] = useState(null);
    const [showAccessibility, setShowAccessibility] = useState(false);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'color-palette').slice(0, 3);

    const generate = () => {
        const variations = generateColorVariations(baseColor);
        const harmonious = generateHarmoniousColors(baseColor);

        setPalette({
            primary: baseColor,
            lighter: variations.lighter,
            light: variations.light,
            dark: variations.dark,
            darker: variations.darker,
            complement: harmonious.complement,
            analogous1: harmonious.analogous1,
            analogous2: harmonious.analogous2,
            triadic1: harmonious.triadic1,
            triadic2: harmonious.triadic2
        });
        toast.success('Palette generated!');
    };

    const copyColor = (hex) => {
        navigator.clipboard.writeText(hex);
        toast.success(`Copied ${hex}`);
    };

    const exportAsCss = () => {
        if (!palette) return;
        const cssVars = paletteToCss({
            'color-primary': palette.primary,
            'color-lighter': palette.lighter,
            'color-light': palette.light,
            'color-dark': palette.dark,
            'color-darker': palette.darker,
            'color-complement': palette.complement,
            'color-analogous-1': palette.analogous1,
            'color-analogous-2': palette.analogous2,
            'color-triadic-1': palette.triadic1,
            'color-triadic-2': palette.triadic2
        });
        navigator.clipboard.writeText(cssVars);
        toast.success('CSS variables copied!');
    };

    // Calculate accessibility for a color pair
    const getAccessibilityInfo = (bgColor, fgColor) => {
        const bgRgb = hexToRgb(bgColor);
        const fgRgb = hexToRgb(fgColor);
        if (!bgRgb || !fgRgb) return null;

        const ratio = getContrastRatio(bgRgb, fgRgb);
        const { largeAA, largeAAA, normalAA, normalAAA } = checkAccessibility(ratio);

        return {
            ratio: ratio.toFixed(2),
            normalAA,
            normalAAA,
            largeAA,
            largeAAA
        };
    };

    const faqs = [
        { question: 'What is a color palette?', answer: 'A color palette is a set of harmonious colors that work well together. Used in design, branding, and web development for consistent visuals.' },
        { question: 'What are complementary colors?', answer: 'Colors opposite each other on the color wheel. They create high contrast and vibrant looks when used together.' },
        { question: 'What are analogous colors?', answer: 'Colors that are next to each other on the color wheel. They create harmonious, cohesive designs with subtle contrast.' },
        { question: 'What is WCAG accessibility?', answer: 'WCAG (Web Content Accessibility Guidelines) defines contrast ratios for text readability. AA requires 4.5:1 for normal text, AAA requires 7:1.' }
    ];

    const seoContent = (
        <>
            <h2>Color Palette Generator</h2>
            <p>Generate harmonious color palettes from any base color. Get lighter/darker shades, complementary, analogous, and triadic colors for your design projects. Check WCAG accessibility and export as CSS variables.</p>
        </>
    );

    const ColorBox = ({ colorKey, color }) => (
        <div
            className="color-box"
            style={{ background: color }}
            onClick={() => copyColor(color)}
            onKeyDown={(e) => e.key === 'Enter' && copyColor(color)}
            tabIndex={0}
            role="button"
            aria-label={`Copy color ${color}`}
        >
            <span style={{ color: getTextColorForBackground(color) === '#000000' ? '#333' : '#fff' }}>
                {color}
            </span>
        </div>
    );

    // Accessibility checker component
    const AccessibilityChecker = ({ color, label }) => {
        const whiteInfo = getAccessibilityInfo(color, '#FFFFFF');
        const blackInfo = getAccessibilityInfo(color, '#000000');

        const Badge = ({ pass, label }) => (
            <span className={`a11y-badge ${pass ? 'pass' : 'fail'}`}>
                {label} {pass ? '✓' : '✗'}
            </span>
        );

        return (
            <div className="a11y-row">
                <div className="a11y-color" style={{ background: color }}>
                    <span style={{ color: getTextColorForBackground(color) === '#000000' ? '#333' : '#fff' }}>
                        {label}
                    </span>
                </div>
                <div className="a11y-results">
                    <div className="a11y-pair">
                        <span className="a11y-pair-label">White text ({whiteInfo?.ratio}:1)</span>
                        <div className="a11y-badges">
                            <Badge pass={whiteInfo?.normalAA} label="AA" />
                            <Badge pass={whiteInfo?.normalAAA} label="AAA" />
                        </div>
                    </div>
                    <div className="a11y-pair">
                        <span className="a11y-pair-label">Black text ({blackInfo?.ratio}:1)</span>
                        <div className="a11y-badges">
                            <Badge pass={blackInfo?.normalAA} label="AA" />
                            <Badge pass={blackInfo?.normalAAA} label="AAA" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <ToolLayout
            title="Color Palette Generator"
            description="Generate harmonious color palettes. Get complementary, analogous, and triadic colors with accessibility checking."
            keywords={['color palette generator', 'color scheme', 'harmonious colors', 'color picker', 'WCAG accessibility']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <div className="color-picker">
                    <input
                        type="color"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        aria-label="Select base color"
                    />
                    <input
                        type="text"
                        className="form-input"
                        value={baseColor}
                        onChange={(e) => setBaseColor(e.target.value)}
                        aria-label="Base color hex value"
                        placeholder="#485696"
                    />
                </div>

                <button
                    className="btn btn-primary btn-lg"
                    onClick={generate}
                    aria-label="Generate color palette"
                >
                    🎨 Generate Palette
                </button>

                {palette && (
                    <div className="palette-result">
                        <div className="palette-section">
                            <h4>Shades</h4>
                            <div className="color-row">
                                {['lighter', 'light', 'primary', 'dark', 'darker'].map(k => (
                                    <ColorBox key={k} colorKey={k} color={palette[k]} />
                                ))}
                            </div>
                        </div>

                        <div className="palette-section">
                            <h4>Complementary</h4>
                            <div className="color-row">
                                <ColorBox colorKey="primary" color={palette.primary} />
                                <ColorBox colorKey="complement" color={palette.complement} />
                            </div>
                        </div>

                        <div className="palette-section">
                            <h4>Analogous</h4>
                            <div className="color-row">
                                {['analogous2', 'primary', 'analogous1'].map(k => (
                                    <ColorBox key={k} colorKey={k} color={palette[k]} />
                                ))}
                            </div>
                        </div>

                        <div className="palette-section">
                            <h4>Triadic</h4>
                            <div className="color-row">
                                {['primary', 'triadic1', 'triadic2'].map(k => (
                                    <ColorBox key={k} colorKey={k} color={palette[k]} />
                                ))}
                            </div>
                        </div>

                        {/* Accessibility Section */}
                        <div className="accessibility-section">
                            <div className="section-header">
                                <h4>♿ Accessibility Contrast (WCAG)</h4>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setShowAccessibility(!showAccessibility)}
                                >
                                    {showAccessibility ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {showAccessibility && (
                                <div className="a11y-grid">
                                    <AccessibilityChecker color={palette.primary} label="Primary" />
                                    <AccessibilityChecker color={palette.dark} label="Dark" />
                                    <AccessibilityChecker color={palette.light} label="Light" />
                                    <AccessibilityChecker color={palette.complement} label="Complement" />
                                </div>
                            )}
                        </div>

                        <div className="export-section">
                            <button
                                className="btn btn-secondary"
                                onClick={exportAsCss}
                                aria-label="Export palette as CSS variables"
                            >
                                📋 Copy as CSS Variables
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form { max-width: 700px; margin: 0 auto; }
        .color-picker { display: flex; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
        .color-picker input[type="color"] { width: 60px; height: 44px; padding: 0; border: none; cursor: pointer; border-radius: var(--radius); }
        .color-picker .form-input { flex: 1; }
        .palette-result { margin-top: var(--spacing-xl); }
        .palette-section { margin-top: var(--spacing-lg); }
        .palette-section h4 { margin-bottom: var(--spacing-sm); }
        .color-row { display: flex; gap: var(--spacing-sm); flex-wrap: wrap; }
        .color-box { 
          flex: 1; 
          min-width: 80px;
          height: 80px; 
          border-radius: var(--radius); 
          display: flex; 
          align-items: flex-end; 
          justify-content: center; 
          padding: var(--spacing-sm); 
          cursor: pointer; 
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          border: 2px solid transparent;
        }
        .color-box:hover, .color-box:focus { 
          transform: scale(1.05); 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .color-box:focus {
          outline: none;
          border-color: var(--yinmn-blue);
        }
        .color-box span { 
          font-size: var(--text-xs); 
          background: rgba(255,255,255,0.9); 
          padding: 2px 6px; 
          border-radius: 4px;
          font-family: var(--font-mono);
        }
        
        /* Accessibility Section */
        .accessibility-section {
          margin-top: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .section-header h4 {
          margin: 0;
        }
        
        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-sm);
        }
        
        .a11y-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .a11y-row {
          display: flex;
          gap: var(--spacing-md);
          align-items: center;
          padding: var(--spacing-sm);
          background: white;
          border-radius: var(--radius);
        }
        
        .a11y-color {
          width: 80px;
          height: 50px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xs);
          font-weight: 600;
        }
        
        .a11y-results {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .a11y-pair {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .a11y-pair-label {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
        
        .a11y-badges {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .a11y-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: var(--text-xs);
          font-weight: 600;
        }
        
        .a11y-badge.pass {
          background: #d4edda;
          color: #155724;
        }
        
        .a11y-badge.fail {
          background: #f8d7da;
          color: #721c24;
        }
        
        .export-section {
          margin-top: var(--spacing-xl);
          text-align: center;
        }
        
        @media (max-width: 480px) {
          .a11y-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .a11y-color {
            width: 100%;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ColorPalette;
