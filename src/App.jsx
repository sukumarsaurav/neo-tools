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

// Pages
import Home from './pages/Home';
import Category from './pages/Category';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import SitemapPage from './pages/SitemapPage';

// Financial Tools (12)
import GstCalculator from './components/tools/finance/GstCalculator';
import GstInvoiceGenerator from './components/tools/finance/GstInvoiceGenerator';
import EmiCalculator from './components/tools/finance/EmiCalculator';
import SipCalculator from './components/tools/finance/SipCalculator';
import FdCalculator from './components/tools/finance/FdCalculator';
import InterestCalculator from './components/tools/finance/InterestCalculator';
import DiscountCalculator from './components/tools/finance/DiscountCalculator';
import TaxEstimator from './components/tools/finance/TaxEstimator';
import InflationCalculator from './components/tools/finance/InflationCalculator';
import RoiCalculator from './components/tools/finance/RoiCalculator';
import CurrencyConverter from './components/tools/finance/CurrencyConverter';
import MarginCalculator from './components/tools/finance/MarginCalculator';

// Typing & Education Tools (9)
import TypingTest from './components/tools/typing/TypingTest';
import TypingChapter from './components/tools/typing/TypingChapter';
import NumpadTest from './components/tools/typing/NumpadTest';
import BlindTyping from './components/tools/typing/BlindTyping';
import ReactionTest from './components/tools/typing/ReactionTest';
import MultiplicationTable from './components/tools/typing/MultiplicationTable';
import PercentageCalculator from './components/tools/typing/PercentageCalculator';
import GpaCalculator from './components/tools/typing/GpaCalculator';
import AgeCalculator from './components/tools/typing/AgeCalculator';

// SEO Tools (21)
import MetaTagGenerator from './components/tools/seo/MetaTagGenerator';
import RobotsTxtGenerator from './components/tools/seo/RobotsTxtGenerator';
import SitemapGenerator from './components/tools/seo/SitemapGenerator';
import SchemaGenerator from './components/tools/seo/SchemaGenerator';
import KeywordDensity from './components/tools/seo/KeywordDensity';
import SerpPreview from './components/tools/seo/SerpPreview';
import OgGenerator from './components/tools/seo/OgGenerator';
import TwitterCardGenerator from './components/tools/seo/TwitterCardGenerator';
import HtaccessGenerator from './components/tools/seo/HtaccessGenerator';
import SlugGenerator from './components/tools/seo/SlugGenerator';
import BrokenLinkChecker from './components/tools/seo/BrokenLinkChecker';
import SeoAuditChecklist from './components/tools/seo/SeoAuditChecklist';
import TechnicalSeoChecklist from './components/tools/seo/TechnicalSeoChecklist';
import ContentCalendar from './components/tools/seo/ContentCalendar';
import ContentOptimizationScorecard from './components/tools/seo/ContentOptimizationScorecard';
import InternalLinkingPlanner from './components/tools/seo/InternalLinkingPlanner';
import LocalSeoPlanner from './components/tools/seo/LocalSeoPlanner';
import CompetitorAnalysisTemplate from './components/tools/seo/CompetitorAnalysisTemplate';
import SeoGoalTracker from './components/tools/seo/SeoGoalTracker';
import BacklinkStrategyPlanner from './components/tools/seo/BacklinkStrategyPlanner';
import PageSpeedChecklist from './components/tools/seo/PageSpeedChecklist';

// Image & Design Tools (22)
import FaviconGenerator from './components/tools/image/FaviconGenerator';
import QrGenerator from './components/tools/image/QrGenerator';
import ColorPalette from './components/tools/image/ColorPalette';
import RgbToHex from './components/tools/image/RgbToHex';
import HexToRgb from './components/tools/image/HexToRgb';
import GradientGenerator from './components/tools/image/GradientGenerator';
import ImageToBase64 from './components/tools/image/ImageToBase64';
import Base64ToImage from './components/tools/image/Base64ToImage';
import ImageResizer from './components/tools/image/ImageResizer';
import ImageFilters from './components/tools/image/ImageFilters';
import ImageCompressor from './components/tools/image/ImageCompressor';
import ImageCropper from './components/tools/image/ImageCropper';
import ImageFormatConverter from './components/tools/image/ImageFormatConverter';
import ColorConverter from './components/tools/image/ColorConverter';
import ExamPhotoResizer from './components/tools/image/ExamPhotoResizer';
import ImageWatermark from './components/tools/image/ImageWatermark';
import ColorPicker from './components/tools/image/ColorPicker';
import PatternGenerator from './components/tools/image/PatternGenerator';
import ImageMetadataViewer from './components/tools/image/ImageMetadataViewer';

// Lazy loaded large components for code splitting
const ScreenshotMockup = lazy(() => import('./components/tools/image/ScreenshotMockup'));
const SvgEditor = lazy(() => import('./components/tools/image/SvgEditor'));
const BatchImageResizer = lazy(() => import('./components/tools/image/BatchImageResizer'));
const SvgBackgroundGenerator = lazy(() => import('./components/tools/image/SvgBackgroundGenerator'));

// Text & Content Tools (15)
import WordCounter from './components/tools/text/WordCounter';
import SentenceCounter from './components/tools/text/SentenceCounter';
import CaseConverter from './components/tools/text/CaseConverter';
import LoremIpsum from './components/tools/text/LoremIpsum';
import DuplicateRemover from './components/tools/text/DuplicateRemover';
import TextToBinary from './components/tools/text/TextToBinary';
import BinaryToText from './components/tools/text/BinaryToText';
import FindReplace from './components/tools/text/FindReplace';
import TextCompare from './components/tools/text/TextCompare';
import PasswordGenerator from './components/tools/text/PasswordGenerator';
import TextSlugGenerator from './components/tools/text/SlugGenerator';
import TextFormatter from './components/tools/text/TextFormatter';
import ListSorter from './components/tools/text/ListSorter';
import NumberExtractor from './components/tools/text/NumberExtractor';
import TextStatistics from './components/tools/text/TextStatistics';

// Developer & Utility Tools (23)
import JsonFormatter from './components/tools/developer/JsonFormatter';
import HtmlEncoder from './components/tools/developer/HtmlEncoder';
import UrlEncoder from './components/tools/developer/UrlEncoder';
import Base64Encoder from './components/tools/developer/Base64Encoder';
import UuidGenerator from './components/tools/developer/UuidGenerator';
import HashGenerator from './components/tools/developer/HashGenerator';
import TimestampConverter from './components/tools/developer/TimestampConverter';
import RegexTester from './components/tools/developer/RegexTester';
import CssMinifier from './components/tools/developer/CssMinifier';
import JwtDecoder from './components/tools/developer/JwtDecoder';
import JavaScriptMinifier from './components/tools/developer/JavaScriptMinifier';
import HtmlMinifier from './components/tools/developer/HtmlMinifier';
import SqlFormatter from './components/tools/developer/SqlFormatter';
import CronParser from './components/tools/developer/CronParser';
import YamlJsonConverter from './components/tools/developer/YamlJsonConverter';
import XmlJsonConverter from './components/tools/developer/XmlJsonConverter';
import CsvJsonConverter from './components/tools/developer/CsvJsonConverter';
import DiffChecker from './components/tools/developer/DiffChecker';
import Stopwatch from './components/tools/developer/Stopwatch';
import DateCalculator from './components/tools/developer/DateCalculator';
import ScreenResolution from './components/tools/developer/ScreenResolution';
import UserAgent from './components/tools/developer/UserAgent';
import SpeedTest from './components/tools/developer/SpeedTest';

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

        {/* Financial Tools (12) */}
        <Route path="/tools/finance/gst-calculator" element={<GstCalculator />} />
        <Route path="/tools/finance/gst-invoice-generator" element={<GstInvoiceGenerator />} />
        <Route path="/tools/finance/emi-calculator" element={<EmiCalculator />} />
        <Route path="/tools/finance/sip-calculator" element={<SipCalculator />} />
        <Route path="/tools/finance/fd-calculator" element={<FdCalculator />} />
        <Route path="/tools/finance/interest-calculator" element={<InterestCalculator />} />
        <Route path="/tools/finance/discount-calculator" element={<DiscountCalculator />} />
        <Route path="/tools/finance/tax-estimator" element={<TaxEstimator />} />
        <Route path="/tools/finance/inflation-calculator" element={<InflationCalculator />} />
        <Route path="/tools/finance/roi-calculator" element={<RoiCalculator />} />
        <Route path="/tools/finance/currency-converter" element={<CurrencyConverter />} />
        <Route path="/tools/finance/margin-calculator" element={<MarginCalculator />} />

        {/* Typing & Education Tools (9) */}
        <Route path="/tools/typing/typing-test" element={<TypingTest />} />
        <Route path="/tools/typing-chapter/:chapterId" element={<TypingChapter />} />
        <Route path="/tools/typing/numpad-test" element={<NumpadTest />} />
        <Route path="/tools/typing/blind-typing" element={<BlindTyping />} />
        <Route path="/tools/typing/reaction-test" element={<ReactionTest />} />
        <Route path="/tools/typing/multiplication-table" element={<MultiplicationTable />} />
        <Route path="/tools/typing/percentage-calculator" element={<PercentageCalculator />} />
        <Route path="/tools/typing/gpa-calculator" element={<GpaCalculator />} />
        <Route path="/tools/typing/age-calculator" element={<AgeCalculator />} />

        {/* SEO Tools (21) */}
        <Route path="/tools/seo/meta-tag-generator" element={<MetaTagGenerator />} />
        <Route path="/tools/seo/robots-txt-generator" element={<RobotsTxtGenerator />} />
        <Route path="/tools/seo/sitemap-generator" element={<SitemapGenerator />} />
        <Route path="/tools/seo/schema-generator" element={<SchemaGenerator />} />
        <Route path="/tools/seo/keyword-density" element={<KeywordDensity />} />
        <Route path="/tools/seo/serp-preview" element={<SerpPreview />} />
        <Route path="/tools/seo/og-generator" element={<OgGenerator />} />
        <Route path="/tools/seo/twitter-card-generator" element={<TwitterCardGenerator />} />
        <Route path="/tools/seo/htaccess-generator" element={<HtaccessGenerator />} />
        <Route path="/tools/seo/slug-generator" element={<SlugGenerator />} />
        <Route path="/tools/seo/broken-link-checker" element={<BrokenLinkChecker />} />
        <Route path="/tools/seo/seo-audit-checklist" element={<SeoAuditChecklist />} />
        <Route path="/tools/seo/technical-seo-checklist" element={<TechnicalSeoChecklist />} />
        <Route path="/tools/seo/content-calendar" element={<ContentCalendar />} />
        <Route path="/tools/seo/content-optimization-scorecard" element={<ContentOptimizationScorecard />} />
        <Route path="/tools/seo/internal-linking-planner" element={<InternalLinkingPlanner />} />
        <Route path="/tools/seo/local-seo-planner" element={<LocalSeoPlanner />} />
        <Route path="/tools/seo/competitor-analysis-template" element={<CompetitorAnalysisTemplate />} />
        <Route path="/tools/seo/seo-goal-tracker" element={<SeoGoalTracker />} />
        <Route path="/tools/seo/backlink-strategy-planner" element={<BacklinkStrategyPlanner />} />
        <Route path="/tools/seo/page-speed-checklist" element={<PageSpeedChecklist />} />

        {/* Image & Design Tools (20) */}
        <Route path="/tools/image/favicon-generator" element={<FaviconGenerator />} />
        <Route path="/tools/image/qr-generator" element={<QrGenerator />} />
        <Route path="/tools/image/color-palette" element={<ColorPalette />} />
        <Route path="/tools/image/rgb-to-hex" element={<RgbToHex />} />
        <Route path="/tools/image/hex-to-rgb" element={<HexToRgb />} />
        <Route path="/tools/image/gradient-generator" element={<GradientGenerator />} />
        <Route path="/tools/image/image-to-base64" element={<ImageToBase64 />} />
        <Route path="/tools/image/base64-to-image" element={<Base64ToImage />} />
        <Route path="/tools/image/image-resizer" element={<ImageResizer />} />
        <Route path="/tools/image/image-filters" element={<ImageFilters />} />
        <Route path="/tools/image/image-compressor" element={<ImageCompressor />} />
        <Route path="/tools/image/image-cropper" element={<ImageCropper />} />
        <Route path="/tools/image/image-format-converter" element={<ImageFormatConverter />} />
        <Route path="/tools/image/color-converter" element={<ColorConverter />} />
        <Route path="/tools/image/exam-photo-resizer" element={<ExamPhotoResizer />} />
        <Route path="/tools/image/batch-image-resizer" element={<Suspense fallback={<LoadingFallback />}><BatchImageResizer /></Suspense>} />
        <Route path="/tools/image/image-watermark" element={<ImageWatermark />} />
        <Route path="/tools/image/color-picker" element={<ColorPicker />} />
        <Route path="/tools/image/pattern-generator" element={<PatternGenerator />} />
        <Route path="/tools/image/image-metadata-viewer" element={<ImageMetadataViewer />} />
        <Route path="/tools/image/screenshot-mockup" element={<Suspense fallback={<LoadingFallback />}><ScreenshotMockup /></Suspense>} />
        <Route path="/tools/image/svg-editor" element={<Suspense fallback={<LoadingFallback />}><SvgEditor /></Suspense>} />
        <Route path="/tools/image/svg-background-generator" element={<Suspense fallback={<LoadingFallback />}><SvgBackgroundGenerator /></Suspense>} />

        {/* Text & Content Tools (15) */}
        <Route path="/tools/text/word-counter" element={<WordCounter />} />
        <Route path="/tools/text/sentence-counter" element={<SentenceCounter />} />
        <Route path="/tools/text/case-converter" element={<CaseConverter />} />
        <Route path="/tools/text/lorem-ipsum" element={<LoremIpsum />} />
        <Route path="/tools/text/duplicate-remover" element={<DuplicateRemover />} />
        <Route path="/tools/text/text-to-binary" element={<TextToBinary />} />
        <Route path="/tools/text/binary-to-text" element={<BinaryToText />} />
        <Route path="/tools/text/find-replace" element={<FindReplace />} />
        <Route path="/tools/text/text-compare" element={<TextCompare />} />
        <Route path="/tools/text/password-generator" element={<PasswordGenerator />} />
        <Route path="/tools/text/slug-generator" element={<TextSlugGenerator />} />
        <Route path="/tools/text/text-formatter" element={<TextFormatter />} />
        <Route path="/tools/text/list-sorter" element={<ListSorter />} />
        <Route path="/tools/text/number-extractor" element={<NumberExtractor />} />
        <Route path="/tools/text/text-statistics" element={<TextStatistics />} />

        {/* Developer & Utility Tools (23) */}
        <Route path="/tools/developer/json-formatter" element={<JsonFormatter />} />
        <Route path="/tools/developer/html-encoder" element={<HtmlEncoder />} />
        <Route path="/tools/developer/url-encoder" element={<UrlEncoder />} />
        <Route path="/tools/developer/base64-encoder" element={<Base64Encoder />} />
        <Route path="/tools/developer/uuid-generator" element={<UuidGenerator />} />
        <Route path="/tools/developer/hash-generator" element={<HashGenerator />} />
        <Route path="/tools/developer/timestamp-converter" element={<TimestampConverter />} />
        <Route path="/tools/developer/regex-tester" element={<RegexTester />} />
        <Route path="/tools/developer/css-minifier" element={<CssMinifier />} />
        <Route path="/tools/developer/jwt-decoder" element={<JwtDecoder />} />
        <Route path="/tools/developer/javascript-minifier" element={<JavaScriptMinifier />} />
        <Route path="/tools/developer/html-minifier" element={<HtmlMinifier />} />
        <Route path="/tools/developer/sql-formatter" element={<SqlFormatter />} />
        <Route path="/tools/developer/cron-parser" element={<CronParser />} />
        <Route path="/tools/developer/yaml-json-converter" element={<YamlJsonConverter />} />
        <Route path="/tools/developer/xml-json-converter" element={<XmlJsonConverter />} />
        <Route path="/tools/developer/csv-json-converter" element={<CsvJsonConverter />} />
        <Route path="/tools/developer/diff-checker" element={<DiffChecker />} />
        <Route path="/tools/developer/stopwatch" element={<Stopwatch />} />
        <Route path="/tools/developer/date-calculator" element={<DateCalculator />} />
        <Route path="/tools/developer/screen-resolution" element={<ScreenResolution />} />
        <Route path="/tools/developer/user-agent" element={<UserAgent />} />
        <Route path="/tools/developer/speed-test" element={<SpeedTest />} />
      </Routes>
    </Router>
  );
}

export default App;
