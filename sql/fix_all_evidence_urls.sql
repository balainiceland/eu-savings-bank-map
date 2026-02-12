-- Fix all broken evidence URLs across 27 banks
-- Run in Supabase SQL Editor
-- Generated from scripts/fix_all_evidence_urls.mjs FIXES mapping

-- === UK Building Societies ===

-- Principality Building Society
UPDATE digital_features
SET evidence_url = 'https://www.principality.co.uk/home/your-account'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Principality Building Society')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.principality.co.uk/home/open-banking-policy'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Principality Building Society')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.principality.co.uk/home/savings/savings-accounts/online-easy-access'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Principality Building Society')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.principality.co.uk/home/about-us/working-for-principality'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Principality Building Society')
  AND category = 'devops_cloud';

-- === Malta ===

-- Bank of Valletta
UPDATE digital_features
SET evidence_url = 'https://www.bov.com/mobile-banking-0'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Bank of Valletta')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://openbanking.bov.com/docs/berlingroup/bov_mt/ais'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Bank of Valletta')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://join.bov.com/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Bank of Valletta')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.bov.com/help-support'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Bank of Valletta')
  AND category = 'ai_chatbot';

-- === Nordic - SpareBank 1 ===

-- SpareBank 1 Alliance
UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/bank/privat/daglig-bruk/mobilbank.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 Alliance')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/bank/privat/daglig-bruk/mobilbank.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 Alliance')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://sparebank1.dev/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 Alliance')
  AND category = 'devops_cloud';

-- SpareBank 1 SR-Bank
UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/sor-norge/privat/daglig-bruk/mobil-og-nettbank.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/sor-norge/privat/kundeservice/bestill/bli-kunde.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/sor-norge/privat/kundeservice.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://sparebank1.dev/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SR-Bank')
  AND category = 'devops_cloud';

-- SpareBank 1 SMN
UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/smn/privat/daglig-bruk/mobil-og-nettbank.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/smn/privat/kundeservice/bestill/bli-kunde.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/smn/privat/kundeservice/kontakt.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://sparebank1.dev/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 SMN')
  AND category = 'devops_cloud';

-- SpareBank 1 Nord-Norge
UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/nord-norge/privat/daglig-bruk/mobil-og-nettbank.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 Nord-Norge')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/nord-norge/privat/kundeservice/bestill/bli-kunde.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 Nord-Norge')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.sparebank1.no/nb/nord-norge/privat/kundeservice.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 Nord-Norge')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://sparebank1.dev/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'SpareBank 1 Nord-Norge')
  AND category = 'devops_cloud';

-- === Nordic - Sparebanken ===

-- Sparebanken Vest
UPDATE digital_features
SET evidence_url = 'https://www.spv.no/dagligbank/nett-og-mobilbank'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparebanken Vest')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.spv.no/kundeservice/psd2'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparebanken Vest')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.spv.no/bli-kunde'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparebanken Vest')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.spv.no/om-oss/jobb'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparebanken Vest')
  AND category = 'devops_cloud';

-- Sparebanken Sor
UPDATE digital_features
SET evidence_url = 'https://www.sor.no/kort-og-betaling/mobil-og-nettbank/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparebanken Sor')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.sor.no/felles/info/open-banking/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparebanken Sor')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.sor.no/felles/karriere/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Sparebanken Sor')
  AND category = 'devops_cloud';

-- === Nordic - Swedbank ===

-- Swedbank and Savings Banks
UPDATE digital_features
SET evidence_url = 'https://www.swedbank.se/privat/digitala-tjanster/vara-appar.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Swedbank and Savings Banks')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.swedbank.se/privat/kundservice-privat.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Swedbank and Savings Banks')
  AND category = 'ai_chatbot';

-- === Nordic - Nykredit ===

-- Nykredit
UPDATE digital_features
SET evidence_url = 'https://www.nykredit.dk/dit-liv/daglig-okonomi/mitnykredit-netbank/mitnykredit-pa-mobil-og-tablet/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nykredit')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.nykredit.dk/personoplysninger-og-cookies/payment-service-directive-ii-psd2/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nykredit')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.nykredit.dk/dit-liv/nykredit-bank/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nykredit')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.nykredit.com/en-gb/career/nykredit-dci/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Nykredit')
  AND category = 'devops_cloud';

-- === Nordic - Finland ===

-- Savings Banks Group (Saastopankki)
UPDATE digital_features
SET evidence_url = 'https://www.saastopankki.fi/fi-fi/asiakaspalvelu/yhteydenottokanavat/saastopankki-mobiili'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Savings Banks Group (Saastopankki)')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.saastopankki.fi/fi-fi/asiakaspalvelu/verkkopalvelut/psd2-ja-open-banking'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Savings Banks Group (Saastopankki)')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.saastopankki.fi/en/support/become-our-customer'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Savings Banks Group (Saastopankki)')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.saastopankki.fi/fi-fi/asiakaspalvelu/yhteydenottokanavat/chat'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Savings Banks Group (Saastopankki)')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://www.saastopankki.fi/en/savingsbanksgroup'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Savings Banks Group (Saastopankki)')
  AND category = 'devops_cloud';

-- OP Financial Group
UPDATE digital_features
SET evidence_url = 'https://www.op.fi/en/private-customers/digital-services/op-mobile'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'OP Financial Group')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.op.fi/en/private-customers/daily-banking/payment/psd2'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'OP Financial Group')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.op.fi/en/private-customers/customerinfo/become-op-customer'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'OP Financial Group')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.op.fi/en/about-op-pohjola/career/career-opportunities/development-and-technologies/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'OP Financial Group')
  AND category = 'devops_cloud';

-- Aktia Bank
UPDATE digital_features
SET evidence_url = 'https://www.aktia.fi/fi/paivittaiset-raha-asiat/mobiilipankki'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Aktia Bank')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.aktia.fi/fi/open-banking'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Aktia Bank')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.aktia.fi/fi/tule-asiakkaaksi'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Aktia Bank')
  AND category = 'digital_onboarding';

-- === Nordic - Bank Norwegian ===

-- Bank Norwegian (Nordax Group)
UPDATE digital_features
SET evidence_url = 'https://careers.noba.bank/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Bank Norwegian (Nordax Group)')
  AND category = 'devops_cloud';

-- === Spain ===

-- CaixaBank
UPDATE digital_features
SET evidence_url = 'https://www.caixabank.es/particular/tarjetas/google-pay_en.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'CaixaBank')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://apistore.caixabank.com/home_en.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'CaixaBank')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.caixabank.es/particular/cuentas/cuenta-sin-comisiones.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'CaixaBank')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.caixabank.com/comunicacion/noticia/caixabank-crea-un-asistente-virtual-basado-en-inteligencia-artificial-para-dar-apoyo-a-todos-los-empleados-de-su-red_es.html?id=40809'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'CaixaBank')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://www.caixabanktech.com/en/join-us/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'CaixaBank')
  AND category = 'devops_cloud';

-- Ibercaja Banco
UPDATE digital_features
SET evidence_url = 'https://www.ibercaja.es/particulares/banca-digital/servicios/app-ibercaja/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ibercaja Banco')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.ibercaja.es/particulares/corner-del-especialista/informacion-psd2/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ibercaja Banco')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.ibercaja.es/particulares/cuentas-tarjetas/cuentas-ahorro/cuenta-com/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ibercaja Banco')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://empleo.ibercaja.es/ofertas-de-empleo/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Ibercaja Banco')
  AND category = 'devops_cloud';

-- Kutxabank
UPDATE digital_features
SET evidence_url = 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/productos/banca-omnicanal/banca-movil-/pys'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/sobre-kutxabank/psd2/generico'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/cuentas-y-planes-0/cuenta-corriente/pys'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/servicio-atencion-al-cliente-/generico'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/sobre-kutxa/quienes-somos-3'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Kutxabank')
  AND category = 'devops_cloud';

-- Unicaja Banco
UPDATE digital_features
SET evidence_url = 'https://www.unicajabanco.es/en/banca-digital'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Unicaja Banco')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.unicajabanco.es/es/faqs/banca-digital/psd2'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Unicaja Banco')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.unicajabanco.es/en/cuenta-online'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Unicaja Banco')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.unicajabanco.es/en/atencion-al-cliente'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Unicaja Banco')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://joven.unicajabanco.es/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Unicaja Banco')
  AND category = 'devops_cloud';

-- ABANCA
UPDATE digital_features
SET evidence_url = 'https://www.abanca.com/en/banca-a-distancia/banca-movil/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'ABANCA')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.abanca.com/es/legal/servicios-pago/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'ABANCA')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.abanca.com/en/cuentas/cuenta-online/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'ABANCA')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://empleo.abanca.com/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'ABANCA')
  AND category = 'devops_cloud';

-- Cajamar Caja Rural
UPDATE digital_features
SET evidence_url = 'https://www.cajamar.es/en/particulares/productos-y-servicios/banca-a-distancia/banca-movil/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Cajamar Caja Rural')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.cajamar.es/en/comun/psd2/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Cajamar Caja Rural')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.cajamar.es/en/particulares/productos-y-servicios/cuentas/pack-wefferent/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Cajamar Caja Rural')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.cajamar.es/es/comun/informacion-corporativa/empleo/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Cajamar Caja Rural')
  AND category = 'devops_cloud';

-- Caja Rural de Navarra
UPDATE digital_features
SET evidence_url = 'https://www.cajaruraldenavarra.com/en/node/4431'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Caja Rural de Navarra')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.cajaruraldenavarra.com/es/informacion-psd2'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Caja Rural de Navarra')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.cajaruraldenavarra.com/es/recomienda-talento'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Caja Rural de Navarra')
  AND category = 'devops_cloud';

-- Laboral Kutxa
UPDATE digital_features
SET evidence_url = 'https://www.laboralkutxa.com/es/personas/servicios/banca-online/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Laboral Kutxa')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.laboralkutxa.com/es/informacion-legal/informacion-apis/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Laboral Kutxa')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.laboralkutxa.com/es/particulares/ahorro/cuentas-y-depositos'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Laboral Kutxa')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.laboralkutxa.com/es/personas/trabaja-con-nosotros/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Laboral Kutxa')
  AND category = 'devops_cloud';

-- === Portugal ===

-- Caixa Geral de Depositos
UPDATE digital_features
SET evidence_url = 'https://www.cgd.pt/Particulares/Contas/Caixadirecta/Pages/refresh-app-caixadirecta.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Caixa Geral de Depositos')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.cgd.pt/Institucional/Noticias/Pages/Open-Banking-SIBS-API-Market.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Caixa Geral de Depositos')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.cgd.pt/Particulares/Contas/Contas-a-Ordem/Pages/Conta-Caixa-S.aspx'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Caixa Geral de Depositos')
  AND category = 'digital_onboarding';

-- Banco Montepio
UPDATE digital_features
SET evidence_url = 'https://www.bancomontepio.pt/en/individuals/everyday-banking/digital-banking'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banco Montepio')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.bancomontepio.pt/en/open-banking-apis'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banco Montepio')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.bancomontepio.pt/en/individuals/everyday-banking/open-account-online'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Banco Montepio')
  AND category = 'digital_onboarding';

-- === France ===

-- Groupe BPCE (Caisse d'Epargne network)
UPDATE digital_features
SET evidence_url = 'https://www.caisse-epargne.fr/banque-a-distance/applications-smartphone/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Groupe BPCE (Caisse d''Epargne network)')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.caisse-epargne.fr/comptes-cartes/ouvrir-compte/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Groupe BPCE (Caisse d''Epargne network)')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.groupebpce.com/en/all-the-latest-news/'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Groupe BPCE (Caisse d''Epargne network)')
  AND category = 'devops_cloud';

-- Credit Mutuel Alliance Federale
UPDATE digital_features
SET evidence_url = 'https://www.creditmutuel.fr/fr/particuliers/comptes/application-mobile-credit-mutuel.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Mutuel Alliance Federale')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.creditmutuel.fr/oauth2/en/devportal/open-banking-api.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Mutuel Alliance Federale')
  AND category = 'open_banking';

UPDATE digital_features
SET evidence_url = 'https://www.creditmutuel.fr/fr/particuliers/comptes/ouvrir-un-compte.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Mutuel Alliance Federale')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.creditmutuel.fr/fr/particuliers/mobile/obtenez-des-reponses-a-vos-questions.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Mutuel Alliance Federale')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://www.creditmutuelalliancefederale.fr/en/who-are-we/our-business-lines-and-subsidiaries.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Mutuel Alliance Federale')
  AND category = 'devops_cloud';

-- Credit Agricole Group
UPDATE digital_features
SET evidence_url = 'https://www.credit-agricole.fr/particulier/applications/ma-banque.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Agricole Group')
  AND category = 'mobile_banking';

UPDATE digital_features
SET evidence_url = 'https://www.credit-agricole.fr/particulier/ouvrir-un-compte.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Agricole Group')
  AND category = 'digital_onboarding';

UPDATE digital_features
SET evidence_url = 'https://www.credit-agricole.fr/particulier/faq.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Agricole Group')
  AND category = 'ai_chatbot';

UPDATE digital_features
SET evidence_url = 'https://www.credit-agricole.com/en/finance/financial-publications'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Credit Agricole Group')
  AND category = 'devops_cloud';
