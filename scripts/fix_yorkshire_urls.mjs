#!/usr/bin/env node
/**
 * Fix bogus evidence URLs for Yorkshire Building Society in Supabase
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gmogahicbavkydshgmwe.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_KEY) {
  console.error('Set SUPABASE_SERVICE_KEY env var (service_role key from Supabase dashboard > Settings > API)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FIXES = [
  { category: 'mobile_banking', url: 'https://www.ybs.co.uk/app' },
  { category: 'open_banking', url: 'https://www.ybs.co.uk/openbanking' },
  { category: 'digital_onboarding', url: 'https://www.ybs.co.uk/my-money/current-account-vs-savings-account' },
  { category: 'devops_cloud', url: 'https://ybscareers.co.uk/' },
];

async function main() {
  // Find Yorkshire BS bank ID
  const { data: banks, error: bankErr } = await supabase
    .from('banks')
    .select('id, name')
    .eq('name', 'Yorkshire Building Society');

  if (bankErr) { console.error('Error finding bank:', bankErr); process.exit(1); }
  if (!banks || banks.length === 0) { console.error('Yorkshire Building Society not found in database'); process.exit(1); }

  const bankId = banks[0].id;
  console.log(`Found Yorkshire BS: ${bankId}`);

  for (const fix of FIXES) {
    const { data, error } = await supabase
      .from('digital_features')
      .update({ evidence_url: fix.url })
      .eq('bank_id', bankId)
      .eq('category', fix.category)
      .select('id, category, evidence_url');

    if (error) {
      console.error(`  ERROR updating ${fix.category}:`, error.message);
    } else if (data && data.length > 0) {
      console.log(`  Updated ${fix.category} → ${fix.url}`);
    } else {
      console.log(`  No row matched for ${fix.category}`);
    }
  }

  console.log('Done!');
}

main();
