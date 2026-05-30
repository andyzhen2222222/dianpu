import { Modal, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { servicePlans } from '../data/mockData';
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

  useEffect(() => {
    if (open && context) {
      const plans = servicePlans[context.serviceKey];
      const defaultPlan = plans?.find((p) => p.id === '1m') ?? plans?.[0];
      setSelectedPlan(defaultPlan?.id);
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
    onConfirm(plan.label);
    message.success('支付成功（模拟）');
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
      onOk={handleConfirm}
      okText={`确认支付 ¥${price}`}
      cancelText="取消"
      width={480}
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
        <div className="renew-modal-price">
          应付金额：<strong>¥{price}</strong>
        </div>
      </div>
    </Modal>
  );
}
