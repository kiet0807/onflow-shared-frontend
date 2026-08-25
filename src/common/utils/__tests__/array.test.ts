import { describe, expect, it } from 'vitest';

import {
  buildLookupMap,
  checkDuplicateArray,
  toSelectOptions,
} from '../data/array';

// ─── checkDuplicateArray ─────────────────────────────────────
describe('checkDuplicateArray', () => {
  it('returns false for empty array', () => {
    expect(checkDuplicateArray([])).toBe(false);
  });

  it('returns false for null/undefined', () => {
    expect(checkDuplicateArray(null)).toBe(false);
    expect(checkDuplicateArray(undefined)).toBe(false);
  });

  it('returns false when no duplicates', () => {
    expect(checkDuplicateArray([1, 2, 3])).toBe(false);
  });

  it('returns true when duplicates exist', () => {
    expect(checkDuplicateArray([1, 2, 2, 3])).toBe(true);
  });

  it('works with string values', () => {
    expect(checkDuplicateArray(['a', 'b', 'a'])).toBe(true);
    expect(checkDuplicateArray(['a', 'b', 'c'])).toBe(false);
  });
});

// ─── toSelectOptions ─────────────────────────────────────────
describe('toSelectOptions', () => {
  it('returns empty array for default/empty input', () => {
    expect(toSelectOptions()).toEqual([]);
    expect(toSelectOptions([])).toEqual([]);
  });

  it('maps label and value keys', () => {
    const data = [
      { id: 1, name: 'Hà Nội', extra: 'x' },
      { id: 2, name: 'HCM', extra: 'y' },
    ];
    const result = toSelectOptions(data, 'name');
    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ label: 'Hà Nội', value: 1 });
    expect(result[1]).toMatchObject({ label: 'HCM', value: 2 });
  });

  it('supports custom valueKey', () => {
    const data = [{ code: 'VN', name: 'Vietnam' }];
    const result = toSelectOptions(data, 'name', 'code');
    expect(result[0]).toMatchObject({ label: 'Vietnam', value: 'VN' });
  });

  it('preserves original item properties via spread', () => {
    const data = [{ id: 1, name: 'Test', extra: 42 }];
    const result = toSelectOptions(data, 'name');
    expect(result[0].extra).toBe(42);
  });
});

// ─── buildLookupMap ──────────────────────────────────────────
describe('buildLookupMap', () => {
  const items = [
    { value: 'Active', label: 'Đang hoạt động' },
    { value: 'Inactive', label: 'Ngừng hoạt động' },
  ];

  it('returns empty object for empty list', () => {
    expect(buildLookupMap([])).toEqual({});
  });

  it('returns empty object for default (undefined) list', () => {
    expect(buildLookupMap()).toEqual({});
  });

  it('normalizes keys to lowercase by default', () => {
    const map = buildLookupMap(items);
    expect(map).toHaveProperty('active');
    expect(map).toHaveProperty('inactive');
    expect(map['active'].label).toBe('Đang hoạt động');
  });

  it('normalizes keys to uppercase when specified', () => {
    const map = buildLookupMap(items, 'value', 'upper');
    expect(map).toHaveProperty('ACTIVE');
    expect(map).toHaveProperty('INACTIVE');
  });

  it('uses custom key property', () => {
    const carriers = [
      { code: 'ghn', name: 'GHN' },
      { code: 'ghtk', name: 'GHTK' },
    ];
    const map = buildLookupMap(carriers, 'code');
    expect(map).toHaveProperty('ghn');
    expect(map['ghn'].name).toBe('GHN');
  });

  it('skips items with null/undefined key', () => {
    const data = [
      { value: 'test', label: 'Test' },
      { value: null, label: 'Null' },
      { label: 'No value' },
    ];
    const map = buildLookupMap(data);
    expect(Object.keys(map)).toHaveLength(1);
    expect(map).toHaveProperty('test');
  });
});
