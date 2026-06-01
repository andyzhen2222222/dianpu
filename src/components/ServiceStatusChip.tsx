import { Tooltip } from 'antd';
import type { ServiceStatus } from '../types';
import { storeStatusLabels } from '../utils/serviceHelpers';

interface ServiceStatusChipProps {
  serviceName: string;
  status: ServiceStatus;
  label?: string;
  onClick?: () => void;
}

const chipStyles: Record<ServiceStatus, { bg: string; color: string; border: string }> = {
  active: { bg: '#f6ffed', color: '#389e0d', border: '#b7eb8f' },
  not_opened: { bg: '#fafafa', color: '#bfbfbf', border: '#e8e8e8' },
  expired: { bg: '#fff2f0', color: '#cf1322', border: '#ffa39e' },
  expiring_soon: { bg: '#fff7e6', color: '#d46b08', border: '#ffd591' },
};

const shortLabels: Record<ServiceStatus, string> = {
  active: '已开',
  not_opened: '未开',
  expired: '过期',
  expiring_soon: '临期',
};

export default function ServiceStatusChip({
  serviceName,
  status,
  label,
  onClick,
}: ServiceStatusChipProps) {
  const style = chipStyles[status];
  const fullLabel = label ?? storeStatusLabels[status];
  const shortLabel = label ? label.replace('继承平台 · ', '继承·') : shortLabels[status];

  return (
    <Tooltip title={`${serviceName}：${fullLabel}（点击管理）`}>
      <button
        type="button"
        className="service-status-chip"
        style={{
          background: style.bg,
          color: style.color,
          borderColor: style.border,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        <span className="service-status-chip-name">{serviceName}</span>
        <span className="service-status-chip-divider">·</span>
        <span className="service-status-chip-status">{shortLabel}</span>
      </button>
    </Tooltip>
  );
}
