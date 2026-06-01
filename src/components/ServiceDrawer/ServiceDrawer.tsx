import { Drawer, message } from 'antd';
import { useMemo, useState } from 'react';
import { servicePlans } from '../../data/mockData';
import type { DrawerContext, ServiceKey } from '../../types';
import ServiceDrawerContent from './ServiceDrawerContent';

interface ServiceDrawerProps {
  open: boolean;
  context: DrawerContext | null;
  onClose: () => void;
}

export default function ServiceDrawer({
  open,
  context,
  onClose,
}: ServiceDrawerProps) {
  const [selectedPlans, setSelectedPlans] = useState<
    Partial<Record<ServiceKey, string>>
  >({});

  const totalPrice = useMemo(() => {
    let total = 0;
    (Object.keys(selectedPlans) as ServiceKey[]).forEach((key) => {
      const planId = selectedPlans[key];
      const plans = servicePlans[key as keyof typeof servicePlans];
      const plan = plans?.find((p) => p.id === planId);
      if (plan) total += plan.price;
    });
    return total;
  }, [selectedPlans]);

  const handleSelectPlan = (service: ServiceKey, planId: string) => {
    setSelectedPlans((prev) => ({ ...prev, [service]: planId }));
  };

  const handlePay = () => {
    message.success('支付成功（模拟）');
    onClose();
  };

  return (
    <Drawer
      title={
        <div>
          <div className="drawer-title">服务开通 / 续费</div>
          <div className="drawer-subtitle">
            支持按店铺或按平台管理功能开通与续费
          </div>
        </div>
      }
      placement="right"
      width={520}
      open={open}
      onClose={onClose}
      destroyOnClose
      className="service-drawer"
      footer={
        <div className="drawer-footer">
          <div className="drawer-footer-price">
            应付金额：<strong>¥{totalPrice || 498}</strong> 元
          </div>
          <div className="drawer-footer-actions">
            <button type="button" className="drawer-btn-cancel" onClick={onClose}>
              取消
            </button>
            <button type="button" className="drawer-btn-pay" onClick={handlePay}>
              确认并支付
            </button>
          </div>
        </div>
      }
    >
      {context && (
        <ServiceDrawerContent
          context={context}
          selectedPlans={selectedPlans}
          onSelectPlan={handleSelectPlan}
        />
      )}
    </Drawer>
  );
}
