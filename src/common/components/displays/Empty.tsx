import { useTranslation } from 'react-i18next';
import { FolderSearchIcon } from 'lucide-react';

export const Empty = ({ title }: { title?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="noresult">
      <div className="text-center">
        <FolderSearchIcon
          size={40}
          className="text-muted mb-2 opacity-50"
          strokeWidth={1.5}
        />
        <p className="text-muted opacity-75 mb-0">
          {title || t('common.noData')}
        </p>
      </div>
    </div>
  );
};
