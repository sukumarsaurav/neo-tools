import { useToast } from '../common/Toast';

const ClearButton = ({ onClear, hasContent = true, label = 'Clear', className = '', size = 'md', confirmThreshold = 500 }) => {
    const toast = useToast();

    const handleClear = () => {
        if (!hasContent) {
            toast.info('Already empty');
            return;
        }

        // For large content, we could add confirmation, but keeping it simple for now
        onClear();
        toast.success('Cleared');
    };

    const sizeClasses = {
        sm: 'clear-btn-sm',
        md: 'clear-btn-md',
        lg: 'clear-btn-lg'
    };

    return (
        <>
            <button
                className={`clear-btn ${sizeClasses[size]} ${className}`}
                onClick={handleClear}
                title={label}
                disabled={!hasContent}
            >
                <span className="clear-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </span>
                {label && size !== 'sm' && <span className="clear-label">{label}</span>}
            </button>
            <style>{`
                .clear-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: transparent;
                    color: #6b7280;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }
                .clear-btn:hover:not(:disabled) {
                    background: #fef2f2;
                    color: #ef4444;
                    border-color: #fecaca;
                }
                .clear-btn:active:not(:disabled) {
                    transform: scale(0.98);
                }
                .clear-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .clear-btn-sm {
                    padding: 4px 8px;
                    font-size: 12px;
                }
                .clear-btn-md {
                    padding: 6px 12px;
                    font-size: 14px;
                }
                .clear-btn-lg {
                    padding: 10px 18px;
                    font-size: 16px;
                }
                .clear-icon {
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .clear-btn-sm .clear-icon {
                    width: 14px;
                    height: 14px;
                }
                .clear-btn-lg .clear-icon {
                    width: 18px;
                    height: 18px;
                }
                .clear-icon svg {
                    width: 100%;
                    height: 100%;
                }
                
                /* Dark mode */
                [data-theme="dark"] .clear-btn {
                    border-color: #374151;
                    color: #9ca3af;
                }
                [data-theme="dark"] .clear-btn:hover:not(:disabled) {
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    border-color: rgba(239, 68, 68, 0.3);
                }
            `}</style>
        </>
    );
};

export default ClearButton;
