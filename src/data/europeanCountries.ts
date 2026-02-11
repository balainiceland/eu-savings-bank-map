export interface EuropeanCountry {
  name: string;
  code: string;
  center: [number, number];
}

export const EUROPEAN_COUNTRIES: EuropeanCountry[] = [
  { name: 'Austria', code: 'AT', center: [47.5162, 14.5501] },
  { name: 'Belgium', code: 'BE', center: [50.8503, 4.3517] },
  { name: 'Denmark', code: 'DK', center: [56.2639, 9.5018] },
  { name: 'Finland', code: 'FI', center: [61.9241, 25.7482] },
  { name: 'France', code: 'FR', center: [46.2276, 2.2137] },
  { name: 'Germany', code: 'DE', center: [51.1657, 10.4515] },
  { name: 'Italy', code: 'IT', center: [41.8719, 12.5674] },
  { name: 'Norway', code: 'NO', center: [60.4720, 8.4689] },
  { name: 'Poland', code: 'PL', center: [51.9194, 19.1451] },
  { name: 'Portugal', code: 'PT', center: [39.3999, -8.2245] },
  { name: 'Spain', code: 'ES', center: [40.4637, -3.7492] },
  { name: 'Sweden', code: 'SE', center: [60.1282, 18.6435] },
  { name: 'Switzerland', code: 'CH', center: [46.8182, 8.2275] },
  { name: 'United Kingdom', code: 'GB', center: [55.3781, -3.4360] },
];

export function getCountryByCode(code: string): EuropeanCountry | undefined {
  return EUROPEAN_COUNTRIES.find(c => c.code === code);
}
