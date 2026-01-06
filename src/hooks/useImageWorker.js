import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to manage Web Worker for image processing
 * Provides easy interface for offloading heavy operations
 */
export const useImageWorker = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const workerRef = useRef(null);
    const callbacksRef = useRef(new Map());
    const idCounterRef = useRef(0);

    // Initialize worker
    useEffect(() => {
        // Create worker
        try {
            workerRef.current = new Worker(
                new URL('./imageWorker.js', import.meta.url),
                { type: 'module' }
            );

            // Handle messages from worker
            workerRef.current.onmessage = (e) => {
                const { id, success, result, error: workerError, type } = e.data;

                // Handle progress updates
                if (type === 'progress') {
                    setProgress(e.data.percentage);
                    return;
                }

                // Handle operation completion
                const callback = callbacksRef.current.get(id);
                if (callback) {
                    if (success) {
                        callback.resolve(result);
                    } else {
                        callback.reject(new Error(workerError));
                    }
                    callbacksRef.current.delete(id);
                }

                // Reset processing state if no pending operations
                if (callbacksRef.current.size === 0) {
                    setIsProcessing(false);
                    setProgress(0);
                }
            };

            // Handle worker errors
            workerRef.current.onerror = (e) => {
                setError(e.message);
                setIsProcessing(false);
            };
        } catch (err) {
            // Web Workers not supported or blocked
            console.warn('Web Workers not available:', err);
            workerRef.current = null;
        }

        // Cleanup
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    /**
     * Send operation to worker
     * @param {string} type - Operation type
     * @param {Object} payload - Operation data
     * @returns {Promise} Result of operation
     */
    const processImage = useCallback((type, payload) => {
        return new Promise((resolve, reject) => {
            if (!workerRef.current) {
                // Fallback: run synchronously on main thread
                reject(new Error('Web Worker not available'));
                return;
            }

            const id = ++idCounterRef.current;
            callbacksRef.current.set(id, { resolve, reject });

            setIsProcessing(true);
            setError(null);
            setProgress(0);

            workerRef.current.postMessage({ type, payload, id });
        });
    }, []);

    /**
     * Resize an image
     */
    const resizeImage = useCallback((imageData, width, height, options = {}) => {
        return processImage('resize', {
            imageData,
            width,
            height,
            quality: options.quality || 0.85,
            format: options.format || 'image/jpeg'
        });
    }, [processImage]);

    /**
     * Compress an image
     */
    const compressImage = useCallback((imageData, quality, format = 'image/jpeg') => {
        return processImage('compress', { imageData, quality, format });
    }, [processImage]);

    /**
     * Apply filter to image
     */
    const applyFilter = useCallback((imageData, filter, intensity = 1) => {
        return processImage('applyFilter', { imageData, filter, intensity });
    }, [processImage]);

    /**
     * Extract colors from image
     */
    const extractColors = useCallback((pixels, count = 5) => {
        return processImage('extractColors', { pixels, count });
    }, [processImage]);

    /**
     * Batch process multiple images
     */
    const batchProcess = useCallback((images, operation, options) => {
        return processImage('batchProcess', { images, operation, options });
    }, [processImage]);

    /**
     * Check if Web Workers are supported
     */
    const isSupported = () => workerRef.current !== null;

    /**
     * Cancel all pending operations
     */
    const cancel = useCallback(() => {
        if (workerRef.current) {
            workerRef.current.terminate();
            // Reinitialize worker
            workerRef.current = new Worker(
                new URL('./imageWorker.js', import.meta.url),
                { type: 'module' }
            );
        }
        callbacksRef.current.clear();
        setIsProcessing(false);
        setProgress(0);
    }, []);

    return {
        // State
        isProcessing,
        progress,
        error,
        isSupported: isSupported(),

        // Operations
        processImage,
        resizeImage,
        compressImage,
        applyFilter,
        extractColors,
        batchProcess,
        cancel
    };
};

export default useImageWorker;
