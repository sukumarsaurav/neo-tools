import { useState, useCallback } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { downloadDataUrl, createCanvas, loadImage } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const ImageMetadataViewer = () => {
    const [image, setImage] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [basicInfo, setBasicInfo] = useState(null);
    const [isStripping, setIsStripping] = useState(false);
    const [strippedImage, setStrippedImage] = useState(null);

    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'image-metadata-viewer').slice(0, 3);

    const extractMetadata = async (dataUrl, file) => {
        // Basic file info
        const img = await loadImage(dataUrl);
        const basic = {
            'File Name': file?.name || 'Unknown',
            'File Size': file ? formatBytes(file.size) : 'Unknown',
            'File Type': file?.type || 'Unknown',
            'Width': `${img.width} px`,
            'Height': `${img.height} px`,
            'Aspect Ratio': `${(img.width / img.height).toFixed(2)}:1`,
            'Megapixels': `${((img.width * img.height) / 1000000).toFixed(2)} MP`
        };
        setBasicInfo(basic);

        // Try to extract EXIF data from JPEG
        if (file?.type === 'image/jpeg' || file?.type === 'image/jpg') {
            try {
                const exifData = await extractExifFromArrayBuffer(await file.arrayBuffer());
                setMetadata(exifData);
            } catch (e) {
                setMetadata(null);
            }
        } else {
            setMetadata(null);
        }
    };

    // Simple EXIF extraction (basic implementation)
    const extractExifFromArrayBuffer = async (buffer) => {
        const view = new DataView(buffer);

        // Check for JPEG SOI marker
        if (view.getUint16(0) !== 0xFFD8) {
            return null;
        }

        let offset = 2;
        const length = view.byteLength;
        const exifData = {};

        while (offset < length) {
            const marker = view.getUint16(offset);
            offset += 2;

            // APP1 marker (EXIF)
            if (marker === 0xFFE1) {
                const segmentLength = view.getUint16(offset);
                offset += 2;

                // Check for "Exif" string
                const exifHeader = String.fromCharCode(
                    view.getUint8(offset),
                    view.getUint8(offset + 1),
                    view.getUint8(offset + 2),
                    view.getUint8(offset + 3)
                );

                if (exifHeader === 'Exif') {
                    // Parse TIFF header (simplified)
                    const tiffOffset = offset + 6;
                    const littleEndian = view.getUint16(tiffOffset) === 0x4949;

                    // IFD0 offset
                    const ifdOffset = view.getUint32(tiffOffset + 4, littleEndian);
                    const entryCount = view.getUint16(tiffOffset + ifdOffset, littleEndian);

                    // Simplified tag reading
                    for (let i = 0; i < Math.min(entryCount, 20); i++) {
                        const entryOffset = tiffOffset + ifdOffset + 2 + (i * 12);
                        if (entryOffset + 12 > length) break;

                        const tag = view.getUint16(entryOffset, littleEndian);
                        const type = view.getUint16(entryOffset + 2, littleEndian);
                        const count = view.getUint32(entryOffset + 4, littleEndian);

                        // Read common tags
                        const tagNames = {
                            0x010F: 'Camera Make',
                            0x0110: 'Camera Model',
                            0x0112: 'Orientation',
                            0x011A: 'X Resolution',
                            0x011B: 'Y Resolution',
                            0x8769: 'EXIF IFD',
                            0x8825: 'GPS IFD'
                        };

                        if (tagNames[tag]) {
                            if (type === 3) { // SHORT
                                exifData[tagNames[tag]] = view.getUint16(entryOffset + 8, littleEndian);
                            } else if (type === 4) { // LONG
                                exifData[tagNames[tag]] = view.getUint32(entryOffset + 8, littleEndian);
                            }
                        }
                    }
                }
                break;
            } else if ((marker & 0xFF00) === 0xFF00) {
                // Skip other segments
                const segmentLength = view.getUint16(offset);
                offset += segmentLength;
            } else {
                break;
            }
        }

        return Object.keys(exifData).length > 0 ? exifData : null;
    };

    const formatBytes = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleUpload = useCallback(async ({ dataUrl, file }) => {
        setImage(dataUrl);
        setStrippedImage(null);
        await extractMetadata(dataUrl, file);
        toast.success('Image loaded!');
    }, [toast]);

    // Strip metadata by re-encoding the image
    const stripMetadata = useCallback(async () => {
        if (!image) return;

        setIsStripping(true);

        try {
            const img = await loadImage(image);
            const { canvas, ctx } = createCanvas(img.width, img.height);
            ctx.drawImage(img, 0, 0);

            // Re-encode as PNG (strips all metadata)
            const cleanDataUrl = canvas.toDataURL('image/png');
            setStrippedImage(cleanDataUrl);
            toast.success('Metadata stripped!');
        } catch (error) {
            toast.error('Failed to strip metadata');
        }

        setIsStripping(false);
    }, [image, toast]);

    const downloadCleanImage = () => {
        if (!strippedImage) return;
        downloadDataUrl(strippedImage, 'image-no-metadata.png');
        toast.success('Downloaded!');
    };

    const copyMetadata = () => {
        const data = { ...basicInfo, ...(metadata || {}) };
        const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
        navigator.clipboard.writeText(text);
        toast.success('Metadata copied!');
    };

    const faqs = [
        { question: 'What is image metadata?', answer: 'Metadata is hidden information stored in image files. It can include camera settings, GPS location, date/time, and more.' },
        { question: 'Why strip metadata?', answer: 'Stripping metadata protects your privacy by removing location data and other personal information before sharing images online.' },
        { question: 'Which formats have EXIF data?', answer: 'JPEG and TIFF images typically contain EXIF data. PNG images usually don\'t contain EXIF metadata.' }
    ];

    const seoContent = (
        <>
            <h2>Image Metadata Viewer</h2>
            <p>View and analyze image metadata including dimensions, file size, EXIF data, and camera information. Strip metadata for privacy before sharing images online.</p>
        </>
    );

    return (
        <ToolLayout
            title="Image Metadata Viewer"
            description="View image metadata and EXIF data. Strip metadata for privacy protection."
            keywords={['image metadata', 'EXIF viewer', 'strip metadata', 'image info', 'photo details']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <DragDropUpload
                    id="metadata-upload"
                    onUpload={handleUpload}
                    label="Drop image to view metadata"
                />

                {image && (
                    <div className="metadata-container">
                        {/* Image Preview */}
                        <div className="image-preview">
                            <img src={image} alt="Uploaded" />
                        </div>

                        {/* Basic Info */}
                        {basicInfo && (
                            <div className="info-section">
                                <div className="section-header">
                                    <h4>📄 File Information</h4>
                                    <button className="btn btn-sm btn-secondary" onClick={copyMetadata}>
                                        Copy All
                                    </button>
                                </div>
                                <div className="info-grid">
                                    {Object.entries(basicInfo).map(([key, value]) => (
                                        <div key={key} className="info-row">
                                            <span className="info-label">{key}</span>
                                            <span className="info-value">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* EXIF Data */}
                        {metadata && (
                            <div className="info-section">
                                <h4>📷 EXIF Data</h4>
                                <div className="info-grid">
                                    {Object.entries(metadata).map(([key, value]) => (
                                        <div key={key} className="info-row">
                                            <span className="info-label">{key}</span>
                                            <span className="info-value">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!metadata && basicInfo && (
                            <div className="no-exif">
                                <p>ℹ️ No EXIF metadata found in this image.</p>
                                <p className="hint">EXIF data is typically found in JPEG photos from cameras.</p>
                            </div>
                        )}

                        {/* Strip Metadata */}
                        <div className="strip-section">
                            <h4>🔒 Privacy Protection</h4>
                            <p>Remove all metadata from the image to protect your privacy.</p>

                            <button
                                className="btn btn-primary"
                                onClick={stripMetadata}
                                disabled={isStripping}
                            >
                                {isStripping ? 'Stripping...' : '🧹 Strip Metadata'}
                            </button>

                            {strippedImage && (
                                <div className="stripped-result">
                                    <p>✅ Metadata removed successfully!</p>
                                    <button className="btn btn-secondary" onClick={downloadCleanImage}>
                                        ⬇️ Download Clean Image
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form { max-width: 700px; margin: 0 auto; }
        
        .metadata-container {
          margin-top: var(--spacing-lg);
        }
        
        .image-preview {
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .image-preview img {
          max-width: 100%;
          max-height: 300px;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .info-section {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .section-header h4 { margin: 0; }
        
        .info-section h4 {
          margin-bottom: var(--spacing-md);
        }
        
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: white;
          border-radius: var(--radius);
        }
        
        .info-label {
          font-weight: 500;
          color: var(--text-muted);
        }
        
        .info-value {
          font-family: var(--font-mono);
        }
        
        .no-exif {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          text-align: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .no-exif .hint {
          font-size: var(--text-sm);
          color: var(--text-muted);
          margin-top: var(--spacing-xs);
        }
        
        .strip-section {
          background: linear-gradient(135deg, #485696, #6a7bc4);
          color: white;
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
        }
        
        .strip-section h4 {
          margin-bottom: var(--spacing-sm);
        }
        
        .strip-section p {
          margin-bottom: var(--spacing-md);
          opacity: 0.9;
        }
        
        .stripped-result {
          margin-top: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid rgba(255,255,255,0.3);
        }
        
        .stripped-result p {
          margin-bottom: var(--spacing-sm);
        }
        
        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-sm);
        }
      `}</style>
        </ToolLayout>
    );
};

export default ImageMetadataViewer;
