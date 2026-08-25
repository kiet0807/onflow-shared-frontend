import { toast } from 'react-toastify';

import { isRequestCanceled } from './request-cancel';

/** Extract user-facing message from API/interceptor reject payloads. */
export const getApiErrorMessage = (error: unknown): string | undefined => {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return undefined;
};

/**
 * Wraps an async function so that any thrown error is
 * displayed via `toast.error` before being re-thrown.
 *
 * Designed for react-query `queryFn` wrappers.
 *
 * @example
 * useQuery({ queryFn: withErrorToast(() => fetchItems(params)) })
 */
export const withErrorToast =
  <T>(fn: (...args: unknown[]) => Promise<T>) =>
  async (...args: unknown[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error: unknown) {
      const apiError = error as {
        code?: string;
        isHandled?: boolean;
        message?: string;
      };

      if (
        isRequestCanceled(error) ||
        apiError?.code === 'AUTH_EXPIRED' ||
        apiError?.isHandled
      ) {
        throw error;
      }

      const message = getApiErrorMessage(error);
      if (message) {
        toast.error(message);
      }
      throw error;
    }
  };
