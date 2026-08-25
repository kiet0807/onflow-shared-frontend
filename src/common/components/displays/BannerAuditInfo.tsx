import { EMPTY_VALUE } from '../../../common/constants';
import type { AuditUser } from '../../../types/common.types';

export interface BannerAuditInfoProps {
  creator?: AuditUser | null;
  updater?: AuditUser | null;
  creatorLabel: string;
  updaterLabel: string;
  className?: string;
}

/**
 * Creator / updater emails on dark detail banners.
 * Renders `---` when the audit user is missing.
 */
export const BannerAuditInfo = ({
  creator,
  updater,
  creatorLabel,
  updaterLabel,
  className = 'd-flex flex-wrap align-items-center gap-1.5 my-1.5 fs-13',
}: BannerAuditInfoProps) => (
  <div className={className}>
    <span className="d-inline-flex align-items-center gap-1">
      <span className="text-white-50">{creatorLabel}:</span>
      <span className="text-white fw-medium">
        {creator?.email || EMPTY_VALUE}
      </span>
    </span>
    <span className="text-white-50 opacity-50">|</span>
    <span className="d-inline-flex align-items-center gap-1">
      <span className="text-white-50">{updaterLabel}:</span>
      <span className="text-white fw-medium">
        {updater?.email || EMPTY_VALUE}
      </span>
    </span>
  </div>
);
