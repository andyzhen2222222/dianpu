import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { StoreModuleProvider } from './context/StoreModuleContext';
import AddStorePage from './pages/AddStorePage';
import AuthStoresPage from './pages/AuthStoresPage';
import ServiceActivationPage from './pages/ServiceActivationPage';
import ServiceManagementPage from './pages/ServiceManagementPage';
import ValueAddedResourcesPage from './pages/ValueAddedResourcesPage';
import './index.css';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#FF8C00',
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif',
        },
      }}
    >
      <StoreModuleProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/manage" replace />} />
              <Route path="auth" element={<AuthStoresPage />} />
              <Route path="auth/add" element={<AddStorePage />} />
              <Route path="activate" element={<ServiceActivationPage />} />
              <Route path="value-added" element={<ValueAddedResourcesPage />} />
              <Route path="manage" element={<ServiceManagementPage />} />
              <Route path="*" element={<Navigate to="/manage" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreModuleProvider>
    </ConfigProvider>
  );
}

export default App;
