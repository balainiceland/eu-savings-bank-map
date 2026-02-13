export interface EuropeanCountry {
  name: string;
  code: string;
  center: [number, number];
}

export const EUROPEAN_COUNTRIES: EuropeanCountry[] = [
  { name: 'Albania', code: 'AL', center: [41.1533, 20.1683] },
  { name: 'Austria', code: 'AT', center: [47.5162, 14.5501] },
  { name: 'Belgium', code: 'BE', center: [50.8503, 4.3517] },
  { name: 'Czech Republic', code: 'CZ', center: [49.8175, 15.4730] },
  { name: 'Denmark', code: 'DK', center: [56.2639, 9.5018] },
  { name: 'Finland', code: 'FI', center: [61.9241, 25.7482] },
  { name: 'France', code: 'FR', center: [46.2276, 2.2137] },
  { name: 'Germany', code: 'DE', center: [51.1657, 10.4515] },
  { name: 'Hungary', code: 'HU', center: [47.1625, 19.5033] },
  { name: 'Iceland', code: 'IS', center: [64.9631, -19.0208] },
  { name: 'Italy', code: 'IT', center: [41.8719, 12.5674] },
  { name: 'Luxembourg', code: 'LU', center: [49.8153, 6.1296] },
  { name: 'Malta', code: 'MT', center: [35.9375, 14.3754] },
  { name: 'Netherlands', code: 'NL', center: [52.1326, 5.2913] },
  { name: 'Norway', code: 'NO', center: [60.4720, 8.4689] },
  { name: 'Poland', code: 'PL', center: [51.9194, 19.1451] },
  { name: 'Portugal', code: 'PT', center: [39.3999, -8.2245] },
  { name: 'Romania', code: 'RO', center: [45.9432, 24.9668] },
  { name: 'Slovakia', code: 'SK', center: [48.6690, 19.6990] },
  { name: 'Slovenia', code: 'SI', center: [46.1512, 14.9955] },
  { name: 'Spain', code: 'ES', center: [40.4637, -3.7492] },
  { name: 'Sweden', code: 'SE', center: [60.1282, 18.6435] },
  { name: 'Switzerland', code: 'CH', center: [46.8182, 8.2275] },
  { name: 'United Kingdom', code: 'GB', center: [55.3781, -3.4360] },
];

export function getCountryByCode(code: string): EuropeanCountry | undefined {
  return EUROPEAN_COUNTRIES.find(c => c.code === code);
}
