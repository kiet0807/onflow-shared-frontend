import { DEFAULT_PAGE_SIZE } from '../../constants';

/**
 * Calculate total pages for pagination.
 */
export function calculateTotalPage(
  total: number = 0,
  pageSize?: number,
): number {
  const size = pageSize && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  return Math.ceil(total / size) || 1;
}

/**
 * Get 1-based row index for paginated tables.
 */
export const getRowIndex = (
  index: number,
  currentPage: number,
  pageSize?: number,
): number => {
  const size = pageSize ?? DEFAULT_PAGE_SIZE;
  return index + (currentPage - 1) * size + 1;
};
