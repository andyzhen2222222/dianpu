import type { SyncDataItem, SyncDataKey } from '../types';

export const syncDataTypes: {
  key: SyncDataKey;
  label: string;
  hint: string;
  service?: string;
}[] = [
  {
    key: 'products',
    label: '商品数据',
    hint: '调价专用，同步 SKU 与价格',
    service: '调价',
  },
  {
    key: 'customerService',
    label: '客服数据',
    hint: '同步会话与买家消息',
    service: '客服',
  },
  {
    key: 'metrics',
    label: '店铺指标',
    hint: '同步流量、转化等经营指标',
  },
  {
    key: 'orders',
    label: '订单数据',
    hint: '同步订单状态与物流信息',
  },
];

export const syncStatusLabels: Record<SyncDataItem['status'], string> = {
  idle: '未同步',
  syncing: '同步中',
  success: '已同步',
  failed: '失败',
};

export function createDefaultSyncSettings(
  partial?: Partial<Record<SyncDataKey, Partial<SyncDataItem>>>,
): Record<SyncDataKey, SyncDataItem> {
  const base = (item?: Partial<SyncDataItem>): SyncDataItem => ({
    enabled: item?.enabled ?? true,
    status: item?.status ?? 'idle',
    lastSyncAt: item?.lastSyncAt,
    detail: item?.detail,
  });

  return {
    products: base(partial?.products),
    customerService: base(partial?.customerService),
    metrics: base(partial?.metrics),
    orders: base(partial?.orders),
  };
}
