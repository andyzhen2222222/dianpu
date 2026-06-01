import type {
  InheritedService,
  Platform,
  PlatformService,
  ServiceKey,
  ServiceStatus,
  Store,
  StoreRuntimeStatus,
  StoreService,
} from '../types';

export const storeStatusLabels: Record<ServiceStatus, string> = {
  active: '已开通',
  not_opened: '未开通',
  expired: '已过期',
  expiring_soon: '快到期',
};

export function getInheritedDisplay(
  platformService: PlatformService,
  _inherited: InheritedService,
): { label: string; status: ServiceStatus } {
  if (platformService.status === 'not_opened') {
    return { label: '平台未开通', status: 'not_opened' };
  }
  if (platformService.status === 'expired') {
    return { label: '平台已过期', status: 'expired' };
  }
  return { label: '继承平台 · 开启', status: 'active' };
}

export function getServiceExpireAt(
  platform: Platform,
  store: Store,
  service: ServiceKey,
): string | undefined {
  if (service === 'repricing' || service === 'customerService') {
    return store.services[service].expireAt;
  }
  return platform.platformServices[service].expireAt;
}

export function getStorePrimaryExpireAt(store: Store): string {
  const dates = [
    store.services.repricing.expireAt,
    store.services.customerService.expireAt,
  ].filter(Boolean) as string[];
  if (dates.length === 0) return '-';
  return dates.sort()[0];
}

export function isExpiredDate(date?: string): boolean {
  if (!date) return false;
  return new Date(date) < new Date('2026-05-30');
}

export function isExpiringSoonDate(date?: string, withinDays = 7): boolean {
  if (!date) return false;
  const now = new Date('2026-05-30');
  const target = new Date(date);
  const diff = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= withinDays;
}

export function getStoreRuntimeStatus(store: Store): StoreRuntimeStatus {
  if (store.authStatus === 'abnormal') return 'abnormal';
  const expireAt = store.expireAt ?? getStorePrimaryExpireAt(store);
  if (expireAt === '-') return 'normal';
  if (isExpiredDate(expireAt)) return 'expired';
  if (isExpiringSoonDate(expireAt)) return 'expiring';
  return 'normal';
}

export function filterPlatforms(
  platforms: Platform[],
  filters: {
    platform?: string;
    service?: ServiceKey;
    status?: ServiceStatus | 'auth_abnormal';
    storeName?: string;
  },
): Platform[] {
  return platforms
    .filter((p) => !filters.platform || p.id === filters.platform)
    .map((platform) => {
      let stores = platform.stores;

      if (filters.storeName) {
        const keyword = filters.storeName.toLowerCase();
        stores = stores.filter((s) =>
          s.storeName.toLowerCase().includes(keyword),
        );
      }

      if (filters.status === 'auth_abnormal') {
        stores = stores.filter((s) => s.authStatus === 'abnormal');
      }

      if (filters.service && filters.status && filters.status !== 'auth_abnormal') {
        stores = stores.filter((store) => {
          const svc = store.services[filters.service!];
          if ('status' in svc) {
            return (svc as StoreService).status === filters.status;
          }
          const platformSvc = platform.platformServices[filters.service as 'resale' | 'listing'];
          if (filters.status === 'active') {
            return platformSvc.status === 'active';
          }
          return platformSvc.status === filters.status;
        });
      }

      if (filters.storeName || filters.status) {
        return { ...platform, stores, storeCount: stores.length };
      }
      return platform;
    })
    .filter((p) => {
      if (filters.storeName || (filters.status && filters.status !== 'auth_abnormal')) {
        return p.stores.length > 0;
      }
      return true;
    });
}
