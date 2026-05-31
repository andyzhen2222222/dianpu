import { syncDataTypes } from '../../data/syncConfig';
import type { Store, SyncDataItem } from '../../types';
import { syncStatusLabel, syncStatusTone, type HubStatusTone } from './hubStyles';

export function getLatestSyncAt(store: Store): string | undefined {
  const times = Object.values(store.syncSettings)
    .map((item) => item.lastSyncAt)
    .filter(Boolean) as string[];
  if (times.length === 0) return undefined;
  return times.sort((a, b) => b.localeCompare(a))[0];
}

export function countEnabledSync(store: Store): number {
  return Object.values(store.syncSettings).filter((item) => item.enabled).length;
}

export function hasSyncIssue(store: Store): boolean {
  return Object.values(store.syncSettings).some(
    (item) => item.enabled && item.status === 'failed',
  );
}

export function getSyncDisplayState(item: SyncDataItem): {
  label: string;
  tone: HubStatusTone;
  subtitle?: string;
} {
  if (!item.enabled) {
    return {
      label: '已关闭',
      tone: 'muted',
      subtitle: '同步已关闭，开启后可手动同步',
    };
  }
  if (item.status === 'failed') {
    return {
      label: syncStatusLabel(item.status),
      tone: syncStatusTone(item.status),
      subtitle: '同步失败，请检查授权后重试',
    };
  }
  if (item.status === 'idle') {
    return {
      label: syncStatusLabel(item.status),
      tone: syncStatusTone(item.status),
      subtitle: '已开启，点击同步拉取最新数据',
    };
  }
  return {
    label: syncStatusLabel(item.status),
    tone: syncStatusTone(item.status),
  };
}

export { syncDataTypes };
