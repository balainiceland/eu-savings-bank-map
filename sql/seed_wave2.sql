-- Seed Wave 2: 20 additional European savings banks
-- Run this in Supabase SQL Editor after the initial seed

-- 1. Nassauische Sparkasse (Naspa)
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Nassauische Sparkasse', 'Germany', 'DE', 'Wiesbaden', 50.0826, 8.2432, 'Sparkassen-Finanzgruppe', 'https://www.naspa.de', 1840, 15300, 700, 12456, 2457, 225, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 2. Kreissparkasse Köln
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Kreissparkasse Köln', 'Germany', 'DE', 'Cologne', 50.9354, 6.9536, 'Sparkassen-Finanzgruppe', 'https://www.ksk-koeln.de', 1852, 28000, 900, 4000, 200, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 3. Sparkasse Hannover
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Sparkasse Hannover', 'Germany', 'DE', 'Hannover', 52.3759, 9.7320, 'Sparkassen-Finanzgruppe', 'https://www.sparkasse-hannover.de', 1823, 19000, 900, 3000, 100, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 4. Stadtsparkasse München
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Stadtsparkasse München', 'Germany', 'DE', 'Munich', 48.1351, 11.5820, 'Sparkassen-Finanzgruppe', 'https://www.sskm.de', 1824, 22000, 700, 3500, 70, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 5. SpareBank 1 Østlandet
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('SpareBank 1 Østlandet', 'Norway', 'NO', 'Hamar', 60.7945, 11.0680, 'SpareBank 1 Alliance', 'https://www.sparebank1.no/ostlandet', 1845, 20000, 350, 1200, 50, 2024, 73, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 6. SpareBank 1 Nord-Norge
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('SpareBank 1 Nord-Norge', 'Norway', 'NO', 'Tromsø', 69.6492, 18.9553, 'SpareBank 1 Alliance', 'https://www.sparebank1.no/nord-norge', 1836, 15000, 250, 800, 90, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 7. Länsförsäkringar Bank
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Länsförsäkringar Bank', 'Sweden', 'SE', 'Stockholm', 59.3365, 18.0636, 'Länsförsäkringar Alliance', 'https://www.lansforsakringar.se', 1996, 22000, 400, 517, 130, 2024, 53, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 8. OP Financial Group
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('OP Financial Group', 'Finland', 'FI', 'Helsinki', 60.1699, 24.9384, 'https://www.op.fi', 1902, 160000, 2000, 12000, 350, 2024, 87, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 9. Unicaja Banco
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Unicaja Banco', 'Spain', 'ES', 'Málaga', 36.7213, -4.4214, 'https://www.unicajabanco.es', 1991, 78000, 4500, 8000, 1300, 2024, 40, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 10. Ibercaja
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Ibercaja', 'Spain', 'ES', 'Zaragoza', 41.6488, -0.8891, 'https://www.ibercaja.com', 1873, 55000, 3000, 75803, 5000, 1000, 2024, 40, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 11. Banca Monte dei Paschi di Siena
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Banca Monte dei Paschi di Siena', 'Italy', 'IT', 'Siena', 43.3186, 11.3308, 'https://www.mps.it', 1472, 150000, 5000, 11000, 1400, 2024, 53, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 12. Banco BPI
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Banco BPI', 'Portugal', 'PT', 'Porto', 41.1579, -8.6291, 'CaixaBank Group', 'https://www.bancobpi.pt', 1981, 41072, 1400, 4352, 299, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 13. Česká spořitelna
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Česká spořitelna', 'Czech Republic', 'CZ', 'Prague', 50.0755, 14.4378, 'Erste Group', 'https://www.csas.cz', 1825, 80000, 5000, 10000, 600, 2024, 67, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 14. OTP Bank
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('OTP Bank', 'Hungary', 'HU', 'Budapest', 47.4979, 19.0402, 'https://www.otpgroup.info', 1949, 47000, 13000, 36000, 1500, 2024, 67, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 15. Banca Transilvania
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Banca Transilvania', 'Romania', 'RO', 'Cluj-Napoca', 46.7712, 23.6236, 'https://www.bancatransilvania.ro', 1993, 42000, 4600, 10000, 500, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 16. PKO Bank Polski
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('PKO Bank Polski', 'Poland', 'PL', 'Warsaw', 52.2297, 21.0122, 'https://www.pkobp.pl', 1919, 122000, 12100, 25000, 900, 2024, 80, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 17. Nationwide Building Society
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Nationwide Building Society', 'United Kingdom', 'GB', 'Swindon', 51.5588, -1.7818, 'https://www.nationwide.co.uk', 1846, 335000, 16000, 207000, 18000, 625, 2024, 80, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 18. de Volksbank
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('de Volksbank', 'Netherlands', 'NL', 'Utrecht', 52.0907, 5.1214, 'https://www.devolksbank.nl', 2017, 85000, 3500, 5000, 200, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 19. KBC Group
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('KBC Group', 'Belgium', 'BE', 'Brussels', 50.8629, 4.3497, 'https://www.kbc.com', 1998, 355000, 12000, 41000, 1200, 2024, 100, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 20. Spuerkeess (BCEE)
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Spuerkeess (BCEE)', 'Luxembourg', 'LU', 'Luxembourg City', 49.6116, 6.1319, 'https://www.spuerkeess.lu', 1856, 57155, 300, 1929, 60, 2024, 53, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');
