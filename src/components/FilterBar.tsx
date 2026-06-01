import { Button, Input, Select, Segmented } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FilterValues, ViewMode } from '../types';

interface FilterBarProps {
  filters: FilterValues;
  viewMode: ViewMode;
  platformOptions: { label: string; value: string }[];
  onChange: (filters: FilterValues) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSearch: () => void;
  onReset: () => void;
}

const serviceOptions = [
  { label: '全部服务', value: '' },
  { label: 'AI调价', value: 'repricing' },
  { label: '客服', value: 'customerService' },
  { label: 'AI跟卖', value: 'resale' },
  { label: 'AI刊登', value: 'listing' },
];

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '已开通', value: 'active' },
  { label: '未开通', value: 'not_opened' },
  { label: '已过期', value: 'expired' },
  { label: '快到期', value: 'expiring_soon' },
  { label: '授权异常', value: 'auth_abnormal' },
];

export default function FilterBar({
  filters,
  viewMode,
  platformOptions,
  onChange,
  onViewModeChange,
  onSearch,
  onReset,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-left">
        <Select
          placeholder="平台"
          allowClear
          style={{ width: 140 }}
          options={[{ label: '全部平台', value: '' }, ...platformOptions]}
          value={filters.platform ?? ''}
          onChange={(v) => onChange({ ...filters, platform: v || undefined })}
        />
        <Select
          placeholder="服务"
          allowClear
          style={{ width: 140 }}
          options={serviceOptions}
          value={filters.service ?? ''}
          onChange={(v) =>
            onChange({ ...filters, service: (v || undefined) as FilterValues['service'] })
          }
        />
        <Select
          placeholder="状态"
          allowClear
          style={{ width: 140 }}
          options={statusOptions}
          value={filters.status ?? ''}
          onChange={(v) =>
            onChange({
              ...filters,
              status: (v || undefined) as FilterValues['status'],
            })
          }
        />
        <Input
          placeholder="搜索店铺名称"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          style={{ width: 200 }}
          value={filters.storeName}
          onChange={(e) =>
            onChange({ ...filters, storeName: e.target.value || undefined })
          }
          onPressEnter={onSearch}
        />
        <Button type="primary" onClick={onSearch}>
          查询
        </Button>
        <Button onClick={onReset}>重置</Button>
      </div>
      <Segmented
        value={viewMode}
        onChange={(v) => onViewModeChange(v as ViewMode)}
        options={[
          { label: '按平台分组', value: 'group' },
          { label: '按店铺平铺', value: 'flat' },
        ]}
      />
    </div>
  );
}
