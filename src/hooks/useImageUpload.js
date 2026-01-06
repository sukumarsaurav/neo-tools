import { useState, useCallback } from 'react';
import { readFileAsDataURL, getImageDimensions, isValidImageFile } from '../utils/imageUtils';

/**
 * Custom hook for handling image uploads with preview and validation
 * 
 * @param {object} options - Hook options
 * @param {string[]} options.accept - Accepted MIME types
 * @param {number} options.maxSize - Maximum file size in bytes
 * @param {function} options.onUpload - Callback when image is uploaded
 * @param {function} options.onError - Callback when error occurs
 * @returns {object} Hook state and handlers
 */
export const useImageUpload = (options = {}) => {
    const {
        accept = ['image/*'],
        maxSize = 10 * 1024 * 1024, // 10MB default
        onUpload,
        onError
    } = options;

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileSize, setFileSize] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleError = useCallback((message) => {
        setError(message);
        setLoading(false);
        if (onError) onError(message);
    }, [onError]);

    const processFile = useCallback(async (file) => {
        setLoading(true);
        setError('');

        // Validate file type
        if (!isValidImageFile(file)) {
            handleError('Invalid file type. Please upload an image.');
            return;
        }

        // Validate file size
        if (file.size > maxSize) {
            handleError(`File too large. Maximum size is ${(maxSize / 1024 / 1024).toFixed(1)}MB.`);
            return;
        }

        try {
            const dataUrl = await readFileAsDataURL(file);
            const dims = await getImageDimensions(file);

            setImage(dataUrl);
            setPreview(dataUrl);
            setFileName(file.name);
            setFileSize(file.size);
            setDimensions(dims);
            setLoading(false);

            if (onUpload) {
                onUpload({
                    dataUrl,
                    fileName: file.name,
                    fileSize: file.size,
                    dimensions: dims
                });
            }
        } catch (err) {
            handleError('Failed to process image. Please try again.');
        }
    }, [maxSize, onUpload, handleError]);

    const handleUpload = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const reset = useCallback(() => {
        setImage(null);
        setPreview(null);
        setFileName('');
        setFileSize(0);
        setDimensions({ width: 0, height: 0 });
        setError('');
        setLoading(false);
    }, []);

    const updatePreview = useCallback((newPreview) => {
        setPreview(newPreview);
    }, []);

    return {
        // State
        image,
        preview,
        fileName,
        fileSize,
        dimensions,
        loading,
        error,
        isDragging,

        // Handlers
        handleUpload,
        handleDrop,
        handleDragOver,
        handleDragLeave,
        reset,
        updatePreview,
        processFile,

        // Computed
        hasImage: !!image,
        aspectRatio: dimensions.width && dimensions.height
            ? dimensions.width / dimensions.height
            : 1
    };
};

export default useImageUpload;
