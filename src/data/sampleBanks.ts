import type { Bank, DigitalFeature } from '../types';

function makeFeatures(bankId: string, levels: [string, string, string, string, string]): DigitalFeature[] {
  const categories = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'] as const;
  return categories.map((cat, i) => ({
    id: `${bankId}-${cat}`,
    bankId,
    category: cat,
    present: levels[i] !== 'none',
    maturityLevel: levels[i] as DigitalFeature['maturityLevel'],
  }));
}

function computeScore(features: DigitalFeature[]): number {
  const points: Record<string, number> = { none: 0, basic: 1, intermediate: 2, advanced: 3 };
  const total = features.reduce((sum, f) => sum + (points[f.maturityLevel] || 0), 0);
  return Math.round((total / 15) * 100);
}

function makeBank(
  id: string,
  name: string,
  country: string,
  countryCode: string,
  city: string,
  lat: number,
  lng: number,
  opts: {
    parentGroup?: string;
    website?: string;
    foundedYear?: number;
    totalAssets?: number;
    customerCount?: number;
    depositVolume?: number;
    loanVolume?: number;
    employeeCount?: number;
    branchCount?: number;
    reportingYear?: number;
    featured?: boolean;
  },
  levels: [string, string, string, string, string],
): Bank {
  const features = makeFeatures(id, levels);
  return {
    id,
    name,
    country,
    countryCode,
    city,
    latitude: lat,
    longitude: lng,
    parentGroup: opts.parentGroup,
    website: opts.website,
    foundedYear: opts.foundedYear,
    totalAssets: opts.totalAssets,
    customerCount: opts.customerCount,
    depositVolume: opts.depositVolume,
    loanVolume: opts.loanVolume,
    employeeCount: opts.employeeCount,
    branchCount: opts.branchCount,
    reportingYear: opts.reportingYear ?? 2024,
    digitalScore: computeScore(features),
    digitalFeatures: features,
    status: 'published',
    featured: opts.featured ?? false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  };
}

export const sampleBanks: Bank[] = [
  // Germany
  makeBank('de-sparkasse-koelnbonn', 'Sparkasse KölnBonn', 'Germany', 'DE', 'Cologne',
    50.9375, 6.9603,
    { parentGroup: 'Sparkassen-Finanzgruppe', totalAssets: 30000, customerCount: 1000, employeeCount: 4200, branchCount: 90, foundedYear: 1826, featured: true },
    ['advanced', 'intermediate', 'intermediate', 'basic', 'intermediate'],
  ),
  makeBank('de-hamburger-sparkasse', 'Hamburger Sparkasse', 'Germany', 'DE', 'Hamburg',
    53.5511, 9.9937,
    { parentGroup: 'Sparkassen-Finanzgruppe', totalAssets: 50000, customerCount: 1500, employeeCount: 5000, branchCount: 100, foundedYear: 1827, featured: true },
    ['advanced', 'intermediate', 'advanced', 'intermediate', 'intermediate'],
  ),
  makeBank('de-berliner-sparkasse', 'Berliner Sparkasse', 'Germany', 'DE', 'Berlin',
    52.5200, 13.4050,
    { parentGroup: 'Sparkassen-Finanzgruppe', totalAssets: 45000, customerCount: 1300, employeeCount: 4500, branchCount: 85, foundedYear: 1818 },
    ['advanced', 'intermediate', 'intermediate', 'basic', 'basic'],
  ),

  // Spain
  makeBank('es-caixabank', 'CaixaBank', 'Spain', 'ES', 'Valencia',
    39.4699, -0.3763,
    { totalAssets: 600000, customerCount: 20000, employeeCount: 44000, branchCount: 4400, foundedYear: 2011, featured: true },
    ['advanced', 'advanced', 'advanced', 'advanced', 'advanced'],
  ),
  makeBank('es-kutxabank', 'Kutxabank', 'Spain', 'ES', 'Bilbao',
    43.2630, -2.9350,
    { totalAssets: 70000, customerCount: 3000, employeeCount: 3500, branchCount: 600, foundedYear: 2012 },
    ['advanced', 'intermediate', 'intermediate', 'basic', 'intermediate'],
  ),

  // Norway
  makeBank('no-sr-bank', 'SpareBank 1 SR-Bank', 'Norway', 'NO', 'Stavanger',
    58.9700, 5.7331,
    { parentGroup: 'SpareBank 1 Alliance', totalAssets: 35000, customerCount: 300, employeeCount: 1200, branchCount: 30, foundedYear: 1839 },
    ['advanced', 'intermediate', 'advanced', 'intermediate', 'advanced'],
  ),
  makeBank('no-smn', 'SpareBank 1 SMN', 'Norway', 'NO', 'Trondheim',
    63.4305, 10.3951,
    { parentGroup: 'SpareBank 1 Alliance', totalAssets: 25000, customerCount: 300, employeeCount: 800, branchCount: 25, foundedYear: 1823 },
    ['advanced', 'intermediate', 'intermediate', 'basic', 'intermediate'],
  ),

  // Sweden
  makeBank('se-swedbank', 'Swedbank', 'Sweden', 'SE', 'Stockholm',
    59.3293, 18.0686,
    { totalAssets: 250000, customerCount: 7000, employeeCount: 14000, branchCount: 350, foundedYear: 1820, featured: true },
    ['advanced', 'advanced', 'advanced', 'intermediate', 'advanced'],
  ),

  // Austria
  makeBank('at-erste', 'Erste Group', 'Austria', 'AT', 'Vienna',
    48.2082, 16.3738,
    { totalAssets: 300000, customerCount: 17000, employeeCount: 46000, branchCount: 1200, foundedYear: 1819, featured: true },
    ['advanced', 'advanced', 'advanced', 'advanced', 'intermediate'],
  ),

  // Finland
  makeBank('fi-sp-pankki', 'Sp-Pankki', 'Finland', 'FI', 'Helsinki',
    60.1699, 24.9384,
    { parentGroup: 'Savings Banks Group', totalAssets: 12000, customerCount: 300, employeeCount: 1500, branchCount: 100, foundedYear: 1822 },
    ['intermediate', 'basic', 'intermediate', 'basic', 'basic'],
  ),

  // Denmark
  makeBank('dk-spar-nord', 'Spar Nord', 'Denmark', 'DK', 'Aalborg',
    57.0488, 9.9217,
    { totalAssets: 20000, customerCount: 400, employeeCount: 1500, branchCount: 40, foundedYear: 1824 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // France
  makeBank('fr-caisse-epargne', 'Caisse d\'Epargne', 'France', 'FR', 'Paris',
    48.8566, 2.3522,
    { parentGroup: 'BPCE', totalAssets: 450000, customerCount: 25000, employeeCount: 35000, branchCount: 3000, foundedYear: 1818 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // UK
  makeBank('gb-yorkshire-bs', 'Yorkshire Building Society', 'United Kingdom', 'GB', 'Bradford',
    53.7960, -1.7594,
    { totalAssets: 50000, customerCount: 3000, employeeCount: 3500, branchCount: 140, foundedYear: 1864 },
    ['intermediate', 'basic', 'intermediate', 'basic', 'basic'],
  ),

  // Poland
  makeBank('pl-bank-pocztowy', 'Bank Pocztowy', 'Poland', 'PL', 'Bydgoszcz',
    53.1235, 18.0084,
    { totalAssets: 4000, customerCount: 1500, employeeCount: 1800, branchCount: 470, foundedYear: 1990 },
    ['intermediate', 'basic', 'basic', 'none', 'basic'],
  ),

  // Portugal
  makeBank('pt-cgd', 'Caixa Geral de Depósitos', 'Portugal', 'PT', 'Lisbon',
    38.7223, -9.1393,
    { totalAssets: 100000, customerCount: 4000, employeeCount: 7500, branchCount: 500, foundedYear: 1876 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // Switzerland
  makeBank('ch-raiffeisen', 'Raiffeisen Switzerland', 'Switzerland', 'CH', 'St. Gallen',
    47.4245, 9.3767,
    { totalAssets: 250000, customerCount: 3500, employeeCount: 11000, branchCount: 800, foundedYear: 1899 },
    ['advanced', 'intermediate', 'advanced', 'intermediate', 'intermediate'],
  ),

  // Belgium
  makeBank('be-belfius', 'Belfius', 'Belgium', 'BE', 'Brussels',
    50.8503, 4.3517,
    { totalAssets: 180000, customerCount: 3500, employeeCount: 6500, branchCount: 500, foundedYear: 2011 },
    ['advanced', 'advanced', 'advanced', 'intermediate', 'advanced'],
  ),

  // Italy
  makeBank('it-cdp', 'CDP (Cassa Depositi e Prestiti)', 'Italy', 'IT', 'Rome',
    41.9028, 12.4964,
    { totalAssets: 400000, employeeCount: 1100, foundedYear: 1850 },
    ['basic', 'basic', 'none', 'none', 'intermediate'],
  ),
];
