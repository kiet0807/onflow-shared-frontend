import { useState } from 'react';

import { defaultImage } from '../../../assets/images';

/**
 * ImageFallback — Displays an image with automatic fallback on error.
 * Falls back to a default placeholder if src is empty or fails to load.
 * All extra props are forwarded to the underlying <img> element.
 *
 * @param {string} src - Image URL
 * @param {object} props - Any valid <img> attributes (className, style, alt, etc.)
 */
export const ImageFallback = ({ src = '', ...props }) => {
  const [isError, setIsError] = useState(false);

  if (isError || !src) {
    return <img src={defaultImage} {...props} />;
  }

  return <img src={src} onError={() => setIsError(true)} {...props} />;
};
