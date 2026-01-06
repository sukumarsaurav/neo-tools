import { useState, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import { useToast } from '../../common/Toast';
import '../../../styles/tools.css';

const QrGenerator = () => {
    const [text, setText] = useState('');
    const [size, setSize] = useState(300);
    const [errorCorrection, setErrorCorrection] = useState('M');
    const [foreground, setForeground] = useState('#000000');
    const [background, setBackground] = useState('#FFFFFF');
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const canvasRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'qr-generator').slice(0, 3);

    const generate = useCallback(async () => {
        if (!text.trim()) {
            toast.warning('Please enter text or URL');
            return;
        }

        setIsGenerating(true);

        try {
            const canvas = canvasRef.current;

            await QRCode.toCanvas(canvas, text, {
                width: size,
                margin: 2,
                errorCorrectionLevel: errorCorrection,
                color: {
                    dark: foreground,
                    light: background
                }
            });

            // Convert to data URL for download
            const dataUrl = canvas.toDataURL('image/png');
            setQrDataUrl(dataUrl);
            toast.success('QR Code generated!');
        } catch (error) {
            console.error('QR generation failed:', error);
            toast.error('Failed to generate QR code. Text may be too long.');
        }

        setIsGenerating(false);
    }, [text, size, errorCorrection, foreground, background, toast]);

    const downloadPng = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = qrDataUrl;
        link.click();
        toast.success('QR Code downloaded!');
    };

    const downloadSvg = useCallback(async () => {
        if (!text.trim()) return;

        try {
            const svgString = await QRCode.toString(text, {
                type: 'svg',
                width: size,
                margin: 2,
                errorCorrectionLevel: errorCorrection,
                color: {
                    dark: foreground,
                    light: background
                }
            });

            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'qrcode.svg';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('SVG downloaded!');
        } catch (error) {
            toast.error('Failed to generate SVG');
        }
    }, [text, size, errorCorrection, foreground, background, toast]);

    const copyToClipboard = async () => {
        if (!qrDataUrl) return;

        try {
            // Convert data URL to blob
            const response = await fetch(qrDataUrl);
            const blob = await response.blob();

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            toast.success('QR Code copied to clipboard!');
        } catch (error) {
            // Fallback: copy data URL
            try {
                await navigator.clipboard.writeText(qrDataUrl);
                toast.info('Data URL copied to clipboard');
            } catch {
                toast.error('Failed to copy to clipboard');
            }
        }
    };

    // Quick templates
    const templates = [
        { label: 'URL', placeholder: 'https://example.com', prefix: '' },
        { label: 'Email', placeholder: 'email@example.com', prefix: 'mailto:' },
        { label: 'Phone', placeholder: '+1234567890', prefix: 'tel:' },
        { label: 'SMS', placeholder: '+1234567890', prefix: 'sms:' },
        { label: 'WiFi', placeholder: 'WIFI:T:WPA;S:NetworkName;P:Password;;', prefix: '' }
    ];

    const applyTemplate = (template) => {
        if (template.prefix && !text.startsWith(template.prefix)) {
            setText(template.prefix);
        }
    };

    const faqs = [
        {
            question: 'What is a QR code?',
            answer: 'QR (Quick Response) code is a 2D barcode that stores information like URLs, text, or contact info. It can be scanned by smartphone cameras.'
        },
        {
            question: 'What can I encode in a QR code?',
            answer: 'URLs, plain text, email addresses, phone numbers, WiFi credentials, vCards, and more. URLs are most common for marketing.'
        },
        {
            question: 'What is error correction level?',
            answer: 'Error correction allows the QR code to be read even if partially damaged. L (7%), M (15%), Q (25%), H (30%). Higher levels make larger but more resilient codes.'
        },
        {
            question: 'Can I add a logo to the QR code?',
            answer: 'Yes, with higher error correction (Q or H), you can place a small logo in the center. Keep it under 30% of the QR area.'
        }
    ];

    const seoContent = (
        <>
            <h2>QR Code Generator</h2>
            <p>Create customizable QR codes for URLs, text, contact info, and more. Customize colors, size, and error correction level. Download as PNG or SVG. All processing happens locally - no server uploads.</p>
            <h3>Features</h3>
            <ul>
                <li>Custom foreground and background colors</li>
                <li>Adjustable size (100-1000px)</li>
                <li>4 error correction levels</li>
                <li>Download as PNG or SVG</li>
                <li>Copy to clipboard support</li>
                <li>Quick templates for URLs, email, phone, WiFi</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="QR Code Generator"
            description="Generate custom QR codes for free. Support for URLs, text, WiFi, vCards with color customization."
            keywords={['QR code generator', 'QR maker', 'free QR code', 'barcode generator', 'custom QR code']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                {/* Quick Templates */}
                <div className="template-buttons">
                    {templates.map((t) => (
                        <button
                            key={t.label}
                            type="button"
                            className="template-btn"
                            onClick={() => applyTemplate(t)}
                            aria-label={`Use ${t.label} template`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="form-group">
                    <label className="form-label" htmlFor="qr-text">
                        Text or URL <span className="required">*</span>
                    </label>
                    <textarea
                        id="qr-text"
                        className="form-input qr-textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="https://example.com or any text..."
                        rows={3}
                        aria-required="true"
                    />
                    <small className="char-count">{text.length} characters</small>
                </div>

                {/* Options Row */}
                <div className="options-grid">
                    {/* Size */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="qr-size">Size</label>
                        <select
                            id="qr-size"
                            className="form-select"
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                        >
                            <option value="150">Small (150px)</option>
                            <option value="200">Medium (200px)</option>
                            <option value="300">Large (300px)</option>
                            <option value="400">X-Large (400px)</option>
                            <option value="500">XX-Large (500px)</option>
                        </select>
                    </div>

                    {/* Error Correction */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="qr-error">Error Correction</label>
                        <select
                            id="qr-error"
                            className="form-select"
                            value={errorCorrection}
                            onChange={(e) => setErrorCorrection(e.target.value)}
                        >
                            <option value="L">Low (7%)</option>
                            <option value="M">Medium (15%)</option>
                            <option value="Q">Quartile (25%)</option>
                            <option value="H">High (30%)</option>
                        </select>
                    </div>

                    {/* Foreground Color */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="qr-fg">Foreground</label>
                        <div className="color-input-wrapper">
                            <input
                                id="qr-fg"
                                type="color"
                                value={foreground}
                                onChange={(e) => setForeground(e.target.value)}
                                className="color-input"
                            />
                            <span className="color-value">{foreground}</span>
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="qr-bg">Background</label>
                        <div className="color-input-wrapper">
                            <input
                                id="qr-bg"
                                type="color"
                                value={background}
                                onChange={(e) => setBackground(e.target.value)}
                                className="color-input"
                            />
                            <span className="color-value">{background}</span>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    className="btn btn-primary btn-lg btn-full"
                    onClick={generate}
                    disabled={isGenerating || !text.trim()}
                    aria-label="Generate QR Code"
                >
                    {isGenerating ? 'Generating...' : '📱 Generate QR Code'}
                </button>

                {/* Canvas (hidden until generated) */}
                <canvas
                    ref={canvasRef}
                    style={{ display: qrDataUrl ? 'block' : 'none' }}
                    className="qr-canvas"
                    aria-label="Generated QR Code"
                />

                {/* Actions */}
                {qrDataUrl && (
                    <div className="qr-actions">
                        <button className="btn btn-primary" onClick={downloadPng} aria-label="Download as PNG">
                            ⬇️ Download PNG
                        </button>
                        <button className="btn btn-secondary" onClick={downloadSvg} aria-label="Download as SVG">
                            ⬇️ Download SVG
                        </button>
                        <button className="btn btn-secondary" onClick={copyToClipboard} aria-label="Copy to clipboard">
                            📋 Copy
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        .template-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }
        
        .template-btn {
          background: var(--bg-secondary);
          border: 1px solid var(--platinum);
          padding: var(--spacing-xs) var(--spacing-md);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
          transition: all 0.2s ease;
        }
        
        .template-btn:hover {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }
        
        .qr-textarea {
          resize: vertical;
          min-height: 80px;
          font-family: var(--font-mono);
        }
        
        .char-count {
          display: block;
          text-align: right;
          color: var(--text-muted);
          font-size: var(--text-sm);
          margin-top: var(--spacing-xs);
        }
        
        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        
        .color-input-wrapper {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }
        
        .color-input {
          width: 44px;
          height: 44px;
          border: none;
          padding: 0;
          cursor: pointer;
          border-radius: var(--radius);
        }
        
        .color-value {
          font-family: var(--font-mono);
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
        
        .btn-full {
          width: 100%;
        }
        
        .qr-canvas {
          display: block;
          margin: var(--spacing-xl) auto;
          border-radius: var(--radius);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .qr-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }
        
        .required {
          color: var(--error);
        }
        
        @media (max-width: 480px) {
          .qr-actions {
            flex-direction: column;
          }
          
          .qr-actions .btn {
            width: 100%;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default QrGenerator;
