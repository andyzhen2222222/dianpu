export type PlatformFeature = 'repricing' | 'resale' | 'listing';

export interface PlatformCatalogItem {
  id: string;
  name: string;
  logo: string;
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
  { id: 'manomano', name: 'ManoMano', logo: 'MM', logoColor: '#00a651', features: ['repricing', 'resale', 'listing'] },
  { id: 'pixmania', name: 'Pixmania', logo: 'Px', logoColor: '#e30613', features: ['repricing', 'listing'] },
  { id: 'ozon', name: 'Ozon', logo: 'OZ', logoColor: '#005bff', features: ['repricing', 'resale', 'listing'] },
  { id: 'phhgroup', name: 'phh group', logo: 'phh', features: ['repricing', 'listing'] },
  { id: 'but', name: 'but.fr', logo: 'but', logoColor: '#e30613', features: ['repricing', 'listing'] },
  { id: 'onbuy', name: 'OnBuy.com', logo: 'OB', logoColor: '#00b4d8', features: ['repricing', 'resale'] },
  { id: 'bigbang', name: 'BIG BANG', logo: 'BB', logoColor: '#ff6600', features: ['repricing'] },
  { id: 'walmart', name: 'Walmart', logo: 'W', logoColor: '#0071ce', features: ['repricing', 'resale', 'listing'] },
  { id: 'clube', name: 'CLUBE FASHION', logo: 'CF', features: ['listing'] },
  { id: 'bol', name: 'bol.', logo: 'bol', logoColor: '#0000ff', features: ['repricing', 'listing'] },
  { id: 'leroy', name: 'Leroy Merlin', logo: 'LM', logoColor: '#78be20', features: ['repricing', 'listing'] },
  { id: 'cdiscount', name: 'Cdiscount', logo: 'C', logoColor: '#ff8c00', features: ['repricing', 'resale', 'listing'] },
  { id: 'fnacbe', name: 'fnac.be', logo: 'fn', logoColor: '#e4a800', features: ['repricing', 'listing'] },
  { id: 'fnac', name: 'fnac.fr', logo: 'fn', logoColor: '#e4a800', features: ['repricing', 'resale', 'listing'] },
  { id: 'eprice', name: 'ePRICE', logo: 'eP', logoColor: '#ff6600', features: ['repricing', 'listing'] },
  { id: 'darty', name: 'DARTY', logo: 'D', logoColor: '#e30613', features: ['repricing', 'listing'] },
  { id: 'rdc', name: 'RUE DU COMMERCE', logo: 'RDC', features: ['repricing', 'resale', 'listing'] },
  { id: 'carrefour', name: 'Carrefour', logo: 'Ca', logoColor: '#0066cc', features: ['repricing', 'listing'] },
];

export function findPlatformCatalog(id: string) {
  return platformCatalog.find((p) => p.id === id);
}
