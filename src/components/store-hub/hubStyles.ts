import type { AuthStatus, SyncStatus } from '../../types';
import type { ManageState } from '../../utils/manageState';
import { syncStatusLabels } from '../../data/syncConfig';
import { manageStateLabels } from '../../utils/manageState';

export type HubStatusTone = 'success' | 'warning' | 'danger' | 'muted' | 'info';

export const hubStatusToneStyles: Record<
  HubStatusTone,
  { dot: string; color: string }
> = {
  success: { dot: '#52c41a', color: '#389e0d' },
  warning: { dot: '#fa8c16', color: '#d46b08' },
  danger: { dot: '#ff4d4f', color: '#cf1322' },
  muted: { dot: '#bfbfbf', color: '#8c8c8c' },
  info: { dot: '#1677ff', color: '#1677ff' },
};

export function authStatusTone(status: AuthStatus): HubStatusTone {
  return status === 'normal' ? 'success' : 'danger';
}

export function authStatusLabel(status: AuthStatus): string {
  return status === 'normal' ? '正常' : '异常';
}

export function syncStatusTone(status: SyncStatus): HubStatusTone {
  switch (status) {
    case 'success':
      return 'success';
    case 'syncing':
      return 'info';
    case 'failed':
      return 'danger';
    default:
      return 'muted';
  }
}

export function syncStatusLabel(status: SyncStatus): string {
  return syncStatusLabels[status];
}

export function manageStateTone(state: ManageState): HubStatusTone {
  switch (state) {
    case 'normal':
      return 'success';
    case 'expiring':
      return 'warning';
    case 'expired':
      return 'danger';
    case 'paused':
      return 'muted';
    default:
      return 'muted';
  }
}

export function manageStateLabel(state: ManageState): string {
  return manageStateLabels[state];
}

export interface HubAction {
  key: string;
  label: string;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  confirm?: {
    title: string;
    description?: string;
  };
}

export function formatShortDate(date?: string) {
  if (!date) return null;
  return date.slice(5);
}
