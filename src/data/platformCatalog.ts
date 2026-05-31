export type PlatformFeature = 'repricing' | 'resale' | 'listing';

export interface PlatformCatalogItem {
  id: string;
  name: string;
  logo: string;
  logoUrl: string;
  logoColor?: string;
  features: PlatformFeature[];
}

const featureLabels: Record<PlatformFeature, string> = {
  repricing: '调价',
  resale: '跟卖',
  listing: '刊登',
};

export function getFeatureLabel(f: PlatformFeature) {
  return featureLabels[f];
}

export const platformCatalog: PlatformCatalogItem[] = [
  { id: 'manomano', name: 'ManoMano', logo: 'MM', logoUrl: '/platform-logos/manomano.png', logoColor: '#00a651', features: ['repricing', 'resale', 'listing'] },
  { id: 'pixmania', name: 'Pixmania', logo: 'Px', logoUrl: '/platform-logos/pixmania.png', logoColor: '#e30613', features: ['repricing', 'listing'] },
  { id: 'ozon', name: 'Ozon', logo: 'OZ', logoUrl: '/platform-logos/ozon.png', logoColor: '#005bff', features: ['repricing', 'resale', 'listing'] },
  { id: 'phhgroup', name: 'phh group', logo: 'phh', logoUrl: '/platform-logos/phhgroup.png', features: ['repricing', 'listing'] },
  { id: 'but', name: 'but.fr', logo: 'but', logoUrl: '/platform-logos/but.png', logoColor: '#e30613', features: ['repricing', 'listing'] },
  { id: 'onbuy', name: 'OnBuy.com', logo: 'OB', logoUrl: '/platform-logos/onbuy.png', logoColor: '#00b4d8', features: ['repricing', 'resale'] },
  { id: 'bigbang', name: 'BIG BANG', logo: 'BB', logoUrl: '/platform-logos/bigbang.png', logoColor: '#ff6600', features: ['repricing'] },
  { id: 'walmart', name: 'Walmart', logo: 'W', logoUrl: '/platform-logos/walmart.png', logoColor: '#0071ce', features: ['repricing', 'resale', 'listing'] },
  { id: 'clube', name: 'CLUBE FASHION', logo: 'CF', logoUrl: '/platform-logos/clube.png', features: ['listing'] },
  { id: 'bol', name: 'bol.', logo: 'bol', logoUrl: '/platform-logos/bol.png', logoColor: '#0000ff', features: ['repricing', 'listing'] },
  { id: 'leroy', name: 'Leroy Merlin', logo: 'LM', logoUrl: '/platform-logos/leroy.svg', logoColor: '#78be20', features: ['repricing', 'listing'] },
  { id: 'cdiscount', name: 'Cdiscount', logo: 'C', logoUrl: '/platform-logos/cdiscount.png', logoColor: '#ff8c00', features: ['repricing', 'resale', 'listing'] },
  { id: 'fnacbe', name: 'fnac.be', logo: 'fn', logoUrl: '/platform-logos/fnacbe.svg', logoColor: '#e4a800', features: ['repricing', 'listing'] },
  { id: 'fnac', name: 'fnac.fr', logo: 'fn', logoUrl: '/platform-logos/fnac.svg', logoColor: '#e4a800', features: ['repricing', 'resale', 'listing'] },
  { id: 'eprice', name: 'ePRICE', logo: 'eP', logoUrl: '/platform-logos/eprice.png', logoColor: '#ff6600', features: ['repricing', 'listing'] },
  { id: 'darty', name: 'DARTY', logo: 'D', logoUrl: '/platform-logos/darty.png', logoColor: '#e30613', features: ['repricing', 'listing'] },
  { id: 'rdc', name: 'RUE DU COMMERCE', logo: 'RDC', logoUrl: '/platform-logos/rdc.png', features: ['repricing', 'resale', 'listing'] },
  { id: 'carrefour', name: 'Carrefour', logo: 'Ca', logoUrl: '/platform-logos/carrefour.svg', logoColor: '#0066cc', features: ['repricing', 'listing'] },
];

export function findPlatformCatalog(id: string) {
  return platformCatalog.find((p) => p.id === id);
}
