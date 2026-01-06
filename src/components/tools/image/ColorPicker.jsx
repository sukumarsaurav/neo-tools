import { useState, useRef, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { loadImage, createCanvas } from '../../../utils/imageUtils';
import { rgbToHex, rgbToHsl, rgbToCmyk, getTextColorForBackground } from '../../../utils/colorUtils';
import '../../../styles/tools.css';

const ColorPicker = () => {
    const [image, setImage] = useState(null);
    const [imageObj, setImageObj] = useState(null);
    const [pickedColors, setPickedColors] = useState([]);
    const [hoveredColor, setHoveredColor] = useState(null);
    const [extractedPalette, setExtractedPalette] = useState([]);
    const [isExtracting, setIsExtracting] = useState(false);

    const canvasRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'color-picker').slice(0, 3);

    const handleUpload = useCallback(async ({ dataUrl }) => {
        setImage(dataUrl);
        const img = await loadImage(dataUrl);
        setImageObj(img);
        setPickedColors([]);
        setExtractedPalette([]);

        // Draw image to canvas for color picking
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        toast.success('Image loaded! Click on the image to pick colors.');
    }, [toast]);

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const rgb = { r: pixel[0], g: pixel[1], b: pixel[2] };
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        const colorInfo = { rgb, hex, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` };

        // Add to picked colors (max 10)
        setPickedColors(prev => {
            const updated = [colorInfo, ...prev.filter(c => c.hex !== hex)].slice(0, 10);
            return updated;
        });

        toast.success(`Picked ${hex}`);
    };

    const handleCanvasMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);

        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            setHoveredColor(null);
            return;
        }

        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        setHoveredColor(rgbToHex(pixel[0], pixel[1], pixel[2]));
    };

    // Extract dominant colors using color quantization
    const extractColors = useCallback(async () => {
        if (!imageObj) return;

        setIsExtracting(true);

        // Create smaller canvas for faster processing
        const sampleSize = 100;
        const { canvas, ctx } = createCanvas(sampleSize, sampleSize);
        ctx.drawImage(imageObj, 0, 0, sampleSize, sampleSize);

        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const pixels = imageData.data;

        // Simple color binning
        const colorBins = {};

        for (let i = 0; i < pixels.length; i += 4) {
            // Round to nearest 32 for grouping
            const r = Math.round(pixels[i] / 32) * 32;
            const g = Math.round(pixels[i + 1] / 32) * 32;
            const b = Math.round(pixels[i + 2] / 32) * 32;
            const key = `${r},${g},${b}`;

            colorBins[key] = (colorBins[key] || 0) + 1;
        }

        // Sort by frequency and get top colors
        const sortedColors = Object.entries(colorBins)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([key]) => {
                const [r, g, b] = key.split(',').map(Number);
                return {
                    rgb: { r, g, b },
                    hex: rgbToHex(r, g, b),
                    count: colorBins[key]
                };
            });

        setExtractedPalette(sortedColors);
        setIsExtracting(false);
        toast.success('Extracted dominant colors!');
    }, [imageObj, toast]);

    const copyColor = (hex) => {
        navigator.clipboard.writeText(hex);
        toast.success(`Copied ${hex}`);
    };

    const copyAllColors = () => {
        const colors = pickedColors.map(c => c.hex).join('\n');
        navigator.clipboard.writeText(colors);
        toast.success('Copied all colors!');
    };

    const clearColors = () => {
        setPickedColors([]);
        setExtractedPalette([]);
    };

    const faqs = [
        { question: 'How do I pick colors?', answer: 'Click anywhere on the image to pick a color. The color will be added to your palette with HEX, RGB, and HSL values.' },
        { question: 'What is color extraction?', answer: 'Color extraction analyzes the image and finds the most dominant colors. It\'s useful for creating color palettes from photos.' },
        { question: 'How many colors can I pick?', answer: 'You can pick up to 10 colors manually. The automatic extraction returns 8 dominant colors.' }
    ];

    const seoContent = (
        <>
            <h2>Color Picker from Image</h2>
            <p>Extract colors from any image. Click to pick individual colors or automatically extract the dominant color palette. Get HEX, RGB, and HSL values for each color.</p>
        </>
    );

    return (
        <ToolLayout
            title="Color Picker from Image"
            description="Extract colors from images. Pick colors manually or auto-extract dominant colors."
            keywords={['color picker', 'extract colors', 'image colors', 'color palette', 'eyedropper']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form tool-form-wide">
                <DragDropUpload
                    id="picker-upload"
                    onUpload={handleUpload}
                    label="Drop an image to pick colors from"
                />

                {image && (
                    <div className="picker-container">
                        {/* Canvas Area */}
                        <div className="canvas-section">
                            <div className="canvas-wrapper">
                                <canvas
                                    ref={canvasRef}
                                    className="picker-canvas"
                                    onClick={handleCanvasClick}
                                    onMouseMove={handleCanvasMove}
                                    onMouseLeave={() => setHoveredColor(null)}
                                />

                                {/* Hover indicator */}
                                {hoveredColor && (
                                    <div className="hover-indicator">
                                        <div
                                            className="hover-color-box"
                                            style={{ background: hoveredColor }}
                                        />
                                        <span>{hoveredColor}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                className="btn btn-secondary"
                                onClick={extractColors}
                                disabled={isExtracting}
                            >
                                {isExtracting ? 'Extracting...' : '🎨 Extract Dominant Colors'}
                            </button>
                        </div>

                        {/* Colors Panel */}
                        <div className="colors-panel">
                            {/* Picked Colors */}
                            {pickedColors.length > 0 && (
                                <div className="color-section">
                                    <div className="section-header">
                                        <h4>Picked Colors ({pickedColors.length})</h4>
                                        <div className="section-actions">
                                            <button className="btn btn-sm btn-secondary" onClick={copyAllColors}>
                                                Copy All
                                            </button>
                                            <button className="btn btn-sm btn-secondary" onClick={clearColors}>
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                    <div className="color-list">
                                        {pickedColors.map((color, index) => (
                                            <div key={index} className="color-item">
                                                <div
                                                    className="color-swatch"
                                                    style={{ background: color.hex }}
                                                    onClick={() => copyColor(color.hex)}
                                                />
                                                <div className="color-info">
                                                    <span
                                                        className="color-hex"
                                                        onClick={() => copyColor(color.hex)}
                                                    >
                                                        {color.hex}
                                                    </span>
                                                    <span className="color-rgb">
                                                        RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Extracted Palette */}
                            {extractedPalette.length > 0 && (
                                <div className="color-section">
                                    <h4>Dominant Colors</h4>
                                    <div className="palette-grid">
                                        {extractedPalette.map((color, index) => (
                                            <div
                                                key={index}
                                                className="palette-color"
                                                style={{ background: color.hex }}
                                                onClick={() => copyColor(color.hex)}
                                                title={color.hex}
                                            >
                                                <span style={{ color: getTextColorForBackground(color.hex) }}>
                                                    {color.hex}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pickedColors.length === 0 && extractedPalette.length === 0 && (
                                <div className="empty-state">
                                    <p>👆 Click on the image to pick colors</p>
                                    <p>or use "Extract Dominant Colors"</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form-wide { max-width: 1000px; }
        
        .picker-container {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .canvas-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .canvas-wrapper {
          position: relative;
          background: #f0f0f0;
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        
        .picker-canvas {
          max-width: 100%;
          max-height: 500px;
          display: block;
          cursor: crosshair;
        }
        
        .hover-indicator {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.95);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius);
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        
        .hover-color-box {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 2px solid white;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }
        
        .colors-panel {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
        }
        
        .color-section {
          margin-bottom: var(--spacing-lg);
        }
        
        .color-section h4 {
          margin-bottom: var(--spacing-sm);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }
        
        .section-header h4 { margin: 0; }
        
        .section-actions {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-xs);
        }
        
        .color-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .color-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          background: white;
          padding: var(--spacing-xs);
          border-radius: var(--radius);
        }
        
        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: var(--radius);
          cursor: pointer;
          transition: transform 0.15s ease;
          border: 2px solid white;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
        }
        
        .color-swatch:hover {
          transform: scale(1.1);
        }
        
        .color-info {
          flex: 1;
        }
        
        .color-hex {
          display: block;
          font-weight: 600;
          font-family: var(--font-mono);
          cursor: pointer;
        }
        
        .color-hex:hover {
          color: var(--yinmn-blue);
        }
        
        .color-rgb {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        
        .palette-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-xs);
        }
        
        .palette-color {
          aspect-ratio: 1;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: var(--text-xs);
          font-weight: 600;
          transition: transform 0.15s ease;
        }
        
        .palette-color:hover {
          transform: scale(1.05);
        }
        
        .empty-state {
          text-align: center;
          color: var(--text-muted);
          padding: var(--spacing-xl);
        }
        
        .empty-state p {
          margin: var(--spacing-xs) 0;
        }
        
        @media (max-width: 768px) {
          .picker-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ColorPicker;
