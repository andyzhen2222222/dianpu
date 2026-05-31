import HubActions from './store-hub/HubActions';
import HubStatus from './store-hub/HubStatus';
import {
  formatShortDate,
  manageStateLabel,
  manageStateTone,
  type HubAction,
} from './store-hub/hubStyles';
import type { ManageState } from '../utils/manageState';

interface ManageServiceCellProps {
  manageState: ManageState;
  expireAt?: string;
  onEnable?: () => void;
  onPause?: () => void;
  onRenew?: () => void;
}

function buildActions(
  manageState: ManageState,
  onEnable?: () => void,
  onPause?: () => void,
  onRenew?: () => void,
): HubAction[] {
  switch (manageState) {
    case 'normal':
    case 'expiring':
      return [
        ...(onRenew ? [{ key: 'renew', label: '续费', primary: true, onClick: onRenew }] : []),
        ...(onPause ? [{ key: 'pause', label: '暂停', onClick: onPause }] : []),
      ];
    case 'expired':
      return onRenew ? [{ key: 'renew', label: '续费', primary: true, onClick: onRenew }] : [];
    case 'paused':
      return onEnable ? [{ key: 'enable', label: '开启', primary: true, onClick: onEnable }] : [];
    case 'not_opened':
      return onEnable ? [{ key: 'activate', label: '开通', primary: true, onClick: onEnable }] : [];
    default:
      return [];
  }
}

export default function ManageServiceCell({
  manageState,
  expireAt,
  onEnable,
  onPause,
  onRenew,
}: ManageServiceCellProps) {
  const shortExpire = formatShortDate(expireAt);
  const statusMeta = shortExpire ? [`到期 ${shortExpire}`] : undefined;

  return (
    <div className="manage-service-cell">
      <HubStatus
        label={manageStateLabel(manageState)}
        tone={manageStateTone(manageState)}
        meta={statusMeta}
      />
      <HubActions
        actions={buildActions(manageState, onEnable, onPause, onRenew)}
      />
    </div>
  );
}
