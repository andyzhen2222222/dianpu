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
  const [storePlatformId, setStorePlatformId] = useState<string>();
  const [storeId, setStoreId] = useState<string>();

  const { platforms, platformOptions, activatePlatformService, activateStoreService } =
    useStoreModule();

  const isSuper = activeMode === 'super';
  const activeFunc = isSuper ? 'repricing' : activeMode;
  const config = getFunctionPackage(activeFunc);

  const storeOptions = useMemo(() => {
    if (!storePlatformId) return [];
    const platform = platforms.find((p) => p.id === storePlatformId);
    return (
      platform?.stores.map((s) => ({
        label: s.storeName,
        value: s.id,
      })) ?? []
    );
  }, [platforms, storePlatformId]);

  const storeTargetId =
    storePlatformId && storeId ? `${storePlatformId}::${storeId}` : undefined;

  const tabFunctions = [
    { key: 'super', label: '组合套餐' },
    ...functionPackages.map((f) => ({ key: f.key, label: f.label })),
  ];

  const handleModeChange = (key: string) => {
    setActiveMode(key as PurchaseMode);
    setTargetId(undefined);
    setStorePlatformId(undefined);
    setStoreId(undefined);
    setSearchParams({ func: key });
  };

  const handlePurchase = (_planId: string, planTitle: string) => {
    const resolvedTargetId =
      config.level === 'store' ? storeTargetId : targetId;

    if (!resolvedTargetId) {
      message.warning(
        config.level === 'store'
          ? '请先选择平台和店铺'
          : '请先选择平台',
      );
      return;
    }

    if (config.level === 'platform') {
      activatePlatformService(
        resolvedTargetId,
        activeFunc as 'resale' | 'listing',
        planTitle,
      );
    } else {
      const [platformId, selectedStoreId] = resolvedTargetId.split('::');
      activateStoreService(
        platformId,
        selectedStoreId,
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
        subtitle="组合套餐一键全开，或按功能单独购买套餐"
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
              <div className="purchase-target-row">
                <div className="purchase-target-item">
                  <span className="purchase-target-label">选择平台</span>
                  <Select
                    placeholder="请先选择平台"
                    style={{ width: 240 }}
                    options={platformOptions}
                    value={storePlatformId}
                    onChange={(v) => {
                      setStorePlatformId(v);
                      setStoreId(undefined);
                    }}
                  />
                </div>
                <div className="purchase-target-item">
                  <span className="purchase-target-label">选择店铺</span>
                  <Select
                    placeholder="再选择店铺"
                    style={{ width: 240 }}
                    options={storeOptions}
                    value={storeId}
                    onChange={setStoreId}
                    disabled={!storePlatformId}
                    showSearch
                    optionFilterProp="label"
                  />
                </div>
              </div>
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
