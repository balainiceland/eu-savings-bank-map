-- Fix remaining broken evidence URLs across 38 banks
-- (Austria, Germany, Italy, Netherlands, Belgium, Czech Republic,
--  Slovakia, Romania, Slovenia, Luxembourg, Switzerland, UK)
-- Run in Supabase SQL Editor AFTER fix_all_evidence_urls.sql
-- Or alternatively just run upsert_all.sql which covers everything

-- ═══ AUSTRIA ═══

-- Erste Group (Sparkassen)
UPDATE digital_features SET evidence_url = 'https://www.sparkasse.at/erstebank/privatkunden/digitales-banking/apps/george-go-app'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Erste Group (Sparkassen)') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse.at/erstebank/privatkunden/konto-karten/onlinekonto'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Erste Group (Sparkassen)') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.erstegroup.com/en/news-media/press-releases/2023/10/05/erste-bank-launches-austrias-first-financial-ai'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Erste Group (Sparkassen)') AND category = 'ai_chatbot';

-- Raiffeisen Bank International
UPDATE digital_features SET evidence_url = 'https://www.rbinternational.com/en/raiffeisen/blog/technology/digital-banking-experience.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Bank International') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.rbinternational.com/en/raiffeisen/rbi-group/about-us/innovation/api-marketplace.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Bank International') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/de/privatkunden/konto/girokonto.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Bank International') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.rbinternational.com/en/raiffeisen/career/it-career.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Bank International') AND category = 'devops_cloud';

-- Raiffeisenlandesbank Oberosterreich
UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/ooe/de/online-banking/apps/mein-elba-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisenlandesbank Oberosterreich') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://developer.raiffeisen.at/en/home.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisenlandesbank Oberosterreich') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/ooe/de/privatkunden/konto/girokonto.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisenlandesbank Oberosterreich') AND category = 'digital_onboarding';

-- Raiffeisenlandesbank NO-Wien
UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/noew/rlb/de/privatkunden/online-banking/apps/mein-elba-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisenlandesbank NO-Wien') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://developer.raiffeisen.at/en/home.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisenlandesbank NO-Wien') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/noew/de/privatkunden/konto/girokonto.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisenlandesbank NO-Wien') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/noew/rlb/de/meine-bank/karriere/jobangebote.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisenlandesbank NO-Wien') AND category = 'devops_cloud';

-- Raiffeisen-Landesbank Steiermark
UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/stmk/rlb/de/online-banking.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen-Landesbank Steiermark') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://developer.raiffeisen.at/en/home.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen-Landesbank Steiermark') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/stmk/rlb/de/privatkunden/konto/girokonto.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen-Landesbank Steiermark') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.at/stmk/rlb/de/meine-bank/karriere.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen-Landesbank Steiermark') AND category = 'devops_cloud';

-- ═══ GERMANY ═══

-- Sparkassen-Finanzgruppe
UPDATE digital_features SET evidence_url = 'https://www.sparkasse.de/pk/produkte/konten-und-karten/finanzen-apps/s-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkassen-Finanzgruppe') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse.de/pk/ratgeber/finanzplanung/banking-tipps/psd-2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkassen-Finanzgruppe') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse.de/pk/ratgeber/finanzplanung/banking-tipps.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkassen-Finanzgruppe') AND category = 'ai_chatbot';

-- Sparkasse KoelnBonn
UPDATE digital_features SET evidence_url = 'https://www.sparkasse-koelnbonn.de/de/home/service/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse KoelnBonn') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse-koelnbonn.de/de/home/service/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse KoelnBonn') AND category = 'open_banking';

-- Hamburger Sparkasse (Haspa)
UPDATE digital_features SET evidence_url = 'https://www.haspa.de/de/home/privatkunden/online-services/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse (Haspa)') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.haspa.de/de/home/service/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse (Haspa)') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.haspa.de/de/home/services-und-hilfe/die-top-links/kontakt.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse (Haspa)') AND category = 'ai_chatbot';

UPDATE digital_features SET evidence_url = 'https://www.haspa.de/de/home/unternehmen-haspa/karriere.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse (Haspa)') AND category = 'devops_cloud';

-- DZ Bank Group
UPDATE digital_features SET evidence_url = 'https://www.vr.de/privatkunden/produkte/konten-karten/mobile-banking.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'DZ Bank Group') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.dzbank.com/disclosures'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'DZ Bank Group') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.vr.de/privatkunden/produkte/konten-karten/girokonto.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'DZ Bank Group') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.dzbank.com/content/dzbank/en/home/we-are-dz-bank/careers.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'DZ Bank Group') AND category = 'devops_cloud';

-- Berliner Volksbank
UPDATE digital_features SET evidence_url = 'https://www.berliner-volksbank.de/privatkunden/banking-apps/vr-banking-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Volksbank') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.berliner-volksbank.de/rechtliche-hinweise/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Volksbank') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.berliner-volksbank.de/privatkunden/girokonten-und-karten/private-girokonten/privat-girokonto.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Volksbank') AND category = 'digital_onboarding';

-- GLS Bank
UPDATE digital_features SET evidence_url = 'https://www.gls.de/konten-karten/banking/banking-app/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'GLS Bank') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.gls.de/gls-bank/service/fragen-antworten/allgemeines-finanz-glossar/was-ist-psd2/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'GLS Bank') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.gls.de/privatkunden/konto-karten/gls-girokonto/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'GLS Bank') AND category = 'digital_onboarding';

-- Sparkasse Hannover
UPDATE digital_features SET evidence_url = 'https://www.sparkasse-hannover.de/de/home/privatkunden/banking-und-bezahlen/banking-angebot/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse Hannover') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse-hannover.de/de/home/ihre-sparkasse/dialogcenter.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse Hannover') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse-hannover.de/de/home/kontakt.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse Hannover') AND category = 'ai_chatbot';

-- Kreissparkasse Koeln
UPDATE digital_features SET evidence_url = 'https://www.ksk-koeln.de/de/home/service/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kreissparkasse Koeln') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.ksk-koeln.de/de/home/service/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kreissparkasse Koeln') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.ksk-koeln.de/de/home/toolbar/kontakt.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kreissparkasse Koeln') AND category = 'ai_chatbot';

-- Frankfurter Sparkasse
UPDATE digital_features SET evidence_url = 'https://www.frankfurter-sparkasse.de/de/home/service/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Frankfurter Sparkasse') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.frankfurter-sparkasse.de/de/home/service/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Frankfurter Sparkasse') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.frankfurter-sparkasse.de/de/home/toolbar/kontakt.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Frankfurter Sparkasse') AND category = 'ai_chatbot';

-- Berliner Sparkasse
UPDATE digital_features SET evidence_url = 'https://www.berliner-sparkasse.de/de/home/service/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.berliner-sparkasse.de/de/home/service/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.berliner-sparkasse.de/de/home/toolbar/kontakt/whatsapp.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'ai_chatbot';

UPDATE digital_features SET evidence_url = 'https://www.berliner-sparkasse.de/de/home/ihre-sparkasse/dein-job.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Berliner Sparkasse') AND category = 'devops_cloud';

-- Stadtsparkasse Duesseldorf
UPDATE digital_features SET evidence_url = 'https://www.sskduesseldorf.de/de/home/service/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Stadtsparkasse Duesseldorf') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.sskduesseldorf.de/de/home/aktionen/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Stadtsparkasse Duesseldorf') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.sskduesseldorf.de/de/home/toolbar/kontakt.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Stadtsparkasse Duesseldorf') AND category = 'ai_chatbot';

-- Sparkasse Bremen
UPDATE digital_features SET evidence_url = 'https://www.sparkasse-bremen.de/de/home/service/sparkassen-app.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse Bremen') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse-bremen.de/de/home/service/psd2.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse Bremen') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.sparkasse-bremen.de/de/home/toolbar/kontakt.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparkasse Bremen') AND category = 'ai_chatbot';

-- ═══ ITALY ═══

-- Banca Popolare di Sondrio (merging into BPER Banca April 2026)
UPDATE digital_features SET evidence_url = 'https://www.popso.it/un-nuovo-inizio'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Popolare di Sondrio') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.popso.it/un-nuovo-inizio'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Popolare di Sondrio') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.popso.it/un-nuovo-inizio'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Popolare di Sondrio') AND category = 'devops_cloud';

-- BCC Iccrea Group (URL paths changed from /it-IT/Pagine/ to /Pagine/)
UPDATE digital_features SET evidence_url = 'https://www.gruppobcciccrea.it/Pagine/Default.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'BCC Iccrea Group') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.gruppobcciccrea.it/Pagine/Default.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'BCC Iccrea Group') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.gruppobcciccrea.it/Pagine/Default.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'BCC Iccrea Group') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.gruppobcciccrea.it/Pagine/Default.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'BCC Iccrea Group') AND category = 'devops_cloud';

-- Cassa Centrale Banca Group
UPDATE digital_features SET evidence_url = 'https://www.cassacentrale.it/en/products-and-services/our-offer/digital-banking-solutions'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Cassa Centrale Banca Group') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.cassacentrale.it/en/products-and-services/our-offer/digital-banking-solutions'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Cassa Centrale Banca Group') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.cassacentrale.it/en/products-and-services/our-offer/digital-banking-solutions'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Cassa Centrale Banca Group') AND category = 'digital_onboarding';

-- Banca Popolare di Bari (rebranded to BDM Banca)
UPDATE digital_features SET evidence_url = 'https://www.bdmbanca.it/privati/canali-digitali/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Popolare di Bari') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.bdmbanca.it/privati/conti/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Popolare di Bari') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.bdmbanca.it/istituzionale/lavora-con-noi/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Popolare di Bari') AND category = 'devops_cloud';

-- ═══ NETHERLANDS ═══

-- de Volksbank
UPDATE digital_features SET evidence_url = 'https://www.asnbank.nl/asn-app-en-asn-online-bankieren.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'de Volksbank') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://openbanking.devolksbank.nl/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'de Volksbank') AND category = 'open_banking';

-- Rabobank
UPDATE digital_features SET evidence_url = 'https://www.rabobank.nl/particulieren/online-bankieren'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Rabobank') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.rabobank.nl/particulieren/klant-worden/online-betaalrekening-openen'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Rabobank') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.rabobank.nl/particulieren/contact/chatbot'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Rabobank') AND category = 'ai_chatbot';

UPDATE digital_features SET evidence_url = 'https://www.rabobank.nl/en/about-us/vacatures'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Rabobank') AND category = 'devops_cloud';

-- de Volksbank (SNS)
UPDATE digital_features SET evidence_url = 'https://openbanking.devolksbank.nl/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'de Volksbank (SNS)') AND category = 'open_banking';

-- Triodos Bank
UPDATE digital_features SET evidence_url = 'https://www.triodos.nl/mobiel-bankieren'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Triodos Bank') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.triodos.nl/betalen'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Triodos Bank') AND category = 'digital_onboarding';

-- ═══ BELGIUM ═══

-- KBC Brussels
UPDATE digital_features SET evidence_url = 'https://www.kbcbrussels.be/retail/en/products/payments/self-banking/on-your-smartphone/mobile-banking.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'KBC Brussels') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://developer.kbc.be/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'KBC Brussels') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.kbcbrussels.be/retail/en/products/payments/current-accounts/open-plus-account-for-expats.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'KBC Brussels') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://newsroom.kbc.com/en'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'KBC Brussels') AND category = 'devops_cloud';

-- Belfius Bank
UPDATE digital_features SET evidence_url = 'https://www.belfius.be/about-us/en/who-we-are/what-we-do/mobile'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius Bank') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://developer.belfius.be/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius Bank') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.belfius.be/retail/nl/producten/betalen/zichtrekeningen/index.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius Bank') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.belfius.be/retail/nl/contact/chatbot/index.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius Bank') AND category = 'ai_chatbot';

UPDATE digital_features SET evidence_url = 'https://www.belfius.be/about-us/en/working-at-belfius'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Belfius Bank') AND category = 'devops_cloud';

-- ═══ CZECH REPUBLIC ═══

-- Ceska sporitelna
UPDATE digital_features SET evidence_url = 'https://www.csas.cz/cs/internetove-bankovnictvi/george'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ceska sporitelna') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://developers.csas.cz/?lang=en'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ceska sporitelna') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.csas.cz/cs/osobni-finance/ucty-karty/ucet-plus'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ceska sporitelna') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.databricks.com/blog/ceska-erste-genai'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ceska sporitelna') AND category = 'ai_chatbot';

UPDATE digital_features SET evidence_url = 'https://www.microsoft.com/en/customers/story/1442614428349876804-csas-banking-capital-markets-azure-en-czech'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ceska sporitelna') AND category = 'devops_cloud';

-- ═══ SLOVAKIA ═══

-- Slovenska sporitelna
UPDATE digital_features SET evidence_url = 'https://www.slsp.sk/sk/george'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Slovenska sporitelna') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.slsp.sk/en/business/online-banking/psd2-api-banking'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Slovenska sporitelna') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.slsp.sk/en/personal/faq/how-to-open-an-account'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Slovenska sporitelna') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.slsp.sk/sk/ludia/vesna'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Slovenska sporitelna') AND category = 'ai_chatbot';

-- ═══ ROMANIA ═══

-- Banca Transilvania
UPDATE digital_features SET evidence_url = 'https://en.bancatransilvania.ro/wallet-bt-pay/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Transilvania') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://en.bancatransilvania.ro/developer-support'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Transilvania') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://en.bancatransilvania.ro/accounts-and-operations/conturi'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banca Transilvania') AND category = 'digital_onboarding';

-- CEC Bank
UPDATE digital_features SET evidence_url = 'https://www.cec.ro/mobile-banking'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'CEC Bank') AND category = 'mobile_banking';

-- ═══ SLOVENIA ═══

-- Nova Ljubljanska Banka (NLB)
UPDATE digital_features SET evidence_url = 'https://www.nlb.si/en/osebno/digitalne-storitve/nlb-klik'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nova Ljubljanska Banka (NLB)') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.nlb.si/en/osebno/accounts-and-packages'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nova Ljubljanska Banka (NLB)') AND category = 'digital_onboarding';

-- ═══ LUXEMBOURG ═══

-- Spuerkeess
UPDATE digital_features SET evidence_url = 'https://www.spuerkeess.lu/en/mobile/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banque et Caisse d''Epargne de l''Etat (Spuerkeess)') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.spuerkeess.lu/en/blog/experts-corner/open-banking-revolut-and-n26-enter-s-net/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banque et Caisse d''Epargne de l''Etat (Spuerkeess)') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.spuerkeess.lu/en/private-customers/tools/application-to-set-up-a-business-relationship/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banque et Caisse d''Epargne de l''Etat (Spuerkeess)') AND category = 'digital_onboarding';

-- Banque Raiffeisen
UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.lu/en/private/daily-banking/online-services/online-banking-r-net'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banque Raiffeisen') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.lu/en/open-account'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banque Raiffeisen') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.raiffeisen.lu/en/banque/career'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banque Raiffeisen') AND category = 'devops_cloud';

-- ═══ SWITZERLAND ═══

-- Raiffeisen Switzerland
UPDATE digital_features SET evidence_url = 'https://ebanking.raiffeisen.ch/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Switzerland') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://jobs.raiffeisen.ch/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Raiffeisen Switzerland') AND category = 'devops_cloud';

-- ═══ UK (additional building societies) ═══

-- Skipton Building Society
UPDATE digital_features SET evidence_url = 'https://www.skipton.co.uk/help-and-support/our-app-and-skipton-online'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Skipton Building Society') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://careers.skipton.co.uk/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Skipton Building Society') AND category = 'devops_cloud';

-- Leeds Building Society
UPDATE digital_features SET evidence_url = 'https://www.leedsbuildingsociety.co.uk/online-services/registering-for-online-services/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Leeds Building Society') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://www.leedsbuildingsociety.co.uk/savings/online-savings-accounts/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Leeds Building Society') AND category = 'digital_onboarding';

UPDATE digital_features SET evidence_url = 'https://www.leedsbuildingsocietyjobs.co.uk/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Leeds Building Society') AND category = 'devops_cloud';

-- Nationwide Building Society
UPDATE digital_features SET evidence_url = 'https://www.nationwide.co.uk/ways-to-bank/banking-app/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nationwide Building Society') AND category = 'mobile_banking';

UPDATE digital_features SET evidence_url = 'https://developer.nationwide.co.uk/open-banking'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nationwide Building Society') AND category = 'open_banking';

UPDATE digital_features SET evidence_url = 'https://www.nationwide.co.uk/contact-us/how-arti-can-help-you'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nationwide Building Society') AND category = 'ai_chatbot';
