/**
 * Runtime configuration for `@onflow/onflow-shared-frontend`.
 *
 * Intentionally framework-agnostic: we do **not** read `import.meta.env` here
 * because that variable is only present in the host app's build pipeline.
 * Hosts should call {@link createAppConfig} (or pass values directly) so the
 * shared library stays portable across Vite, Next.js, CRA, etc.
 */

export type AppMode = 'development' | 'staging' | 'production' | 'test';

export interface AppConfig {
  /** Current environment name. */
  env: string;
  /** Runtime mode (drives i18n / logging defaults). */
  mode: AppMode;
  /** Enable verbose logs and request tracing. */
  debug: boolean;
  /** E-Invoice service base URL (optional — only required if you use `features/e-invoice`). */
  eInvoiceApiBaseUrl?: string;
  /** Default request timeout in milliseconds. */
  apiTimeoutMs: number;
}

export interface CreateAppConfigInput {
  env?: string;
  mode?: AppMode;
  debug?: boolean;
  eInvoiceApiBaseUrl?: string;
  apiTimeoutMs?: number;
}

/**
 * Build a validated {@link AppConfig} from caller-provided values.
 *
 * @example
 * ```ts
 * import { createAppConfig } from '@onflow/onflow-shared-frontend/core/config';
 *
 * export const appConfig = createAppConfig({
 *   env: process.env.NEXT_PUBLIC_APP_ENV,
 *   mode: process.env.NODE_ENV as AppMode,
 *   eInvoiceApiBaseUrl: process.env.NEXT_PUBLIC_EINVOICE_API,
 * });
 * ```
 */
export const createAppConfig = (
  input: CreateAppConfigInput = {},
): AppConfig => ({
  env: input.env ?? 'development',
  mode: input.mode ?? 'development',
  debug: input.debug ?? false,
  eInvoiceApiBaseUrl: input.eInvoiceApiBaseUrl,
  apiTimeoutMs: input.apiTimeoutMs ?? 60_000,
});

/**
 * Convenience helpers for environment-mode checks.
 */
export const isProduction = (mode: AppMode): boolean => mode === 'production';
export const isDevelopment = (mode: AppMode): boolean =>
  mode === 'development' || mode === 'staging';