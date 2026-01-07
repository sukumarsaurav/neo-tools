import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// Define all routes for sitemap generation
const staticPages = [
  '/',
  '/privacy',
  '/terms',
  '/contact',
  '/about',
  '/sitemap',
]

const categoryPages = [
  '/category/finance',
  '/category/typing',
  '/category/seo',
  '/category/image',
  '/category/text',
  '/category/developer',
]

const toolPages = [
  // Finance Tools
  '/tools/finance/gst-calculator',
  '/tools/finance/gst-invoice-generator',
  '/tools/finance/emi-calculator',
  '/tools/finance/sip-calculator',
  '/tools/finance/fd-calculator',
  '/tools/finance/interest-calculator',
  '/tools/finance/discount-calculator',
  '/tools/finance/tax-estimator',
  '/tools/finance/inflation-calculator',
  '/tools/finance/roi-calculator',
  '/tools/finance/currency-converter',
  '/tools/finance/margin-calculator',
  // Typing & Education Tools
  '/tools/typing/typing-test',
  '/tools/typing/numpad-test',
  '/tools/typing/blind-typing',
  '/tools/typing/reaction-test',
  '/tools/typing/multiplication-table',
  '/tools/typing/percentage-calculator',
  '/tools/typing/gpa-calculator',
  '/tools/typing/age-calculator',
  // SEO Tools
  '/tools/seo/meta-tag-generator',
  '/tools/seo/robots-txt-generator',
  '/tools/seo/sitemap-generator',
  '/tools/seo/schema-generator',
  '/tools/seo/keyword-density',
  '/tools/seo/serp-preview',
  '/tools/seo/og-generator',
  '/tools/seo/twitter-card-generator',
  '/tools/seo/htaccess-generator',
  '/tools/seo/slug-generator',
  '/tools/seo/broken-link-checker',
  '/tools/seo/seo-audit-checklist',
  '/tools/seo/technical-seo-checklist',
  '/tools/seo/content-calendar',
  '/tools/seo/content-optimization-scorecard',
  '/tools/seo/internal-linking-planner',
  '/tools/seo/local-seo-planner',
  '/tools/seo/competitor-analysis-template',
  '/tools/seo/seo-goal-tracker',
  '/tools/seo/backlink-strategy-planner',
  '/tools/seo/page-speed-checklist',
  // Image & Design Tools
  '/tools/image/favicon-generator',
  '/tools/image/qr-generator',
  '/tools/image/color-palette',
  '/tools/image/rgb-to-hex',
  '/tools/image/hex-to-rgb',
  '/tools/image/gradient-generator',
  '/tools/image/image-to-base64',
  '/tools/image/base64-to-image',
  '/tools/image/image-resizer',
  '/tools/image/image-filters',
  '/tools/image/image-compressor',
  '/tools/image/image-cropper',
  '/tools/image/image-format-converter',
  '/tools/image/color-converter',
  '/tools/image/exam-photo-resizer',
  '/tools/image/batch-image-resizer',
  '/tools/image/image-watermark',
  '/tools/image/color-picker',
  '/tools/image/pattern-generator',
  '/tools/image/image-metadata-viewer',
  '/tools/image/screenshot-mockup',
  '/tools/image/svg-editor',
  '/tools/image/svg-background-generator',
  // Text & Content Tools
  '/tools/text/word-counter',
  '/tools/text/sentence-counter',
  '/tools/text/case-converter',
  '/tools/text/lorem-ipsum',
  '/tools/text/duplicate-remover',
  '/tools/text/text-to-binary',
  '/tools/text/binary-to-text',
  '/tools/text/find-replace',
  '/tools/text/text-compare',
  '/tools/text/password-generator',
  '/tools/text/slug-generator',
  '/tools/text/text-formatter',
  '/tools/text/list-sorter',
  '/tools/text/number-extractor',
  '/tools/text/text-statistics',
  // Developer & Utility Tools
  '/tools/developer/json-formatter',
  '/tools/developer/html-encoder',
  '/tools/developer/url-encoder',
  '/tools/developer/base64-encoder',
  '/tools/developer/uuid-generator',
  '/tools/developer/hash-generator',
  '/tools/developer/timestamp-converter',
  '/tools/developer/regex-tester',
  '/tools/developer/css-minifier',
  '/tools/developer/jwt-decoder',
  '/tools/developer/javascript-minifier',
  '/tools/developer/html-minifier',
  '/tools/developer/sql-formatter',
  '/tools/developer/cron-parser',
  '/tools/developer/yaml-json-converter',
  '/tools/developer/xml-json-converter',
  '/tools/developer/csv-json-converter',
  '/tools/developer/diff-checker',
  '/tools/developer/stopwatch',
  '/tools/developer/date-calculator',
  '/tools/developer/screen-resolution',
  '/tools/developer/user-agent',
  '/tools/developer/speed-test',
]

const allRoutes = [...staticPages, ...categoryPages, ...toolPages]

// Custom plugin to inject CSS preload hints at the start of <head>
// This breaks the critical chain: HTML → JS → CSS by making CSS load in parallel
function cssPreloadPlugin() {
  return {
    name: 'css-preload',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      // Only run in build mode
      if (!ctx.bundle) return html;

      // Find all CSS files in the bundle
      const cssFiles = Object.keys(ctx.bundle).filter(name => name.endsWith('.css'));

      if (cssFiles.length === 0) return html;

      // Create preload links for CSS files
      const preloadLinks = cssFiles.map(file =>
        `<link rel="preload" href="/${file}" as="style" />`
      ).join('\n  ');

      // Insert preload links right after <meta charset>
      return html.replace(
        /<meta charset="UTF-8" \/>/,
        `<meta charset="UTF-8" />\n  <!-- CSS Preload for faster LCP -->\n  ${preloadLinks}`
      );
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    cssPreloadPlugin(),
    react(),
    Sitemap({
      hostname: 'https://www.neofreetools.online',
      dynamicRoutes: allRoutes,
      readable: true,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
  ],
  build: {
    // Enable CSS code splitting for route-based loading
    cssCodeSplit: true,
    // Set chunk size warning limit (in KB)
    chunkSizeWarningLimit: 200,
    // Enable module preload polyfill for better resource hints
    modulePreload: {
      polyfill: true,
    },
    // Rollup options for manual chunk splitting
    rollupOptions: {
      output: {
        // Manual chunks for vendor libraries
        manualChunks: {
          // Core React bundle - loaded on every page
          'vendor-react': ['react', 'react-dom'],
          // Router - loaded on every page
          'vendor-router': ['react-router-dom'],
          // Helmet - for SEO
          'vendor-helmet': ['react-helmet-async'],
          // Heavy libraries - only loaded when needed
          'vendor-pdf': ['jspdf', 'html2canvas'],
          'vendor-qr': ['qrcode'],
          'vendor-zip': ['jszip'],
          'vendor-yaml': ['js-yaml'],
          'vendor-xml': ['fast-xml-parser'],
          'vendor-csv': ['papaparse'],
          'vendor-sql': ['sql-formatter'],
          'vendor-diff': ['diff'],
          'vendor-cron': ['cronstrue'],
          'vendor-terser': ['terser'],
        },
        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          // Vendor chunks get a stable name for better caching
          if (chunkInfo.name.startsWith('vendor-')) {
            return 'assets/[name]-[hash].js';
          }
          // Tool chunks are named by their tool category
          return 'assets/[name]-[hash].js';
        },
        // Asset file names for CSS
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash].css';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Target modern browsers for smaller bundle size
    target: 'es2020',
    // Enable minification with esbuild for faster builds (terser was slow)
    minify: 'esbuild',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
