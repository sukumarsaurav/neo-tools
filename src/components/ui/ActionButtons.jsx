import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import ClearButton from './ClearButton';

// Convenience component that groups common action buttons together
const ActionButtons = ({
    text,
    onClear,
    hasContent,
    showCopy = true,
    showDownload = true,
    showClear = true,
    filename = 'result.txt',
    size = 'sm',
    className = ''
}) => {
    return (
        <>
            <div className={`action-buttons ${className}`}>
                {showCopy && <CopyButton text={text} label="" size={size} />}
                {showDownload && <DownloadButton content={text} filename={filename} label="" size={size} />}
                {showClear && onClear && <ClearButton onClear={onClear} hasContent={hasContent} label="" size={size} />}
            </div>
            <style>{`
                .action-buttons {
                    display: inline-flex;
                    gap: 8px;
                    align-items: center;
                }
            `}</style>
        </>
    );
};

export { CopyButton, DownloadButton, ClearButton };
export default ActionButtons;
