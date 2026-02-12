-- Fix bogus evidence URLs for Coventry Building Society
-- Run in Supabase SQL Editor

UPDATE digital_features
SET evidence_url = 'https://www.coventrybuildingsociety.co.uk/member/help/managing-your-money/app/features.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Coventry Building Society')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.coventrybuildingsociety.co.uk/member/help/savings/open-banking.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Coventry Building Society')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.coventrybuildingsociety.co.uk/member/help/savings/opening-an-account.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Coventry Building Society')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.coventrycareers.co.uk/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Coventry Building Society')
  AND category = 'devops_cloud';
