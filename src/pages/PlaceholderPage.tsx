import { Empty } from 'antd';
import PageHeader from '../components/PageHeader';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export default function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div className="page-container">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="page-section placeholder-section">
        <Empty description="功能开发中，敬请期待" />
      </div>
    </div>
  );
}
