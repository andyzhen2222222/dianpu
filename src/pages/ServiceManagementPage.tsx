import { Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManageServiceCell from '../components/ManageServiceCell';
import PageHeader from '../components/PageHeader';
import RenewModal, { type RenewContext } from '../components/RenewModal';
import { useStoreModule } from '../context/StoreModuleContext';
import type { Platform, ServiceKey, Store } from '../types';
import { getServiceExpireAt } from '../utils/serviceHelpers';
import {
  resolveInheritedManageState,
  resolveManageState,
} from '../utils/manageState';

interface ManageRow {
  key: string;
  platform: Platform;
  store: Store;
}

const serviceLabels: Record<ServiceKey, string> = {
  repricing: '调价',
  customerService: '客服',
  resale: '跟卖',
  listing: '刊登',
};

const stateLegend = [
  { state: '正常', color: '#52c41a' },
  { state: '临期', color: '#fa8c16' },
  { state: '到期', color: '#ff4d4f' },
  { state: '暂停', color: '#bfbfbf' },
] as const;

export default function ServiceManagementPage() {
  const navigate = useNavigate();
  const { platforms, platformOptions, handleStoreAction, renewService } =
    useStoreModule();
  const [platformFilter, setPlatformFilter] = useState<string>();
  const [renewOpen, setRenewOpen] = useState(false);
  const [renewCtx, setRenewCtx] = useState<RenewContext | null>(null);

  const data: ManageRow[] = useMemo(
    () =>
      platforms
        .filter((p) => !platformFilter || p.id === platformFilter)
        .flatMap((platform) =>
          platform.stores.map((store) => ({
            key: `${platform.id}-${store.id}`,
            platform,
            store,
          })),
        ),
    [platforms, platformFilter],
  );

  const openRenew = (
    platform: Platform,
    store: Store,
    serviceKey: ServiceKey,
  ) => {
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

  const renderStoreServiceCell = (
    platform: Platform,
    store: Store,
    serviceKey: 'repricing' | 'customerService',
  ) => {
    const svc = store.services[serviceKey];
    const expireAt = getServiceExpireAt(platform, store, serviceKey);
    const manageState = resolveManageState(svc.status, expireAt);

    return (
      <ManageServiceCell
        manageState={manageState}
        expireAt={expireAt}
        onEnable={() => {
          if (manageState === 'not_opened') {
            goActivate(serviceKey);
          } else {
            handleStoreAction(platform.id, store.id, serviceKey, 'resume');
          }
        }}
        onPause={() =>
          handleStoreAction(platform.id, store.id, serviceKey, 'pause')
        }
        onRenew={() => openRenew(platform, store, serviceKey)}
      />
    );
  };

  const renderInheritedServiceCell = (
    platform: Platform,
    store: Store,
    serviceKey: 'resale' | 'listing',
  ) => {
    const platformSvc = platform.platformServices[serviceKey];
    const inherited = store.services[serviceKey];
    const expireAt = getServiceExpireAt(platform, store, serviceKey);
    const manageState = resolveInheritedManageState(
      platformSvc.status,
      inherited.storeUsageStatus,
      expireAt,
    );

    return (
      <ManageServiceCell
        manageState={manageState}
        expireAt={expireAt}
        onEnable={() => {
          if (manageState === 'not_opened') {
            goActivate(serviceKey);
          } else {
            handleStoreAction(platform.id, store.id, serviceKey, 'resume');
          }
        }}
        onPause={() =>
          handleStoreAction(platform.id, store.id, serviceKey, 'pause')
        }
        onRenew={() => openRenew(platform, store, serviceKey)}
      />
    );
  };

  const columns: ColumnsType<ManageRow> = [
    {
      title: '店铺',
      width: 150,
      fixed: 'left',
      render: (_, { platform, store }) => (
        <div>
          <div className="store-name">{store.storeName}</div>
          <div className="flat-store-platform">{platform.platformName}</div>
        </div>
      ),
    },
    {
      title: '调价',
      width: 128,
      align: 'center',
      render: (_, { platform, store }) =>
        renderStoreServiceCell(platform, store, 'repricing'),
    },
    {
      title: '客服',
      width: 128,
      align: 'center',
      render: (_, { platform, store }) =>
        renderStoreServiceCell(platform, store, 'customerService'),
    },
    {
      title: '跟卖',
      width: 128,
      align: 'center',
      render: (_, { platform, store }) =>
        renderInheritedServiceCell(platform, store, 'resale'),
    },
    {
      title: '刊登',
      width: 128,
      align: 'center',
      render: (_, { platform, store }) =>
        renderInheritedServiceCell(platform, store, 'listing'),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="服务管理"
        subtitle="查看各功能状态，支持开启、暂停与续费"
      />

      <div className="page-section filter-bar-simple">
        <Select
          placeholder="筛选平台"
          allowClear
          style={{ width: 160 }}
          options={platformOptions}
          value={platformFilter}
          onChange={setPlatformFilter}
        />
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

      <div className="page-section list-section manage-table-section">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 20, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 760 }}
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
