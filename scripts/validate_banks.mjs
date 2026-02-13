#!/usr/bin/env node
/**
 * Validate bank data quality after merge
 * Checks: no duplicate names/IDs, coordinates in Europe, country consistency, counts
 */
import { readFileSync } from 'fs';
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
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
    return obj;
  });
}

// ─── Country code → name mapping ───────────────────────────────────────────
const CC_TO_COUNTRY = {
  AT: 'Austria', BE: 'Belgium', CZ: 'Czech Republic', DK: 'Denmark',
  FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece',
  HU: 'Hungary', IS: 'Iceland', IT: 'Italy', LU: 'Luxembourg',
  MT: 'Malta', NL: 'Netherlands', NO: 'Norway', PL: 'Poland',
  PT: 'Portugal', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia',
  ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', GB: 'United Kingdom',
  AL: 'Albania', HR: 'Croatia', BG: 'Bulgaria', RS: 'Serbia',
};

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  const csvText = readFileSync(resolve(DATA_DIR, 'european_savings_bank_data.csv'), 'utf8');
  const banks = parseCSV(csvText);

  let errors = 0;
  let warnings = 0;

  console.log(`\n=== EU Savings Bank Map Validation ===\n`);
  console.log(`Total banks: ${banks.length}\n`);

  // 1. Check for duplicate names
  console.log('--- Duplicate Name Check ---');
  const nameMap = new Map();
  for (const bank of banks) {
    const name = bank.name;
    if (nameMap.has(name)) {
      console.log(`  ERROR: Duplicate name "${name}"`);
      errors++;
    }
    nameMap.set(name, (nameMap.get(name) || 0) + 1);
  }
  if (errors === 0) console.log('  OK: No duplicate names');

  // 2. Coordinates within Europe (lat 35-72, lng -25-45)
  console.log('\n--- Coordinate Bounds Check ---');
  let coordErrors = 0;
  let zeroCoords = 0;
  for (const bank of banks) {
    const lat = parseFloat(bank.latitude);
    const lng = parseFloat(bank.longitude);

    if (lat === 0 && lng === 0) {
      zeroCoords++;
      continue; // placeholder — not an error for bulk banks
    }

    if (isNaN(lat) || isNaN(lng)) {
      console.log(`  ERROR: Invalid coordinates for "${bank.name}": lat=${bank.latitude}, lng=${bank.longitude}`);
      coordErrors++;
      errors++;
    } else if (lat < 35 || lat > 72 || lng < -25 || lng > 45) {
      console.log(`  ERROR: Out-of-bounds coordinates for "${bank.name}": ${lat}, ${lng}`);
      coordErrors++;
      errors++;
    }
  }
  if (zeroCoords > 0) {
    console.log(`  WARNING: ${zeroCoords} banks have placeholder (0,0) coordinates`);
    warnings += zeroCoords;
  }
  if (coordErrors === 0) console.log('  OK: All non-zero coordinates within Europe bounds');

  // 3. Country code / name consistency
  console.log('\n--- Country Consistency Check ---');
  let countryErrors = 0;
  for (const bank of banks) {
    const expectedCountry = CC_TO_COUNTRY[bank.country_code];
    if (!expectedCountry) {
      console.log(`  WARNING: Unknown country code "${bank.country_code}" for "${bank.name}"`);
      warnings++;
    } else if (expectedCountry !== bank.country) {
      console.log(`  ERROR: Country mismatch for "${bank.name}": code=${bank.country_code} → expected "${expectedCountry}", got "${bank.country}"`);
      countryErrors++;
      errors++;
    }
  }
  if (countryErrors === 0) console.log('  OK: All country codes match country names');

  // 4. Required fields check
  console.log('\n--- Required Fields Check ---');
  let fieldErrors = 0;
  for (const bank of banks) {
    if (!bank.name) { console.log(`  ERROR: Missing name`); fieldErrors++; errors++; }
    if (!bank.country) { console.log(`  ERROR: Missing country for "${bank.name}"`); fieldErrors++; errors++; }
    if (!bank.country_code) { console.log(`  ERROR: Missing country_code for "${bank.name}"`); fieldErrors++; errors++; }
  }
  if (fieldErrors === 0) console.log('  OK: All required fields present');

  // 5. Digital maturity values check
  console.log('\n--- Digital Maturity Values Check ---');
  const validLevels = new Set(['none', 'basic', 'intermediate', 'advanced', '']);
  let levelErrors = 0;
  const digitalCols = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'];
  for (const bank of banks) {
    for (const col of digitalCols) {
      if (!validLevels.has(bank[col])) {
        console.log(`  ERROR: Invalid ${col} level "${bank[col]}" for "${bank.name}"`);
        levelErrors++;
        errors++;
      }
    }
  }
  if (levelErrors === 0) console.log('  OK: All digital maturity values valid');

  // 6. Bank count per country
  console.log('\n--- Bank Count by Country ---');
  const byCountry = {};
  for (const bank of banks) {
    const key = `${bank.country_code} (${bank.country})`;
    byCountry[key] = (byCountry[key] || 0) + 1;
  }
  const sorted = Object.entries(byCountry).sort((a, b) => b[1] - a[1]);
  let total = 0;
  for (const [country, count] of sorted) {
    console.log(`  ${country}: ${count}`);
    total += count;
  }
  console.log(`  TOTAL: ${total}`);

  // 7. Enriched vs placeholder breakdown
  console.log('\n--- Enrichment Status ---');
  let enriched = 0;
  let placeholder = 0;
  for (const bank of banks) {
    const hasAssets = bank.total_assets_millions_eur && bank.total_assets_millions_eur !== '';
    const hasDigital = bank.mobile_banking && bank.mobile_banking !== 'none';
    if (hasAssets || hasDigital) {
      enriched++;
    } else {
      placeholder++;
    }
  }
  console.log(`  Enriched (with data): ${enriched}`);
  console.log(`  Placeholder (name/location only): ${placeholder}`);

  // Summary
  console.log(`\n=== Summary ===`);
  console.log(`Total banks: ${banks.length}`);
  console.log(`Countries: ${Object.keys(byCountry).length}`);
  console.log(`Errors: ${errors}`);
  console.log(`Warnings: ${warnings}`);

  if (errors > 0) {
    console.log(`\nFAILED: ${errors} errors found`);
    process.exit(1);
  } else {
    console.log(`\nPASSED: All checks OK`);
  }
}

main();
