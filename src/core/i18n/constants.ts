/** Languages bundled by default with `@onflow/onflow-shared-frontend`. */
export const DEFAULT_LANGUAGE = 'vi';

/**
 * Feature namespaces known to this library.
 * Add new feature keys here as the library grows.
 */
export const FEATURES = {
  common: 'common',
} as const;

export type FeatureNamespace = (typeof FEATURES)[keyof typeof FEATURES];