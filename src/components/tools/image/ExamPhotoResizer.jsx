import { useState, useRef, useCallback, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { loadImage, formatFileSize } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

// Exam presets with dimensions and max file sizes
const examPresets = {
    'ssc-photo': { label: 'SSC CGL - Photo', width: 200, height: 230, maxKB: 20, format: 'image/jpeg' },
    'ssc-signature': { label: 'SSC CGL - Signature', width: 140, height: 60, maxKB: 10, format: 'image/jpeg' },
    'upsc-photo': { label: 'UPSC - Passport Photo', width: 200, height: 230, maxKB: 50, format: 'image/jpeg' },
    'upsc-signature': { label: 'UPSC - Signature', width: 140, height: 60, maxKB: 20, format: 'image/jpeg' },
    'jee-photo': { label: 'JEE Main - Photo', width: 200, height: 200, maxKB: 50, format: 'image/jpeg' },
    'jee-signature': { label: 'JEE Main - Signature', width: 200, height: 100, maxKB: 20, format: 'image/jpeg' },
    'neet-photo': { label: 'NEET - Photo', width: 200, height: 230, maxKB: 50, format: 'image/jpeg' },
    'neet-signature': { label: 'NEET - Signature', width: 200, height: 100, maxKB: 20, format: 'image/jpeg' },
    'bank-photo': { label: 'Bank PO/Clerk - Photo', width: 200, height: 230, maxKB: 50, format: 'image/jpeg' },
    'bank-signature': { label: 'Bank PO/Clerk - Signature', width: 140, height: 60, maxKB: 20, format: 'image/jpeg' },
    'rrb-photo': { label: 'RRB NTPC - Photo', width: 200, height: 230, maxKB: 50, format: 'image/jpeg' },
    'passport-photo': { label: 'Passport - Photo', width: 350, height: 350, maxKB: 100, format: 'image/jpeg' },
    'gate-photo': { label: 'GATE - Photo', width: 240, height: 320, maxKB: 200, format: 'image/jpeg' },
    'cat-photo': { label: 'CAT - Photo', width: 200, height: 230, maxKB: 50, format: 'image/jpeg' },
    'custom': { label: 'Custom', width: 200, height: 230, maxKB: 50, format: 'image/jpeg' }
};

const ExamPhotoResizer = () => {
    const [image, setImage] = useState(null);
    const [imageObj, setImageObj] = useState(null);
    const [preset, setPreset] = useState('ssc-photo');
    const [customDimensions, setCustomDimensions] = useState({ width: 200, height: 230, maxKB: 50 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [output, setOutput] = useState(null);
    const [outputSize, setOutputSize] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const canvasRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const containerRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'exam-photo-resizer').slice(0, 3);

    // Get current dimensions based on preset
    const currentPreset = preset === 'custom' ? { ...examPresets.custom, ...customDimensions } : examPresets[preset];
    const { width: targetWidth, height: targetHeight, maxKB, format } = currentPreset;

    // Calculate canvas display size (scaled for UI)
    const displayScale = Math.min(300 / targetWidth, 300 / targetHeight, 2);
    const displayWidth = targetWidth * displayScale;
    const displayHeight = targetHeight * displayScale;

    const handleUpload = useCallback(async ({ dataUrl }) => {
        setImage(dataUrl);
        setOutput(null);
        setOutputSize(0);

        try {
            const img = await loadImage(dataUrl);
            setImageObj(img);

            // Calculate initial zoom to fit image in visible area
            const scaleX = targetWidth / img.width;
            const scaleY = targetHeight / img.height;
            const initialZoom = Math.max(scaleX, scaleY) * 1.1; // Slightly larger to allow adjustment
            setZoom(Math.max(0.5, Math.min(3, initialZoom)));

            // Center the image
            setPosition({ x: 0, y: 0 });

            toast.success('Image loaded! Adjust position and zoom.');
        } catch (error) {
            toast.error('Failed to load image');
        }
    }, [targetWidth, targetHeight, toast]);

    // Draw canvas with visible area highlighted
    const drawCanvas = useCallback(() => {
        if (!imageObj || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Canvas is larger than target to show overflow
        const padding = 80;
        canvas.width = targetWidth + padding * 2;
        canvas.height = targetHeight + padding * 2;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaled image dimensions
        const scaledWidth = imageObj.width * zoom;
        const scaledHeight = imageObj.height * zoom;

        // Calculate image position (centered + offset)
        const imgX = padding + (targetWidth - scaledWidth) / 2 + position.x;
        const imgY = padding + (targetHeight - scaledHeight) / 2 + position.y;

        // Draw semi-transparent image (full canvas)
        ctx.globalAlpha = 0.3;
        ctx.drawImage(imageObj, imgX, imgY, scaledWidth, scaledHeight);

        // Draw visible area with full opacity using clipping
        ctx.save();
        ctx.beginPath();
        ctx.rect(padding, padding, targetWidth, targetHeight);
        ctx.clip();
        ctx.globalAlpha = 1;
        ctx.drawImage(imageObj, imgX, imgY, scaledWidth, scaledHeight);
        ctx.restore();

        // Draw border around visible area
        ctx.strokeStyle = '#485696';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.strokeRect(padding, padding, targetWidth, targetHeight);

        // Draw dashed border for canvas edge
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

        // Add dimension labels
        ctx.fillStyle = '#485696';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${targetWidth}px`, padding + targetWidth / 2, padding - 8);
        ctx.save();
        ctx.translate(padding - 8, padding + targetHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${targetHeight}px`, 0, 0);
        ctx.restore();

    }, [imageObj, zoom, position, targetWidth, targetHeight]);

    // Redraw canvas when dependencies change
    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    // Handle mouse/touch drag
    const handleMouseDown = useCallback((e) => {
        if (!imageObj) return;
        setIsDragging(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        setDragStart({
            x: (e.clientX - rect.left) * scaleX - position.x,
            y: (e.clientY - rect.top) * scaleY - position.y
        });
    }, [imageObj, position]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        setPosition({
            x: (e.clientX - rect.left) * scaleX - dragStart.x,
            y: (e.clientY - rect.top) * scaleY - dragStart.y
        });
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Add event listeners
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    // Generate output with compression
    const generateOutput = useCallback(async () => {
        if (!imageObj) return;

        setIsProcessing(true);

        try {
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = targetWidth;
            outputCanvas.height = targetHeight;
            const ctx = outputCanvas.getContext('2d');

            // Fill white background for JPEG
            if (format === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, targetWidth, targetHeight);
            }

            // Calculate scaled image dimensions
            const scaledWidth = imageObj.width * zoom;
            const scaledHeight = imageObj.height * zoom;

            // Calculate image position
            const imgX = (targetWidth - scaledWidth) / 2 + position.x;
            const imgY = (targetHeight - scaledHeight) / 2 + position.y;

            ctx.drawImage(imageObj, imgX, imgY, scaledWidth, scaledHeight);

            // Compress to meet file size
            let quality = 0.95;
            let dataUrl;
            let sizeKB;

            do {
                dataUrl = outputCanvas.toDataURL(format, quality);
                const base64Length = dataUrl.split(',')[1].length;
                sizeKB = Math.round((base64Length * 3) / 4 / 1024 * 10) / 10;

                if (sizeKB <= maxKB) break;
                quality -= 0.05;
            } while (quality > 0.1);

            setOutput(dataUrl);
            setOutputSize(sizeKB);

            if (sizeKB <= maxKB) {
                toast.success(`Image ready! Size: ${sizeKB} KB`);
            } else {
                toast.warning(`Size (${sizeKB} KB) exceeds limit (${maxKB} KB). Try zooming out.`);
            }
        } catch (error) {
            toast.error('Failed to generate image');
        }

        setIsProcessing(false);
    }, [imageObj, zoom, position, targetWidth, targetHeight, maxKB, format, toast]);

    const download = () => {
        if (!output) return;
        const ext = format === 'image/jpeg' ? 'jpg' : 'png';
        const link = document.createElement('a');
        link.download = `exam-photo-${targetWidth}x${targetHeight}.${ext}`;
        link.href = output;
        link.click();
        toast.success('Downloaded!');
    };

    const handlePresetChange = (newPreset) => {
        setPreset(newPreset);
        setOutput(null);
        setOutputSize(0);
        // Reset zoom and position when preset changes
        if (imageObj) {
            const preset = newPreset === 'custom' ? customDimensions : examPresets[newPreset];
            const scaleX = preset.width / imageObj.width;
            const scaleY = preset.height / imageObj.height;
            setZoom(Math.max(scaleX, scaleY) * 1.1);
            setPosition({ x: 0, y: 0 });
        }
    };

    const faqs = [
        { question: 'How do I adjust the image?', answer: 'Click and drag on the canvas to move the image. Use the zoom slider to resize. The bordered area shows what will be downloaded.' },
        { question: 'Why is my file still too large?', answer: 'Try zooming out to include less detail. We automatically compress the image, but very detailed photos may exceed limits.' },
        { question: 'What if my exam is not listed?', answer: 'Select "Custom" and enter your specific dimensions and file size limits from the exam notification.' },
        { question: 'Is my image uploaded anywhere?', answer: 'No! All processing happens locally in your browser. Your photos never leave your device.' }
    ];

    const seoContent = (
        <>
            <h2>Exam Photo Resizer</h2>
            <p>Resize and compress photos for exam applications. Supports SSC, UPSC, JEE, NEET, Bank PO, Passport, GATE, CAT, and more. See exactly what will be cropped with our visual editor. All processing happens locally - your images stay private.</p>
            <h3>Supported Exams</h3>
            <ul>
                <li>SSC CGL, CHSL, MTS - Photo & Signature</li>
                <li>UPSC CSE, IAS - Passport Photo & Signature</li>
                <li>JEE Main, JEE Advanced - Photo & Signature</li>
                <li>NEET UG - Photo & Signature</li>
                <li>Bank PO, Clerk, RRB - Photo & Signature</li>
                <li>GATE, CAT, Passport - and more</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Exam Photo Resizer"
            description="Resize photos for SSC, UPSC, JEE, NEET, Bank exams. Meet exact dimensions and file size requirements."
            keywords={['exam photo resizer', 'passport photo size', 'SSC photo size', 'UPSC photo', 'JEE photo upload']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form tool-form-wide">
                <DragDropUpload
                    id="exam-photo-upload"
                    onUpload={handleUpload}
                    label="Drop your photo or signature here"
                />

                {image && (
                    <div className="editor-container">
                        {/* Preset Selection */}
                        <div className="preset-sidebar">
                            <label className="form-label">Select Exam</label>
                            <div className="preset-list">
                                {Object.entries(examPresets).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        className={`preset-item ${preset === key ? 'active' : ''}`}
                                        onClick={() => handlePresetChange(key)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {preset === 'custom' && (
                                <div className="custom-settings">
                                    <div className="form-group">
                                        <label className="form-label">Width (px)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={customDimensions.width}
                                            onChange={(e) => setCustomDimensions(d => ({ ...d, width: parseInt(e.target.value) || 1 }))}
                                            min="10"
                                            max="1000"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Height (px)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={customDimensions.height}
                                            onChange={(e) => setCustomDimensions(d => ({ ...d, height: parseInt(e.target.value) || 1 }))}
                                            min="10"
                                            max="1000"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Max Size (KB)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={customDimensions.maxKB}
                                            onChange={(e) => setCustomDimensions(d => ({ ...d, maxKB: parseInt(e.target.value) || 1 }))}
                                            min="1"
                                            max="500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Canvas Editor */}
                        <div className="canvas-section">
                            <div className="requirement-badge">
                                Required: <strong>{targetWidth} × {targetHeight}</strong> px, Max <strong>{maxKB}</strong> KB
                            </div>

                            <div
                                ref={containerRef}
                                className="canvas-container"
                            >
                                <canvas
                                    ref={canvasRef}
                                    className="editor-canvas"
                                    onMouseDown={handleMouseDown}
                                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                                />
                                <div className="canvas-hint">
                                    <span>🖱️ Drag to position</span>
                                </div>
                            </div>

                            {/* Zoom Slider */}
                            <div className="slider-group">
                                <label>
                                    <span>🔍 Zoom</span>
                                    <span>{Math.round(zoom * 100)}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="10"
                                    max="300"
                                    value={zoom * 100}
                                    onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
                                />
                            </div>

                            {/* Generate Button */}
                            <button
                                className="btn btn-primary btn-lg btn-full"
                                onClick={generateOutput}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : '✨ Generate Image'}
                            </button>

                            {/* Output Preview */}
                            {output && (
                                <div className="output-section">
                                    <div className={`size-badge ${outputSize <= maxKB ? 'success' : 'error'}`}>
                                        <div className="size-info-row">
                                            <span>Size: <strong>{outputSize} KB</strong></span>
                                            <span className="size-limit">/ {maxKB} KB max</span>
                                            <span className={`size-status ${outputSize <= maxKB ? 'pass' : 'fail'}`}>
                                                {outputSize <= maxKB ? '✓ OK' : '✗ Too large'}
                                            </span>
                                        </div>
                                        <div className="dimensions-info">
                                            Dimensions: {targetWidth} × {targetHeight} px
                                        </div>
                                    </div>

                                    <div className="output-preview">
                                        <img src={output} alt="Output preview" />
                                    </div>

                                    <button
                                        className="btn btn-primary btn-lg btn-full"
                                        onClick={download}
                                        disabled={outputSize > maxKB}
                                    >
                                        ⬇️ Download Image
                                    </button>

                                    {outputSize > maxKB && (
                                        <p className="size-warning">
                                            ⚠️ File size exceeds limit. Try zooming out or repositioning.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form-wide {
          max-width: 900px;
        }
        
        .editor-container {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .preset-sidebar {
          background: var(--bg-secondary);
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
          max-height: 500px;
          overflow-y: auto;
        }
        
        .preset-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .preset-item {
          padding: var(--spacing-sm) var(--spacing-md);
          background: white;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          text-align: left;
          font-size: var(--text-sm);
          transition: all 0.15s ease;
        }
        
        .preset-item:hover {
          border-color: var(--yinmn-blue);
        }
        
        .preset-item.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }
        
        .custom-settings {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--platinum);
        }
        
        .canvas-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .requirement-badge {
          background: linear-gradient(135deg, #485696, #6a7bc4);
          color: white;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius);
          text-align: center;
          font-size: var(--text-sm);
        }
        
        .canvas-container {
          position: relative;
          background: #f0f0f0;
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
        }
        
        .editor-canvas {
          max-width: 100%;
          max-height: 400px;
          border-radius: var(--radius);
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .canvas-hint {
          position: absolute;
          bottom: var(--spacing-sm);
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: var(--text-xs);
        }
        
        .btn-full {
          width: 100%;
        }
        
        .output-section {
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--platinum);
        }
        
        .size-badge {
          padding: var(--spacing-md);
          border-radius: var(--radius);
          margin-bottom: var(--spacing-md);
        }
        
        .size-badge.success {
          background: #d4edda;
          border: 1px solid #28a745;
        }
        
        .size-badge.error {
          background: #f8d7da;
          border: 1px solid #dc3545;
        }
        
        .size-info-row {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
        }
        
        .size-limit {
          color: var(--text-muted);
          font-size: var(--text-sm);
        }
        
        .size-status {
          margin-left: auto;
          font-weight: 600;
        }
        
        .size-status.pass {
          color: #28a745;
        }
        
        .size-status.fail {
          color: #dc3545;
        }
        
        .dimensions-info {
          margin-top: var(--spacing-xs);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
        
        .output-preview {
          text-align: center;
          margin: var(--spacing-md) 0;
        }
        
        .output-preview img {
          border: 3px solid var(--yinmn-blue);
          border-radius: var(--radius);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }
        
        .size-warning {
          color: #dc3545;
          text-align: center;
          margin-top: var(--spacing-sm);
          font-size: var(--text-sm);
        }
        
        @media (max-width: 768px) {
          .editor-container {
            grid-template-columns: 1fr;
          }
          
          .preset-sidebar {
            max-height: none;
          }
          
          .preset-list {
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .preset-item {
            flex: 1 1 auto;
            min-width: 120px;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ExamPhotoResizer;
