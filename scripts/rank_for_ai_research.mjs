#!/usr/bin/env node
/**
 * Generate prioritized list of placeholder banks for AI-assisted deep research
 * Ranks banks by importance (capital city, country size, financial data, automated signals)
 * Output: top 100 banks for Tier 2 enrichment
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
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

function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

// ─── Capital cities ────────────────────────────────────────────────────────
const CAPITALS = {
  AT: 'vienna', BE: 'brussels', BG: 'sofia', HR: 'zagreb', CZ: 'prague',
  DK: 'copenhagen', FI: 'helsinki', FR: 'paris', DE: 'berlin',
  GR: 'athens', HU: 'budapest', IS: 'reykjavik', IT: 'rome',
  LU: 'luxembourg', MT: 'valletta', NL: 'amsterdam', NO: 'oslo',
  PL: 'warsaw', PT: 'lisbon', RO: 'bucharest', RS: 'belgrade',
  SK: 'bratislava', SI: 'ljubljana', ES: 'madrid', SE: 'stockholm',
  CH: 'bern', GB: 'london', AL: 'tirana',
};

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  console.log('=== Rank Banks for AI Research ===\n');

  // Read master CSV
  const csvText = readFileSync(resolve(DATA_DIR, 'european_savings_bank_data.csv'), 'utf8');
  const banks = parseCSV(csvText);
  console.log(`Read ${banks.length} banks from master CSV`);

  // Read enrichment summary if available
  const enrichPath = resolve(DATA_DIR, 'enrichment_summary.csv');
  const enrichMap = new Map();
  if (existsSync(enrichPath)) {
    const enrichBanks = parseCSV(readFileSync(enrichPath, 'utf8'));
    for (const b of enrichBanks) {
      enrichMap.set(b.name, b);
    }
    console.log(`Enrichment summary: ${enrichMap.size} banks`);
  }

  // Filter: placeholder banks only (still score 0 or all features none)
  const placeholders = banks.filter(b => {
    const features = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'];
    return features.every(f => !b[f] || b[f] === 'none');
  });
  console.log(`Placeholder banks: ${placeholders.length}`);

  // Count banks per country (for country-size weighting)
  const countryBankCount = {};
  for (const b of banks) {
    countryBankCount[b.country_code] = (countryBankCount[b.country_code] || 0) + 1;
  }
  const maxCountryCount = Math.max(...Object.values(countryBankCount));

  // Score each placeholder
  const ranked = [];

  for (const bank of placeholders) {
    let score = 0;
    const reasons = [];

    // +30 has website
    if (bank.website && bank.website.startsWith('http')) {
      score += 30;
      reasons.push('has website');
    }

    // +20 in capital city
    const capital = CAPITALS[bank.country_code];
    if (capital && bank.city && bank.city.toLowerCase().includes(capital)) {
      score += 20;
      reasons.push('capital city');
    }

    // +15 scaled by country bank count (larger banking markets = more important)
    const countryCount = countryBankCount[bank.country_code] || 1;
    const countryScore = Math.round(15 * (countryCount / maxCountryCount));
    if (countryScore > 0) {
      score += countryScore;
      reasons.push(`country size (${countryCount} banks)`);
    }

    // +10 has financial data
    const hasFinancial = (bank.total_assets_millions_eur && bank.total_assets_millions_eur !== '0') ||
                         (bank.employee_count && bank.employee_count !== '0');
    if (hasFinancial) {
      score += 10;
      reasons.push('has financial data');
    }

    // +15 scaled by total_assets (larger banks = more important)
    const assets = parseFloat(bank.total_assets_millions_eur) || 0;
    if (assets > 0) {
      // Log scale: 100M=5, 1B=10, 10B=13, 100B=15
      const assetScore = Math.min(15, Math.round(3 * Math.log10(assets)));
      score += assetScore;
      reasons.push(`assets €${assets}M`);
    }

    // +10 automated scan found ≥1 signal
    const enrichData = enrichMap.get(bank.name);
    if (enrichData && parseInt(enrichData.digital_score, 10) > 0) {
      score += 10;
      reasons.push('automated signal detected');
    }

    ranked.push({
      name: bank.name,
      country: bank.country,
      country_code: bank.country_code,
      city: bank.city || '',
      website: bank.website || '',
      priority_score: score,
      reason: reasons.join('; '),
    });
  }

  // Sort by priority score descending
  ranked.sort((a, b) => b.priority_score - a.priority_score);

  // Take top 100
  const top = ranked.slice(0, 100);

  // Write output
  const headers = ['rank', 'name', 'country', 'country_code', 'city', 'website', 'priority_score', 'reason'];
  const csvLines = [headers.join(',')];
  for (let i = 0; i < top.length; i++) {
    const row = { rank: i + 1, ...top[i] };
    csvLines.push(headers.map(h => csvEscape(row[h])).join(','));
  }

  const outPath = resolve(DATA_DIR, 'ai_research_priority_list.csv');
  writeFileSync(outPath, csvLines.join('\n') + '\n');

  console.log(`\nWrote ${outPath} (${top.length} banks)`);
  console.log('\nTop 20:');
  for (let i = 0; i < Math.min(20, top.length); i++) {
    const b = top[i];
    console.log(`  ${i + 1}. ${b.name} (${b.country_code}) — score ${b.priority_score} — ${b.reason}`);
  }

  // Score distribution
  const brackets = { '60+': 0, '40-59': 0, '20-39': 0, '1-19': 0, '0': 0 };
  for (const b of ranked) {
    if (b.priority_score >= 60) brackets['60+']++;
    else if (b.priority_score >= 40) brackets['40-59']++;
    else if (b.priority_score >= 20) brackets['20-39']++;
    else if (b.priority_score >= 1) brackets['1-19']++;
    else brackets['0']++;
  }
  console.log('\nAll placeholder banks — priority distribution:');
  for (const [bracket, count] of Object.entries(brackets)) {
    console.log(`  ${bracket}: ${count}`);
  }
}

main();
