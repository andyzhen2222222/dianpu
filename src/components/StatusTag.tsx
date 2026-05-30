import type { ServiceStatus } from '../types';
import { storeStatusLabels } from '../utils/serviceHelpers';

interface StatusTagProps {
  status: ServiceStatus;
  label?: string;
  dot?: boolean;
}

const statusStyles: Record<
  ServiceStatus,
  { color: string; bg: string; border: string }
> = {
  active: { color: '#389e0d', bg: '#f6ffed', border: '#b7eb8f' },
  paused: { color: '#8c8c8c', bg: '#fafafa', border: '#d9d9d9' },
  not_opened: { color: '#8c8c8c', bg: '#fafafa', border: '#d9d9d9' },
  expired: { color: '#cf1322', bg: '#fff2f0', border: '#ffa39e' },
  expiring_soon: { color: '#d46b08', bg: '#fff7e6', border: '#ffd591' },
};

export default function StatusTag({ status, label, dot }: StatusTagProps) {
  const style = statusStyles[status];
  const text = label ?? storeStatusLabels[status];

  return (
    <span
      className="status-tag"
      style={{
        color: style.color,
        background: style.bg,
        borderColor: style.border,
      }}
    >
      {dot && (
        <span
          className="status-tag-dot"
          style={{ background: style.color }}
        />
      )}
      {text}
    </span>
  );
}
