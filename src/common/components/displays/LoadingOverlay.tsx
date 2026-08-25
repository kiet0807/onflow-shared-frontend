import type { ReactNode } from 'react';
import { Spinner } from 'reactstrap';

import { Error } from './Error';

export interface LoadingOverlayProps {
  children?: ReactNode;
  className?: string;
  isError?: boolean;
  isLoading?: boolean;
  backdropClassName?: string;
  topOffset?: number;
}

/**
 * LoadingOverlay — wraps children with a loading/error overlay.
 *
 * @param {ReactNode} children - Content to wrap
 * @param {string} className - Wrapper CSS classes
 * @param {boolean} isError - Show error state
 * @param {boolean} isLoading - Show loading spinner
 * @param {string} backdropClassName - CSS classes for the overlay backdrop
 * @param {number} topOffset - Pixel offset from top for the overlay (default: 100)
 */
export const LoadingOverlay = ({
  children,
  className = '',
  isError = false,
  isLoading = false,
  backdropClassName = '',
  topOffset = 100,
}: LoadingOverlayProps) => {
  const overlayClasses = `loading-overlay position-absolute start-0 end-0 bottom-0 d-flex justify-content-center rounded ${backdropClassName}`;
  const childrenClasses = isLoading
    ? 'opacity-50 pe-none'
    : isError
      ? 'opacity-0 pe-none'
      : '';

  return (
    <div className={`loading-container position-relative ${className}`}>
      <div className={childrenClasses}>{children}</div>

      {isLoading && (
        <div className={overlayClasses} style={{ top: topOffset, zIndex: 999 }}>
          <Spinner color="primary" className="loading-overlay__spinner" />
        </div>
      )}
      {!isLoading && isError && (
        <div className={overlayClasses} style={{ top: topOffset, zIndex: 999 }}>
          <Error />
        </div>
      )}
    </div>
  );
};
