import { uniq } from 'lodash';

export const checkDuplicateArray = (
  array: unknown[] | null | undefined,
): boolean => {
  if (!array || array.length === 0) return false;
  const uniqueArray = uniq(array);
  return array.length !== uniqueArray.length;
};

export const toSelectOptions = <T extends Record<string, unknown>>(
  data: T[] = [],
  labelKey: keyof T = 'label' as keyof T,
  valueKey: keyof T = 'id' as keyof T,
) =>
  data?.map((item) => ({
    ...item,
    label: item[labelKey],
    value: item[valueKey],
  })) || [];

/**
 * Build a keyed lookup map from an array.
 * @param list - Source array
 * @param key - Property name to use as the map key
 * @param normalize - Case normalization for keys
 * @returns Lookup map { normalizedKey: item }
 */
export const buildLookupMap = <T extends Record<string, unknown>>(
  list: T[] = [],
  key: string = 'value',
  normalize: 'lower' | 'upper' = 'lower',
): Record<string, T> => {
  const fn =
    normalize === 'upper'
      ? (s: unknown) => String(s).toUpperCase()
      : (s: unknown) => String(s).toLowerCase();
  return list.reduce<Record<string, T>>((acc, item) => {
    if (item[key] != null) acc[fn(item[key])] = item;
    return acc;
  }, {});
};
