export interface Store {
  id: number;
  name: string;
  platform_logo: string | null;
  platform: string;
  finance_config: {
    is_active: boolean;
    order_status: string[];
    provider_account_id: string;
    finance_platform_integration_id: number;
  };
}

export interface FinancePlatform {
  id: number;
  name: string;
  prefix: string;
  description: string;
  logo: string | null;
  rating: number;
}

export interface PublicInfo {
  account_id: string;
  provider_code: string;
}

export interface FinanceConfig {
  id: number;
  country: string;
  config: Record<string, unknown>;
  platform: string;
  refresh_token: string | null;
  refresh_expired_time: number;
  expired_time: number;
  access_token: string | null;
  public_info: PublicInfo;
  is_active: boolean;
  is_delete: boolean;
  is_default: boolean;
  created_time: number;
  updated_time: number;
  user: number;
  business: number;
  finance_platform: FinancePlatform;
  stores: Store[];

  /** Computed display fields */
  invoiceChannel: string;
  status: boolean;
  channelCreatedAt: string;
  channelUpdatedAt: string;
}
