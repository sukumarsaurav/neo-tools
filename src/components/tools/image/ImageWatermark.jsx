import { useState, useRef, useCallback, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { loadImage, createCanvas, downloadDataUrl } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const ImageWatermark = () => {
    const [image, setImage] = useState(null);
    const [imageObj, setImageObj] = useState(null);
    const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
    const [text, setText] = useState('© Your Name');
    const [fontSize, setFontSize] = useState(24);
    const [fontFamily, setFontFamily] = useState('Arial');
    const [textColor, setTextColor] = useState('#ffffff');
    const [opacity, setOpacity] = useState(50);
    const [position, setPosition] = useState('bottom-right');
    const [padding, setPadding] = useState(20);
    const [rotation, setRotation] = useState(0);
    const [tiled, setTiled] = useState(false);
    const [tileSpacing, setTileSpacing] = useState(100);
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [watermarkImageObj, setWatermarkImageObj] = useState(null);
    const [watermarkScale, setWatermarkScale] = useState(20); // percentage of image width
    const [preview, setPreview] = useState(null);

    const canvasRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-watermark').slice(0, 3);

    const handleUpload = useCallback(async ({ dataUrl }) => {
        setImage(dataUrl);
        const img = await loadImage(dataUrl);
        setImageObj(img);
        toast.success('Image loaded!');
    }, [toast]);

    const handleWatermarkImageUpload = useCallback(async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target.result;
            setWatermarkImage(dataUrl);
            const img = await loadImage(dataUrl);
            setWatermarkImageObj(img);
            toast.success('Watermark image loaded!');
        };
        reader.readAsDataURL(file);
    }, [toast]);

    const positions = [
        { value: 'top-left', label: 'Top Left' },
        { value: 'top-center', label: 'Top Center' },
        { value: 'top-right', label: 'Top Right' },
        { value: 'center-left', label: 'Center Left' },
        { value: 'center', label: 'Center' },
        { value: 'center-right', label: 'Center Right' },
        { value: 'bottom-left', label: 'Bottom Left' },
        { value: 'bottom-center', label: 'Bottom Center' },
        { value: 'bottom-right', label: 'Bottom Right' }
    ];

    const fonts = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Impact'];

    // Calculate watermark position
    const getPosition = (canvasWidth, canvasHeight, watermarkWidth, watermarkHeight) => {
        const pad = padding;
        switch (position) {
            case 'top-left': return { x: pad, y: pad + watermarkHeight };
            case 'top-center': return { x: (canvasWidth - watermarkWidth) / 2, y: pad + watermarkHeight };
            case 'top-right': return { x: canvasWidth - watermarkWidth - pad, y: pad + watermarkHeight };
            case 'center-left': return { x: pad, y: canvasHeight / 2 };
            case 'center': return { x: (canvasWidth - watermarkWidth) / 2, y: canvasHeight / 2 };
            case 'center-right': return { x: canvasWidth - watermarkWidth - pad, y: canvasHeight / 2 };
            case 'bottom-left': return { x: pad, y: canvasHeight - pad };
            case 'bottom-center': return { x: (canvasWidth - watermarkWidth) / 2, y: canvasHeight - pad };
            case 'bottom-right':
            default: return { x: canvasWidth - watermarkWidth - pad, y: canvasHeight - pad };
        }
    };

    // Generate preview
    const generatePreview = useCallback(() => {
        if (!imageObj) return;

        const { canvas, ctx } = createCanvas(imageObj.width, imageObj.height);

        // Draw original image
        ctx.drawImage(imageObj, 0, 0);

        // Set opacity
        ctx.globalAlpha = opacity / 100;

        if (watermarkType === 'text') {
            // Text watermark
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.fillStyle = textColor;
            ctx.textBaseline = 'bottom';

            const metrics = ctx.measureText(text);
            const textWidth = metrics.width;
            const textHeight = fontSize;

            if (tiled) {
                // Tiled watermark
                ctx.save();
                for (let y = 0; y < imageObj.height + textHeight; y += textHeight + tileSpacing) {
                    for (let x = 0; x < imageObj.width + textWidth; x += textWidth + tileSpacing) {
                        ctx.save();
                        ctx.translate(x + textWidth / 2, y + textHeight / 2);
                        ctx.rotate((rotation * Math.PI) / 180);
                        ctx.fillText(text, -textWidth / 2, textHeight / 2);
                        ctx.restore();
                    }
                }
                ctx.restore();
            } else {
                // Single watermark
                const pos = getPosition(imageObj.width, imageObj.height, textWidth, textHeight);
                ctx.save();
                ctx.translate(pos.x + textWidth / 2, pos.y - textHeight / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.fillText(text, -textWidth / 2, textHeight / 2);
                ctx.restore();
            }
        } else if (watermarkType === 'image' && watermarkImageObj) {
            // Image watermark
            const wmWidth = (imageObj.width * watermarkScale) / 100;
            const wmHeight = (watermarkImageObj.height / watermarkImageObj.width) * wmWidth;

            if (tiled) {
                for (let y = 0; y < imageObj.height; y += wmHeight + tileSpacing) {
                    for (let x = 0; x < imageObj.width; x += wmWidth + tileSpacing) {
                        ctx.save();
                        ctx.translate(x + wmWidth / 2, y + wmHeight / 2);
                        ctx.rotate((rotation * Math.PI) / 180);
                        ctx.drawImage(watermarkImageObj, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
                        ctx.restore();
                    }
                }
            } else {
                const pos = getPosition(imageObj.width, imageObj.height, wmWidth, wmHeight);
                ctx.save();
                ctx.translate(pos.x + wmWidth / 2, pos.y - wmHeight / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.drawImage(watermarkImageObj, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
                ctx.restore();
            }
        }

        ctx.globalAlpha = 1;
        setPreview(canvas.toDataURL('image/png'));
    }, [imageObj, watermarkType, text, fontSize, fontFamily, textColor, opacity, position, padding, rotation, tiled, tileSpacing, watermarkImageObj, watermarkScale]);

    // Update preview on settings change
    useEffect(() => {
        generatePreview();
    }, [generatePreview]);

    const download = () => {
        if (!preview) return;
        downloadDataUrl(preview, 'watermarked-image.png');
        toast.success('Downloaded!');
    };

    const faqs = [
        { question: 'What types of watermarks can I add?', answer: 'You can add text watermarks with custom fonts, colors, and sizes, or upload a logo/image as a watermark.' },
        { question: 'Can I create tiled watermarks?', answer: 'Yes! Enable the "Tiled" option to repeat the watermark across the entire image. Adjust spacing as needed.' },
        { question: 'Is my image uploaded anywhere?', answer: 'No. All processing happens locally in your browser. Your images stay on your device.' }
    ];

    const seoContent = (
        <>
            <h2>Image Watermark Tool</h2>
            <p>Add text or image watermarks to protect your photos. Customize fonts, colors, opacity, position, and rotation. Create tiled watermarks for full coverage. All processing is done locally.</p>
        </>
    );

    return (
        <ToolLayout
            title="Image Watermark"
            description="Add text or image watermarks to your photos. Protect your images with custom watermarks."
            keywords={['watermark', 'image watermark', 'add watermark', 'photo protection', 'copyright']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form tool-form-wide">
                <DragDropUpload
                    id="watermark-upload"
                    onUpload={handleUpload}
                    label="Drop your image here"
                />

                {image && (
                    <div className="watermark-editor">
                        {/* Preview */}
                        <div className="preview-section">
                            {preview && (
                                <img src={preview} alt="Preview" className="watermark-preview" />
                            )}
                        </div>

                        {/* Settings */}
                        <div className="settings-panel">
                            {/* Watermark Type */}
                            <div className="type-toggle">
                                <button
                                    className={`toggle-btn ${watermarkType === 'text' ? 'active' : ''}`}
                                    onClick={() => setWatermarkType('text')}
                                >
                                    📝 Text
                                </button>
                                <button
                                    className={`toggle-btn ${watermarkType === 'image' ? 'active' : ''}`}
                                    onClick={() => setWatermarkType('image')}
                                >
                                    🖼️ Image
                                </button>
                            </div>

                            {watermarkType === 'text' ? (
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Watermark Text</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="© Your Name"
                                        />
                                    </div>

                                    <div className="options-row">
                                        <div className="form-group">
                                            <label className="form-label">Font</label>
                                            <select
                                                className="form-select"
                                                value={fontFamily}
                                                onChange={(e) => setFontFamily(e.target.value)}
                                            >
                                                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Size: {fontSize}px</label>
                                            <input
                                                type="range"
                                                min="12"
                                                max="200"
                                                value={fontSize}
                                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Color</label>
                                            <input
                                                type="color"
                                                value={textColor}
                                                onChange={(e) => setTextColor(e.target.value)}
                                                className="color-input"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Watermark Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleWatermarkImageUpload}
                                        className="file-input"
                                    />
                                    {watermarkImage && (
                                        <div className="watermark-thumb">
                                            <img src={watermarkImage} alt="Watermark" />
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label className="form-label">Size: {watermarkScale}%</label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="50"
                                            value={watermarkScale}
                                            onChange={(e) => setWatermarkScale(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Common Options */}
                            <div className="options-row">
                                <div className="form-group">
                                    <label className="form-label">Opacity: {opacity}%</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={opacity}
                                        onChange={(e) => setOpacity(parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Rotation: {rotation}°</label>
                                    <input
                                        type="range"
                                        min="-45"
                                        max="45"
                                        value={rotation}
                                        onChange={(e) => setRotation(parseInt(e.target.value))}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Position</label>
                                <div className="position-grid">
                                    {positions.map(pos => (
                                        <button
                                            key={pos.value}
                                            className={`position-btn ${position === pos.value ? 'active' : ''}`}
                                            onClick={() => setPosition(pos.value)}
                                            disabled={tiled}
                                            title={pos.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Padding: {padding}px</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={padding}
                                    onChange={(e) => setPadding(parseInt(e.target.value))}
                                    disabled={tiled}
                                />
                            </div>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={tiled}
                                    onChange={(e) => setTiled(e.target.checked)}
                                />
                                <span>Tiled (repeat watermark)</span>
                            </label>

                            {tiled && (
                                <div className="form-group">
                                    <label className="form-label">Tile Spacing: {tileSpacing}px</label>
                                    <input
                                        type="range"
                                        min="20"
                                        max="300"
                                        value={tileSpacing}
                                        onChange={(e) => setTileSpacing(parseInt(e.target.value))}
                                    />
                                </div>
                            )}

                            <button className="btn btn-primary btn-lg btn-full" onClick={download}>
                                ⬇️ Download Watermarked Image
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form-wide { max-width: 1000px; }
        
        .watermark-editor {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .preview-section {
          background: #f0f0f0;
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        
        .watermark-preview {
          max-width: 100%;
          max-height: 500px;
          border-radius: var(--radius);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .settings-panel {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .type-toggle {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .toggle-btn {
          flex: 1;
          padding: var(--spacing-sm);
          background: white;
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.15s ease;
        }
        
        .toggle-btn.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }
        
        .options-row {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .options-row .form-group {
          flex: 1;
          min-width: 80px;
        }
        
        .color-input {
          width: 100%;
          height: 40px;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
        }
        
        .file-input {
          width: 100%;
          padding: var(--spacing-sm);
          border: 2px dashed var(--platinum);
          border-radius: var(--radius);
        }
        
        .watermark-thumb {
          margin-top: var(--spacing-sm);
          text-align: center;
        }
        
        .watermark-thumb img {
          max-width: 100px;
          max-height: 60px;
          border-radius: var(--radius);
        }
        
        .position-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          width: 100px;
        }
        
        .position-btn {
          width: 30px;
          height: 30px;
          border: 2px solid var(--platinum);
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .position-btn:hover:not(:disabled) {
          border-color: var(--yinmn-blue);
        }
        
        .position-btn.active {
          background: var(--yinmn-blue);
          border-color: var(--yinmn-blue);
        }
        
        .position-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }
        
        .btn-full { width: 100%; }
        
        @media (max-width: 768px) {
          .watermark-editor {
            grid-template-columns: 1fr;
          }
          
          .preview-section {
            min-height: 250px;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ImageWatermark;
