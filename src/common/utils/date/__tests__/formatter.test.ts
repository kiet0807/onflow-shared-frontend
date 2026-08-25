import { EMPTY_VALUE } from '../../../../common/constants';
import { formatDateTime, formatTimeStamp, countDays } from '../formatter';

describe('formatDateTime', () => {
  it('returns EMPTY_VALUE for empty inputs', () => {
    expect(formatDateTime(null)).toBe(EMPTY_VALUE);
    expect(formatDateTime(undefined)).toBe(EMPTY_VALUE);
    expect(formatDateTime(0)).toBe(EMPTY_VALUE);
    expect(formatDateTime('')).toBe(EMPTY_VALUE);
  });

  it('formats unix-seconds timestamps', () => {
    // 1_700_000_000 = 2023-11-14T22:13:20Z — formatted in local TZ.
    const out = formatDateTime(1_700_000_000, 'YYYY-MM-DD HH:mm');
    expect(out).toMatch(/^2023-11-(14|15) \d{2}:\d{2}$/);
  });

  it('formats millisecond timestamps', () => {
    const out = formatDateTime(1_700_000_000_000, 'YYYY');
    expect(out).toBe('2023');
  });
});

describe('formatTimeStamp', () => {
  it('returns undefined for empty inputs', () => {
    expect(formatTimeStamp(null)).toBeUndefined();
    expect(formatTimeStamp(undefined)).toBeUndefined();
  });

  it('round-trips a Date', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const unix = formatTimeStamp(date);
    expect(typeof unix).toBe('number');
    expect(date.getTime() / 1000).toBeCloseTo(unix!, 0);
  });
});

describe('countDays', () => {
  it('returns 0 for missing inputs', () => {
    expect(countDays(null, null)).toBe(0);
    expect(countDays(undefined, undefined)).toBe(0);
  });

  it('returns the day delta between two timestamps', () => {
    const start = Math.floor(new Date('2024-01-01').getTime() / 1000);
    const end = Math.floor(new Date('2024-01-04').getTime() / 1000);
    expect(countDays(start, end)).toBe(3);
  });
});