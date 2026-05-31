export type ValueAddedType = 'points' | 'storage';

export type PaymentMethod = 'wechat' | 'balance' | 'points';

export interface ResourcePointPackage {
  id: string;
  points: number;
  price: number;
  description: string;
}

export interface StorageCapacityOption {
  id: string;
  label: string;
  priceBase: number;
}

export interface StorageDurationOption {
  id: string;
  label: string;
  multiplier: number;
}

export const resourcePointPackages: ResourcePointPackage[] = [
  {
    id: '1000pts',
    points: 1000,
    price: 10,
    description: '1000点资源包，可用来抵扣AI相关功能',
  },
  {
    id: '5000pts',
    points: 5000,
    price: 45,
    description: '5000点资源包，可用来抵扣AI相关功能',
  },
  {
    id: '10000pts',
    points: 10000,
    price: 80,
    description: '10000点资源包，可用来抵扣AI相关功能',
  },
];

export const storageCapacities: StorageCapacityOption[] = [
  { id: '200m', label: '200M', priceBase: 10 },
  { id: '1000m', label: '1000M', priceBase: 40 },
];

export const storageDurations: StorageDurationOption[] = [
  { id: '30d', label: '30天', multiplier: 1 },
  { id: '90d', label: '90天', multiplier: 2.5 },
  { id: '360d', label: '360天', multiplier: 8 },
];

export function calcStoragePrice(capacityId: string, durationId: string): number {
  const cap = storageCapacities.find((c) => c.id === capacityId);
  const dur = storageDurations.find((d) => d.id === durationId);
  if (!cap || !dur) return 0;
  return Math.round(cap.priceBase * dur.multiplier * 100) / 100;
}

export const accountBalanceMock = {
  balance: 356562.91,
  points: 1280.5,
};

export const paymentMethodOptions: { key: PaymentMethod; label: string }[] = [
  { key: 'wechat', label: '微信支付' },
  { key: 'balance', label: '账户余额' },
  { key: 'points', label: '积分' },
];
