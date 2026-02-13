#!/usr/bin/env node
/**
 * Apply financial enrichment data to master CSV
 * - Merges data from financial_enrichment_combined.csv
 * - Never overwrites banks that already have financial data
 * - Backs up master CSV before writing
 * - Supports --dry-run flag
 * - Validates: whole numbers, reasonable ranges
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'data');

const DRY_RUN = process.argv.includes('--dry-run');

// ─── CSV Parser ────────────────────────────────────────────────────────────
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
  return { headers, data: rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
    return obj;
  })};
}

function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// ─── Validation ────────────────────────────────────────────────────────────
const FIELD_RANGES = {
  total_assets_millions_eur:   { min: 1,    max: 5000000 },
  customer_count_thousands:    { min: 1,    max: 100000 },
  deposit_volume_millions_eur: { min: 1,    max: 4000000 },
  loan_volume_millions_eur:    { min: 1,    max: 4000000 },
  employee_count:              { min: 1,    max: 500000 },
  branch_count:                { min: 1,    max: 30000 },
  founded_year:                { min: 1400, max: 2025 },
  reporting_year:              { min: 2018, max: 2025 },
};

function validateField(field, value) {
  if (!value || value === '') return { valid: true, value: '' };
  const num = parseInt(value, 10);
  if (isNaN(num)) return { valid: false, reason: `not a number: "${value}"` };
  const range = FIELD_RANGES[field];
  if (!range) return { valid: true, value: String(num) };
  if (num < range.min || num > range.max) {
    return { valid: false, reason: `${num} out of range [${range.min}, ${range.max}]` };
  }
  return { valid: true, value: String(num) };
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  console.log(`=== Apply Financial Enrichment${DRY_RUN ? ' (DRY RUN)' : ''} ===\n`);

  const masterPath = resolve(DATA_DIR, 'european_savings_bank_data.csv');
  const enrichPath = resolve(DATA_DIR, 'financial_enrichment_combined.csv');

  if (!existsSync(enrichPath)) {
    console.error(`ERROR: ${enrichPath} not found.`);
    process.exit(1);
  }

  const { headers, data: masterBanks } = parseCSV(readFileSync(masterPath, 'utf8'));
  console.log(`Master CSV: ${masterBanks.length} banks, ${headers.length} columns`);

  const { data: enrichBanks } = parseCSV(readFileSync(enrichPath, 'utf8'));
  console.log(`Financial enrichment: ${enrichBanks.length} entries\n`);

  const enrichMap = new Map();
  for (const bank of enrichBanks) {
    if (bank.name) enrichMap.set(bank.name.trim(), bank);
  }

  const FINANCIAL_COLS = [
    'total_assets_millions_eur', 'customer_count_thousands',
    'deposit_volume_millions_eur', 'loan_volume_millions_eur',
    'employee_count', 'branch_count', 'founded_year', 'reporting_year',
  ];

  let updated = 0;
  let skippedExisting = 0;
  let skippedNoData = 0;
  let validationErrors = 0;

  for (const bank of masterBanks) {
    // Skip banks that already have financial data
    const hasFinancial = bank.total_assets_millions_eur || bank.employee_count;
    if (hasFinancial) {
      skippedExisting++;
      continue;
    }

    const enrichData = enrichMap.get(bank.name);
    if (!enrichData) {
      skippedNoData++;
      continue;
    }

    // Validate and apply each field
    let fieldsApplied = 0;
    let bankErrors = [];
    for (const col of FINANCIAL_COLS) {
      const raw = enrichData[col];
      if (!raw || raw === '') continue;

      const { valid, value, reason } = validateField(col, raw);
      if (!valid) {
        bankErrors.push(`  ⚠ ${col}: ${reason}`);
        validationErrors++;
        continue;
      }
      bank[col] = value;
      fieldsApplied++;
    }

    if (fieldsApplied > 0) {
      console.log(`  ✓ ${bank.name}: ${fieldsApplied} fields populated`);
      if (bankErrors.length) bankErrors.forEach(e => console.log(e));
      updated++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Already have financial data (skipped): ${skippedExisting}`);
  console.log(`No enrichment data found: ${skippedNoData}`);
  console.log(`Updated: ${updated}`);
  console.log(`Validation errors: ${validationErrors}`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] No files written. Remove --dry-run to apply.');
    return;
  }

  // Backup
  const backupPath = resolve(DATA_DIR, 'european_savings_bank_data.pre_financial.backup.csv');
  copyFileSync(masterPath, backupPath);
  console.log(`\nBacked up to ${backupPath}`);

  // Write
  const csvLines = [headers.join(',')];
  for (const bank of masterBanks) {
    csvLines.push(headers.map(h => csvEscape(bank[h] || '')).join(','));
  }
  writeFileSync(masterPath, csvLines.join('\n') + '\n');
  console.log(`Wrote ${masterPath} (${masterBanks.length} banks)`);
}

main();
