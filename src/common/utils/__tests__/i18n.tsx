/**
 * Test helper for `react-i18next`.
 *
 * Returns a minimal i18next instance configured to resolve the namespaces that
 * shared components expect (`common`, `eInvoice`). All keys fall back to the
 * key string so tests don't have to seed translation bundles.
 */

/* eslint-disable import/no-duplicates */
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';

export const TEST_NAMESPACES = ['common', 'eInvoice'] as const;

export const setupTestI18n = (): typeof i18n => {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      lng: 'en',
      fallbackLng: 'en',
      ns: [...TEST_NAMESPACES],
      defaultNS: 'common',
      resources: {
        en: {
          common: {},
          eInvoice: {},
        },
      },
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
  }
  return i18n;
};

export const TestI18nProvider = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={setupTestI18n()}>{children}</I18nextProvider>
);