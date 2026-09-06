import React, { useState, useEffect } from 'react';

/**
 * A wrapper around the <img> tag that provides a fallback image when the source fails to load.
 * @param {string} src - The image source URL.
 * @param {string} fallback - The fallback image URL (defaults to /assets/fallback.png).
 * @param {string} alt - Accessibility text.
 * @param {string} className - CSS classes.
 * @param {string} loading - Defaults to 'lazy'. Pass 'eager' for above-the-fold
 *   images (header logo, first carousel slide) so they are not deferred.
 * @param {string} decoding - Defaults to 'async'.
 */
const SafeImage = ({
    src,
    fallback = '/assets/fallback.png',
    alt = '',
    className = '',
    loading = 'lazy',
    decoding = 'async',
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setImgSrc(fallback);
            setHasError(true);
        }
    };

    return (
        <img
            src={imgSrc || fallback}
            alt={alt}
            className={className}
            loading={loading}
            decoding={decoding}
            onError={handleError}
            {...props}
        />
    );
};

export default SafeImage;
