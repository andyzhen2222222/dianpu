import { LinkOutlined, ShopOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Form, Input, Steps } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformSelectGrid from '../components/auth/PlatformSelectGrid';
import { findPlatformCatalog } from '../data/platformCatalog';
import { useStoreModule } from '../context/StoreModuleContext';

export default function AddStorePage() {
  const navigate = useNavigate();
  const { bindStore } = useStoreModule();
  const [step, setStep] = useState(0);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>();
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const selectedPlatform = useMemo(
    () => (selectedPlatformId ? findPlatformCatalog(selectedPlatformId) : undefined),
    [selectedPlatformId],
  );

  const handleSelectPlatform = (platformId: string) => {
    setSelectedPlatformId(platformId);
    setStep(1);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (!selectedPlatformId) return;
    bindStore({ ...values, platform: selectedPlatformId });
    navigate('/auth');
  };

  return (
    <div className="page-container add-store-page">
      <Breadcrumb
        className="add-store-breadcrumb"
        items={[
          { title: <HomeOutlined />, href: '/manage' },
          { title: '店铺管理' },
          { title: '添加店铺' },
        ]}
      />

      <Steps
        className="add-store-steps"
        current={step}
        items={[
          {
            title: '选择平台',
            icon: <ShopOutlined />,
          },
          {
            title: '绑定店铺',
            icon: <LinkOutlined />,
          },
        ]}
      />

      {step === 0 && (
        <PlatformSelectGrid
          search={search}
          onSearchChange={setSearch}
          onSelect={handleSelectPlatform}
        />
      )}

      {step === 1 && selectedPlatform && (
        <div className="bind-store-panel">
          <div className="bind-store-platform-bar">
            <span
              className="platform-logo"
              style={{ background: selectedPlatform.logoColor ?? '#ff8c00' }}
            >
              {selectedPlatform.logo}
            </span>
            <div>
              <div className="bind-store-platform-name">{selectedPlatform.name}</div>
              <Button type="link" size="small" onClick={() => setStep(0)}>
                重新选择平台
              </Button>
            </div>
          </div>

          <Form form={form} layout="vertical" className="bind-store-form">
            <Form.Item
              name="storeName"
              label="店铺名称"
              rules={[{ required: true, message: '请输入店铺名称' }]}
            >
              <Input placeholder="请输入店铺名称" />
            </Form.Item>
            <Form.Item
              name="apiKey"
              label="apiKey"
              rules={[{ required: true, message: '请输入 apiKey' }]}
            >
              <Input placeholder="请输入 apiKey" />
            </Form.Item>
            <Form.Item
              name="shopId"
              label="shopId"
              rules={[{ required: true, message: '请输入 shopId' }]}
            >
              <Input placeholder="请输入 shopId" />
            </Form.Item>
            <Form.Item name="deShopId" label="deShopId（德国站）">
              <Input placeholder="德国站点 shopId" />
            </Form.Item>
            <Form.Item name="esShopId" label="esShopId（西班牙站）">
              <Input placeholder="西班牙站点 shopId" />
            </Form.Item>
            <Form.Item name="frShopId" label="frShopId（法国站）">
              <Input placeholder="法国站点 shopId" />
            </Form.Item>
            <Form.Item name="itShopId" label="itShopId（意大利站）">
              <Input placeholder="意大利站点 shopId" />
            </Form.Item>
            <Form.Item name="ukShopId" label="ukShopId（英国站）">
              <Input placeholder="英国站点 shopId" />
            </Form.Item>
          </Form>

          <div className="bind-store-actions">
            <Button onClick={() => setStep(0)}>上一步</Button>
            <Button type="primary" onClick={handleSubmit}>
              确认绑定
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
