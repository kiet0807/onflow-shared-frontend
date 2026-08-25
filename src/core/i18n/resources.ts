/**
 * Locale registry & lazy loaders.
 *
 * Hosts may import individual locale files to keep initial bundles slim:
 *
 * ```ts
 * import vi from '@onflow/onflow-shared-frontend/common/locales/vi.json';
 * import en from '@onflow/onflow-shared-frontend/common/locales/en.json';
 * registerFeatureResources('common', { vi, en });
 * ```
 */

import commonEN from '../../common/locales/en.json';
import commonVI from '../../common/locales/vi.json';

export const SUPPORTED_LOCALES = ['vi', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'vi';

export type ResourceBundle = Partial<Record<Locale, Record<string, unknown>>>;

/**
 * Default common namespace resources.
 */
export const builtInResources: Record<string, ResourceBundle> = {
  common: {
    vi: commonVI,
    en: commonEN,
  },
};
