import type { AxiosRequestHeaders } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateApiInstanceOptions {
  baseURL: string;
  system?: string;
  timeout?: number;
  debug?: boolean;
  defaultHeaders?: AxiosRequestHeaders | Record<string, string>;
}