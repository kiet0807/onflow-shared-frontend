import axios, { CanceledError } from 'axios';

/** Reject duplicate in-flight mutations without legacy axios.Cancel. */
export const createDuplicateRequestError = (message: string) =>
  new CanceledError(message);

export const isRequestCanceled = (error: unknown): boolean =>
  axios.isCancel(error) ||
  (error as { code?: string })?.code === 'ERR_CANCELED' ||
  (error as { name?: string })?.name === 'CanceledError';
