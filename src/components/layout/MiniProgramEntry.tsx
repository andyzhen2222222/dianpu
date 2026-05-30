import { MobileOutlined, WechatOutlined } from '@ant-design/icons';
import { Popover, QRCode } from 'antd';

const MINI_FEATURES = [
  '随时随地查看订单',
  '移动端快速回复客服',
  '店铺服务状态一目了然',
];

function MiniProgramQrPopover() {
  return (
    <div className="mini-program-qr-popover">
      <div className="mini-program-qr-popover-header">
        <WechatOutlined className="mini-program-qr-wechat-icon" />
        <div>
          <p className="mini-program-qr-popover-title">微信扫码 · 打开哪吒小程序</p>
          <p className="mini-program-qr-popover-subtitle">手机端也能管理店铺与服务</p>
        </div>
      </div>
      <div className="mini-program-qr-frame">
        <QRCode
          value="https://nezha.tech/mini-program"
          size={120}
          bordered={false}
          color="#262626"
        />
      </div>
      <ul className="mini-program-qr-features">
        {MINI_FEATURES.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mini-program-qr-popover-cta">打开微信 → 扫一扫 → 立即使用</p>
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
      <button type="button" className="nav-mobile-entry" aria-label="手机端小程序">
        <span className="nav-mobile-entry-inner">
          <MobileOutlined className="nav-mobile-icon" />
          <span className="nav-mobile-text">手机端</span>
        </span>
        <span className="nav-mobile-badge">扫码</span>
      </button>
    </Popover>
  );
}
