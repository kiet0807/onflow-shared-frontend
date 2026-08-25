import dayjs from 'dayjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  countDays,
  defaultRangeDateTime,
  formatDateTime,
  formatElapsedTime,
  formatISOTime,
  formatTimeStamp,
  getStartAndEndDay,
  getTimeToDay,
} from '../date/formatter';

// ─── defaultRangeDateTime ────────────────────────────────────
describe('defaultRangeDateTime', () => {
  it('returns an array of two unix timestamps', () => {
    const result = defaultRangeDateTime();
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });

  it('start <= end for positive days', () => {
    const [start, end] = defaultRangeDateTime(3);
    expect(start).toBeLessThanOrEqual(end);
  });

  it('start <= end for negative days', () => {
    const [start, end] = defaultRangeDateTime(-7);
    expect(start).toBeLessThanOrEqual(end);
  });

  it('default day=1 returns today start to tomorrow end', () => {
    const [start, end] = defaultRangeDateTime(1);
    const todayStart = dayjs().startOf('day').unix();
    expect(start).toBe(todayStart);
    expect(end).toBeGreaterThan(start);
  });
});

// ─── countDays ───────────────────────────────────────────────
describe('countDays', () => {
  it('counts days between two timestamps', () => {
    const start = dayjs('2024-01-01').unix();
    const end = dayjs('2024-01-10').unix();
    expect(countDays(start, end)).toBe(9);
  });

  it('returns 0 for same day', () => {
    const ts = dayjs('2024-06-15').unix();
    expect(countDays(ts, ts)).toBe(0);
  });

  it('returns negative for reversed dates', () => {
    const start = dayjs('2024-01-10').unix();
    const end = dayjs('2024-01-01').unix();
    expect(countDays(start, end)).toBe(-9);
  });
});

// ─── formatDateTime ──────────────────────────────────────────
describe('formatDateTime', () => {
  it('returns "---" for falsy input', () => {
    expect(formatDateTime(null)).toBe('---');
    expect(formatDateTime(undefined)).toBe('---');
    expect(formatDateTime(0)).toBe('---');
    expect(formatDateTime('')).toBe('---');
  });

  it('formats a unix timestamp (seconds) with default format', () => {
    // 2024-01-15 10:30:00 UTC → unix = 1705311000
    const ts = dayjs('2024-01-15T10:30:00').unix();
    const result = formatDateTime(ts);
    expect(result).toMatch(/15-01-2024/);
  });

  it('formats millisecond timestamps (> 10 billion)', () => {
    const ms = dayjs('2024-06-01T12:00:00').valueOf(); // milliseconds
    const result = formatDateTime(ms);
    expect(result).toMatch(/01-06-2024/);
  });

  it('supports custom format string', () => {
    const ts = dayjs('2024-03-25').unix();
    const result = formatDateTime(ts, 'YYYY/MM/DD');
    expect(result).toBe('2024/03/25');
  });
});

// ─── formatTimeStamp ─────────────────────────────────────────
describe('formatTimeStamp', () => {
  it('returns undefined for falsy input', () => {
    expect(formatTimeStamp(null)).toBeUndefined();
    expect(formatTimeStamp(undefined)).toBeUndefined();
    expect(formatTimeStamp(0)).toBeUndefined();
  });

  it('converts Date to unix seconds', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    const result = formatTimeStamp(date);
    expect(result).toBe(Math.round(date.getTime() / 1000));
  });
});

// ─── formatISOTime ───────────────────────────────────────────
describe('formatISOTime', () => {
  it('returns undefined for falsy input', () => {
    expect(formatISOTime(null)).toBeUndefined();
    expect(formatISOTime(undefined)).toBeUndefined();
    expect(formatISOTime(0)).toBeUndefined();
  });

  it('converts unix seconds to ISO string', () => {
    const ts = Math.round(new Date('2024-06-15T12:00:00Z').getTime() / 1000);
    const result = formatISOTime(ts);
    expect(result).toBe('2024-06-15T12:00:00.000Z');
  });
});

// ─── formatElapsedTime ───────────────────────────────────────
describe('formatElapsedTime', () => {
  const mockT = (key: string) => {
    const map: Record<string, string> = {
      'common.minutesAgo': 'phút trước',
      'common.hoursAgo': 'giờ trước',
      'common.daysAgo': 'ngày trước',
      'common.monthsAgo': 'tháng trước',
      'common.yearsAgo': 'năm trước',
    };
    return map[key] || key;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns undefined for future timestamps', () => {
    const futureTs = Math.round(Date.now() / 1000) + 3600;
    expect(formatElapsedTime(futureTs, mockT)).toBeUndefined();
  });

  it('returns minutes for <60 min', () => {
    const ts = Math.round(Date.now() / 1000) - 30 * 60;
    const result = formatElapsedTime(ts, mockT);
    expect(result).toContain('30');
    expect(result).toContain('phút trước');
  });

  it('returns hours for <24 hours', () => {
    const ts = Math.round(Date.now() / 1000) - 5 * 3600;
    const result = formatElapsedTime(ts, mockT);
    expect(result).toContain('5');
    expect(result).toContain('giờ trước');
  });

  it('returns days for <30 days', () => {
    const ts = Math.round(Date.now() / 1000) - 10 * 86400;
    const result = formatElapsedTime(ts, mockT);
    expect(result).toContain('10');
    expect(result).toContain('ngày trước');
  });

  it('returns months for <1 year', () => {
    const ts = Math.round(Date.now() / 1000) - 90 * 86400;
    const result = formatElapsedTime(ts, mockT);
    expect(result).toContain('tháng trước');
  });

  it('returns years for >= 1 year', () => {
    const ts = Math.round(Date.now() / 1000) - 400 * 86400;
    const result = formatElapsedTime(ts, mockT);
    expect(result).toContain('năm trước');
  });
});

// ─── getTimeToDay ────────────────────────────────────────────
describe('getTimeToDay', () => {
  it('returns an ISO string', () => {
    const result = getTimeToDay(0);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('returns start of today for days=0', () => {
    const result = getTimeToDay(0);
    const expected = dayjs().startOf('day').toISOString();
    expect(result).toBe(expected);
  });

  it('returns a past date for negative days', () => {
    const result = getTimeToDay(-3);
    const now = dayjs();
    const past = dayjs(result);
    expect(past.isBefore(now)).toBe(true);
  });

  it('returns a future date for positive days', () => {
    const result = getTimeToDay(5);
    const today = dayjs().startOf('day');
    const future = dayjs(result);
    expect(future.isAfter(today)).toBe(true);
  });
});

// ─── getStartAndEndDay ───────────────────────────────────────
describe('getStartAndEndDay', () => {
  it('returns startDay and endDay unix timestamps', () => {
    const { startDay, endDay } = getStartAndEndDay(new Date('2024-06-15'));
    expect(typeof startDay).toBe('number');
    expect(typeof endDay).toBe('number');
    expect(endDay).toBeGreaterThan(startDay);
  });

  it('defaults to today', () => {
    const { startDay, endDay } = getStartAndEndDay();
    const todayStart = dayjs().startOf('day').unix();
    const todayEnd = dayjs().endOf('day').unix();
    expect(startDay).toBe(todayStart);
    expect(endDay).toBe(todayEnd);
  });

  it('endDay - startDay is approximately 86399 seconds (24h-1s)', () => {
    const { startDay, endDay } = getStartAndEndDay(new Date('2024-01-01'));
    // End of day is 23:59:59, start is 00:00:00
    expect(endDay - startDay).toBe(86399);
  });
});
