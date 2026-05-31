import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Input, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PlatformLogo from '../components/PlatformLogo';
import { useStoreModule } from '../context/StoreModuleContext';
import type { Platform, ProductSyncStatus, Store } from '../types';
import {
  getStoreRuntimeStatus,
  isExpiredDate,
  isExpiringSoonDate,
} from '../utils/serviceHelpers';

interface AuthStoreRow {
  key: string;
  platform: Platform;
  store: Store;
}

const syncStatusMap: Record<
  ProductSyncStatus,
  { label: string; icon: ReactNode; className: string }
> = {
  idle: { label: '未同步', icon: <MinusCircleOutlined />, className: 'idle' },
  syncing: { label: '同步中', icon: <SyncOutlined spin />, className: 'syncing' },
  success: { label: '同步完成', icon: <CheckCircleOutlined />, className: 'success' },
  failed: { label: '同步失败', icon: <CloseCircleOutlined />, className: 'failed' },
};

const storeStatusMap = {
  normal: { label: '正常', icon: <CheckCircleOutlined />, className: 'normal' },
  expiring: { label: '临期', icon: <ClockCircleOutlined />, className: 'expiring' },
  expired: { label: '到期', icon: <CloseCircleOutlined />, className: 'expired' },
  abnormal: { label: '异常', icon: <ExclamationCircleOutlined />, className: 'abnormal' },
} as const;

export default function AuthStoresPage() {
  const navigate = useNavigate();
  const { platforms, platformOptions, removeStore, updateStoreAuth, syncStoreProducts } =
    useStoreModule();
  const [platformFilter, setPlatformFilter] = useState<string>();
  const [storeSearch, setStoreSearch] = useState('');
  const [syncingKey, setSyncingKey] = useState<string>();

  const data: AuthStoreRow[] = useMemo(() => {
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

  const handleSync = async (platformId: string, storeId: string, rowKey: string) => {
    setSyncingKey(rowKey);
    try {
      await syncStoreProducts(platformId, storeId);
    } finally {
      setSyncingKey(undefined);
    }
  };

  const columns: ColumnsType<AuthStoreRow> = [
    {
      title: '店铺名',
      dataIndex: ['store', 'storeName'],
      width: 150,
      fixed: 'left',
    },
    {
      title: '所属平台',
      width: 140,
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
      title: '商品数量',
      width: 100,
      align: 'center',
      render: (_, { store }) => (
        <span className="auth-store-product-count">{store.productCount ?? 0}</span>
      ),
    },
    {
      title: '状态',
      width: 120,
      align: 'center',
      render: (_, { store }) => {
        const syncStatus = store.productSyncStatus ?? 'idle';
        const syncMeta = syncStatusMap[syncStatus];
        const runtime = getStoreRuntimeStatus(store);
        const storeMeta = storeStatusMap[runtime];
        const needRenew = runtime === 'expired' || runtime === 'expiring';
        return (
          <div className="auth-store-status-cell">
            <div className="auth-store-status-icons">
              <Tooltip title={`店铺：${storeMeta.label}`}>
                <span
                  className={`auth-store-status-icon store-${storeMeta.className}`}
                  aria-label={`店铺${storeMeta.label}`}
                >
                  <ShopOutlined />
                </span>
              </Tooltip>
              <Tooltip title={`同步：${syncMeta.label}`}>
                <span
                  className={`auth-store-status-icon sync-${syncMeta.className}`}
                  aria-label={`同步${syncMeta.label}`}
                >
                  {syncMeta.icon}
                </span>
              </Tooltip>
            </div>
            {needRenew && (
              <Button
                type="primary"
                size="small"
                className="auth-store-renew-btn"
                onClick={() => navigate('/activate?func=repricing')}
              >
                续费
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: '上次同步时间',
      width: 170,
      render: (_, { store }) => store.lastSyncAt ?? '-',
    },
    {
      title: '绑定时间',
      width: 120,
      sorter: (a, b) =>
        (a.store.bindAt ?? '').localeCompare(b.store.bindAt ?? ''),
      render: (_, { store }) => store.bindAt ?? '-',
    },
    {
      title: '到期时间',
      width: 120,
      render: (_, { store }) => {
        const expireAt = store.expireAt ?? '-';
        if (expireAt === '-') return '-';
        const expired = isExpiredDate(expireAt);
        const expiring = isExpiringSoonDate(expireAt);
        return (
          <span
            className={
              expired || expiring ? 'auth-store-expire-warn' : undefined
            }
          >
            {expireAt}
          </span>
        );
      },
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      render: (_, { platform, store, key }) => (
        <Space size={0} wrap>
          <Button
            type="link"
            size="small"
            icon={<SyncOutlined spin={syncingKey === key} />}
            loading={syncingKey === key}
            onClick={() => handleSync(platform.id, store.id, key)}
          >
            同步商品
          </Button>
          <Button
            type="link"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => updateStoreAuth(platform.id, store.id, 'normal')}
          >
            重新授权
          </Button>
          <Popconfirm
            title="确认解除绑定？"
            onConfirm={() => removeStore(platform.id, store.id)}
          >
            <Button type="link" size="small" danger>
              解除绑定
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="授权店铺"
        subtitle="管理已绑定店铺，新增绑定请添加店铺"
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

      <div className="page-section filter-bar-simple auth-store-filter">
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
      </div>

      <div className="page-section list-section">
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1180 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
          }}
          size="middle"
        />
      </div>
    </div>
  );
}
