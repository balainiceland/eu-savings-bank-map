#!/usr/bin/env node
/**
 * Geocode bulk banks using Nominatim (free OSM geocoder)
 * - Persistent cache in data/geocode_cache.json
 * - Rate limited to 1 request per 1.1 seconds
 * - Falls back to country center coordinates
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'data');
const CACHE_PATH = resolve(DATA_DIR, 'geocode_cache.json');

// Country center coordinates (fallback when city unknown or geocoding fails)
const COUNTRY_CENTERS = {
  AT: [47.5162, 14.5501],
  BE: [50.8503, 4.3517],
  DK: [56.2639, 9.5018],
  FI: [61.9241, 25.7482],
  FR: [46.2276, 2.2137],
  DE: [51.1657, 10.4515],
  IT: [41.8719, 12.5674],
  NO: [60.4720, 8.4689],
  PL: [51.9194, 19.1451],
  PT: [39.3999, -8.2245],
  ES: [40.4637, -3.7492],
  SE: [60.1282, 18.6435],
  CH: [46.8182, 8.2275],
  GB: [55.3781, -3.4360],
  CZ: [49.8175, 15.4730],
  HU: [47.1625, 19.5033],
  LU: [49.8153, 6.1296],
  MT: [35.9375, 14.3754],
  NL: [52.1326, 5.2913],
  RO: [45.9432, 24.9668],
  SK: [48.6690, 19.6990],
  SI: [46.1512, 14.9955],
  AL: [41.1533, 20.1683],
  IS: [64.9631, -19.0208],
  HR: [45.1000, 15.2000],
  BG: [42.7339, 25.4858],
  RS: [44.0165, 21.0059],
  GR: [39.0742, 21.8243],
};

// Country code to country name map for Nominatim
const COUNTRY_NAMES = {
  AT: 'Austria', BE: 'Belgium', DK: 'Denmark', FI: 'Finland', FR: 'France',
  DE: 'Germany', IT: 'Italy', NO: 'Norway', PL: 'Poland', PT: 'Portugal',
  ES: 'Spain', SE: 'Sweden', CH: 'Switzerland', GB: 'United Kingdom',
  CZ: 'Czech Republic', HU: 'Hungary', LU: 'Luxembourg', MT: 'Malta',
  NL: 'Netherlands', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia',
  AL: 'Albania', IS: 'Iceland', HR: 'Croatia', BG: 'Bulgaria',
  RS: 'Serbia', GR: 'Greece',
};

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

// ─── Geocoder ──────────────────────────────────────────────────────────────
function loadCache() {
  if (existsSync(CACHE_PATH)) {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  }
  return {};
}

function saveCache(cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function geocodeCity(city, countryCode, cache) {
  if (!city) return null;

  const countryName = COUNTRY_NAMES[countryCode] || '';
  const key = `${city}, ${countryName}`.toLowerCase();

  if (cache[key]) {
    return cache[key];
  }

  // Query Nominatim
  const query = encodeURIComponent(`${city}, ${countryName}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=${countryCode.toLowerCase()}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'EU-Savings-Bank-Map/1.0 (research project)' }
    });
    const data = await res.json();

    if (data && data.length > 0) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      cache[key] = result;
      return result;
    }
  } catch (err) {
    console.warn(`  Geocode error for "${city}, ${countryName}": ${err.message}`);
  }

  // Mark as failed so we don't retry
  cache[key] = null;
  return null;
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  // Read bulk_banks_raw.csv
  const rawText = readFileSync(resolve(DATA_DIR, 'bulk_banks_raw.csv'), 'utf8');
  const banks = parseCSV(rawText);
  console.log(`Read ${banks.length} banks from bulk_banks_raw.csv`);

  const cache = loadCache();
  const cacheSize = Object.keys(cache).length;
  console.log(`Geocode cache: ${cacheSize} entries`);

  // Collect unique cities to geocode
  const citySet = new Map(); // "city|CC" → bank indices
  for (let i = 0; i < banks.length; i++) {
    const bank = banks[i];
    if (bank.city && (bank.latitude === '0' || bank.latitude === '')) {
      const key = `${bank.city}|${bank.country_code}`;
      if (!citySet.has(key)) citySet.set(key, []);
      citySet.get(key).push(i);
    }
  }

  console.log(`Need to geocode ${citySet.size} unique cities`);

  let geocoded = 0;
  let cached = 0;
  let failed = 0;

  for (const [cityKey, indices] of citySet) {
    const [city, cc] = cityKey.split('|');
    const countryName = COUNTRY_NAMES[cc] || '';
    const cacheKey = `${city}, ${countryName}`.toLowerCase();

    let result;
    if (cache[cacheKey] !== undefined) {
      result = cache[cacheKey];
      cached++;
    } else {
      result = await geocodeCity(city, cc, cache);
      geocoded++;

      // Rate limit: 1 req per 1.1s for Nominatim
      await sleep(1100);

      // Save cache periodically
      if (geocoded % 20 === 0) {
        saveCache(cache);
        console.log(`  Progress: ${geocoded + cached}/${citySet.size} cities (${geocoded} API calls)`);
      }
    }

    // Apply coordinates
    const fallback = COUNTRY_CENTERS[cc] || [0, 0];
    const lat = result?.lat ?? fallback[0];
    const lng = result?.lng ?? fallback[1];

    if (!result) failed++;

    for (const idx of indices) {
      banks[idx].latitude = String(lat);
      banks[idx].longitude = String(lng);
    }
  }

  // Handle banks with no city — use country center
  for (const bank of banks) {
    if (bank.latitude === '0' || bank.latitude === '') {
      const fallback = COUNTRY_CENTERS[bank.country_code] || [0, 0];
      bank.latitude = String(fallback[0]);
      bank.longitude = String(fallback[1]);
    }
  }

  // Save final cache
  saveCache(cache);
  console.log(`\nGeocoding complete:`);
  console.log(`  From cache: ${cached}`);
  console.log(`  API calls: ${geocoded}`);
  console.log(`  Failed (using country center): ${failed}`);
  console.log(`  Cache now has ${Object.keys(cache).length} entries`);

  // Write output
  const headers = Object.keys(banks[0]);
  const csvLines = [headers.join(',')];
  for (const bank of banks) {
    csvLines.push(headers.map(h => csvEscape(bank[h])).join(','));
  }

  const outPath = resolve(DATA_DIR, 'bulk_banks_geocoded.csv');
  writeFileSync(outPath, csvLines.join('\n') + '\n');
  console.log(`\nWrote ${outPath} (${banks.length} banks)`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
