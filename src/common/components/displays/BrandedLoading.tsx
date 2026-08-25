import { useTranslation } from 'react-i18next';

import { RouteStatusBrand } from './RouteStatusBrand';

type BrandedLoadingProps = {
  /** Compact variant for in-layout / in-panel Suspense (no full-viewport chrome). */
  embedded?: boolean;
};

/**
 * Shared branded loading state — logo + spinner panel.
 * Use full-page for route Suspense; `embedded` for layout/panel loaders.
 */
export const BrandedLoading = ({ embedded = false }: BrandedLoadingProps) => {
  const { t } = useTranslation('common');
  const label = t('common.loading', 'Đang tải...');

  return (
    <div
      className={`route-status-page route-status-page--loading${
        embedded ? ' route-status-page--embedded' : ''
      }`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {!embedded ? (
        <div className="route-status-page__glow" aria-hidden="true" />
      ) : null}
      <div className="route-status-page__content">
        <RouteStatusBrand />
        <div className="route-status-page__panel route-status-page__panel--loading">
          <div className="route-status-page__spinner" aria-hidden="true" />
          <p className="route-status-page__loading-text mb-0">{label}</p>
        </div>
      </div>
    </div>
  );
};
