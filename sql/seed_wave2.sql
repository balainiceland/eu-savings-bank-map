-- Seed Wave 2: 20 additional European savings banks (research-verified data)
-- Run this in Supabase SQL Editor after the initial seed

-- 1. Nassauische Sparkasse (Naspa) — score 60
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Nassauische Sparkasse', 'Germany', 'DE', 'Wiesbaden', 50.0782, 8.2406, 'Sparkassen-Finanzgruppe', 'https://www.naspa.de', 1840, 15303, 700, 12456, 1626, 101, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 2. Kreissparkasse Köln — score 60
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Kreissparkasse Köln', 'Germany', 'DE', 'Cologne', 50.9366, 6.9468, 'Sparkassen-Finanzgruppe', 'https://www.ksk-koeln.de', 1852, 29870, 1000, 23000, 23600, 3797, 138, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 3. Sparkasse Hannover — score 60
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Sparkasse Hannover', 'Germany', 'DE', 'Hannover', 52.3690, 9.7430, 'Sparkassen-Finanzgruppe', 'https://www.sparkasse-hannover.de', 1823, 20973, 600, 14960, 1957, 89, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 4. Stadtsparkasse München — score 60
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Stadtsparkasse München', 'Germany', 'DE', 'Munich', 48.1357, 11.5790, 'Sparkassen-Finanzgruppe', 'https://www.sskm.de', 1824, 23699, 800, 18724, 2518, 90, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 5. SpareBank 1 Østlandet — score 80
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('SpareBank 1 Østlandet', 'Norway', 'NO', 'Hamar', 60.7945, 11.0680, 'SpareBank 1 Alliance', 'https://www.sparebank1.no/ostlandet', 1845, 18003, 350, 1100, 37, 2024, 80, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 6. SpareBank 1 Nord-Norge — score 80
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('SpareBank 1 Nord-Norge', 'Norway', 'NO', 'Tromsø', 69.6496, 18.9560, 'SpareBank 1 Alliance', 'https://www.sparebank1.no/nord-norge', 1836, 11622, 290, 760, 90, 2024, 80, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 7. Länsförsäkringar Bank — score 80
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Länsförsäkringar Bank', 'Sweden', 'SE', 'Stockholm', 59.3293, 18.0686, 'Länsförsäkringar Alliance', 'https://www.lansforsakringar.se', 1996, 21703, 3900, 13478, 35043, 517, 119, 2024, 80, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 8. OP Financial Group — score 93
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('OP Financial Group', 'Finland', 'FI', 'Helsinki', 60.1920, 24.9580, 'https://www.op.fi', 1902, 160000, 2100, 77700, 98900, 13000, 180, 2024, 93, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 9. Unicaja Banco — score 80
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Unicaja Banco', 'Spain', 'ES', 'Málaga', 36.7173, -4.4305, 'https://www.unicajabanco.es', 1991, 97000, 4000, 74400, 49000, 7500, 952, 2024, 80, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 10. Ibercaja — score 60
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Ibercaja', 'Spain', 'ES', 'Zaragoza', 41.6488, -0.8891, 'Fundación Bancaria Ibercaja', 'https://www.ibercaja.es', 1876, 53141, 2500, 34000, 29196, 5000, 890, 2024, 60, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'basic'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 11. Banca Monte dei Paschi di Siena — score 60
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Banca Monte dei Paschi di Siena', 'Italy', 'IT', 'Siena', 43.3188, 11.3308, 'https://www.mps.it', 1472, 121910, 5000, 82600, 87200, 16291, 1312, 2024, 60, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 12. Banco BPI — score 87
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Banco BPI', 'Portugal', 'PT', 'Porto', 41.1628, -8.6389, 'CaixaBank Group', 'https://www.bancobpi.pt', 1981, 41072, 1800, 39300, 30300, 4352, 299, 2024, 87, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 13. Česká spořitelna — score 87
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Česká spořitelna', 'Czech Republic', 'CZ', 'Prague', 50.0467, 14.4278, 'Erste Group', 'https://www.csas.cz', 1825, 80605, 5000, 59379, 42014, 10300, 550, 2024, 87, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'advanced'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 14. OTP Bank — score 67
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('OTP Bank', 'Hungary', 'HU', 'Budapest', 47.5056, 19.0485, 'https://www.otpbank.hu', 1949, 44713, 17000, 40226, 1214, 2024, 67, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'basic'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');

-- 15. Banca Transilvania — score 80
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Banca Transilvania', 'Romania', 'RO', 'Cluj-Napoca', 46.7693, 23.5900, 'https://www.bancatransilvania.ro', 1993, 41614, 4600, 33734, 19383, 10000, 534, 2024, 80, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 16. PKO Bank Polski — score 93
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('PKO Bank Polski', 'Poland', 'PL', 'Warsaw', 52.2237, 21.0186, 'https://www.pkobp.pl', 1919, 122807, 12100, 141287, 68772, 25600, 1193, 2024, 93, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 17. Nationwide Building Society — score 80
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Nationwide Building Society', 'United Kingdom', 'GB', 'Swindon', 51.5583, -1.7726, 'https://www.nationwide.co.uk', 1884, 318146, 16400, 242658, 249210, 17680, 605, 2024, 80, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'intermediate'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 18. de Volksbank — score 73
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('de Volksbank', 'Netherlands', 'NL', 'Utrecht', 52.0907, 5.1214, 'https://www.devolksbank.nl', 1817, 73691, 3500, 45600, 52000, 4357, 600, 2024, 73, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'basic'),
  ((SELECT id FROM b), 'devops_cloud', true, 'advanced');

-- 19. KBC Group — score 87
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, website, founded_year, total_assets, customer_count, deposit_volume, loan_volume, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('KBC Group', 'Belgium', 'BE', 'Brussels', 50.8622, 4.3490, 'https://www.kbc.com', 1998, 373048, 13000, 228700, 192100, 41000, 1106, 2024, 87, 'published', true)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'advanced'),
  ((SELECT id FROM b), 'ai_chatbot', true, 'advanced'),
  ((SELECT id FROM b), 'devops_cloud', true, 'intermediate');

-- 20. Spuerkeess (BCEE) — score 53
WITH b AS (
  INSERT INTO banks (name, country, country_code, city, latitude, longitude, parent_group, website, founded_year, total_assets, customer_count, employee_count, branch_count, reporting_year, digital_score, status, featured)
  VALUES ('Spuerkeess (BCEE)', 'Luxembourg', 'LU', 'Luxembourg City', 49.6116, 6.1300, 'State of Luxembourg', 'https://www.spuerkeess.lu', 1856, 57155, 300, 1929, 60, 2024, 53, 'published', false)
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level) VALUES
  ((SELECT id FROM b), 'mobile_banking', true, 'advanced'),
  ((SELECT id FROM b), 'open_banking', true, 'intermediate'),
  ((SELECT id FROM b), 'digital_onboarding', true, 'intermediate'),
  ((SELECT id FROM b), 'ai_chatbot', false, 'none'),
  ((SELECT id FROM b), 'devops_cloud', true, 'basic');
