import {
  ShopOutlined,
  AppstoreOutlined,
  ControlOutlined,
  BarChartOutlined,
  BellOutlined,
  FileTextOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const menuItems = [
  { key: '/auth', icon: <ShopOutlined />, label: '授权店铺' },
  { key: '/activate', icon: <AppstoreOutlined />, label: '服务开通' },
  { key: '/value-added', icon: <GiftOutlined />, label: '增值资源' },
  { key: '/manage', icon: <ControlOutlined />, label: '服务管理' },
  { type: 'divider' as const },
  { key: '/usage', icon: <BarChartOutlined />, label: '服务使用明细' },
  { key: '/reminder', icon: <BellOutlined />, label: '到期提醒' },
  { key: '/logs', icon: <FileTextOutlined />, label: '操作日志' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const selectedKey = pathname.startsWith('/auth')
    ? '/auth'
    : pathname.startsWith('/activate')
    ? '/activate'
    : pathname.startsWith('/value-added')
      ? '/value-added'
      : pathname === '/'
        ? '/manage'
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
