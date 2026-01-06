import { useState, useRef, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { loadImage, createCanvas, downloadDataUrl, socialMediaPresets, formatFileSize } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const ImageResizer = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [keepRatio, setKeepRatio] = useState(true);
    const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [format, setFormat] = useState('image/png');
    const [quality, setQuality] = useState(90);
    const canvasRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-resizer').slice(0, 3);

    const handleUpload = useCallback(({ dataUrl, dimensions }) => {
        setImage(dataUrl);
        setPreview(dataUrl);
        setOriginalSize({ w: dimensions.width, h: dimensions.height });
        setWidth(dimensions.width.toString());
        setHeight(dimensions.height.toString());
        setSelectedPreset(null);
        toast.success('Image loaded!');
    }, [toast]);

    const updateWidth = (val) => {
        setWidth(val);
        setSelectedPreset(null);
        if (keepRatio && originalSize.w) {
            setHeight(Math.round((val / originalSize.w) * originalSize.h).toString());
        }
    };

    const updateHeight = (val) => {
        setHeight(val);
        setSelectedPreset(null);
        if (keepRatio && originalSize.h) {
            setWidth(Math.round((val / originalSize.h) * originalSize.w).toString());
        }
    };

    const applyPreset = (platform, preset) => {
        setWidth(preset.width.toString());
        setHeight(preset.height.toString());
        setKeepRatio(false);
        setSelectedPreset(`${platform}-${preset.label}`);
        toast.info(`Applied: ${preset.label}`);
    };

    const resize = useCallback(async () => {
        if (!image) {
            toast.warning('Upload an image first');
            return;
        }

        try {
            const img = await loadImage(image);
            const targetWidth = parseInt(width);
            const targetHeight = parseInt(height);

            if (!targetWidth || !targetHeight) {
                toast.error('Please enter valid dimensions');
                return;
            }

            const { canvas, ctx } = createCanvas(targetWidth, targetHeight);

            // High quality scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Fill background for JPEG
            if (format === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, targetWidth, targetHeight);
            }

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const qualityValue = format === 'image/png' ? undefined : quality / 100;
            const resizedDataUrl = canvas.toDataURL(format, qualityValue);
            setPreview(resizedDataUrl);
            toast.success(`Resized to ${targetWidth}×${targetHeight}`);
        } catch (error) {
            toast.error('Failed to resize image');
        }
    }, [image, width, height, format, quality, toast]);

    const download = () => {
        if (!preview) return;
        const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
        const filename = `resized-${width}x${height}.${ext}`;
        downloadDataUrl(preview, filename);
        toast.success('Image downloaded!');
    };

    const faqs = [
        { question: 'Does resizing affect image quality?', answer: 'Enlarging images can cause pixelation. Reducing size maintains quality. For best results, start with high-resolution images.' },
        { question: 'What is aspect ratio?', answer: 'Aspect ratio is width:height proportion. Keeping it preserves the image shape. Common ratios: 16:9, 4:3, 1:1.' },
        { question: 'Which format should I use?', answer: 'PNG for transparency, JPEG for photos (smaller files), WebP for best compression with good quality.' }
    ];

    const seoContent = (
        <>
            <h2>Image Resizer</h2>
            <p>Resize images to any dimension online. Use social media presets for Instagram, Facebook, Twitter, LinkedIn, and YouTube. Maintain aspect ratio or set custom dimensions. All processing happens locally.</p>
        </>
    );

    // Flatten presets for display
    const presetGroups = Object.entries(socialMediaPresets);

    return (
        <ToolLayout
            title="Image Resizer"
            description="Resize images online. Change dimensions with social media presets or custom sizes."
            keywords={['image resizer', 'resize image', 'change image size', 'photo resizer', 'social media image size']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <DragDropUpload
                    id="resize-upload"
                    onUpload={handleUpload}
                    label="Drop image here or click to upload"
                />

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {image && (
                    <>
                        {/* Original Info */}
                        <div className="size-info">
                            <span>Original: <strong>{originalSize.w} × {originalSize.h}</strong> px</span>
                        </div>

                        {/* Social Media Presets */}
                        <div className="presets-section">
                            <label className="form-label">Social Media Presets</label>
                            <div className="preset-tabs">
                                {presetGroups.map(([platform, presets]) => (
                                    <div key={platform} className="preset-group">
                                        <span className="preset-platform">{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                                        <div className="preset-buttons">
                                            {Object.entries(presets).map(([key, preset]) => (
                                                <button
                                                    key={key}
                                                    className={`preset-btn ${selectedPreset === `${platform}-${preset.label}` ? 'active' : ''}`}
                                                    onClick={() => applyPreset(platform, preset)}
                                                    aria-label={`Apply ${preset.label} preset (${preset.width}×${preset.height})`}
                                                >
                                                    <span className="preset-btn-name">{preset.label}</span>
                                                    <span className="preset-btn-size">{preset.width}×{preset.height}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Custom Dimensions */}
                        <div className="dimensions-section">
                            <label className="form-label">Custom Dimensions</label>
                            <div className="size-inputs">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="resize-width">Width (px)</label>
                                    <input
                                        id="resize-width"
                                        type="number"
                                        className="form-input"
                                        value={width}
                                        onChange={(e) => updateWidth(e.target.value)}
                                        min="1"
                                        aria-label="Width in pixels"
                                    />
                                </div>
                                <span className="dimension-separator">×</span>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="resize-height">Height (px)</label>
                                    <input
                                        id="resize-height"
                                        type="number"
                                        className="form-input"
                                        value={height}
                                        onChange={(e) => updateHeight(e.target.value)}
                                        min="1"
                                        aria-label="Height in pixels"
                                    />
                                </div>
                            </div>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={keepRatio}
                                    onChange={(e) => setKeepRatio(e.target.checked)}
                                />
                                <span>Lock aspect ratio</span>
                            </label>
                        </div>

                        {/* Format & Quality */}
                        <div className="format-section">
                            <div className="form-group">
                                <label className="form-label" htmlFor="resize-format">Output Format</label>
                                <select
                                    id="resize-format"
                                    className="form-select"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    <option value="image/png">PNG (lossless)</option>
                                    <option value="image/jpeg">JPEG (smaller)</option>
                                    <option value="image/webp">WebP (best)</option>
                                </select>
                            </div>

                            {format !== 'image/png' && (
                                <div className="slider-group">
                                    <label>
                                        <span>Quality</span>
                                        <span>{quality}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => setQuality(parseInt(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="btn-group">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={resize}
                                aria-label="Resize image"
                            >
                                📐 Resize
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={download}
                                disabled={!preview || preview === image}
                                aria-label="Download resized image"
                            >
                                ⬇️ Download
                            </button>
                        </div>

                        {/* Preview */}
                        {preview && (
                            <div className="preview-container">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="preview-image"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .tool-form { max-width: 800px; margin: 0 auto; }
        
        .presets-section {
          margin: var(--spacing-lg) 0;
        }
        
        .preset-tabs {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .preset-group {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius);
        }
        
        .preset-platform {
          display: block;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--yinmn-blue);
          font-size: var(--text-sm);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .preset-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }
        
        .preset-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: white;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }
        
        .preset-btn:hover {
          border-color: var(--yinmn-blue);
        }
        
        .preset-btn.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }
        
        .preset-btn-name {
          display: block;
          font-weight: 500;
          font-size: var(--text-sm);
        }
        
        .preset-btn-size {
          font-size: var(--text-xs);
          opacity: 0.7;
        }
        
        .dimensions-section {
          margin: var(--spacing-lg) 0;
        }
        
        .size-inputs {
          display: flex;
          align-items: flex-end;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .size-inputs .form-group {
          flex: 1;
          max-width: 150px;
        }
        
        .dimension-separator {
          font-size: var(--text-xl);
          padding-bottom: var(--spacing-sm);
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }
        
        .checkbox-label input {
          width: 18px;
          height: 18px;
        }
        
        .format-section {
          margin: var(--spacing-lg) 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          align-items: start;
        }
        
        .preview-container {
          margin-top: var(--spacing-xl);
          text-align: center;
        }
        
        .preview-image {
          max-width: 100%;
          max-height: 400px;
          border-radius: var(--radius);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        @media (max-width: 480px) {
          .format-section {
            grid-template-columns: 1fr;
          }
          
          .size-inputs {
            flex-wrap: wrap;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ImageResizer;
