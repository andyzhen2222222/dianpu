import { Select, message } from 'antd';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PackageCompareTable, {
  FunctionTabSelector,
} from '../components/PackageCompareTable';
import PageHeader from '../components/PageHeader';
import SuperMemberSection from '../components/SuperMemberSection';
import { functionPackages, getFunctionPackage } from '../data/packagePlans';
import { useStoreModule } from '../context/StoreModuleContext';
import type { ServiceKey } from '../types';

type PurchaseMode = 'super' | ServiceKey;

export default function ServiceActivationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const funcParam = searchParams.get('func');
  const initialMode: PurchaseMode =
    funcParam === 'super'
      ? 'super'
      : funcParam && functionPackages.some((f) => f.key === funcParam)
        ? (funcParam as ServiceKey)
        : 'super';

  const [activeMode, setActiveMode] = useState<PurchaseMode>(initialMode);
  const [targetId, setTargetId] = useState<string>();

  const { platforms, platformOptions, activatePlatformService, activateStoreService } =
    useStoreModule();

  const isSuper = activeMode === 'super';
  const activeFunc = isSuper ? 'repricing' : activeMode;
  const config = getFunctionPackage(activeFunc);

  const storeOptions = useMemo(
    () =>
      platforms.flatMap((p) =>
        p.stores.map((s) => ({
          label: `${s.storeName}（${p.platformName}）`,
          value: `${p.id}::${s.id}`,
        })),
      ),
    [platforms],
  );

  const tabFunctions = [
    { key: 'super', label: '超级会员' },
    ...functionPackages.map((f) => ({ key: f.key, label: f.label })),
  ];

  const handleModeChange = (key: string) => {
    setActiveMode(key as PurchaseMode);
    setTargetId(undefined);
    setSearchParams({ func: key });
  };

  const handlePurchase = (_planId: string, planTitle: string) => {
    if (!targetId) {
      message.warning(`请先选择${config.level === 'store' ? '店铺' : '平台'}`);
      return;
    }

    if (config.level === 'platform') {
      activatePlatformService(
        targetId,
        activeFunc as 'resale' | 'listing',
        planTitle,
      );
    } else {
      const [platformId, storeId] = targetId.split('::');
      activateStoreService(
        platformId,
        storeId,
        activeFunc as 'repricing' | 'customerService',
        planTitle,
      );
    }
    message.success(`已购买 ${config.label} · ${planTitle}`);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="服务开通"
        subtitle="超级会员一键全开，或按功能单独购买套餐"
      />

      <div className="purchase-section">
        <div className="purchase-section-label">购买产品</div>
        <FunctionTabSelector
          functions={tabFunctions}
          active={activeMode}
          onChange={handleModeChange}
        />
      </div>

      {isSuper ? (
        <SuperMemberSection />
      ) : (
        <>
          <div className="purchase-section purchase-section-compact">
            <div className="purchase-level-hint">
              {config.level === 'store' ? (
                <span>按<strong>店铺</strong>计费，每个店铺单独购买</span>
              ) : (
                <span>按<strong>平台</strong>计费，开通后该平台下所有店铺自动继承</span>
              )}
            </div>
          </div>

          <div className="purchase-section">
            <div className="purchase-section-label">{config.targetLabel}</div>
            {config.level === 'store' ? (
              <Select
                placeholder="请选择店铺"
                style={{ width: 320 }}
                options={storeOptions}
                value={targetId}
                onChange={setTargetId}
                showSearch
                optionFilterProp="label"
              />
            ) : (
              <Select
                placeholder="请选择平台"
                style={{ width: 320 }}
                options={platformOptions}
                value={targetId}
                onChange={setTargetId}
              />
            )}
          </div>

          <div className="purchase-section">
            <div className="purchase-section-label">续费套餐</div>
            <PackageCompareTable config={config} onPurchase={handlePurchase} />
          </div>
        </>
      )}
    </div>
  );
}
