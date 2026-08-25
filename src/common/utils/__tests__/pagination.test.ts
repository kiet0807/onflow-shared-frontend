import { describe, expect, it } from 'vitest';

import { calculateTotalPage, getRowIndex } from '../misc/pagination';

// ─── calculateTotalPage ──────────────────────────────────────
describe('calculateTotalPage', () => {
  it('returns 1 for total=0', () => {
    expect(calculateTotalPage(0, 10)).toBe(1);
  });

  it('returns 1 for total < pageSize', () => {
    expect(calculateTotalPage(5, 50)).toBe(1);
  });

  it('returns exact pages when total is divisible', () => {
    expect(calculateTotalPage(100, 50)).toBe(2);
  });

  it('rounds up when total is not divisible', () => {
    expect(calculateTotalPage(101, 50)).toBe(3);
  });

  it('uses default page size (50) when not provided', () => {
    // DEFAULT_PAGE_SIZE = 50
    expect(calculateTotalPage(100)).toBe(2);
  });

  it('handles total=1', () => {
    expect(calculateTotalPage(1, 10)).toBe(1);
  });

  it('handles large numbers', () => {
    expect(calculateTotalPage(10000, 50)).toBe(200);
  });
});

// ─── getRowIndex ─────────────────────────────────────────────
describe('getRowIndex', () => {
  it('returns 1-based index on first page', () => {
    expect(getRowIndex(0, 1, 50)).toBe(1);
    expect(getRowIndex(4, 1, 50)).toBe(5);
  });

  it('returns correct index on page 2', () => {
    expect(getRowIndex(0, 2, 50)).toBe(51);
    expect(getRowIndex(9, 2, 50)).toBe(60);
  });

  it('returns correct index on page 3 with custom pageSize', () => {
    expect(getRowIndex(0, 3, 10)).toBe(21);
  });

  it('uses default page size when not provided', () => {
    // DEFAULT_PAGE_SIZE = 50
    expect(getRowIndex(0, 2)).toBe(51);
  });
});
