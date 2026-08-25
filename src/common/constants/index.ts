/**
 * Common Constants
 *
 * Export shared constants here.
 * Example: pagination defaults, date formats, status enums, etc.
 */

export const DEFAULT_COUNTRY = 'VN';
export const DEFAULT_CURRENCY = 'VND';
export const DEFAULT_LANG = 'vi';

export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE = 1;

/** Placeholder shown for empty / missing display values. */
export const EMPTY_VALUE = '---';

/**
 * Shared stable empty-array reference.
 * Use as a fallback (e.g. `data ?? EMPTY_ARRAY`) to avoid allocating a new
 * `[]` each render, which would break referential equality and defeat `memo`.
 */
export const EMPTY_ARRAY: never[] = [];

/** Product/brand name used in document titles and footer branding. */
export const APP_NAME = 'Open Portal';
/** Company name shown in the footer ("Powered by ..."). */
export const COMPANY_NAME = 'Onflow.vn';

/** Single read-only date type option for DateTimeSelector (label: "Thời gian tạo") */
export const DATE_TYPE_CREATED_OPTION = [
  { value: 'created', label: 'common.dateFilter.created' },
] as const;

/** Single read-only date type option for request/export history (label: "Thời gian yêu cầu") */
export const DATE_TYPE_REQUESTED_OPTION = [
  { value: 'created', label: 'common.dateFilter.requested' },
] as const;

export const STOCK_LEVEL_COLORS: Record<string, string> = {
  A: 'success',
  D1: 'danger',
  D2: 'danger',
  D3: 'danger',
  L: 'warning',
};
