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
  month: 498 + 98 + 498 + 498, // 1592
  quarter: 1098 + 268 + 1038 + 1098, // 3502
  year: 3888 + 998 + 3858 + 3888, // 12632
} as const;

export const superMemberPlans: SuperMemberPlan[] = [
  {
    id: '1m',
    label: '月卡',
    price: 1158,
    originalPrice: separatePrice.month,
    packageName: '组合套餐月卡',
  },
  {
    id: '1q',
    label: '季卡',
    price: 2069,
    originalPrice: separatePrice.quarter,
    packageName: '组合套餐季卡',
    recommended: true,
  },
  {
    id: '1y',
    label: '年卡',
    price: 6109,
    originalPrice: separatePrice.year,
    packageName: '组合套餐年卡',
  },
];

export const superMemberFeatures = [
  { key: 'repricing', label: '调价', level: '店铺' },
  { key: 'customerService', label: '客服', level: '店铺' },
  { key: 'resale', label: '跟卖', level: '平台' },
  { key: 'listing', label: '刊登', level: '平台' },
];
