import {
  CheckCircleOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  HomeOutlined,
  LinkOutlined,
  RiseOutlined,
  ShopOutlined,
  ShoppingOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Form, Input, Modal, Result, Spin, Steps } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformSelectGrid from '../components/auth/PlatformSelectGrid';
import PlatformLogo from '../components/PlatformLogo';
import { findPlatformCatalog } from '../data/platformCatalog';
import { useStoreModule } from '../context/StoreModuleContext';

const AUTH_HELP_URL = 'https://docs.nezha.tech/store-auth-help';

const successActions = [
  {
    key: 'repricing',
    label: '去调价',
    func: 'repricing',
    icon: <RiseOutlined />,
    primary: true,
  },
  {
    key: 'resale',
    label: '去跟卖',
    func: 'resale',
    icon: <ShoppingOutlined />,
  },
  {
    key: 'listing',
    label: '去刊登',
    func: 'listing',
    icon: <UploadOutlined />,
  },
  {
    key: 'customerService',
    label: '回客服',
    func: 'customerService',
    icon: <CustomerServiceOutlined />,
  },
] as const;

function simulateAuth(values: Record<string, string>) {
  if (values.apiKey?.trim().toLowerCase() === 'fail') {
    return {
      ok: false as const,
      message: '平台返回授权失败，请核对 apiKey 与 shopId 是否与卖家后台一致。',
    };
  }
  return { ok: true as const };
}

export default function AddStorePage() {
  const navigate = useNavigate();
  const { bindStore } = useStoreModule();
  const [step, setStep] = useState(0);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>();
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [failOpen, setFailOpen] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [boundStoreName, setBoundStoreName] = useState('');
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

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const authResult = simulateAuth(values);
    if (!authResult.ok) {
      setFailMessage(authResult.message);
      setFailOpen(true);
      setSubmitting(false);
      return;
    }

    bindStore({ ...values, platform: selectedPlatformId });
    setBoundStoreName(values.storeName);
    setSubmitting(false);
    setStep(2);
  };

  const handleRetry = () => {
    setFailOpen(false);
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
          { title: '选择平台', icon: <ShopOutlined /> },
          { title: '绑定店铺', icon: <LinkOutlined /> },
          { title: '授权完成', icon: <CheckCircleOutlined /> },
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
        <Spin spinning={submitting} tip="正在验证授权信息...">
          <div className="bind-store-panel">
            <div className="bind-store-platform-bar">
              <PlatformLogo
                platformId={selectedPlatform.id}
                fallback={selectedPlatform.logo}
                logoColor={selectedPlatform.logoColor}
                className="platform-logo"
              />
              <div>
                <div className="bind-store-platform-name">{selectedPlatform.name}</div>
                <Button type="link" size="small" disabled={submitting} onClick={() => setStep(0)}>
                  重新选择平台
                </Button>
              </div>
            </div>

            <Form form={form} layout="vertical" className="bind-store-form" disabled={submitting}>
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
                extra="用于平台 API 授权验证"
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
              <Button disabled={submitting} onClick={() => setStep(0)}>
                上一步
              </Button>
              <Button type="primary" loading={submitting} onClick={handleSubmit}>
                {submitting ? '授权验证中...' : '提交授权'}
              </Button>
            </div>
          </div>
        </Spin>
      )}

      {step === 2 && selectedPlatform && (
        <div className="auth-result-panel">
          <Result
            status="success"
            title="授权成功"
            subTitle={
              <>
                <strong>{selectedPlatform.name}</strong> · {boundStoreName} 已完成绑定
              </>
            }
          />
          <div className="auth-success-tip">店铺已就绪，可立即开通以下功能：</div>
          <div className="auth-success-actions">
            {successActions.map((action) => (
              <Button
                key={action.key}
                type={'primary' in action && action.primary ? 'primary' : 'default'}
                icon={action.icon}
                size="large"
                className="auth-success-action-btn"
                onClick={() => navigate(`/activate?func=${action.func}`)}
              >
                {action.label}
              </Button>
            ))}
          </div>
          <div className="auth-result-footer">
            <Button type="link" onClick={() => navigate('/auth')}>
              返回授权店铺列表
            </Button>
            <Button type="link" onClick={() => navigate('/manage')}>
              前往服务管理
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={failOpen}
        title="授权失败"
        onCancel={handleRetry}
        footer={[
          <Button key="retry" onClick={handleRetry}>
            重新填写
          </Button>,
          <Button
            key="help"
            type="primary"
            icon={<FileTextOutlined />}
            href={AUTH_HELP_URL}
            target="_blank"
            rel="noreferrer"
          >
            查看授权帮助文档
          </Button>,
        ]}
      >
        <p className="auth-fail-message">{failMessage}</p>
        <p className="auth-fail-hint">
          请确认 apiKey、shopId 填写正确，且店铺在平台后台处于可授权状态。如需分步排查，请查看授权帮助文档。
        </p>
      </Modal>
    </div>
  );
}
