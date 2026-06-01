import { CheckOutlined, CrownOutlined } from '@ant-design/icons';
import { Button, Select, message } from 'antd';
import { useMemo, useState } from 'react';
import {
  superMemberFeatures,
  superMemberPlans,
} from '../data/superMemberPlans';
import { useStoreModule } from '../context/StoreModuleContext';

export default function SuperMemberSection() {
  const { platforms, platformOptions, activateSuperMember } = useStoreModule();
  const [platformId, setPlatformId] = useState<string>();
  const [storeKey, setStoreKey] = useState<string>();
  const [selectedPlan, setSelectedPlan] = useState(superMemberPlans[1].id);

  const storeOptions = useMemo(() => {
    if (!platformId) return [];
    const platform = platforms.find((p) => p.id === platformId);
    return (
      platform?.stores.map((s) => ({
        label: s.storeName,
        value: `${platformId}::${s.id}`,
      })) ?? []
    );
  }, [platforms, platformId]);

  const plan = superMemberPlans.find((p) => p.id === selectedPlan)!;
  const maxDiscount = useMemo(
    () =>
      Math.max(
        ...superMemberPlans.map((p) =>
          Math.round((1 - p.price / p.originalPrice) * 100),
        ),
      ),
    [],
  );
  const planDiscount = Math.round((1 - plan.price / plan.originalPrice) * 100);

  const handlePurchase = () => {
    if (!platformId) {
      message.warning('请选择开通平台');
      return;
    }
    if (!storeKey) {
      message.warning('请选择开通店铺');
      return;
    }
    const [, storeId] = storeKey.split('::');
    activateSuperMember(platformId, storeId, plan.packageName);
  };

  return (
    <div className="super-member-section">
      <div className="super-member-badge">
        <CrownOutlined /> 组合套餐
      </div>

      <div className="super-member-header">
        <div>
          <h2 className="super-member-title">
            一键开通
            <span className="super-member-title-services">调价、客服、跟卖、刊登</span>
            ，比单独购买最高省
            <span className="super-member-title-discount">{maxDiscount}%</span>
          </h2>
          <p className="super-member-desc">
            当前{plan.label}可省 ¥{plan.originalPrice - plan.price}（省 {planDiscount}%）
          </p>
          <div className="super-member-billing-hint">
            <strong>计费说明：</strong>
            每购买 1 份组合套餐 = 选定<strong> 1 个平台</strong>的跟卖/刊登
            + 选定<strong> 1 个店铺</strong>的调价/客服。
            同一平台下其他店铺如需调价/客服，需再次购买；跟卖/刊登开通后该平台下全部店铺自动继承。
          </div>
        </div>
        <div className="super-member-features">
          {superMemberFeatures.map((f) => (
            <span key={f.key} className="super-member-feature-tag">
              <CheckOutlined />
              {f.label}
              <em>{f.level}</em>
            </span>
          ))}
        </div>
      </div>

      <div className="super-member-plans">
        {superMemberPlans.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`super-member-plan ${selectedPlan === p.id ? 'selected' : ''} ${p.recommended ? 'recommended' : ''}`}
            onClick={() => setSelectedPlan(p.id)}
          >
            {p.recommended && <span className="super-member-plan-badge">推荐</span>}
            <div className="super-member-plan-label">{p.label}</div>
            <div className="super-member-plan-price">¥{p.price}</div>
            <div className="super-member-plan-original">¥{p.originalPrice}</div>
          </button>
        ))}
      </div>

      <div className="super-member-target">
        <div className="super-member-target-item">
          <span className="super-member-target-label">开通平台</span>
          <Select
            placeholder="选择平台（跟卖 / 刊登）"
            style={{ width: 240 }}
            options={platformOptions}
            value={platformId}
            onChange={(v) => {
              setPlatformId(v);
              setStoreKey(undefined);
            }}
          />
        </div>
        <div className="super-member-target-item">
          <span className="super-member-target-label">主店铺</span>
          <Select
            placeholder="选择店铺（调价 / 客服绑定此店）"
            style={{ width: 240 }}
            options={storeOptions}
            value={storeKey}
            onChange={setStoreKey}
            disabled={!platformId}
          />
        </div>
        <Button
          type="primary"
          size="large"
          className="super-member-buy-btn"
          onClick={handlePurchase}
        >
          立即开通 ¥{plan.price}
        </Button>
      </div>
    </div>
  );
}
