/**
 * Audit user metadata used across detail banners and audit logs.
 */
export interface AuditUser {
  id?: string | number;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
}

/**
 * Generic pagination params shared by all paginated APIs.
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

/**
 * Common API envelope used by Onflow backends.
 */
export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  meta?: Pagination & Record<string, unknown>;
}