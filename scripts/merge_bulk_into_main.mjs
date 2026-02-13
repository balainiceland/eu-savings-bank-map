#!/usr/bin/env node
/**
 * Merge geocoded bulk banks into the main CSV
 * Preserves enriched data for existing banks, appends new placeholder banks
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'data');

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

function normalizeName(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  // 1. Read existing main CSV
  const mainText = readFileSync(resolve(DATA_DIR, 'european_savings_bank_data.csv'), 'utf8');
  const { headers, data: mainBanks } = parseCSV(mainText);
  console.log(`Existing main CSV: ${mainBanks.length} banks, ${headers.length} columns`);

  // Build set of existing names for dedup
  const existingNames = new Set(mainBanks.map(b => normalizeName(b.name)));

  // 2. Read geocoded bulk banks
  const bulkText = readFileSync(resolve(DATA_DIR, 'bulk_banks_geocoded.csv'), 'utf8');
  const { data: bulkBanks } = parseCSV(bulkText);
  console.log(`Bulk geocoded: ${bulkBanks.length} banks`);

  // 3. Filter out duplicates
  const newBanks = [];
  let dupes = 0;
  for (const bank of bulkBanks) {
    const norm = normalizeName(bank.name);
    if (existingNames.has(norm)) {
      dupes++;
      continue;
    }
    existingNames.add(norm); // prevent self-duplicates
    newBanks.push(bank);
  }
  console.log(`New banks to add: ${newBanks.length} (skipped ${dupes} duplicates)`);

  // 4. Merge: existing banks first (preserve enriched data), then new banks
  const allBanks = [...mainBanks, ...newBanks];

  // Sort by country then name
  allBanks.sort((a, b) =>
    (a.country || '').localeCompare(b.country || '') ||
    (a.name || '').localeCompare(b.name || '')
  );

  // 5. Write back to main CSV
  const csvLines = [headers.join(',')];
  for (const bank of allBanks) {
    csvLines.push(headers.map(h => csvEscape(bank[h] || '')).join(','));
  }

  const outPath = resolve(DATA_DIR, 'european_savings_bank_data.csv');
  writeFileSync(outPath, csvLines.join('\n') + '\n');
  console.log(`\nWrote ${outPath} (${allBanks.length} banks total)`);

  // Summary by country
  const byCountry = {};
  for (const b of allBanks) {
    const cc = b.country_code || '??';
    byCountry[cc] = (byCountry[cc] || 0) + 1;
  }
  console.log('\nBy country:');
  for (const [code, count] of Object.entries(byCountry).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${code}: ${count}`);
  }
}

main();
