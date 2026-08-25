import { describe, expect, it } from 'vitest';

import { getInitials } from '../data/string';

describe('getInitials', () => {
  it('extracts initials from a full name (2 words)', () => {
    expect(getInitials('Nguyen Van')).toBe('NV');
  });

  it('extracts at most 2 characters from 3+ words', () => {
    expect(getInitials('Nguyen Van A')).toBe('NV');
  });

  it('returns single character for a single word', () => {
    expect(getInitials('Admin')).toBe('A');
  });

  it('returns default fallback "?" for empty string', () => {
    expect(getInitials('')).toBe('?');
  });

  it('returns default fallback for null', () => {
    expect(getInitials(null)).toBe('?');
  });

  it('returns default fallback for undefined', () => {
    expect(getInitials(undefined)).toBe('?');
  });

  it('supports custom fallback', () => {
    expect(getInitials('', 'N/A')).toBe('N/A');
  });

  it('uppercases the result', () => {
    expect(getInitials('john doe')).toBe('JD');
  });

  it('handles extra whitespace', () => {
    expect(getInitials('  hello   world  ')).toBe('HW');
  });

  it('handles single character name', () => {
    expect(getInitials('X')).toBe('X');
  });
});
