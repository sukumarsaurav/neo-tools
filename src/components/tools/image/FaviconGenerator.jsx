import { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { loadImage, createCanvas } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

const FaviconGenerator = () => {
    const [image, setImage] = useState(null);
    const [favicons, setFavicons] = useState({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [showHtmlSnippet, setShowHtmlSnippet] = useState(false);
    const canvasRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'favicon-generator').slice(0, 3);

    // Standard favicon sizes with their purposes
    const faviconSizes = [
        { size: 16, label: '16×16', purpose: 'Browser tab (standard)' },
        { size: 32, label: '32×32', purpose: 'Browser tab (Retina)' },
        { size: 48, label: '48×48', purpose: 'Windows site icon' },
        { size: 64, label: '64×64', purpose: 'Windows desktop' },
        { size: 128, label: '128×128', purpose: 'Chrome Web Store' },
        { size: 180, label: '180×180', purpose: 'Apple Touch Icon' },
        { size: 192, label: '192×192', purpose: 'Android Chrome' },
        { size: 512, label: '512×512', purpose: 'PWA splash screens' }
    ];

    const handleUpload = useCallback(({ dataUrl }) => {
        setImage(dataUrl);
        setFavicons({});
        toast.success('Image loaded! Generate favicons below.');
    }, [toast]);

    // Generate a single favicon
    const generateSingleFavicon = useCallback(async (size) => {
        if (!image) {
            toast.warning('Upload an image first');
            return null;
        }

        const img = await loadImage(image);
        const { canvas, ctx } = createCanvas(size, size);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, size, size);

        return canvas.toDataURL('image/png');
    }, [image, toast]);

    // Generate all favicons
    const generateAllFavicons = useCallback(async () => {
        if (!image) {
            toast.warning('Upload an image first');
            return;
        }

        setIsGenerating(true);

        try {
            const generated = {};
            for (const { size } of faviconSizes) {
                generated[size] = await generateSingleFavicon(size);
            }
            setFavicons(generated);
            toast.success('All favicons generated!');
        } catch (error) {
            toast.error('Failed to generate favicons');
        }

        setIsGenerating(false);
    }, [image, generateSingleFavicon, toast]);

    // Download single favicon
    const downloadSingle = useCallback(async (size) => {
        let dataUrl = favicons[size];
        if (!dataUrl) {
            dataUrl = await generateSingleFavicon(size);
        }
        if (!dataUrl) return;

        const link = document.createElement('a');
        link.download = `favicon-${size}x${size}.png`;
        link.href = dataUrl;
        link.click();
        toast.success(`Downloaded ${size}×${size}`);
    }, [favicons, generateSingleFavicon, toast]);

    // Download all as ZIP
    const downloadAllAsZip = useCallback(async () => {
        if (!image) {
            toast.warning('Upload an image first');
            return;
        }

        setIsGenerating(true);
        toast.info('Generating ZIP file...');

        try {
            const zip = new JSZip();

            // Generate all sizes
            for (const { size } of faviconSizes) {
                const dataUrl = favicons[size] || await generateSingleFavicon(size);
                if (dataUrl) {
                    // Convert data URL to blob
                    const base64 = dataUrl.split(',')[1];
                    zip.file(`favicon-${size}x${size}.png`, base64, { base64: true });
                }
            }

            // Add HTML snippet file
            const htmlSnippet = generateHtmlSnippet();
            zip.file('favicon-html-snippet.html', htmlSnippet);

            // Add README
            const readme = `# Favicon Package

Generated with NeoWeb Tools Favicon Generator

## Included Files
${faviconSizes.map(f => `- favicon-${f.size}x${f.size}.png: ${f.purpose}`).join('\n')}
- favicon-html-snippet.html: HTML code to add to your website

## Usage
1. Upload all PNG files to your website's root directory
2. Add the HTML snippet to your <head> section

## Browser Support
- favicon-16x16.png & favicon-32x32.png: All browsers
- apple-touch-icon.png (180x180): iOS Safari
- favicon-192x192.png & favicon-512x512.png: Android Chrome, PWA
`;
            zip.file('README.txt', readme);

            // Generate and download ZIP
            const content = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.download = 'favicon-package.zip';
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);

            toast.success('Downloaded favicon package!');
        } catch (error) {
            console.error('ZIP generation failed:', error);
            toast.error('Failed to generate ZIP');
        }

        setIsGenerating(false);
    }, [image, favicons, generateSingleFavicon, toast]);

    // Generate HTML snippet
    const generateHtmlSnippet = () => {
        return `<!-- Favicon Package - Generated with NeoWeb Tools -->
<!-- Place in your <head> section -->

<!-- Standard favicons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">

<!-- PWA / Web App Manifest -->
<link rel="manifest" href="/site.webmanifest">

<!-- Optional: Windows Tile -->
<meta name="msapplication-TileImage" content="/favicon-144x144.png">
<meta name="msapplication-TileColor" content="#485696">

<!-- Optional: Theme color for mobile -->
<meta name="theme-color" content="#485696">`;
    };

    const copyHtmlSnippet = () => {
        navigator.clipboard.writeText(generateHtmlSnippet());
        toast.success('HTML snippet copied!');
    };

    const faqs = [
        { question: 'What is a favicon?', answer: 'A favicon is the small icon shown in browser tabs and bookmarks. Standard size is 16x16 or 32x32 pixels, but modern browsers support larger sizes.' },
        { question: 'What sizes do I need?', answer: 'At minimum: 16x16 and 32x32 for browsers, 180x180 for Apple devices, 192x192 and 512x512 for Android/PWA apps.' },
        { question: 'How do I add favicons to my website?', answer: 'Download all sizes, upload to your website root, then add the HTML snippet to your <head> section. Use the "Copy HTML" button to get the code.' },
        { question: 'Why use a ZIP download?', answer: 'The ZIP includes all sizes, a ready-to-use HTML snippet, and a README with instructions. It\'s the easiest way to get everything you need.' }
    ];

    const seoContent = (
        <>
            <h2>Favicon Generator</h2>
            <p>Create professional favicons for your website. Generate all required sizes for browsers, Apple devices, Android apps, and PWAs. Download as individual files or a complete package with HTML code.</p>
            <h3>Included Sizes</h3>
            <ul>
                <li>16×16, 32×32, 48×48 - Browser tabs</li>
                <li>180×180 - Apple Touch Icon</li>
                <li>192×192, 512×512 - Android Chrome & PWA</li>
            </ul>
        </>
    );

    return (
        <ToolLayout
            title="Favicon Generator"
            description="Generate favicons from any image. Create all sizes for browsers, iOS, Android, and PWA."
            keywords={['favicon generator', 'favicon maker', 'icon generator', 'website icon', 'apple touch icon']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form">
                <DragDropUpload
                    id="favicon-upload"
                    onUpload={handleUpload}
                    label="Drop your logo or icon image"
                />

                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {image && (
                    <>
                        {/* Actions */}
                        <div className="action-buttons">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={generateAllFavicons}
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Generating...' : '✨ Generate All Sizes'}
                            </button>
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={downloadAllAsZip}
                                disabled={isGenerating}
                            >
                                📦 Download ZIP
                            </button>
                        </div>

                        {/* Favicon Grid */}
                        <div className="favicon-grid">
                            <h4>Favicon Sizes</h4>
                            <div className="sizes-list">
                                {faviconSizes.map(({ size, label, purpose }) => (
                                    <div key={size} className="size-card">
                                        <div className="size-preview">
                                            {favicons[size] ? (
                                                <img src={favicons[size]} alt={`${size}px favicon`} />
                                            ) : (
                                                <div className="size-placeholder">{size}</div>
                                            )}
                                        </div>
                                        <div className="size-info">
                                            <span className="size-label">{label}</span>
                                            <span className="size-purpose">{purpose}</span>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => downloadSingle(size)}
                                        >
                                            ⬇️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* HTML Snippet Section */}
                        <div className="html-section">
                            <div className="section-header">
                                <h4>HTML Snippet</h4>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setShowHtmlSnippet(!showHtmlSnippet)}
                                >
                                    {showHtmlSnippet ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {showHtmlSnippet && (
                                <div className="html-snippet">
                                    <pre>{generateHtmlSnippet()}</pre>
                                    <button
                                        className="btn btn-primary"
                                        onClick={copyHtmlSnippet}
                                    >
                                        📋 Copy HTML
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style>{`
        .tool-form { max-width: 700px; margin: 0 auto; }
        
        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          margin: var(--spacing-lg) 0;
        }
        
        .favicon-grid {
          margin: var(--spacing-xl) 0;
        }
        
        .favicon-grid h4 {
          margin-bottom: var(--spacing-md);
        }
        
        .sizes-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .size-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          background: var(--bg-secondary);
          border-radius: var(--radius);
        }
        
        .size-preview {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: var(--radius);
          border: 1px solid var(--platinum);
        }
        
        .size-preview img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        
        .size-placeholder {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }
        
        .size-info {
          flex: 1;
        }
        
        .size-label {
          display: block;
          font-weight: 600;
        }
        
        .size-purpose {
          font-size: var(--text-sm);
          color: var(--text-muted);
        }
        
        .btn-sm {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-sm);
        }
        
        .html-section {
          margin-top: var(--spacing-xl);
          padding: var(--spacing-lg);
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .section-header h4 {
          margin: 0;
        }
        
        .html-snippet {
          margin-top: var(--spacing-md);
        }
        
        .html-snippet pre {
          background: var(--bg-dark, #1a1a2e);
          color: #f0f0f0;
          padding: var(--spacing-md);
          border-radius: var(--radius);
          overflow-x: auto;
          font-size: var(--text-sm);
          line-height: 1.5;
          margin-bottom: var(--spacing-md);
        }
        
        @media (max-width: 480px) {
          .action-buttons {
            flex-direction: column;
          }
          
          .size-card {
            flex-wrap: wrap;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default FaviconGenerator;
