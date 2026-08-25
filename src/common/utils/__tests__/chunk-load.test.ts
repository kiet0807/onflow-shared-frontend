import { describe, expect, it } from 'vitest';

import { isChunkLoadError } from '../misc/chunk-load';

describe('isChunkLoadError', () => {
  it.each([
    ['Failed to fetch dynamically imported module: /assets/x.js'],
    ['Importing a module script failed.'],
    ['error loading dynamically imported module'],
    ['Unable to preload CSS for /x.css'],
    ['ChunkLoadError: Loading chunk 5 failed'],
  ])('detects %s', (message) => {
    expect(isChunkLoadError(new Error(message))).toBe(true);
  });

  it('reads nested Error.cause', () => {
    expect(
      isChunkLoadError(
        Object.assign(new Error('Unexpected Application Error!'), {
          cause: new TypeError('Importing a module script failed.'),
        }),
      ),
    ).toBe(true);
  });

  it('reads plain-object cause chains (React Router shape)', () => {
    expect(
      isChunkLoadError({
        message: 'Unexpected Application Error!',
        cause: new TypeError('Importing a module script failed.'),
      }),
    ).toBe(true);
  });

  it.each([
    ['Network offline'],
    ['Failed to fetch'],
    ['TypeError: Failed to fetch'],
    ['Validation failed'],
    [''],
  ])('rejects non-chunk error: %s', (message) => {
    expect(isChunkLoadError(new Error(message))).toBe(false);
  });

  it('handles null / undefined / non-errors', () => {
    expect(isChunkLoadError(null)).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
    expect(isChunkLoadError(42)).toBe(false);
    expect(isChunkLoadError('Importing a module script failed.')).toBe(true);
  });
});
