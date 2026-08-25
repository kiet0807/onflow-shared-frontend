import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { ApiError, CreateApiInstanceOptions } from './types';

export * from './types';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept-Language': 'vi',
  'X-Country': 'VN',
} as const;

export const createApiInstance = (
  options: CreateApiInstanceOptions,
): AxiosInstance => {
  const {
    baseURL,
    system = 'app',
    timeout = 60_000,
    debug = false,
    defaultHeaders: headerOverrides,
  } = options;

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      ...DEFAULT_HEADERS,
      'X-System': system,
      ...headerOverrides,
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.debug(
          `[API] ${config.method?.toUpperCase()} ${config.url}`,
        );
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error) => {
      const payload = error?.response?.data;

      if (debug) {
        // eslint-disable-next-line no-console
        console.error('[API Error]', payload || error.message);
      }

      const message =
        payload?.messages ??
        payload?.message ??
        payload?.error?.message ??
        error?.message ??
        'Request failed';

      const apiError: ApiError = {
        message: String(message),
        status: error?.response?.status ?? 0,
        data: payload,
      };

      return Promise.reject(apiError);
    },
  );

  return instance;
};

export const setAuthToken = (api: AxiosInstance, token: string | null): void => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `NH ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const setLanguage = (api: AxiosInstance, lang = 'vi'): void => {
  api.defaults.headers.common['Accept-Language'] = lang;
};

export type { AxiosInstance } from 'axios';