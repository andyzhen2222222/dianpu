import { MobileOutlined, RobotOutlined, WechatOutlined } from '@ant-design/icons';
import { Popover, QRCode } from 'antd';

function MiniProgramQrPopover() {
  return (
    <div className="mini-program-card">
      <div className="mini-program-card-head">
        <WechatOutlined className="mini-program-card-wechat" />
        <span>哪吒小程序</span>
      </div>

      <div className="mini-program-qr-wrap">
        <QRCode
          value="https://nezha.tech/mini-program"
          size={128}
          bordered={false}
          color="#07C160"
          bgColor="#FFFFFF"
          errorLevel="H"
        />
        <div className="mini-program-qr-badge">
          <RobotOutlined />
        </div>
      </div>

      <p className="mini-program-card-desc">查订单，回客服</p>
      <p className="mini-program-card-hint">微信扫一扫</p>
    </div>
  );
}

export default function MiniProgramEntry() {
  return (
    <Popover
      content={<MiniProgramQrPopover />}
      title={null}
      trigger={['hover', 'click']}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      overlayClassName="mini-program-popover"
      mouseEnterDelay={0.05}
      mouseLeaveDelay={0.2}
    >
      <button type="button" className="nav-mobile-entry" aria-label="手机端小程序，查订单、回客服">
        <span className="nav-mobile-icon-wrap" aria-hidden="true">
          <MobileOutlined className="nav-mobile-icon" />
        </span>
        <span className="nav-mobile-subtitle">查订单，回客服</span>
      </button>
    </Popover>
  );
}
