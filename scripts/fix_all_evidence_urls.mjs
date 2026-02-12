#!/usr/bin/env node
/**
 * Fix all broken evidence URLs in the CSV based on verified replacements.
 * Then regenerate sampleBanks.ts, seed_all.sql, upsert_all.sql, and
 * produce a standalone SQL fix file for Supabase.
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');
const CSV_PATH = resolve(PROJECT_ROOT, 'data/european_savings_bank_data.csv');

// ─── URL Fix Mapping: bank_name → { category_evidence_col → new_url } ──────
const FIXES = {
  // === UK Building Societies ===
  'Principality Building Society': {
    mobile_banking_evidence: 'https://www.principality.co.uk/home/your-account',
    open_banking_evidence: 'https://www.principality.co.uk/home/open-banking-policy',
    digital_onboarding_evidence: 'https://www.principality.co.uk/home/savings/savings-accounts/online-easy-access',
    devops_cloud_evidence: 'https://www.principality.co.uk/home/about-us/working-for-principality',
  },

  // === Malta ===
  'Bank of Valletta': {
    mobile_banking_evidence: 'https://www.bov.com/mobile-banking-0',
    open_banking_evidence: 'https://openbanking.bov.com/docs/berlingroup/bov_mt/ais',
    digital_onboarding_evidence: 'https://join.bov.com/',
    ai_chatbot_evidence: 'https://www.bov.com/help-support',
  },

  // === Nordic - SpareBank 1 ===
  'SpareBank 1 Alliance': {
    mobile_banking_evidence: 'https://www.sparebank1.no/nb/bank/privat/daglig-bruk/mobilbank.html',
    digital_onboarding_evidence: 'https://www.sparebank1.no/nb/bank/privat/daglig-bruk/mobilbank.html',
    devops_cloud_evidence: 'https://sparebank1.dev/',
  },
  'SpareBank 1 SR-Bank': {
    mobile_banking_evidence: 'https://www.sparebank1.no/nb/sor-norge/privat/daglig-bruk/mobil-og-nettbank.html',
    digital_onboarding_evidence: 'https://www.sparebank1.no/nb/sor-norge/privat/kundeservice/bestill/bli-kunde.html',
    ai_chatbot_evidence: 'https://www.sparebank1.no/nb/sor-norge/privat/kundeservice.html',
    devops_cloud_evidence: 'https://sparebank1.dev/',
  },
  'SpareBank 1 SMN': {
    mobile_banking_evidence: 'https://www.sparebank1.no/nb/smn/privat/daglig-bruk/mobil-og-nettbank.html',
    digital_onboarding_evidence: 'https://www.sparebank1.no/nb/smn/privat/kundeservice/bestill/bli-kunde.html',
    ai_chatbot_evidence: 'https://www.sparebank1.no/nb/smn/privat/kundeservice/kontakt.html',
    devops_cloud_evidence: 'https://sparebank1.dev/',
  },
  'SpareBank 1 Nord-Norge': {
    mobile_banking_evidence: 'https://www.sparebank1.no/nb/nord-norge/privat/daglig-bruk/mobil-og-nettbank.html',
    digital_onboarding_evidence: 'https://www.sparebank1.no/nb/nord-norge/privat/kundeservice/bestill/bli-kunde.html',
    ai_chatbot_evidence: 'https://www.sparebank1.no/nb/nord-norge/privat/kundeservice.html',
    devops_cloud_evidence: 'https://sparebank1.dev/',
  },

  // === Nordic - Sparebanken (merged entities) ===
  'Sparebanken Vest': {
    mobile_banking_evidence: 'https://www.spv.no/dagligbank/nett-og-mobilbank',
    open_banking_evidence: 'https://www.spv.no/kundeservice/psd2',
    digital_onboarding_evidence: 'https://www.spv.no/bli-kunde',
    devops_cloud_evidence: 'https://www.spv.no/om-oss/jobb',
  },
  'Sparebanken Sor': {
    mobile_banking_evidence: 'https://www.sor.no/kort-og-betaling/mobil-og-nettbank/',
    open_banking_evidence: 'https://www.sor.no/felles/info/open-banking/',
    devops_cloud_evidence: 'https://www.sor.no/felles/karriere/',
  },

  // === Nordic - Swedbank ===
  'Swedbank and Savings Banks': {
    mobile_banking_evidence: 'https://www.swedbank.se/privat/digitala-tjanster/vara-appar.html',
    ai_chatbot_evidence: 'https://www.swedbank.se/privat/kundservice-privat.html',
  },

  // === Nordic - Nykredit ===
  'Nykredit': {
    mobile_banking_evidence: 'https://www.nykredit.dk/dit-liv/daglig-okonomi/mitnykredit-netbank/mitnykredit-pa-mobil-og-tablet/',
    open_banking_evidence: 'https://www.nykredit.dk/personoplysninger-og-cookies/payment-service-directive-ii-psd2/',
    digital_onboarding_evidence: 'https://www.nykredit.dk/dit-liv/nykredit-bank/',
    devops_cloud_evidence: 'https://www.nykredit.com/en-gb/career/nykredit-dci/',
  },

  // === Nordic - Finland ===
  'Savings Banks Group (Saastopankki)': {
    mobile_banking_evidence: 'https://www.saastopankki.fi/fi-fi/asiakaspalvelu/yhteydenottokanavat/saastopankki-mobiili',
    open_banking_evidence: 'https://www.saastopankki.fi/fi-fi/asiakaspalvelu/verkkopalvelut/psd2-ja-open-banking',
    digital_onboarding_evidence: 'https://www.saastopankki.fi/en/support/become-our-customer',
    ai_chatbot_evidence: 'https://www.saastopankki.fi/fi-fi/asiakaspalvelu/yhteydenottokanavat/chat',
    devops_cloud_evidence: 'https://www.saastopankki.fi/en/savingsbanksgroup',
  },
  'OP Financial Group': {
    mobile_banking_evidence: 'https://www.op.fi/en/private-customers/digital-services/op-mobile',
    open_banking_evidence: 'https://www.op.fi/en/private-customers/daily-banking/payment/psd2',
    digital_onboarding_evidence: 'https://www.op.fi/en/private-customers/customerinfo/become-op-customer',
    devops_cloud_evidence: 'https://www.op.fi/en/about-op-pohjola/career/career-opportunities/development-and-technologies/',
  },
  'Aktia Bank': {
    mobile_banking_evidence: 'https://www.aktia.fi/fi/paivittaiset-raha-asiat/mobiilipankki',
    open_banking_evidence: 'https://www.aktia.fi/fi/open-banking',
    digital_onboarding_evidence: 'https://www.aktia.fi/fi/tule-asiakkaaksi',
  },

  // === Nordic - Bank Norwegian ===
  'Bank Norwegian (Nordax Group)': {
    devops_cloud_evidence: 'https://careers.noba.bank/',
  },

  // === Spain ===
  'CaixaBank': {
    mobile_banking_evidence: 'https://www.caixabank.es/particular/tarjetas/google-pay_en.html',
    open_banking_evidence: 'https://apistore.caixabank.com/home_en.html',
    digital_onboarding_evidence: 'https://www.caixabank.es/particular/cuentas/cuenta-sin-comisiones.html',
    ai_chatbot_evidence: 'https://www.caixabank.com/comunicacion/noticia/caixabank-crea-un-asistente-virtual-basado-en-inteligencia-artificial-para-dar-apoyo-a-todos-los-empleados-de-su-red_es.html?id=40809',
    devops_cloud_evidence: 'https://www.caixabanktech.com/en/join-us/',
  },
  'Ibercaja Banco': {
    mobile_banking_evidence: 'https://www.ibercaja.es/particulares/banca-digital/servicios/app-ibercaja/',
    open_banking_evidence: 'https://www.ibercaja.es/particulares/corner-del-especialista/informacion-psd2/',
    digital_onboarding_evidence: 'https://www.ibercaja.es/particulares/cuentas-tarjetas/cuentas-ahorro/cuenta-com/',
    devops_cloud_evidence: 'https://empleo.ibercaja.es/ofertas-de-empleo/',
  },
  'Kutxabank': {
    mobile_banking_evidence: 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/productos/banca-omnicanal/banca-movil-/pys',
    open_banking_evidence: 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/sobre-kutxabank/psd2/generico',
    digital_onboarding_evidence: 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/cuentas-y-planes-0/cuenta-corriente/pys',
    ai_chatbot_evidence: 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/servicio-atencion-al-cliente-/generico',
    devops_cloud_evidence: 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/sobre-kutxa/quienes-somos-3',
  },
  'Unicaja Banco': {
    mobile_banking_evidence: 'https://www.unicajabanco.es/en/banca-digital',
    open_banking_evidence: 'https://www.unicajabanco.es/es/faqs/banca-digital/psd2',
    digital_onboarding_evidence: 'https://www.unicajabanco.es/en/cuenta-online',
    ai_chatbot_evidence: 'https://www.unicajabanco.es/en/atencion-al-cliente',
    devops_cloud_evidence: 'https://joven.unicajabanco.es/',
  },
  'ABANCA': {
    mobile_banking_evidence: 'https://www.abanca.com/en/banca-a-distancia/banca-movil/',
    open_banking_evidence: 'https://www.abanca.com/es/legal/servicios-pago/',
    digital_onboarding_evidence: 'https://www.abanca.com/en/cuentas/cuenta-online/',
    devops_cloud_evidence: 'https://empleo.abanca.com/',
  },
  'Cajamar Caja Rural': {
    mobile_banking_evidence: 'https://www.cajamar.es/en/particulares/productos-y-servicios/banca-a-distancia/banca-movil/',
    open_banking_evidence: 'https://www.cajamar.es/en/comun/psd2/',
    digital_onboarding_evidence: 'https://www.cajamar.es/en/particulares/productos-y-servicios/cuentas/pack-wefferent/',
    devops_cloud_evidence: 'https://www.cajamar.es/es/comun/informacion-corporativa/empleo/',
  },
  'Caja Rural de Navarra': {
    mobile_banking_evidence: 'https://www.cajaruraldenavarra.com/en/node/4431',
    open_banking_evidence: 'https://www.cajaruraldenavarra.com/es/informacion-psd2',
    devops_cloud_evidence: 'https://www.cajaruraldenavarra.com/es/recomienda-talento',
  },
  'Laboral Kutxa': {
    mobile_banking_evidence: 'https://www.laboralkutxa.com/es/personas/servicios/banca-online/',
    open_banking_evidence: 'https://www.laboralkutxa.com/es/informacion-legal/informacion-apis/',
    digital_onboarding_evidence: 'https://www.laboralkutxa.com/es/particulares/ahorro/cuentas-y-depositos',
    devops_cloud_evidence: 'https://www.laboralkutxa.com/es/personas/trabaja-con-nosotros/',
  },

  // === Portugal ===
  'Caixa Geral de Depositos': {
    mobile_banking_evidence: 'https://www.cgd.pt/Particulares/Contas/Caixadirecta/Pages/refresh-app-caixadirecta.aspx',
    open_banking_evidence: 'https://www.cgd.pt/Institucional/Noticias/Pages/Open-Banking-SIBS-API-Market.aspx',
    digital_onboarding_evidence: 'https://www.cgd.pt/Particulares/Contas/Contas-a-Ordem/Pages/Conta-Caixa-S.aspx',
  },
  'Banco Montepio': {
    mobile_banking_evidence: 'https://www.bancomontepio.pt/en/individuals/everyday-banking/digital-banking',
    open_banking_evidence: 'https://www.bancomontepio.pt/en/open-banking-apis',
    digital_onboarding_evidence: 'https://www.bancomontepio.pt/en/individuals/everyday-banking/open-account-online',
  },

  // === France ===
  "Groupe BPCE (Caisse d'Epargne network)": {
    mobile_banking_evidence: 'https://www.caisse-epargne.fr/banque-a-distance/applications-smartphone/',
    digital_onboarding_evidence: 'https://www.caisse-epargne.fr/comptes-cartes/ouvrir-compte/',
    devops_cloud_evidence: 'https://www.groupebpce.com/en/all-the-latest-news/',
  },
  'Credit Mutuel Alliance Federale': {
    mobile_banking_evidence: 'https://www.creditmutuel.fr/fr/particuliers/comptes/application-mobile-credit-mutuel.html',
    open_banking_evidence: 'https://www.creditmutuel.fr/oauth2/en/devportal/open-banking-api.html',
    digital_onboarding_evidence: 'https://www.creditmutuel.fr/fr/particuliers/comptes/ouvrir-un-compte.html',
    ai_chatbot_evidence: 'https://www.creditmutuel.fr/fr/particuliers/mobile/obtenez-des-reponses-a-vos-questions.html',
    devops_cloud_evidence: 'https://www.creditmutuelalliancefederale.fr/en/who-are-we/our-business-lines-and-subsidiaries.html',
  },
  'Credit Agricole Group': {
    mobile_banking_evidence: 'https://www.credit-agricole.fr/particulier/applications/ma-banque.html',
    digital_onboarding_evidence: 'https://www.credit-agricole.fr/particulier/ouvrir-un-compte.html',
    ai_chatbot_evidence: 'https://www.credit-agricole.fr/particulier/faq.html',
    devops_cloud_evidence: 'https://www.credit-agricole.com/en/finance/financial-publications',
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

const newLines = [lines[0]]; // keep header as-is

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
console.log('Now run: node scripts/import_csv.mjs to regenerate all files');
