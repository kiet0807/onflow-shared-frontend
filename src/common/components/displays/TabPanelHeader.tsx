import type { ReactNode } from 'react';
import classNames from 'classnames';

export interface TabPanelHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * TabPanelHeader — reusable header for vertical tab panels and side panels.
 * Icon avatar + title/subtitle on the left, optional action on the right.
 */
export const TabPanelHeader = ({
  icon,
  title,
  subtitle,
  action,
  className,
}: TabPanelHeaderProps) => (
  <div
    className={classNames(
      'd-flex align-items-center justify-content-between flex-column flex-sm-row gap-3 mb-3 mt-0.5 border-bottom pb-3',
      className,
    )}
  >
    <div className="d-flex align-items-center gap-2">
      <div className="avatar-sm flex-shrink-0 rounded-3.5 overflow-hidden hover-scale shadow-sm">
        <span className="avatar-title op-brand-surface text-white fs-20 fw-medium">
          <i className={icon}></i>
        </span>
      </div>
      <div>
        <h6 className="fs-15 fw-bold mb-1">{title}</h6>
        {subtitle && <p className="text-muted fs-13 mb-0">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);
