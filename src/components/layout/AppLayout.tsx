import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const { Content } = Layout;

export default function AppLayout() {
  return (
    <Layout className="app-layout">
      <TopNav />
      <Layout>
        <Sidebar />
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
