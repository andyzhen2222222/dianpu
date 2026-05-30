import { Button, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ServiceStatusChip from './ServiceStatusChip';
import type { DrawerContext, Platform, ServiceKey, Store } from '../types';
import {
  getInheritedDisplay,
  getStorePrimaryExpireAt,
  isExpiredDate,
} from '../utils/serviceHelpers';

interface FlatStoreRow {
  key: string;
  platform: Platform;
  store: Store;
}

interface FlatStoreTableProps {
  platforms: Platform[];
  onOpenDrawer: (ctx: DrawerContext) => void;
  onStoreAction: (
    platformId: string,
    storeId: string,
    service: ServiceKey,
    action: string,
  ) => void;
}

function StoreInfoCell({ platform, store }: { platform: Platform; store: Store }) {
  const authOk = store.authStatus === 'normal';
  return (
    <div className="flat-store-info">
      <div className="flat-store-info-main">
        <span className="platform-logo platform-logo-sm">{platform.platformLogo}</span>
        <div className="flat-store-info-text">
          <span className="flat-store-name">{store.storeName}</span>
          <span className="flat-store-platform">{platform.platformName}</span>
        </div>
      </div>
      <Tooltip title={authOk ? '授权正常' : '授权异常'}>
        <span className={`flat-auth-dot ${authOk ? 'ok' : 'err'}`} />
      </Tooltip>
    </div>
  );
}

function ServiceOverviewCell({
  platform,
  store,
  onOpenDrawer,
}: {
  platform: Platform;
  store: Store;
  onOpenDrawer: (ctx: DrawerContext) => void;
}) {
  const resale = getInheritedDisplay(
    platform.platformServices.resale,
    store.services.resale,
  );
  const listing = getInheritedDisplay(
    platform.platformServices.listing,
    store.services.listing,
  );

  const open = (focusService: ServiceKey) =>
    onOpenDrawer({ platform, store, focusService, mode: 'detail' });

  return (
    <div className="service-overview">
      <ServiceStatusChip
        serviceName="调价"
        status={store.services.repricing.status}
        onClick={() => open('repricing')}
      />
      <ServiceStatusChip
        serviceName="客服"
        status={store.services.customerService.status}
        onClick={() => open('customerService')}
      />
      <ServiceStatusChip
        serviceName="跟卖"
        status={resale.status}
        label={resale.label}
        onClick={() => open('resale')}
      />
      <ServiceStatusChip
        serviceName="刊登"
        status={listing.status}
        label={listing.label}
        onClick={() => open('listing')}
      />
    </div>
  );
}

export default function FlatStoreTable({
  platforms,
  onOpenDrawer,
}: FlatStoreTableProps) {
  const data: FlatStoreRow[] = platforms.flatMap((platform) =>
    platform.stores.map((store) => ({
      key: `${platform.id}-${store.id}`,
      platform,
      store,
    })),
  );

  const columns: ColumnsType<FlatStoreRow> = [
    {
      title: '店铺',
      width: 220,
      fixed: 'left',
      render: (_, { platform, store }) => (
        <StoreInfoCell platform={platform} store={store} />
      ),
    },
    {
      title: '服务状态',
      render: (_, { platform, store }) => (
        <ServiceOverviewCell
          platform={platform}
          store={store}
          onOpenDrawer={onOpenDrawer}
        />
      ),
    },
    {
      title: '最近到期',
      width: 120,
      align: 'center',
      render: (_, { store }) => {
        const date = getStorePrimaryExpireAt(store);
        return (
          <span className={isExpiredDate(date) ? 'expire-date expired' : 'expire-date'}>
            {date}
          </span>
        );
      },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (_, { platform, store }) => (
        <Button
          type="link"
          size="small"
          className="flat-manage-btn"
          onClick={() => onOpenDrawer({ platform, store, mode: 'detail' })}
        >
          管理
        </Button>
      ),
    },
  ];

  return (
    <Table
      className="flat-store-table"
      columns={columns}
      dataSource={data}
      rowKey="key"
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showTotal: (t) => `共 ${t} 条`,
      }}
      scroll={{ x: 720 }}
      size="middle"
      onRow={(record) => ({
        onClick: () =>
          onOpenDrawer({
            platform: record.platform,
            store: record.store,
            mode: 'detail',
          }),
        className: 'flat-store-row',
      })}
    />
  );
}
