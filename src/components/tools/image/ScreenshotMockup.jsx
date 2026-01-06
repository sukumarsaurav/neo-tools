import { useState, useRef, useCallback, useEffect } from 'react';
import ToolLayout from '../../layout/ToolLayout';
import toolsData from '../../../data/tools.json';
import DragDropUpload from './components/DragDropUpload';
import { useToast } from '../../common/Toast';
import { loadImage, createCanvas, downloadDataUrl } from '../../../utils/imageUtils';
import '../../../styles/tools.css';

// Device frame definitions with dimensions and styles
const deviceFrames = {
    iphone: {
        name: 'iPhone',
        variants: [
            { id: 'iphone-15', name: 'iPhone 15 Pro', width: 393, height: 852, radius: 55, bezel: 12, notch: true, color: '#1a1a1a' },
            { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, radius: 47, bezel: 12, notch: true, color: '#1a1a1a' },
            { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, radius: 0, bezel: 60, notch: false, homeButton: true, color: '#1a1a1a' }
        ]
    },
    android: {
        name: 'Android',
        variants: [
            { id: 'pixel-8', name: 'Pixel 8', width: 412, height: 915, radius: 40, bezel: 10, punchHole: true, color: '#1a1a1a' },
            { id: 'samsung-s24', name: 'Samsung S24', width: 360, height: 780, radius: 35, bezel: 8, punchHole: true, color: '#1a1a1a' },
            { id: 'android-generic', name: 'Generic Android', width: 360, height: 800, radius: 30, bezel: 10, color: '#333333' }
        ]
    },
    tablet: {
        name: 'Tablet',
        variants: [
            { id: 'ipad-pro', name: 'iPad Pro', width: 1024, height: 1366, radius: 18, bezel: 20, color: '#1a1a1a' },
            { id: 'ipad-air', name: 'iPad Air', width: 820, height: 1180, radius: 18, bezel: 20, homeButton: false, color: '#1a1a1a' },
            { id: 'android-tablet', name: 'Android Tablet', width: 800, height: 1280, radius: 15, bezel: 25, color: '#333333' }
        ]
    },
    laptop: {
        name: 'Laptop',
        variants: [
            { id: 'macbook-pro', name: 'MacBook Pro', width: 1512, height: 982, radius: 10, bezel: 14, notchTop: true, color: '#2d2d2d', baseHeight: 30 },
            { id: 'macbook-air', name: 'MacBook Air', width: 1470, height: 956, radius: 10, bezel: 14, color: '#c0c0c0', baseHeight: 28 },
            { id: 'laptop-generic', name: 'Generic Laptop', width: 1366, height: 768, radius: 5, bezel: 20, color: '#444444', baseHeight: 35 }
        ]
    },
    desktop: {
        name: 'Desktop',
        variants: [
            { id: 'imac', name: 'iMac', width: 2560, height: 1440, radius: 0, bezel: 30, color: '#c0c0c0', stand: true },
            { id: 'monitor', name: 'Monitor', width: 1920, height: 1080, radius: 0, bezel: 15, color: '#1a1a1a', stand: true }
        ]
    },
    browser: {
        name: 'Browser',
        variants: [
            { id: 'chrome', name: 'Chrome', width: 1280, height: 800, radius: 8, chromeStyle: 'chrome', color: '#f0f0f0' },
            { id: 'safari', name: 'Safari', width: 1280, height: 800, radius: 10, chromeStyle: 'safari', color: '#f8f8f8' },
            { id: 'firefox', name: 'Firefox', width: 1280, height: 800, radius: 8, chromeStyle: 'firefox', color: '#1a1a2e' }
        ]
    }
};

const ScreenshotMockup = () => {
    const [image, setImage] = useState(null);
    const [imageObj, setImageObj] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('iphone');
    const [selectedDevice, setSelectedDevice] = useState('iphone-15');
    const [backgroundColor, setBackgroundColor] = useState('#f5f5f5');
    const [backgroundType, setBackgroundType] = useState('solid'); // solid, gradient, transparent
    const [gradientColor1, setGradientColor1] = useState('#667eea');
    const [gradientColor2, setGradientColor2] = useState('#764ba2');
    const [gradientAngle, setGradientAngle] = useState(135);
    const [padding, setPadding] = useState(60);
    const [shadow, setShadow] = useState(true);
    const [preview, setPreview] = useState(null);

    const canvasRef = useRef(null);
    const toast = useToast();

    const relatedTools = toolsData.tools.filter(t => t.category === 'image' && t.id !== 'screenshot-mockup').slice(0, 3);

    const currentDevice = Object.values(deviceFrames)
        .flatMap(cat => cat.variants)
        .find(d => d.id === selectedDevice);

    const handleUpload = useCallback(async ({ dataUrl }) => {
        setImage(dataUrl);
        const img = await loadImage(dataUrl);
        setImageObj(img);
        toast.success('Screenshot loaded!');
    }, [toast]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedDevice(deviceFrames[category].variants[0].id);
    };

    // Draw device frame
    const generateMockup = useCallback(() => {
        if (!imageObj || !currentDevice) return;

        // Calculate dimensions
        const device = currentDevice;
        const scale = 0.5; // Scale down for performance
        const frameWidth = device.width * scale;
        const frameHeight = device.height * scale;

        // Add laptop base if needed
        const baseHeight = device.baseHeight ? device.baseHeight * scale : 0;
        const standHeight = device.stand ? 80 * scale : 0;

        const totalWidth = frameWidth + padding * 2;
        const totalHeight = frameHeight + padding * 2 + baseHeight + standHeight;

        const { canvas, ctx } = createCanvas(totalWidth, totalHeight);

        // Draw background
        if (backgroundType === 'solid') {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, totalWidth, totalHeight);
        } else if (backgroundType === 'gradient') {
            const gradient = ctx.createLinearGradient(
                0, 0,
                totalWidth * Math.cos(gradientAngle * Math.PI / 180),
                totalHeight * Math.sin(gradientAngle * Math.PI / 180)
            );
            gradient.addColorStop(0, gradientColor1);
            gradient.addColorStop(1, gradientColor2);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, totalWidth, totalHeight);
        }

        // Calculate frame position
        const frameX = padding;
        const frameY = padding;

        // Draw shadow
        if (shadow && backgroundType !== 'transparent') {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 40;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 20;
        }

        // Draw device frame
        ctx.fillStyle = device.color;

        if (device.chromeStyle) {
            // Browser window
            const tabBarHeight = 40 * scale;
            const toolbarHeight = 35 * scale;
            const totalChrome = tabBarHeight + toolbarHeight;

            // Window frame
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameWidth, frameHeight + totalChrome, device.radius * scale);
            ctx.fill();

            ctx.shadowColor = 'transparent';

            // Tab bar
            ctx.fillStyle = device.chromeStyle === 'safari' ? '#e5e5e5' : '#dee1e6';
            ctx.fillRect(frameX, frameY, frameWidth, tabBarHeight);

            // Traffic lights
            ctx.fillStyle = '#ff5f56';
            ctx.beginPath();
            ctx.arc(frameX + 15, frameY + tabBarHeight / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffbd2e';
            ctx.beginPath();
            ctx.arc(frameX + 35, frameY + tabBarHeight / 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#27ca40';
            ctx.beginPath();
            ctx.arc(frameX + 55, frameY + tabBarHeight / 2, 6, 0, Math.PI * 2);
            ctx.fill();

            // Address bar
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(frameX + 80, frameY + tabBarHeight + 8, frameWidth - 100, toolbarHeight - 16, 5);
            ctx.fill();

            // Screenshot area
            ctx.drawImage(imageObj, frameX, frameY + totalChrome, frameWidth, frameHeight);

        } else {
            // Phone/Tablet/Laptop frame
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameWidth, frameHeight, device.radius * scale);
            ctx.fill();

            ctx.shadowColor = 'transparent';

            // Draw screen area (slightly smaller than frame for bezel)
            const bezel = device.bezel * scale;
            const screenX = frameX + bezel;
            const screenY = frameY + bezel;
            const screenWidth = frameWidth - bezel * 2;
            const screenHeight = frameHeight - bezel * 2;

            // Draw screenshot
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(screenX, screenY, screenWidth, screenHeight, Math.max(0, (device.radius - device.bezel) * scale));
            ctx.clip();
            ctx.drawImage(imageObj, screenX, screenY, screenWidth, screenHeight);
            ctx.restore();

            // Draw notch for iPhone
            if (device.notch) {
                ctx.fillStyle = device.color;
                const notchWidth = 120 * scale;
                const notchHeight = 35 * scale;
                ctx.beginPath();
                ctx.roundRect(
                    frameX + (frameWidth - notchWidth) / 2,
                    frameY + bezel - 5,
                    notchWidth,
                    notchHeight,
                    [0, 0, 15 * scale, 15 * scale]
                );
                ctx.fill();
            }

            // Draw punch hole for Android
            if (device.punchHole) {
                ctx.fillStyle = device.color;
                ctx.beginPath();
                ctx.arc(frameX + frameWidth / 2, frameY + bezel + 15 * scale, 6 * scale, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw home button
            if (device.homeButton) {
                ctx.fillStyle = '#333333';
                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(frameX + frameWidth / 2, frameY + frameHeight - 30 * scale, 20 * scale, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw laptop base
            if (device.baseHeight) {
                ctx.fillStyle = device.color;
                ctx.beginPath();
                ctx.moveTo(frameX - 10, frameY + frameHeight);
                ctx.lineTo(frameX + frameWidth + 10, frameY + frameHeight);
                ctx.lineTo(frameX + frameWidth + 30, frameY + frameHeight + baseHeight);
                ctx.lineTo(frameX - 30, frameY + frameHeight + baseHeight);
                ctx.closePath();
                ctx.fill();
            }

            // Draw monitor stand
            if (device.stand) {
                ctx.fillStyle = device.color;
                // Neck
                ctx.fillRect(frameX + frameWidth / 2 - 30 * scale, frameY + frameHeight, 60 * scale, 50 * scale);
                // Base
                ctx.beginPath();
                ctx.ellipse(frameX + frameWidth / 2, frameY + frameHeight + standHeight - 10, 80 * scale, 20 * scale, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        setPreview(canvas.toDataURL('image/png'));
    }, [imageObj, currentDevice, backgroundColor, backgroundType, gradientColor1, gradientColor2, gradientAngle, padding, shadow]);

    useEffect(() => {
        if (imageObj) {
            generateMockup();
        }
    }, [generateMockup, imageObj]);

    const download = () => {
        if (!preview) return;
        downloadDataUrl(preview, `mockup-${selectedDevice}.png`);
        toast.success('Downloaded!');
    };

    const faqs = [
        { question: 'What devices are supported?', answer: 'iPhone, Android phones, iPads, tablets, MacBooks, laptops, iMacs, monitors, and browser windows (Chrome, Safari, Firefox).' },
        { question: 'What screenshot size works best?', answer: 'Screenshots that match the device aspect ratio work best. The tool will scale your screenshot to fit the device screen.' },
        { question: 'Can I customize the background?', answer: 'Yes! Choose solid colors, gradients, or transparent backgrounds. Adjust padding and add shadows for professional results.' }
    ];

    const seoContent = (
        <>
            <h2>Screenshot Mockup Generator</h2>
            <p>Create professional device mockups for presentations, app stores, and marketing materials. Place your screenshots inside realistic device frames including iPhones, Android phones, iPads, MacBooks, and browser windows.</p>
        </>
    );

    return (
        <ToolLayout
            title="Screenshot Mockup Generator"
            description="Create professional device mockups. Place screenshots in iPhone, MacBook, browser frames and more."
            keywords={['mockup generator', 'device mockup', 'screenshot mockup', 'iPhone mockup', 'MacBook mockup']}
            category="image"
            categoryName="Image & Design"
            faqs={faqs}
            relatedTools={relatedTools}
            seoContent={seoContent}
        >
            <div className="tool-form tool-form-wide">
                <DragDropUpload
                    id="mockup-upload"
                    onUpload={handleUpload}
                    label="Drop your screenshot here"
                />

                {image && (
                    <div className="mockup-editor">
                        {/* Preview */}
                        <div className="preview-section">
                            {preview && (
                                <img src={preview} alt="Mockup preview" className="mockup-preview" />
                            )}
                        </div>

                        {/* Settings */}
                        <div className="settings-panel">
                            {/* Device Category */}
                            <div className="device-categories">
                                {Object.entries(deviceFrames).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        className={`category-btn ${selectedCategory === key ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(key)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Device Variants */}
                            <div className="form-group">
                                <label className="form-label">Device Model</label>
                                <select
                                    className="form-select"
                                    value={selectedDevice}
                                    onChange={(e) => setSelectedDevice(e.target.value)}
                                >
                                    {deviceFrames[selectedCategory].variants.map(device => (
                                        <option key={device.id} value={device.id}>{device.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Background */}
                            <div className="form-group">
                                <label className="form-label">Background</label>
                                <div className="bg-type-toggle">
                                    <button
                                        className={`toggle-btn ${backgroundType === 'solid' ? 'active' : ''}`}
                                        onClick={() => setBackgroundType('solid')}
                                    >
                                        Solid
                                    </button>
                                    <button
                                        className={`toggle-btn ${backgroundType === 'gradient' ? 'active' : ''}`}
                                        onClick={() => setBackgroundType('gradient')}
                                    >
                                        Gradient
                                    </button>
                                    <button
                                        className={`toggle-btn ${backgroundType === 'transparent' ? 'active' : ''}`}
                                        onClick={() => setBackgroundType('transparent')}
                                    >
                                        None
                                    </button>
                                </div>
                            </div>

                            {backgroundType === 'solid' && (
                                <div className="form-group">
                                    <label className="form-label">Background Color</label>
                                    <input
                                        type="color"
                                        value={backgroundColor}
                                        onChange={(e) => setBackgroundColor(e.target.value)}
                                        className="color-input"
                                    />
                                </div>
                            )}

                            {backgroundType === 'gradient' && (
                                <div className="gradient-options">
                                    <div className="color-row">
                                        <div className="form-group">
                                            <label className="form-label">Color 1</label>
                                            <input
                                                type="color"
                                                value={gradientColor1}
                                                onChange={(e) => setGradientColor1(e.target.value)}
                                                className="color-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Color 2</label>
                                            <input
                                                type="color"
                                                value={gradientColor2}
                                                onChange={(e) => setGradientColor2(e.target.value)}
                                                className="color-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Angle: {gradientAngle}°</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={gradientAngle}
                                            onChange={(e) => setGradientAngle(parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Padding */}
                            <div className="form-group">
                                <label className="form-label">Padding: {padding}px</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="150"
                                    value={padding}
                                    onChange={(e) => setPadding(parseInt(e.target.value))}
                                />
                            </div>

                            {/* Shadow */}
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={shadow}
                                    onChange={(e) => setShadow(e.target.checked)}
                                />
                                <span>Add shadow</span>
                            </label>

                            {/* Download */}
                            <button className="btn btn-primary btn-lg btn-full" onClick={download}>
                                ⬇️ Download Mockup
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .tool-form-wide { max-width: 1000px; }
        
        .mockup-editor {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: var(--spacing-lg);
          margin-top: var(--spacing-lg);
        }
        
        .preview-section {
          background: #f0f0f0;
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          overflow: hidden;
        }
        
        .mockup-preview {
          max-width: 100%;
          max-height: 500px;
          border-radius: var(--radius);
        }
        
        .settings-panel {
          background: var(--bg-secondary);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .device-categories {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
        }
        
        .category-btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          background: white;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
          transition: all 0.15s ease;
        }
        
        .category-btn:hover {
          border-color: var(--yinmn-blue);
        }
        
        .category-btn.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }
        
        .bg-type-toggle {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .toggle-btn {
          flex: 1;
          padding: var(--spacing-xs);
          background: white;
          border: 1px solid var(--platinum);
          border-radius: var(--radius);
          cursor: pointer;
          font-size: var(--text-sm);
          transition: all 0.15s ease;
        }
        
        .toggle-btn.active {
          background: var(--yinmn-blue);
          color: white;
          border-color: var(--yinmn-blue);
        }
        
        .color-input {
          width: 100%;
          height: 40px;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
        }
        
        .color-row {
          display: flex;
          gap: var(--spacing-sm);
        }
        
        .color-row .form-group {
          flex: 1;
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }
        
        .btn-full { width: 100%; }
        
        @media (max-width: 768px) {
          .mockup-editor {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </ToolLayout>
    );
};

export default ScreenshotMockup;
