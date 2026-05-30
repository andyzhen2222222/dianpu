import { Tooltip } from 'antd';
import type { ManageState } from '../utils/manageState';
import { manageStateLabels } from '../utils/manageState';

const stateStyles: Record<
  ManageState,
  { color: string; bg: string; dot: string; border: string }
> = {
  normal: { color: '#389e0d', bg: '#f6ffed', dot: '#52c41a', border: '#b7eb8f' },
  expiring: { color: '#d46b08', bg: '#fff7e6', dot: '#fa8c16', border: '#ffd591' },
  expired: { color: '#cf1322', bg: '#fff2f0', dot: '#ff4d4f', border: '#ffa39e' },
  paused: { color: '#8c8c8c', bg: '#fafafa', dot: '#bfbfbf', border: '#e8e8e8' },
  not_opened: { color: '#bfbfbf', bg: '#fafafa', dot: '#d9d9d9', border: '#f0f0f0' },
};

interface ManageServiceCellProps {
  manageState: ManageState;
  expireAt?: string;
  onEnable?: () => void;
  onPause?: () => void;
  onRenew?: () => void;
}

function ExpireDate({
  date,
  manageState,
}: {
  date?: string;
  manageState: ManageState;
}) {
  if (!date) {
    return (
      <Tooltip title="暂无到期时间">
        <span className="manage-service-expire empty">-</span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`到期时间：${date}`}>
      <span
        className={`manage-service-expire ${manageState === 'expired' ? 'expired' : ''} ${manageState === 'expiring' ? 'expiring' : ''}`}
      >
        {date}
      </span>
    </Tooltip>
  );
}

function ManageActions({
  manageState,
  onEnable,
  onPause,
  onRenew,
}: Pick<
  ManageServiceCellProps,
  'manageState' | 'onEnable' | 'onPause' | 'onRenew'
>) {
  const links: {
    key: string;
    label: string;
    onClick?: () => void;
    variant: 'primary' | 'default';
  }[] = [];

  switch (manageState) {
    case 'normal':
      if (onRenew) links.push({ key: 'renew', label: '续费', onClick: onRenew, variant: 'primary' });
      if (onPause) links.push({ key: 'pause', label: '暂停', onClick: onPause, variant: 'default' });
      break;
    case 'expiring':
      if (onRenew) links.push({ key: 'renew', label: '续费', onClick: onRenew, variant: 'primary' });
      if (onPause) links.push({ key: 'pause', label: '暂停', onClick: onPause, variant: 'default' });
      break;
    case 'expired':
      if (onRenew) links.push({ key: 'renew', label: '续费', onClick: onRenew, variant: 'primary' });
      break;
    case 'paused':
      if (onEnable) links.push({ key: 'enable', label: '开启', onClick: onEnable, variant: 'primary' });
      break;
    case 'not_opened':
      if (onEnable) links.push({ key: 'enable', label: '开启', onClick: onEnable, variant: 'primary' });
      break;
  }

  if (links.length === 0) return null;

  return (
    <div className="manage-service-actions">
      {links.map((link) => (
        <button
          key={link.key}
          type="button"
          className={`manage-action-btn manage-action-btn-${link.variant}`}
          onClick={(e) => {
            e.stopPropagation();
            link.onClick?.();
          }}
        >
          {link.label}
        </button>
      ))}
    </div>
  );
}

export default function ManageServiceCell({
  manageState,
  expireAt,
  onEnable,
  onPause,
  onRenew,
}: ManageServiceCellProps) {
  const style = stateStyles[manageState];
  const hasActions =
    manageState === 'normal' ||
    manageState === 'expiring' ||
    manageState === 'expired' ||
    manageState === 'paused' ||
    manageState === 'not_opened';

  return (
    <div className="manage-service-cell">
      <div
        className="manage-service-status"
        style={{ borderColor: style.border, background: style.bg }}
      >
        <span className="manage-state-badge" style={{ color: style.color }}>
          <span className="manage-state-dot" style={{ background: style.dot }} />
          {manageStateLabels[manageState]}
        </span>
        <ExpireDate date={expireAt} manageState={manageState} />
      </div>
      {hasActions && (
        <ManageActions
          manageState={manageState}
          onEnable={onEnable}
          onPause={onPause}
          onRenew={onRenew}
        />
      )}
    </div>
  );
}
