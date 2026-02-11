-- Update digital feature maturity levels with research-backed assessments
-- Run this in Supabase SQL Editor

-- Helper: update a bank's digital features + recompute score
-- Arguments: bank name, mobile, open_banking, onboarding, ai_chatbot, devops_cloud

DO $$
DECLARE
  points_map jsonb := '{"none": 0, "basic": 1, "intermediate": 2, "advanced": 3}';

  TYPE assessment IS RECORD (
    bank_name TEXT,
    mobile TEXT,
    open_banking TEXT,
    onboarding TEXT,
    ai_chatbot TEXT,
    devops_cloud TEXT
  );
BEGIN
  -- We'll use a series of UPDATE blocks instead
  NULL;
END $$;

-- Sparkasse KölnBonn: advanced/basic/advanced/intermediate/intermediate = 3+1+3+2+2=11 → 73
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse KölnBonn') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse KölnBonn') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse KölnBonn') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse KölnBonn') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse KölnBonn') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 73 WHERE name = 'Sparkasse KölnBonn';

-- Hamburger Sparkasse: advanced/basic/advanced/intermediate/intermediate = 3+1+3+2+2=11 → 73
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 73 WHERE name = 'Hamburger Sparkasse';

-- Berliner Sparkasse: advanced/basic/advanced/intermediate/intermediate = 3+1+3+2+2=11 → 73
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 73 WHERE name = 'Berliner Sparkasse';

-- CaixaBank: advanced/advanced/advanced/advanced/advanced = 3+3+3+3+3=15 → 100 (unchanged)
-- No updates needed for CaixaBank

-- Kutxabank: intermediate/basic/intermediate/basic/intermediate = 2+1+2+1+2=8 → 53
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 53 WHERE name = 'Kutxabank';

-- SpareBank 1 SR-Bank: advanced/intermediate/intermediate/advanced/advanced = 3+2+2+3+3=13 → 87
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 87 WHERE name = 'SpareBank 1 SR-Bank';

-- SpareBank 1 SMN: advanced/intermediate/intermediate/intermediate/advanced = 3+2+2+2+3=12 → 80
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 80 WHERE name = 'SpareBank 1 SMN';

-- Swedbank: advanced/intermediate/intermediate/intermediate/advanced = 3+2+2+2+3=12 → 80
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Swedbank') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Swedbank') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Swedbank') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Swedbank') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Swedbank') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 80 WHERE name = 'Swedbank';

-- Erste Group: advanced/advanced/advanced/advanced/intermediate = 3+3+3+3+2=14 → 93 (unchanged)
-- No updates needed for Erste Group

-- Sp-Pankki: intermediate/basic/intermediate/intermediate/basic = 2+1+2+2+1=8 → 53
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sp-Pankki') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sp-Pankki') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sp-Pankki') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sp-Pankki') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sp-Pankki') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 53 WHERE name = 'Sp-Pankki';

-- Spar Nord: advanced/advanced/basic/basic/intermediate = 3+3+1+1+2=10 → 67
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Spar Nord') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Spar Nord') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Spar Nord') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Spar Nord') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Spar Nord') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 67 WHERE name = 'Spar Nord';

-- Caisse d'Epargne: advanced/intermediate/intermediate/advanced/intermediate = 3+2+2+3+2=12 → 80
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caisse d%Epargne') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caisse d%Epargne') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caisse d%Epargne') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caisse d%Epargne') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caisse d%Epargne') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 80 WHERE name LIKE 'Caisse d%Epargne';

-- Yorkshire Building Society: intermediate/intermediate/intermediate/basic/intermediate = 2+2+2+1+2=9 → 60
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Yorkshire Building Society') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 60 WHERE name = 'Yorkshire Building Society';

-- Bank Pocztowy: intermediate/basic/basic/none/basic = 2+1+1+0+1=5 → 33 (unchanged)
-- No updates needed for Bank Pocztowy

-- Caixa Geral de Depósitos: advanced/intermediate/advanced/advanced/intermediate = 3+2+3+3+2=13 → 87
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caixa Geral%') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caixa Geral%') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caixa Geral%') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caixa Geral%') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'Caixa Geral%') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 87 WHERE name LIKE 'Caixa Geral%';

-- Raiffeisen Switzerland: intermediate/basic/intermediate/intermediate/intermediate = 2+1+2+2+2=9 → 60
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Switzerland') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Switzerland') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Switzerland') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Switzerland') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Switzerland') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 60 WHERE name = 'Raiffeisen Switzerland';

-- Belfius: advanced/basic/intermediate/advanced/advanced = 3+1+2+3+3=12 → 80
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'intermediate', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'advanced', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 80 WHERE name = 'Belfius';

-- CDP (Cassa Depositi e Prestiti): none/none/none/none/basic = 0+0+0+0+1=1 → 7
UPDATE digital_features SET maturity_level = 'none', present = false
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'CDP%') AND category = 'mobile_banking';
UPDATE digital_features SET maturity_level = 'none', present = false
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'CDP%') AND category = 'open_banking';
UPDATE digital_features SET maturity_level = 'none', present = false
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'CDP%') AND category = 'digital_onboarding';
UPDATE digital_features SET maturity_level = 'none', present = false
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'CDP%') AND category = 'ai_chatbot';
UPDATE digital_features SET maturity_level = 'basic', present = true
  WHERE bank_id = (SELECT id FROM banks WHERE name LIKE 'CDP%') AND category = 'devops_cloud';
UPDATE banks SET digital_score = 7 WHERE name LIKE 'CDP%';
