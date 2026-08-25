import { describe, expect, it } from 'vitest';

import { changeStringToNumberObject, omitObject } from '../data/object';

// ─── changeStringToNumberObject ──────────────────────────────
describe('changeStringToNumberObject', () => {
  it('converts numeric strings to numbers', () => {
    expect(changeStringToNumberObject({ page: '1', size: '50' })).toEqual({
      page: 1,
      size: 50,
    });
  });

  it('keeps non-numeric strings as-is', () => {
    const result = changeStringToNumberObject({
      name: 'hello',
      status: 'active',
    });
    expect(result).toEqual({ name: 'hello', status: 'active' });
  });

  it('keeps empty string as empty string', () => {
    const result = changeStringToNumberObject({ q: '' });
    expect(result.q).toBe('');
  });

  it('keeps null and undefined as-is', () => {
    const result = changeStringToNumberObject({ a: null, b: undefined });
    expect(result.a).toBeNull();
    expect(result.b).toBeUndefined();
  });

  it('converts float strings', () => {
    const result = changeStringToNumberObject({ price: '99.99' });
    expect(result.price).toBe(99.99);
  });

  it('handles mixed object', () => {
    const result = changeStringToNumberObject({
      page: '2',
      search: 'test',
      status: '0',
    });
    expect(result).toEqual({ page: 2, search: 'test', status: 0 });
  });

  it('handles empty object', () => {
    expect(changeStringToNumberObject({})).toEqual({});
  });
});

// ─── omitObject ──────────────────────────────────────────────
describe('omitObject', () => {
  it('removes null values', () => {
    const result = omitObject({ a: 1, b: null });
    expect(result).toEqual({ a: 1 });
  });

  it('removes undefined values', () => {
    const result = omitObject({ a: 'hi', b: undefined });
    expect(result).toEqual({ a: 'hi' });
  });

  it('removes string "undefined"', () => {
    const result = omitObject({ a: 'test', b: 'undefined' });
    expect(result).toEqual({ a: 'test' });
  });

  it('keeps falsy but valid values (0, false, empty string)', () => {
    const result = omitObject({ a: 0, b: false, c: '' });
    expect(result).toEqual({ a: 0, b: false, c: '' });
  });

  it('returns empty object when all values are null/undefined', () => {
    const result = omitObject({ a: null, b: undefined, c: 'undefined' });
    expect(result).toEqual({});
  });

  it('passes through non-null values unchanged', () => {
    const input = { name: 'Test', count: 42, active: true };
    expect(omitObject(input)).toEqual(input);
  });
});
