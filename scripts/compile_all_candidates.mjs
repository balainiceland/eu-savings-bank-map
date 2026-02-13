#!/usr/bin/env node
/**
 * Compile all ESBG census candidates into 27-column format
 * Reads phase1 + phase2 CSVs, deduplicates against existing main CSV,
 * and outputs bulk_banks_raw.csv ready for geocoding.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'data');

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

function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function normalizeName(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  // 1. Read existing main CSV for deduplication
  const mainCSVText = readFileSync(resolve(DATA_DIR, 'european_savings_bank_data.csv'), 'utf8');
  const mainBanks = parseCSV(mainCSVText);
  const existingNames = new Set(mainBanks.map(b => normalizeName(b.name)));
  console.log(`Existing main CSV: ${mainBanks.length} banks`);

  // 2. Read phase 1 candidates
  const phase1Text = readFileSync(resolve(DATA_DIR, 'esbg_census_candidates_phase1.csv'), 'utf8');
  const phase1 = parseCSV(phase1Text);
  console.log(`Phase 1 candidates: ${phase1.length}`);

  // 3. Read phase 2 candidates
  const phase2Text = readFileSync(resolve(DATA_DIR, 'esbg_census_candidates_phase2.csv'), 'utf8');
  const phase2 = parseCSV(phase2Text);
  console.log(`Phase 2 candidates: ${phase2.length}`);

  // 4. Combine and deduplicate
  const allCandidates = [...phase1, ...phase2];
  const seen = new Set();
  const newBanks = [];

  for (const c of allCandidates) {
    const norm = normalizeName(c.bank_name);
    if (existingNames.has(norm)) {
      continue; // already in main CSV
    }
    if (seen.has(norm)) {
      continue; // duplicate within candidates
    }
    seen.add(norm);
    newBanks.push(c);
  }

  console.log(`After deduplication: ${newBanks.length} new banks (removed ${allCandidates.length - newBanks.length} duplicates/existing)`);

  // 5. Map 10-col → 27-col with placeholders
  const HEADERS = [
    'name', 'country', 'country_code', 'city', 'address',
    'latitude', 'longitude', 'parent_group', 'website', 'founded_year',
    'total_assets_millions_eur', 'customer_count_thousands',
    'deposit_volume_millions_eur', 'loan_volume_millions_eur',
    'employee_count', 'branch_count', 'reporting_year',
    'mobile_banking', 'mobile_banking_evidence',
    'open_banking', 'open_banking_evidence',
    'digital_onboarding', 'digital_onboarding_evidence',
    'ai_chatbot', 'ai_chatbot_evidence',
    'devops_cloud', 'devops_cloud_evidence',
    'featured'
  ];

  const rows = newBanks.map(c => ({
    name: c.bank_name,
    country: c.country,
    country_code: c.country_code,
    city: c.city || '',
    address: '',
    latitude: '0',
    longitude: '0',
    parent_group: c.parent_group || '',
    website: c.website || '',
    founded_year: '',
    total_assets_millions_eur: '',
    customer_count_thousands: '',
    deposit_volume_millions_eur: '',
    loan_volume_millions_eur: '',
    employee_count: '',
    branch_count: '',
    reporting_year: '',
    mobile_banking: 'none',
    mobile_banking_evidence: '',
    open_banking: 'none',
    open_banking_evidence: '',
    digital_onboarding: 'none',
    digital_onboarding_evidence: '',
    ai_chatbot: 'none',
    ai_chatbot_evidence: '',
    devops_cloud: 'none',
    devops_cloud_evidence: '',
    featured: 'false'
  }));

  // 6. Write bulk_banks_raw.csv
  const csvLines = [HEADERS.join(',')];
  for (const row of rows) {
    csvLines.push(HEADERS.map(h => csvEscape(row[h])).join(','));
  }

  const outPath = resolve(DATA_DIR, 'bulk_banks_raw.csv');
  writeFileSync(outPath, csvLines.join('\n') + '\n');
  console.log(`\nWrote ${outPath} (${rows.length} new banks)`);

  // Summary by country
  const byCountry = {};
  for (const r of rows) {
    byCountry[r.country_code] = (byCountry[r.country_code] || 0) + 1;
  }
  console.log('\nBy country:');
  for (const [code, count] of Object.entries(byCountry).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${code}: ${count}`);
  }
}

main();
