import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Spinner from './components/common/Spinner';

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    padding: '2rem'
  }}>
    <Spinner size="large" label="Loading tool..." />
  </div>
);

// ============================================
// Core Pages (loaded synchronously for fast initial render)
// ============================================
import Home from './pages/Home';
import Category from './pages/Category';

// Static/Legal Pages (loaded synchronously - small size, needed for SEO)
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import SitemapPage from './pages/SitemapPage';
import SeoDashboard from './pages/SeoDashboard';

// ============================================
// LAZY LOADED: Financial Tools (12)
// ============================================
const GstCalculator = lazy(() => import('./components/tools/finance/GstCalculator'));
const GstInvoiceGenerator = lazy(() => import('./components/tools/finance/GstInvoiceGenerator'));
const EmiCalculator = lazy(() => import('./components/tools/finance/EmiCalculator'));
const SipCalculator = lazy(() => import('./components/tools/finance/SipCalculator'));
const FdCalculator = lazy(() => import('./components/tools/finance/FdCalculator'));
const InterestCalculator = lazy(() => import('./components/tools/finance/InterestCalculator'));
const DiscountCalculator = lazy(() => import('./components/tools/finance/DiscountCalculator'));
const TaxEstimator = lazy(() => import('./components/tools/finance/TaxEstimator'));
const InflationCalculator = lazy(() => import('./components/tools/finance/InflationCalculator'));
const RoiCalculator = lazy(() => import('./components/tools/finance/RoiCalculator'));
const CurrencyConverter = lazy(() => import('./components/tools/finance/CurrencyConverter'));
const MarginCalculator = lazy(() => import('./components/tools/finance/MarginCalculator'));

// ============================================
// LAZY LOADED: Typing & Education Tools (9)
// ============================================
const TypingTest = lazy(() => import('./components/tools/typing/TypingTest'));
const TypingChapter = lazy(() => import('./components/tools/typing/TypingChapter'));
const NumpadTest = lazy(() => import('./components/tools/typing/NumpadTest'));
const BlindTyping = lazy(() => import('./components/tools/typing/BlindTyping'));
const ReactionTest = lazy(() => import('./components/tools/typing/ReactionTest'));
const MultiplicationTable = lazy(() => import('./components/tools/typing/MultiplicationTable'));
const PercentageCalculator = lazy(() => import('./components/tools/typing/PercentageCalculator'));
const GpaCalculator = lazy(() => import('./components/tools/typing/GpaCalculator'));
const AgeCalculator = lazy(() => import('./components/tools/typing/AgeCalculator'));

// ============================================
// LAZY LOADED: SEO Tools (29)
// ============================================
// ============================================
const MetaTagGenerator = lazy(() => import('./components/tools/seo/MetaTagGenerator'));
const RobotsTxtGenerator = lazy(() => import('./components/tools/seo/RobotsTxtGenerator'));
const SitemapGenerator = lazy(() => import('./components/tools/seo/SitemapGenerator'));
const SchemaGenerator = lazy(() => import('./components/tools/seo/SchemaGenerator'));
const KeywordDensity = lazy(() => import('./components/tools/seo/KeywordDensity'));
const SerpPreview = lazy(() => import('./components/tools/seo/SerpPreview'));
const OgGenerator = lazy(() => import('./components/tools/seo/OgGenerator'));
const TwitterCardGenerator = lazy(() => import('./components/tools/seo/TwitterCardGenerator'));
const HtaccessGenerator = lazy(() => import('./components/tools/seo/HtaccessGenerator'));
const SlugGenerator = lazy(() => import('./components/tools/seo/SlugGenerator'));
const BrokenLinkChecker = lazy(() => import('./components/tools/seo/BrokenLinkChecker'));
const SeoAuditChecklist = lazy(() => import('./components/tools/seo/SeoAuditChecklist'));
const TechnicalSeoChecklist = lazy(() => import('./components/tools/seo/TechnicalSeoChecklist'));
const ContentCalendar = lazy(() => import('./components/tools/seo/ContentCalendar'));
const ContentOptimizationScorecard = lazy(() => import('./components/tools/seo/ContentOptimizationScorecard'));
const InternalLinkingPlanner = lazy(() => import('./components/tools/seo/InternalLinkingPlanner'));
const LocalSeoPlanner = lazy(() => import('./components/tools/seo/LocalSeoPlanner'));
const CompetitorAnalysisTemplate = lazy(() => import('./components/tools/seo/CompetitorAnalysisTemplate'));
const SeoGoalTracker = lazy(() => import('./components/tools/seo/SeoGoalTracker'));
const BacklinkStrategyPlanner = lazy(() => import('./components/tools/seo/BacklinkStrategyPlanner'));
const PageSpeedChecklist = lazy(() => import('./components/tools/seo/PageSpeedChecklist'));
const HreflangGenerator = lazy(() => import('./components/tools/seo/HreflangGenerator'));
const HeadingAnalyzer = lazy(() => import('./components/tools/seo/HeadingAnalyzer'));
const ReadabilityChecker = lazy(() => import('./components/tools/seo/ReadabilityChecker'));
const CanonicalUrlGenerator = lazy(() => import('./components/tools/seo/CanonicalUrlGenerator'));
const RedirectChainAnalyzer = lazy(() => import('./components/tools/seo/RedirectChainAnalyzer'));
const ImageAltTextSuggester = lazy(() => import('./components/tools/seo/ImageAltTextSuggester'));
const MobileSerpPreview = lazy(() => import('./components/tools/seo/MobileSerpPreview'));
const AllInOneMetaGenerator = lazy(() => import('./components/tools/seo/AllInOneMetaGenerator'));

// ============================================
// LAZY LOADED: Image & Design Tools (22)
// ============================================
const FaviconGenerator = lazy(() => import('./components/tools/image/FaviconGenerator'));
const QrGenerator = lazy(() => import('./components/tools/image/QrGenerator'));
const ColorPalette = lazy(() => import('./components/tools/image/ColorPalette'));
const RgbToHex = lazy(() => import('./components/tools/image/RgbToHex'));
const HexToRgb = lazy(() => import('./components/tools/image/HexToRgb'));
const GradientGenerator = lazy(() => import('./components/tools/image/GradientGenerator'));
const ImageToBase64 = lazy(() => import('./components/tools/image/ImageToBase64'));
const Base64ToImage = lazy(() => import('./components/tools/image/Base64ToImage'));
const ImageResizer = lazy(() => import('./components/tools/image/ImageResizer'));
const ImageFilters = lazy(() => import('./components/tools/image/ImageFilters'));
const ImageCompressor = lazy(() => import('./components/tools/image/ImageCompressor'));
const ImageCropper = lazy(() => import('./components/tools/image/ImageCropper'));
const ImageFormatConverter = lazy(() => import('./components/tools/image/ImageFormatConverter'));
const ColorConverter = lazy(() => import('./components/tools/image/ColorConverter'));
const ExamPhotoResizer = lazy(() => import('./components/tools/image/ExamPhotoResizer'));
const BatchImageResizer = lazy(() => import('./components/tools/image/BatchImageResizer'));
const ImageWatermark = lazy(() => import('./components/tools/image/ImageWatermark'));
const ColorPicker = lazy(() => import('./components/tools/image/ColorPicker'));
const PatternGenerator = lazy(() => import('./components/tools/image/PatternGenerator'));
const ImageMetadataViewer = lazy(() => import('./components/tools/image/ImageMetadataViewer'));
const ScreenshotMockup = lazy(() => import('./components/tools/image/ScreenshotMockup'));
const SvgEditor = lazy(() => import('./components/tools/image/SvgEditor'));
const SvgBackgroundGenerator = lazy(() => import('./components/tools/image/SvgBackgroundGenerator'));

// ============================================
// LAZY LOADED: Text & Content Tools (15)
// ============================================
const WordCounter = lazy(() => import('./components/tools/text/WordCounter'));
const SentenceCounter = lazy(() => import('./components/tools/text/SentenceCounter'));
const CaseConverter = lazy(() => import('./components/tools/text/CaseConverter'));
const LoremIpsum = lazy(() => import('./components/tools/text/LoremIpsum'));
const DuplicateRemover = lazy(() => import('./components/tools/text/DuplicateRemover'));
const TextToBinary = lazy(() => import('./components/tools/text/TextToBinary'));
const BinaryToText = lazy(() => import('./components/tools/text/BinaryToText'));
const FindReplace = lazy(() => import('./components/tools/text/FindReplace'));
const TextCompare = lazy(() => import('./components/tools/text/TextCompare'));
const PasswordGenerator = lazy(() => import('./components/tools/text/PasswordGenerator'));
const TextSlugGenerator = lazy(() => import('./components/tools/text/SlugGenerator'));
const TextFormatter = lazy(() => import('./components/tools/text/TextFormatter'));
const ListSorter = lazy(() => import('./components/tools/text/ListSorter'));
const NumberExtractor = lazy(() => import('./components/tools/text/NumberExtractor'));
const TextStatistics = lazy(() => import('./components/tools/text/TextStatistics'));

// ============================================
// LAZY LOADED: Developer & Utility Tools (23)
// ============================================
const JsonFormatter = lazy(() => import('./components/tools/developer/JsonFormatter'));
const HtmlEncoder = lazy(() => import('./components/tools/developer/HtmlEncoder'));
const UrlEncoder = lazy(() => import('./components/tools/developer/UrlEncoder'));
const Base64Encoder = lazy(() => import('./components/tools/developer/Base64Encoder'));
const UuidGenerator = lazy(() => import('./components/tools/developer/UuidGenerator'));
const HashGenerator = lazy(() => import('./components/tools/developer/HashGenerator'));
const TimestampConverter = lazy(() => import('./components/tools/developer/TimestampConverter'));
const RegexTester = lazy(() => import('./components/tools/developer/RegexTester'));
const CssMinifier = lazy(() => import('./components/tools/developer/CssMinifier'));
const JwtDecoder = lazy(() => import('./components/tools/developer/JwtDecoder'));
const JavaScriptMinifier = lazy(() => import('./components/tools/developer/JavaScriptMinifier'));
const HtmlMinifier = lazy(() => import('./components/tools/developer/HtmlMinifier'));
const SqlFormatter = lazy(() => import('./components/tools/developer/SqlFormatter'));
const CronParser = lazy(() => import('./components/tools/developer/CronParser'));
const YamlJsonConverter = lazy(() => import('./components/tools/developer/YamlJsonConverter'));
const XmlJsonConverter = lazy(() => import('./components/tools/developer/XmlJsonConverter'));
const CsvJsonConverter = lazy(() => import('./components/tools/developer/CsvJsonConverter'));
const DiffChecker = lazy(() => import('./components/tools/developer/DiffChecker'));
const Stopwatch = lazy(() => import('./components/tools/developer/Stopwatch'));
const DateCalculator = lazy(() => import('./components/tools/developer/DateCalculator'));
const ScreenResolution = lazy(() => import('./components/tools/developer/ScreenResolution'));
const UserAgent = lazy(() => import('./components/tools/developer/UserAgent'));
const SpeedTest = lazy(() => import('./components/tools/developer/SpeedTest'));

// Wrapper component for lazy-loaded routes
const LazyRoute = ({ component: Component }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Category />} />

        {/* Static/Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/seo-dashboard" element={<SeoDashboard />} />

        {/* Financial Tools (12) */}
        <Route path="/tools/finance/gst-calculator" element={<LazyRoute component={GstCalculator} />} />
        <Route path="/tools/finance/gst-invoice-generator" element={<LazyRoute component={GstInvoiceGenerator} />} />
        <Route path="/tools/finance/emi-calculator" element={<LazyRoute component={EmiCalculator} />} />
        <Route path="/tools/finance/sip-calculator" element={<LazyRoute component={SipCalculator} />} />
        <Route path="/tools/finance/fd-calculator" element={<LazyRoute component={FdCalculator} />} />
        <Route path="/tools/finance/interest-calculator" element={<LazyRoute component={InterestCalculator} />} />
        <Route path="/tools/finance/discount-calculator" element={<LazyRoute component={DiscountCalculator} />} />
        <Route path="/tools/finance/tax-estimator" element={<LazyRoute component={TaxEstimator} />} />
        <Route path="/tools/finance/inflation-calculator" element={<LazyRoute component={InflationCalculator} />} />
        <Route path="/tools/finance/roi-calculator" element={<LazyRoute component={RoiCalculator} />} />
        <Route path="/tools/finance/currency-converter" element={<LazyRoute component={CurrencyConverter} />} />
        <Route path="/tools/finance/margin-calculator" element={<LazyRoute component={MarginCalculator} />} />

        {/* Typing & Education Tools (9) */}
        <Route path="/tools/typing/typing-test" element={<LazyRoute component={TypingTest} />} />
        <Route path="/tools/typing-chapter/:chapterId" element={<LazyRoute component={TypingChapter} />} />
        <Route path="/tools/typing/numpad-test" element={<LazyRoute component={NumpadTest} />} />
        <Route path="/tools/typing/blind-typing" element={<LazyRoute component={BlindTyping} />} />
        <Route path="/tools/typing/reaction-test" element={<LazyRoute component={ReactionTest} />} />
        <Route path="/tools/typing/multiplication-table" element={<LazyRoute component={MultiplicationTable} />} />
        <Route path="/tools/typing/percentage-calculator" element={<LazyRoute component={PercentageCalculator} />} />
        <Route path="/tools/typing/gpa-calculator" element={<LazyRoute component={GpaCalculator} />} />
        <Route path="/tools/typing/age-calculator" element={<LazyRoute component={AgeCalculator} />} />

        {/* SEO Tools (29) */}
        <Route path="/tools/seo/meta-tag-generator" element={<LazyRoute component={MetaTagGenerator} />} />
        <Route path="/tools/seo/robots-txt-generator" element={<LazyRoute component={RobotsTxtGenerator} />} />
        <Route path="/tools/seo/sitemap-generator" element={<LazyRoute component={SitemapGenerator} />} />
        <Route path="/tools/seo/schema-generator" element={<LazyRoute component={SchemaGenerator} />} />
        <Route path="/tools/seo/keyword-density" element={<LazyRoute component={KeywordDensity} />} />
        <Route path="/tools/seo/serp-preview" element={<LazyRoute component={SerpPreview} />} />
        <Route path="/tools/seo/og-generator" element={<LazyRoute component={OgGenerator} />} />
        <Route path="/tools/seo/twitter-card-generator" element={<LazyRoute component={TwitterCardGenerator} />} />
        <Route path="/tools/seo/htaccess-generator" element={<LazyRoute component={HtaccessGenerator} />} />
        <Route path="/tools/seo/slug-generator" element={<LazyRoute component={SlugGenerator} />} />
        <Route path="/tools/seo/broken-link-checker" element={<LazyRoute component={BrokenLinkChecker} />} />
        <Route path="/tools/seo/seo-audit-checklist" element={<LazyRoute component={SeoAuditChecklist} />} />
        <Route path="/tools/seo/technical-seo-checklist" element={<LazyRoute component={TechnicalSeoChecklist} />} />
        <Route path="/tools/seo/content-calendar" element={<LazyRoute component={ContentCalendar} />} />
        <Route path="/tools/seo/content-optimization-scorecard" element={<LazyRoute component={ContentOptimizationScorecard} />} />
        <Route path="/tools/seo/internal-linking-planner" element={<LazyRoute component={InternalLinkingPlanner} />} />
        <Route path="/tools/seo/local-seo-planner" element={<LazyRoute component={LocalSeoPlanner} />} />
        <Route path="/tools/seo/competitor-analysis-template" element={<LazyRoute component={CompetitorAnalysisTemplate} />} />
        <Route path="/tools/seo/seo-goal-tracker" element={<LazyRoute component={SeoGoalTracker} />} />
        <Route path="/tools/seo/backlink-strategy-planner" element={<LazyRoute component={BacklinkStrategyPlanner} />} />
        <Route path="/tools/seo/page-speed-checklist" element={<LazyRoute component={PageSpeedChecklist} />} />
        <Route path="/tools/seo/hreflang-generator" element={<LazyRoute component={HreflangGenerator} />} />
        <Route path="/tools/seo/heading-analyzer" element={<LazyRoute component={HeadingAnalyzer} />} />
        <Route path="/tools/seo/readability-checker" element={<LazyRoute component={ReadabilityChecker} />} />
        <Route path="/tools/seo/canonical-url-generator" element={<LazyRoute component={CanonicalUrlGenerator} />} />
        <Route path="/tools/seo/redirect-chain-analyzer" element={<LazyRoute component={RedirectChainAnalyzer} />} />
        <Route path="/tools/seo/image-alt-text-suggester" element={<LazyRoute component={ImageAltTextSuggester} />} />
        <Route path="/tools/seo/mobile-serp-preview" element={<LazyRoute component={MobileSerpPreview} />} />
        <Route path="/tools/seo/all-in-one-meta-generator" element={<LazyRoute component={AllInOneMetaGenerator} />} />

        {/* Image & Design Tools (22) */}
        <Route path="/tools/image/favicon-generator" element={<LazyRoute component={FaviconGenerator} />} />
        <Route path="/tools/image/qr-generator" element={<LazyRoute component={QrGenerator} />} />
        <Route path="/tools/image/color-palette" element={<LazyRoute component={ColorPalette} />} />
        <Route path="/tools/image/rgb-to-hex" element={<LazyRoute component={RgbToHex} />} />
        <Route path="/tools/image/hex-to-rgb" element={<LazyRoute component={HexToRgb} />} />
        <Route path="/tools/image/gradient-generator" element={<LazyRoute component={GradientGenerator} />} />
        <Route path="/tools/image/image-to-base64" element={<LazyRoute component={ImageToBase64} />} />
        <Route path="/tools/image/base64-to-image" element={<LazyRoute component={Base64ToImage} />} />
        <Route path="/tools/image/image-resizer" element={<LazyRoute component={ImageResizer} />} />
        <Route path="/tools/image/image-filters" element={<LazyRoute component={ImageFilters} />} />
        <Route path="/tools/image/image-compressor" element={<LazyRoute component={ImageCompressor} />} />
        <Route path="/tools/image/image-cropper" element={<LazyRoute component={ImageCropper} />} />
        <Route path="/tools/image/image-format-converter" element={<LazyRoute component={ImageFormatConverter} />} />
        <Route path="/tools/image/color-converter" element={<LazyRoute component={ColorConverter} />} />
        <Route path="/tools/image/exam-photo-resizer" element={<LazyRoute component={ExamPhotoResizer} />} />
        <Route path="/tools/image/batch-image-resizer" element={<LazyRoute component={BatchImageResizer} />} />
        <Route path="/tools/image/image-watermark" element={<LazyRoute component={ImageWatermark} />} />
        <Route path="/tools/image/color-picker" element={<LazyRoute component={ColorPicker} />} />
        <Route path="/tools/image/pattern-generator" element={<LazyRoute component={PatternGenerator} />} />
        <Route path="/tools/image/image-metadata-viewer" element={<LazyRoute component={ImageMetadataViewer} />} />
        <Route path="/tools/image/screenshot-mockup" element={<LazyRoute component={ScreenshotMockup} />} />
        <Route path="/tools/image/svg-editor" element={<LazyRoute component={SvgEditor} />} />
        <Route path="/tools/image/svg-background-generator" element={<LazyRoute component={SvgBackgroundGenerator} />} />

        {/* Text & Content Tools (15) */}
        <Route path="/tools/text/word-counter" element={<LazyRoute component={WordCounter} />} />
        <Route path="/tools/text/sentence-counter" element={<LazyRoute component={SentenceCounter} />} />
        <Route path="/tools/text/case-converter" element={<LazyRoute component={CaseConverter} />} />
        <Route path="/tools/text/lorem-ipsum" element={<LazyRoute component={LoremIpsum} />} />
        <Route path="/tools/text/duplicate-remover" element={<LazyRoute component={DuplicateRemover} />} />
        <Route path="/tools/text/text-to-binary" element={<LazyRoute component={TextToBinary} />} />
        <Route path="/tools/text/binary-to-text" element={<LazyRoute component={BinaryToText} />} />
        <Route path="/tools/text/find-replace" element={<LazyRoute component={FindReplace} />} />
        <Route path="/tools/text/text-compare" element={<LazyRoute component={TextCompare} />} />
        <Route path="/tools/text/password-generator" element={<LazyRoute component={PasswordGenerator} />} />
        <Route path="/tools/text/slug-generator" element={<LazyRoute component={TextSlugGenerator} />} />
        <Route path="/tools/text/text-formatter" element={<LazyRoute component={TextFormatter} />} />
        <Route path="/tools/text/list-sorter" element={<LazyRoute component={ListSorter} />} />
        <Route path="/tools/text/number-extractor" element={<LazyRoute component={NumberExtractor} />} />
        <Route path="/tools/text/text-statistics" element={<LazyRoute component={TextStatistics} />} />

        {/* Developer & Utility Tools (23) */}
        <Route path="/tools/developer/json-formatter" element={<LazyRoute component={JsonFormatter} />} />
        <Route path="/tools/developer/html-encoder" element={<LazyRoute component={HtmlEncoder} />} />
        <Route path="/tools/developer/url-encoder" element={<LazyRoute component={UrlEncoder} />} />
        <Route path="/tools/developer/base64-encoder" element={<LazyRoute component={Base64Encoder} />} />
        <Route path="/tools/developer/uuid-generator" element={<LazyRoute component={UuidGenerator} />} />
        <Route path="/tools/developer/hash-generator" element={<LazyRoute component={HashGenerator} />} />
        <Route path="/tools/developer/timestamp-converter" element={<LazyRoute component={TimestampConverter} />} />
        <Route path="/tools/developer/regex-tester" element={<LazyRoute component={RegexTester} />} />
        <Route path="/tools/developer/css-minifier" element={<LazyRoute component={CssMinifier} />} />
        <Route path="/tools/developer/jwt-decoder" element={<LazyRoute component={JwtDecoder} />} />
        <Route path="/tools/developer/javascript-minifier" element={<LazyRoute component={JavaScriptMinifier} />} />
        <Route path="/tools/developer/html-minifier" element={<LazyRoute component={HtmlMinifier} />} />
        <Route path="/tools/developer/sql-formatter" element={<LazyRoute component={SqlFormatter} />} />
        <Route path="/tools/developer/cron-parser" element={<LazyRoute component={CronParser} />} />
        <Route path="/tools/developer/yaml-json-converter" element={<LazyRoute component={YamlJsonConverter} />} />
        <Route path="/tools/developer/xml-json-converter" element={<LazyRoute component={XmlJsonConverter} />} />
        <Route path="/tools/developer/csv-json-converter" element={<LazyRoute component={CsvJsonConverter} />} />
        <Route path="/tools/developer/diff-checker" element={<LazyRoute component={DiffChecker} />} />
        <Route path="/tools/developer/stopwatch" element={<LazyRoute component={Stopwatch} />} />
        <Route path="/tools/developer/date-calculator" element={<LazyRoute component={DateCalculator} />} />
        <Route path="/tools/developer/screen-resolution" element={<LazyRoute component={ScreenResolution} />} />
        <Route path="/tools/developer/user-agent" element={<LazyRoute component={UserAgent} />} />
        <Route path="/tools/developer/speed-test" element={<LazyRoute component={SpeedTest} />} />
      </Routes>
    </Router>
  );
}

export default App;
