import { hubStatusToneStyles, type HubStatusTone } from './hubStyles';

interface HubStatusProps {
  label: string;
  tone: HubStatusTone;
  meta?: string[];
}

export default function HubStatus({ label, tone, meta }: HubStatusProps) {
  const style = hubStatusToneStyles[tone];

  return (
    <div className="hub-status">
      <div className="hub-status-main">
        <span className="hub-status-dot" style={{ background: style.dot }} />
        <span className="hub-status-label" style={{ color: style.color }}>
          {label}
        </span>
      </div>
      {meta && meta.length > 0 && (
        <div className="hub-status-meta-list">
          {meta.map((item) => (
            <span key={item} className="hub-status-meta">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
