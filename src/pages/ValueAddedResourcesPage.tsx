import { CheckOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useMemo, useState } from 'react';
import { FunctionTabSelector } from '../components/PackageCompareTable';
import PageHeader from '../components/PageHeader';
import {
  accountBalanceMock,
  calcStoragePrice,
  paymentMethodOptions,
  resourcePointPackages,
  storageCapacities,
  storageDurations,
  type PaymentMethod,
  type ValueAddedType,
} from '../data/valueAddedServices';

const resourceTypes = [
  { key: 'points', label: '资源点' },
  { key: 'storage', label: '存储空间' },
];

function OptionSelector<T extends { id: string; label: string }>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="value-option-group">
      <div className="value-option-label">{label}</div>
      <div className="value-option-list">
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              className={`value-option-btn ${selected ? 'selected' : ''}`}
              onClick={() => onChange(opt.id)}
            >
              {selected && <CheckOutlined className="value-option-check" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ValueAddedResourcesPage() {
  const [resourceType, setResourceType] = useState<ValueAddedType>('points');
  const [selectedPointPkg, setSelectedPointPkg] = useState(
    resourcePointPackages[0].id,
  );
  const [storageCapacity, setStorageCapacity] = useState(storageCapacities[0].id);
  const [storageDuration, setStorageDuration] = useState(storageDurations[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');

  const amount = useMemo(() => {
    if (resourceType === 'points') {
      return resourcePointPackages.find((p) => p.id === selectedPointPkg)?.price ?? 0;
    }
    return calcStoragePrice(storageCapacity, storageDuration);
  }, [resourceType, selectedPointPkg, storageCapacity, storageDuration]);

  const handlePay = () => {
    message.success(`支付成功 ¥${amount.toFixed(2)}（模拟）`);
  };

  return (
    <div className="page-container">
      <PageHeader
        title="增值资源"
        subtitle="按需购买业务补充"
      />

      <div className="purchase-section">
        <div className="purchase-section-label">资源类型</div>
        <FunctionTabSelector
          functions={resourceTypes}
          active={resourceType}
          onChange={(key) => setResourceType(key as ValueAddedType)}
        />
      </div>

      <div className="purchase-section">
        <div className="purchase-section-label">购买套餐</div>

        {resourceType === 'points' ? (
          <div className="value-package-grid">
            {resourcePointPackages.map((pkg) => {
              const selected = pkg.id === selectedPointPkg;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  className={`value-package-card ${selected ? 'selected' : ''}`}
                  onClick={() => setSelectedPointPkg(pkg.id)}
                >
                  <div className="value-package-title">{pkg.points}点</div>
                  <div className="value-package-desc">{pkg.description}</div>
                  <div className="value-package-price">¥{pkg.price.toFixed(2)}</div>
                  {selected && (
                    <span className="value-package-selected-mark">
                      <CheckOutlined />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="value-storage-options">
            <OptionSelector
              label="扩充容量"
              options={storageCapacities}
              value={storageCapacity}
              onChange={setStorageCapacity}
            />
            <OptionSelector
              label="有效时长"
              options={storageDurations}
              value={storageDuration}
              onChange={setStorageDuration}
            />
          </div>
        )}
      </div>

      <div className="purchase-section">
        <div className="purchase-section-label">支付方式</div>
        <p className="value-payment-tip">
          订单支持组合支付，支付扣减顺序为积分余额 &gt; 账户余额 &gt; 其他支付
        </p>
        <div className="value-balance-bar">
          <span>
            账户余额：<strong>¥{accountBalanceMock.balance.toFixed(2)}</strong>
          </span>
          <span>
            积分余额：<strong>{accountBalanceMock.points.toFixed(2)} 积分</strong>
          </span>
        </div>
        <div className="value-payment-methods">
          {paymentMethodOptions.map((method) => {
            const selected = paymentMethod === method.key;
            return (
              <button
                key={method.key}
                type="button"
                className={`value-payment-btn ${selected ? 'selected' : ''}`}
                onClick={() => setPaymentMethod(method.key)}
              >
                {selected && <CheckOutlined />}
                {method.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="value-checkout-bar">
        <span className="value-checkout-amount">
          金额：<strong>¥{amount.toFixed(2)}</strong>
        </span>
        <Button type="primary" size="large" onClick={handlePay}>
          立即支付
        </Button>
      </div>
    </div>
  );
}
