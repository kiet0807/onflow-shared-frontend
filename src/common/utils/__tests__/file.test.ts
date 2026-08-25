import { describe, expect, it } from 'vitest';

import { EMPTY_VALUE } from '../../../common/constants';

import { parseFileFromUrl } from '../misc/file';

describe('parseFileFromUrl', () => {
  it('returns empty placeholder for falsy url', () => {
    expect(parseFileFromUrl('')).toEqual({
      filename: EMPTY_VALUE,
      extension: '',
    });
    expect(parseFileFromUrl(null)).toEqual({
      filename: EMPTY_VALUE,
      extension: '',
    });
  });

  it('extracts filename and extension from a plain url', () => {
    expect(
      parseFileFromUrl('https://cdn.example.com/reports/export.xlsx'),
    ).toEqual({
      filename: 'export.xlsx',
      extension: 'XLSX',
    });
  });

  it('strips query params and decodes encoded filenames', () => {
    expect(
      parseFileFromUrl(
        'https://cdn.example.com/files/my%20report.csv?token=abc',
      ),
    ).toEqual({
      filename: 'my report.csv',
      extension: 'CSV',
    });
  });

  it('falls back to the raw url when parsing fails', () => {
    const malformed = '%E0%A4%A';
    expect(parseFileFromUrl(malformed)).toEqual({
      filename: malformed,
      extension: '',
    });
  });
});
