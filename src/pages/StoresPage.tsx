import {
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Collapse, Input, Select, Space, Table } from 'antd';
import type { CollapseProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PlatformLogo from '../components/PlatformLogo';
import RenewModal, { type RenewContext } from '../components/RenewModal';
import StoreAuthPanel from '../components/store-hub/StoreAuthPanel';
import StoreServicePanel, { serviceLabels } from '../components/store-hub/StoreServicePanel';
import StoreSyncPanel from '../components/store-hub/StoreSyncPanel';
import {
  countEnabledSync,
  getLatestSyncAt,
  hasSyncIssue,
  syncDataTypes,
} from '../components/store-hub/syncHelpers';
import StatusTag from '../components/StatusTag';
import { useStoreModule } from '../context/StoreModuleContext';
import type { Platform, ServiceKey, Store } from '../types';
import { getServiceExpireAt } from '../utils/serviceHelpers';
import {
  resolveInheritedManageState,
  resolveManageState,
} from '../utils/manageState';

type StorePanelKey = 'auth' | 'sync' | 'service';

interface StoreRow {
  key: string;
  platform: Platform;
  store: Store;
}

const stateLegend = [
  { state: '正常', color: '#52c41a' },
  { state: '临期', color: '#fa8c16' },
  { state: '到期', color: '#ff4d4f' },
  { state: '未开通', color: '#d9d9d9' },
] as const;

const panelLabels: Record<StorePanelKey, string> = {
  auth: '授权',
  sync: '数据同步',
  service: '服务管理',
};

function isStorePanelKey(value: string | null): value is StorePanelKey {
  return value === 'auth' || value === 'sync' || value === 'service';
}

function ServiceSummaryDots({ platform, store }: { platform: Platform; store: Store }) {
  const items = (
    [
      ['repricing', resolveManageState(store.services.repricing.status, getServiceExpireAt(platform, store, 'repricing'))],
      ['customerService', resolveManageState(store.services.customerService.status, getServiceExpireAt(platform, store, 'customerService'))],
      ['resale', resolveInheritedManageState(platform.platformServices.resale.status, store.services.resale.storeUsageStatus, getServiceExpireAt(platform, store, 'resale'))],
      ['listing', resolveInheritedManageState(platform.platformServices.listing.status, store.services.listing.storeUsageStatus, getServiceExpireAt(platform, store, 'listing'))],
    ] as const
  ).map(([key, state]) => ({
    key,
    label: serviceLabels[key],
    color:
      state === 'normal' || state === 'expiring'
        ? '#52c41a'
        : state === 'expired'
          ? '#ff4d4f'
          : '#d9d9d9',
  }));

  return (
    <div className="store-hub-service-dots">
      {items.map((item) => (
        <span key={item.key} className="store-hub-service-dot" title={item.label}>
          <span className="store-hub-service-dot-mark" style={{ background: item.color }} />
          <span className="store-hub-service-dot-label">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

export default function StoresPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    platforms,
    platformOptions,
    removeStore,
    updateStoreAuth,
    updateSyncEnabled,
    runStoreSync,
    renewService,
  } = useStoreModule();

  const [platformFilter, setPlatformFilter] = useState<string>();
  const [storeSearch, setStoreSearch] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewCtx, setRenewCtx] = useState<RenewContext | null>(null);

  const panelParam = searchParams.get('panel');
  const activePanel: StorePanelKey | null = isStorePanelKey(panelParam) ? panelParam : null;

  const data: StoreRow[] = useMemo(() => {
    const keyword = storeSearch.trim().toLowerCase();
    return platforms
      .filter((p) => !platformFilter || p.id === platformFilter)
      .flatMap((platform) =>
        platform.stores
          .filter(
            (store) =>
              !keyword || store.storeName.toLowerCase().includes(keyword),
          )
          .map((store) => ({
            key: `${platform.id}-${store.id}`,
            platform,
            store,
          })),
      );
  }, [platforms, platformFilter, storeSearch]);

  useEffect(() => {
    const expandKey = searchParams.get('expand');
    if (expandKey && data.some((row) => row.key === expandKey)) {
      setExpandedRowKeys([expandKey]);
    }
  }, [searchParams, data]);

  const setActivePanel = useCallback(
    (panel: StorePanelKey | null, rowKey?: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (panel) {
          next.set('panel', panel);
        } else {
          next.delete('panel');
        }
        if (rowKey) {
          next.set('expand', rowKey);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const openRenew = (platform: Platform, store: Store, serviceKey: ServiceKey) => {
    setRenewCtx({
      title: '服务续费',
      subtitle: `${platform.platformName} · ${store.storeName} · ${serviceLabels[serviceKey]}`,
      serviceKey,
      platformId: platform.id,
      storeId:
        serviceKey === 'resale' || serviceKey === 'listing' ? null : store.id,
    });
    setRenewOpen(true);
  };

  const goActivate = (serviceKey: ServiceKey) => {
    navigate(`/activate?func=${serviceKey}`);
  };

  const renderExpandedRow = (row: StoreRow) => {
    const collapseItems: CollapseProps['items'] = [
      {
        key: 'auth',
        label: panelLabels.auth,
        children: (
          <StoreAuthPanel
            store={row.store}
            onReauth={() => updateStoreAuth(row.platform.id, row.store.id, 'normal')}
            onUnbind={() => removeStore(row.platform.id, row.store.id)}
          />
        ),
      },
      {
        key: 'sync',
        label: panelLabels.sync,
        children: (
          <StoreSyncPanel
            store={row.store}
            rowKey={row.key}
            onToggle={(key, enabled) =>
              updateSyncEnabled(row.platform.id, row.store.id, key, enabled)
            }
            onSyncAll={() => runStoreSync(row.platform.id, row.store.id)}
            onSyncOne={(key) => runStoreSync(row.platform.id, row.store.id, [key])}
          />
        ),
      },
      {
        key: 'service',
        label: panelLabels.service,
        children: (
          <StoreServicePanel
            platform={row.platform}
            store={row.store}
            onEnable={(serviceKey) => goActivate(serviceKey)}
            onRenew={(serviceKey) => openRenew(row.platform, row.store, serviceKey)}
          />
        ),
      },
    ];

    return (
      <div className="store-hub-expanded">
        <Collapse
          accordion
          bordered={false}
          className="store-hub-collapse"
          activeKey={activePanel ?? undefined}
          onChange={(key) => {
            const nextKey = Array.isArray(key) ? key[0] : key;
            if (nextKey === 'auth' || nextKey === 'sync' || nextKey === 'service') {
              setActivePanel(nextKey, row.key);
            } else {
              setActivePanel(null, row.key);
            }
          }}
          items={collapseItems}
        />
      </div>
    );
  };

  const columns: ColumnsType<StoreRow> = [
    {
      title: '店铺',
      width: 180,
      fixed: 'left',
      render: (_, { store }) => <span className="store-name">{store.storeName}</span>,
    },
    {
      title: '平台',
      width: 150,
      render: (_, { platform }) => (
        <Space size={6}>
          <PlatformLogo
            platformId={platform.id}
            fallback={platform.platformLogo}
            className="platform-logo platform-logo-sm"
          />
          {platform.platformName}
        </Space>
      ),
    },
    {
      title: '授权',
      width: 90,
      align: 'center',
      render: (_, { store }) =>
        store.authStatus === 'normal' ? (
          <StatusTag status="active" label="正常" />
        ) : (
          <StatusTag status="expired" label="异常" />
        ),
    },
    {
      title: '数据同步',
      width: 130,
      render: (_, { store }) => {
        const enabled = countEnabledSync(store);
        const latest = getLatestSyncAt(store);
        return (
          <div className="store-hub-sync-summary">
            <span className={hasSyncIssue(store) ? 'store-hub-sync-warn' : undefined}>
              {enabled}/{syncDataTypes.length} 已开启
            </span>
            {latest && <span className="store-hub-sync-time">{latest.slice(5, 16)}</span>}
          </div>
        );
      },
    },
    {
      title: '服务状态',
      width: 280,
      render: (_, row) => <ServiceSummaryDots platform={row.platform} store={row.store} />,
    },
    {
      title: '绑定时间',
      width: 110,
      render: (_, { store }) => store.bindAt ?? '-',
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="店铺管理"
        subtitle="同一店铺列表，展开后可管理授权、数据同步与服务"
        action={
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate('/auth/add')}
          >
            添加店铺
          </Button>
        }
      />

      <div className="page-section filter-bar-simple store-hub-filter">
        <Select
          placeholder="选择平台"
          allowClear
          style={{ width: 160 }}
          options={platformOptions}
          value={platformFilter}
          onChange={setPlatformFilter}
        />
        <Input
          placeholder="搜索店铺名"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          allowClear
          style={{ width: 220 }}
          value={storeSearch}
          onChange={(e) => setStoreSearch(e.target.value)}
        />
        <Button type="primary" icon={<SearchOutlined />}>
          搜索
        </Button>
        <span className="filter-bar-count">共 {data.length} 家店铺</span>
        <div className="manage-state-legend">
          {stateLegend.map(({ state, color }) => (
            <span key={state} className="manage-legend-item">
              <span className="manage-legend-dot" style={{ background: color }} />
              {state}
            </span>
          ))}
        </div>
      </div>

      <div className="page-section list-section store-hub-table-section">
        <Table
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender: renderExpandedRow,
            expandedRowKeys,
            onExpandedRowsChange: (keys) => {
              const nextKeys = keys as string[];
              setExpandedRowKeys(nextKeys);
              if (nextKeys.length === 1) {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set('expand', nextKeys[0]);
                  return next;
                });
              } else if (nextKeys.length === 0) {
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete('expand');
                  return next;
                });
              }
            },
            rowExpandable: () => true,
          }}
          scroll={{ x: 980 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
          }}
          size="middle"
        />
      </div>

      <RenewModal
        open={renewOpen}
        context={renewCtx}
        onClose={() => setRenewOpen(false)}
        onConfirm={(pkg) => {
          if (!renewCtx) return;
          renewService(
            renewCtx.platformId,
            renewCtx.storeId,
            renewCtx.serviceKey,
            pkg,
          );
        }}
      />
    </div>
  );
}
