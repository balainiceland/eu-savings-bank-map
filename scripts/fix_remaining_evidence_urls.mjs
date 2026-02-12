#!/usr/bin/env node
/**
 * Fix remaining broken evidence URLs (Austria, Germany, Italy, Netherlands,
 * Belgium, Czech Republic, Slovakia, Romania, Slovenia, Luxembourg, Switzerland).
 * Run AFTER fix_all_evidence_urls.mjs.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const CSV_PATH = resolve(PROJECT_ROOT, 'data/european_savings_bank_data.csv');

// ─── URL Fix Mapping ────────────────────────────────────────────────────────
const FIXES = {
  // ═══ AUSTRIA ═══

  'Erste Group (Sparkassen)': {
    mobile_banking_evidence: 'https://www.sparkasse.at/erstebank/privatkunden/digitales-banking/apps/george-go-app',
    digital_onboarding_evidence: 'https://www.sparkasse.at/erstebank/privatkunden/konto-karten/onlinekonto',
    ai_chatbot_evidence: 'https://www.erstegroup.com/en/news-media/press-releases/2023/10/05/erste-bank-launches-austrias-first-financial-ai',
  },

  'Raiffeisen Bank International': {
    mobile_banking_evidence: 'https://www.rbinternational.com/en/raiffeisen/blog/technology/digital-banking-experience.html',
    open_banking_evidence: 'https://www.rbinternational.com/en/raiffeisen/rbi-group/about-us/innovation/api-marketplace.html',
    digital_onboarding_evidence: 'https://www.raiffeisen.at/de/privatkunden/konto/girokonto.html',
    devops_cloud_evidence: 'https://www.rbinternational.com/en/raiffeisen/career/it-career.html',
  },

  'Raiffeisenlandesbank Oberosterreich': {
    mobile_banking_evidence: 'https://www.raiffeisen.at/ooe/de/online-banking/apps/mein-elba-app.html',
    open_banking_evidence: 'https://developer.raiffeisen.at/en/home.html',
    digital_onboarding_evidence: 'https://www.raiffeisen.at/ooe/de/privatkunden/konto/girokonto.html',
  },

  'Raiffeisenlandesbank NO-Wien': {
    mobile_banking_evidence: 'https://www.raiffeisen.at/noew/rlb/de/privatkunden/online-banking/apps/mein-elba-app.html',
    open_banking_evidence: 'https://developer.raiffeisen.at/en/home.html',
    digital_onboarding_evidence: 'https://www.raiffeisen.at/noew/de/privatkunden/konto/girokonto.html',
    devops_cloud_evidence: 'https://www.raiffeisen.at/noew/rlb/de/meine-bank/karriere/jobangebote.html',
  },

  'Raiffeisen-Landesbank Steiermark': {
    mobile_banking_evidence: 'https://www.raiffeisen.at/stmk/rlb/de/online-banking.html',
    open_banking_evidence: 'https://developer.raiffeisen.at/en/home.html',
    digital_onboarding_evidence: 'https://www.raiffeisen.at/stmk/rlb/de/privatkunden/konto/girokonto.html',
    devops_cloud_evidence: 'https://www.raiffeisen.at/stmk/rlb/de/meine-bank/karriere.html',
  },

  // ═══ GERMANY ═══

  'Sparkassen-Finanzgruppe': {
    mobile_banking_evidence: 'https://www.sparkasse.de/pk/produkte/konten-und-karten/finanzen-apps/s-app.html',
    open_banking_evidence: 'https://www.sparkasse.de/pk/ratgeber/finanzplanung/banking-tipps/psd-2.html',
    ai_chatbot_evidence: 'https://www.sparkasse.de/pk/ratgeber/finanzplanung/banking-tipps.html',
  },

  'Sparkasse KoelnBonn': {
    mobile_banking_evidence: 'https://www.sparkasse-koelnbonn.de/de/home/service/sparkassen-app.html',
    open_banking_evidence: 'https://www.sparkasse-koelnbonn.de/de/home/service/psd2.html',
  },

  'Hamburger Sparkasse (Haspa)': {
    mobile_banking_evidence: 'https://www.haspa.de/de/home/privatkunden/online-services/sparkassen-app.html',
    open_banking_evidence: 'https://www.haspa.de/de/home/service/psd2.html',
    ai_chatbot_evidence: 'https://www.haspa.de/de/home/services-und-hilfe/die-top-links/kontakt.html',
    devops_cloud_evidence: 'https://www.haspa.de/de/home/unternehmen-haspa/karriere.html',
  },

  'DZ Bank Group': {
    mobile_banking_evidence: 'https://www.vr.de/privatkunden/produkte/konten-karten/mobile-banking.html',
    open_banking_evidence: 'https://www.dzbank.com/disclosures',
    digital_onboarding_evidence: 'https://www.vr.de/privatkunden/produkte/konten-karten/girokonto.html',
    devops_cloud_evidence: 'https://www.dzbank.com/content/dzbank/en/home/we-are-dz-bank/careers.html',
  },

  'Berliner Volksbank': {
    mobile_banking_evidence: 'https://www.berliner-volksbank.de/privatkunden/banking-apps/vr-banking-app.html',
    open_banking_evidence: 'https://www.berliner-volksbank.de/rechtliche-hinweise/psd2.html',
    digital_onboarding_evidence: 'https://www.berliner-volksbank.de/privatkunden/girokonten-und-karten/private-girokonten/privat-girokonto.html',
  },

  'GLS Bank': {
    mobile_banking_evidence: 'https://www.gls.de/konten-karten/banking/banking-app/',
    open_banking_evidence: 'https://www.gls.de/gls-bank/service/fragen-antworten/allgemeines-finanz-glossar/was-ist-psd2/',
    digital_onboarding_evidence: 'https://www.gls.de/privatkunden/konto-karten/gls-girokonto/',
  },

  'Sparkasse Hannover': {
    mobile_banking_evidence: 'https://www.sparkasse-hannover.de/de/home/privatkunden/banking-und-bezahlen/banking-angebot/sparkassen-app.html',
    open_banking_evidence: 'https://www.sparkasse-hannover.de/de/home/ihre-sparkasse/dialogcenter.html',
    ai_chatbot_evidence: 'https://www.sparkasse-hannover.de/de/home/kontakt.html',
  },

  'Kreissparkasse Koeln': {
    mobile_banking_evidence: 'https://www.ksk-koeln.de/de/home/service/sparkassen-app.html',
    open_banking_evidence: 'https://www.ksk-koeln.de/de/home/service/psd2.html',
    ai_chatbot_evidence: 'https://www.ksk-koeln.de/de/home/toolbar/kontakt.html',
  },

  'Frankfurter Sparkasse': {
    mobile_banking_evidence: 'https://www.frankfurter-sparkasse.de/de/home/service/sparkassen-app.html',
    open_banking_evidence: 'https://www.frankfurter-sparkasse.de/de/home/service/psd2.html',
    ai_chatbot_evidence: 'https://www.frankfurter-sparkasse.de/de/home/toolbar/kontakt.html',
  },

  'Berliner Sparkasse': {
    mobile_banking_evidence: 'https://www.berliner-sparkasse.de/de/home/service/sparkassen-app.html',
    open_banking_evidence: 'https://www.berliner-sparkasse.de/de/home/service/psd2.html',
    ai_chatbot_evidence: 'https://www.berliner-sparkasse.de/de/home/toolbar/kontakt/whatsapp.html',
    devops_cloud_evidence: 'https://www.berliner-sparkasse.de/de/home/ihre-sparkasse/dein-job.html',
  },

  'Stadtsparkasse Duesseldorf': {
    mobile_banking_evidence: 'https://www.sskduesseldorf.de/de/home/service/sparkassen-app.html',
    open_banking_evidence: 'https://www.sskduesseldorf.de/de/home/aktionen/psd2.html',
    ai_chatbot_evidence: 'https://www.sskduesseldorf.de/de/home/toolbar/kontakt.html',
  },

  'Sparkasse Bremen': {
    mobile_banking_evidence: 'https://www.sparkasse-bremen.de/de/home/service/sparkassen-app.html',
    open_banking_evidence: 'https://www.sparkasse-bremen.de/de/home/service/psd2.html',
    ai_chatbot_evidence: 'https://www.sparkasse-bremen.de/de/home/toolbar/kontakt.html',
  },

  // ═══ ITALY ═══

  'Banca Popolare di Sondrio': {
    // Merging into BPER Banca (April 2026) — all old pages redirect to homepage
    mobile_banking_evidence: 'https://www.popso.it/un-nuovo-inizio',
    digital_onboarding_evidence: 'https://www.popso.it/un-nuovo-inizio',
    devops_cloud_evidence: 'https://www.popso.it/un-nuovo-inizio',
  },

  'BCC Iccrea Group': {
    // URL paths changed from /it-IT/Pagine/ to /Pagine/
    mobile_banking_evidence: 'https://www.gruppobcciccrea.it/Pagine/Default.aspx',
    open_banking_evidence: 'https://www.gruppobcciccrea.it/Pagine/Default.aspx',
    digital_onboarding_evidence: 'https://www.gruppobcciccrea.it/Pagine/Default.aspx',
    devops_cloud_evidence: 'https://www.gruppobcciccrea.it/Pagine/Default.aspx',
  },

  'Cassa Centrale Banca Group': {
    mobile_banking_evidence: 'https://www.cassacentrale.it/en/products-and-services/our-offer/digital-banking-solutions',
    open_banking_evidence: 'https://www.cassacentrale.it/en/products-and-services/our-offer/digital-banking-solutions',
    digital_onboarding_evidence: 'https://www.cassacentrale.it/en/products-and-services/our-offer/digital-banking-solutions',
  },

  'Banca Popolare di Bari': {
    // Rebranded to BDM Banca
    mobile_banking_evidence: 'https://www.bdmbanca.it/privati/canali-digitali/',
    digital_onboarding_evidence: 'https://www.bdmbanca.it/privati/conti/',
    devops_cloud_evidence: 'https://www.bdmbanca.it/istituzionale/lavora-con-noi/',
  },

  // Banca di Asti: 403 (bot protection) — URLs likely working for browser users, skip

  // ═══ NETHERLANDS ═══

  'de Volksbank': {
    mobile_banking_evidence: 'https://www.asnbank.nl/asn-app-en-asn-online-bankieren.html',
    open_banking_evidence: 'https://openbanking.devolksbank.nl/',
  },

  'Rabobank': {
    mobile_banking_evidence: 'https://www.rabobank.nl/particulieren/online-bankieren',
    digital_onboarding_evidence: 'https://www.rabobank.nl/particulieren/klant-worden/online-betaalrekening-openen',
    ai_chatbot_evidence: 'https://www.rabobank.nl/particulieren/contact/chatbot',
    devops_cloud_evidence: 'https://www.rabobank.nl/en/about-us/vacatures',
  },

  'de Volksbank (SNS)': {
    open_banking_evidence: 'https://openbanking.devolksbank.nl/',
  },

  'Triodos Bank': {
    mobile_banking_evidence: 'https://www.triodos.nl/mobiel-bankieren',
    digital_onboarding_evidence: 'https://www.triodos.nl/betalen',
  },

  // ═══ BELGIUM ═══

  'KBC Brussels': {
    mobile_banking_evidence: 'https://www.kbcbrussels.be/retail/en/products/payments/self-banking/on-your-smartphone/mobile-banking.html',
    open_banking_evidence: 'https://developer.kbc.be/',
    digital_onboarding_evidence: 'https://www.kbcbrussels.be/retail/en/products/payments/current-accounts/open-plus-account-for-expats.html',
    devops_cloud_evidence: 'https://newsroom.kbc.com/en',
  },

  'Belfius Bank': {
    mobile_banking_evidence: 'https://www.belfius.be/about-us/en/who-we-are/what-we-do/mobile',
    open_banking_evidence: 'https://developer.belfius.be/',
    digital_onboarding_evidence: 'https://www.belfius.be/retail/nl/producten/betalen/zichtrekeningen/index.aspx',
    ai_chatbot_evidence: 'https://www.belfius.be/retail/nl/contact/chatbot/index.aspx',
    devops_cloud_evidence: 'https://www.belfius.be/about-us/en/working-at-belfius',
  },

  // ═══ CZECH REPUBLIC ═══

  'Ceska sporitelna': {
    mobile_banking_evidence: 'https://www.csas.cz/cs/internetove-bankovnictvi/george',
    open_banking_evidence: 'https://developers.csas.cz/?lang=en',
    digital_onboarding_evidence: 'https://www.csas.cz/cs/osobni-finance/ucty-karty/ucet-plus',
    ai_chatbot_evidence: 'https://www.databricks.com/blog/ceska-erste-genai',
    devops_cloud_evidence: 'https://www.microsoft.com/en/customers/story/1442614428349876804-csas-banking-capital-markets-azure-en-czech',
  },

  // ═══ SLOVAKIA ═══

  'Slovenska sporitelna': {
    mobile_banking_evidence: 'https://www.slsp.sk/sk/george',
    open_banking_evidence: 'https://www.slsp.sk/en/business/online-banking/psd2-api-banking',
    digital_onboarding_evidence: 'https://www.slsp.sk/en/personal/faq/how-to-open-an-account',
    ai_chatbot_evidence: 'https://www.slsp.sk/sk/ludia/vesna',
  },

  // ═══ ROMANIA ═══

  'Banca Transilvania': {
    mobile_banking_evidence: 'https://en.bancatransilvania.ro/wallet-bt-pay/',
    open_banking_evidence: 'https://en.bancatransilvania.ro/developer-support',
    digital_onboarding_evidence: 'https://en.bancatransilvania.ro/accounts-and-operations/conturi',
  },

  'CEC Bank': {
    mobile_banking_evidence: 'https://www.cec.ro/mobile-banking',
  },

  // ═══ SLOVENIA ═══

  'Nova Ljubljanska Banka (NLB)': {
    mobile_banking_evidence: 'https://www.nlb.si/en/osebno/digitalne-storitve/nlb-klik',
    digital_onboarding_evidence: 'https://www.nlb.si/en/osebno/accounts-and-packages',
  },

  // ═══ LUXEMBOURG ═══

  "Banque et Caisse d'Epargne de l'Etat (Spuerkeess)": {
    mobile_banking_evidence: 'https://www.spuerkeess.lu/en/mobile/',
    open_banking_evidence: 'https://www.spuerkeess.lu/en/blog/experts-corner/open-banking-revolut-and-n26-enter-s-net/',
    digital_onboarding_evidence: 'https://www.spuerkeess.lu/en/private-customers/tools/application-to-set-up-a-business-relationship/',
  },

  'Banque Raiffeisen': {
    mobile_banking_evidence: 'https://www.raiffeisen.lu/en/private/daily-banking/online-services/online-banking-r-net',
    digital_onboarding_evidence: 'https://www.raiffeisen.lu/en/open-account',
    devops_cloud_evidence: 'https://www.raiffeisen.lu/en/banque/career',
  },

  // ═══ SWITZERLAND ═══

  'Raiffeisen Switzerland': {
    mobile_banking_evidence: 'https://ebanking.raiffeisen.ch/',
    devops_cloud_evidence: 'https://jobs.raiffeisen.ch/',
  },
};

// ─── CSV Parser ─────────────────────────────────────────────────────────────
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

// ─── Main ───────────────────────────────────────────────────────────────────
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
      if (colIdx === -1) {
        console.error(`  Column "${col}" not found in header!`);
        continue;
      }
      const oldUrl = cells[colIdx];
      if (oldUrl !== newUrl) {
        const shortOld = oldUrl.substring(0, 50) || '(empty)';
        const shortNew = newUrl.substring(0, 50);
        console.log(`  ${bankName} | ${col.replace('_evidence', '')} | ${shortOld}... → ${shortNew}...`);
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
console.log('Now run: node scripts/import_csv.mjs to regenerate all files');
