/**
 * Color Utility Functions
 * Shared color conversion and manipulation utilities for image tools
 */

/**
 * Convert HEX color to RGB object
 * @param {string} hex - HEX color code (with or without #)
 * @returns {{ r: number, g: number, b: number }} RGB values (0-255)
 */
export const hexToRgb = (hex) => {
    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h.split('').map(c => c + c).join('');
    }
    if (h.length !== 6) {
        throw new Error('Invalid HEX color');
    }
    return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16)
    };
};

/**
 * Convert RGB values to HEX color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} HEX color code with #
 */
export const rgbToHex = (r, g, b) => {
    const toHex = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/**
 * Convert HEX color to HSL values
 * @param {string} hex - HEX color code
 * @returns {{ h: number, s: number, l: number }} HSL values (h: 0-360, s: 0-100, l: 0-100)
 */
export const hexToHsl = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
};

/**
 * Convert RGB values to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{ h: number, s: number, l: number }} HSL values
 */
export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
            default:
                h = 0;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

/**
 * Convert HSL values to HEX color
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} HEX color code with #
 */
export const hslToHex = (h, s, l) => {
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
};

/**
 * Convert HSL values to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {{ r: number, g: number, b: number }} RGB values
 */
export const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r, g, b;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
};

/**
 * Convert RGB to CMYK
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{ c: number, m: number, y: number, k: number }} CMYK values (0-100)
 */
export const rgbToCmyk = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);

    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    return {
        c: Math.round(((1 - r - k) / (1 - k)) * 100),
        m: Math.round(((1 - g - k) / (1 - k)) * 100),
        y: Math.round(((1 - b - k) / (1 - k)) * 100),
        k: Math.round(k * 100)
    };
};

/**
 * Convert CMYK to RGB
 * @param {number} c - Cyan (0-100)
 * @param {number} m - Magenta (0-100)
 * @param {number} y - Yellow (0-100)
 * @param {number} k - Key/Black (0-100)
 * @returns {{ r: number, g: number, b: number }} RGB values
 */
export const cmykToRgb = (c, m, y, k) => {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    return {
        r: Math.round(255 * (1 - c) * (1 - k)),
        g: Math.round(255 * (1 - m) * (1 - k)),
        b: Math.round(255 * (1 - y) * (1 - k))
    };
};

/**
 * Calculate relative luminance of a color (WCAG 2.0)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} Relative luminance (0-1)
 */
export const getRelativeLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculate contrast ratio between two colors (WCAG 2.0)
 * @param {string} hex1 - First HEX color
 * @param {string} hex2 - Second HEX color
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (hex1, hex2) => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);

    const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color combination meets WCAG accessibility standards
 * @param {string} foreground - Foreground HEX color
 * @param {string} background - Background HEX color
 * @returns {{ ratio: number, AA: boolean, AAA: boolean, AALarge: boolean, AAALarge: boolean }}
 */
export const checkAccessibility = (foreground, background) => {
    const ratio = getContrastRatio(foreground, background);
    return {
        ratio: Math.round(ratio * 100) / 100,
        AA: ratio >= 4.5,      // Normal text
        AAA: ratio >= 7,       // Normal text (enhanced)
        AALarge: ratio >= 3,   // Large text (18pt+ or 14pt bold)
        AAALarge: ratio >= 4.5 // Large text (enhanced)
    };
};

/**
 * Generate color variations (shades and tints)
 * @param {string} hex - Base HEX color
 * @returns {object} Object with color variations
 */
export const generateColorVariations = (hex) => {
    const { h, s, l } = hexToHsl(hex);

    return {
        lighter: hslToHex(h, s, Math.min(l + 20, 95)),
        light: hslToHex(h, s, Math.min(l + 10, 90)),
        base: hex,
        dark: hslToHex(h, s, Math.max(l - 15, 10)),
        darker: hslToHex(h, s, Math.max(l - 30, 5))
    };
};

/**
 * Generate harmonious colors
 * @param {string} hex - Base HEX color
 * @returns {object} Harmonious color combinations
 */
export const generateHarmoniousColors = (hex) => {
    const { h, s, l } = hexToHsl(hex);

    return {
        base: hex,
        complement: hslToHex((h + 180) % 360, s, l),
        analogous1: hslToHex((h + 30) % 360, s, l),
        analogous2: hslToHex((h - 30 + 360) % 360, s, l),
        triadic1: hslToHex((h + 120) % 360, s, l),
        triadic2: hslToHex((h + 240) % 360, s, l),
        splitComplement1: hslToHex((h + 150) % 360, s, l),
        splitComplement2: hslToHex((h + 210) % 360, s, l)
    };
};

/**
 * Determine if a color is light or dark
 * @param {string} hex - HEX color code
 * @returns {boolean} True if color is light
 */
export const isLightColor = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const luminance = getRelativeLuminance(r, g, b);
    return luminance > 0.179;
};

/**
 * Get optimal text color (black or white) for a background
 * @param {string} backgroundHex - Background HEX color
 * @returns {string} '#000000' or '#FFFFFF'
 */
export const getTextColorForBackground = (backgroundHex) => {
    return isLightColor(backgroundHex) ? '#000000' : '#FFFFFF';
};

/**
 * Validate HEX color format
 * @param {string} hex - HEX color to validate
 * @returns {boolean} True if valid
 */
export const isValidHex = (hex) => {
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

/**
 * Format color as CSS variable declaration
 * @param {string} name - Variable name
 * @param {string} hex - HEX color
 * @returns {string} CSS variable declaration
 */
export const toCssVariable = (name, hex) => {
    const rgb = hexToRgb(hex);
    return `--${name}: ${hex};\n--${name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`;
};

/**
 * Export palette as CSS variables
 * @param {object} palette - Object with color names as keys and HEX values
 * @returns {string} CSS custom properties block
 */
export const paletteToCss = (palette) => {
    const lines = Object.entries(palette).map(([name, hex]) => toCssVariable(name, hex));
    return `:root {\n  ${lines.join('\n  ')}\n}`;
};
