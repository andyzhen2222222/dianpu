import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useMemo } from 'react';
import {
  getFeatureLabel,
  platformCatalog,
  type PlatformCatalogItem,
} from '../../data/platformCatalog';

interface PlatformSelectGridProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (platformId: string) => void;
}

function PlatformCard({
  platform,
  onSelect,
}: {
  platform: PlatformCatalogItem;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="platform-select-card"
      onClick={() => onSelect(platform.id)}
    >
      <div
        className="platform-select-logo"
        style={{ background: platform.logoColor ?? '#f5f5f5', color: platform.logoColor ? '#fff' : '#595959' }}
      >
        {platform.logo}
      </div>
      <div className="platform-select-name">{platform.name}</div>
      <div className="platform-select-features">
        <span className="platform-select-features-label">支持功能</span>
        {platform.features.map((f) => (
          <span key={f} className="platform-feature-tag">
            {getFeatureLabel(f)}
          </span>
        ))}
      </div>
    </button>
  );
}

export default function PlatformSelectGrid({
  search,
  onSearchChange,
  onSelect,
}: PlatformSelectGridProps) {
  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return platformCatalog;
    return platformCatalog.filter((p) =>
      p.name.toLowerCase().includes(keyword),
    );
  }, [search]);

  return (
    <div className="platform-select-section">
      <div className="platform-select-toolbar">
        <Input
          placeholder="搜索平台名"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 280 }}
          allowClear
        />
        <a className="platform-select-link" href="#open-store">
          感兴趣的平台还没店铺？去开店
        </a>
      </div>

      <div className="platform-select-grid">
        {filtered.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
