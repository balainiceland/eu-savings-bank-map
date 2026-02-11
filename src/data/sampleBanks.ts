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
    ['advanced', 'basic', 'advanced', 'intermediate', 'intermediate'],
  ),
  makeBank('de-hamburger-sparkasse', 'Hamburger Sparkasse', 'Germany', 'DE', 'Hamburg',
    53.5511, 9.9937,
    { parentGroup: 'Sparkassen-Finanzgruppe', totalAssets: 50000, customerCount: 1500, employeeCount: 5000, branchCount: 100, foundedYear: 1827, featured: true },
    ['advanced', 'basic', 'advanced', 'intermediate', 'intermediate'],
  ),
  makeBank('de-berliner-sparkasse', 'Berliner Sparkasse', 'Germany', 'DE', 'Berlin',
    52.5200, 13.4050,
    { parentGroup: 'Sparkassen-Finanzgruppe', totalAssets: 45000, customerCount: 1300, employeeCount: 4500, branchCount: 85, foundedYear: 1818 },
    ['advanced', 'basic', 'advanced', 'intermediate', 'intermediate'],
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
    ['intermediate', 'basic', 'intermediate', 'basic', 'intermediate'],
  ),

  // Norway
  makeBank('no-sr-bank', 'SpareBank 1 SR-Bank', 'Norway', 'NO', 'Stavanger',
    58.9700, 5.7331,
    { parentGroup: 'SpareBank 1 Alliance', totalAssets: 35000, customerCount: 300, employeeCount: 1200, branchCount: 30, foundedYear: 1839 },
    ['advanced', 'intermediate', 'intermediate', 'advanced', 'advanced'],
  ),
  makeBank('no-smn', 'SpareBank 1 SMN', 'Norway', 'NO', 'Trondheim',
    63.4305, 10.3951,
    { parentGroup: 'SpareBank 1 Alliance', totalAssets: 25000, customerCount: 300, employeeCount: 800, branchCount: 25, foundedYear: 1823 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'advanced'],
  ),

  // Sweden
  makeBank('se-swedbank', 'Swedbank', 'Sweden', 'SE', 'Stockholm',
    59.3293, 18.0686,
    { totalAssets: 250000, customerCount: 7000, employeeCount: 14000, branchCount: 350, foundedYear: 1820, featured: true },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'advanced'],
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
    ['intermediate', 'basic', 'intermediate', 'intermediate', 'basic'],
  ),

  // Denmark
  makeBank('dk-spar-nord', 'Spar Nord', 'Denmark', 'DK', 'Aalborg',
    57.0488, 9.9217,
    { totalAssets: 20000, customerCount: 400, employeeCount: 1500, branchCount: 40, foundedYear: 1824 },
    ['advanced', 'advanced', 'basic', 'basic', 'intermediate'],
  ),

  // France
  makeBank('fr-caisse-epargne', 'Caisse d\'Epargne', 'France', 'FR', 'Paris',
    48.8566, 2.3522,
    { parentGroup: 'BPCE', totalAssets: 450000, customerCount: 25000, employeeCount: 35000, branchCount: 3000, foundedYear: 1818 },
    ['advanced', 'intermediate', 'intermediate', 'advanced', 'intermediate'],
  ),

  // UK
  makeBank('gb-yorkshire-bs', 'Yorkshire Building Society', 'United Kingdom', 'GB', 'Bradford',
    53.7960, -1.7594,
    { totalAssets: 50000, customerCount: 3000, employeeCount: 3500, branchCount: 140, foundedYear: 1864 },
    ['intermediate', 'intermediate', 'intermediate', 'basic', 'intermediate'],
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
    ['advanced', 'intermediate', 'advanced', 'advanced', 'intermediate'],
  ),

  // Switzerland
  makeBank('ch-raiffeisen', 'Raiffeisen Switzerland', 'Switzerland', 'CH', 'St. Gallen',
    47.4245, 9.3767,
    { totalAssets: 250000, customerCount: 3500, employeeCount: 11000, branchCount: 800, foundedYear: 1899 },
    ['intermediate', 'basic', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // Belgium
  makeBank('be-belfius', 'Belfius', 'Belgium', 'BE', 'Brussels',
    50.8503, 4.3517,
    { totalAssets: 180000, customerCount: 3500, employeeCount: 6500, branchCount: 500, foundedYear: 2011 },
    ['advanced', 'basic', 'intermediate', 'advanced', 'advanced'],
  ),

  // Italy
  makeBank('it-cdp', 'CDP (Cassa Depositi e Prestiti)', 'Italy', 'IT', 'Rome',
    41.9028, 12.4964,
    { totalAssets: 400000, employeeCount: 1100, foundedYear: 1850 },
    ['none', 'none', 'none', 'none', 'basic'],
  ),

  // ── Wave 2: 20 additional banks ──

  // Germany (additional Sparkassen)
  makeBank('de-naspa', 'Nassauische Sparkasse', 'Germany', 'DE', 'Wiesbaden',
    50.0782, 8.2406,
    { parentGroup: 'Sparkassen-Finanzgruppe', website: 'https://www.naspa.de', totalAssets: 15303, customerCount: 700, depositVolume: 12456, employeeCount: 1626, branchCount: 101, foundedYear: 1840, reportingYear: 2024 },
    ['advanced', 'basic', 'advanced', 'basic', 'basic'],
  ),
  makeBank('de-ksk-koeln', 'Kreissparkasse Köln', 'Germany', 'DE', 'Cologne',
    50.9366, 6.9468,
    { parentGroup: 'Sparkassen-Finanzgruppe', website: 'https://www.ksk-koeln.de', totalAssets: 29870, customerCount: 1000, depositVolume: 23000, loanVolume: 23600, employeeCount: 3797, branchCount: 138, foundedYear: 1852, reportingYear: 2024 },
    ['advanced', 'basic', 'advanced', 'basic', 'basic'],
  ),
  makeBank('de-sparkasse-hannover', 'Sparkasse Hannover', 'Germany', 'DE', 'Hannover',
    52.3690, 9.7430,
    { parentGroup: 'Sparkassen-Finanzgruppe', website: 'https://www.sparkasse-hannover.de', totalAssets: 20973, customerCount: 600, depositVolume: 14960, employeeCount: 1957, branchCount: 89, foundedYear: 1823, reportingYear: 2024 },
    ['advanced', 'basic', 'advanced', 'basic', 'basic'],
  ),
  makeBank('de-sskm', 'Stadtsparkasse München', 'Germany', 'DE', 'Munich',
    48.1357, 11.5790,
    { parentGroup: 'Sparkassen-Finanzgruppe', website: 'https://www.sskm.de', totalAssets: 23699, customerCount: 800, depositVolume: 18724, employeeCount: 2518, branchCount: 90, foundedYear: 1824, reportingYear: 2024 },
    ['advanced', 'basic', 'advanced', 'basic', 'basic'],
  ),

  // Norway (additional SpareBank 1)
  makeBank('no-ostlandet', 'SpareBank 1 Østlandet', 'Norway', 'NO', 'Hamar',
    60.7945, 11.0680,
    { parentGroup: 'SpareBank 1 Alliance', website: 'https://www.sparebank1.no/ostlandet', totalAssets: 20000, customerCount: 350, employeeCount: 1200, branchCount: 50, foundedYear: 1845, reportingYear: 2024 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'advanced'],
  ),
  makeBank('no-nord-norge', 'SpareBank 1 Nord-Norge', 'Norway', 'NO', 'Tromsø',
    69.6492, 18.9553,
    { parentGroup: 'SpareBank 1 Alliance', website: 'https://www.sparebank1.no/nord-norge', totalAssets: 15000, customerCount: 250, employeeCount: 800, branchCount: 90, foundedYear: 1836, reportingYear: 2024 },
    ['advanced', 'intermediate', 'intermediate', 'basic', 'intermediate'],
  ),

  // Sweden (additional)
  makeBank('se-lansforsakringar', 'Länsförsäkringar Bank', 'Sweden', 'SE', 'Stockholm',
    59.3365, 18.0636,
    { parentGroup: 'Länsförsäkringar Alliance', website: 'https://www.lansforsakringar.se', totalAssets: 22000, customerCount: 400, employeeCount: 517, branchCount: 130, foundedYear: 1996, reportingYear: 2024 },
    ['advanced', 'intermediate', 'intermediate', 'basic', 'intermediate'],
  ),

  // Finland (additional)
  makeBank('fi-op', 'OP Financial Group', 'Finland', 'FI', 'Helsinki',
    60.1699, 24.9384,
    { website: 'https://www.op.fi', totalAssets: 160000, customerCount: 2000, employeeCount: 12000, branchCount: 350, foundedYear: 1902, reportingYear: 2024, featured: true },
    ['advanced', 'advanced', 'advanced', 'intermediate', 'advanced'],
  ),

  // Spain (additional)
  makeBank('es-unicaja', 'Unicaja Banco', 'Spain', 'ES', 'Málaga',
    36.7213, -4.4214,
    { website: 'https://www.unicajabanco.es', totalAssets: 78000, customerCount: 4500, employeeCount: 8000, branchCount: 1300, foundedYear: 1991, reportingYear: 2024 },
    ['intermediate', 'basic', 'intermediate', 'basic', 'intermediate'],
  ),
  makeBank('es-ibercaja', 'Ibercaja', 'Spain', 'ES', 'Zaragoza',
    41.6488, -0.8891,
    { website: 'https://www.ibercaja.com', totalAssets: 55000, customerCount: 3000, depositVolume: 75803, employeeCount: 5000, branchCount: 1000, foundedYear: 1873, reportingYear: 2024 },
    ['intermediate', 'basic', 'intermediate', 'basic', 'intermediate'],
  ),

  // Italy (additional)
  makeBank('it-mps', 'Banca Monte dei Paschi di Siena', 'Italy', 'IT', 'Siena',
    43.3186, 11.3308,
    { website: 'https://www.mps.it', totalAssets: 150000, customerCount: 5000, employeeCount: 11000, branchCount: 1400, foundedYear: 1472, reportingYear: 2024, featured: true },
    ['advanced', 'basic', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // Portugal (additional)
  makeBank('pt-bpi', 'Banco BPI', 'Portugal', 'PT', 'Porto',
    41.1579, -8.6291,
    { parentGroup: 'CaixaBank Group', website: 'https://www.bancobpi.pt', totalAssets: 41072, customerCount: 1400, employeeCount: 4352, branchCount: 299, foundedYear: 1981, reportingYear: 2024 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // Czech Republic
  makeBank('cz-ceska-sporitelna', 'Česká spořitelna', 'Czech Republic', 'CZ', 'Prague',
    50.0755, 14.4378,
    { parentGroup: 'Erste Group', website: 'https://www.csas.cz', totalAssets: 80000, customerCount: 5000, employeeCount: 10000, branchCount: 600, foundedYear: 1825, reportingYear: 2024, featured: true },
    ['advanced', 'intermediate', 'advanced', 'intermediate', 'intermediate'],
  ),

  // Hungary
  makeBank('hu-otp', 'OTP Bank', 'Hungary', 'HU', 'Budapest',
    47.4979, 19.0402,
    { website: 'https://www.otpgroup.info', totalAssets: 47000, customerCount: 13000, employeeCount: 36000, branchCount: 1500, foundedYear: 1949, reportingYear: 2024, featured: true },
    ['advanced', 'intermediate', 'advanced', 'intermediate', 'intermediate'],
  ),

  // Romania
  makeBank('ro-banca-transilvania', 'Banca Transilvania', 'Romania', 'RO', 'Cluj-Napoca',
    46.7712, 23.6236,
    { website: 'https://www.bancatransilvania.ro', totalAssets: 42000, customerCount: 4600, employeeCount: 10000, branchCount: 500, foundedYear: 1993, reportingYear: 2024 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // Poland (additional)
  makeBank('pl-pko', 'PKO Bank Polski', 'Poland', 'PL', 'Warsaw',
    52.2297, 21.0122,
    { website: 'https://www.pkobp.pl', totalAssets: 122000, customerCount: 12100, employeeCount: 25000, branchCount: 900, foundedYear: 1919, reportingYear: 2024, featured: true },
    ['advanced', 'intermediate', 'advanced', 'intermediate', 'advanced'],
  ),

  // UK (additional)
  makeBank('gb-nationwide', 'Nationwide Building Society', 'United Kingdom', 'GB', 'Swindon',
    51.5588, -1.7818,
    { website: 'https://www.nationwide.co.uk', totalAssets: 335000, customerCount: 16000, depositVolume: 207000, employeeCount: 18000, branchCount: 625, foundedYear: 1846, reportingYear: 2024, featured: true },
    ['advanced', 'intermediate', 'advanced', 'intermediate', 'advanced'],
  ),

  // Netherlands
  makeBank('nl-volksbank', 'de Volksbank', 'Netherlands', 'NL', 'Utrecht',
    52.0907, 5.1214,
    { website: 'https://www.devolksbank.nl', totalAssets: 85000, customerCount: 3500, employeeCount: 5000, branchCount: 200, foundedYear: 2017, reportingYear: 2024 },
    ['advanced', 'intermediate', 'intermediate', 'intermediate', 'intermediate'],
  ),

  // Belgium (additional)
  makeBank('be-kbc', 'KBC Group', 'Belgium', 'BE', 'Brussels',
    50.8629, 4.3497,
    { website: 'https://www.kbc.com', totalAssets: 355000, customerCount: 12000, employeeCount: 41000, branchCount: 1200, foundedYear: 1998, reportingYear: 2024, featured: true },
    ['advanced', 'advanced', 'advanced', 'advanced', 'advanced'],
  ),

  // Luxembourg
  makeBank('lu-spuerkeess', 'Spuerkeess (BCEE)', 'Luxembourg', 'LU', 'Luxembourg City',
    49.6116, 6.1319,
    { website: 'https://www.spuerkeess.lu', totalAssets: 57155, customerCount: 300, employeeCount: 1929, branchCount: 60, foundedYear: 1856, reportingYear: 2024 },
    ['advanced', 'intermediate', 'intermediate', 'basic', 'intermediate'],
  ),
];
