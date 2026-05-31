import {
  ShopOutlined,
  AppstoreOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const menuItems = [
  { key: '/stores', icon: <ShopOutlined />, label: '店铺管理' },
  { key: '/activate', icon: <AppstoreOutlined />, label: '服务开通' },
  { key: '/value-added', icon: <GiftOutlined />, label: '增值资源' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectedKey = pathname.startsWith('/auth')
    ? '/stores'
    : pathname.startsWith('/stores') ||
        pathname.startsWith('/sync') ||
        pathname.startsWith('/manage')
      ? '/stores'
      : pathname.startsWith('/activate')
        ? '/activate'
        : pathname.startsWith('/value-added')
          ? '/value-added'
          : pathname === '/'
            ? '/stores'
            : pathname;

  return (
    <Sider width={220} className="app-sidebar">
      <div className="sidebar-module-title">店铺与服务管理</div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className="sidebar-menu"
        onClick={({ key }) => navigate(key)}
      />
      <div className="sidebar-mascot">
        <RobotOutlined />
      </div>
    </Sider>
  );
}
