import { CheckOutlined } from '@ant-design/icons';
import { Button, Modal, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { servicePlans } from '../data/mockData';
import {
  accountBalanceMock,
  paymentMethodOptions,
  type PaymentMethod,
} from '../data/valueAddedServices';
import type { ServiceKey } from '../types';
import PlanSelector from './PlanSelector';

export interface RenewContext {
  title: string;
  subtitle: string;
  serviceKey: ServiceKey;
  platformId: string;
  storeId: string | null;
}

interface RenewModalProps {
  open: boolean;
  context: RenewContext | null;
  onClose: () => void;
  onConfirm: (packageName: string) => void;
}

const serviceNames: Record<ServiceKey, string> = {
  repricing: '调价',
  customerService: '客服',
  resale: '跟卖',
  listing: '刊登',
};

export default function RenewModal({
  open,
  context,
  onClose,
  onConfirm,
}: RenewModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');

  useEffect(() => {
    if (open && context) {
      const plans = servicePlans[context.serviceKey];
      const defaultPlan = plans?.find((p) => p.id === '1m') ?? plans?.[0];
      setSelectedPlan(defaultPlan?.id);
      setPaymentMethod('wechat');
    }
  }, [open, context]);

  const plans = context
    ? servicePlans[context.serviceKey as keyof typeof servicePlans] ?? []
    : [];

  const price = useMemo(() => {
    const plan = plans.find((p) => p.id === selectedPlan);
    return plan?.price ?? 0;
  }, [plans, selectedPlan]);

  const handleConfirm = () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return;
    const methodLabel =
      paymentMethodOptions.find((m) => m.key === paymentMethod)?.label ?? '微信支付';
    onConfirm(plan.label);
    message.success(`支付成功 ¥${price}（${methodLabel}，模拟）`);
    onClose();
  };

  if (!context) return null;

  return (
    <Modal
      title={
        <div>
          <div className="renew-modal-title">{context.title}</div>
          <div className="renew-modal-subtitle">{context.subtitle}</div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={
        <div className="renew-modal-footer">
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleConfirm}>
            确认支付 ¥{price}
          </Button>
        </div>
      }
      width={520}
      destroyOnHidden
      className="renew-modal"
    >
      <div className="renew-modal-body">
        <div className="renew-modal-service">
          续费服务：<strong>{serviceNames[context.serviceKey]}</strong>
        </div>
        <PlanSelector
          plans={plans}
          selectedId={selectedPlan}
          onSelect={setSelectedPlan}
        />

        <div className="renew-modal-payment">
          <div className="renew-modal-payment-label">支付方式</div>
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

        <div className="renew-modal-price">
          应付金额：<strong>¥{price}</strong>
        </div>
      </div>
    </Modal>
  );
}
