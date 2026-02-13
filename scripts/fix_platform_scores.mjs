#!/usr/bin/env node
/**
 * Downgrades German Sparkassen from "advanced" to "basic" where the evidence
 * is a generic Sparkasse platform URL rather than bank-specific evidence.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MASTER = resolve(__dirname, '..', 'data', 'european_savings_bank_data.csv');
const DRY_RUN = process.argv.includes('--dry-run');

// Generic platform-level evidence URLs (not bank-specific)
const GENERIC_URLS = new Set([
  'https://apps.apple.com/us/app/sparkasse-ihre-mobile-filiale/id320599923',
  'https://www.sparkasse.de/pk/ratgeber/finanzplanung/banking-tipps/psd-2.html',
  'https://www.sparkasse.de/pk/produkte/konten-und-karten/girokonto/konto-eroeffnen.html',
  'https://www.sparkasse-koelnbonn.de/de/home/service/chatbot-linda.html',
  'https://www.f-i.de/loesungen/das-machen-wir',
]);

const PLATFORM_NOTE = 'https://www.sparkasse.de (platform-level)';

// Feature pairs: [score_column, evidence_column]
const FEATURES = [
  ['mobile_banking', 'mobile_banking_evidence'],
  ['open_banking', 'open_banking_evidence'],
  ['digital_onboarding', 'digital_onboarding_evidence'],
  ['ai_chatbot', 'ai_chatbot_evidence'],
  ['devops_cloud', 'devops_cloud_evidence'],
];

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  return lines.map(line => {
    const cols = [];
    let cur = '', inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuote) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQuote = false;
        else cur += ch;
      } else {
        if (ch === '"') inQuote = true;
        else if (ch === ',') { cols.push(cur); cur = ''; }
        else cur += ch;
      }
    }
    cols.push(cur);
    return cols;
  });
}

function csvEscape(val) {
  if (val == null) return '';
  const s = String(val);
  return /[,"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const raw = readFileSync(MASTER, 'utf8');
const rows = parseCSV(raw);
const header = rows[0];
const nameIdx = header.indexOf('name');
const ccIdx = header.indexOf('country_code');

const featureIndices = FEATURES.map(([score, evidence]) => [
  header.indexOf(score),
  header.indexOf(evidence),
]);

console.log(`=== Fix Platform-Level Scores${DRY_RUN ? ' (DRY RUN)' : ''} ===\n`);

let banksFixed = 0, featuresFixed = 0;

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row[ccIdx] !== 'DE') continue;

  const fixes = [];

  for (const [scoreIdx, evidenceIdx] of featureIndices) {
    const evidence = row[evidenceIdx]?.trim();
    if (evidence && GENERIC_URLS.has(evidence)) {
      const oldScore = row[scoreIdx];
      row[scoreIdx] = 'basic';
      row[evidenceIdx] = PLATFORM_NOTE;
      fixes.push(`${header[scoreIdx]}: ${oldScore} → basic`);
      featuresFixed++;
    }
  }

  if (fixes.length > 0) {
    console.log(`  ✓ ${row[nameIdx]}: ${fixes.length} features downgraded`);
    banksFixed++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Banks fixed: ${banksFixed}`);
console.log(`Features downgraded: ${featuresFixed}`);

if (!DRY_RUN && banksFixed > 0) {
  const backup = MASTER.replace('.csv', '.pre_scorefix.backup.csv');
  copyFileSync(MASTER, backup);
  console.log(`\nBacked up to ${backup}`);

  const output = rows.map(row => row.map(csvEscape).join(',')).join('\n') + '\n';
  writeFileSync(MASTER, output, 'utf8');
  console.log(`Wrote ${MASTER}`);
} else if (DRY_RUN) {
  console.log(`\n[DRY RUN] No files written.`);
}
