import type { ReactNode } from 'react';

export interface MetricsCardProps {
  icon: string;
  variant: string;
  label: string;
  children: ReactNode;
}

/**
 * Compact metric tile — shares the shared KPI tile visual language
 * (`.kpi-tile` in `_custom-features.scss`).
 */
export const MetricsCard = ({
  icon,
  variant,
  label,
  children,
}: MetricsCardProps) => (
  <div className={`kpi-tile kpi-tile--${variant}`}>
    <div className="kpi-tile__icon">
      <i className={icon} />
    </div>
    <div className="kpi-tile__meta min-w-0">
      <div className="kpi-tile__label text-truncate" title={label}>
        {label}
      </div>
      <div className="kpi-tile__value tabular-nums d-flex align-items-center gap-1 flex-wrap fs-20">
        {children}
      </div>
    </div>
  </div>
);
