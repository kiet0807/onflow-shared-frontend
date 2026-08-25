import { Fragment, useMemo } from 'react';
import {
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledButtonDropdown,
} from 'reactstrap';
import { ChevronDown } from 'lucide-react';

import { BaseButton } from './BaseButton';

/**
 * DropdownButton — dropdown with a flat list of actions.
 * @param {Object} props
 * @param {string} props.size - Button size (sm/md/lg)
 * @param {string} props.label - Button label
 * @param {string} props.color - Bootstrap color
 * @param {Array} props.actions - List of {key, title, icon, onClick, disabled, hidden, className}
 * @param {boolean} props.disabled
 * @param {string} props.className
 * @param {boolean} props.displayIcon - Show chevron icon
 * @param {string} props.direction - Dropdown direction (up, down, start, end)
 */
export type DropdownDirection = 'up' | 'down' | 'start' | 'end';

export interface DropdownAction {
  key?: string | number;
  title: React.ReactNode;
  icon?: string;
  onClick?: (_event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
}

export interface DropdownButtonProps {
  size?: 'sm' | 'md' | 'lg' | string;
  label?: React.ReactNode;
  color?: string;
  actions?: DropdownAction[];
  disabled?: boolean;
  className?: string;
  displayIcon?: boolean;
  direction?: DropdownDirection;
}

export const DropdownButton = ({
  size = 'md',
  label = '',
  color = 'primary',
  actions = [],
  disabled = false,
  className = '',
  displayIcon = false,
  direction = 'down',
}: DropdownButtonProps) => {
  const hiddenButton = useMemo(
    () => !actions.length || actions.every((action) => action.hidden),
    [actions],
  );

  return (
    <ButtonGroup hidden={hiddenButton}>
      <UncontrolledButtonDropdown direction={direction}>
        <DropdownToggle tag="div" disabled={disabled}>
          <BaseButton
            disabled={disabled}
            size={size}
            color={color}
            className={`d-flex gap-1 align-items-center ${className}`}
          >
            {label}
            {displayIcon && <ChevronDown size={16} />}
          </BaseButton>
        </DropdownToggle>
        <DropdownMenu container="body">
          {actions.map((action, index) => (
            <Fragment key={action.key || index}>
              {!action.hidden && (
                <DropdownItem
                  className={`d-flex align-items-center gap-2 ${action.className || ''}`}
                  onClick={action.onClick}
                  disabled={action.disabled}
                >
                  {action.icon && <i className={action.icon} />}
                  {action.title}
                </DropdownItem>
              )}
            </Fragment>
          ))}
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    </ButtonGroup>
  );
};
