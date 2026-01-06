import { useToast } from '../common/Toast';

const DownloadButton = ({ content, filename = 'download.txt', label = 'Download', className = '', size = 'md' }) => {
    const toast = useToast();

    const handleDownload = () => {
        if (!content) {
            toast.warning('Nothing to download');
            return;
        }

        try {
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success(`Downloaded ${filename}`);
        } catch (err) {
            toast.error('Download failed');
        }
    };

    const sizeClasses = {
        sm: 'download-btn-sm',
        md: 'download-btn-md',
        lg: 'download-btn-lg'
    };

    return (
        <>
            <button
                className={`download-btn ${sizeClasses[size]} ${className}`}
                onClick={handleDownload}
                title={label}
            >
                <span className="download-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </span>
                {label && size !== 'sm' && <span className="download-label">{label}</span>}
            </button>
            <style>{`
                .download-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .download-btn:hover {
                    background: linear-gradient(135deg, #818cf8, #6366f1);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }
                .download-btn:active {
                    transform: translateY(0);
                }
                .download-btn-sm {
                    padding: 6px 10px;
                    font-size: 12px;
                }
                .download-btn-md {
                    padding: 8px 14px;
                    font-size: 14px;
                }
                .download-btn-lg {
                    padding: 12px 20px;
                    font-size: 16px;
                }
                .download-icon {
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .download-btn-sm .download-icon {
                    width: 14px;
                    height: 14px;
                }
                .download-btn-lg .download-icon {
                    width: 18px;
                    height: 18px;
                }
                .download-icon svg {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </>
    );
};

export default DownloadButton;
