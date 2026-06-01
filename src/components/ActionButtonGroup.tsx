import { Button, Space } from 'antd';
import type { ServiceStatus } from '../types';

interface ActionButtonGroupProps {
  status: ServiceStatus;
  level: 'store' | 'platform' | 'inherited';
  onOpen?: () => void;
  onRenew?: () => void;
  onPlatformRenew?: () => void;
  onDetail?: () => void;
}

export default function ActionButtonGroup({
  status,
  level,
  onOpen,
  onRenew,
  onPlatformRenew,
  onDetail,
}: ActionButtonGroupProps) {
  const linkBtn = (label: string, onClick?: () => void, primary = false) =>
    onClick ? (
      <Button
        type="link"
        size="small"
        className={primary ? 'action-link-primary' : 'action-link'}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {label}
      </Button>
    ) : null;

  if (level === 'inherited') {
    if (status === 'not_opened') {
      return <Space size={0}>{linkBtn('开通平台', onOpen, true)}</Space>;
    }
    if (status === 'expired') {
      return <Space size={0}>{linkBtn('平台续费', onPlatformRenew, true)}</Space>;
    }
  }

  if (level === 'store') {
    if (status === 'active') {
      return <Space size={0}>{linkBtn('续费', onRenew, true)}</Space>;
    }
    if (status === 'not_opened') {
      return <Space size={0}>{linkBtn('开通', onOpen, true)}</Space>;
    }
    if (status === 'expired' || status === 'expiring_soon') {
      return <Space size={0}>{linkBtn('续费', onRenew, true)}</Space>;
    }
  }

  if (level === 'platform') {
    if (status === 'active') {
      return <Space size={0}>{linkBtn('续费', onRenew, true)}</Space>;
    }
    if (status === 'not_opened') {
      return <Space size={0}>{linkBtn('开通', onOpen, true)}</Space>;
    }
    if (status === 'expired') {
      return <Space size={0}>{linkBtn('续费', onRenew, true)}</Space>;
    }
  }

  if (onDetail) {
    return linkBtn('查看详情', onDetail);
  }

  return null;
}
