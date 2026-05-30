import {
  ShopOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Card, Col, Row } from 'antd';
import type { SummaryStats } from '../types';

interface SummaryCardsProps {
  stats: SummaryStats;
  activeFilter?: string;
  onCardClick?: (key: string) => void;
}

const cardConfig = [
  {
    key: 'boundStores',
    title: '已绑定店铺',
    icon: <ShopOutlined />,
    color: '#52c41a',
    bg: '#f6ffed',
  },
  {
    key: 'openedServices',
    title: '已开通服务',
    icon: <AppstoreOutlined />,
    color: '#1677ff',
    bg: '#e6f4ff',
  },
  {
    key: 'expiringSoon',
    title: '快到期',
    icon: <ClockCircleOutlined />,
    color: '#FF8C00',
    bg: '#fff7e6',
  },
  {
    key: 'expired',
    title: '已过期',
    icon: <CloseCircleOutlined />,
    color: '#ff4d4f',
    bg: '#fff2f0',
  },
  {
    key: 'authAbnormal',
    title: '授权异常',
    icon: <WarningOutlined />,
    color: '#722ed1',
    bg: '#f9f0ff',
  },
] as const;

export default function SummaryCards({
  stats,
  activeFilter,
  onCardClick,
}: SummaryCardsProps) {
  return (
    <Row gutter={16}>
      {cardConfig.map(({ key, title, icon, color, bg }) => (
        <Col flex="1" key={key}>
          <Card
            hoverable
            size="small"
            className={`summary-card ${activeFilter === key ? 'summary-card-active' : ''}`}
            onClick={() => onCardClick?.(key)}
            styles={{ body: { padding: '16px 20px' } }}
          >
            <div className="summary-card-inner">
              <div
                className="summary-card-icon"
                style={{ color, background: bg }}
              >
                {icon}
              </div>
              <div className="summary-card-content">
                <div className="summary-card-value">
                  {stats[key as keyof SummaryStats]}
                </div>
                <div className="summary-card-title">{title}</div>
              </div>
              <span className="summary-card-arrow">›</span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
