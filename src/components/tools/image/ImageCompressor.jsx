import { useState, useRef, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { loadImage, createCanvas, formatFileSize, downloadDataUrl } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const ImageCompressor = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [quality, setQuality] = useState(80);
    const [format, setFormat] = useState('image/jpeg');
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [maxWidth, setMaxWidth] = useState('');
    const [preserveSize, setPreserveSize] = useState(true);
    const [isCompressing, setIsCompressing] = useState(false);
    const canvasRef = useRef(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-compressor').slice(0, 3);

    const handleUpload = useCallback(({ dataUrl, fileSize, dimensions: dims }) => {
        setOriginalImage(dataUrl);
        setOriginalSize(fileSize);
        setDimensions(dims);
        setCompressedImage(null);
        setCompressedSize(0);
    }, []);

    const compress = useCallback(async () => {
        if (!originalImage) return;

        setIsCompressing(true);

        try {
            const img = await loadImage(originalImage);

            let targetWidth = img.width;
            let targetHeight = img.height;

            // Apply max width constraint if set
            if (!preserveSize && maxWidth && parseInt(maxWidth) < img.width) {
                const ratio = parseInt(maxWidth) / img.width;
                targetWidth = parseInt(maxWidth);
                targetHeight = Math.round(img.height * ratio);
            }

            const { canvas, ctx } = createCanvas(targetWidth, targetHeight);

            // Use high quality scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Fill white background for JPEG (no transparency)
            if (format === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, targetWidth, targetHeight);
            }

            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const compressedDataUrl = canvas.toDataURL(format, quality / 100);

            // Calculate compressed size (base64 to approximate bytes)
            const base64Length = compressedDataUrl.split(',')[1].length;
            const sizeInBytes = Math.round((base64Length * 3) / 4);

            setCompressedImage(compressedDataUrl);
            setCompressedSize(sizeInBytes);
            setDimensions({ width: targetWidth, height: targetHeight });
        } catch (error) {
            console.error('Compression failed:', error);
        }

        setIsCompressing(false);
    }, [originalImage, quality, format, preserveSize, maxWidth]);

    const download = () => {
        if (!compressedImage) return;

        const extension = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
        const filename = `compressed-${quality}q.${extension}`;
        downloadDataUrl(compressedImage, filename);
    };

    const savings = originalSize > 0 && compressedSize > 0
        ? Math.round((1 - compressedSize / originalSize) * 100)
        : 0;

    const faqs = [
        {
            question: 'How does image compression work?',
            answer: 'Image compression reduces file size by removing unnecessary data. JPEG uses lossy compression (some quality loss for smaller files), while PNG uses lossless compression (no quality loss). WebP offers both options with better compression.'
        },
        {
            question: 'What quality setting should I use?',
            answer: 'For web images, 70-80% quality is usually ideal - good balance between size and quality. For photos where quality matters, use 85-90%. Below 60% may show visible artifacts.'
        },
        {
            question: 'Which format should I choose?',
            answer: 'Use JPEG for photos and complex images. Use PNG for images with transparency or sharp edges (logos, icons). WebP offers the best compression and supports both, but check browser compatibility.'
        },
        {
            question: 'Does compressing affect my original image?',
            answer: 'No! All processing happens locally in your browser. Your original file remains unchanged, and you download a new compressed copy.'
        }
    ];

    const seoContent = (
        <>
            <h2>Free Online Image Compressor</h2>
            <p>Compress images to reduce file size while maintaining quality. Perfect for optimizing images for websites, emails, and social media. Supports JPEG, PNG, and WebP formats with adjustable quality settings.</p>
            <h3>Features</h3>
            <ul>
                <li>Adjustable compression quality (1-100%)</li>
                <li>Multiple output formats: JPEG, PNG, WebP</li>
                <li>Optional image resizing for further size reduction</li>
                <li>Real-time size comparison and savings calculation</li>
                <li>100% client-side - your images never leave your device</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Image Compressor"
            description="Compress images online without losing quality. Reduce file size for faster loading websites and easier sharing."
            keywords={['image compressor', 'compress image', 'reduce image size', 'image optimizer', 'jpeg compressor', 'png compressor']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <DragDropUpload
                    id="compressor-upload"
                    onUpload={handleUpload}
                    label="Drop image here or click to upload"
                />

                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                {originalImage && (
                    <>
                        <div className="compression-controls">
                            {/* Quality Slider */}
                            <div className="slider-group">
                                <label>
                                    <span>Quality</span>
                                    <span>{quality}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    aria-label="Compression quality"
                                />
                            </div>

                            {/* Format Selection */}
                            <div className="form-group">
                                <label className="form-label">Output Format</label>
                                <select
                                    className="form-select"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    aria-label="Output format"
                                >
                                    <option value="image/jpeg">JPEG (best for photos)</option>
                                    <option value="image/png">PNG (lossless, larger)</option>
                                    <option value="image/webp">WebP (best compression)</option>
                                </select>
                            </div>

                            {/* Resize Option */}
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={preserveSize}
                                        onChange={(e) => setPreserveSize(e.target.checked)}
                                    />
                                    <span>Keep original dimensions</span>
                                </label>
                            </div>

                            {!preserveSize && (
                                <div className="form-group">
                                    <label className="form-label">Max Width (px)</label>
                                    <input
                                        type="number"
                                        className="form-input form-input-small"
                                        value={maxWidth}
                                        onChange={(e) => setMaxWidth(e.target.value)}
                                        placeholder="e.g., 1920"
                                        min="1"
                                    />
                                    <small className="form-hint">Height will scale proportionally</small>
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-lg btn-full"
                                onClick={compress}
                                disabled={isCompressing}
                            >
                                {isCompressing ? 'Compressing...' : '🗜️ Compress Image'}
                            </button>
                        </div>

                        {compressedImage && (
                            <div className="result-box">
                                {/* Size Comparison */}
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-label">Original</span>
                                        <span className="stat-value">{formatFileSize(originalSize)}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Compressed</span>
                                        <span className="stat-value">{formatFileSize(compressedSize)}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Savings</span>
                                        <span className={`stat-value ${savings > 0 ? 'positive' : 'negative'}`}>
                                            {savings > 0 ? '-' : '+'}{Math.abs(savings)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Dimensions */}
                                <div className="size-info">
                                    <span>Output: <strong>{dimensions.width} × {dimensions.height}</strong> px</span>
                                </div>

                                {/* Preview */}
                                <div className="preview-container">
                                    <img
                                        src={compressedImage}
                                        alt="Compressed preview"
                                        className="preview-image"
                                    />
                                </div>

                                {/* Download */}
                                <div className="btn-group" style={{ marginTop: 'var(--spacing-lg)' }}>
                                    <button className="btn btn-primary" onClick={download}>
                                        ⬇️ Download Compressed Image
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .compression-controls {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-lg);
          background: var(--bg-secondary, #f8f9fa);
          border-radius: var(--radius-lg);
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
          cursor: pointer;
        }
        
        .form-hint {
          display: block;
          margin-top: var(--spacing-xs);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
        
        .btn-full {
          width: 100%;
          margin-top: var(--spacing-md);
        }
        
        .stat-value.positive {
          color: var(--success, #28a745);
        }
        
        .stat-value.negative {
          color: var(--error, #dc3545);
        }
      `}</style>
        </ToolLayout>
    );
};

export default ImageCompressor;
