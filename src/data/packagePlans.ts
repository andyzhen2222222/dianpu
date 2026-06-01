import type { ServiceKey } from '../types';

export type BillingLevel = 'store' | 'platform';

export interface PlanColumn {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  recommended?: boolean;
  trial?: boolean;
}

export interface PlanFeatureRow {
  label: string;
  values: string[];
}

export interface FunctionPackageConfig {
  key: ServiceKey;
  label: string;
  level: BillingLevel;
  targetLabel: string;
  columns: PlanColumn[];
  features: PlanFeatureRow[];
}

export const functionPackages: FunctionPackageConfig[] = [
  {
    key: 'repricing',
    label: '调价',
    level: 'store',
    targetLabel: '续费店铺',
    columns: [
      { id: 'free', title: '免费', price: 0, priceUnit: '/店' },
      { id: '1w', title: '1周/店', price: 139, priceUnit: '/店' },
      { id: '1m', title: '1月/店', price: 498, priceUnit: '/店' },
      { id: '1q', title: '1季度/店', price: 1098, priceUnit: '/店', recommended: true },
      { id: '1y', title: '1年/店', price: 3888, priceUnit: '/店' },
    ],
    features: [
      { label: '价格', values: ['0/店', '139/店', '498/店', '1098/店', '3888/店'] },
      { label: '绑定店铺数', values: ['不限', '不限', '不限', '不限', '不限'] },
      { label: '调价店铺数', values: ['前2个店铺3天试用', '1个店铺', '1个店铺', '1个店铺', '1个店铺'] },
      { label: '调价商品数量', values: ['不限', '不限', '不限', '不限', '不限'] },
      { label: '产品管理', values: ['支持', '支持', '支持', '支持', '支持'] },
    ],
  },
  {
    key: 'resale',
    label: '跟卖',
    level: 'platform',
    targetLabel: '续费平台',
    columns: [
      { id: '1m', title: '1月/平台', price: 498, priceUnit: '/平台' },
      { id: '1q', title: '1季度/平台', price: 1038, priceUnit: '/平台', recommended: true },
      { id: '1y', title: '1年/平台', price: 3858, priceUnit: '/平台' },
    ],
    features: [
      { label: '价格', values: ['498/平台', '1038/平台', '3858/平台'] },
      {
        label: '产品采集',
        values: [
          '不限（保留30天）',
          '不限（保留30天）',
          '不限（保留30天）',
        ],
      },
      { label: '跟卖商品数', values: ['30000', '120000', '9999999'] },
      { label: '绑定店铺数', values: ['不限', '不限', '不限'] },
    ],
  },
  {
    key: 'listing',
    label: '刊登',
    level: 'platform',
    targetLabel: '续费平台',
    columns: [
      { id: 'trial', title: '1分试用', price: 0.01, priceUnit: '/平台', trial: true },
      { id: 'startup', title: '月卡-初创版', price: 139, priceUnit: '/平台' },
      { id: '1m', title: '月卡', price: 498, priceUnit: '/平台' },
      { id: '1q', title: '季卡', price: 1098, priceUnit: '/平台' },
      { id: '1y', title: '年卡', price: 3888, priceUnit: '/平台' },
    ],
    features: [
      { label: '价格', values: ['0.01/平台', '139/平台', '498/平台', '1098/平台', '3888/平台'] },
      { label: '产品采集', values: ['500（保留30天）', '500（保留30天）', '500（保留30天）', '500（保留30天）', '500（保留30天）'] },
      { label: '刊登商品数', values: ['500', '5000', '30000', '120000', '9999999'] },
      { label: '赠送资源点', values: ['0点/账号', '0点/账号', '0点/账号', '0点/账号', '0点/账号'] },
      { label: '免费图片空间', values: ['50MB', '50MB', '50MB', '200MB', '1000MB'] },
      { label: '绑定店铺数', values: ['不限', '不限', '不限', '不限', '不限'] },
      { label: 'AI改写/翻译', values: ['使用资源点', '使用资源点', '使用资源点', '使用资源点', '使用资源点'] },
      { label: 'AI图片翻译', values: ['使用资源点', '使用资源点', '使用资源点', '使用资源点', '使用资源点'] },
    ],
  },
  {
    key: 'customerService',
    label: '客服',
    level: 'store',
    targetLabel: '续费店铺',
    columns: [
      { id: '1m', title: '1月/店', price: 98, priceUnit: '/店' },
      { id: '1q', title: '1季度/店', price: 268, priceUnit: '/店', recommended: true },
      { id: '1y', title: '1年/店', price: 998, priceUnit: '/店' },
    ],
    features: [
      { label: '价格', values: ['98/店', '268/店', '998/店'] },
      { label: '绑定店铺数', values: ['1个店铺', '1个店铺', '1个店铺'] },
      { label: '客服坐席', values: ['1个', '1个', '1个'] },
      { label: '消息记录', values: ['保留90天', '保留90天', '保留90天'] },
    ],
  },
];

export function getFunctionPackage(key: ServiceKey) {
  return functionPackages.find((f) => f.key === key) ?? functionPackages[0];
}
