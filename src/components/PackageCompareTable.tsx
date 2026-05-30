import { CheckOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { FunctionPackageConfig } from '../data/packagePlans';

interface PackageCompareTableProps {
  config: FunctionPackageConfig;
  onPurchase: (planId: string, planTitle: string) => void;
}

export default function PackageCompareTable({
  config,
  onPurchase,
}: PackageCompareTableProps) {
  const { columns, features } = config;

  return (
    <div className="package-compare-wrap">
      <table className="package-compare-table">
        <thead>
          <tr>
            <th className="package-feature-col" />
            {columns.map((col) => (
              <th
                key={col.id}
                className={`package-plan-col ${col.recommended ? 'recommended' : ''}`}
              >
                {col.recommended && (
                  <span className="package-recommend-badge">推荐</span>
                )}
                <div className="package-plan-title">{col.title}</div>
                <Button
                  type="primary"
                  size="small"
                  className="package-buy-btn"
                  onClick={() => onPurchase(col.id, col.title)}
                >
                  购买
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((row) => (
            <tr key={row.label}>
              <td className="package-feature-label">{row.label}</td>
              {row.values.map((val, i) => (
                <td
                  key={`${row.label}-${i}`}
                  className={`package-feature-value ${columns[i]?.recommended ? 'recommended' : ''}`}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface FunctionTabSelectorProps {
  functions: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

export function FunctionTabSelector({
  functions,
  active,
  onChange,
}: FunctionTabSelectorProps) {
  return (
    <div className="function-tab-selector">
      {functions.map((fn) => {
        const selected = fn.key === active;
        return (
          <button
            key={fn.key}
            type="button"
            className={`function-tab ${selected ? 'function-tab-active' : ''}`}
            onClick={() => onChange(fn.key)}
          >
            {selected && <CheckOutlined className="function-tab-check" />}
            {fn.label}
          </button>
        );
      })}
    </div>
  );
}
