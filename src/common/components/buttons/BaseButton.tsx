import type { ButtonProps } from 'reactstrap';
import { Button, Spinner } from 'reactstrap';

export interface BaseButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const BaseButton = ({
  isLoading = false,
  disabled,
  children,
  className = '',
  ...rest
}: BaseButtonProps) => {
  // Soft-square default; skip when caller already sets a radius utility
  // (e.g. `rounded-circle`) so custom `!important` radii don't clash.
  const hasRadiusUtility = /\brounded\b/.test(className);
  const radiusClass = hasRadiusUtility ? '' : 'rounded-2';

  return (
    <Button
      disabled={disabled || isLoading}
      className={`hover-scale ${radiusClass} ${className}`.trim()}
      {...rest}
    >
      {isLoading && <Spinner size="sm" className="flex-shrink-0 me-2" />}
      {children}
    </Button>
  );
};
