export type ProductSyncStatus = 'idle' | 'syncing' | 'success' | 'failed';

export type StoreRuntimeStatus = 'normal' | 'expiring' | 'expired' | 'abnormal';

export type AuthStatus = 'normal' | 'abnormal';

export type ServiceStatus =
  | 'active'
  | 'paused'
  | 'not_opened'
  | 'expired'
  | 'expiring_soon';

export type StoreUsageStatus = 'active' | 'paused';

export type ServiceLevel = 'store' | 'platform';

export type ServiceKey = 'repricing' | 'customerService' | 'resale' | 'listing';

export interface PlatformService {
  name: string;
  level: 'platform';
  status: ServiceStatus;
  packageName?: string;
  expireAt?: string;
  quota?: string;
}

export interface StoreService {
  name: string;
  level: 'store';
  status: ServiceStatus;
  packageName?: string;
  expireAt?: string;
}

export interface InheritedService {
  inheritedFromPlatform: true;
  storeUsageStatus: StoreUsageStatus;
}

export interface Store {
  id: string;
  storeName: string;
  authStatus: AuthStatus;
  bindAt?: string;
  lastSyncAt?: string;
  productCount?: number;
  productSyncStatus?: ProductSyncStatus;
  expireAt?: string;
  services: {
    repricing: StoreService;
    customerService: StoreService;
    resale: InheritedService;
    listing: InheritedService;
  };
}

export interface Platform {
  id: string;
  platformName: string;
  platformLogo: string;
  storeCount: number;
  authStatus: AuthStatus;
  platformServices: {
    resale: PlatformService;
    listing: PlatformService;
  };
  stores: Store[];
}

export interface SummaryStats {
  boundStores: number;
  openedServices: number;
  expiringSoon: number;
  expired: number;
  authAbnormal: number;
}

export interface PlanOption {
  id: string;
  label: string;
  price: number;
}

export interface DrawerContext {
  platform: Platform;
  store?: Store;
  focusService?: ServiceKey;
  mode?: 'open' | 'renew' | 'detail';
}

export type ViewMode = 'group' | 'flat';

export interface FilterValues {
  platform?: string;
  service?: ServiceKey;
  status?: ServiceStatus | 'auth_abnormal';
  storeName?: string;
}
