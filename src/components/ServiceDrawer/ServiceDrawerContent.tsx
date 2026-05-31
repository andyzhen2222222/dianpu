import { Button, Switch } from 'antd';
import { useEffect, useRef } from 'react';
import { servicePlans } from '../../data/mockData';
import type { DrawerContext, ServiceKey } from '../../types';
import { storeStatusLabels } from '../../utils/serviceHelpers';
import AuthInfoCard from '../AuthInfoCard';
import PlanSelector from '../PlanSelector';
import StatusTag from '../StatusTag';

interface ServiceCardProps {
  serviceKey: ServiceKey;
  title: string;
  level: 'store' | 'platform';
  status: string;
  statusType: 'active' | 'paused' | 'not_opened' | 'expired' | 'expiring_soon';
  packageName?: string;
  expireAt?: string;
  quota?: string;
  storeUsageActive?: boolean;
  selectedPlan?: string;
  highlighted?: boolean;
  onSelectPlan: (planId: string) => void;
  onToggleStoreUsage?: (active: boolean) => void;
  onPause?: () => void;
  onResume?: () => void;
  onRenew?: () => void;
}

function ServiceCard({
  serviceKey,
  title,
  level,
  status,
  statusType,
  packageName,
  expireAt,
  quota,
  storeUsageActive,
  selectedPlan,
  highlighted,
  onSelectPlan,
  onToggleStoreUsage,
  onPause,
  onResume,
}: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const plans = servicePlans[serviceKey as keyof typeof servicePlans] ?? [];

  useEffect(() => {
    if (highlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [highlighted]);

  const platformStatusLabel =
    statusType === 'active'
      ? '平台已开通'
      : statusType === 'not_opened'
        ? '平台未开通'
        : storeStatusLabels[statusType];

  return (
    <div
      ref={cardRef}
      className={`service-card ${highlighted ? 'service-card-highlighted' : ''}`}
    >
      <div className="service-card-header">
        <div>
          <div className="service-card-title">
            {title}
            <span className="service-card-level">
              {level === 'store' ? '店铺级' : '平台级'}
            </span>
          </div>
          <div className="service-card-status-row">
            <span className="service-card-status-label">当前状态：</span>
            <StatusTag
              status={statusType}
              label={level === 'platform' && statusType === 'active' ? platformStatusLabel : status}
            />
          </div>
        </div>
      </div>

      {(packageName || expireAt || quota) && (
        <div className="service-card-meta">
          {packageName && <span>当前套餐：{packageName}</span>}
          {quota && <span>商品额度：{quota}</span>}
          {expireAt && <span>到期时间：{expireAt}</span>}
        </div>
      )}

      {level === 'platform' && statusType === 'active' && (
        <div className="service-card-inherit-note">
          平台开通后，所属店铺默认继承，可按店铺暂停使用。
        </div>
      )}

      {level === 'platform' && statusType === 'active' && storeUsageActive !== undefined && (
        <div className="service-card-toggle-row">
          <span>当前店铺使用状态：{storeUsageActive ? '已开启' : '已暂停'}</span>
          <Switch
            checked={storeUsageActive}
            onChange={onToggleStoreUsage}
            size="small"
          />
        </div>
      )}

      {(statusType === 'not_opened' ||
        statusType === 'expired' ||
        statusType === 'expiring_soon' ||
        statusType === 'active') && (
        <PlanSelector
          plans={plans}
          selectedId={selectedPlan}
          onSelect={onSelectPlan}
        />
      )}

      <div className="service-card-actions">
        {level === 'store' && statusType === 'active' && (
          <>
            <Button size="small" onClick={onPause}>
              暂停功能
            </Button>
            <Button type="primary" size="small">
              立即续费
            </Button>
          </>
        )}
        {level === 'store' && statusType === 'paused' && (
          <Button type="primary" size="small" onClick={onResume}>
            恢复功能
          </Button>
        )}
        {level === 'store' &&
          (statusType === 'not_opened' || statusType === 'expired') && (
            <Button type="primary" size="small">
              立即开通
            </Button>
          )}
        {level === 'platform' && statusType === 'active' && (
          <>
            <Button size="small" onClick={onPause}>
              暂停本店使用
            </Button>
            <Button type="primary" size="small">
              平台续费
            </Button>
          </>
        )}
        {level === 'platform' && statusType === 'not_opened' && (
          <Button type="primary" size="small">
            开通平台服务
          </Button>
        )}
        {level === 'platform' && statusType === 'expired' && (
          <Button type="primary" size="small">
            平台续费
          </Button>
        )}
      </div>
    </div>
  );
}

interface ServiceDrawerContentProps {
  context: DrawerContext;
  selectedPlans: Partial<Record<ServiceKey, string>>;
  onSelectPlan: (service: ServiceKey, planId: string) => void;
  onToggleStoreUsage: (service: 'resale' | 'listing', active: boolean) => void;
  onPauseStoreService: (service: ServiceKey) => void;
  onResumeStoreService: (service: ServiceKey) => void;
}

export default function ServiceDrawerContent({
  context,
  selectedPlans,
  onSelectPlan,
  onToggleStoreUsage,
  onPauseStoreService,
  onResumeStoreService,
}: ServiceDrawerContentProps) {
  const { platform, store, focusService } = context;
  const targetStore = store ?? platform.stores[0];

  const repricing = targetStore?.services.repricing;
  const customerService = targetStore?.services.customerService;
  const platformResale = platform.platformServices.resale;
  const platformListing = platform.platformServices.listing;

  return (
    <div className="service-drawer-content">
      <div className="drawer-context">
        <div>
          <span className="drawer-context-label">平台</span>
          <span className="drawer-context-value">{platform.platformName}</span>
        </div>
        {targetStore && (
          <div>
            <span className="drawer-context-label">店铺</span>
            <span className="drawer-context-value">{targetStore.storeName}</span>
          </div>
        )}
      </div>

      {repricing && (
        <ServiceCard
          serviceKey="repricing"
          title="AI调价"
          level="store"
          status={storeStatusLabels[repricing.status]}
          statusType={repricing.status}
          packageName={repricing.packageName}
          expireAt={repricing.expireAt}
          selectedPlan={selectedPlans.repricing}
          highlighted={focusService === 'repricing'}
          onSelectPlan={(id) => onSelectPlan('repricing', id)}
          onPause={() => onPauseStoreService('repricing')}
          onResume={() => onResumeStoreService('repricing')}
        />
      )}

      {customerService && (
        <ServiceCard
          serviceKey="customerService"
          title="客服"
          level="store"
          status={storeStatusLabels[customerService.status]}
          statusType={customerService.status}
          packageName={customerService.packageName}
          expireAt={customerService.expireAt}
          selectedPlan={selectedPlans.customerService}
          highlighted={focusService === 'customerService'}
          onSelectPlan={(id) => onSelectPlan('customerService', id)}
          onPause={() => onPauseStoreService('customerService')}
          onResume={() => onResumeStoreService('customerService')}
        />
      )}

      <ServiceCard
        serviceKey="resale"
        title="AI跟卖"
        level="platform"
        status={storeStatusLabels[platformResale.status]}
        statusType={platformResale.status}
        packageName={platformResale.packageName}
        expireAt={platformResale.expireAt}
        quota={platformResale.quota}
        storeUsageActive={
          targetStore
            ? targetStore.services.resale.storeUsageStatus === 'active'
            : undefined
        }
        selectedPlan={selectedPlans.resale}
        highlighted={focusService === 'resale'}
        onSelectPlan={(id) => onSelectPlan('resale', id)}
        onToggleStoreUsage={(active) => onToggleStoreUsage('resale', active)}
        onPause={() => onPauseStoreService('resale')}
        onResume={() => onResumeStoreService('resale')}
      />

      <ServiceCard
        serviceKey="listing"
        title="AI刊登"
        level="platform"
        status={storeStatusLabels[platformListing.status]}
        statusType={platformListing.status}
        packageName={platformListing.packageName}
        expireAt={platformListing.expireAt}
        storeUsageActive={
          targetStore
            ? targetStore.services.listing.storeUsageStatus === 'active'
            : undefined
        }
        selectedPlan={selectedPlans.listing}
        highlighted={focusService === 'listing'}
        onSelectPlan={(id) => onSelectPlan('listing', id)}
        onToggleStoreUsage={(active) => onToggleStoreUsage('listing', active)}
        onPause={() => onPauseStoreService('listing')}
        onResume={() => onResumeStoreService('listing')}
      />

      {targetStore && (
        <AuthInfoCard
          authStatus={targetStore.authStatus}
          bindAt={targetStore.bindAt}
          onReauth={() => {}}
        />
      )}
    </div>
  );
}
