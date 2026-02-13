#!/usr/bin/env node
/**
 * Automated digital feature detection for placeholder banks
 * - iTunes Search API for mobile banking apps
 * - Website HTML keyword analysis for open banking, AI chatbot, digital onboarding
 * - Persistent cache to avoid re-fetching on re-runs
 * - Rate limited: 3s between iTunes calls, 1.5s between website fetches
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'data');
const CACHE_PATH = resolve(DATA_DIR, 'enrich_cache.json');

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

// ─── Cache ─────────────────────────────────────────────────────────────────
function loadCache() {
  if (existsSync(CACHE_PATH)) {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  }
  return { itunes: {}, websites: {} };
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Country code to iTunes store code ─────────────────────────────────────
const CC_TO_ITUNES = {
  AT: 'at', BE: 'be', BG: 'bg', HR: 'hr', CZ: 'cz', DK: 'dk', FI: 'fi',
  FR: 'fr', DE: 'de', GR: 'gr', HU: 'hu', IS: 'is', IT: 'it', LU: 'lu',
  MT: 'mt', NL: 'nl', NO: 'no', PL: 'pl', PT: 'pt', RO: 'ro', RS: 'rs',
  SK: 'sk', SI: 'si', ES: 'es', SE: 'se', CH: 'ch', GB: 'gb', AL: 'al',
};

// ─── iTunes Search ─────────────────────────────────────────────────────────
async function searchItunes(bankName, countryCode, cache) {
  const cacheKey = `${bankName}|${countryCode}`.toLowerCase();
  if (cache.itunes[cacheKey] !== undefined) {
    return cache.itunes[cacheKey];
  }

  const itunesCC = CC_TO_ITUNES[countryCode] || 'us';

  // Clean bank name for search (remove parenthetical suffixes, common noise)
  const searchName = bankName
    .replace(/\s*\(.*?\)\s*/g, ' ')
    .replace(/\b(group|alliance|network)\b/gi, '')
    .trim();

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchName)}&country=${itunesCC}&entity=software&limit=10`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`  iTunes ${res.status} for "${searchName}" (${itunesCC})`);
      cache.itunes[cacheKey] = null;
      return null;
    }

    const data = await res.json();
    const results = data.results || [];

    // Match: bank name words appear in trackName or artistName
    const nameWords = searchName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const match = results.find(app => {
      const trackLower = (app.trackName || '').toLowerCase();
      const artistLower = (app.artistName || '').toLowerCase();
      const combined = trackLower + ' ' + artistLower;
      // At least 2 significant words match, or the whole name is a substring
      const matchCount = nameWords.filter(w => combined.includes(w)).length;
      return matchCount >= Math.min(2, nameWords.length) || combined.includes(searchName.toLowerCase());
    });

    if (match) {
      const result = {
        found: true,
        trackName: match.trackName,
        artistName: match.artistName,
        rating: match.averageUserRating || 0,
        reviewCount: match.userRatingCount || 0,
        url: match.trackViewUrl,
      };
      cache.itunes[cacheKey] = result;
      return result;
    }

    // Fallback: try US store if local store had no match
    if (itunesCC !== 'us') {
      const usUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchName)}&country=us&entity=software&limit=10`;
      await sleep(1500);

      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 15000);
      const res2 = await fetch(usUrl, { signal: controller2.signal });
      clearTimeout(timeout2);

      if (res2.ok) {
        const data2 = await res2.json();
        const results2 = data2.results || [];
        const match2 = results2.find(app => {
          const combined = ((app.trackName || '') + ' ' + (app.artistName || '')).toLowerCase();
          const matchCount = nameWords.filter(w => combined.includes(w)).length;
          return matchCount >= Math.min(2, nameWords.length) || combined.includes(searchName.toLowerCase());
        });

        if (match2) {
          const result = {
            found: true,
            trackName: match2.trackName,
            artistName: match2.artistName,
            rating: match2.averageUserRating || 0,
            reviewCount: match2.userRatingCount || 0,
            url: match2.trackViewUrl,
          };
          cache.itunes[cacheKey] = result;
          return result;
        }
      }
    }

    cache.itunes[cacheKey] = { found: false };
    return { found: false };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`  iTunes timeout for "${searchName}"`);
    } else {
      console.warn(`  iTunes error for "${searchName}": ${err.message}`);
    }
    cache.itunes[cacheKey] = null;
    return null;
  }
}

function scoreMobileApp(itunesResult) {
  if (!itunesResult || !itunesResult.found) return { maturity: 'none', evidence: '' };

  const { rating, reviewCount, url } = itunesResult;

  if (rating >= 4.0 && reviewCount > 1000) {
    return { maturity: 'advanced', evidence: url };
  }
  if (rating >= 3.0 || reviewCount > 100) {
    return { maturity: 'intermediate', evidence: url };
  }
  return { maturity: 'basic', evidence: url };
}

// ─── Website HTML Fetcher ──────────────────────────────────────────────────
async function fetchWebsiteHTML(websiteUrl, cache) {
  const cacheKey = websiteUrl.toLowerCase().replace(/\/+$/, '');
  if (cache.websites[cacheKey] !== undefined) {
    return cache.websites[cacheKey];
  }

  // Ensure URL has protocol
  let url = websiteUrl;
  if (!url.startsWith('http')) url = 'https://' + url;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9,de;q=0.8,fr;q=0.7,es;q=0.6',
      },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`  Website ${res.status} for ${url}`);
      cache.websites[cacheKey] = null;
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      cache.websites[cacheKey] = null;
      return null;
    }

    // Read up to 500KB
    const reader = res.body.getReader();
    const chunks = [];
    let totalBytes = 0;
    const MAX_BYTES = 500 * 1024;

    while (totalBytes < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalBytes += value.length;
    }
    reader.cancel();

    const html = new TextDecoder().decode(Buffer.concat(chunks)).substring(0, MAX_BYTES);
    cache.websites[cacheKey] = html;
    return html;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`  Website timeout for ${url}`);
    } else if (err.code === 'ERR_TLS_CERT_ALTNAME_INVALID' || err.code === 'CERT_HAS_EXPIRED' || err.message.includes('SSL') || err.message.includes('certificate')) {
      console.warn(`  SSL error for ${url}`);
    } else {
      console.warn(`  Website error for ${url}: ${err.message}`);
    }
    cache.websites[cacheKey] = null;
    return null;
  }
}

// ─── Feature Detectors (from HTML) ─────────────────────────────────────────
function detectOpenBanking(html) {
  if (!html) return { maturity: 'none', evidence: '' };

  const lower = html.toLowerCase();
  const keywords = [
    /\bapi\b/, /developer/, /open\s*banking/, /psd2/, /openapi/, /xs2a/, /\btpp\b/,
  ];

  const matches = keywords.filter(kw => kw.test(lower)).length;

  if (matches >= 3) return { maturity: 'intermediate' };
  if (matches >= 1) return { maturity: 'basic' };
  return { maturity: 'none' };
}

function detectAIChatbot(html) {
  if (!html) return { maturity: 'none', evidence: '' };

  const lower = html.toLowerCase();
  const widgets = [
    'intercom', 'drift', 'tidio', 'livechat', 'jivochat', 'zendesk',
    'freshchat', 'crisp.chat', 'tawk.to', 'hubspot', 'userlike',
    'chatbot', 'live-chat', 'livechat-widget',
  ];

  const found = widgets.some(w => lower.includes(w));
  if (found) return { maturity: 'basic' };
  return { maturity: 'none' };
}

function detectDigitalOnboarding(html) {
  if (!html) return { maturity: 'none', evidence: '' };

  const lower = html.toLowerCase();
  const keywords = [
    'online account', 'open account', 'konto eröffnen', 'konto eroffnen',
    'ouvrir un compte', 'aprire conto', 'abrir cuenta',
    'video ident', 'digital onboarding', 'öppna konto', 'oppna konto',
    'åpne konto', 'apne konto', 'open an account', 'create account',
    'register online', 'online registration', 'digital account',
  ];

  const matches = keywords.filter(kw => lower.includes(kw)).length;

  if (matches >= 2) return { maturity: 'intermediate' };
  if (matches >= 1) return { maturity: 'basic' };
  return { maturity: 'none' };
}

// ─── Score Calculation ─────────────────────────────────────────────────────
const MATURITY_POINTS = { none: 0, basic: 1, intermediate: 2, advanced: 3 };

function computeScore(levels) {
  const total = levels.reduce((sum, l) => sum + (MATURITY_POINTS[l] || 0), 0);
  return Math.round((total / 15) * 100);
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== Automated Digital Feature Detection ===\n');

  // Read master CSV
  const csvText = readFileSync(resolve(DATA_DIR, 'european_savings_bank_data.csv'), 'utf8');
  const banks = parseCSV(csvText);
  console.log(`Read ${banks.length} banks from master CSV`);

  // Filter: placeholder banks with websites
  const targets = banks.filter(b => {
    const isPlaceholder = ['mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud']
      .every(f => !b[f] || b[f] === 'none');
    const hasWebsite = b.website && b.website.startsWith('http');
    return isPlaceholder && hasWebsite;
  });
  console.log(`Placeholder banks with websites: ${targets.length}\n`);

  // Load cache
  const cache = loadCache();
  const itunesCached = Object.keys(cache.itunes).length;
  const websitesCached = Object.keys(cache.websites).length;
  console.log(`Cache: ${itunesCached} iTunes entries, ${websitesCached} website entries\n`);

  // Results
  const automatedRows = []; // per-feature rows
  const summaryRows = [];   // per-bank summary

  let processed = 0;
  let itunesApiCalls = 0;
  let websiteFetches = 0;

  for (const bank of targets) {
    processed++;
    const pct = Math.round((processed / targets.length) * 100);
    console.log(`[${processed}/${targets.length}] (${pct}%) ${bank.name} (${bank.country_code})`);

    // ── iTunes: mobile banking ──
    const itunesCacheKey = `${bank.name}|${bank.country_code}`.toLowerCase();
    const needsItunes = cache.itunes[itunesCacheKey] === undefined;

    const itunesResult = await searchItunes(bank.name, bank.country_code, cache);
    const mobile = scoreMobileApp(itunesResult);
    if (mobile.maturity !== 'none') {
      console.log(`  📱 Mobile: ${mobile.maturity} (${itunesResult?.trackName})`);
    }

    if (needsItunes) {
      itunesApiCalls++;
      await sleep(3000); // iTunes rate limit
    }

    // ── Website: open banking, chatbot, digital onboarding ──
    const websiteCacheKey = bank.website.toLowerCase().replace(/\/+$/, '');
    const needsWebsite = cache.websites[websiteCacheKey] === undefined;

    const html = await fetchWebsiteHTML(bank.website, cache);

    if (needsWebsite) {
      websiteFetches++;
      await sleep(1500); // website rate limit
    }

    const openBanking = detectOpenBanking(html);
    const chatbot = detectAIChatbot(html);
    const onboarding = detectDigitalOnboarding(html);

    // Set evidence URLs (website) for detected features
    if (openBanking.maturity !== 'none') {
      openBanking.evidence = bank.website;
      console.log(`  🏦 Open Banking: ${openBanking.maturity}`);
    }
    if (chatbot.maturity !== 'none') {
      chatbot.evidence = bank.website;
      console.log(`  🤖 Chatbot: ${chatbot.maturity}`);
    }
    if (onboarding.maturity !== 'none') {
      onboarding.evidence = bank.website;
      console.log(`  📝 Onboarding: ${onboarding.maturity}`);
    }

    // Collect per-feature rows (only for detected features)
    const features = [
      { feature: 'mobile_banking', ...mobile },
      { feature: 'open_banking', ...openBanking },
      { feature: 'ai_chatbot', ...chatbot },
      { feature: 'digital_onboarding', ...onboarding },
    ];

    for (const f of features) {
      if (f.maturity !== 'none') {
        automatedRows.push({
          name: bank.name,
          country_code: bank.country_code,
          feature: f.feature,
          maturity: f.maturity,
          evidence_url: f.evidence || '',
        });
      }
    }

    // Summary row
    const levels = [mobile.maturity, openBanking.maturity, onboarding.maturity, chatbot.maturity, 'none'];
    const score = computeScore(levels);

    summaryRows.push({
      name: bank.name,
      country: bank.country,
      country_code: bank.country_code,
      city: bank.city,
      website: bank.website,
      mobile_banking: mobile.maturity,
      mobile_banking_evidence: mobile.evidence || '',
      open_banking: openBanking.maturity,
      open_banking_evidence: openBanking.evidence || '',
      digital_onboarding: onboarding.maturity,
      digital_onboarding_evidence: onboarding.evidence || '',
      ai_chatbot: chatbot.maturity,
      ai_chatbot_evidence: chatbot.evidence || '',
      devops_cloud: 'none',
      devops_cloud_evidence: '',
      digital_score: score,
    });

    // Save cache periodically
    if (processed % 10 === 0) {
      saveCache(cache);
    }
  }

  // Final cache save
  saveCache(cache);

  // ── Write enrichment_automated.csv ──
  const autoHeaders = ['name', 'country_code', 'feature', 'maturity', 'evidence_url'];
  const autoLines = [autoHeaders.join(',')];
  for (const row of automatedRows) {
    autoLines.push(autoHeaders.map(h => csvEscape(row[h])).join(','));
  }
  const autoPath = resolve(DATA_DIR, 'enrichment_automated.csv');
  writeFileSync(autoPath, autoLines.join('\n') + '\n');

  // ── Write enrichment_summary.csv ──
  const sumHeaders = [
    'name', 'country', 'country_code', 'city', 'website',
    'mobile_banking', 'mobile_banking_evidence',
    'open_banking', 'open_banking_evidence',
    'digital_onboarding', 'digital_onboarding_evidence',
    'ai_chatbot', 'ai_chatbot_evidence',
    'devops_cloud', 'devops_cloud_evidence',
    'digital_score',
  ];
  const sumLines = [sumHeaders.join(',')];
  for (const row of summaryRows) {
    sumLines.push(sumHeaders.map(h => csvEscape(row[h])).join(','));
  }
  const sumPath = resolve(DATA_DIR, 'enrichment_summary.csv');
  writeFileSync(sumPath, sumLines.join('\n') + '\n');

  // ── Summary ──
  const detected = summaryRows.filter(r => r.digital_score > 0);
  const mobileFound = summaryRows.filter(r => r.mobile_banking !== 'none').length;
  const openFound = summaryRows.filter(r => r.open_banking !== 'none').length;
  const chatFound = summaryRows.filter(r => r.ai_chatbot !== 'none').length;
  const onboardFound = summaryRows.filter(r => r.digital_onboarding !== 'none').length;

  console.log('\n=== Results ===');
  console.log(`Scanned: ${targets.length} banks`);
  console.log(`iTunes API calls: ${itunesApiCalls}`);
  console.log(`Website fetches: ${websiteFetches}`);
  console.log(`Banks with ≥1 signal: ${detected.length}`);
  console.log(`  Mobile banking: ${mobileFound}`);
  console.log(`  Open banking: ${openFound}`);
  console.log(`  AI chatbot: ${chatFound}`);
  console.log(`  Digital onboarding: ${onboardFound}`);
  console.log(`\nWrote ${autoPath} (${automatedRows.length} feature rows)`);
  console.log(`Wrote ${sumPath} (${summaryRows.length} bank summaries)`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
