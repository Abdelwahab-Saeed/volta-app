import React, { useState, useEffect } from 'react';

/**
 * A wrapper around the <img> tag that provides a fallback image when the source fails to load.
 * @param {string} src - The image source URL.
 * @param {string} fallback - The fallback image URL (defaults to /assets/fallback.png).
 * @param {string} alt - Accessibility text.
 * @param {string} className - CSS classes.
 */
const SafeImage = ({ src, fallback = '/assets/fallback.png', alt = '', className = '', ...props }) => {
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
            onError={handleError}
            {...props}
        />
    );
};

export default SafeImage;
