/**
 * Web Worker for heavy image processing operations
 * Offloads CPU-intensive tasks to prevent UI freezing
 */

/* eslint-disable no-restricted-globals */

// Handle messages from main thread
self.onmessage = async function (e) {
    const { type, payload, id } = e.data;

    try {
        let result;

        switch (type) {
            case 'resize':
                result = await resizeImage(payload);
                break;

            case 'compress':
                result = await compressImage(payload);
                break;

            case 'applyFilter':
                result = await applyFilter(payload);
                break;

            case 'extractColors':
                result = extractColors(payload);
                break;

            case 'batchProcess':
                result = await batchProcess(payload);
                break;

            default:
                throw new Error(`Unknown operation type: ${type}`);
        }

        self.postMessage({ id, success: true, result });
    } catch (error) {
        self.postMessage({ id, success: false, error: error.message });
    }
};

/**
 * Resize an image
 * @param {Object} payload - { imageData, width, height, quality, format }
 */
async function resizeImage({ imageData, width, height, quality = 0.85, format = 'image/jpeg' }) {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill white background for JPEG
    if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
    }

    // Create ImageBitmap from imageData
    const bitmap = await createImageBitmap(imageData);
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // Convert to blob
    const blob = await canvas.convertToBlob({ type: format, quality });
    return new Uint8Array(await blob.arrayBuffer());
}

/**
 * Compress an image
 * @param {Object} payload - { imageData, quality, format }
 */
async function compressImage({ imageData, quality, format }) {
    const bitmap = await createImageBitmap(imageData);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');

    if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, bitmap.width, bitmap.height);
    }

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const blob = await canvas.convertToBlob({ type: format, quality: quality / 100 });
    return {
        data: new Uint8Array(await blob.arrayBuffer()),
        width: canvas.width,
        height: canvas.height,
        size: blob.size
    };
}

/**
 * Apply image filter
 * @param {Object} payload - { imageData, filter, intensity }
 */
async function applyFilter({ imageData, filter, intensity = 1 }) {
    const bitmap = await createImageBitmap(imageData);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    switch (filter) {
        case 'grayscale':
            applyGrayscale(data, intensity);
            break;
        case 'sepia':
            applySepia(data, intensity);
            break;
        case 'invert':
            applyInvert(data, intensity);
            break;
        case 'brightness':
            applyBrightness(data, intensity);
            break;
        case 'contrast':
            applyContrast(data, intensity);
            break;
        case 'blur':
            // Blur requires convolution, return unchanged for worker
            break;
        default:
            break;
    }

    ctx.putImageData(imgData, 0, 0);

    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return new Uint8Array(await blob.arrayBuffer());
}

// Filter implementations
function applyGrayscale(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i] + (avg - data[i]) * intensity;
        data[i + 1] = data[i + 1] + (avg - data[i + 1]) * intensity;
        data[i + 2] = data[i + 2] + (avg - data[i + 2]) * intensity;
    }
}

function applySepia(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const newR = Math.min(255, (r * 0.393 + g * 0.769 + b * 0.189));
        const newG = Math.min(255, (r * 0.349 + g * 0.686 + b * 0.168));
        const newB = Math.min(255, (r * 0.272 + g * 0.534 + b * 0.131));
        data[i] = r + (newR - r) * intensity;
        data[i + 1] = g + (newG - g) * intensity;
        data[i + 2] = b + (newB - b) * intensity;
    }
}

function applyInvert(data, intensity) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] + ((255 - data[i]) - data[i]) * intensity;
        data[i + 1] = data[i + 1] + ((255 - data[i + 1]) - data[i + 1]) * intensity;
        data[i + 2] = data[i + 2] + ((255 - data[i + 2]) - data[i + 2]) * intensity;
    }
}

function applyBrightness(data, intensity) {
    const factor = intensity * 255 * 0.5;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, data[i] + factor));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor));
    }
}

function applyContrast(data, intensity) {
    const factor = (259 * (intensity * 255 + 255)) / (255 * (259 - intensity * 255));
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
    }
}

/**
 * Extract dominant colors from image
 * @param {Object} payload - { imageData, count }
 */
function extractColors({ pixels, count = 5 }) {
    // Simple color quantization using median cut algorithm
    const colorMap = new Map();

    // Sample pixels
    for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.round(pixels[i] / 16) * 16;
        const g = Math.round(pixels[i + 1] / 16) * 16;
        const b = Math.round(pixels[i + 2] / 16) * 16;
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    // Sort by frequency
    const sorted = [...colorMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return { r, g, b, hex: rgbToHex(r, g, b) };
        });

    return sorted;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Batch process multiple images
 * @param {Object} payload - { images, operation, options }
 */
async function batchProcess({ images, operation, options }) {
    const results = [];
    const total = images.length;

    for (let i = 0; i < total; i++) {
        const image = images[i];

        let result;
        switch (operation) {
            case 'resize':
                result = await resizeImage({ ...options, imageData: image.data });
                break;
            case 'compress':
                result = await compressImage({ ...options, imageData: image.data });
                break;
            default:
                result = null;
        }

        results.push({ name: image.name, result });

        // Report progress
        self.postMessage({
            type: 'progress',
            current: i + 1,
            total,
            percentage: Math.round(((i + 1) / total) * 100)
        });
    }

    return results;
}
