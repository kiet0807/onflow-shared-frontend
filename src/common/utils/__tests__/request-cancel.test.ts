import axios, { CanceledError } from 'axios';
import { describe, expect, it, vi } from 'vitest';

import {
  createDuplicateRequestError,
  isRequestCanceled,
} from '../http/request-cancel';

describe('request-cancel utils', () => {
  it('creates CanceledError for duplicate requests', () => {
    const error = createDuplicateRequestError('duplicate');

    expect(error).toBeInstanceOf(CanceledError);
    expect(error.message).toBe('duplicate');
    expect(isRequestCanceled(error)).toBe(true);
  });

  it('detects legacy cancel errors and ERR_CANCELED payloads', () => {
    const legacyError = { message: 'legacy' };
    const isCancelSpy = vi.spyOn(axios, 'isCancel').mockReturnValueOnce(true);

    expect(isRequestCanceled(legacyError)).toBe(true);
    expect(isRequestCanceled({ code: 'ERR_CANCELED' })).toBe(true);
    expect(isRequestCanceled({ name: 'CanceledError' })).toBe(true);
    expect(isRequestCanceled({ message: 'failed' })).toBe(false);

    isCancelSpy.mockRestore();
  });
});
