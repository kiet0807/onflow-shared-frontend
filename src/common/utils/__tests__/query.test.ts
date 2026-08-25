import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getApiErrorMessage, withErrorToast } from '../http/query';
import { createDuplicateRequestError } from '../http/request-cancel';

const toastError = vi.fn();

vi.mock('react-toastify', () => ({
  toast: {
    error: (...args: unknown[]) => toastError(...args),
  },
}));

describe('getApiErrorMessage', () => {
  it('returns message from interceptor-shaped error objects', () => {
    expect(getApiErrorMessage({ message: 'API failed' })).toBe('API failed');
  });

  it('returns message from Error instances', () => {
    expect(getApiErrorMessage(new Error('Network down'))).toBe('Network down');
  });

  it('returns undefined for empty or whitespace messages', () => {
    expect(getApiErrorMessage({ message: '   ' })).toBeUndefined();
    expect(getApiErrorMessage(null)).toBeUndefined();
  });
});

describe('withErrorToast', () => {
  beforeEach(() => {
    toastError.mockClear();
  });

  it('returns the resolved value from the wrapped function', async () => {
    const wrapped = withErrorToast(() => Promise.resolve({ ok: true }));

    await expect(wrapped()).resolves.toEqual({ ok: true });
    expect(toastError).not.toHaveBeenCalled();
  });

  it('shows toast and rethrows non-cancel errors', async () => {
    const error = { message: 'Request failed' };
    const wrapped = withErrorToast(() => Promise.reject(error));

    await expect(wrapped()).rejects.toEqual(error);
    expect(toastError).toHaveBeenCalledWith('Request failed');
  });

  it('rethrows ERR_CANCELED without toast', async () => {
    const canceled = { code: 'ERR_CANCELED', message: 'canceled' };
    const wrapped = withErrorToast(() => Promise.reject(canceled));

    await expect(wrapped()).rejects.toEqual(canceled);
    expect(toastError).not.toHaveBeenCalled();
  });

  it('rethrows CanceledError without toast', async () => {
    const canceled = createDuplicateRequestError('duplicate');
    const wrapped = withErrorToast(() => Promise.reject(canceled));

    await expect(wrapped()).rejects.toBe(canceled);
    expect(toastError).not.toHaveBeenCalled();
  });

  it('rethrows handled auth-expired errors without toast', async () => {
    const authExpired = {
      code: 'AUTH_EXPIRED',
      isHandled: true,
      message: 'Session expired',
    };
    const wrapped = withErrorToast(() => Promise.reject(authExpired));

    await expect(wrapped()).rejects.toEqual(authExpired);
    expect(toastError).not.toHaveBeenCalled();
  });

  it('rethrows permission-denied errors without toast when interceptor already handled them', async () => {
    const permissionDenied = {
      message: 'Bạn không có quyền thực hiện thao tác này!',
      status: 403,
      isHandled: true,
    };
    const wrapped = withErrorToast(() => Promise.reject(permissionDenied));

    await expect(wrapped()).rejects.toEqual(permissionDenied);
    expect(toastError).not.toHaveBeenCalled();
  });

  it('rethrows errors without toast when no user-facing message exists', async () => {
    const error = { status: 500 };
    const wrapped = withErrorToast(() => Promise.reject(error));

    await expect(wrapped()).rejects.toEqual(error);
    expect(toastError).not.toHaveBeenCalled();
  });
});
