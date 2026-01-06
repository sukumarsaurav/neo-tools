import { useState } from 'react';
import { useToast } from '../common/Toast';

const CopyButton = ({ text, label = 'Copy', successMessage = 'Copied to clipboard!', className = '', size = 'md' }) => {
    const [copied, setCopied] = useState(false);
    const toast = useToast();

    const handleCopy = async () => {
        if (!text) {
            toast.warning('Nothing to copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(successMessage);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    const sizeClasses = {
        sm: 'copy-btn-sm',
        md: 'copy-btn-md',
        lg: 'copy-btn-lg'
    };

    return (
        <>
            <button
                className={`copy-btn ${sizeClasses[size]} ${copied ? 'copied' : ''} ${className}`}
                onClick={handleCopy}
                title={copied ? 'Copied!' : label}
            >
                <span className="copy-icon">
                    {copied ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    )}
                </span>
                {label && size !== 'sm' && <span className="copy-label">{copied ? 'Copied!' : label}</span>}
            </button>
            <style>{`
                .copy-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: linear-gradient(135deg, #485696, #3d4a7a);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .copy-btn:hover {
                    background: linear-gradient(135deg, #5a6aab, #485696);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(72, 86, 150, 0.3);
                }
                .copy-btn:active {
                    transform: translateY(0);
                }
                .copy-btn.copied {
                    background: linear-gradient(135deg, #10b981, #059669);
                }
                .copy-btn-sm {
                    padding: 6px 10px;
                    font-size: 12px;
                }
                .copy-btn-md {
                    padding: 8px 14px;
                    font-size: 14px;
                }
                .copy-btn-lg {
                    padding: 12px 20px;
                    font-size: 16px;
                }
                .copy-icon {
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .copy-btn-sm .copy-icon {
                    width: 14px;
                    height: 14px;
                }
                .copy-btn-lg .copy-icon {
                    width: 18px;
                    height: 18px;
                }
                .copy-icon svg {
                    width: 100%;
                    height: 100%;
                }
                .copy-label {
                    transition: opacity 0.2s;
                }
            `}</style>
        </>
    );
};

export default CopyButton;
