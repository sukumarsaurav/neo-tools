import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import { loadImage, createCanvas, socialMediaPresets } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const BatchImageResizer = () => {
    const [images, setImages] = useState([]);
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [keepRatio, setKeepRatio] = useState(true);
    const [resizeMode, setResizeMode] = useState('fit'); // 'fit', 'fill', 'exact'
    const [format, setFormat] = useState('image/jpeg');
    const [quality, setQuality] = useState(85);
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState([]);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'batch-image-resizer').slice(0, 3);

    // Handle multiple file upload
    const handleFilesUpload = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const validFiles = files.filter(f => f.type.startsWith('image/'));
        if (validFiles.length === 0) {
            toast.error('Please upload valid image files');
            return;
        }

        if (validFiles.length > 50) {
            toast.warning('Maximum 50 images allowed');
            validFiles.splice(50);
        }

        // Read all files
        const loadPromises = validFiles.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        resolve({
                            name: file.name,
                            dataUrl: e.target.result,
                            width: img.width,
                            height: img.height,
                            size: file.size
                        });
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(loadPromises).then(loadedImages => {
            setImages(loadedImages);
            setResults([]);
            toast.success(`Loaded ${loadedImages.length} images`);
        });
    }, [toast]);

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setResults([]);
    };

    const clearAll = () => {
        setImages([]);
        setResults([]);
    };

    const applyPreset = (platform, preset) => {
        setWidth(preset.width);
        setHeight(preset.height);
        setKeepRatio(false);
        setResizeMode('exact');
        setSelectedPreset(`${platform}-${preset.label}`);
        toast.info(`Applied: ${preset.label}`);
    };

    // Calculate output dimensions based on mode
    const calculateDimensions = (originalWidth, originalHeight, targetWidth, targetHeight, mode) => {
        if (mode === 'exact') {
            return { width: targetWidth, height: targetHeight };
        }

        const aspectRatio = originalWidth / originalHeight;
        const targetRatio = targetWidth / targetHeight;

        if (mode === 'fit') {
            // Fit inside the target dimensions
            if (aspectRatio > targetRatio) {
                return { width: targetWidth, height: Math.round(targetWidth / aspectRatio) };
            } else {
                return { width: Math.round(targetHeight * aspectRatio), height: targetHeight };
            }
        } else if (mode === 'fill') {
            // Fill the target dimensions (crop)
            if (aspectRatio > targetRatio) {
                return { width: Math.round(targetHeight * aspectRatio), height: targetHeight };
            } else {
                return { width: targetWidth, height: Math.round(targetWidth / aspectRatio) };
            }
        }

        return { width: targetWidth, height: targetHeight };
    };

    // Process all images
    const processImages = async () => {
        if (images.length === 0) {
            toast.warning('Upload images first');
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setResults([]);

        const processedImages = [];

        for (let i = 0; i < images.length; i++) {
            const img = images[i];

            try {
                const loadedImg = await loadImage(img.dataUrl);
                const dims = keepRatio
                    ? calculateDimensions(img.width, img.height, width, height, resizeMode)
                    : { width, height };

                const { canvas, ctx } = createCanvas(dims.width, dims.height);

                // High quality scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Fill background for JPEG
                if (format === 'image/jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, dims.width, dims.height);
                }

                // Calculate source and destination for fill mode
                let sx = 0, sy = 0, sw = loadedImg.width, sh = loadedImg.height;
                let dx = 0, dy = 0, dw = dims.width, dh = dims.height;

                if (resizeMode === 'fill' && keepRatio) {
                    // Center crop for fill mode
                    const srcAspect = loadedImg.width / loadedImg.height;
                    const dstAspect = dims.width / dims.height;

                    if (srcAspect > dstAspect) {
                        sw = loadedImg.height * dstAspect;
                        sx = (loadedImg.width - sw) / 2;
                    } else {
                        sh = loadedImg.width / dstAspect;
                        sy = (loadedImg.height - sh) / 2;
                    }
                }

                ctx.drawImage(loadedImg, sx, sy, sw, sh, dx, dy, dw, dh);

                const qualityValue = format === 'image/png' ? undefined : quality / 100;
                const dataUrl = canvas.toDataURL(format, qualityValue);

                // Calculate file size
                const base64Length = dataUrl.split(',')[1].length;
                const sizeKB = Math.round((base64Length * 3) / 4 / 1024);

                processedImages.push({
                    name: getOutputFilename(img.name),
                    dataUrl,
                    width: dims.width,
                    height: dims.height,
                    sizeKB
                });

            } catch (error) {
                console.error(`Failed to process ${img.name}:`, error);
                toast.error(`Failed: ${img.name}`);
            }

            setProgress(Math.round(((i + 1) / images.length) * 100));
        }

        setResults(processedImages);
        setIsProcessing(false);
        toast.success(`Processed ${processedImages.length} images!`);
    };

    const getOutputFilename = (originalName) => {
        const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
        const baseName = originalName.replace(/\.[^.]+$/, '');
        return `${baseName}-${width}x${height}.${ext}`;
    };

    // Download single result
    const downloadSingle = (result) => {
        const link = document.createElement('a');
        link.download = result.name;
        link.href = result.dataUrl;
        link.click();
        toast.success(`Downloaded ${result.name}`);
    };

    // Download all as ZIP
    const downloadAllAsZip = async () => {
        if (results.length === 0) return;

        toast.info('Creating ZIP file...');

        try {
            const zip = new JSZip();

            results.forEach(result => {
                const base64 = result.dataUrl.split(',')[1];
                zip.file(result.name, base64, { base64: true });
            });

            const content = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.download = `resized-images-${width}x${height}.zip`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('Downloaded ZIP!');
        } catch (error) {
            toast.error('Failed to create ZIP');
        }
    };

    // Format file size
    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Quick presets
    const quickPresets = [
        { label: 'HD', width: 1920, height: 1080 },
        { label: 'Full HD', width: 1920, height: 1080 },
        { label: '4K', width: 3840, height: 2160 },
        { label: 'Web', width: 1200, height: 800 },
        { label: 'Thumbnail', width: 300, height: 200 },
        { label: 'Square', width: 1000, height: 1000 }
    ];

    const faqs = [
        { question: 'How many images can I process at once?', answer: 'You can process up to 50 images at a time. All processing happens locally in your browser.' },
        { question: 'What is the difference between Fit and Fill?', answer: 'Fit: Image scales to fit within dimensions (may have gaps). Fill: Image fills dimensions completely (may crop). Exact: Forces exact dimensions (may distort).' },
        { question: 'Are my images uploaded anywhere?', answer: 'No! All processing is done locally in your browser. Your images never leave your device.' }
    ];

    const seoContent = (
        <>
            <h2>Batch Image Resizer</h2>
            <p>Resize multiple images at once. Upload up to 50 images and resize them all with the same settings. Choose from social media presets or custom dimensions. Download individually or as a ZIP file.</p>
        </>
    );

    const presetGroups = Object.entries(socialMediaPresets);

    return (
        <ToolLayout
            title="Batch Image Resizer"
            description="Resize multiple images at once. Batch process up to 50 images with custom or preset dimensions."
            keywords={['batch image resizer', 'bulk resize', 'multiple images', 'mass resize', 'batch processing']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form tool-form-wide">
                {/* Upload Area */}
                <div className="batch-upload">
                    <input
                        type="file"
                        id="batch-upload-input"
                        multiple
                        accept="image/*"
                        onChange={handleFilesUpload}
                    />
                    <label htmlFor="batch-upload-input">
                        <span className="upload-icon">📁</span>
                        <span className="upload-text">Drop multiple images or click to upload</span>
                        <span className="upload-hint">Up to 50 images • JPG, PNG, WebP, GIF</span>
                    </label>
                </div>

                {/* Image List */}
                {images.length > 0 && (
                    <div className="image-list-section">
                        <div className="section-header">
                            <h4>{images.length} Images Selected</h4>
                            <button className="btn btn-sm btn-secondary" onClick={clearAll}>
                                Clear All
                            </button>
                        </div>
                        <div className="image-list">
                            {images.map((img, index) => (
                                <div key={index} className="image-item">
                                    <img src={img.dataUrl} alt={img.name} className="image-thumb" />
                                    <div className="image-info">
                                        <span className="image-name">{img.name}</span>
                                        <span className="image-meta">{img.width}×{img.height} • {formatSize(img.size)}</span>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeImage(index)}
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Settings */}
                {images.length > 0 && (
                    <div className="settings-section">
                        {/* Quick Presets */}
                        <div className="quick-presets">
                            <label className="form-label">Quick Presets</label>
                            <div className="preset-row">
                                {quickPresets.map(preset => (
                                    <button
                                        key={preset.label}
                                        className={`preset-chip ${width === preset.width && height === preset.height ? 'active' : ''}`}
                                        onClick={() => {
                                            setWidth(preset.width);
                                            setHeight(preset.height);
                                            setSelectedPreset(null);
                                        }}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Presets (Collapsible) */}
                        <details className="social-presets">
                            <summary>Social Media Presets</summary>
                            <div className="preset-tabs">
                                {presetGroups.map(([platform, presets]) => (
                                    <div key={platform} className="preset-group-inline">
                                        <span className="preset-platform">{platform}</span>
                                        {Object.entries(presets).map(([key, preset]) => (
                                            <button
                                                key={key}
                                                className={`preset-chip ${selectedPreset === `${platform}-${preset.label}` ? 'active' : ''}`}
                                                onClick={() => applyPreset(platform, preset)}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </details>

                        {/* Dimensions */}
                        <div className="dimensions-row">
                            <div className="form-group">
                                <label className="form-label">Width (px)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={width}
                                    onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="10000"
                                />
                            </div>
                            <span className="dimension-x">×</span>
                            <div className="form-group">
                                <label className="form-label">Height (px)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    value={height}
                                    onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="10000"
                                />
                            </div>
                        </div>

                        {/* Options Row */}
                        <div className="options-row">
                            <div className="form-group">
                                <label className="form-label">Resize Mode</label>
                                <select
                                    className="form-select"
                                    value={resizeMode}
                                    onChange={(e) => setResizeMode(e.target.value)}
                                >
                                    <option value="fit">Fit (no crop)</option>
                                    <option value="fill">Fill (crop to fit)</option>
                                    <option value="exact">Exact (may distort)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Format</label>
                                <select
                                    className="form-select"
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                >
                                    <option value="image/jpeg">JPEG</option>
                                    <option value="image/png">PNG</option>
                                    <option value="image/webp">WebP</option>
                                </select>
                            </div>

                            {format !== 'image/png' && (
                                <div className="form-group">
                                    <label className="form-label">Quality: {quality}%</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => setQuality(parseInt(e.target.value))}
                                    />
                                </div>
                            )}

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={keepRatio}
                                    onChange={(e) => setKeepRatio(e.target.checked)}
                                />
                                <span>Keep aspect ratio</span>
                            </label>
                        </div>

                        {/* Process Button */}
                        <button
                            className="btn btn-primary btn-lg btn-full"
                            onClick={processImages}
                            disabled={isProcessing}
                        >
                            {isProcessing ? `Processing... ${progress}%` : `📐 Resize ${images.length} Images`}
                        </button>

                        {isProcessing && (
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                        )}
                    </div>
                )}

                {/* Results */}
                {results.length > 0 && (
                    <div className="results-section">
                        <div className="section-header">
                            <h4>Processed {results.length} Images</h4>
                            <button className="btn btn-primary" onClick={downloadAllAsZip}>
                                📦 Download All (ZIP)
                            </button>
                        </div>
                        <div className="results-grid">
                            {results.map((result, index) => (
                                <div key={index} className="result-card">
                                    <img src={result.dataUrl} alt={result.name} className="result-thumb" />
                                    <div className="result-info">
                                        <span className="result-name">{result.name}</span>
                                        <span className="result-meta">{result.width}×{result.height} • {result.sizeKB} KB</span>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => downloadSingle(result)}
                                    >
                                        ⬇️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form-wide { max-width: 900px; }
        
        .batch-upload { margin-bottom: var(--spacing-lg); }
        .batch-upload input { display: none; }
        .batch-upload label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          border: 3px dashed var(--platinum);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .batch-upload label:hover {
          border-color: var(--yinmn-blue);
          background: rgba(72, 86, 150, 0.05);
        }
        .upload-icon { font-size: 48px; margin-bottom: var(--spacing-sm); }
        .upload-text { font-size: var(--text-lg); font-weight: 500; }
        .upload-hint { font-size: var(--text-sm); color: var(--text-muted); margin-top: var(--spacing-xs); }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        .section-header h4 { margin: 0; }
        
        .image-list-section { margin-bottom: var(--spacing-lg); }
        .image-list {
          max-height: 250px;
          overflow-y: auto;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
        }
        .image-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm);
          border-bottom: 1px solid var(--platinum);
        }
        .image-item:last-child { border-bottom: none; }
        .image-thumb {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: var(--radius);
        }
        .image-info { flex: 1; }
        .image-name {
          display: block;
          font-weight: 500;
          font-size: var(--text-sm);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        .image-meta { font-size: var(--text-xs); color: var(--text-muted); }
        .remove-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: var(--error);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
        }
        
        .settings-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
        }
        
        .quick-presets, .social-presets { margin-bottom: var(--spacing-lg); }
        .preset-row { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); }
        .preset-chip {
          padding: var(--spacing-xs) var(--spacing-md);
          background: white;
          border: 1px solid var(--platinum);
          border-radius: 20px;
          cursor: pointer;
          font-size: var(--text-sm);
          transition: all 0.15s ease;
        }
        .preset-chip:hover { border-color: var(--yinmn-blue); }
        .preset-chip.active { background: var(--yinmn-blue); color: white; border-color: var(--yinmn-blue); }
        
        .social-presets summary { cursor: pointer; font-weight: 500; }
        .preset-tabs { margin-top: var(--spacing-md); }
        .preset-group-inline {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-sm);
        }
        .preset-platform {
          font-weight: 600;
          font-size: var(--text-sm);
          color: var(--yinmn-blue);
          min-width: 80px;
        }
        
        .dimensions-row {
          display: flex;
          align-items: flex-end;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        .dimensions-row .form-group { flex: 1; max-width: 150px; }
        .dimension-x { font-size: var(--text-xl); padding-bottom: var(--spacing-sm); }
        
        .options-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          align-items: flex-end;
          margin-bottom: var(--spacing-lg);
        }
        .options-row .form-group { flex: 1; min-width: 120px; }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          white-space: nowrap;
        }
        
        .btn-full { width: 100%; }
        .btn-sm { padding: var(--spacing-xs) var(--spacing-sm); font-size: var(--text-sm); }
        
        .progress-bar {
          height: 8px;
          background: var(--platinum);
          border-radius: 4px;
          margin-top: var(--spacing-md);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--yinmn-blue);
          transition: width 0.2s ease;
        }
        
        .results-section { margin-top: var(--spacing-xl); }
        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--spacing-md);
        }
        .result-card {
          background: white;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          padding: var(--spacing-sm);
        }
        .result-thumb {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: var(--radius);
          margin-bottom: var(--spacing-sm);
        }
        .result-info { margin-bottom: var(--spacing-sm); }
        .result-name {
          display: block;
          font-weight: 500;
          font-size: var(--text-sm);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .result-meta { font-size: var(--text-xs); color: var(--text-muted); }
        
        @media (max-width: 600px) {
          .dimensions-row, .options-row { flex-direction: column; }
          .dimensions-row .form-group { max-width: none; }
        }
      `}</style>
        </ToolLayout>
    );
};

export default BatchImageResizer;
