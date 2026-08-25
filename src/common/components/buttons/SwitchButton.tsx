import { forwardRef } from 'react';
import type { InputProps } from 'reactstrap';
import { Input, Spinner } from 'reactstrap';

export interface SwitchButtonProps extends Omit<InputProps, 'size'> {
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
  /** Swaps the switch for a spinner while the change is being saved. */
  isLoading?: boolean;
}

/**
 * SwitchButton — Bootstrap toggle switch.
 * @param {string} color - Bootstrap color
 * @param {string} size - Switch size (sm/md)
 * @param {string} className
 * @param {boolean} isLoading - Show a spinner instead of the switch
 */
const SwitchButtonInner = (
  {
    color = 'primary',
    className = '',
    size = 'sm',
    isLoading = false,
    ...rest
  }: SwitchButtonProps,
  ref: React.Ref<HTMLInputElement>,
) => {
  // The `form-switch` wrapper is indented by its own padding, so the spinner
  // replaces it entirely to stay where the switch was.
  if (isLoading) {
    return <Spinner size="sm" color={color} />;
  }

  return (
    <div className={`form-switch form-switch-${color} form-switch-${size}`}>
      <Input
        {...rest}
        innerRef={ref}
        className={`form-check-input cursor-pointer ${className}`}
        type="checkbox"
        role="switch"
      />
    </div>
  );
};

SwitchButtonInner.displayName = 'SwitchButton';

export const SwitchButton = forwardRef(SwitchButtonInner);
