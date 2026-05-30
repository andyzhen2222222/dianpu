import { MobileOutlined, WechatOutlined } from '@ant-design/icons';
import { Popover, QRCode } from 'antd';

const MINI_FEATURES = [
  '随时查看订单进度与详情',
  '手机端快速回复买家客服消息',
  '店铺服务状态一目了然',
];

function MiniProgramQrPopover() {
  return (
    <div className="mini-program-qr-popover">
      <div className="mini-program-qr-popover-header">
        <WechatOutlined className="mini-program-qr-wechat-icon" />
        <div>
          <p className="mini-program-qr-popover-title">微信扫码 · 查订单，回客服</p>
          <p className="mini-program-qr-popover-subtitle">哪吒小程序，手机上也能处理日常事务</p>
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
      <button type="button" className="nav-mobile-entry" aria-label="手机端小程序，查订单、回客服">
        <span className="nav-mobile-icon-wrap" aria-hidden="true">
          <MobileOutlined className="nav-mobile-icon" />
        </span>
        <span className="nav-mobile-subtitle">查订单，回客服</span>
      </button>
    </Popover>
  );
}
