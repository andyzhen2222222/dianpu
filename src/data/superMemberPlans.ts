export interface SuperMemberPlan {
  id: string;
  label: string;
  price: number;
  originalPrice: number;
  packageName: string;
  recommended?: boolean;
}

/** 单独购买参考价：调价+客服(店) + 跟卖+刊登(平台) */
const separatePrice = {
  month: 498 + 139 + 498 + 498, // 1633
  quarter: 1098 + 1098 + 1038 + 1098, // 4332
  year: 3888 + 3888 + 3858 + 3888, // 15522
} as const;

export const superMemberPlans: SuperMemberPlan[] = [
  {
    id: '1m',
    label: '月卡',
    price: 1199,
    originalPrice: separatePrice.month,
    packageName: '超级会员月卡',
  },
  {
    id: '1q',
    label: '季卡',
    price: 2899,
    originalPrice: separatePrice.quarter,
    packageName: '超级会员季卡',
    recommended: true,
  },
  {
    id: '1y',
    label: '年卡',
    price: 8999,
    originalPrice: separatePrice.year,
    packageName: '超级会员年卡',
  },
];

export const superMemberFeatures = [
  { key: 'repricing', label: '调价', level: '店铺' },
  { key: 'customerService', label: '客服', level: '店铺' },
  { key: 'resale', label: '跟卖', level: '平台' },
  { key: 'listing', label: '刊登', level: '平台' },
];
