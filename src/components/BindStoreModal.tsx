import { Form, Input, Modal, Select, message } from 'antd';

interface BindStoreModalProps {
  open: boolean;
  platformOptions: { label: string; value: string }[];
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

export default function BindStoreModal({
  open,
  platformOptions,
  onClose,
  onSubmit,
}: BindStoreModalProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      message.success('店铺绑定成功');
      onClose();
    } catch {
      /* validation failed */
    }
  };

  return (
    <Modal
      title="绑定平台店铺"
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      okText="确认绑定"
      cancelText="取消"
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="storeName"
          label="店铺名称"
          rules={[{ required: true, message: '请输入店铺名称' }]}
        >
          <Input placeholder="请输入店铺名称" />
        </Form.Item>
        <Form.Item
          name="platform"
          label="所属平台"
          rules={[{ required: true, message: '请选择平台' }]}
        >
          <Select placeholder="请选择平台" options={platformOptions} />
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
    </Modal>
  );
}
