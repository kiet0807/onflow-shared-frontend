import { memo } from 'react';
import { Badge, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import { SkeletonNavigation } from './SkeletonNavigation';

export interface TabListItem {
  value: string;
  label: string;
  count?: number | null;
  icon?: string;
}

export interface UnderlineTabsProps {
  activeTab: string | number;
  onTabChange: (_value: string) => void;
  tabList: TabListItem[];
  isLoading?: boolean;
  themeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const UnderlineTabsInner = ({
  activeTab,
  onTabChange,
  tabList = [],
  isLoading = false,
  themeColor = 'secondary',
  className = '',
}: UnderlineTabsProps) => {
  return (
    <Nav
      className={classnames(
        'nav-tabs nav-tabs-custom border-bottom-0 custom-underline-tabs gap-1',
        `tabs-${themeColor}`,
        className,
      )}
      role="tablist"
    >
      {isLoading ? (
        <SkeletonNavigation />
      ) : (
        tabList?.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <NavItem key={tab.value}>
              <NavLink
                className={classnames(
                  'cursor-pointer d-flex align-items-center gap-2 hover-scale',
                  {
                    'active fw-semibold': isActive,
                    'text-muted fw-medium': !isActive,
                  },
                )}
                onClick={() => onTabChange && onTabChange(tab.value)}
                role="tab"
              >
                {tab.icon && <i className={`${tab.icon} fs-16`} />}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count !== null && (
                  <Badge
                    color={isActive ? themeColor : 'light'}
                    className={classnames('tab-badge rounded-pill border', {
                      'text-muted': !isActive,
                    })}
                  >
                    {tab.count}
                  </Badge>
                )}
              </NavLink>
            </NavItem>
          );
        })
      )}
    </Nav>
  );
};

export const UnderlineTabs = memo(UnderlineTabsInner);
