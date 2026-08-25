import type { ReactNode } from 'react';
import { Children, memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  TabContent,
  TabPane,
} from 'reactstrap';
import classnames from 'classnames';

export interface VerticalTabItem {
  key: string | number;
  title?: string;
  icon?: string;
  render?: () => ReactNode;
  content?: ReactNode;
}

export interface VerticalTabsProps {
  tabs?: VerticalTabItem[];
  activeKey: string | number;
  onChange?: (_tab: VerticalTabItem) => void;
  children?: ReactNode;
  menuTitle?: string;
}

const VerticalTabsInner = ({
  tabs = [],
  activeKey,
  onChange,
  children,
  menuTitle,
}: VerticalTabsProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const childrenArray = Children.toArray(children);

  const handleSelect = useCallback(
    (tab: VerticalTabItem) => {
      if (onChange) onChange(tab);
    },
    [onChange],
  );

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const renderContent = (tab: VerticalTabItem, idx: number) => {
    if (typeof tab.render === 'function') return tab.render();
    if (tab.content !== undefined) return tab.content;
    return childrenArray[idx] || null;
  };

  return (
    <Card className="h-100 mb-0 vertical-tabs rounded-3">
      <CardBody className="p-0">
        <div className="vertical-tabs__layout d-flex flex-column flex-lg-row g-0 h-100 position-relative">
          <div
            className={classnames('tabs-column tabs-column--nav border-end', {
              'tabs-column--collapsed': !isOpen,
            })}
          >
            <div className="p-3 position-sticky top-0 tabs-nav-panel">
              <div
                className={classnames('d-flex align-items-center mb-3', {
                  'justify-content-between': isOpen,
                  'justify-content-center': !isOpen,
                })}
              >
                {isOpen && (
                  <h6 className="mb-0 text-muted fw-semibold text-uppercase fs-12 tabs-menu-title">
                    {menuTitle || t('common.manage', 'Quản lý')}
                  </h6>
                )}

                <div
                  className="cursor-pointer text-muted d-flex align-items-center justify-content-center rounded-circle tabs-toggle-btn"
                  onClick={toggleSidebar}
                  title={
                    isOpen
                      ? t('common.collapse', 'Thu gọn')
                      : t('common.expand', 'Mở rộng')
                  }
                >
                  <i
                    className={
                      isOpen
                        ? 'ri-arrow-left-s-line fs-16'
                        : 'ri-arrow-right-s-line fs-16'
                    }
                  />
                </div>
              </div>

              <ListGroup className="rounded-0 border-0 bg-transparent">
                {tabs.map((tab) => {
                  const isActive = activeKey === tab.key;
                  return (
                    <ListGroupItem
                      tag="button"
                      key={tab.key}
                      onClick={() => handleSelect(tab)}
                      className={classnames(
                        'list-group-item-action border-0 d-flex align-items-center gap-2 mb-1 tabs-list-item rounded-2.5',
                        {
                          'tabs-list-item--active bg-secondary bg-opacity-10 text-primary fw-semibold':
                            isActive,
                          'tabs-list-item--inactive bg-transparent': !isActive,
                          'justify-content-center px-0': !isOpen,
                        },
                      )}
                      title={tab.title ? t(tab.title) : String(tab.key)}
                    >
                      {tab.icon && (
                        <div className="tabs-list-item__icon fw-normal bg-secondary-subtle d-flex align-items-center justify-content-center flex-shrink-0 avatar-xxs rounded-2">
                          <i
                            className={classnames(tab.icon, {
                              'fs-16': !isOpen,
                              'fs-14': isOpen,
                            })}
                          />
                        </div>
                      )}
                      {isOpen && (
                        <span className="mb-0 text-truncate fs-14">
                          {tab.title ? t(tab.title) : tab.key}
                        </span>
                      )}
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            </div>
          </div>

          <div className="tabs-column tabs-column--content flex-grow-1 min-w-0">
            <div className="p-3 h-100 tabs-content-panel" key={activeKey}>
              <TabContent activeTab={activeKey} className="h-100">
                {tabs.map((tab, idx) => (
                  <TabPane tabId={tab.key} key={tab.key} className="h-100">
                    {activeKey === tab.key && renderContent(tab, idx)}
                  </TabPane>
                ))}
              </TabContent>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export const VerticalTabs = memo(VerticalTabsInner);
