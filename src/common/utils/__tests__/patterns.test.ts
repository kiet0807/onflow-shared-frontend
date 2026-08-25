import { describe, expect, it } from 'vitest';

import { vietnamesePhoneNumberRegex, websiteRegex } from '../regex/patterns';

// ─── vietnamesePhoneNumberRegex ──────────────────────────────
describe('vietnamesePhoneNumberRegex', () => {
  it.each([
    '0901234567', // 10 digits
    '09012345678', // 11 digits
    '0321234567', // Viettel prefix
  ])('matches valid phone: %s', (phone) => {
    expect(vietnamesePhoneNumberRegex.test(phone)).toBe(true);
  });

  it.each([
    '1234567890', // doesn't start with 0
    '090123456', // too short (9 digits total)
    '090123456789', // too long (12 digits total)
    '090-123-4567', // contains dashes
    '+84901234567', // international prefix
    '', // empty
    'abcdefghij', // non-digits
    '0 901234567', // contains space
  ])('rejects invalid phone: %s', (phone) => {
    expect(vietnamesePhoneNumberRegex.test(phone)).toBe(false);
  });
});

// ─── websiteRegex ────────────────────────────────────────────
describe('websiteRegex', () => {
  it.each([
    'https://google.com',
    'http://example.com',
    'https://sub.domain.com',
    'https://example.com/path/to/page',
    'https://example.com:8080',
    'example.com',
    'http://192.168.1.1',
    'http://192.168.1.1:3000',
  ])('matches valid URL: %s', (url) => {
    expect(websiteRegex.test(url)).toBe(true);
  });

  it.each(['', 'not a url', 'ftp://files.example.com', 'javascript:alert(1)'])(
    'rejects invalid URL: %s',
    (url) => {
      expect(websiteRegex.test(url)).toBe(false);
    },
  );
});
