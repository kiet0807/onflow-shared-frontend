import { useTranslation } from 'react-i18next';

import { EMPTY_VALUE } from '../../../../common/constants';

import type { Store } from './types';

interface StoreCellProps {
  stores: Store[];
}

export const StoreCell = ({ stores }: StoreCellProps) => {
  const { t } = useTranslation();

  if (!stores.length) {
    return <span className="text-secondary">{EMPTY_VALUE}</span>;
  }

  return (
    <div className="d-flex flex-column gap-2">
      {stores.map((store) => (
        <div key={store.id} className="d-flex align-items-center gap-2">
          {store.platform_logo ? (
            <img
              src={store.platform_logo}
              alt={store.platform}
              className="rounded"
              style={{ width: 20, height: 20, objectFit: 'cover' }}
            />
          ) : (
            <span
              className="d-flex align-items-center justify-content-center rounded bg-secondary-subtle text-secondary fw-medium"
              style={{ width: 20, height: 20, fontSize: 10 }}
            >
              {store.platform.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="d-flex flex-column">
            <span
              className="fw-medium text-secondary"
              style={{ fontSize: '0.875rem' }}
            >
              {store.name}
            </span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {store.platform} · {t('store')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
