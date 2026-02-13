#!/usr/bin/env node
/**
 * Apply automated enrichment results to master CSV
 * - Never overwrites already-enriched banks
 * - Backs up master CSV before writing
 * - Supports --dry-run flag
 */
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
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

// ─── Score Calculation ─────────────────────────────────────────────────────
const MATURITY_POINTS = { none: 0, basic: 1, intermediate: 2, advanced: 3 };

function computeScore(bank) {
  const features = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'];
  const total = features.reduce((sum, f) => sum + (MATURITY_POINTS[bank[f]] || 0), 0);
  return Math.round((total / 15) * 100);
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  console.log(`=== Apply Enrichment${DRY_RUN ? ' (DRY RUN)' : ''} ===\n`);

  // Read master CSV
  const masterPath = resolve(DATA_DIR, 'european_savings_bank_data.csv');
  const masterText = readFileSync(masterPath, 'utf8');
  const { headers, data: masterBanks } = parseCSV(masterText);
  console.log(`Master CSV: ${masterBanks.length} banks, ${headers.length} columns`);

  // Read enrichment summary
  const enrichPath = resolve(DATA_DIR, 'enrichment_summary.csv');
  const enrichText = readFileSync(enrichPath, 'utf8');
  const { data: enrichBanks } = parseCSV(enrichText);
  console.log(`Enrichment summary: ${enrichBanks.length} banks`);

  // Build enrichment lookup by name
  const enrichMap = new Map();
  for (const bank of enrichBanks) {
    enrichMap.set(bank.name, bank);
  }

  // Feature columns to update
  const FEATURE_COLS = [
    'mobile_banking', 'mobile_banking_evidence',
    'open_banking', 'open_banking_evidence',
    'digital_onboarding', 'digital_onboarding_evidence',
    'ai_chatbot', 'ai_chatbot_evidence',
  ];

  let updated = 0;
  let skippedEnriched = 0;
  let skippedNoData = 0;

  for (const bank of masterBanks) {
    // Check if already enriched (any feature ≠ none)
    const features = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'];
    const isAlreadyEnriched = features.some(f => bank[f] && bank[f] !== 'none');

    if (isAlreadyEnriched) {
      skippedEnriched++;
      continue;
    }

    // Check if we have enrichment data
    const enrichData = enrichMap.get(bank.name);
    if (!enrichData || parseInt(enrichData.digital_score, 10) === 0) {
      skippedNoData++;
      continue;
    }

    // Apply enrichment
    for (const col of FEATURE_COLS) {
      if (enrichData[col]) {
        bank[col] = enrichData[col];
      }
    }

    // Recalculate score
    const oldScore = bank.digital_score || '0';
    bank.digital_score = String(computeScore(bank));

    console.log(`  ✓ ${bank.name}: score ${oldScore} → ${bank.digital_score}`);
    updated++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Already enriched (skipped): ${skippedEnriched}`);
  console.log(`No enrichment data: ${skippedNoData}`);
  console.log(`Updated: ${updated}`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] No files written. Remove --dry-run to apply changes.');
    return;
  }

  // Backup master CSV
  const backupPath = resolve(DATA_DIR, 'european_savings_bank_data.backup.csv');
  copyFileSync(masterPath, backupPath);
  console.log(`\nBacked up to ${backupPath}`);

  // Write updated master CSV
  const csvLines = [headers.join(',')];
  for (const bank of masterBanks) {
    csvLines.push(headers.map(h => csvEscape(bank[h] || '')).join(','));
  }
  writeFileSync(masterPath, csvLines.join('\n') + '\n');
  console.log(`Wrote ${masterPath} (${masterBanks.length} banks)`);
}

main();
