-- Seed Initial Banks
-- Run after schema.sql and rls_policies.sql

-- Helper: Insert bank and return id, then insert digital features
-- Using DO blocks for each bank

-- 1. Sparkasse KölnBonn
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status, featured)
  VALUES ('Sparkasse KölnBonn', 'Germany', 'DE', 'Cologne', 50.9375, 6.9603, 'Sparkassen-Finanzgruppe', 1826, 30000, 1000, 4200, 90, 67, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 2. Hamburger Sparkasse
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status, featured)
  VALUES ('Hamburger Sparkasse', 'Germany', 'DE', 'Hamburg', 53.5511, 9.9937, 'Sparkassen-Finanzgruppe', 1827, 50000, 1500, 5000, 100, 80, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 3. Berliner Sparkasse
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status, featured)
  VALUES ('Berliner Sparkasse', 'Germany', 'DE', 'Berlin', 52.5200, 13.4050, 'Sparkassen-Finanzgruppe', 1818, 45000, 1300, 4500, 85, 53, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 4. CaixaBank
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status, featured)
  VALUES ('CaixaBank', 'Spain', 'ES', 'Valencia', 39.4699, -0.3763, 2011, 600000, 20000, 44000, 4400, 100, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 5. Kutxabank
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Kutxabank', 'Spain', 'ES', 'Bilbao', 43.2630, -2.9350, 2012, 70000, 3000, 3500, 600, 67, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 6. SpareBank 1 SR-Bank
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('SpareBank 1 SR-Bank', 'Norway', 'NO', 'Stavanger', 58.9700, 5.7331, 'SpareBank 1 Alliance', 1839, 35000, 300, 1200, 30, 80, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 7. SpareBank 1 SMN
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('SpareBank 1 SMN', 'Norway', 'NO', 'Trondheim', 63.4305, 10.3951, 'SpareBank 1 Alliance', 1823, 25000, 300, 800, 25, 67, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 8. Swedbank
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status, featured)
  VALUES ('Swedbank', 'Sweden', 'SE', 'Stockholm', 59.3293, 18.0686, 1820, 250000, 7000, 14000, 350, 87, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 9. Erste Group
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status, featured)
  VALUES ('Erste Group', 'Austria', 'AT', 'Vienna', 48.2082, 16.3738, 1819, 300000, 17000, 46000, 1200, 87, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 10. Sp-Pankki
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Sp-Pankki', 'Finland', 'FI', 'Helsinki', 60.1699, 24.9384, 'Savings Banks Group', 1822, 12000, 300, 1500, 100, 40, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 11. Spar Nord
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Spar Nord', 'Denmark', 'DK', 'Aalborg', 57.0488, 9.9217, 1824, 20000, 400, 1500, 40, 67, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 12. Caisse d'Epargne
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Caisse d''Epargne', 'France', 'FR', 'Paris', 48.8566, 2.3522, 'BPCE', 1818, 450000, 25000, 35000, 3000, 67, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 13. Yorkshire Building Society
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Yorkshire Building Society', 'United Kingdom', 'GB', 'Bradford', 53.7960, -1.7594, 1864, 50000, 3000, 3500, 140, 40, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 14. Bank Pocztowy
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Bank Pocztowy', 'Poland', 'PL', 'Bydgoszcz', 53.1235, 18.0084, 1990, 4000, 1500, 1800, 470, 27, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'basic'),
  ((SELECT id FROM b), 'ai_chatbot', false, 'none'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 15. Caixa Geral de Depósitos
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Caixa Geral de Depósitos', 'Portugal', 'PT', 'Lisbon', 38.7223, -9.1393, 1876, 100000, 4000, 7500, 500, 67, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 16. Raiffeisen Switzerland
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Raiffeisen Switzerland', 'Switzerland', 'CH', 'St. Gallen', 47.4245, 9.3767, 1899, 250000, 3500, 11000, 800, 73, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 17. Belfius
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, customer_count, employee_count, branch_count, digital_score, status)
  VALUES ('Belfius', 'Belgium', 'BE', 'Brussels', 50.8503, 4.3517, 2011, 180000, 3500, 6500, 500, 87, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 18. CDP (Cassa Depositi e Prestiti)
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, founded_year, total_assets, employee_count, digital_score, status)
  VALUES ('CDP (Cassa Depositi e Prestiti)', 'Italy', 'IT', 'Rome', 41.9028, 12.4964, 1850, 400000, 1100, 27, 'published')
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'basic'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', false, 'none'),
  ((SELECT id FROM b), 'ai_chatbot', false, 'none'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');
