import type { ReactNode } from 'react';
import type { LabelProps } from 'reactstrap';
import { Label } from 'reactstrap';

export interface RequiredLabelProps extends LabelProps {
  children: ReactNode;
  className?: string;
}

export const RequiredLabel = ({
  children,
  className = 'mt-2',
  ...rest
}: RequiredLabelProps) => (
  <Label className={className} {...rest}>
    {children}
    <span className="text-danger ms-1">*</span>
  </Label>
);
