import { memo } from 'react';

import { CopyButton } from '../../index';

export interface CopyableCellProps {
  text?: string | number | null;
  size?: number;
  className?: string;
  textClassName?: string;
}

/**
 * CopyableCell — Table cell displaying text with a copy-to-clipboard button.
 * Memoized to prevent unnecessary re-renders in table rows.
 */
const CopyableCellInner = ({
  text,
  size = 14,
  className,
  textClassName,
}: CopyableCellProps) =>
  text ? (
    <div className={`d-flex align-items-center gap-2 ${className || ''}`}>
      <CopyButton code={String(text)} size={size} className="flex-shrink-0" />
      <span
        className={`fs-${size} ${textClassName || ''}`}
        title={
          typeof text === 'string' || typeof text === 'number'
            ? String(text)
            : undefined
        }
      >
        {text}
      </span>
    </div>
  ) : (
    <span>---</span>
  );

export const CopyableCell = memo(CopyableCellInner);
