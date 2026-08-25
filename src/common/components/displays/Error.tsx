import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

/**
 * Error state component.
 * Replaces OMS version that used lord-icon.
 */
export const Error = ({ title }: { title?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="noresult">
      <div className="text-center">
        <AlertCircle size={48} className="text-danger mb-2" />
        <h5 className="mt-2">{title || t('common.error')}</h5>
      </div>
    </div>
  );
};
