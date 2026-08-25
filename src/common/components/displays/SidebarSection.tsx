import type { ReactNode } from 'react';
import { Card, CardBody } from 'reactstrap';

import { SectionHeader } from './SectionHeader';

export interface SidebarSectionProps {
  icon: string;
  title: string;
  bgColor?: string;
  children: ReactNode;
}

export const SidebarSection = ({
  icon,
  title,
  bgColor,
  children,
}: SidebarSectionProps) => (
  <Card className="shadow-sm border-0 mb-3 animate-fade-in rounded-3">
    <CardBody className="p-3">
      <SectionHeader icon={icon} title={title} bgColor={bgColor} />
      {children}
    </CardBody>
  </Card>
);
