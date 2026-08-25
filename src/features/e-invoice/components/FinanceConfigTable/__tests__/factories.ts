import type { FinanceConfig } from '../types';

const basePlatform = {
  id: 1,
  name: 'SInvoice',
  prefix: 'sinv',
  description: 'S-Invoice integration',
  logo: null,
  rating: 4.5,
};

export const makeFinanceConfig = (
  overrides: Partial<FinanceConfig> = {},
): FinanceConfig => ({
  id: 1,
  country: 'VN',
  config: {},
  platform: 'sinv',
  refresh_token: null,
  refresh_expired_time: 0,
  expired_time: 0,
  access_token: null,
  public_info: { account_id: 'acct_1', provider_code: 'SINV' },
  is_active: true,
  is_delete: false,
  is_default: false,
  created_time: 1_700_000_000,
  updated_time: 1_700_000_000,
  user: 1,
  business: 1,
  finance_platform: basePlatform,
  stores: [
    {
      id: 10,
      name: 'Saigon Store',
      platform_logo: null,
      platform: 'shopee',
      finance_config: {
        is_active: true,
        order_status: ['paid'],
        provider_account_id: 'sp_1',
        finance_platform_integration_id: 1,
      },
    },
  ],
  invoiceChannel: 'SInvoice',
  status: true,
  channelCreatedAt: '2024-01-01 00:00:00',
  channelUpdatedAt: '2024-01-01 00:00:00',
  ...overrides,
});

export const makeStore = (overrides: Partial<FinanceConfig['stores'][number]> = {}) => ({
  id: 10,
  name: 'Saigon Store',
  platform_logo: null,
  platform: 'shopee',
  finance_config: {
    is_active: true,
    order_status: ['paid'],
    provider_account_id: 'sp_1',
    finance_platform_integration_id: 1,
  },
  ...overrides,
});