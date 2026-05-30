export interface SuperMemberPlan {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  packageName: string;
  recommended?: boolean;
}

export const superMemberPlans: SuperMemberPlan[] = [
  {
    id: '1m',
    label: '月卡',
    price: 1299,
    originalPrice: 1633,
    packageName: '超级会员月卡',
  },
  {
    id: '1q',
    label: '季卡',
    price: 3299,
    originalPrice: 4599,
    packageName: '超级会员季卡',
    recommended: true,
  },
  {
    id: '1y',
    label: '年卡',
    price: 9999,
    originalPrice: 15999,
    packageName: '超级会员年卡',
  },
];

export const superMemberFeatures = [
  { key: 'repricing', label: '调价', level: '店铺' },
  { key: 'customerService', label: '客服', level: '店铺' },
  { key: 'resale', label: '跟卖', level: '平台' },
  { key: 'listing', label: '刊登', level: '平台' },
];
