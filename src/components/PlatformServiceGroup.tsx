import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ActionButtonGroup from './ActionButtonGroup';
import StatusTag from './StatusTag';
import StoreServiceTable from './StoreServiceTable';
import type { DrawerContext, Platform, ServiceKey } from '../types';

interface PlatformServiceGroupProps {
  platform: Platform;
  expanded: boolean;
  onToggle: (platformId: string) => void;
  onOpenDrawer: (ctx: DrawerContext) => void;
  onPlatformAction: (
    platformId: string,
    service: 'resale' | 'listing',
    action: string,
  ) => void;
  onStoreAction: (
    platformId: string,
    storeId: string,
    service: ServiceKey,
    action: string,
  ) => void;
}

function PlatformServiceItem({
  name,
  service,
  onOpen,
  onRenew,
  onPause,
  onResume,
}: {
  name: string;
  service: Platform['platformServices']['resale'];
  onOpen: () => void;
  onRenew: () => void;
  onPause: () => void;
  onResume: () => void;
}) {
  return (
    <div className="platform-service-item">
      <div className="platform-service-name">{name}</div>
      <StatusTag status={service.status} />
      {service.packageName && (
        <span className="platform-service-meta">{service.packageName}</span>
      )}
      {service.expireAt && (
        <span className="platform-service-meta">{service.expireAt}</span>
      )}
      <ActionButtonGroup
        status={service.status}
        level="platform"
        onOpen={onOpen}
        onRenew={onRenew}
        onPause={onPause}
        onResume={onResume}
      />
    </div>
  );
}

export default function PlatformServiceGroup({
  platform,
  expanded,
  onToggle,
  onOpenDrawer,
  onPlatformAction,
  onStoreAction,
}: PlatformServiceGroupProps) {
  return (
    <div className="platform-group">
      <div className="platform-group-header" onClick={() => onToggle(platform.id)}>
        <div className="platform-group-left">
          <Button
            type="text"
            size="small"
            icon={expanded ? <DownOutlined /> : <RightOutlined />}
            className="expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(platform.id);
            }}
          />
          <div className="platform-logo">{platform.platformLogo}</div>
          <div className="platform-info">
            <span className="platform-name">
              {platform.platformName}
              <span className="platform-store-count">
                （{platform.storeCount} 家店铺）
              </span>
            </span>
            {platform.authStatus === 'normal' ? (
              <StatusTag status="active" label="授权正常" />
            ) : (
              <StatusTag status="expired" label="授权异常" />
            )}
          </div>
        </div>
        <div className="platform-group-services">
          <PlatformServiceItem
            name="AI跟卖"
            service={platform.platformServices.resale}
            onOpen={() =>
              onOpenDrawer({
                platform,
                focusService: 'resale',
                mode: 'open',
              })
            }
            onRenew={() =>
              onOpenDrawer({
                platform,
                focusService: 'resale',
                mode: 'renew',
              })
            }
            onPause={() => onPlatformAction(platform.id, 'resale', 'pause')}
            onResume={() => onPlatformAction(platform.id, 'resale', 'resume')}
          />
          <PlatformServiceItem
            name="AI刊登"
            service={platform.platformServices.listing}
            onOpen={() =>
              onOpenDrawer({
                platform,
                focusService: 'listing',
                mode: 'open',
              })
            }
            onRenew={() =>
              onOpenDrawer({
                platform,
                focusService: 'listing',
                mode: 'renew',
              })
            }
            onPause={() => onPlatformAction(platform.id, 'listing', 'pause')}
            onResume={() => onPlatformAction(platform.id, 'listing', 'resume')}
          />
        </div>
      </div>

      {expanded && platform.stores.length > 0 && (
        <>
          <div className="platform-group-hint">
            平台开通后，所属店铺默认继承，可对单店暂停使用。
          </div>
          <StoreServiceTable
            platform={platform}
            onOpenDrawer={onOpenDrawer}
            onStoreAction={onStoreAction}
          />
        </>
      )}
    </div>
  );
}
