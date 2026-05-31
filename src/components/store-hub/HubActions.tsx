import { Popconfirm } from 'antd';
import type { HubAction } from './hubStyles';

interface HubActionsProps {
  actions: HubAction[];
}

function ActionButton({ action }: { action: HubAction }) {
  const button = (
    <button
      type="button"
      className={`hub-action-link ${action.primary ? 'primary' : ''} ${action.danger ? 'danger' : ''}`}
      disabled={action.disabled || action.loading}
      onClick={(e) => {
        e.stopPropagation();
        if (!action.confirm) {
          action.onClick?.();
        }
      }}
    >
      {action.loading ? `${action.label}…` : action.label}
    </button>
  );

  if (action.confirm) {
    return (
      <Popconfirm
        title={action.confirm.title}
        description={action.confirm.description}
        onConfirm={action.onClick}
      >
        {button}
      </Popconfirm>
    );
  }

  return button;
}

export default function HubActions({ actions }: HubActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className="hub-actions">
      {actions.map((action, index) => (
        <span key={action.key} className="hub-action-item">
          {index > 0 && <span className="hub-action-divider">·</span>}
          <ActionButton action={action} />
        </span>
      ))}
    </div>
  );
}
