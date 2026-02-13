#!/usr/bin/env node
/**
 * Patches deposit_volume and loan_volume gaps in the master CSV using
 * authoritative sources: DSGV Sparkassenrangliste 2024, Cision press releases, etc.
 * Only fills EMPTY fields — never overwrites existing data.
 */
import { readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MASTER = resolve(__dirname, '..', 'data', 'european_savings_bank_data.csv');
const DRY_RUN = process.argv.includes('--dry-run');

// DSGV Sparkassenrangliste 2024 (year-end 2024, converted from Tsd EUR to millions)
// Format: [deposit_volume_millions_eur, loan_volume_millions_eur]
const PATCH_DATA = {
  // === GERMANY (DSGV Sparkassenrangliste 2024) ===
  'Erzgebirgssparkasse': { deposit: 5060, loan: 3561 },
  'Förde Sparkasse': { deposit: 7228, loan: 6571 },
  'Hohenzollerische Landesbank Kreissparkasse Sigmaringen': { deposit: 1450, loan: 1161 },
  'Kasseler Sparkasse': { deposit: 5375, loan: 4162 },
  'Kreissparkasse Ahrweiler': { deposit: 2165, loan: 2010 },
  'Kreissparkasse Diepholz': { deposit: 4836, loan: 5916 },
  'Kreissparkasse Düsseldorf': { deposit: 2660, loan: 2231 },
  'Kreissparkasse Freudenstadt': { deposit: 1745, loan: 1326 },
  'Kreissparkasse Köln': { deposit: 23030, loan: 23589 },
  'Kreissparkasse Limburg': { deposit: 1427, loan: 1078 },
  'Kreissparkasse Ludwigsburg': { deposit: 9406, loan: 7222 },
  'Kreissparkasse Ostalb': { deposit: 5036, loan: 4338 },
  'Kreissparkasse Saarlouis': { deposit: 3567, loan: 3368 },
  'Kreissparkasse Stade': { deposit: 1464, loan: 1764 },
  'Kreissparkasse Traunstein-Trostberg': { deposit: 2214, loan: 1958 },
  'Kreissparkasse Tübingen': { deposit: 4612, loan: 4865 },
  'Kreissparkasse Verden': { deposit: 2627, loan: 2891 },
  'Kreissparkasse Waiblingen': { deposit: 7778, loan: 8469 },
  'Mittelbrandenburgische Sparkasse in Potsdam': { deposit: 14027, loan: 7875 },
  'Müritz-Sparkasse': { deposit: 901, loan: 464 },
  'Nassauische Sparkasse': { deposit: 12456, loan: 10880 },
  'Ostsächsische Sparkasse Dresden': { deposit: 13425, loan: 9028 },
  'Rheinhessen Sparkasse': { deposit: 5413, loan: 4724 },
  'Sparkasse Aachen': { deposit: 11521, loan: 10383 },
  'Sparkasse Altenburger Land': { deposit: 1016, loan: 487 },
  'Sparkasse Amberg-Sulzbach': { deposit: 1789, loan: 1562 },
  'Sparkasse an Ennepe und Ruhr': { deposit: 2154, loan: 1855 },
  'Sparkasse Ansbach': { deposit: 4399, loan: 2926 },
  'Sparkasse Aschaffenburg Miltenberg': { deposit: 6402, loan: 5363 },
  'Sparkasse Attendorn-Lennestadt-Kirchhundem': { deposit: 877, loan: 692 },
  'Sparkasse Aurich-Norden': { deposit: 2086, loan: 2311 },
  'Sparkasse Bad Hersfeld-Rotenburg': { deposit: 1815, loan: 1331 },
  'Sparkasse Bad Kissingen': { deposit: 1444, loan: 909 },
  'Sparkasse Bad Neustadt a. d. Saale': { deposit: 1247, loan: 758 },
  'Sparkasse Bad Oeynhausen - Porta Westfalica': { deposit: 1282, loan: 1017 },
  'Sparkasse Bad Tölz-Wolfratshausen': { deposit: 2446, loan: 2301 },
  'Sparkasse Baden-Baden Gaggenau': { deposit: 1821, loan: 1406 },
  'Sparkasse Berchtesgadener Land': { deposit: 1690, loan: 1342 },
  'Sparkasse Burgenlandkreis': { deposit: 2515, loan: 1658 },
  'Sparkasse Dortmund': { deposit: 8651, loan: 8456 },
  'Sparkasse Duisburg': { deposit: 5405, loan: 5130 },
  'Sparkasse Freiburg-Nördlicher Breisgau': { deposit: 6195, loan: 6263 },
  'Sparkasse Freising Moosburg': { deposit: 2207, loan: 1842 },
  'Sparkasse Fulda': { deposit: 3438, loan: 2283 },
  'Sparkasse Fürth': { deposit: 3280, loan: 2708 },
  'Sparkasse Gelsenkirchen': { deposit: 2971, loan: 2311 },
  'Sparkasse Hegau-Bodensee': { deposit: 2623, loan: 2829 },
  'Sparkasse Hilden-Ratingen-Velbert': { deposit: 3510, loan: 3146 },
  'Sparkasse Hochrhein': { deposit: 2742, loan: 2628 },
  'Sparkasse Holstein': { deposit: 7038, loan: 7731 },
  'Sparkasse Kaiserslautern': { deposit: 4251, loan: 4163 },
  'Sparkasse Karlsruhe': { deposit: 8793, loan: 9091 },
  'Sparkasse KölnBonn': { deposit: 23238, loan: 21553 },
  'Sparkasse Krefeld': { deposit: 7724, loan: 6507 },
  'Sparkasse Leverkusen': { deposit: 3450, loan: 3765 },
  'Sparkasse Lörrach-Rheinfelden': { deposit: 2030, loan: 2544 },
  'Sparkasse Lüneburg': { deposit: 2681, loan: 2345 },
  'Sparkasse Magdeburg': { deposit: 3668, loan: 1774 },
  'Sparkasse Mainfranken Würzburg': { deposit: 8675, loan: 7268 },
  'Sparkasse Marburg-Biedenkopf': { deposit: 3816, loan: 3146 },
  'Sparkasse Märkisch-Oderland': { deposit: 2135, loan: 789 },
  'Sparkasse Mecklenburg-Nordwest': { deposit: 1622, loan: 1004 },
  'Sparkasse Mecklenburg-Schwerin': { deposit: 3288, loan: 2286 },
  'Sparkasse Mittelsachsen': { deposit: 3287, loan: 1645 },
  'Sparkasse Niederbayern-Mitte': { deposit: 3914, loan: 4237 },
  'Sparkasse Oberhessen': { deposit: 5005, loan: 4650 },
  'Sparkasse Oberlausitz-Niederschlesien': { deposit: 3880, loan: 1440 },
  'Sparkasse Oberpfalz Nord': { deposit: 1616, loan: 1259 },
  'Sparkasse Oder-Spree': { deposit: 3335, loan: 1556 },
  'Sparkasse Passau': { deposit: 3133, loan: 2659 },
  'Sparkasse Pforzheim Calw': { deposit: 11106, loan: 11213 },
  'Sparkasse Rhein Neckar Nord': { deposit: 3896, loan: 4251 },
  'Sparkasse Rhein-Haardt': { deposit: 3623, loan: 3652 },
  'Sparkasse Rhein-Nahe': { deposit: 4194, loan: 3836 },
  'Sparkasse Rotenburg Osterholz': { deposit: 3018, loan: 2950 },
  'Sparkasse Saarbrücken': { deposit: 6069, loan: 5456 },
  'Sparkasse Schwarzwald-Baar': { deposit: 3697, loan: 2609 },
  'Sparkasse Schweinfurt-Haßberge': { deposit: 3734, loan: 2919 },
  'Sparkasse Siegen': { deposit: 3746, loan: 3644 },
  'Sparkasse Sonneberg': { deposit: 642, loan: 328 },
  'Sparkasse Trier': { deposit: 4018, loan: 4326 },
  'Sparkasse Uckermark': { deposit: 1191, loan: 556 },
  'Sparkasse Ulm': { deposit: 5480, loan: 4780 },
  'Sparkasse Westerwald-Sieg': { deposit: 3356, loan: 2785 },
  'Sparkasse Westmünsterland': { deposit: 8462, loan: 8349 },
  'Sparkasse Zwickau': { deposit: 2796, loan: 1792 },
  'Stadt-Sparkasse Solingen': { deposit: 2519, loan: 2987 },
  'Stadtsparkasse Augsburg': { deposit: 6941, loan: 5466 },
  'Stadtsparkasse Bad Pyrmont': { deposit: 295, loan: 188 },
  'Stadtsparkasse Düsseldorf': { deposit: 12056, loan: 10675 },
  'Stadtsparkasse Schwedt': { deposit: 669, loan: 240 },
  'Stadtsparkasse Wuppertal': { deposit: 6698, loan: 6113 },
  'Taunus Sparkasse': { deposit: 5718, loan: 5618 },

  // === SWEDEN (Cision bokslutskommuniké 2024, SEK/11.5) ===
  'Sparbanken Sjuhärad': { deposit: 2072, loan: 2115 },
  'Sörmlands Sparbank': { deposit: 1341, loan: 1316 },
  'Sparbanken Skaraborg': { deposit: 1080, loan: 1046 },

  // === NORWAY (press releases / annual reports, NOK/11.2) ===
  'Sandnes Sparebank': { deposit: 1304, loan: 2634 },

  // === ITALY (press releases) ===
  'Banco di Sardegna': { deposit: 12000, loan: 7000 },
  'Credito Emiliano (CREDEM)': { deposit: 36800, loan: 35700 },

  // === AUSTRIA (press releases 2023) ===
  'Steiermarkische Sparkasse': { deposit: 8700 },
  'Allgemeine Sparkasse Oberosterreich': { deposit: 6200 },
};

// --- CSV helpers (same as apply_financial_enrichment.mjs) ---
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

// --- Main ---
const raw = readFileSync(MASTER, 'utf8');
const rows = parseCSV(raw);
const header = rows[0];
const nameIdx = header.indexOf('name');
const depositIdx = header.indexOf('deposit_volume_millions_eur');
const loanIdx = header.indexOf('loan_volume_millions_eur');

if (depositIdx === -1 || loanIdx === -1) {
  console.error('Cannot find deposit/loan columns in master CSV');
  process.exit(1);
}

console.log(`=== Patch Financial Gaps${DRY_RUN ? ' (DRY RUN)' : ''} ===\n`);
console.log(`Master CSV: ${rows.length - 1} banks`);
console.log(`Patch data: ${Object.keys(PATCH_DATA).length} entries\n`);

let filled = 0, skippedFull = 0, notFound = 0;
const matched = new Set();

for (let i = 1; i < rows.length; i++) {
  const name = rows[i][nameIdx];
  const patch = PATCH_DATA[name];
  if (!patch) continue;
  matched.add(name);

  const updates = [];

  if (patch.deposit != null && (!rows[i][depositIdx] || !rows[i][depositIdx].trim())) {
    rows[i][depositIdx] = String(patch.deposit);
    updates.push(`deposit=${patch.deposit}`);
  }

  if (patch.loan != null && (!rows[i][loanIdx] || !rows[i][loanIdx].trim())) {
    rows[i][loanIdx] = String(patch.loan);
    updates.push(`loan=${patch.loan}`);
  }

  if (updates.length > 0) {
    console.log(`  ✓ ${name}: ${updates.join(', ')}`);
    filled++;
  } else {
    skippedFull++;
  }
}

// Check for unmatched
for (const name of Object.keys(PATCH_DATA)) {
  if (!matched.has(name)) {
    console.log(`  ✗ ${name}: NOT FOUND in master CSV`);
    notFound++;
  }
}

console.log(`\n=== Summary ===`);
console.log(`Banks patched: ${filled}`);
console.log(`Already complete (skipped): ${skippedFull}`);
console.log(`Not found: ${notFound}`);

if (!DRY_RUN && filled > 0) {
  const backup = MASTER.replace('.csv', '.pre_patch.backup.csv');
  copyFileSync(MASTER, backup);
  console.log(`\nBacked up to ${backup}`);

  const output = rows.map(row => row.map(csvEscape).join(',')).join('\n') + '\n';
  writeFileSync(MASTER, output, 'utf8');
  console.log(`Wrote ${MASTER} (${rows.length - 1} banks)`);
} else if (DRY_RUN) {
  console.log(`\n[DRY RUN] No files written. Remove --dry-run to apply.`);
}
