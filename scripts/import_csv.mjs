#!/usr/bin/env node
/**
 * Import CSV research data into EU Savings Bank Map
 * Reads CSVs from ~/SavingsBankMap/ and generates:
 *   - src/data/sampleBanks.ts  (all banks with evidence URLs)
 *   - sql/seed_all.sql         (complete SQL seed)
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const CSV_DIR = resolve(PROJECT_ROOT, 'data');

// ─── CSV Parser (handles quoted fields with commas) ────────────────────────
function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else { inQuotes = false; }
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        row.push(cell);
        if (row.some(c => c.trim() !== '')) rows.push(row);
        row = []; cell = '';
        if (ch === '\r' && text[i + 1] === '\n') i++;
      } else {
        cell += ch;
      }
    }
  }
  if (cell || row.length > 0) {
    row.push(cell);
    if (row.some(c => c.trim() !== '')) rows.push(row);
  }

  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
    return obj;
  });
}

// ─── ID Mapping ────────────────────────────────────────────────────────────
// Explicit IDs for all CSV banks (preserves existing IDs where applicable)
const ID_MAP = {
  'CaixaBank': 'es-caixabank',
  "Groupe BPCE (Caisse d'Epargne network)": 'fr-caisse-epargne',
  'Erste Group (Sparkassen)': 'at-erste',
  'Sparkassen-Finanzgruppe': 'de-sparkassen-finanzgruppe',
  "Banque et Caisse d'Epargne de l'Etat (Spuerkeess)": 'lu-spuerkeess',
  'Ceska sporitelna': 'cz-ceska-sporitelna',
  'Slovenska sporitelna': 'sk-slovenska-sporitelna',
  'Savings Banks Group (Saastopankki)': 'fi-sp-pankki',
  'SpareBank 1 Alliance': 'no-sparebank1-alliance',
  'Swedbank and Savings Banks': 'se-swedbank',
  'OTP Bank': 'hu-otp',
  'Caixa Geral de Depositos': 'pt-cgd',
  'Banco Montepio': 'pt-banco-montepio',
  'de Volksbank': 'nl-volksbank',
  'Rabobank': 'nl-rabobank',
  'Raiffeisen Bank International': 'at-rbi',
  'Raiffeisen Switzerland': 'ch-raiffeisen',
  'OP Financial Group': 'fi-op',
  'Nationwide Building Society': 'gb-nationwide',
  'Coventry Building Society': 'gb-coventry-bs',
  'Skipton Building Society': 'gb-skipton-bs',
  'Yorkshire Building Society': 'gb-yorkshire-bs',
  'Principality Building Society': 'gb-principality-bs',
  'Bank of Valletta': 'mt-bov',
  'Aktia Bank': 'fi-aktia',
  'Banca Popolare di Sondrio': 'it-popso',
  'Sparkasse KoelnBonn': 'de-sparkasse-koelnbonn',
  'Hamburger Sparkasse (Haspa)': 'de-hamburger-sparkasse',
  'Ibercaja Banco': 'es-ibercaja',
  'Kutxabank': 'es-kutxabank',
  'Unicaja Banco': 'es-unicaja',
  'ABANCA': 'es-abanca',
  'Cajamar Caja Rural': 'es-cajamar',
  'Credit Mutuel Alliance Federale': 'fr-credit-mutuel',
  'Credit Agricole Group': 'fr-credit-agricole',
  'BCC Iccrea Group': 'it-bcc-iccrea',
  'Cassa Centrale Banca Group': 'it-cassa-centrale',
  'Nykredit': 'dk-nykredit',
  'Bank Norwegian (Nordax Group)': 'no-bank-norwegian',
  'Banca Transilvania': 'ro-banca-transilvania',
  'CEC Bank': 'ro-cec-bank',
  'DZ Bank Group': 'de-dz-bank',
  'Berliner Volksbank': 'de-berliner-volksbank',
  'GLS Bank': 'de-gls-bank',
  'Raiffeisenlandesbank Oberosterreich': 'at-rlb-ooe',
  'Raiffeisenlandesbank NO-Wien': 'at-rlb-noe-wien',
  'Raiffeisen-Landesbank Steiermark': 'at-rlb-steiermark',
  'de Volksbank (SNS)': 'nl-volksbank-sns',
  'Triodos Bank': 'nl-triodos',
  'Banca Popolare di Bari': 'it-pop-bari',
  'Banque Raiffeisen': 'lu-banque-raiffeisen',
  'Sparkasse Hannover': 'de-sparkasse-hannover',
  'Kreissparkasse Koeln': 'de-ksk-koeln',
  'Frankfurter Sparkasse': 'de-frankfurter-sparkasse',
  'Berliner Sparkasse': 'de-berliner-sparkasse',
  'Stadtsparkasse Duesseldorf': 'de-sskd',
  'Sparkasse Bremen': 'de-sparkasse-bremen',
  'SpareBank 1 SR-Bank': 'no-sr-bank',
  'SpareBank 1 SMN': 'no-smn',
  'SpareBank 1 Nord-Norge': 'no-nord-norge',
  'Sparebanken Vest': 'no-sparebanken-vest',
  'Sparebanken Sor': 'no-sparebanken-sor',
  'Lansforsakringar Bank': 'se-lansforsakringar',
  'Leeds Building Society': 'gb-leeds-bs',
  'KBC Brussels': 'be-kbc',
  'Belfius Bank': 'be-belfius',
  'Banca di Asti': 'it-banca-asti',
  'Caja Rural de Navarra': 'es-caja-rural-navarra',
  'Laboral Kutxa': 'es-laboral-kutxa',
  'Nova Ljubljanska Banka (NLB)': 'si-nlb',
};

// Skip duplicate entries
const SKIP_NAMES = new Set(['de Volksbank (SNS)']);

// ─── Retained banks (in existing data but NOT in CSV) ──────────────────────
const RETAINED_BANKS = [
  {
    id: 'dk-spar-nord', name: 'Spar Nord', country: 'Denmark', countryCode: 'DK', city: 'Aalborg',
    lat: 57.0488, lng: 9.9217,
    opts: { totalAssets: 20000, customerCount: 400, employeeCount: 1500, branchCount: 40, foundedYear: 1824 },
    levels: ['advanced', 'advanced', 'basic', 'basic', 'intermediate'],
  },
  {
    id: 'pl-bank-pocztowy', name: 'Bank Pocztowy', country: 'Poland', countryCode: 'PL', city: 'Bydgoszcz',
    lat: 53.1235, lng: 18.0084,
    opts: { totalAssets: 4000, customerCount: 1500, employeeCount: 1800, branchCount: 470, foundedYear: 1990 },
    levels: ['intermediate', 'basic', 'basic', 'none', 'basic'],
  },
  {
    id: 'it-cdp', name: 'CDP (Cassa Depositi e Prestiti)', country: 'Italy', countryCode: 'IT', city: 'Rome',
    lat: 41.9028, lng: 12.4964,
    opts: { totalAssets: 400000, employeeCount: 1100, foundedYear: 1850 },
    levels: ['none', 'none', 'none', 'none', 'basic'],
  },
  {
    id: 'de-naspa', name: 'Nassauische Sparkasse', country: 'Germany', countryCode: 'DE', city: 'Wiesbaden',
    lat: 50.0782, lng: 8.2406,
    opts: { parentGroup: 'Sparkassen-Finanzgruppe', website: 'https://www.naspa.de', totalAssets: 15303, customerCount: 700, depositVolume: 12456, employeeCount: 1626, branchCount: 101, foundedYear: 1840, reportingYear: 2024 },
    levels: ['advanced', 'basic', 'advanced', 'basic', 'basic'],
  },
  {
    id: 'de-sskm', name: 'Stadtsparkasse M\u00FCnchen', country: 'Germany', countryCode: 'DE', city: 'Munich',
    lat: 48.1357, lng: 11.5790,
    opts: { parentGroup: 'Sparkassen-Finanzgruppe', website: 'https://www.sskm.de', totalAssets: 23699, customerCount: 800, depositVolume: 18724, employeeCount: 2518, branchCount: 90, foundedYear: 1824, reportingYear: 2024 },
    levels: ['advanced', 'basic', 'advanced', 'basic', 'basic'],
  },
  {
    id: 'no-ostlandet', name: 'SpareBank 1 \u00D8stlandet', country: 'Norway', countryCode: 'NO', city: 'Hamar',
    lat: 60.7945, lng: 11.0680,
    opts: { parentGroup: 'SpareBank 1 Alliance', website: 'https://www.sparebank1.no/ostlandet', totalAssets: 18003, customerCount: 350, employeeCount: 1100, branchCount: 37, foundedYear: 1845, reportingYear: 2024 },
    levels: ['advanced', 'intermediate', 'intermediate', 'intermediate', 'advanced'],
  },
  {
    id: 'it-mps', name: 'Banca Monte dei Paschi di Siena', country: 'Italy', countryCode: 'IT', city: 'Siena',
    lat: 43.3188, lng: 11.3308,
    opts: { website: 'https://www.mps.it', totalAssets: 121910, customerCount: 5000, depositVolume: 82600, loanVolume: 87200, employeeCount: 16291, branchCount: 1312, foundedYear: 1472, reportingYear: 2024, featured: true },
    levels: ['advanced', 'intermediate', 'intermediate', 'basic', 'basic'],
  },
  {
    id: 'pt-bpi', name: 'Banco BPI', country: 'Portugal', countryCode: 'PT', city: 'Porto',
    lat: 41.1628, lng: -8.6389,
    opts: { parentGroup: 'CaixaBank Group', website: 'https://www.bancobpi.pt', totalAssets: 41072, customerCount: 1800, depositVolume: 39300, loanVolume: 30300, employeeCount: 4352, branchCount: 299, foundedYear: 1981, reportingYear: 2024 },
    levels: ['advanced', 'intermediate', 'advanced', 'intermediate', 'advanced'],
  },
  {
    id: 'pl-pko', name: 'PKO Bank Polski', country: 'Poland', countryCode: 'PL', city: 'Warsaw',
    lat: 52.2237, lng: 21.0186,
    opts: { website: 'https://www.pkobp.pl', totalAssets: 122807, customerCount: 12100, depositVolume: 141287, loanVolume: 68772, employeeCount: 25600, branchCount: 1193, foundedYear: 1919, reportingYear: 2024, featured: true },
    levels: ['advanced', 'intermediate', 'advanced', 'advanced', 'advanced'],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
const MATURITY_POINTS = { none: 0, basic: 1, intermediate: 2, advanced: 3 };

function computeScore(levels) {
  const total = levels.reduce((sum, l) => sum + (MATURITY_POINTS[l] || 0), 0);
  return Math.round((total / 15) * 100);
}

function tsEsc(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

function sqlEsc(s) { return s.replace(/'/g, "''"); }
function sqlStr(s) { return s ? `'${sqlEsc(s)}'` : 'NULL'; }
function sqlNum(s) { return (s !== undefined && s !== null && s !== '') ? Number(s) : null; }

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  // Read CSVs
  const bankCSV = readFileSync(resolve(CSV_DIR, 'european_savings_bank_data.csv'), 'utf8');
  const trackerCSV = readFileSync(resolve(CSV_DIR, 'european_savings_bank_digital_assessment_tracker.csv'), 'utf8');

  const csvBanks = parseCSV(bankCSV);
  const trackerRows = parseCSV(trackerCSV);

  // Build score map from tracker
  const scoreMap = new Map();
  for (const row of trackerRows) {
    scoreMap.set(row.name, parseInt(row.digital_score, 10));
  }

  console.log(`Parsed ${csvBanks.length} banks from CSV`);
  console.log(`Parsed ${trackerRows.length} rows from assessment tracker`);

  // ─── Process CSV banks ─────────────────────────────────────────────────
  const allBanks = [];

  for (const row of csvBanks) {
    if (SKIP_NAMES.has(row.name)) {
      console.log(`  Skipping duplicate: ${row.name}`);
      continue;
    }

    const id = ID_MAP[row.name];
    if (!id) {
      console.warn(`  WARNING: No ID mapping for "${row.name}" — skipping`);
      continue;
    }

    const levels = [
      row.mobile_banking || 'none',
      row.open_banking || 'none',
      row.digital_onboarding || 'none',
      row.ai_chatbot || 'none',
      row.devops_cloud || 'none',
    ];

    const evidenceUrls = [
      row.mobile_banking_evidence || '',
      row.open_banking_evidence || '',
      row.digital_onboarding_evidence || '',
      row.ai_chatbot_evidence || '',
      row.devops_cloud_evidence || '',
    ];
    const hasEvidence = evidenceUrls.some(u => u !== '');

    allBanks.push({
      id,
      name: row.name,
      country: row.country,
      countryCode: row.country_code,
      city: row.city,
      lat: parseFloat(row.latitude),
      lng: parseFloat(row.longitude),
      address: row.address || undefined,
      parentGroup: row.parent_group || undefined,
      website: row.website || undefined,
      foundedYear: sqlNum(row.founded_year),
      totalAssets: sqlNum(row.total_assets_millions_eur),
      customerCount: sqlNum(row.customer_count_thousands),
      depositVolume: sqlNum(row.deposit_volume_millions_eur),
      loanVolume: sqlNum(row.loan_volume_millions_eur),
      employeeCount: sqlNum(row.employee_count),
      branchCount: sqlNum(row.branch_count),
      reportingYear: sqlNum(row.reporting_year) || 2024,
      featured: row.featured === 'true',
      levels,
      evidenceUrls: hasEvidence ? evidenceUrls : undefined,
      digitalScore: scoreMap.get(row.name) ?? computeScore(levels),
      source: 'csv',
    });
  }

  console.log(`Processed ${allBanks.length} CSV banks`);

  // ─── Add retained banks ────────────────────────────────────────────────
  for (const rb of RETAINED_BANKS) {
    allBanks.push({
      id: rb.id,
      name: rb.name,
      country: rb.country,
      countryCode: rb.countryCode,
      city: rb.city,
      lat: rb.lat,
      lng: rb.lng,
      address: undefined,
      parentGroup: rb.opts.parentGroup,
      website: rb.opts.website,
      foundedYear: rb.opts.foundedYear,
      totalAssets: rb.opts.totalAssets,
      customerCount: rb.opts.customerCount,
      depositVolume: rb.opts.depositVolume,
      loanVolume: rb.opts.loanVolume,
      employeeCount: rb.opts.employeeCount,
      branchCount: rb.opts.branchCount,
      reportingYear: rb.opts.reportingYear || 2024,
      featured: rb.opts.featured || false,
      levels: rb.levels,
      evidenceUrls: undefined,
      digitalScore: computeScore(rb.levels),
      source: 'retained',
    });
  }

  console.log(`Total banks: ${allBanks.length} (${allBanks.filter(b => b.source === 'csv').length} CSV + ${RETAINED_BANKS.length} retained)`);

  // Sort by country then name
  allBanks.sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));

  // ─── Generate sampleBanks.ts ───────────────────────────────────────────
  generateTS(allBanks);

  // ─── Generate seed_all.sql ─────────────────────────────────────────────
  generateSQL(allBanks);

  // ─── Generate upsert_all.sql (duplicate-safe) ────────────────────────
  generateUpsertSQL(allBanks);

  console.log('\nDone! Generated:');
  console.log('  src/data/sampleBanks.ts');
  console.log('  sql/seed_all.sql');
  console.log('  sql/upsert_all.sql');
}

// ─── TypeScript Generator ──────────────────────────────────────────────────
function generateTS(banks) {
  const lines = [];

  // Header
  lines.push(`import type { Bank, DigitalFeature } from '../types';`);
  lines.push('');

  // makeFeatures helper (updated with evidenceUrls)
  lines.push(`function makeFeatures(`);
  lines.push(`  bankId: string,`);
  lines.push(`  levels: [string, string, string, string, string],`);
  lines.push(`  evidenceUrls?: [string, string, string, string, string],`);
  lines.push(`): DigitalFeature[] {`);
  lines.push(`  const categories = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'] as const;`);
  lines.push(`  return categories.map((cat, i) => ({`);
  lines.push(`    id: \`\${bankId}-\${cat}\`,`);
  lines.push(`    bankId,`);
  lines.push(`    category: cat,`);
  lines.push(`    present: levels[i] !== 'none',`);
  lines.push(`    maturityLevel: levels[i] as DigitalFeature['maturityLevel'],`);
  lines.push(`    ...(evidenceUrls?.[i] ? { evidenceUrl: evidenceUrls[i] } : {}),`);
  lines.push(`  }));`);
  lines.push(`}`);
  lines.push('');

  // computeScore helper
  lines.push(`function computeScore(features: DigitalFeature[]): number {`);
  lines.push(`  const points: Record<string, number> = { none: 0, basic: 1, intermediate: 2, advanced: 3 };`);
  lines.push(`  const total = features.reduce((sum, f) => sum + (points[f.maturityLevel] || 0), 0);`);
  lines.push(`  return Math.round((total / 15) * 100);`);
  lines.push(`}`);
  lines.push('');

  // makeBank helper (updated with address + evidenceUrls)
  lines.push(`function makeBank(`);
  lines.push(`  id: string,`);
  lines.push(`  name: string,`);
  lines.push(`  country: string,`);
  lines.push(`  countryCode: string,`);
  lines.push(`  city: string,`);
  lines.push(`  lat: number,`);
  lines.push(`  lng: number,`);
  lines.push(`  opts: {`);
  lines.push(`    address?: string;`);
  lines.push(`    parentGroup?: string;`);
  lines.push(`    website?: string;`);
  lines.push(`    foundedYear?: number;`);
  lines.push(`    totalAssets?: number;`);
  lines.push(`    customerCount?: number;`);
  lines.push(`    depositVolume?: number;`);
  lines.push(`    loanVolume?: number;`);
  lines.push(`    employeeCount?: number;`);
  lines.push(`    branchCount?: number;`);
  lines.push(`    reportingYear?: number;`);
  lines.push(`    featured?: boolean;`);
  lines.push(`  },`);
  lines.push(`  levels: [string, string, string, string, string],`);
  lines.push(`  evidenceUrls?: [string, string, string, string, string],`);
  lines.push(`): Bank {`);
  lines.push(`  const features = makeFeatures(id, levels, evidenceUrls);`);
  lines.push(`  return {`);
  lines.push(`    id,`);
  lines.push(`    name,`);
  lines.push(`    country,`);
  lines.push(`    countryCode,`);
  lines.push(`    city,`);
  lines.push(`    address: opts.address,`);
  lines.push(`    latitude: lat,`);
  lines.push(`    longitude: lng,`);
  lines.push(`    parentGroup: opts.parentGroup,`);
  lines.push(`    website: opts.website,`);
  lines.push(`    foundedYear: opts.foundedYear,`);
  lines.push(`    totalAssets: opts.totalAssets,`);
  lines.push(`    customerCount: opts.customerCount,`);
  lines.push(`    depositVolume: opts.depositVolume,`);
  lines.push(`    loanVolume: opts.loanVolume,`);
  lines.push(`    employeeCount: opts.employeeCount,`);
  lines.push(`    branchCount: opts.branchCount,`);
  lines.push(`    reportingYear: opts.reportingYear ?? 2024,`);
  lines.push(`    digitalScore: computeScore(features),`);
  lines.push(`    digitalFeatures: features,`);
  lines.push(`    status: 'published',`);
  lines.push(`    featured: opts.featured ?? false,`);
  lines.push(`    createdAt: '2025-01-01T00:00:00Z',`);
  lines.push(`    updatedAt: '2025-01-01T00:00:00Z',`);
  lines.push(`  };`);
  lines.push(`}`);
  lines.push('');

  // Bank array
  lines.push(`export const sampleBanks: Bank[] = [`);

  let currentCountry = '';
  for (const bank of banks) {
    // Country section header
    if (bank.country !== currentCountry) {
      if (currentCountry) lines.push('');
      lines.push(`  // ${bank.country}`);
      currentCountry = bank.country;
    }

    // Build opts object
    const optParts = [];
    if (bank.address) optParts.push(`address: '${tsEsc(bank.address)}'`);
    if (bank.parentGroup) optParts.push(`parentGroup: '${tsEsc(bank.parentGroup)}'`);
    if (bank.website) optParts.push(`website: '${tsEsc(bank.website)}'`);
    if (bank.foundedYear != null) optParts.push(`foundedYear: ${bank.foundedYear}`);
    if (bank.totalAssets != null) optParts.push(`totalAssets: ${bank.totalAssets}`);
    if (bank.customerCount != null) optParts.push(`customerCount: ${bank.customerCount}`);
    if (bank.depositVolume != null) optParts.push(`depositVolume: ${bank.depositVolume}`);
    if (bank.loanVolume != null) optParts.push(`loanVolume: ${bank.loanVolume}`);
    if (bank.employeeCount != null) optParts.push(`employeeCount: ${bank.employeeCount}`);
    if (bank.branchCount != null) optParts.push(`branchCount: ${bank.branchCount}`);
    if (bank.reportingYear && bank.reportingYear !== 2024) optParts.push(`reportingYear: ${bank.reportingYear}`);
    if (bank.featured) optParts.push(`featured: true`);
    const optsStr = `{ ${optParts.join(', ')} }`;

    // Levels array
    const levelsStr = `['${bank.levels.join("', '")}']`;

    // Evidence URLs array (only for CSV banks with evidence)
    let evidenceStr = '';
    if (bank.evidenceUrls) {
      const urlParts = bank.evidenceUrls.map(u => `'${tsEsc(u)}'`);
      evidenceStr = `\n    [${urlParts.join(', ')}],`;
    }

    lines.push(`  makeBank('${bank.id}', '${tsEsc(bank.name)}', '${tsEsc(bank.country)}', '${bank.countryCode}', '${tsEsc(bank.city)}',`);
    lines.push(`    ${bank.lat}, ${bank.lng},`);
    lines.push(`    ${optsStr},`);
    lines.push(`    ${levelsStr},${evidenceStr}`);
    lines.push(`  ),`);
  }

  lines.push(`];`);
  lines.push('');

  const tsPath = resolve(PROJECT_ROOT, 'src/data/sampleBanks.ts');
  writeFileSync(tsPath, lines.join('\n'));
  console.log(`Wrote ${tsPath} (${banks.length} banks)`);
}

// ─── SQL Generator ─────────────────────────────────────────────────────────
function generateSQL(banks) {
  const lines = [];

  lines.push(`-- Complete seed for EU Savings Bank Map`);
  lines.push(`-- Generated by scripts/import_csv.mjs on ${new Date().toISOString().split('T')[0]}`);
  lines.push(`-- ${banks.length} banks total`);
  lines.push(`-- Run this in Supabase SQL Editor after schema.sql and rls_policies.sql`);
  lines.push('');

  const CATEGORIES = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'];

  for (let i = 0; i < banks.length; i++) {
    const bank = banks[i];
    const num = i + 1;
    const score = bank.digitalScore;

    // Bank columns
    const cols = ['name', 'country', 'country_code', 'city'];
    const vals = [sqlStr(bank.name), sqlStr(bank.country), sqlStr(bank.countryCode), sqlStr(bank.city)];

    if (bank.address) { cols.push('address'); vals.push(sqlStr(bank.address)); }

    cols.push('latitude', 'longitude');
    vals.push(bank.lat, bank.lng);

    if (bank.parentGroup) { cols.push('parent_group'); vals.push(sqlStr(bank.parentGroup)); }
    if (bank.website) { cols.push('website'); vals.push(sqlStr(bank.website)); }
    if (bank.foundedYear != null) { cols.push('founded_year'); vals.push(bank.foundedYear); }
    if (bank.totalAssets != null) { cols.push('total_assets'); vals.push(bank.totalAssets); }
    if (bank.customerCount != null) { cols.push('customer_count'); vals.push(bank.customerCount); }
    if (bank.depositVolume != null) { cols.push('deposit_volume'); vals.push(bank.depositVolume); }
    if (bank.loanVolume != null) { cols.push('loan_volume'); vals.push(bank.loanVolume); }
    if (bank.employeeCount != null) { cols.push('employee_count'); vals.push(bank.employeeCount); }
    if (bank.branchCount != null) { cols.push('branch_count'); vals.push(bank.branchCount); }

    cols.push('reporting_year', 'digital_score', 'status', 'featured');
    vals.push(bank.reportingYear || 2024, score, "'published'", bank.featured);

    lines.push(`-- ${num}. ${bank.name} \u2014 score ${score}`);
    lines.push(`WITH b AS (`);
    lines.push(`  INSERT INTO banks (${cols.join(', ')})`);
    lines.push(`  VALUES (${vals.join(', ')})`);
    lines.push(`  RETURNING id`);
    lines.push(`)`);

    // Digital features with evidence URLs
    const featureLines = CATEGORIES.map((cat, ci) => {
      const level = bank.levels[ci];
      const present = level !== 'none';
      const evidenceUrl = bank.evidenceUrls?.[ci] || '';
      let line = `  ((SELECT id FROM b), '${cat}', ${present}, '${level}'`;
      if (evidenceUrl) {
        line += `, ${sqlStr(evidenceUrl)}`;
      } else {
        line += `, NULL`;
      }
      line += `)`;
      return line;
    });

    lines.push(`INSERT INTO digital_features (bank_id, category, present, maturity_level, evidence_url) VALUES`);
    lines.push(featureLines.join(',\n') + ';');
    lines.push('');
  }

  const sqlPath = resolve(PROJECT_ROOT, 'sql/seed_all.sql');
  writeFileSync(sqlPath, lines.join('\n'));
  console.log(`Wrote ${sqlPath} (${banks.length} banks)`);
}

// ─── Upsert SQL Generator (duplicate-safe) ─────────────────────────────────
function generateUpsertSQL(banks) {
  const lines = [];

  lines.push(`-- Duplicate-safe upsert for EU Savings Bank Map`);
  lines.push(`-- Generated by scripts/import_csv.mjs on ${new Date().toISOString().split('T')[0]}`);
  lines.push(`-- ${banks.length} banks total`);
  lines.push(`-- Safe to run multiple times — skips existing banks, updates features`);
  lines.push(`-- Run this in Supabase SQL Editor`);
  lines.push('');
  lines.push(`-- Ensure unique constraint on bank name (idempotent)`);
  lines.push(`DO $$ BEGIN`);
  lines.push(`  IF NOT EXISTS (`);
  lines.push(`    SELECT 1 FROM pg_constraint WHERE conname = 'banks_name_key'`);
  lines.push(`  ) THEN`);
  lines.push(`    ALTER TABLE banks ADD CONSTRAINT banks_name_key UNIQUE (name);`);
  lines.push(`  END IF;`);
  lines.push(`END $$;`);
  lines.push('');

  const CATEGORIES = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'];

  for (let i = 0; i < banks.length; i++) {
    const bank = banks[i];
    const num = i + 1;
    const score = bank.digitalScore;

    // Bank columns & values
    const cols = ['name', 'country', 'country_code', 'city'];
    const vals = [sqlStr(bank.name), sqlStr(bank.country), sqlStr(bank.countryCode), sqlStr(bank.city)];

    if (bank.address) { cols.push('address'); vals.push(sqlStr(bank.address)); }

    cols.push('latitude', 'longitude');
    vals.push(bank.lat, bank.lng);

    if (bank.parentGroup) { cols.push('parent_group'); vals.push(sqlStr(bank.parentGroup)); }
    if (bank.website) { cols.push('website'); vals.push(sqlStr(bank.website)); }
    if (bank.foundedYear != null) { cols.push('founded_year'); vals.push(bank.foundedYear); }
    if (bank.totalAssets != null) { cols.push('total_assets'); vals.push(bank.totalAssets); }
    if (bank.customerCount != null) { cols.push('customer_count'); vals.push(bank.customerCount); }
    if (bank.depositVolume != null) { cols.push('deposit_volume'); vals.push(bank.depositVolume); }
    if (bank.loanVolume != null) { cols.push('loan_volume'); vals.push(bank.loanVolume); }
    if (bank.employeeCount != null) { cols.push('employee_count'); vals.push(bank.employeeCount); }
    if (bank.branchCount != null) { cols.push('branch_count'); vals.push(bank.branchCount); }

    cols.push('reporting_year', 'digital_score', 'status', 'featured');
    vals.push(bank.reportingYear || 2024, score, "'published'", bank.featured);

    // Build SET clause for ON CONFLICT (update all fields except name)
    const updateCols = cols.filter(c => c !== 'name');
    const setClauses = updateCols.map(c => `${c} = EXCLUDED.${c}`).join(', ');

    lines.push(`-- ${num}. ${bank.name} \u2014 score ${score}`);
    lines.push(`WITH b AS (`);
    lines.push(`  INSERT INTO banks (${cols.join(', ')})`);
    lines.push(`  VALUES (${vals.join(', ')})`);
    lines.push(`  ON CONFLICT (name) DO UPDATE SET ${setClauses}`);
    lines.push(`  RETURNING id`);
    lines.push(`)`);

    // Digital features with ON CONFLICT on (bank_id, category)
    const featureLines = CATEGORIES.map((cat, ci) => {
      const level = bank.levels[ci];
      const present = level !== 'none';
      const evidenceUrl = bank.evidenceUrls?.[ci] || '';
      let line = `  ((SELECT id FROM b), '${cat}', ${present}, '${level}'`;
      if (evidenceUrl) {
        line += `, ${sqlStr(evidenceUrl)}`;
      } else {
        line += `, NULL`;
      }
      line += `)`;
      return line;
    });

    lines.push(`INSERT INTO digital_features (bank_id, category, present, maturity_level, evidence_url) VALUES`);
    lines.push(featureLines.join(',\n'));
    lines.push(`ON CONFLICT (bank_id, category) DO UPDATE SET`);
    lines.push(`  present = EXCLUDED.present,`);
    lines.push(`  maturity_level = EXCLUDED.maturity_level,`);
    lines.push(`  evidence_url = EXCLUDED.evidence_url;`);
    lines.push('');
  }

  const sqlPath = resolve(PROJECT_ROOT, 'sql/upsert_all.sql');
  writeFileSync(sqlPath, lines.join('\n'));
  console.log(`Wrote ${sqlPath} (${banks.length} banks)`);
}

// ─── Run ───────────────────────────────────────────────────────────────────
main();
