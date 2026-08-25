import { useEffect, useState } from 'react';

import { createAddressQueries } from '../queries/address';
import type { AddressOption, AddressVersion } from '../types/address.types';
import { EMPTY_ARRAY } from '../constants';

import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'onflow.address.host.api';

interface CachedApiHost {
  baseURL: string;
  storedAt: number;
}

/**
 * Resolve the host's API base URL — falls back to `'/api'` when no host has
 * registered itself. This lets the shared library talk to the host's axios
 * instance without requiring a React context for every consumer.
 *
 * Hosts should call {@link registerApiHost} once during app bootstrap.
 */
export const registerApiHost = (baseURL: string): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ baseURL, storedAt: Date.now() } satisfies CachedApiHost),
    );
  } catch {
    /* ignore quota errors */
  }
};

const getStoredApiHost = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedApiHost>;
    return parsed.baseURL ?? null;
  } catch {
    return null;
  }
};

export interface UseAddressSelectorResult {
  provinceOptions: AddressOption[];
  districtOptions: AddressOption[];
  wardOptions: AddressOption[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Resolve province/district/ward options for the given selection state.
 *
 * This hook ships a default axios-backed implementation; consumers can wire
 * up their own by passing a host API via {@link registerApiHost}.
 */
export const useAddressSelector = (
  province: AddressOption | null | undefined,
  district: AddressOption | null | undefined,
  version: AddressVersion = 'legacy',
): UseAddressSelectorResult => {
  const [, setStoredHost] = useLocalStorage<CachedApiHost | null>(STORAGE_KEY, null);
  const baseURL = getStoredApiHost() ?? '/api';

  const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<AddressOption[]>([]);
  const [wardOptions, setWardOptions] = useState<AddressOption[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Re-read host if it changes
  useEffect(() => {
    setStoredHost(null);
  }, [setStoredHost]);

  // Load provinces on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // We can't import axios at runtime here (avoid SSR bundling); rely on
        // the host's window.fetch when needed. For dev convenience we lazily
        // build queries from the global axios if present.
        const axiosLib = await import('axios');
        const api = axiosLib.default.create({ baseURL });
        const queries = createAddressQueries(api);
        const res = await queries.getProvince();
        if (!cancelled) setProvinceOptions(res?.data ?? EMPTY_ARRAY);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [baseURL]);

  // Load districts when province changes
  useEffect(() => {
    if (!province?.id) {
      setDistrictOptions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const axiosLib = await import('axios');
        const api = axiosLib.default.create({ baseURL });
        const queries = createAddressQueries(api);
        const res = await queries.getDistrict(province.id);
        if (!cancelled) setDistrictOptions(res?.data ?? EMPTY_ARRAY);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [province?.id, baseURL]);

  // Load wards when district changes (legacy) or province changes (current)
  useEffect(() => {
    const trigger =
      version === 'current' ? province?.id : district?.id;
    if (!trigger) {
      setWardOptions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const axiosLib = await import('axios');
        const api = axiosLib.default.create({ baseURL });
        const queries = createAddressQueries(api);
        const res = await queries.getWard({
          province_id: province?.id ?? '',
          district_id: district?.id,
          version,
        });
        if (!cancelled) setWardOptions(res?.data ?? EMPTY_ARRAY);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [province?.id, district?.id, version, baseURL]);

  return {
    provinceOptions,
    districtOptions,
    wardOptions,
    isLoading,
    error,
  };
};