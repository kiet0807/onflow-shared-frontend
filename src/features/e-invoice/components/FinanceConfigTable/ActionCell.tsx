import { useTranslation } from 'react-i18next';

import type { FinanceConfig } from './types';

interface ActionCellProps {
  item: FinanceConfig;
  onEdit?: (item: FinanceConfig) => void;
  onDelete?: (item: FinanceConfig) => void;
}

export const ActionCell = ({ item, onEdit, onDelete }: ActionCellProps) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex align-items-center justify-content-end gap-2">
      <button
        type="button"
        onClick={() => onEdit?.(item)}
        className="btn btn-sm btn-soft-primary border-0"
      >
        <i className="ri-edit-line me-1" />
        {t('edit')}
      </button>
      <button
        type="button"
        onClick={() => onDelete?.(item)}
        className="btn btn-sm btn-soft-danger border-0"
      >
        <i className="ri-delete-bin-6-line me-1" />
        {t('delete')}
      </button>
    </div>
  );
};
