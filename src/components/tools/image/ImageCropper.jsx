import { useState, useRef, useCallback, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { loadImage, createCanvas, downloadDataUrl } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const ImageCropper = () => {
    const [image, setImage] = useState(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [croppedImage, setCroppedImage] = useState(null);
    const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const [aspectRatio, setAspectRatio] = useState('free');
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = useState('');

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-cropper').slice(0, 3);

    const aspectRatios = {
        'free': { label: 'Free', ratio: null },
        '1:1': { label: 'Square (1:1)', ratio: 1 },
        '4:3': { label: 'Standard (4:3)', ratio: 4 / 3 },
        '3:4': { label: 'Portrait (3:4)', ratio: 3 / 4 },
        '16:9': { label: 'Widescreen (16:9)', ratio: 16 / 9 },
        '9:16': { label: 'Story (9:16)', ratio: 9 / 16 },
        '2:3': { label: 'Photo (2:3)', ratio: 2 / 3 },
        '3:2': { label: 'Photo (3:2)', ratio: 3 / 2 }
    };

    const handleUpload = useCallback(({ dataUrl, dimensions }) => {
        setImage(dataUrl);
        setOriginalDimensions(dimensions);
        setCroppedImage(null);

        // Initialize crop area to center of image
        const initialSize = Math.min(dimensions.width, dimensions.height) * 0.8;
        setCropArea({
            x: (dimensions.width - initialSize) / 2,
            y: (dimensions.height - initialSize) / 2,
            width: initialSize,
            height: initialSize
        });
    }, []);

    // Apply aspect ratio constraint
    useEffect(() => {
        if (aspectRatio !== 'free' && aspectRatios[aspectRatio].ratio) {
            const ratio = aspectRatios[aspectRatio].ratio;
            const newHeight = cropArea.width / ratio;

            // Constrain to image bounds
            if (cropArea.y + newHeight <= originalDimensions.height) {
                setCropArea(prev => ({ ...prev, height: newHeight }));
            } else {
                const newWidth = cropArea.height * ratio;
                setCropArea(prev => ({ ...prev, width: newWidth }));
            }
        }
    }, [aspectRatio]);

    const getScaleFactor = useCallback(() => {
        if (!containerRef.current || !originalDimensions.width) return 1;
        const containerWidth = containerRef.current.offsetWidth;
        return containerWidth / originalDimensions.width;
    }, [originalDimensions.width]);

    const handleMouseDown = useCallback((e, handle = '') => {
        e.preventDefault();
        e.stopPropagation();

        const scale = getScaleFactor();
        const rect = containerRef.current.getBoundingClientRect();

        if (handle) {
            setIsResizing(true);
            setResizeHandle(handle);
        } else {
            setIsDragging(true);
        }

        setDragStart({
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale,
            cropX: cropArea.x,
            cropY: cropArea.y,
            cropWidth: cropArea.width,
            cropHeight: cropArea.height
        });
    }, [cropArea, getScaleFactor]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging && !isResizing) return;

        const scale = getScaleFactor();
        const rect = containerRef.current.getBoundingClientRect();
        const currentX = (e.clientX - rect.left) / scale;
        const currentY = (e.clientY - rect.top) / scale;
        const deltaX = currentX - dragStart.x;
        const deltaY = currentY - dragStart.y;

        if (isDragging) {
            // Move crop area
            let newX = dragStart.cropX + deltaX;
            let newY = dragStart.cropY + deltaY;

            // Constrain to image bounds
            newX = Math.max(0, Math.min(newX, originalDimensions.width - cropArea.width));
            newY = Math.max(0, Math.min(newY, originalDimensions.height - cropArea.height));

            setCropArea(prev => ({ ...prev, x: newX, y: newY }));
        }

        if (isResizing) {
            const ratio = aspectRatio !== 'free' ? aspectRatios[aspectRatio].ratio : null;
            let newWidth = dragStart.cropWidth;
            let newHeight = dragStart.cropHeight;
            let newX = dragStart.cropX;
            let newY = dragStart.cropY;

            if (resizeHandle.includes('e')) {
                newWidth = Math.max(50, dragStart.cropWidth + deltaX);
            }
            if (resizeHandle.includes('w')) {
                newWidth = Math.max(50, dragStart.cropWidth - deltaX);
                newX = dragStart.cropX + deltaX;
            }
            if (resizeHandle.includes('s')) {
                newHeight = Math.max(50, dragStart.cropHeight + deltaY);
            }
            if (resizeHandle.includes('n')) {
                newHeight = Math.max(50, dragStart.cropHeight - deltaY);
                newY = dragStart.cropY + deltaY;
            }

            // Apply aspect ratio
            if (ratio) {
                if (resizeHandle.includes('e') || resizeHandle.includes('w')) {
                    newHeight = newWidth / ratio;
                } else {
                    newWidth = newHeight * ratio;
                }
            }

            // Constrain to image bounds
            newX = Math.max(0, Math.min(newX, originalDimensions.width - newWidth));
            newY = Math.max(0, Math.min(newY, originalDimensions.height - newHeight));
            newWidth = Math.min(newWidth, originalDimensions.width - newX);
            newHeight = Math.min(newHeight, originalDimensions.height - newY);

            setCropArea({ x: newX, y: newY, width: newWidth, height: newHeight });
        }
    }, [isDragging, isResizing, dragStart, cropArea, originalDimensions, resizeHandle, aspectRatio, getScaleFactor]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeHandle('');
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const crop = useCallback(async () => {
        if (!image) return;

        const img = await loadImage(image);
        const { canvas, ctx } = createCanvas(Math.round(cropArea.width), Math.round(cropArea.height));

        ctx.drawImage(
            img,
            Math.round(cropArea.x),
            Math.round(cropArea.y),
            Math.round(cropArea.width),
            Math.round(cropArea.height),
            0,
            0,
            Math.round(cropArea.width),
            Math.round(cropArea.height)
        );

        setCroppedImage(canvas.toDataURL('image/png'));
    }, [image, cropArea]);

    const download = () => {
        if (!croppedImage) return;
        const filename = `cropped-${Math.round(cropArea.width)}x${Math.round(cropArea.height)}.png`;
        downloadDataUrl(croppedImage, filename);
    };

    const scale = getScaleFactor();

    const faqs = [
        {
            question: 'How do I select a crop area?',
            answer: 'Click and drag inside the crop box to move it. Drag the corners or edges to resize. Use the aspect ratio buttons for specific proportions.'
        },
        {
            question: 'What aspect ratios are available?',
            answer: 'Free (custom), 1:1 (square), 4:3 (standard), 16:9 (widescreen), 9:16 (stories), 2:3 and 3:2 (photos).'
        },
        {
            question: 'Is this tool free to use?',
            answer: 'Yes! Our image cropper is 100% free with no watermarks. All processing happens in your browser for maximum privacy.'
        }
    ];

    const seoContent = (
        <>
            <h2>Free Online Image Cropper</h2>
            <p>Crop images easily with our interactive cropping tool. Select any area, lock aspect ratios for perfect proportions, and download instantly. Perfect for profile pictures, social media posts, and web graphics.</p>
        </>
    );

    return (
        <ToolLayout
            title="Image Cropper"
            description="Crop images online with custom aspect ratios. Free tool with instant download."
            keywords={['image cropper', 'crop image', 'photo cropper', 'resize image']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form tool-form-wide">
                <DragDropUpload
                    id="cropper-upload"
                    onUpload={handleUpload}
                    label="Drop image here or click to upload"
                />

                {image && (
                    <>
                        {/* Aspect Ratio Presets */}
                        <div className="aspect-presets">
                            <label className="form-label">Aspect Ratio</label>
                            <div className="preset-grid">
                                {Object.entries(aspectRatios).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        className={`preset-btn ${aspectRatio === key ? 'active' : ''}`}
                                        onClick={() => setAspectRatio(key)}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cropping Canvas */}
                        <div
                            ref={containerRef}
                            className="crop-container"
                            style={{
                                width: '100%',
                                paddingBottom: `${(originalDimensions.height / originalDimensions.width) * 100}%`
                            }}
                        >
                            <img
                                ref={imageRef}
                                src={image}
                                alt="To crop"
                                className="crop-image"
                                draggable={false}
                            />

                            {/* Darkened overlay */}
                            <div className="crop-overlay">
                                <div
                                    className="crop-selection"
                                    style={{
                                        left: cropArea.x * scale,
                                        top: cropArea.y * scale,
                                        width: cropArea.width * scale,
                                        height: cropArea.height * scale
                                    }}
                                    onMouseDown={(e) => handleMouseDown(e)}
                                >
                                    {/* Resize handles */}
                                    <div className="crop-handle nw" onMouseDown={(e) => handleMouseDown(e, 'nw')} />
                                    <div className="crop-handle ne" onMouseDown={(e) => handleMouseDown(e, 'ne')} />
                                    <div className="crop-handle sw" onMouseDown={(e) => handleMouseDown(e, 'sw')} />
                                    <div className="crop-handle se" onMouseDown={(e) => handleMouseDown(e, 'se')} />
                                    <div className="crop-handle n" onMouseDown={(e) => handleMouseDown(e, 'n')} />
                                    <div className="crop-handle s" onMouseDown={(e) => handleMouseDown(e, 's')} />
                                    <div className="crop-handle e" onMouseDown={(e) => handleMouseDown(e, 'e')} />
                                    <div className="crop-handle w" onMouseDown={(e) => handleMouseDown(e, 'w')} />

                                    {/* Grid lines */}
                                    <div className="crop-grid" />
                                </div>
                            </div>
                        </div>

                        {/* Crop Info */}
                        <div className="size-info">
                            <span>Selection: <strong>{Math.round(cropArea.width)} × {Math.round(cropArea.height)}</strong> px</span>
                        </div>

                        {/* Actions */}
                        <div className="btn-group">
                            <button className="btn btn-primary btn-lg" onClick={crop}>
                                ✂️ Crop Image
                            </button>
                        </div>

                        {/* Cropped Result */}
                        {croppedImage && (
                            <div className="result-box">
                                <h4>Cropped Result</h4>
                                <div className="preview-container">
                                    <img src={croppedImage} alt="Cropped" className="preview-image" />
                                </div>
                                <div className="btn-group" style={{ marginTop: 'var(--spacing-md)' }}>
                                    <button className="btn btn-primary" onClick={download}>
                                        ⬇️ Download
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style>{`
        .aspect-presets {
          margin: var(--spacing-lg) 0;
        }
        
        .crop-container {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--bg-dark);
          margin: var(--spacing-lg) 0;
        }
        
        .crop-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          user-select: none;
        }
        
        .crop-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .crop-selection {
          position: absolute;
          background: transparent;
          border: 2px dashed white;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
          cursor: move;
        }
        
        .crop-grid {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px);
          background-size: 33.33% 33.33%;
        }
        
        .crop-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: white;
          border: 2px solid var(--yinmn-blue);
          border-radius: 2px;
        }
        
        .crop-handle.nw { top: -6px; left: -6px; cursor: nw-resize; }
        .crop-handle.ne { top: -6px; right: -6px; cursor: ne-resize; }
        .crop-handle.sw { bottom: -6px; left: -6px; cursor: sw-resize; }
        .crop-handle.se { bottom: -6px; right: -6px; cursor: se-resize; }
        .crop-handle.n { top: -6px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
        .crop-handle.s { bottom: -6px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
        .crop-handle.e { right: -6px; top: 50%; transform: translateY(-50%); cursor: e-resize; }
        .crop-handle.w { left: -6px; top: 50%; transform: translateY(-50%); cursor: w-resize; }
      `}</style>
        </ToolLayout>
    );
};

export default ImageCropper;
