import { message } from 'antd';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { initialPlatforms } from '../data/mockData';
import { findPlatformCatalog } from '../data/platformCatalog';
import type { Platform, ServiceKey, Store } from '../types';

function updateStoreInPlatforms(
  platforms: Platform[],
  platformId: string,
  storeId: string,
  updater: (store: Store) => Store,
): Platform[] {
  return platforms.map((p) => {
    if (p.id !== platformId) return p;
    return {
      ...p,
      stores: p.stores.map((s) => (s.id === storeId ? updater(s) : s)),
    };
  });
}

interface StoreModuleContextValue {
  platforms: Platform[];
  platformOptions: { label: string; value: string }[];
  bindStore: (values: Record<string, string>) => string;
  removeStore: (platformId: string, storeId: string) => void;
  updateStoreAuth: (platformId: string, storeId: string, status: Store['authStatus']) => void;
  syncStoreProducts: (platformId: string, storeId: string) => Promise<void>;
  handlePlatformAction: (
    platformId: string,
    service: 'resale' | 'listing',
    action: string,
  ) => void;
  handleStoreAction: (
    platformId: string,
    storeId: string,
    service: ServiceKey,
    action: string,
  ) => void;
  activatePlatformService: (
    platformId: string,
    service: 'resale' | 'listing',
    packageName: string,
  ) => void;
  activateStoreService: (
    platformId: string,
    storeId: string,
    service: 'repricing' | 'customerService',
    packageName: string,
  ) => void;
  activateSuperMember: (
    platformId: string,
    storeId: string,
    packageName: string,
  ) => void;
  renewService: (
    platformId: string,
    storeId: string | null,
    service: ServiceKey,
    packageName: string,
  ) => void;
}

const StoreModuleContext = createContext<StoreModuleContextValue | null>(null);

export function StoreModuleProvider({ children }: { children: ReactNode }) {
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);

  const platformOptions = useMemo(
    () => platforms.map((p) => ({ label: p.platformName, value: p.id })),
    [platforms],
  );

  const bindStore = useCallback((values: Record<string, string>) => {
    const platformId = values.platform;
    const storeId = `store-${Date.now()}`;
    setPlatforms((prev) => {
      const exists = prev.find((p) => p.id === platformId);
      const newStore: Store = {
        id: storeId,
        storeName: values.storeName,
        authStatus: 'normal',
        bindAt: new Date().toISOString().slice(0, 10),
        lastSyncAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        productCount: 0,
        productSyncStatus: 'idle',
        services: {
          repricing: { name: 'AI调价', level: 'store', status: 'not_opened' },
          customerService: { name: '客服', level: 'store', status: 'not_opened' },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      };

      if (exists) {
        return prev.map((p) =>
          p.id === platformId
            ? {
                ...p,
                stores: [...p.stores, newStore],
                storeCount: p.storeCount + 1,
              }
            : p,
        );
      }

      const catalog = findPlatformCatalog(platformId);
      const newPlatform: Platform = {
        id: platformId,
        platformName: catalog?.name ?? platformId,
        platformLogo: catalog?.logo ?? platformId.slice(0, 2).toUpperCase(),
        storeCount: 1,
        authStatus: 'normal',
        platformServices: {
          resale: { name: 'AI跟卖', level: 'platform', status: 'not_opened' },
          listing: { name: 'AI刊登', level: 'platform', status: 'not_opened' },
        },
        stores: [newStore],
      };
      return [...prev, newPlatform];
    });
    return storeId;
  }, []);

  const removeStore = useCallback((platformId: string, storeId: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              stores: p.stores.filter((s) => s.id !== storeId),
              storeCount: Math.max(0, p.storeCount - 1),
            }
          : p,
      ),
    );
    message.success('已解除店铺绑定');
  }, []);

  const updateStoreAuth = useCallback(
    (platformId: string, storeId: string, status: Store['authStatus']) => {
      setPlatforms((prev) =>
        updateStoreInPlatforms(prev, platformId, storeId, (store) => ({
          ...store,
          authStatus: status,
        })),
      );
    },
    [],
  );

  const syncStoreProducts = useCallback(
    async (platformId: string, storeId: string) => {
      let authAbnormal = false;
      setPlatforms((prev) => {
        const store = prev
          .find((p) => p.id === platformId)
          ?.stores.find((s) => s.id === storeId);
        authAbnormal = store?.authStatus === 'abnormal';
        return updateStoreInPlatforms(prev, platformId, storeId, (s) => ({
          ...s,
          productSyncStatus: 'syncing',
        }));
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPlatforms((prev) =>
        updateStoreInPlatforms(prev, platformId, storeId, (store) => {
          const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
          return {
            ...store,
            productSyncStatus: authAbnormal ? 'failed' : 'success',
            productCount: authAbnormal
              ? store.productCount ?? 0
              : (store.productCount ?? 0) + Math.floor(Math.random() * 80) + 20,
            lastSyncAt: now,
          };
        }),
      );

      if (authAbnormal) {
        message.error('商品同步失败，请检查店铺授权');
      } else {
        message.success('商品同步完成');
      }
    },
    [],
  );

  const handlePlatformAction = useCallback(
    (platformId: string, service: 'resale' | 'listing', action: string) => {
      setPlatforms((prev) =>
        prev.map((p) => {
          if (p.id !== platformId) return p;
          const svc = p.platformServices[service];
          let newStatus = svc.status;
          if (action === 'pause') newStatus = 'paused';
          if (action === 'resume') newStatus = 'active';
          message.success(
            action === 'pause' ? `${svc.name} 已暂停` : `${svc.name} 已恢复`,
          );
          return {
            ...p,
            platformServices: {
              ...p.platformServices,
              [service]: { ...svc, status: newStatus },
            },
          };
        }),
      );
    },
    [],
  );

  const handleStoreAction = useCallback(
    (
      platformId: string,
      storeId: string,
      service: ServiceKey,
      action: string,
    ) => {
      setPlatforms((prev) =>
        updateStoreInPlatforms(prev, platformId, storeId, (store) => {
          const next = { ...store, services: { ...store.services } };

          if (service === 'repricing' || service === 'customerService') {
            const svc = { ...next.services[service] };
            if (action === 'pause') svc.status = 'paused';
            if (action === 'resume') svc.status = 'active';
            next.services[service] = svc;
          }

          if (service === 'resale' || service === 'listing') {
            const inherited = { ...next.services[service] };
            if (action === 'pause') inherited.storeUsageStatus = 'paused';
            if (action === 'resume') inherited.storeUsageStatus = 'active';
            next.services[service] = inherited;
          }

          return next;
        }),
      );
    },
    [],
  );

  const getExpireDate = (packageName: string) => {
    const expireAt = new Date();
    expireAt.setMonth(
      expireAt.getMonth() +
        (packageName.includes('季') ? 3 : packageName.includes('年') ? 12 : 1),
    );
    return expireAt.toISOString().slice(0, 10);
  };

  const activatePlatformService = useCallback(
    (platformId: string, service: 'resale' | 'listing', packageName: string) => {
      setPlatforms((prev) =>
        prev.map((p) => {
          if (p.id !== platformId) return p;
          const svc = p.platformServices[service];
          return {
            ...p,
            platformServices: {
              ...p.platformServices,
              [service]: {
                ...svc,
                status: 'active',
                packageName,
                expireAt: getExpireDate(packageName),
              },
            },
          };
        }),
      );
    },
    [],
  );

  const activateStoreService = useCallback(
    (
      platformId: string,
      storeId: string,
      service: 'repricing' | 'customerService',
      packageName: string,
    ) => {
      setPlatforms((prev) =>
        updateStoreInPlatforms(prev, platformId, storeId, (store) => ({
          ...store,
          services: {
            ...store.services,
            [service]: {
              ...store.services[service],
              status: 'active',
              packageName,
              expireAt: getExpireDate(packageName),
            },
          },
        })),
      );
    },
    [],
  );

  const activateSuperMember = useCallback(
    (platformId: string, storeId: string, packageName: string) => {
      const expireStr = getExpireDate(packageName);
      setPlatforms((prev) =>
        prev.map((p) => {
          if (p.id !== platformId) return p;
          return {
            ...p,
            platformServices: {
              resale: {
                ...p.platformServices.resale,
                status: 'active',
                packageName,
                expireAt: expireStr,
              },
              listing: {
                ...p.platformServices.listing,
                status: 'active',
                packageName,
                expireAt: expireStr,
              },
            },
            stores: p.stores.map((s) =>
              s.id !== storeId
                ? s
                : {
                    ...s,
                    services: {
                      ...s.services,
                      repricing: {
                        ...s.services.repricing,
                        status: 'active',
                        packageName,
                        expireAt: expireStr,
                      },
                      customerService: {
                        ...s.services.customerService,
                        status: 'active',
                        packageName,
                        expireAt: expireStr,
                      },
                      resale: {
                        ...s.services.resale,
                        storeUsageStatus: 'active',
                      },
                      listing: {
                        ...s.services.listing,
                        storeUsageStatus: 'active',
                      },
                    },
                  },
            ),
          };
        }),
      );
      message.success('超级会员开通成功，全部功能已激活');
    },
    [],
  );

  const renewService = useCallback(
    (
      platformId: string,
      storeId: string | null,
      service: ServiceKey,
      packageName: string,
    ) => {
      const expireAt = new Date();
      expireAt.setMonth(expireAt.getMonth() + (packageName.includes('季') ? 3 : packageName.includes('年') ? 12 : 1));
      const expireStr = expireAt.toISOString().slice(0, 10);

      if (service === 'resale' || service === 'listing') {
        activatePlatformService(platformId, service, packageName);
        return;
      }

      if (storeId) {
        setPlatforms((prev) =>
          updateStoreInPlatforms(prev, platformId, storeId, (store) => ({
            ...store,
            services: {
              ...store.services,
              [service]: {
                ...store.services[service as 'repricing' | 'customerService'],
                status: 'active',
                packageName,
                expireAt: expireStr,
              },
            },
          })),
        );
        message.success('续费成功');
      }
    },
    [activatePlatformService],
  );

  const value = useMemo(
    () => ({
      platforms,
      platformOptions,
      bindStore,
      removeStore,
      updateStoreAuth,
      syncStoreProducts,
      handlePlatformAction,
      handleStoreAction,
      activatePlatformService,
      activateStoreService,
      activateSuperMember,
      renewService,
    }),
    [
      platforms,
      platformOptions,
      bindStore,
      removeStore,
      updateStoreAuth,
      syncStoreProducts,
      handlePlatformAction,
      handleStoreAction,
      activatePlatformService,
      activateStoreService,
      activateSuperMember,
      renewService,
    ],
  );

  return (
    <StoreModuleContext.Provider value={value}>
      {children}
    </StoreModuleContext.Provider>
  );
}

export function useStoreModule() {
  const ctx = useContext(StoreModuleContext);
  if (!ctx) throw new Error('useStoreModule must be used within StoreModuleProvider');
  return ctx;
}
