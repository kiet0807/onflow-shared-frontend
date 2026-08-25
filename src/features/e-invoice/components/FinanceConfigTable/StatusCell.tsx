import { useTranslation } from 'react-i18next';

interface StatusCellProps {
  status?: boolean;
}

export const StatusCell = ({ status }: StatusCellProps) => {
  const { t } = useTranslation();

  if (status) {
    return (
      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1">
        <i className="ri-checkbox-circle-line me-1" />
        {t('active')}
      </span>
    );
  }

  return (
    <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-2 py-1">
      <i className="ri-close-circle-line me-1" />
      {t('inactive')}
    </span>
  );
};
