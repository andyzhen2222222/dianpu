import type { ReactNode } from 'react';
import HubActions from './HubActions';
import HubStatus from './HubStatus';
import type { HubAction, HubStatusTone } from './hubStyles';

interface HubItemRowProps {
  title: string;
  subtitle?: string;
  tag?: string;
  statusLabel: string;
  statusTone: HubStatusTone;
  statusMeta?: string[];
  actions: HubAction[];
}

export default function HubItemRow({
  title,
  subtitle,
  tag,
  statusLabel,
  statusTone,
  statusMeta,
  actions,
}: HubItemRowProps) {
  return (
    <div className="hub-item-row">
      <div className="hub-item-main">
        <div className="hub-item-title">
          {title}
          {tag && <span className="hub-item-tag">{tag}</span>}
        </div>
        {subtitle && <div className="hub-item-subtitle">{subtitle}</div>}
      </div>
      <HubStatus label={statusLabel} tone={statusTone} meta={statusMeta} />
      <HubActions actions={actions} />
    </div>
  );
}

export function HubItemList({ children }: { children: ReactNode }) {
  return <div className="hub-item-list">{children}</div>;
}
