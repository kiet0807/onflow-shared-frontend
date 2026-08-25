import type { AxiosInstance, AxiosResponse } from 'axios';

import type { AddressOption, AddressVersion } from '../../common/types/address.types';

export interface GetWardParams {
  province_id: string | number;
  district_id?: string | number;
  version: AddressVersion;
  keyword?: string;
}

export interface WardItem extends AddressOption {
  ward_name: string;
  province_id: string | number;
  district_id?: string | number;
}

export type WardList = WardItem[];

/**
 * Bind address queries to a host-provided axios instance.
 *
 * Usage:
 * ```ts
 * const addressQueries = createAddressQueries(eInvoiceApi);
 * const res = await addressQueries.getWard({ province_id: 1, version: 'legacy' });
 * ```
 */
export interface AddressQueries {
  getProvince: (_keyword?: string) => Promise<AxiosResponse<AddressOption[]>>;
  getDistrict: (
    _provinceId: string | number,
    _keyword?: string,
  ) => Promise<AxiosResponse<AddressOption[]>>;
  getWard: (_params: GetWardParams) => Promise<AxiosResponse<WardList>>;
}

/**
 * Default implementation that talks to the host's axios instance.
 * Hosts may override individual endpoints by passing a partial impl.
 */
export const createAddressQueries = (
  api: AxiosInstance,
  overrides?: Partial<AddressQueries>,
): AddressQueries => {
  const impl: AddressQueries = {
    getProvince: (keyword = '') =>
      api.get('/api/v1/address/provinces', { params: { keyword } }),
    getDistrict: (provinceId, keyword = '') =>
      api.get('/api/v1/address/districts', {
        params: { province_id: provinceId, keyword },
      }),
    getWard: ({ province_id, district_id, version, keyword = '' }) => {
      const url =
        version === 'current'
          ? '/api/v1/address/wards-by-province'
          : '/api/v1/address/wards';
      return api.get(url, {
        params: {
          province_id,
          ...(district_id !== undefined ? { district_id } : {}),
          version,
          keyword,
        },
      });
    },
  };
  return { ...impl, ...overrides };
};