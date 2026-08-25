import { logo } from '../../../assets/images';

/** Onflow logo mark for full-page status surfaces (loading / 404 / error). */
export const RouteStatusBrand = () => (
  <div className="route-status-page__brand">
    <img src={logo} alt="Onflow" className="route-status-page__brand-logo" />
  </div>
);
