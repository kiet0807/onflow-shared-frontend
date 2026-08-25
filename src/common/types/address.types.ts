/**
 * Address option shape consumed by `react-select` and the shared
 * `AddressSelectGroup` component.
 *
 * Two versions are supported:
 * - `legacy`: Vietnam administrative model with province → district → ward.
 * - `current`: Flattened province → ward.
 */
export interface AddressOption {
  id: string | number;
  label: string;
  value: string | number;
  province_id?: string | number;
  district_id?: string | number;
  ward_id?: string | number;
  ward_name?: string;
  district_name?: string;
  province_name?: string;
  version?: 'current' | 'legacy';
}

export type AddressVersion = 'current' | 'legacy';