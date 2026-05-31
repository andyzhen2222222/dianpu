import { Button } from 'antd';
import StatusTag from './StatusTag';
import type { AuthStatus } from '../types';

interface AuthInfoCardProps {
  authStatus: AuthStatus;
  bindAt?: string;
  onReauth?: () => void;
}

export default function AuthInfoCard({
  authStatus,
  bindAt,
  onReauth,
}: AuthInfoCardProps) {
  return (
    <div className="auth-info-card">
      <div className="auth-info-title">授权信息</div>
      <div className="auth-info-rows">
        <div className="auth-info-row">
          <span className="auth-info-label">授权状态</span>
          <StatusTag
            status={authStatus === 'normal' ? 'active' : 'expired'}
            label={authStatus === 'normal' ? '正常' : '异常'}
          />
        </div>
        <div className="auth-info-row">
          <span className="auth-info-label">绑定时间</span>
          <span>{bindAt ?? '-'}</span>
        </div>
      </div>
      <Button size="small" onClick={onReauth}>
        重新授权
      </Button>
    </div>
  );
}
