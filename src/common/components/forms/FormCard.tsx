import type { PropsWithChildren } from 'react';
import { Card, CardBody } from 'reactstrap';

export interface FormCardProps {
  /** Additional CSS classes for the Card wrapper */
  className?: string;
}

/**
 * Reusable card wrapper for form sections.
 * Provides consistent shadow, border, and padding across all features.
 * Stretches inside flex parents (`flex-grow-1`) so nested content can fill
 * remaining column height.
 */
export const FormCard = ({
  children,
  className = '',
}: PropsWithChildren<FormCardProps>) => (
  <Card
    className={`shadow-sm border-0 mb-3 d-flex flex-column rounded-3 ${className}`}
  >
    <CardBody className="p-4 pt-3 flex-grow-1 d-flex flex-column">
      {children}
    </CardBody>
  </Card>
);
