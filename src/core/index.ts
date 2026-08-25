/**
 * Cross-cutting infra: runtime config, i18n bootstrap, axios factories.
 *
 * Hosts typically import from specific sub-paths (e.g. `./api`) to keep
 * tree-shaking clean.
 */

export * from './api';
export * from './config/env';
export * from './i18n';