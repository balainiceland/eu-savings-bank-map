-- Fix bogus evidence URLs for Yorkshire Building Society
-- Run in Supabase SQL Editor

UPDATE digital_features
SET evidence_url = 'https://www.ybs.co.uk/app'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.ybs.co.uk/openbanking'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.ybs.co.uk/my-money/current-account-vs-savings-account'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://ybscareers.co.uk/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society')
  AND category = 'devops_cloud';
