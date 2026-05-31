import { useState } from 'react';
import { syncDataTypes } from '../../data/syncConfig';
import type { Store, SyncDataKey } from '../../types';
import HubItemRow, { HubItemList } from './HubItemRow';
import { getSyncDisplayState } from './syncHelpers';
import { formatShortDate, type HubAction } from './hubStyles';

interface StoreSyncPanelProps {
  store: Store;
  rowKey: string;
  onToggle: (key: SyncDataKey, enabled: boolean) => void;
  onSyncAll: () => Promise<void>;
  onSyncOne: (key: SyncDataKey) => Promise<void>;
}

export default function StoreSyncPanel({
  store,
  rowKey,
  onToggle,
  onSyncAll,
  onSyncOne,
}: StoreSyncPanelProps) {
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingItemKey, setSyncingItemKey] = useState<string>();

  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      await onSyncAll();
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSyncOne = async (syncKey: SyncDataKey, itemKey: string) => {
    setSyncingItemKey(itemKey);
    try {
      await onSyncOne(syncKey);
    } finally {
      setSyncingItemKey(undefined);
    }
  };

  const buildSyncActions = (
    syncKey: SyncDataKey,
    itemKey: string,
    enabled: boolean,
    isSyncing: boolean,
  ): HubAction[] => {
    const actions: HubAction[] = [];

    if (enabled) {
      actions.push({
        key: 'disable',
        label: '关闭',
        onClick: () => onToggle(syncKey, false),
      });
      actions.push({
        key: 'sync',
        label: '同步',
        primary: true,
        disabled: isSyncing,
        loading: isSyncing,
        onClick: () => handleSyncOne(syncKey, itemKey),
      });
    } else {
      actions.push({
        key: 'enable',
        label: '开启',
        primary: true,
        onClick: () => onToggle(syncKey, true),
      });
    }

    return actions;
  };

  const toolbarActions: HubAction[] = [
    {
      key: 'sync-all',
      label: '立即同步全部',
      primary: true,
      loading: syncingAll,
      onClick: handleSyncAll,
    },
  ];

  return (
    <div className="store-hub-panel store-hub-sync-panel">
      <div className="hub-panel-toolbar">
        <span className="hub-panel-toolbar-hint">
          配置商品、客服、指标、订单等数据的同步开关
        </span>
        <div className="hub-actions hub-panel-toolbar-actions">
          {toolbarActions.map((action) => (
            <button
              key={action.key}
              type="button"
              className={`hub-action-link primary ${action.loading ? 'loading' : ''}`}
              disabled={action.loading}
              onClick={action.onClick}
            >
              {action.loading ? `${action.label}…` : action.label}
            </button>
          ))}
        </div>
      </div>
      <HubItemList>
        {syncDataTypes.map((type) => {
          const item = store.syncSettings[type.key];
          const itemKey = `${rowKey}-${type.key}`;
          const isSyncing = item.status === 'syncing' || syncingItemKey === itemKey;
          const display = getSyncDisplayState(item);
          const statusMeta = [
            item.enabled && item.lastSyncAt
              ? formatShortDate(item.lastSyncAt) ?? item.lastSyncAt
              : null,
            item.enabled ? item.detail : null,
          ].filter(Boolean) as string[];

          return (
            <HubItemRow
              key={type.key}
              title={type.label}
              tag={type.service}
              subtitle={display.subtitle ?? type.hint}
              statusLabel={display.label}
              statusTone={display.tone}
              statusMeta={statusMeta.length > 0 ? statusMeta : undefined}
              actions={buildSyncActions(type.key, itemKey, item.enabled, isSyncing)}
            />
          );
        })}
      </HubItemList>
    </div>
  );
}
