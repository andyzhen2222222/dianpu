import { Tooltip } from 'antd';
import type { ManageState } from '../utils/manageState';
import { manageStateLabels } from '../utils/manageState';

const stateStyles: Record<ManageState, { color: string; dot: string }> = {
  normal: { color: '#389e0d', dot: '#52c41a' },
  expiring: { color: '#d46b08', dot: '#fa8c16' },
  expired: { color: '#cf1322', dot: '#ff4d4f' },
  paused: { color: '#8c8c8c', dot: '#bfbfbf' },
  not_opened: { color: '#bfbfbf', dot: '#d9d9d9' },
};

interface ManageServiceCellProps {
  manageState: ManageState;
  expireAt?: string;
  onEnable?: () => void;
  onPause?: () => void;
  onRenew?: () => void;
}

function formatShortDate(date?: string) {
  if (!date) return null;
  return date.slice(5);
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
  const links: { key: string; label: string; onClick?: () => void; primary?: boolean }[] =
    [];

  switch (manageState) {
    case 'normal':
    case 'expiring':
      if (onRenew) links.push({ key: 'renew', label: '续费', onClick: onRenew, primary: true });
      if (onPause) links.push({ key: 'pause', label: '暂停', onClick: onPause });
      break;
    case 'expired':
      if (onRenew) links.push({ key: 'renew', label: '续费', onClick: onRenew, primary: true });
      break;
    case 'paused':
    case 'not_opened':
      if (onEnable) links.push({ key: 'enable', label: '开启', onClick: onEnable, primary: true });
      break;
  }

  if (links.length === 0) return null;

  return (
    <div className="manage-service-actions">
      {links.map((link, index) => (
        <span key={link.key} className="manage-action-item">
          {index > 0 && <span className="manage-action-divider">·</span>}
          <button
            type="button"
            className={`manage-action-link ${link.primary ? 'primary' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              link.onClick?.();
            }}
          >
            {link.label}
          </button>
        </span>
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
  const shortDate = formatShortDate(expireAt);

  return (
    <div className="manage-service-cell">
      <div className="manage-service-summary">
        <span className="manage-state-dot" style={{ background: style.dot }} />
        <span className="manage-state-label" style={{ color: style.color }}>
          {manageStateLabels[manageState]}
        </span>
        {shortDate ? (
          <Tooltip title={`到期 ${expireAt}`}>
            <span
              className={`manage-service-expire ${manageState === 'expired' ? 'expired' : ''} ${manageState === 'expiring' ? 'expiring' : ''}`}
            >
              {shortDate}
            </span>
          </Tooltip>
        ) : (
          manageState !== 'not_opened' && (
            <span className="manage-service-expire empty">-</span>
          )
        )}
      </div>
      <ManageActions
        manageState={manageState}
        onEnable={onEnable}
        onPause={onPause}
        onRenew={onRenew}
      />
    </div>
  );
}
