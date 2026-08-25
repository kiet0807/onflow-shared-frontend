/**
 * i18n runtime for `@onflow/onflow-shared-frontend`.
 *
 * Design goals:
 * - **Don't fight the host app.** We expose a singleton i18next instance but
 *   never auto-init when one already exists.
 * - **Lazy feature bundles.** Hosts call `registerFeatureResources(ns, vi, en)`
 *   to merge our locale files at boot, then import components as usual.
 * - **Namespace hygiene.** Resources live under per-feature namespaces
 *   (`common`, `eInvoice`, ...). The host picks the default namespace.
 */

import { initReactI18next } from 'react-i18next';
import i18next, { type i18n as I18nInstance } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { DEFAULT_LANGUAGE } from './constants';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  builtInResources,
  type Locale,
  type ResourceBundle,
} from './resources';

const isBrowser = typeof window !== 'undefined';

const STORAGE_KEY = 'i18nextLng';

/**
 * Default namespaces provided by this library, registered out of the box.
 * Hosts may register more at runtime via {@link registerFeatureResources}.
 */
export const DEFAULT_NAMESPACES = ['common'] as const;

/**
 * Initialize the shared i18next instance.
 *
 * Safe to call multiple times — subsequent calls are no-ops once i18next is
 * already initialized. Hosts can still mutate the singleton via
 * `i18next.on`, `i18next.changeLanguage`, etc.
 *
 * @param options.lng         Initial language (defaults to localStorage / vi).
 * @param options.ns          Extra namespaces to register upfront.
 * @param options.fallbackLng Languages to fall back to when a key is missing.
 * @param options.detector    Whether to enable browser language detection.
 */
export interface InitializeI18nOptions {
  lng?: Locale | string;
  ns?: readonly string[];
  fallbackLng?: readonly Locale[];
  detector?: boolean;
  debug?: boolean;
}

export const initializeI18n = (
  options: InitializeI18nOptions = {}
): I18nInstance => {
  if (i18next.isInitialized) return i18next;

  const initialLng =
    options.lng ??
    (isBrowser ? window.localStorage.getItem(STORAGE_KEY) : null) ??
    DEFAULT_LOCALE;

  const namespaces = [...DEFAULT_NAMESPACES, ...(options.ns ?? [])];

  const detector = options.detector === false ? null : LanguageDetector;
  const init = detector ? i18next.use(detector) : i18next;
  init.use(initReactI18next).init({
    lng: initialLng,
    fallbackLng: options.fallbackLng ?? [DEFAULT_LANGUAGE],
    defaultNS: DEFAULT_NAMESPACES[0],
    ns: namespaces,
    debug: options.debug ?? false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  return i18next;
};

/**
 * Merge a feature's locale bundles into the running i18next instance.
 * No-op if i18next has not been initialized yet.
 */
export const registerFeatureResources = (
  namespace: string,
  resources: ResourceBundle
): void => {
  if (!i18next.isInitialized) return;
  Object.entries(resources).forEach(([lng, bundle]) => {
    i18next.addResourceBundle(lng, namespace, bundle, true, true);
  });
};

/**
 * Helper for `<I18nextProvider>` wiring in host apps.
 */
export const getI18nInstance = (): I18nInstance => i18next;

export { SUPPORTED_LOCALES, builtInResources };
export type { Locale, ResourceBundle };
