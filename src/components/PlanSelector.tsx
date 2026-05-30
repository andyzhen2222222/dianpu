import { CheckOutlined } from '@ant-design/icons';
import type { PlanOption } from '../types';

interface PlanSelectorProps {
  plans: PlanOption[];
  selectedId?: string;
  onSelect: (planId: string) => void;
}

export default function PlanSelector({
  plans,
  selectedId,
  onSelect,
}: PlanSelectorProps) {
  return (
    <div className="plan-selector">
      {plans.map((plan) => {
        const selected = selectedId === plan.id;
        return (
          <div
            key={plan.id}
            className={`plan-option ${selected ? 'plan-option-selected' : ''}`}
            onClick={() => onSelect(plan.id)}
          >
            <div className="plan-option-label">{plan.label}</div>
            <div className="plan-option-price">¥{plan.price}</div>
            {selected && (
              <span className="plan-option-check">
                <CheckOutlined />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
