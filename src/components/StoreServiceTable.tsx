import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ServiceStatusChip from './ServiceStatusChip';
import type { DrawerContext, Platform, ServiceKey, Store } from '../types';
import {
  getInheritedDisplay,
  getStorePrimaryExpireAt,
  isExpiredDate,
} from '../utils/serviceHelpers';

interface StoreServiceTableProps {
  platform: Platform;
  onOpenDrawer: (ctx: DrawerContext) => void;
  onStoreAction: (
    platformId: string,
    storeId: string,
    service: ServiceKey,
    action: string,
  ) => void;
}

export default function StoreServiceTable({
  platform,
  onOpenDrawer,
}: StoreServiceTableProps) {
  const openService = (store: Store, focusService: ServiceKey) =>
    onOpenDrawer({ platform, store, focusService, mode: 'detail' });

  const columns: ColumnsType<Store> = [
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      width: 150,
      render: (name, store) => (
        <div className="nested-store-name">
          <span className="store-name">{name}</span>
          <span
            className={`nested-auth-dot ${store.authStatus === 'normal' ? 'ok' : 'err'}`}
          />
        </div>
      ),
    },
    {
      title: 'AI调价',
      width: 100,
      render: (_, store) => (
        <ServiceStatusChip
          serviceName="调价"
          status={store.services.repricing.status}
          onClick={() => openService(store, 'repricing')}
        />
      ),
    },
    {
      title: '客服',
      width: 100,
      render: (_, store) => (
        <ServiceStatusChip
          serviceName="客服"
          status={store.services.customerService.status}
          onClick={() => openService(store, 'customerService')}
        />
      ),
    },
    {
      title: 'AI跟卖',
      width: 120,
      render: (_, store) => {
        const inherited = getInheritedDisplay(
          platform.platformServices.resale,
          store.services.resale,
        );
        return (
          <ServiceStatusChip
            serviceName="跟卖"
            status={inherited.status}
            label={inherited.label}
            onClick={() => openService(store, 'resale')}
          />
        );
      },
    },
    {
      title: 'AI刊登',
      width: 120,
      render: (_, store) => {
        const inherited = getInheritedDisplay(
          platform.platformServices.listing,
          store.services.listing,
        );
        return (
          <ServiceStatusChip
            serviceName="刊登"
            status={inherited.status}
            label={inherited.label}
            onClick={() => openService(store, 'listing')}
          />
        );
      },
    },
    {
      title: '最近到期',
      width: 110,
      align: 'center',
      render: (_, store) => {
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
      width: 70,
      fixed: 'right',
      align: 'center',
      render: (_, store) => (
        <Button
          type="link"
          size="small"
          onClick={() => onOpenDrawer({ platform, store, mode: 'detail' })}
        >
          管理
        </Button>
      ),
    },
  ];

  return (
    <div className="store-service-table">
      <Table
        columns={columns}
        dataSource={platform.stores}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: 800 }}
        onRow={(store) => ({
          onClick: () => onOpenDrawer({ platform, store, mode: 'detail' }),
          className: 'flat-store-row',
        })}
      />
    </div>
  );
}
