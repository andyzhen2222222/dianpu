import type { Platform, SummaryStats } from '../types';
import { createDefaultSyncSettings } from './syncConfig';

export const summaryStats: SummaryStats = {
  boundStores: 129,
  openedServices: 286,
  expiringSoon: 12,
  expired: 5,
  authAbnormal: 3,
};

export const initialPlatforms: Platform[] = [
  {
    id: 'cdiscount',
    platformName: 'Cdiscount',
    platformLogo: 'C',
    storeCount: 3,
    authStatus: 'normal',
    platformServices: {
      resale: {
        name: 'AI跟卖',
        level: 'platform',
        status: 'active',
        packageName: '月卡',
        expireAt: '2026-06-25',
        quota: '30000商品',
      },
      listing: {
        name: 'AI刊登',
        level: 'platform',
        status: 'active',
        packageName: '季卡',
        expireAt: '2026-08-15',
      },
    },
    stores: [
      {
        id: 'saturn',
        storeName: 'Saturn 土星',
        authStatus: 'normal',
        bindAt: '2026-05-09',
        expireAt: '2026-06-25',
        syncSettings: createDefaultSyncSettings({
          products: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-28 11:21:40',
            detail: '1846 件',
          },
          customerService: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-28 10:55:00',
            detail: '128 会话',
          },
          metrics: { enabled: true, status: 'success', lastSyncAt: '2026-05-28 10:30:00' },
          orders: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-28 11:00:00',
            detail: '56 单',
          },
        }),
        services: {
          repricing: {
            name: 'AI调价',
            level: 'store',
            status: 'active',
            packageName: '月卡',
            expireAt: '2026-06-25',
          },
          customerService: {
            name: '客服',
            level: 'store',
            status: 'active',
            packageName: '季卡',
            expireAt: '2026-08-01',
          },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      },
      {
        id: 'guava',
        storeName: 'Guava 番石榴',
        authStatus: 'normal',
        bindAt: '2026-04-12',
        expireAt: '2026-07-01',
        syncSettings: createDefaultSyncSettings({
          products: {
            enabled: true,
            status: 'failed',
            lastSyncAt: '2026-05-27 09:15:22',
          },
          customerService: { enabled: false, status: 'idle' },
          metrics: { enabled: true, status: 'success', lastSyncAt: '2026-05-27 08:00:00' },
          orders: { enabled: true, status: 'success', lastSyncAt: '2026-05-27 09:00:00', detail: '12 单' },
        }),
        services: {
          repricing: {
            name: 'AI调价',
            level: 'store',
            status: 'active',
            packageName: '月卡',
            expireAt: '2026-07-01',
          },
          customerService: {
            name: '客服',
            level: 'store',
            status: 'not_opened',
          },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      },
      {
        id: 'selead',
        storeName: 'SELEAD Tech',
        authStatus: 'normal',
        bindAt: '2026-03-20',
        expireAt: '2026-06-10',
        syncSettings: createDefaultSyncSettings({
          products: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-26 16:42:08',
            detail: '932 件',
          },
          customerService: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-26 16:30:00',
            detail: '45 会话',
          },
          metrics: { enabled: true, status: 'success', lastSyncAt: '2026-05-26 15:00:00' },
          orders: { enabled: true, status: 'success', lastSyncAt: '2026-05-26 16:00:00', detail: '23 单' },
        }),
        services: {
          repricing: {
            name: 'AI调价',
            level: 'store',
            status: 'expired',
            packageName: '月卡',
            expireAt: '2026-06-10',
          },
          customerService: {
            name: '客服',
            level: 'store',
            status: 'expired',
            packageName: '月卡',
            expireAt: '2026-06-10',
          },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      },
    ],
  },
  {
    id: 'ozon',
    platformName: 'Ozon',
    platformLogo: 'OZ',
    storeCount: 2,
    authStatus: 'normal',
    platformServices: {
      resale: {
        name: 'AI跟卖',
        level: 'platform',
        status: 'expired',
        packageName: '季卡',
        expireAt: '2026-04-10',
      },
      listing: {
        name: 'AI刊登',
        level: 'platform',
        status: 'not_opened',
      },
    },
    stores: [
      {
        id: 'ozon-store-1',
        storeName: 'Ozon 旗舰店',
        authStatus: 'normal',
        bindAt: '2026-02-15',
        expireAt: '2026-07-15',
        syncSettings: createDefaultSyncSettings({
          products: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-25 08:30:00',
            detail: '521 件',
          },
          customerService: { enabled: false, status: 'idle' },
          metrics: { enabled: true, status: 'success', lastSyncAt: '2026-05-25 08:00:00' },
          orders: { enabled: true, status: 'success', lastSyncAt: '2026-05-25 08:15:00', detail: '8 单' },
        }),
        services: {
          repricing: {
            name: 'AI调价',
            level: 'store',
            status: 'active',
            packageName: '月卡',
            expireAt: '2026-07-15',
          },
          customerService: {
            name: '客服',
            level: 'store',
            status: 'not_opened',
          },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      },
      {
        id: 'ozon-store-2',
        storeName: 'Ozon 欧洲站',
        authStatus: 'abnormal',
        bindAt: '2026-01-08',
        expireAt: '2026-06-05',
        syncSettings: createDefaultSyncSettings({
          products: {
            enabled: true,
            status: 'failed',
            lastSyncAt: '2026-05-20 14:22:11',
          },
          customerService: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-20 14:00:00',
            detail: '67 会话',
          },
          metrics: { enabled: false, status: 'idle' },
          orders: { enabled: true, status: 'success', lastSyncAt: '2026-05-20 13:30:00', detail: '5 单' },
        }),
        services: {
          repricing: {
            name: 'AI调价',
            level: 'store',
            status: 'expiring_soon',
            packageName: '月卡',
            expireAt: '2026-06-05',
          },
          customerService: {
            name: '客服',
            level: 'store',
            status: 'active',
            packageName: '月卡',
            expireAt: '2026-08-01',
          },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      },
    ],
  },
  {
    id: 'fnac',
    platformName: 'fnac.fr',
    platformLogo: 'fn',
    storeCount: 2,
    authStatus: 'normal',
    platformServices: {
      resale: {
        name: 'AI跟卖',
        level: 'platform',
        status: 'not_opened',
      },
      listing: {
        name: 'AI刊登',
        level: 'platform',
        status: 'active',
        packageName: '月卡',
        expireAt: '2026-07-20',
      },
    },
    stores: [
      {
        id: 'fnac-store-1',
        storeName: 'fnac 法国站',
        authStatus: 'normal',
        bindAt: '2026-04-01',
        expireAt: '2026-08-01',
        syncSettings: createDefaultSyncSettings({
          products: {
            enabled: false,
            status: 'idle',
          },
          customerService: { enabled: false, status: 'idle' },
          metrics: { enabled: true, status: 'success', lastSyncAt: '2026-05-28 10:00:00' },
          orders: { enabled: true, status: 'success', lastSyncAt: '2026-05-28 09:30:00', detail: '3 单' },
        }),
        services: {
          repricing: {
            name: 'AI调价',
            level: 'store',
            status: 'not_opened',
          },
          customerService: {
            name: '客服',
            level: 'store',
            status: 'not_opened',
          },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      },
      {
        id: 'fnac-store-2',
        storeName: 'fnac 数码专营',
        authStatus: 'normal',
        bindAt: '2026-03-10',
        expireAt: '2026-09-10',
        syncSettings: createDefaultSyncSettings({
          products: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-27 18:45:33',
            detail: '2674 件',
          },
          customerService: {
            enabled: true,
            status: 'success',
            lastSyncAt: '2026-05-27 18:30:00',
            detail: '210 会话',
          },
          metrics: { enabled: true, status: 'success', lastSyncAt: '2026-05-27 18:00:00' },
          orders: { enabled: true, status: 'success', lastSyncAt: '2026-05-27 18:40:00', detail: '89 单' },
        }),
        services: {
          repricing: {
            name: 'AI调价',
            level: 'store',
            status: 'active',
            packageName: '季卡',
            expireAt: '2026-09-10',
          },
          customerService: {
            name: '客服',
            level: 'store',
            status: 'active',
            packageName: '月卡',
            expireAt: '2026-07-20',
          },
          resale: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
          listing: { inheritedFromPlatform: true, storeUsageStatus: 'active' },
        },
      },
    ],
  },
];

export const servicePlans = {
  repricing: [
    { id: '1w', label: '1周/店', price: 139 },
    { id: '1m', label: '1月/店', price: 498 },
    { id: '1q', label: '1季度/店', price: 1098 },
    { id: '1y', label: '1年/店', price: 3888 },
  ],
  customerService: [
    { id: '1m', label: '1月/店', price: 98 },
    { id: '1q', label: '1季度/店', price: 268 },
    { id: '1y', label: '1年/店', price: 998 },
  ],
  resale: [
    { id: '1m', label: '月卡', price: 998 },
    { id: '1q', label: '季卡', price: 2698 },
    { id: '1y', label: '年卡', price: 8998 },
  ],
  listing: [
    { id: '1m', label: '月卡', price: 698 },
    { id: '1q', label: '季卡', price: 1898 },
    { id: '1y', label: '年卡', price: 5998 },
  ],
};
