import { memo } from 'react';

import { getRowIndex } from '../../index';

interface NumberCellProps {
  index: number;
  page: number;
  pageSize: number;
}

/**
 * NumberCell — Table cell displaying the row index number.
 * Memoized to prevent unnecessary re-renders in table rows.
 */
const NumberCellInner = ({ index, page, pageSize }: NumberCellProps) => (
  <div>{getRowIndex(index, page, pageSize)}</div>
);

export const NumberCell = memo(NumberCellInner);
