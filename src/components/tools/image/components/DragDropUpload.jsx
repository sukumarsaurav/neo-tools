import { useRef } from 'react';
import PropTypes from 'prop-types';
import useImageUpload from '../../../../hooks/useImageUpload';
import './DragDropUpload.css';

/**
 * Reusable drag-and-drop image upload component
 */
const DragDropUpload = ({
    id,
    onUpload,
    onError,
    accept = 'image/*',
    maxSize = 10 * 1024 * 1024,
    showPreview = true,
    previewMaxHeight = 200,
    label = 'Drop image here or click to upload',
    icon = '📁',
    className = '',
    disabled = false
}) => {
    const inputRef = useRef(null);

    const {
        preview,
        fileName,
        loading,
        error,
        isDragging,
        handleUpload,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        hasImage,
        reset
    } = useImageUpload({
        maxSize,
        onUpload,
        onError
    });

    const handleClick = () => {
        if (!disabled && inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleClick();
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        reset();
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={`drag-drop-upload ${className}`}>
            <input
                ref={inputRef}
                type="file"
                id={id}
                accept={accept}
                onChange={handleUpload}
                disabled={disabled}
                className="drag-drop-input"
                aria-label="Upload image"
            />

            <div
                className={`drag-drop-zone ${isDragging ? 'dragging' : ''} ${hasImage ? 'has-image' : ''} ${disabled ? 'disabled' : ''} ${error ? 'has-error' : ''}`}
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label={hasImage ? `Uploaded: ${fileName}. Click to change.` : label}
            >
                {loading ? (
                    <div className="drag-drop-loading">
                        <div className="spinner"></div>
                        <span>Processing...</span>
                    </div>
                ) : hasImage && showPreview ? (
                    <div className="drag-drop-preview">
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ maxHeight: previewMaxHeight }}
                        />
                        <div className="preview-overlay">
                            <span className="file-name">{fileName}</span>
                            <button
                                className="clear-btn"
                                onClick={handleClear}
                                aria-label="Remove image"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="drag-drop-placeholder">
                        <span className="upload-icon">{icon}</span>
                        <span className="upload-label">{label}</span>
                        <span className="upload-hint">
                            Supports: PNG, JPG, WebP, GIF
                        </span>
                    </div>
                )}

                {isDragging && (
                    <div className="drag-overlay">
                        <span>Drop to upload</span>
                    </div>
                )}
            </div>

            {error && (
                <p className="drag-drop-error" role="alert">{error}</p>
            )}
        </div>
    );
};

DragDropUpload.propTypes = {
    id: PropTypes.string.isRequired,
    onUpload: PropTypes.func,
    onError: PropTypes.func,
    accept: PropTypes.string,
    maxSize: PropTypes.number,
    showPreview: PropTypes.bool,
    previewMaxHeight: PropTypes.number,
    label: PropTypes.string,
    icon: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool
};

export default DragDropUpload;
