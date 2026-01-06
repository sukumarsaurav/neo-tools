import { useState } from 'react';
import './ResultActions.css';

/**
 * ResultActions - Copy, Share, and PDF export buttons for calculator results
 * @param {Object} props
 * @param {string} props.copyText - Text to copy to clipboard
 * @param {string} props.shareTitle - Title for share dialog
 * @param {string} props.shareText - Text for share dialog
 * @param {function} props.onDownloadPdf - Callback for PDF download
 * @param {string} props.toolName - Name of the tool (for share URL)
 */
const ResultActions = ({
    copyText,
    shareTitle = 'Calculator Result',
    shareText,
    onDownloadPdf,
    toolName
}) => {
    const [copyStatus, setCopyStatus] = useState('idle'); // idle, copied, error

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copyText);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = copyText;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                setCopyStatus('copied');
            } catch (e) {
                setCopyStatus('error');
            }
            document.body.removeChild(textarea);
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        const fullText = shareText || copyText;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: fullText,
                    url: shareUrl
                });
            } catch (err) {
                // User cancelled or share failed - fallback to copy
                if (err.name !== 'AbortError') {
                    handleCopy();
                }
            }
        } else {
            // Fallback: Copy share link and text
            const shareContent = `${fullText}\n\n${shareUrl}`;
            try {
                await navigator.clipboard.writeText(shareContent);
                setCopyStatus('copied');
                setTimeout(() => setCopyStatus('idle'), 2000);
            } catch (err) {
                console.error('Share failed:', err);
            }
        }
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(`${copyText}\n\nCalculated using: ${window.location.href}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
    };

    return (
        <div className="result-actions">
            <button
                className={`result-action-btn ${copyStatus === 'copied' ? 'success' : ''}`}
                onClick={handleCopy}
                title="Copy to clipboard"
                aria-label="Copy result to clipboard"
            >
                {copyStatus === 'copied' ? (
                    <>
                        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Copied!</span>
                    </>
                ) : (
                    <>
                        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        <span>Copy</span>
                    </>
                )}
            </button>

            <button
                className="result-action-btn"
                onClick={handleShare}
                title="Share result"
                aria-label="Share result"
            >
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>Share</span>
            </button>

            <button
                className="result-action-btn"
                onClick={handleEmail}
                title="Send via email"
                aria-label="Send result via email"
            >
                <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Email</span>
            </button>

            {onDownloadPdf && (
                <button
                    className="result-action-btn"
                    onClick={onDownloadPdf}
                    title="Download as PDF"
                    aria-label="Download result as PDF"
                >
                    <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>PDF</span>
                </button>
            )}
        </div>
    );
};

export default ResultActions;
