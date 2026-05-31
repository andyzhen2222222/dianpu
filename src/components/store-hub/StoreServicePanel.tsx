import type { Platform, ServiceKey, Store } from '../../types';
import { getServiceExpireAt } from '../../utils/serviceHelpers';
import {
  resolveInheritedManageState,
  resolveManageState,
  type ManageState,
} from '../../utils/manageState';
import HubItemRow, { HubItemList } from './HubItemRow';
import {
  formatShortDate,
  manageStateLabel,
  manageStateTone,
  type HubAction,
} from './hubStyles';

const serviceLabels: Record<ServiceKey, string> = {
  repricing: '调价',
  customerService: '客服',
  resale: '跟卖',
  listing: '刊登',
};

interface StoreServicePanelProps {
  platform: Platform;
  store: Store;
  onEnable: (serviceKey: ServiceKey) => void;
  onPause: (serviceKey: ServiceKey) => void;
  onRenew: (serviceKey: ServiceKey) => void;
}

function buildServiceActions(
  manageState: ManageState,
  onEnable: () => void,
  onPause: () => void,
  onRenew: () => void,
): HubAction[] {
  switch (manageState) {
    case 'normal':
    case 'expiring':
      return [
        { key: 'renew', label: '续费', primary: true, onClick: onRenew },
        { key: 'pause', label: '暂停', onClick: onPause },
      ];
    case 'expired':
      return [{ key: 'renew', label: '续费', primary: true, onClick: onRenew }];
    case 'paused':
      return [{ key: 'enable', label: '开启', primary: true, onClick: onEnable }];
    case 'not_opened':
      return [{ key: 'enable', label: '开启', primary: true, onClick: onEnable }];
    default:
      return [];
  }
}

function serviceStateSubtitle(state: ManageState): string | undefined {
  switch (state) {
    case 'expiring':
      return '即将到期，请及时续费';
    case 'expired':
      return '服务已到期，续费后恢复使用';
    case 'paused':
      return '服务已暂停，开启后恢复运行';
    case 'not_opened':
      return '尚未开通，开启后将跳转开通页';
    default:
      return undefined;
  }
}

export default function StoreServicePanel({
  platform,
  store,
  onEnable,
  onPause,
  onRenew,
}: StoreServicePanelProps) {
  const storeServices = (['repricing', 'customerService'] as const).map((key) => {
    const svc = store.services[key];
    const expireAt = getServiceExpireAt(platform, store, key);
    return {
      key,
      label: serviceLabels[key],
      manageState: resolveManageState(svc.status, expireAt),
      expireAt,
    };
  });

  const inheritedServices = (['resale', 'listing'] as const).map((key) => {
    const platformSvc = platform.platformServices[key];
    const inherited = store.services[key];
    const expireAt = getServiceExpireAt(platform, store, key);
    return {
      key,
      label: serviceLabels[key],
      manageState: resolveInheritedManageState(
        platformSvc.status,
        inherited.storeUsageStatus,
        expireAt,
      ),
      expireAt,
    };
  });

  return (
    <div className="store-hub-panel store-hub-service-panel">
      <HubItemList>
        {[...storeServices, ...inheritedServices].map((svc) => {
          const shortExpire = formatShortDate(svc.expireAt);
          const statusMeta = shortExpire ? [`到期 ${shortExpire}`] : undefined;

          return (
            <HubItemRow
              key={svc.key}
              title={svc.label}
              subtitle={serviceStateSubtitle(svc.manageState)}
              statusLabel={manageStateLabel(svc.manageState)}
              statusTone={manageStateTone(svc.manageState)}
              statusMeta={statusMeta}
              actions={buildServiceActions(
                svc.manageState,
                () => onEnable(svc.key),
                () => onPause(svc.key),
                () => onRenew(svc.key),
              )}
            />
          );
        })}
      </HubItemList>
    </div>
  );
}

export { serviceLabels };
