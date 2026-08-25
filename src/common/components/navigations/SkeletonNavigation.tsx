import { NavItem, NavLink } from 'reactstrap';

export interface SkeletonNavigationProps {
  count?: number;
  className?: string;
}

/**
 * SkeletonNavigation — Placeholder skeleton for navigation items.
 * @param {number} count - Number of skeleton items to render (default: 6)
 */
export const SkeletonNavigation = ({
  count = 6,
  className = '',
}: SkeletonNavigationProps) => {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <NavItem key={i} className={className}>
          <NavLink className="placeholder-glow" disabled>
            <span className="placeholder rounded skeleton-nav__item" />
          </NavLink>
        </NavItem>
      ))}
    </>
  );
};
