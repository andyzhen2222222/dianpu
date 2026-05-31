import { useState } from 'react';
import { findPlatformCatalog } from '../data/platformCatalog';

interface PlatformLogoProps {
  platformId?: string;
  logoUrl?: string;
  fallback: string;
  logoColor?: string;
  className?: string;
}

export default function PlatformLogo({
  platformId,
  logoUrl,
  fallback,
  logoColor,
  className = 'platform-logo',
}: PlatformLogoProps) {
  const [failed, setFailed] = useState(false);
  const catalog = platformId ? findPlatformCatalog(platformId) : undefined;
  const src = logoUrl ?? catalog?.logoUrl;
  const color = logoColor ?? catalog?.logoColor;
  const text = fallback || catalog?.logo || '?';

  if (src && !failed) {
    return (
      <span className={`${className} platform-logo-image`}>
        <img src={src} alt="" onError={() => setFailed(true)} />
      </span>
    );
  }

  return (
    <span
      className={className}
      style={
        color
          ? { background: color, color: '#fff' }
          : undefined
      }
    >
      {text}
    </span>
  );
}
