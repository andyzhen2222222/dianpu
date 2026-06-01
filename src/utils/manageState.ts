import type { ServiceStatus } from '../types';

export type ManageState = 'normal' | 'expiring' | 'expired' | 'not_opened';

export const manageStateLabels: Record<ManageState, string> = {
  normal: '正常',
  expiring: '临期',
  expired: '到期',
  not_opened: '未开通',
};

const REFERENCE_TODAY = new Date('2026-05-30');
const EXPIRING_DAYS = 15;

export function isExpiredDate(date?: string): boolean {
  if (!date) return false;
  return new Date(date) < REFERENCE_TODAY;
}

export function isExpiringSoonDate(date?: string): boolean {
  if (!date || isExpiredDate(date)) return false;
  const expire = new Date(date);
  const diffMs = expire.getTime() - REFERENCE_TODAY.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= EXPIRING_DAYS;
}

export function resolveManageState(
  status: ServiceStatus,
  expireAt?: string,
): ManageState {
  if (status === 'not_opened') return 'not_opened';
  if (status === 'expired' || isExpiredDate(expireAt)) return 'expired';
  if (status === 'expiring_soon' || isExpiringSoonDate(expireAt)) return 'expiring';
  if (status === 'active') return 'normal';
  return 'not_opened';
}

export function resolveInheritedManageState(
  platformStatus: ServiceStatus,
  _storeUsageStatus: 'active',
  expireAt?: string,
): ManageState {
  if (platformStatus === 'not_opened') return 'not_opened';
  if (platformStatus === 'expired' || isExpiredDate(expireAt)) return 'expired';
  if (platformStatus === 'expiring_soon' || isExpiringSoonDate(expireAt)) {
    return 'expiring';
  }
  return 'normal';
}
