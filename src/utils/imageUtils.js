/**
 * Image Utility Functions
 * Shared image manipulation utilities for image tools
 */

/**
 * Load an image from a source URL or data URI
 * @param {string} src - Image source (URL or data URI)
 * @returns {Promise<HTMLImageElement>} Loaded image element
 */
export const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
    });
};

/**
 * Get image dimensions from a file
 * @param {File} file - Image file
 * @returns {Promise<{ width: number, height: number }>} Image dimensions
 */
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} Data URL string
 */
export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

/**
 * Create a canvas with specified dimensions
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }}
 */
export const createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
};

/**
 * Resize an image
 * @param {string} src - Image source
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @param {string} format - Output format (image/png, image/jpeg, image/webp)
 * @param {number} quality - Quality for lossy formats (0-1)
 * @returns {Promise<string>} Resized image as data URL
 */
export const resizeImage = async (src, width, height, format = 'image/png', quality = 0.92) => {
    const img = await loadImage(src);
    const { canvas, ctx } = createCanvas(width, height);

    // Use better quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL(format, quality);
};

/**
 * Apply CSS filter string to an image
 * @param {string} src - Image source
 * @param {string} filterString - CSS filter string
 * @returns {Promise<string>} Filtered image as data URL
 */
export const applyFilters = async (src, filterString) => {
    const img = await loadImage(src);
    const { canvas, ctx } = createCanvas(img.width, img.height);

    ctx.filter = filterString;
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL('image/png');
};

/**
 * Crop an image
 * @param {string} src - Image source
 * @param {number} x - Start X position
 * @param {number} y - Start Y position
 * @param {number} width - Crop width
 * @param {number} height - Crop height
 * @returns {Promise<string>} Cropped image as data URL
 */
export const cropImage = async (src, x, y, width, height) => {
    const img = await loadImage(src);
    const { canvas, ctx } = createCanvas(width, height);

    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    return canvas.toDataURL('image/png');
};

/**
 * Rotate an image
 * @param {string} src - Image source
 * @param {number} degrees - Rotation angle in degrees
 * @returns {Promise<string>} Rotated image as data URL
 */
export const rotateImage = async (src, degrees) => {
    const img = await loadImage(src);
    const radians = (degrees * Math.PI) / 180;

    // Calculate new canvas size
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const newWidth = Math.floor(img.width * cos + img.height * sin);
    const newHeight = Math.floor(img.width * sin + img.height * cos);

    const { canvas, ctx } = createCanvas(newWidth, newHeight);

    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(radians);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    return canvas.toDataURL('image/png');
};

/**
 * Flip an image
 * @param {string} src - Image source
 * @param {'horizontal' | 'vertical'} direction - Flip direction
 * @returns {Promise<string>} Flipped image as data URL
 */
export const flipImage = async (src, direction) => {
    const img = await loadImage(src);
    const { canvas, ctx } = createCanvas(img.width, img.height);

    if (direction === 'horizontal') {
        ctx.translate(img.width, 0);
        ctx.scale(-1, 1);
    } else {
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
    }

    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
};

/**
 * Convert image to different format
 * @param {string} src - Image source
 * @param {string} format - Target format (image/png, image/jpeg, image/webp)
 * @param {number} quality - Quality for lossy formats (0-1)
 * @returns {Promise<string>} Converted image as data URL
 */
export const convertFormat = async (src, format, quality = 0.92) => {
    const img = await loadImage(src);
    const { canvas, ctx } = createCanvas(img.width, img.height);

    // For JPEG, fill background with white (no transparency)
    if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, img.width, img.height);
    }

    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL(format, quality);
};

/**
 * Compress an image by reducing quality
 * @param {string} src - Image source
 * @param {number} quality - Quality (0-1)
 * @param {number} maxWidth - Maximum width (optional)
 * @returns {Promise<{ dataUrl: string, size: number }>} Compressed image
 */
export const compressImage = async (src, quality = 0.8, maxWidth = null) => {
    const img = await loadImage(src);

    let width = img.width;
    let height = img.height;

    if (maxWidth && width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
    }

    const { canvas, ctx } = createCanvas(width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const size = Math.round((dataUrl.length * 3) / 4); // Approximate byte size

    return { dataUrl, size };
};

/**
 * Add text watermark to an image
 * @param {string} src - Image source
 * @param {object} options - Watermark options
 * @returns {Promise<string>} Watermarked image as data URL
 */
export const addTextWatermark = async (src, options = {}) => {
    const {
        text = 'Watermark',
        fontSize = 24,
        fontFamily = 'Arial',
        color = 'rgba(255, 255, 255, 0.5)',
        position = 'bottom-right',
        padding = 20
    } = options;

    const img = await loadImage(src);
    const { canvas, ctx } = createCanvas(img.width, img.height);

    ctx.drawImage(img, 0, 0);

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;

    const textMetrics = ctx.measureText(text);
    let x, y;

    switch (position) {
        case 'top-left':
            x = padding;
            y = padding + fontSize;
            break;
        case 'top-right':
            x = img.width - textMetrics.width - padding;
            y = padding + fontSize;
            break;
        case 'bottom-left':
            x = padding;
            y = img.height - padding;
            break;
        case 'bottom-right':
        default:
            x = img.width - textMetrics.width - padding;
            y = img.height - padding;
            break;
        case 'center':
            x = (img.width - textMetrics.width) / 2;
            y = img.height / 2;
            break;
    }

    ctx.fillText(text, x, y);
    return canvas.toDataURL('image/png');
};

/**
 * Download a data URL as a file
 * @param {string} dataUrl - Data URL or blob URL
 * @param {string} filename - Download filename
 */
export const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Download canvas content as file
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} filename - Download filename
 * @param {string} format - Image format
 * @param {number} quality - Quality for lossy formats
 */
export const downloadCanvas = (canvas, filename, format = 'image/png', quality = 0.92) => {
    const dataUrl = canvas.toDataURL(format, quality);
    downloadDataUrl(dataUrl, filename);
};

/**
 * Get file size from data URL (approximate)
 * @param {string} dataUrl - Data URL
 * @returns {number} Approximate size in bytes
 */
export const getDataUrlSize = (dataUrl) => {
    const base64 = dataUrl.split(',')[1] || dataUrl;
    return Math.round((base64.length * 3) / 4);
};

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Calculate new dimensions maintaining aspect ratio
 * @param {number} origWidth - Original width
 * @param {number} origHeight - Original height
 * @param {number} targetWidth - Target width (optional)
 * @param {number} targetHeight - Target height (optional)
 * @returns {{ width: number, height: number }} New dimensions
 */
export const calculateAspectRatio = (origWidth, origHeight, targetWidth, targetHeight) => {
    const aspectRatio = origWidth / origHeight;

    if (targetWidth && !targetHeight) {
        return {
            width: targetWidth,
            height: Math.round(targetWidth / aspectRatio)
        };
    }

    if (targetHeight && !targetWidth) {
        return {
            width: Math.round(targetHeight * aspectRatio),
            height: targetHeight
        };
    }

    if (targetWidth && targetHeight) {
        // Fit within bounds
        const widthRatio = targetWidth / origWidth;
        const heightRatio = targetHeight / origHeight;
        const ratio = Math.min(widthRatio, heightRatio);

        return {
            width: Math.round(origWidth * ratio),
            height: Math.round(origHeight * ratio)
        };
    }

    return { width: origWidth, height: origHeight };
};

/**
 * Social media image size presets
 */
export const socialMediaPresets = {
    instagram: {
        post: { width: 1080, height: 1080, label: 'Instagram Post' },
        portrait: { width: 1080, height: 1350, label: 'Instagram Portrait' },
        story: { width: 1080, height: 1920, label: 'Instagram Story' },
        landscape: { width: 1080, height: 566, label: 'Instagram Landscape' }
    },
    facebook: {
        post: { width: 1200, height: 630, label: 'Facebook Post' },
        cover: { width: 820, height: 312, label: 'Facebook Cover' },
        profile: { width: 180, height: 180, label: 'Facebook Profile' },
        story: { width: 1080, height: 1920, label: 'Facebook Story' }
    },
    twitter: {
        post: { width: 1200, height: 675, label: 'Twitter Post' },
        header: { width: 1500, height: 500, label: 'Twitter Header' },
        profile: { width: 400, height: 400, label: 'Twitter Profile' }
    },
    linkedin: {
        post: { width: 1200, height: 627, label: 'LinkedIn Post' },
        cover: { width: 1584, height: 396, label: 'LinkedIn Cover' },
        profile: { width: 400, height: 400, label: 'LinkedIn Profile' }
    },
    youtube: {
        thumbnail: { width: 1280, height: 720, label: 'YouTube Thumbnail' },
        banner: { width: 2560, height: 1440, label: 'YouTube Banner' }
    },
    pinterest: {
        pin: { width: 1000, height: 1500, label: 'Pinterest Pin' }
    }
};

/**
 * Check if file is a valid image
 * @param {File} file - File to check
 * @returns {boolean} True if valid image
 */
export const isValidImageFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp'];
    return validTypes.includes(file.type);
};

/**
 * Get image MIME type from data URL
 * @param {string} dataUrl - Data URL
 * @returns {string} MIME type
 */
export const getMimeType = (dataUrl) => {
    const match = dataUrl.match(/^data:([^;]+);/);
    return match ? match[1] : 'image/png';
};

/**
 * Get file extension from MIME type
 * @param {string} mimeType - MIME type
 * @returns {string} File extension
 */
export const getExtension = (mimeType) => {
    const extensions = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'image/bmp': 'bmp',
        'image/x-icon': 'ico'
    };
    return extensions[mimeType] || 'png';
};
