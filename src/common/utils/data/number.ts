/**
 * Number formatting utilities.
 */
import { EMPTY_VALUE } from '../../../common/constants';

const numberFormatter = new Intl.NumberFormat('vi-VN');

/**
 * Format a number with Vietnamese locale (e.g. 1.000.000).
 */
export const formatNumber = (
  value: number | string | null | undefined,
): string => {
  if (value == null || value === '') return EMPTY_VALUE;
  const num = Number(value);
  if (isNaN(num)) return EMPTY_VALUE;
  return numberFormatter.format(num);
};

/**
 * Format a price with Vietnamese đồng (e.g. 400.000 đ).
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  suffix: string = 'đ',
): string => {
  if (value == null || value === '') return EMPTY_VALUE;
  const num = Number(value);
  if (isNaN(num)) return EMPTY_VALUE;
  return `${numberFormatter.format(num)} ${suffix}`;
};

/**
 * Format a number with maximum fractional digits.
 */
export const formatDecimalNumber = (
  value: number | string | null | undefined,
  maxDigits: number = 3,
): string => {
  if (value == null || value === '') return EMPTY_VALUE;
  const num = Number(value);
  if (isNaN(num)) return EMPTY_VALUE;
  return num.toLocaleString('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  });
};

/**
 * Format a weight given in grams: shows kg when >= 1000g, otherwise g.
 * @param maxDigits - max fractional digits for the kg value (default 3)
 */
export const formatWeight = (
  value: number | string | null | undefined,
  maxDigits: number = 3,
): string => {
  if (value == null || value === '') return EMPTY_VALUE;
  const grams = Number(value);
  if (isNaN(grams)) return EMPTY_VALUE;
  return grams >= 1000
    ? `${formatDecimalNumber(grams / 1000, maxDigits)} kg`
    : `${formatDecimalNumber(grams, maxDigits)} g`;
};
