import { describe, expect, it } from 'vitest';

import {
  formatCurrency,
  formatDecimalNumber,
  formatNumber,
} from '../data/number';

// ─── formatNumber ────────────────────────────────────────────
describe('formatNumber', () => {
  it.each([null, undefined, ''])('returns "---" for %s', (val) => {
    expect(formatNumber(val)).toBe('---');
  });

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats a regular integer', () => {
    expect(formatNumber(1000)).toBe('1.000');
  });

  it('formats a large number', () => {
    expect(formatNumber(1234567890)).toBe('1.234.567.890');
  });

  it('formats negative numbers', () => {
    const result = formatNumber(-5000);
    expect(result).toContain('5.000');
  });

  it('formats string numbers', () => {
    expect(formatNumber('42000')).toBe('42.000');
  });

  it('formats decimal numbers', () => {
    const result = formatNumber(1234.56);
    expect(result).toContain('1.234');
  });
});

// ─── formatCurrency ──────────────────────────────────────────
describe('formatCurrency', () => {
  it.each([null, undefined, ''])('returns "---" for %s', (val) => {
    expect(formatCurrency(val)).toBe('---');
  });

  it('formats with default suffix "đ"', () => {
    expect(formatCurrency(400000)).toBe('400.000 đ');
  });

  it('formats with custom suffix', () => {
    expect(formatCurrency(1000, '$')).toBe('1.000 $');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0 đ');
  });

  it('formats string input', () => {
    expect(formatCurrency('250000')).toBe('250.000 đ');
  });
});

// ─── formatDecimalNumber ─────────────────────────────────────
describe('formatDecimalNumber', () => {
  it.each([null, undefined, ''])('returns "---" for %s', (val) => {
    expect(formatDecimalNumber(val)).toBe('---');
  });

  it('returns "---" for non-numeric strings', () => {
    expect(formatDecimalNumber('abc')).toBe('---');
  });

  it('formats integer without decimals', () => {
    expect(formatDecimalNumber(1000)).toBe('1.000');
  });

  it('formats decimal with default max 3 digits', () => {
    const result = formatDecimalNumber(1234.5678);
    // Should truncate/round to at most 3 fractional digits
    expect(result).toContain('1.234');
  });

  it('formats with custom maxDigits', () => {
    const result = formatDecimalNumber(3.14159, 2);
    // At most 2 decimal places
    expect(result).toMatch(/3,14/);
  });

  it('strips trailing zeros', () => {
    const result = formatDecimalNumber(5.1, 3);
    // minimumFractionDigits = 0 → no trailing zeros
    expect(result).toBe('5,1');
  });
});
