import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { StoreModuleProvider } from './context/StoreModuleContext';
import AddStorePage from './pages/AddStorePage';
import StoresPage from './pages/StoresPage';
import ServiceActivationPage from './pages/ServiceActivationPage';
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
              <Route index element={<Navigate to="/stores" replace />} />
              <Route path="stores" element={<StoresPage />} />
              <Route path="auth" element={<Navigate to="/stores?panel=auth" replace />} />
              <Route path="auth/add" element={<AddStorePage />} />
              <Route path="sync" element={<Navigate to="/stores?panel=sync" replace />} />
              <Route path="activate" element={<ServiceActivationPage />} />
              <Route path="value-added" element={<ValueAddedResourcesPage />} />
              <Route path="manage" element={<Navigate to="/stores?panel=service" replace />} />
              <Route path="*" element={<Navigate to="/stores" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StoreModuleProvider>
    </ConfigProvider>
  );
}

export default App;
