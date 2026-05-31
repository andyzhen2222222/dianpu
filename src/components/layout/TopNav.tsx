import {
  DownloadOutlined,
  DownOutlined,
  ShoppingCartOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import MiniProgramEntry from './MiniProgramEntry';

const { Header } = Layout;

const navItems = [
  '订单',
  '商品',
  'AI跟卖',
  'AI调价',
  'AI刊登',
  '客服',
  '工具',
];

const purchaseMenuItems = [
  { key: '/activate', label: '功能套餐' },
  { key: '/value-added', label: '增值资源' },
];

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onAuthPage =
    pathname.startsWith('/auth') || pathname.startsWith('/stores');
  const onPurchasePage =
    pathname.startsWith('/activate') || pathname.startsWith('/value-added');

  return (
    <Header className="top-nav">
      <div className="top-nav-left">
        <div className="logo" onClick={() => navigate('/stores')} role="button" tabIndex={0}>
          <RobotOutlined className="logo-icon" />
          <span className="logo-text">哪吒科技</span>
        </div>
        <Menu
          mode="horizontal"
          selectable={false}
          className="top-nav-menu"
          items={navItems.map((label) => ({ key: label, label }))}
        />
      </div>
      <div className="top-nav-right">
        <Button
          className={`nav-btn-outline ${onAuthPage ? 'nav-btn-active' : ''}`}
          onClick={() => navigate('/auth/add')}
        >
          授权店铺
        </Button>
        <Dropdown
          menu={{
            items: purchaseMenuItems,
            onClick: ({ key }) => navigate(key),
          }}
        >
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            className={onPurchasePage ? 'nav-btn-primary-active' : ''}
            onClick={() => navigate('/activate')}
          >
            购买套餐
            <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
          </Button>
        </Dropdown>
        <MiniProgramEntry />
        <Button type="link" icon={<DownloadOutlined />} className="nav-link">
          下载插件
        </Button>
        <Dropdown
          menu={{
            items: [
              { key: 'profile', label: '个人中心' },
              { key: 'logout', label: '退出登录' },
            ],
          }}
        >
          <div className="user-dropdown">
            <Avatar size={28} style={{ background: '#FF8C00' }}>
              日
            </Avatar>
            <span>日不落大卖号</span>
            <DownOutlined style={{ fontSize: 10 }} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
