import dayjs from 'dayjs';

import { EMPTY_VALUE } from '../../../common/constants';

/**
 * Default date range helper.
 * @param {number} day - Offset in days (negative = past)
 * @returns {[number, number]} Unix timestamps [start, end]
 */
export const defaultRangeDateTime = (day = 1) => {
  const currentDate = dayjs().startOf('day');
  if (day > 0) {
    const futureDate = currentDate.add(day, 'day');
    const lastDay = futureDate.endOf('day');
    return [currentDate.unix(), lastDay.unix()];
  } else {
    const pastDay = currentDate.add(day, 'day');
    const lastDay = currentDate.endOf('day');
    return [pastDay.unix(), lastDay.unix()];
  }
};

/**
 * Count days between two unix timestamps.
 */
export function countDays(
  startDate: number | null | undefined,
  endDate: number | null | undefined,
) {
  if (startDate == null || endDate == null) return 0;
  // eslint-disable-next-line import/no-named-as-default-member
  const startDateTime = dayjs.unix(startDate);
  // eslint-disable-next-line import/no-named-as-default-member
  const endDateTime = dayjs.unix(endDate);
  return endDateTime.diff(startDateTime, 'day');
}

/**
 * Format a date value.
 * @param {number|string} dataString - Timestamp
 * @param {string} format - dayjs format string
 */
export const formatDateTime = (
  dataString: number | string | null | undefined,
  format = 'DD-MM-YYYY HH:mm:ss',
) => {
  if (dataString == null || dataString === '' || dataString === 0) {
    return EMPTY_VALUE;
  }
  const num = Number(dataString);
  // If the number is large enough, it's milliseconds (typically > 10,000,000,000 for dates past 1970).
  // E.g., year 2001 in seconds is ~1,000,000,000. Year 2001 in ms is ~1,000,000,000,000.
  // We check if it's less than 10 billion to safely treat it as Unix timestamp (seconds).
  if (num < 10000000000) {
    // eslint-disable-next-line import/no-named-as-default-member
    return dayjs.unix(num).format(format) || EMPTY_VALUE;
  }
  return dayjs(num).format(format) || EMPTY_VALUE;
};

/**
 * Convert a Date to unix timestamp (seconds).
 */
export const formatTimeStamp = (
  time: Date | string | number | null | undefined,
) => {
  if (time == null || time === '' || time === 0) return;
  const timeStamp = new Date(time).getTime() / 1000;
  return Math.round(timeStamp);
};

/**
 * Convert unix timestamp (seconds) to ISO string.
 */
export const formatISOTime = (timestamp: number | null | undefined) => {
  if (timestamp == null || timestamp === 0) return;
  return new Date(timestamp * 1000).toISOString();
};

/**
 * Human-readable elapsed time (e.g. "5 minutes ago").
 */
export function formatElapsedTime(
  timestamp: number | null | undefined,
  t: (key: string) => string,
) {
  if (timestamp == null) return;
  const now = Date.now();
  const inputTime = timestamp * 1000;
  const diffMs = now - inputTime;

  if (diffMs < 0) return;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.44);
  const diffYears = Math.floor(diffDays / 365.25);

  if (diffMinutes < 60) return `${diffMinutes} ${t('common.minutesAgo')}`;
  if (diffHours < 24) return `${diffHours} ${t('common.hoursAgo')}`;
  if (diffDays < 30.44) return `${diffDays} ${t('common.daysAgo')}`;
  if (diffYears < 1) return `${diffMonths} ${t('common.monthsAgo')}`;
  return `${diffYears} ${t('common.yearsAgo')}`;
}

/**
 * Get ISO string for a day offset from today.
 */
export const getTimeToDay = (days = 0) => {
  const today = dayjs();
  if (days < 0) {
    return today.add(days, 'day').toISOString();
  }
  return days
    ? today.startOf('day').add(days, 'day').toISOString()
    : today.startOf('day').toISOString();
};

export const getStartAndEndDay = (date = new Date()) => {
  const startDay = dayjs(date).startOf('day').unix();
  const endDay = dayjs(date).endOf('day').unix();
  return { startDay, endDay };
};
