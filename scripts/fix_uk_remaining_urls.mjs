#!/usr/bin/env node
/**
 * Fix broken evidence URLs for Skipton, Leeds, and Nationwide building societies.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const CSV_PATH = resolve(PROJECT_ROOT, 'data/european_savings_bank_data.csv');

const FIXES = {
  'Skipton Building Society': {
    mobile_banking_evidence: 'https://www.skipton.co.uk/help-and-support/our-app-and-skipton-online',
    devops_cloud_evidence: 'https://careers.skipton.co.uk/',
    // open_banking: no replacement found on skipton.co.uk
  },

  'Leeds Building Society': {
    mobile_banking_evidence: 'https://www.leedsbuildingsociety.co.uk/online-services/registering-for-online-services/',
    digital_onboarding_evidence: 'https://www.leedsbuildingsociety.co.uk/savings/online-savings-accounts/',
    devops_cloud_evidence: 'https://www.leedsbuildingsocietyjobs.co.uk/',
    // open_banking: no replacement found on leedsbuildingsociety.co.uk
  },

  'Nationwide Building Society': {
    mobile_banking_evidence: 'https://www.nationwide.co.uk/ways-to-bank/banking-app/',
    open_banking_evidence: 'https://developer.nationwide.co.uk/open-banking',
    ai_chatbot_evidence: 'https://www.nationwide.co.uk/contact-us/how-arti-can-help-you',
  },
};

function parseCSVLine(line) {
  const cells = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cell += '"'; i++; }
        else { inQuotes = false; }
      } else { cell += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { cells.push(cell); cell = ''; }
      else { cell += ch; }
    }
  }
  cells.push(cell);
  return cells;
}

function quoteCSV(val) {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return '"' + val.replace(/"/g, '""') + '"';
  }
  return val;
}

const csv = readFileSync(CSV_PATH, 'utf8');
const lines = csv.split('\n');
const header = parseCSVLine(lines[0]);
let fixCount = 0;
let bankFixCount = 0;
const newLines = [lines[0]];

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) { newLines.push(lines[i]); continue; }
  const cells = parseCSVLine(lines[i]);
  const bankName = cells[0];
  if (FIXES[bankName]) {
    const fixes = FIXES[bankName];
    let bankFixed = false;
    for (const [col, newUrl] of Object.entries(fixes)) {
      const colIdx = header.indexOf(col);
      if (colIdx === -1) { console.error(`  Column "${col}" not found!`); continue; }
      const oldUrl = cells[colIdx];
      if (oldUrl !== newUrl) {
        console.log(`  ${bankName} | ${col.replace('_evidence', '')} | ${oldUrl.substring(0, 50)}... → ${newUrl.substring(0, 50)}...`);
        cells[colIdx] = newUrl;
        fixCount++;
        bankFixed = true;
      }
    }
    if (bankFixed) bankFixCount++;
  }
  newLines.push(cells.map(quoteCSV).join(','));
}

writeFileSync(CSV_PATH, newLines.join('\n'));
console.log(`\nFixed ${fixCount} URLs across ${bankFixCount} banks in CSV`);
