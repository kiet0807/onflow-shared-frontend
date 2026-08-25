/**
 * Root public surface of `@onflow/onflow-shared-frontend`.
 *
 * Most consumers should deep-import from a sub-path (better tree-shaking):
 *
 * ```ts
 * import { useLocalStorage } from '@onflow/onflow-shared-frontend/common/hooks';
 * import { FinanceConfigTable } from '@onflow/onflow-shared-frontend/features/e-invoice';
 * ```
 *
 * This barrel intentionally re-exports only a curated set of cross-cutting
 * utilities so accidental imports don't pull a giant chunk into your app.
 */

export {
  createAppConfig,
  isProduction,
  isDevelopment,
  type AppConfig,
  type AppMode,
  type CreateAppConfigInput,
} from './core/config/env';

export {
  initializeI18n,
  registerFeatureResources,
  getI18nInstance,
  DEFAULT_NAMESPACES,
  SUPPORTED_LOCALES,
  builtInResources,
  type InitializeI18nOptions,
  type Locale,
  type ResourceBundle,
} from './core/i18n';

export {
  createApiInstance,
  setAuthToken,
  setLanguage,
} from './core/api';
