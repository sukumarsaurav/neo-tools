import { useState, useRef, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { loadImage, createCanvas, downloadDataUrl } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const ImageFilters = () => {
    const [image, setImage] = useState(null);
    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        blur: 0,
        sepia: 0,
        hueRotate: 0,
        invert: 0
    });
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [showComparison, setShowComparison] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef(null);
    const comparisonRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-filters').slice(0, 3);

    const handleUpload = useCallback(({ dataUrl }) => {
        setImage(dataUrl);
        reset();
        toast.success('Image loaded!');
    }, [toast]);

    const filterPresets = [
        { name: 'None', filters: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0, hueRotate: 0, invert: 0 } },
        { name: 'Vintage', filters: { brightness: 110, contrast: 90, saturate: 80, grayscale: 0, blur: 0, sepia: 30, hueRotate: 0, invert: 0 } },
        { name: 'Noir', filters: { brightness: 100, contrast: 120, saturate: 0, grayscale: 100, blur: 0, sepia: 0, hueRotate: 0, invert: 0 } },
        { name: 'Vivid', filters: { brightness: 110, contrast: 110, saturate: 150, grayscale: 0, blur: 0, sepia: 0, hueRotate: 0, invert: 0 } },
        { name: 'Fade', filters: { brightness: 115, contrast: 85, saturate: 80, grayscale: 0, blur: 0, sepia: 10, hueRotate: 0, invert: 0 } },
        { name: 'Cool', filters: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0, hueRotate: 180, invert: 0 } },
        { name: 'Warm', filters: { brightness: 105, contrast: 100, saturate: 110, grayscale: 0, blur: 0, sepia: 20, hueRotate: 0, invert: 0 } },
        { name: 'Dramatic', filters: { brightness: 90, contrast: 150, saturate: 120, grayscale: 0, blur: 0, sepia: 0, hueRotate: 0, invert: 0 } },
        { name: 'Muted', filters: { brightness: 110, contrast: 80, saturate: 60, grayscale: 20, blur: 0, sepia: 10, hueRotate: 0, invert: 0 } },
        { name: 'Invert', filters: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0, hueRotate: 0, invert: 100 } }
    ];

    const filterConfig = [
        { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
        { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
        { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
        { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
        { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
        { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: '°' },
        { key: 'blur', label: 'Blur', min: 0, max: 10, unit: 'px' },
        { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' }
    ];

    const filterStyle = `
    brightness(${filters.brightness}%) 
    contrast(${filters.contrast}%) 
    saturate(${filters.saturate}%) 
    grayscale(${filters.grayscale}%) 
    blur(${filters.blur}px) 
    sepia(${filters.sepia}%) 
    hue-rotate(${filters.hueRotate}deg) 
    invert(${filters.invert}%)
  `.trim();

    const reset = () => {
        setFilters({ brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0, hueRotate: 0, invert: 0 });
        setSelectedPreset(null);
    };

    const applyPreset = (preset) => {
        setFilters(preset.filters);
        setSelectedPreset(preset.name);
        toast.info(`Applied "${preset.name}" filter`);
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: parseInt(value) }));
        setSelectedPreset(null);
    };

    // Comparison slider handlers
    const handleComparisonMove = useCallback((e) => {
        if (!isDragging && e.type !== 'click') return;
        if (!comparisonRef.current) return;

        const rect = comparisonRef.current.getBoundingClientRect();
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const position = ((x - rect.left) / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, position)));
    }, [isDragging]);

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const download = useCallback(async () => {
        if (!image) return;

        try {
            const img = await loadImage(image);
            const { canvas, ctx } = createCanvas(img.width, img.height);

            ctx.filter = filterStyle;
            ctx.drawImage(img, 0, 0);

            const dataUrl = canvas.toDataURL('image/png');
            downloadDataUrl(dataUrl, 'filtered-image.png');
            toast.success('Image downloaded!');
        } catch (error) {
            toast.error('Failed to download image');
        }
    }, [image, filterStyle, toast]);

    const faqs = [
        { question: 'What filters are available?', answer: 'Brightness, contrast, saturation, grayscale, sepia, hue rotation, blur, and invert. Combine them for unique effects or use preset filters.' },
        { question: 'Is my image uploaded anywhere?', answer: 'No. All processing happens locally in your browser. Your images never leave your device.' },
        { question: 'How do I compare before and after?', answer: 'Click the "Compare Before/After" button to enable the comparison slider. Drag the slider left or right to see the original vs. filtered image.' }
    ];

    const seoContent = (
        <>
            <h2>Image Filter Tool</h2>
            <p>Apply filters to your images online. Choose from preset filters like Vintage, Noir, Vivid, or customize brightness, contrast, saturation, and more. Compare before and after with our interactive slider. Download the edited image instantly.</p>
        </>
    );

    return (
        <ToolLayout
            title="Image Filters"
            description="Apply filters to images online. Adjust brightness, contrast, saturation and more with preset and custom options."
            keywords={['image filters', 'photo filters', 'image editor', 'photo effects', 'instagram filters', 'before after comparison']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <DragDropUpload
                    id="filter-upload"
                    onUpload={handleUpload}
                    label="Drop image here or click to upload"
                />

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {image && (
                    <>
                        {/* Comparison Toggle */}
                        <div className="comparison-toggle">
                            <button
                                className={`btn ${showComparison ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setShowComparison(!showComparison)}
                            >
                                {showComparison ? '🔄 Hide Comparison' : '↔️ Compare Before/After'}
                            </button>
                        </div>

                        {/* Preview / Comparison */}
                        {showComparison ? (
                            <div
                                ref={comparisonRef}
                                className="comparison-container"
                                onMouseMove={handleComparisonMove}
                                onMouseDown={handleMouseDown}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchMove={handleComparisonMove}
                                onTouchStart={handleMouseDown}
                                onTouchEnd={handleMouseUp}
                                onClick={handleComparisonMove}
                            >
                                {/* Original (Before) */}
                                <div className="comparison-before">
                                    <img src={image} alt="Before" />
                                    <span className="comparison-label before-label">Before</span>
                                </div>

                                {/* Filtered (After) - clipped */}
                                <div
                                    className="comparison-after"
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                >
                                    <img src={image} alt="After" style={{ filter: filterStyle }} />
                                    <span className="comparison-label after-label">After</span>
                                </div>

                                {/* Slider Handle */}
                                <div
                                    className="comparison-slider"
                                    style={{ left: `${sliderPosition}%` }}
                                >
                                    <div className="slider-handle">
                                        <span>◀</span>
                                        <span>▶</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="filter-preview">
                                <img
                                    src={image}
                                    alt="Preview"
                                    style={{ filter: filterStyle }}
                                    className="preview-image"
                                />
                            </div>
                        )}

                        {/* Presets */}
                        <div className="presets-section">
                            <label className="form-label">Filter Presets</label>
                            <div className="preset-grid">
                                {filterPresets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        className={`preset-filter-btn ${selectedPreset === preset.name ? 'active' : ''}`}
                                        onClick={() => applyPreset(preset)}
                                        aria-label={`Apply ${preset.name} filter`}
                                    >
                                        <div
                                            className="preset-thumb"
                                            style={{
                                                backgroundImage: `url(${image})`,
                                                filter: `
                          brightness(${preset.filters.brightness}%) 
                          contrast(${preset.filters.contrast}%) 
                          saturate(${preset.filters.saturate}%) 
                          grayscale(${preset.filters.grayscale}%) 
                          sepia(${preset.filters.sepia}%)
                          hue-rotate(${preset.filters.hueRotate}deg)
                          invert(${preset.filters.invert}%)
                        `
                                            }}
                                        />
                                        <span className="preset-name">{preset.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="sliders-section">
                            <div className="section-header">
                                <label className="form-label">Fine-tune Adjustments</label>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={reset}
                                    aria-label="Reset all filters"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="sliders-grid">
                                {filterConfig.map(({ key, label, min, max, unit }) => (
                                    <div key={key} className="slider-group">
                                        <label>
                                            <span>{label}</span>
                                            <span>{filters[key]}{unit}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min={min}
                                            max={max}
                                            value={filters[key]}
                                            onChange={(e) => updateFilter(key, e.target.value)}
                                            aria-label={`Adjust ${label}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="btn-group">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={download}
                                aria-label="Download filtered image"
                            >
                                ⬇️ Download Image
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style>{`
        .tool-form { max-width: 800px; margin: 0 auto; }
        
        .comparison-toggle {
          text-align: center;
          margin: var(--spacing-lg) 0;
        }
        
        .comparison-container {
          position: relative;
          margin: var(--spacing-lg) 0;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: ew-resize;
          user-select: none;
          touch-action: none;
        }
        
        .comparison-before,
        .comparison-after {
          position: relative;
        }
        
        .comparison-before img,
        .comparison-after img {
          width: 100%;
          display: block;
          border-radius: var(--radius-lg);
        }
        
        .comparison-after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .comparison-label {
          position: absolute;
          top: var(--spacing-md);
          padding: var(--spacing-xs) var(--spacing-md);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: var(--text-sm);
          font-weight: 600;
          border-radius: var(--radius);
        }
        
        .before-label { left: var(--spacing-md); }
        .after-label { right: var(--spacing-md); }
        
        .comparison-slider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 4px;
          background: white;
          transform: translateX(-50%);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        
        .slider-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          font-size: 10px;
          color: var(--yinmn-blue);
        }
        
        .slider-handle span {
          margin: 0 2px;
        }
        
        .filter-preview {
          margin: var(--spacing-lg) 0;
          text-align: center;
        }
        
        .filter-preview .preview-image {
          max-width: 100%;
          max-height: 350px;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        
        .presets-section {
          margin: var(--spacing-lg) 0;
        }
        
        .preset-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: var(--spacing-sm);
        }
        
        .preset-filter-btn {
          background: none;
          border: 2px solid transparent;
          padding: 0;
          cursor: pointer;
          border-radius: var(--radius);
          overflow: hidden;
          transition: all 0.15s ease;
        }
        
        .preset-filter-btn:hover, .preset-filter-btn.active {
          border-color: var(--yinmn-blue);
        }
        
        .preset-filter-btn.active {
          box-shadow: 0 0 0 2px var(--yinmn-blue);
        }
        
        .preset-thumb {
          width: 100%;
          height: 60px;
          background-size: cover;
          background-position: center;
        }
        
        .preset-name {
          display: block;
          padding: var(--spacing-xs);
          font-size: var(--text-xs);
          background: var(--bg-secondary);
          font-weight: 500;
        }
        
        .sliders-section {
          margin: var(--spacing-lg) 0;
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
        
        .section-header .form-label {
          margin: 0;
        }
        
        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-sm);
        }
        
        .sliders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg) var(--spacing-xl);
        }
        
        .slider-group label {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-xs);
          font-size: var(--text-sm);
          font-weight: 500;
        }
        
        .slider-group input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--platinum);
          appearance: none;
          -webkit-appearance: none;
        }
        
        .slider-group input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--yinmn-blue);
          cursor: pointer;
        }
      `}</style>
        </ToolLayout>
    );
};

export default ImageFilters;
