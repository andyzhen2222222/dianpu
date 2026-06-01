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
  onRenew?: () => void;
}

function buildActions(
  manageState: ManageState,
  onEnable?: () => void,
  onRenew?: () => void,
): HubAction[] {
  switch (manageState) {
    case 'normal':
    case 'expiring':
      return onRenew ? [{ key: 'renew', label: '续费', primary: true, onClick: onRenew }] : [];
    case 'expired':
      return onRenew ? [{ key: 'renew', label: '续费', primary: true, onClick: onRenew }] : [];
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
        actions={buildActions(manageState, onEnable, onRenew)}
      />
    </div>
  );
}
