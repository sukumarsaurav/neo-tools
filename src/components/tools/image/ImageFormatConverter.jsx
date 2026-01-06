import { useState, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { loadImage, createCanvas, downloadDataUrl, formatFileSize } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const ImageFormatConverter = () => {
    const [originalImage, setOriginalImage] = useState(null);
    const [originalFormat, setOriginalFormat] = useState('');
    const [originalSize, setOriginalSize] = useState(0);
    const [convertedImage, setConvertedImage] = useState(null);
    const [convertedSize, setConvertedSize] = useState(0);
    const [targetFormat, setTargetFormat] = useState('image/webp');
    const [quality, setQuality] = useState(90);
    const [isConverting, setIsConverting] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-format-converter').slice(0, 3);

    const formats = [
        { value: 'image/png', label: 'PNG', description: 'Lossless, supports transparency', lossy: false },
        { value: 'image/jpeg', label: 'JPEG', description: 'Best for photos, smaller size', lossy: true },
        { value: 'image/webp', label: 'WebP', description: 'Modern format, best compression', lossy: true },
        { value: 'image/gif', label: 'GIF', description: 'Limited colors, supports animation', lossy: false },
        { value: 'image/bmp', label: 'BMP', description: 'Uncompressed, large files', lossy: false }
    ];

    const getFormatFromMime = (mime) => {
        const map = {
            'image/png': 'PNG',
            'image/jpeg': 'JPEG',
            'image/webp': 'WebP',
            'image/gif': 'GIF',
            'image/bmp': 'BMP',
            'image/svg+xml': 'SVG'
        };
        return map[mime] || 'Unknown';
    };

    const handleUpload = useCallback(({ dataUrl, fileSize, dimensions: dims }) => {
        setOriginalImage(dataUrl);
        setOriginalSize(fileSize);
        setDimensions(dims);
        setConvertedImage(null);
        setConvertedSize(0);

        // Detect original format
        const match = dataUrl.match(/^data:([^;]+);/);
        if (match) {
            setOriginalFormat(match[1]);
        }
    }, []);

    const convert = useCallback(async () => {
        if (!originalImage) return;

        setIsConverting(true);

        try {
            const img = await loadImage(originalImage);
            const { canvas, ctx } = createCanvas(img.width, img.height);

            // Fill white background for JPEG (no transparency support)
            if (targetFormat === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, img.width, img.height);
            }

            ctx.drawImage(img, 0, 0);

            // Convert with quality for lossy formats
            const isLossy = formats.find(f => f.value === targetFormat)?.lossy;
            const convertedDataUrl = isLossy
                ? canvas.toDataURL(targetFormat, quality / 100)
                : canvas.toDataURL(targetFormat);

            // Calculate size
            const base64Length = convertedDataUrl.split(',')[1].length;
            const sizeInBytes = Math.round((base64Length * 3) / 4);

            setConvertedImage(convertedDataUrl);
            setConvertedSize(sizeInBytes);
        } catch (error) {
            console.error('Conversion failed:', error);
        }

        setIsConverting(false);
    }, [originalImage, targetFormat, quality]);

    const download = () => {
        if (!convertedImage) return;

        const extensions = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/webp': 'webp',
            'image/gif': 'gif',
            'image/bmp': 'bmp'
        };
        const ext = extensions[targetFormat] || 'png';
        const filename = `converted.${ext}`;
        downloadDataUrl(convertedImage, filename);
    };

    const selectedFormat = formats.find(f => f.value === targetFormat);
    const sizeChange = originalSize > 0 && convertedSize > 0
        ? Math.round((1 - convertedSize / originalSize) * 100)
        : 0;

    const faqs = [
        {
            question: 'Which format should I choose?',
            answer: 'Use PNG for images with transparency or sharp edges. JPEG for photos. WebP for best compression with good quality. GIF for simple animations.'
        },
        {
            question: 'What is lossless vs lossy compression?',
            answer: 'Lossless (PNG, GIF) preserves all image data exactly. Lossy (JPEG, WebP) discards some data for smaller files, which may reduce quality at low settings.'
        },
        {
            question: 'Why is my converted file larger?',
            answer: 'Converting to lossless formats (PNG, BMP) from lossy formats (JPEG) will increase file size because they preserve more data.'
        }
    ];

    const seoContent = (
        <>
            <h2>Free Image Format Converter</h2>
            <p>Convert images between PNG, JPEG, WebP, GIF, and BMP formats. Adjust quality settings for optimal file size. All processing happens locally - your images stay private.</p>
        </>
    );

    return (
        <ToolLayout
            title="Image Format Converter"
            description="Convert images between PNG, JPEG, WebP, GIF, and BMP formats online for free."
            keywords={['image converter', 'convert png to jpg', 'convert to webp', 'image format converter']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <DragDropUpload
                    id="converter-upload"
                    onUpload={handleUpload}
                    label="Drop image here or click to upload"
                />

                {originalImage && (
                    <>
                        {/* Original Info */}
                        <div className="original-info">
                            <div className="info-badge">
                                Original: <strong>{getFormatFromMime(originalFormat)}</strong>
                            </div>
                            <div className="info-badge">
                                {dimensions.width} × {dimensions.height} px
                            </div>
                            <div className="info-badge">
                                {formatFileSize(originalSize)}
                            </div>
                        </div>

                        {/* Format Selection */}
                        <div className="format-selection">
                            <label className="form-label">Convert to:</label>
                            <div className="format-grid">
                                {formats.map(({ value, label, description }) => (
                                    <button
                                        key={value}
                                        className={`format-btn ${targetFormat === value ? 'active' : ''}`}
                                        onClick={() => setTargetFormat(value)}
                                        disabled={value === originalFormat}
                                    >
                                        <span className="format-name">{label}</span>
                                        <span className="format-desc">{description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quality Slider (for lossy formats) */}
                        {selectedFormat?.lossy && (
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
                                />
                                <small className="quality-hint">
                                    {quality < 50 ? 'Low - Smallest file, visible artifacts' :
                                        quality < 75 ? 'Medium - Good balance' :
                                            quality < 90 ? 'High - Recommended' : 'Maximum - Best quality'}
                                </small>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-lg btn-full"
                            onClick={convert}
                            disabled={isConverting || targetFormat === originalFormat}
                        >
                            {isConverting ? 'Converting...' : `🔄 Convert to ${selectedFormat?.label}`}
                        </button>

                        {convertedImage && (
                            <div className="result-box">
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-label">Original</span>
                                        <span className="stat-value">{formatFileSize(originalSize)}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Converted</span>
                                        <span className="stat-value">{formatFileSize(convertedSize)}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Change</span>
                                        <span className={`stat-value ${sizeChange > 0 ? 'positive' : sizeChange < 0 ? 'negative' : ''}`}>
                                            {sizeChange > 0 ? '-' : sizeChange < 0 ? '+' : ''}{Math.abs(sizeChange)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="preview-container">
                                    <img src={convertedImage} alt="Converted" className="preview-image" />
                                </div>

                                <div className="btn-group" style={{ marginTop: 'var(--spacing-md)' }}>
                                    <button className="btn btn-primary" onClick={download}>
                                        ⬇️ Download {selectedFormat?.label}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .original-info {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          justify-content: center;
          margin: var(--spacing-lg) 0;
        }
        
        .info-badge {
          background: var(--bg-secondary);
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius);
          font-size: var(--text-sm);
        }
        
        .format-selection {
          margin: var(--spacing-lg) 0;
        }
        
        .format-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: var(--spacing-sm);
        }
        
        .format-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: var(--spacing-md);
          background: var(--bg-secondary);
          border: 2px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        
        .format-btn:hover:not(:disabled) {
          border-color: var(--yinmn-blue);
        }
        
        .format-btn.active {
          border-color: var(--yinmn-blue);
          background: var(--yinmn-blue);
          color: white;
        }
        
        .format-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .format-name {
          font-weight: 600;
          font-size: var(--text-lg);
        }
        
        .format-desc {
          font-size: var(--text-xs);
          opacity: 0.8;
          margin-top: var(--spacing-xs);
        }
        
        .quality-hint {
          display: block;
          margin-top: var(--spacing-xs);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
        
        .btn-full {
          width: 100%;
          margin-top: var(--spacing-lg);
        }
        
        .stat-value.positive { color: var(--success, #28a745); }
        .stat-value.negative { color: var(--error, #dc3545); }
      `}</style>
        </ToolLayout>
    );
};

export default ImageFormatConverter;
