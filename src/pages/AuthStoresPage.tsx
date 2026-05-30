import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useStoreModule } from '../context/StoreModuleContext';
import type { Platform, Store } from '../types';

interface AuthStoreRow {
  key: string;
  platform: Platform;
  store: Store;
}

export default function AuthStoresPage() {
  const navigate = useNavigate();
  const { platforms, platformOptions, removeStore, updateStoreAuth } =
    useStoreModule();
  const [platformFilter, setPlatformFilter] = useState<string>();

  const data: AuthStoreRow[] = useMemo(() => {
    return platforms
      .filter((p) => !platformFilter || p.id === platformFilter)
      .flatMap((platform) =>
        platform.stores.map((store) => ({
          key: `${platform.id}-${store.id}`,
          platform,
          store,
        })),
      );
  }, [platforms, platformFilter]);

  const columns: ColumnsType<AuthStoreRow> = [
    {
      title: '平台',
      width: 130,
      render: (_, { platform }) => (
        <Space>
          <span className="platform-logo platform-logo-sm">{platform.platformLogo}</span>
          {platform.platformName}
        </Space>
      ),
    },
    {
      title: '店铺名称',
      dataIndex: ['store', 'storeName'],
      width: 160,
    },
    {
      title: '授权状态',
      width: 110,
      render: (_, { store }) =>
        store.authStatus === 'normal' ? (
          <Tag color="success">授权正常</Tag>
        ) : (
          <Tag color="error">授权异常</Tag>
        ),
    },
    {
      title: '绑定时间',
      width: 120,
      render: (_, { store }) => store.bindAt ?? '-',
    },
    {
      title: '最近同步',
      width: 170,
      render: (_, { store }) => store.lastSyncAt ?? '-',
    },
    {
      title: '操作',
      width: 200,
      render: (_, { platform, store }) => (
        <Space size={0}>
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
      </div>

      <div className="page-section list-section">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 20, showTotal: (t) => `共 ${t} 条` }}
          size="middle"
        />
      </div>
    </div>
  );
}
