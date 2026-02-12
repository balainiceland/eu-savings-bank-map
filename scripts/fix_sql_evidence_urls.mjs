// Apply the same URL fixes to sql/seed_all.sql and generate migration SQL
import { readFileSync, writeFileSync } from 'fs';

// Same replacement map from fix_evidence_urls.mjs
const replacements = {
  // === AUSTRIA ===
  'https://www.sparkasse.at/erstebank/george-mobile': 'https://www.sparkasse.at/sgruppe/privatkunden/digitales-banking/apps/george-go-app',
  'https://www.sparkasse.at/erstebank/privatkunden/konto-karten/konto/onlinekonto': 'https://www.sparkasse.at/erstebank/privatkunden/konto-karten/onlinekonto',
  'https://www.erstegroup.com/en/news-media/press-releases/2024/3/14/financial-health-prototype': 'https://www.erstegroup.com/en/news-media/press-releases/2023/10/05/erste-bank-launches-austrias-first-financial-ai',
  'https://www.erstedigital.com/en': 'https://www.erstegroup.com/en/news-media/press-releases/2021/07/01/erste-digital',
  'https://www.rbinternational.com/en/retail-banking/digital-banking.html': 'https://www.rbinternational.com/en/raipay.html',
  'https://www.rbinternational.com/en/investors/regulatory-disclosures/psd2.html': 'https://api.rbinternational.com/pages/getting-started/what-is-psd2-and-open-apis',
  'https://www.raiffeisen.at/rch/de/privatkunden/konten.html': 'https://www.raiffeisen.at/de/privatkunden/konto.html',
  'https://www.rbinternational.com/en/careers/it-digital.html': 'https://www.rbinternational.com/en/raiffeisen/career.html',
  'https://www.raiffeisen.at/stmk/de/privatkunden/digitales-banking.html': 'https://www.raiffeisen.at/stmk/de/privatkunden/konto.html',
  'https://www.raiffeisen.at/stmk/de/rechtliches/psd2.html': 'https://developer.raiffeisen.at/en/home.html',
  'https://www.raiffeisen.at/stmk/de/privatkunden/konto-karten/kontoeroeffnung.html': 'https://www.raiffeisen.at/stmk/de/privatkunden/konto.html',
  'https://www.rlbstmk.at/de/karriere.html': 'https://www.raiffeisen.at/stmk/rlb/de/meine-bank/karriere.html',
  'https://www.raiffeisen.at/noew/de/privatkunden/digitales-banking.html': 'https://www.raiffeisen.at/noew/de/privatkunden/konto.html',
  'https://www.raiffeisen.at/noew/de/rechtliches/psd2.html': 'https://developer.raiffeisen.at/en/home.html',
  'https://www.raiffeisen.at/noew/de/privatkunden/konto-karten/kontoeroeffnung.html': 'https://www.raiffeisen.at/noew/de/privatkunden/konto.html',
  'https://www.raiffeisenbank.at/de/karriere.html': 'https://www.raiffeisenbank.jobs/de/karriere-bei-raiffeisen/raiffeisen-als-arbeitgeber.html',
  'https://www.raiffeisen.at/ooe/de/privatkunden/digitales-banking.html': 'https://www.raiffeisen.at/ooe/de/privatkunden/konto.html',
  'https://www.raiffeisen.at/ooe/de/rechtliches/psd2.html': 'https://developer.raiffeisen.at/en/home.html',
  'https://www.raiffeisen.at/ooe/de/privatkunden/konto-karten/kontoeroeffnung.html': 'https://www.raiffeisen.at/ooe/de/privatkunden/konto.html',
  'https://www.rlbooe.at/karriere': 'https://www.raiffeisen.at/ooe/rlb/de/karriere-bei-raiffeisen.html',
  // === BELGIUM ===
  'https://www.belfius.be/retail/en/products/payments/mobile-app/index.aspx': 'https://www.belfius.be/about-us/en/who-we-are/what-we-do/mobile',
  'https://www.belfius.be/corporate/en/Products-and-services/payments/open-banking/index.aspx': 'https://developer.belfius.be/devportal/en/',
  'https://www.belfius.be/retail/en/products/current-accounts/index.aspx': 'https://www.belfius.be/retail/nl/becoming-a-customer/index.aspx',
  'https://www.belfius.be/retail/en/contact/chat/index.aspx': 'https://www.belfius.be/retail/nl/zelf-bankieren/campagnes/bbot/index.aspx',
  'https://www.belfius.be/about-us/en/jobs/index.aspx': 'https://jobs.belfius.be/go/Talents-Tech/8939701/',
  'https://www.kbcbrussels.be/retail/en/products/payments/mobile/kbc-mobile.html': 'https://www.kbcbrussels.be/retail/en/products/payments/self-banking/on-your-smartphone/mobile.html',
  'https://developer.kbc.com': 'https://developer.kbc.be/',
  'https://www.kbcbrussels.be/retail/en/products/payments/current-accounts.html': 'https://www.kbcbrussels.be/retail/en/products/payments/current-accounts/open-current-account.html',
  'https://www.kbcbrussels.be/retail/en/processes/digital-assistant-kate.html': 'https://www.kbcbrussels.be/retail/en/campaign/save-time-by-asking-kate.html',
  'https://www.kbc.com/en/innovation.html': 'https://newsroom.kbc.com/kbc-shifts-digital-transformation-and-customer-experience-up-a-gear-with-differently-the-next-level',
  // === CZECH REPUBLIC ===
  'https://www.csas.cz/cs/obcane/digitalni-sluzby-a-aplikace/aplikace-george': 'https://www.csas.cz/cs/internetove-bankovnictvi/george',
  'https://www.csas.cz/cs/firmy/produkty-a-sluzby/transakcni-bankovnictvi/prime-bankovnictvi/open-banking': 'https://developers.csas.cz/?lang=en',
  'https://www.csas.cz/cs/obcane/ucty-a-karty/osobni-ucet-plus': 'https://www.csas.cz/en/personal-finance/accounts-and-cards/basic-account',
  'https://www.csas.cz/cs/o-nas/pro-media/tiskove-zpravy/2023/12/19/ceska-sporitelna-spustila-ai-chatbot': 'https://www.csas.cz/cs/internetove-bankovnictvi/george/hey-george',
  'https://customers.microsoft.com/en-gb/story/1483761230195727099-ceska-sporitelna-azure-en-czech-republic': 'https://www.microsoft.com/en/customers/story/1442614428349876804-csas-banking-capital-markets-azure-en-czech',
  // === DENMARK ===
  'https://www.nykredit.dk/dit-liv/digital-bank/mobile-banking/': 'https://www.nykredit.dk/dit-liv/daglig-okonomi/mitnykredit-netbank/mitnykredit-pa-mobil-og-tablet/',
  'https://www.nykredit.com/open-banking/': 'https://www.nykredit.dk/personoplysninger-og-cookies/payment-service-directive-ii-psd2/',
  'https://www.nykredit.com/careers/it-tech/': 'https://www.nykredit.com/en-gb/career/nykredit-dci/',
  // === FINLAND ===
  'https://www.aktia.fi/en/daily-banking/mobile-bank': 'https://www.aktia.fi/fi/paivittaiset-raha-asiat/mobiilipankki',
  'https://www.aktia.fi/en/open-banking': 'https://developer.aktia.fi/',
  'https://www.aktia.fi/en/become-customer': 'https://www.aktia.fi/fi/asiakaspalvelu',
  'https://www.op.fi/private-customers/daily-banking/op-mobile': 'https://www.op.fi/en/private-customers/digital-services/op-mobile',
  'https://www.op.fi/corporate-customers/open-banking': 'https://www.op.fi/en/corporate-customers/payment-transfers-and-cash-management/corporate-banking-api',
  'https://www.op.fi/private-customers/daily-banking/accounts/open-account': 'https://www.op.fi/en/private-customers/become-op-customer-digitally',
  'https://www.op.fi/about-op/op-as-employer/technology': 'https://www.op.fi/en/about-op-pohjola/career/career-opportunities/development-and-technologies/',
  'https://www.saastopankki.fi/fi-fi/tietoa-saastopankista/saastopankkiryhma/saastopankki-app': 'https://www.saastopankki.fi/en',
  'https://www.saastopankki.fi/en-gb/customer-service/open-banking': 'https://www.saastopankki.fi/en',
  'https://www.saastopankki.fi/en-gb/customer-service/become-a-customer': 'https://www.saastopankki.fi/en',
  'https://www.saastopankki.fi/fi-fi/asiakaspalvelu/chatbot': '',
  'https://www.saastopankki.fi/en-gb/about-us': 'https://www.saastopankki.fi/en',
  // === FRANCE ===
  'https://www.credit-agricole.fr/particulier/applications-ma-banque.html': 'https://www.credit-agricole.fr/particulier.html',
  'https://www.credit-agricole.fr/particulier/compte/ouvrir-un-compte.html': 'https://www.credit-agricole.fr/particulier/compte.html',
  'https://www.credit-agricole.fr/particulier/conseils/chatbot.html': '',
  'https://www.credit-agricole.com/en/finance/finance/financial-publications': 'https://www.credit-agricole.com/en/finance/financial-publications',
  'https://www.creditmutuel.fr/fr/particuliers/compte/mobile.html': 'https://www.creditmutuel.fr/fr/particuliers/comptes/application-mobile-credit-mutuel.html',
  'https://www.creditmutuel.fr/fr/banques/open-banking.html': 'https://www.creditmutuel.fr/oauth2/en/devportal/open-banking-api.html',
  'https://www.creditmutuel.fr/fr/particuliers/comptes/ouvrir-compte.html': 'https://www.creditmutuel.fr/fr/particuliers/comptes/choisir-compte.html',
  'https://www.creditmutuel.fr/fr/particuliers/contacts/assistant-virtuel.html': 'https://www.creditmutuel.fr/cmne/fr/le-mag/assistant-virtuel.html',
  'https://www.caisse-epargne.fr/application-mobile/': 'https://www.caisse-epargne.fr/banque-a-distance/applications-smartphone/',
  'https://www.caisse-epargne.fr/comptes-et-cartes/ouvrir-un-compte/': 'https://www.caisse-epargne.fr/comptes-cartes/ouvrir-compte/',
  'https://www.groupebpce.com/en/newsroom/': 'https://www.groupebpce.com/en/all-the-latest-news/',
  // === GERMANY ===
  'https://www.berliner-sparkasse.de/de/home/service/s-app.html': 'https://www.berliner-sparkasse.de/de/home/service/sparkassen-app.html',
  'https://www.berliner-sparkasse.de/de/home/fi/psd2.html': 'https://www.berliner-sparkasse.de/de/home/service/psd2.html',
  'https://www.berliner-sparkasse.de/de/home/service/kontakt.html': 'https://www.berliner-sparkasse.de/de/home/toolbar/kontakt/whatsapp.html',
  'https://www.berliner-sparkasse.de/de/home/ihre-sparkasse/karriere.html': 'https://www.berliner-sparkasse.de/de/home/ihre-sparkasse/dein-job.html',
  'https://www.berliner-volksbank.de/privatkunden/girokonto-und-bezahlen/banking-app.html': 'https://www.berliner-volksbank.de/privatkunden/banking-apps/vr-banking-app.html',
  'https://www.berliner-volksbank.de/psd2.html': 'https://www.berliner-volksbank.de/rechtliche-hinweise/psd2.html',
  'https://www.berliner-volksbank.de/privatkunden/girokonto-und-kreditkarten/girokonto.html': 'https://www.berliner-volksbank.de/privatkunden/girokonto-karten/girokonto.html',
  'https://www.volksbanken-raiffeisenbanken.de/privatkunden/digitalbanking.html': 'https://corporates.dzbank.com/content/firmenkunden/en/homepage/dzbanking.html',
  'https://www.dzbank.com/content/dzbank/en/home/investor-relations/regulatory-disclosures.html': 'https://corporates.dzbank.com/content/firmenkunden/en/homepage/dzbanking/Third-party-interface.html',
  'https://www.volksbank.de/': 'https://www.dzbank.com/',
  'https://www.dzbank.com/content/dzbank/en/home/careers.html': 'https://www.dzbank.com/content/dzbank/en/home/we-are-dz-bank/careers/job-opportunities-worldwide.html',
  'https://www.frankfurter-sparkasse.de/de/home/service/s-app.html': 'https://www.frankfurter-sparkasse.de/de/home/service/sparkassen-app.html',
  'https://www.frankfurter-sparkasse.de/de/home/fi/psd2.html': 'https://www.frankfurter-sparkasse.de/de/home/aktionen/psd2.html',
  'https://www.frankfurter-sparkasse.de/de/home/service/kontakt.html': 'https://www.frankfurter-sparkasse.de/de/home/service/kundenservicecenter.html',
  'https://www.haspa.de/de/home/service/s-app.html': 'https://www.haspa.de/de/home/service/sparkassen-app.html',
  'https://www.haspa.de/de/home/fi/psd2.html': 'https://www.haspa.de/de/home/service/psd2.html',
  'https://www.haspa.de/de/home/service/kontakt.html': 'https://www.haspa.de/de/home/services-und-hilfe/die-top-links/live-chat.html',
  'https://www.haspa.de/de/home/ihre-haspa/karriere.html': 'https://www.haspa.de/de/home/unternehmen-haspa/karriere/jobs.html',
  'https://www.ksk-koeln.de/de/home/service/s-app.html': 'https://www.ksk-koeln.de/de/home/service/sparkassen-app.html',
  'https://www.ksk-koeln.de/de/home/fi/psd2.html': 'https://www.ksk-koeln.de/de/home/service/psd2.html',
  'https://www.ksk-koeln.de/de/home/service/kontakt.html': 'https://www.ksk-koeln.de/de/home/toolbar/kontakt.html',
  'https://www.ksk-koeln.de/de/home/ihre-sparkasse/karriere.html': 'https://www.ksk-koeln.de/de/home/ihre-sparkasse/karriere/stellenangebote.html',
  'https://www.sparkasse-bremen.de/de/home/service/s-app.html': 'https://www.sparkasse-bremen.de/de/home/service/sparkassen-app.html',
  'https://www.sparkasse-bremen.de/de/home/fi/psd2.html': 'https://www.sparkasse-bremen.de/de/home/service/psd2.html',
  'https://www.sparkasse-bremen.de/de/home/service/kontakt.html': 'https://www.sparkasse-bremen.de/de/home/toolbar/kontakt.html',
  'https://www.sparkasse-bremen.de/de/home/ihre-sparkasse/karriere.html': 'https://www.sparkasse-bremen.de/de/home/ihre-sparkasse/karriere.html',
  'https://www.sparkasse-hannover.de/de/home/service/s-app.html': 'https://www.sparkasse-hannover.de/de/home/service/sparkassen-app.html',
  'https://www.sparkasse-hannover.de/de/home/fi/psd2.html': 'https://www.sparkasse-hannover.de/de/home/service/psd2.html',
  'https://www.sparkasse-hannover.de/de/home/service/kontakt.html': 'https://www.sparkasse-hannover.de/de/home/toolbar/kontakt.html',
  'https://www.sparkasse-hannover.de/de/home/ihre-sparkasse/karriere.html': 'https://www.sparkasse-hannover.de/de/home/ihre-sparkasse/karriere.html',
  'https://www.sparkasse-koelnbonn.de/de/home/service/s-app.html': 'https://www.sparkasse-koelnbonn.de/de/home/service/sparkassen-app.html',
  'https://www.sparkasse-koelnbonn.de/de/home/fi/psd2.html': 'https://www.sparkasse-koelnbonn.de/de/home/service/psd2.html',
  'https://www.sparkasse-koelnbonn.de/de/home/service/kontakt.html': 'https://www.sparkasse-koelnbonn.de/de/home/toolbar/kontakt.html',
  'https://www.sparkasse-koelnbonn.de/de/home/ihre-sparkasse/karriere.html': 'https://www.sparkasse-koelnbonn.de/de/home/ihre-sparkasse/karriere.html',
  'https://www.sparkasse.de/pk/produkte/apps/s-app.html': 'https://www.sparkasse.de/pk/produkte/konten-und-karten/finanzen-apps/app-sparkasse.html',
  'https://www.sparkasse.de/pk/ratgeber/finanzplanung/psd2.html': 'https://www.sparkasse.de/pk/ratgeber/finanzplanung/banking-tipps/psd-2.html',
  'https://www.sparkasse.de/pk/ratgeber/onlinebanking/': 'https://www.sparkasse.de/ueber-uns/kuenstliche-intelligenz/sparkassegpt.html',
  'https://www.sskduesseldorf.de/de/home/service/s-app.html': 'https://www.sskduesseldorf.de/de/home/service/sparkassen-app.html',
  'https://www.sskduesseldorf.de/de/home/fi/psd2.html': 'https://www.sskduesseldorf.de/de/home/service/psd2.html',
  'https://www.sskduesseldorf.de/de/home/service/kontakt.html': 'https://www.sskduesseldorf.de/de/home/toolbar/kontakt.html',
  'https://www.sskduesseldorf.de/de/home/ihre-sparkasse/karriere.html': 'https://www.sskduesseldorf.de/de/home/ihre-sparkasse/karriere.html',
  // === HUNGARY ===
  'https://www.otpbank.hu/portal/en/online-services/mobilebank': 'https://www.otpbank.hu/portal/en/ibmb-en',
  'https://www.otpbank.hu/portal/en/PSD2': 'https://www.otpbank.hu/portal/en/psd2',
  'https://www.otpbank.hu/portal/en/Bank_Account/basic': 'https://www.otpbank.hu/portal/en/retail/account/forint-account-packages',
  'https://www.otpbank.hu/portal/en/Aboutus': 'https://www.otpbank.hu/portal/en/about-us',
  // === ITALY ===
  'https://www.bancadiasti.it/privati/canali-digitali': 'https://bancadiasti.it/servizi-digitali-new/',
  'https://www.bancadiasti.it/privati/conti': 'https://bancadiasti.it/conti-correnti-per-privati-e-famiglie/',
  'https://www.bancadiasti.it/chi-siamo/lavora-con-noi': 'https://bancadiasti.it/lavora-con-noi',
  'https://www.popolarebari.it/privati/canali-digitali/': 'https://www.popolarebari.it/content/bpb/it/home/prodotti/appmobile.home_piccoleimprese_commercio_servizi.html',
  'https://www.popolarebari.it/privati/conti/': 'https://www.popolarebari.it/content/bpb/it/home/prodotti/mi-.home.html',
  'https://www.popolarebari.it/istituzionale/lavora-con-noi/': 'https://www.popolarebari.it/',
  'https://www.popso.it/app': 'https://www.popso.it/servizi-digitali/app-scrigno-bps',
  'https://www.popso.it/apriconto': 'https://www.popso.it/prodotti/privati/servizi-digitali/servizi-digitali/appscrignobps',
  'https://www.popso.it/lavora-con-noi': 'https://www.popso.it/home',
  'https://www.gruppobcciccrea.it/it-IT/Pagine/default.aspx': 'https://www.gruppobcciccrea.it/',
  'https://www.gruppobcciccrea.it/it-IT/Pagine/PSD2.aspx': 'https://www.gruppobcciccrea.it/',
  'https://www.gruppobcciccrea.it/it-IT/Pagine/conti-correnti.aspx': 'https://generazionebcc.gruppobcciccrea.it/',
  'https://www.gruppobcciccrea.it/it-IT/Pagine/lavora-con-noi.aspx': 'https://www.gruppobcciccrea.it/',
  'https://www.cassacentrale.it/it/canali-digitali': 'https://www.cassacentrale.it/en/products/digital-banking-solutions/inbank',
  'https://www.cassacentrale.it/it/psd2-open-banking': 'https://www.cassacentrale.it/en/products-and-services/products-banks/digital-banking-solutions',
  'https://www.cassacentrale.it/it/privati/conti-correnti': 'https://www.cassacentrale.it/en/products/digital-banking-solutions/inbank',
  // === LUXEMBOURG ===
  'https://www.spuerkeess.lu/en/private-customers/day-to-day-banking/s-net-mobile/': 'https://www.spuerkeess.lu/en/mobile/',
  'https://www.spuerkeess.lu/en/private-customers/day-to-day-banking/multibanking/': 'https://www.spuerkeess.lu/en/snet/',
  'https://www.spuerkeess.lu/en/private-customers/become-customer-online/': 'https://www.spuerkeess.lu/en/private-customers/tools/application-to-set-up-a-business-relationship/',
  'https://www.raiffeisen.lu/en/private/customers/digital-banking': 'https://www.raiffeisen.lu/en/private/daily-banking/mobile-payments/online-banking-r-net',
  'https://www.raiffeisen.lu/en/private/customers/accounts': 'https://www.raiffeisen.lu/en/private/daily-banking/new-client/open-banking-account',
  'https://www.raiffeisen.lu/en/bank/careers': 'https://www.raiffeisen.lu/en/welcome-raiffeisen',
  // === MALTA ===
  'https://www.bov.com/content/bov-mobile-app': 'https://www.bov.com/mobile-banking-0',
  'https://www.bov.com/open-banking': 'https://www.bov.com/Content/payment-services-directive',
  'https://www.bov.com/content/become-a-customer-online': 'https://join.bov.com/',
  'https://www.bov.com/help-and-support': 'https://www.bov.com/content/get-in-touch-with-us',
  // === NETHERLANDS ===
  'https://www.asnbank.nl/service/veilig-bankieren/asn-bank-app.html': 'https://www.asnbank.nl/online-en-mobiel-bankieren/mobiel-bankieren/aan-de-slag-met-de-asn-app.html',
  'https://www.devolksbank.nl/over-de-volksbank/wat-we-doen/toezicht-en-wetgeving/psd2.html': 'https://openbanking.devolksbank.nl/',
  'https://www.regiobank.nl/particulier/bankrekening/openen.html': 'https://www.regiobank.nl/betalen/betaalrekening-openen.html',
  'https://www.devolksbank.nl/werken-bij.html': 'https://werkenbij.devolksbank.nl/nl/nl/search-results',
  'https://www.rabobank.nl/particulieren/service/mobiel-bankieren': 'https://www.rabobank.nl/en/personal/online-banking/app',
  'https://www.rabobank.nl/particulieren/betalen/bankrekening-openen': 'https://www.rabobank.nl/en/personal/payments/banking-account',
  'https://www.rabobank.nl/particulieren/klantenservice/chat': 'https://www.rabobank.nl/particulieren/contact/chatbot',
  'https://www.rabobank.jobs/en/tech-and-it': 'https://rabobank.jobs/en/expertise/it/',
  'https://www.triodos.nl/service-en-contact/bankieren-met-de-app': 'https://www.triodos.nl/service/particulieren/bankieren/mobiel-bankieren',
  'https://www.triodos.com/en/open-banking': 'https://developer.triodos.com/',
  'https://www.triodos.nl/particulier/betalen/betaalrekening-openen': 'https://www.triodos.nl/veelgestelde-vragen/hoe-open-ik-als-nieuwe-klant-een-rekening-bij-triodos-bank?id=9f7a3f512b59',
  // === NORWAY ===
  'https://www.nordaxgroup.com/en/careers/': 'https://careers.noba.bank/',
  'https://www.sparebank1.no/en/bank/private/customer-programmes/sb1u/our-products/sparebank1-app.html': 'https://www.sparebank1.no/nb/bank/privat/daglig-bruk/mobilbank.html',
  'https://www.sparebank1.no/nb/smn/om-oss/nyheter/den-digitale-assistenten-har-flyttet-inn.html': 'https://www.sparebank1.no/nb/sorost/privat/info/sammie-chatbot.html',
  'https://www.sparebank1.no/nb/nord-norge/privat/daglig-bruk/nett-og-mobilbank.html': 'https://www.sparebank1.no/nb/nord-norge/privat/daglig-bruk/mobilbank.html',
  'https://www.sparebank1.no/nb/nord-norge/privat/konto-og-kort/bli-kunde.html': 'https://www.sparebank1.no/nb/nord-norge/privat/kundeservice/bestill/bli-kunde.html',
  'https://www.sparebank1.no/nb/smn/privat/daglig-bruk/nett-og-mobilbank.html': 'https://www.sparebank1.no/nb/smn/privat/daglig-bruk/mobilbank.html',
  'https://www.sparebank1.no/nb/smn/privat/konto-og-kort/bli-kunde.html': 'https://www.sparebank1.no/nb/smn/privat/kundeservice/bestill/bli-kunde.html',
  'https://www.sr-bank.no/nb/privat/daglig-bruk/nett-og-mobilbank.html': 'https://www.sparebank1.no/nb/sr-bank/privat/daglig-bruk/mobil-og-nettbank.html',
  'https://www.sr-bank.no/nb/privat/konto-og-kort/bli-kunde.html': 'https://www.sparebank1.no/nb/sr-bank/privat/kundeservice/bestill/bli-kunde.html',
  'https://www.sr-bank.no/nb/privat/kundeservice': 'https://www.sparebank1.no/nb/sr-bank/privat/kundeservice.html',
  'https://www.sor.no/privat/nettbank-og-app': 'https://www.sor.no/kort-og-betaling/mobil-og-nettbank/mobilbank/',
  'https://www.sor.no/psd2': 'https://www.sor.no/felles/info/open-banking/',
  'https://www.sor.no/om-oss/karriere': 'https://www.sor.no/felles/om-sparebanken-sor/ledige-stillinger/',
  'https://www.spv.no/privat/nettbank-og-app': 'https://www.spv.no/dagligbank/nett-og-mobilbank/mobilbank',
  'https://www.spv.no/psd2': 'https://www.spv.no/kundeservice/psd2',
  'https://www.spv.no/privat/konto/bli-kunde': 'https://www.spv.no/bli-kunde',
  'https://www.spv.no/om-oss/jobbe-i-sparebanken-vest': 'https://www.spv.no/om-oss/jobb',
  // === PORTUGAL ===
  'https://www.bancomontepio.pt/particulares/canais-digitais/app-m24/': 'https://www.bancomontepio.pt/en/individuals/everyday-banking/digital-banking',
  'https://www.bancomontepio.pt/institucional/psd2/': 'https://www.bancomontepio.pt/en/open-banking-apis',
  'https://www.bancomontepio.pt/particulares/contas/conta-online/': 'https://www.bancomontepio.pt/en/individuals/everyday-banking/open-account-online',
  'https://www.bancomontepio.pt/institucional/': 'https://www.bancomontepio.pt/en',
  'https://www.cgd.pt/Particulares/Pages/App-CaixaDireta.aspx': 'https://www.cgd.pt/Particulares/Contas/Caixadirecta/Pages/Caixadirecta.aspx',
  'https://www.cgd.pt/Institucional/Pages/PSD2.aspx': 'https://www.cgd.pt/English/Institutional/News/Pages/Open-Banking-SIBS-API-Market.aspx',
  'https://www.cgd.pt/Particulares/Contas/Pages/Conta-Caixa-S.aspx': 'https://www.cgd.pt/Particulares/Contas/Abertura-conta/Pages/Abertura-conta.aspx',
  'https://www.cgd.pt/Particulares/Apoio-Cliente/Pages/default.aspx': 'https://www.cgd.pt/Particulares/Contas/Caixadirecta/Pages/Caixadirecta.aspx',
  'https://www.cgd.pt/Institucional/Pages/default.aspx': 'https://www.cgd.pt/English/Institutional/Pages/Institutional_v2.aspx',
  // === SLOVAKIA ===
  'https://www.slsp.sk/sk/ludia/ucty/george': 'https://www.slsp.sk/sk/george',
  'https://www.slsp.sk/en/information/open-banking': 'https://www.slsp.sk/en/business/online-banking/psd2-api-banking',
  'https://www.slsp.sk/sk/ludia/uvery/hypoteka/chcem-hypoteku-online': 'https://www.slsp.sk/sk/ludia/uvery/uver-na-byvanie/digitalna-hypoteka',
  'https://www.slsp.sk/sk/ludia/pomoc-a-podpora': 'https://www.slsp.sk/sk/ludia/bezpecnost/co-robit-v-pripade-problemov',
  // === SLOVENIA ===
  'https://www.nlb.si/mobile-bank': 'https://www.nlb.si/en/osebno/digitalne-storitve/nlb-klik',
  'https://www.nlb.si/open-banking': 'https://developer.nlb.me/apidocumentation/apiproducts',
  'https://www.nlb.si/personal/accounts': 'https://www.nlb.si/en/osebno/accounts-and-packages',
  'https://www.nlb.si/contact': 'https://www.nlb.si/en/osebno/contact',
  'https://www.nlb.si/careers': 'https://www.nlbgroup.com/int-en/careers',
  // === SPAIN ===
  'https://www.abanca.com/es/personas/banca-digital/app-abanca/': 'https://www.abanca.com/es/banca-a-distancia/banca-movil/',
  'https://www.abanca.com/es/legal/psd2/': 'https://www.abanca.com/es/banca-a-distancia/psd2/',
  'https://www.abanca.com/es/personas/cuentas/abrir-cuenta-online/': 'https://cuentas.abanca.com/',
  'https://www.abanca.com/es/sobre-abanca/empleo/': 'https://empleo.abanca.com/',
  'https://www.caixabank.es/particular/movilidad/googlepay_es.html': 'https://www.caixabank.es/particular/banca-digital/appcaixabanknow_en.html',
  'https://developer.caixabank.com/apimarket/store/site/pages/open-banking/index.jag': 'https://apistore.caixabank.com/home_en.html',
  'https://www.caixabank.es/particular/cuentas-bancarias/cuenta-online_es.html': 'https://www.caixabank.es/particular/holabank/become-customer.html',
  'https://www.caixabank.com/comunicacion/noticias/corporativas/noa-ayudara-a-mejorar-la-comunicacion-con-los-clientes_es.html': 'https://www.caixabank.com/es/actualidad/noticias/caixabank-crea-un-asistente-virtual-basado-en-inteligencia-artificial-para-dar-apoyo-a-todos-los-empleados-de-su-red',
  'https://www.caixabanktech.com/cases/google-cloud-journey': 'https://www.caixabanktech.com/en/about-us/',
  'https://www.cajaruraldenavarra.com/es/particulares/banca-digital/app-ruralvianext': 'https://www.cajaruraldenavarra.com/en/node/4431',
  'https://www.cajaruraldenavarra.com/es/conocenos/empleo': 'https://www.cajaruraldenavarra.com/es/conocenos/empleo/',
  'https://www.cajamar.es/es/particulares/canales/app-grupo-cajamar/': 'https://www.cajamar.es/en/particulares/productos-y-servicios/banca-a-distancia/banca-movil/',
  'https://www.cajamar.es/es/informacion-legal/psd2/': 'https://www.cajamar.es/en/comun/psd2/',
  'https://www.cajamar.es/es/particulares/cuentas/cuenta-wefferent/': 'https://www.cajamar.es/en/particulares/productos-y-servicios/cuentas/pack-wefferent/',
  'https://www.cajamar.es/es/sobre-cajamar/empleo/': 'https://www.cajamar.es/es/comun/informacion-corporativa/empleo/',
  'https://www.ibercaja.es/particulares/canales-digitales/app-ibercaja/': 'https://www.ibercaja.es/particulares/banca-digital/servicios/app-ibercaja/',
  'https://www.ibercaja.es/informacion-legal/psd2/': 'https://www.ibercaja.es/particulares/corner-del-especialista/informacion-psd2/',
  'https://www.ibercaja.es/particulares/cuentas/abrir-cuenta-online/': 'https://www.ibercaja.es/particulares/cuentas-tarjetas/cuentas/cuenta-vamos/',
  'https://www.ibercaja.es/empleo/tecnologia/': 'https://empleo.ibercaja.es/',
  'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/canales/app-kutxabank': 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/productos/banca-omnicanal/banca-movil/pys',
  'https://portal.kutxabank.es/cs/Satellite/kb/es/psd2': 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/sobre-kutxabank/psd2/generico',
  'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/cuentas/cuenta-online': 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/hazte-cliente/pys',
  'https://portal.kutxabank.es/cs/Satellite/kb/es/atencion-cliente': 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/servicio-atencion-al-cliente-/generico',
  'https://www.kutxabank.es/es/quienes-somos': 'https://portal.kutxabank.es/cs/Satellite/kb/es/particulares/otras-zonas-geograficas-0/areas-de-trabajo/generico',
  'https://www.laboralkutxa.com/es/particulares/banca-online/app': 'https://www.laboralkutxa.com/es/personas/servicios/banca-online/',
  'https://www.laboralkutxa.com/es/psd2': 'https://blog.laboralkutxa.com/es/cambios-identificacion-online-banco-normativa-pagos-psd2',
  'https://www.laboralkutxa.com/es/particulares/cuentas': 'https://www.laboralkutxa.com/es/personas/cuentas-y-tarjetas/cuentas/',
  'https://www.laboralkutxa.com/es/conocenos/trabaja-con-nosotros': 'https://www.laboralkutxa.com/es/personas/trabaja-con-nosotros/',
  'https://www.unicajabanco.es/es/particulares/banca-digital/app-unicaja': 'https://www.unicajabanco.es/en/banca-digital',
  'https://www.unicajabanco.es/es/psd2': 'https://www.unicajabanco.es/es/faqs/banca-digital/psd2',
  'https://www.unicajabanco.es/es/particulares/cuentas/cuenta-online': 'https://www.unicajabanco.es/en/cuenta-online',
  'https://www.unicajabanco.es/es/atencion-cliente': 'https://www.unicajabanco.es/en/ayuda-y-contacto',
  'https://www.unicajabanco.es/es/empleo': 'https://joven.unicajabanco.es/',
  // === SWEDEN ===
  'https://www.swedbank.se/privat/digitala-tjanster/swedbank-app.html': 'https://www.swedbank.se/en/private/our-app.html',
  'https://developer.swedbank.com': 'https://www.swedbank.com/openbanking.html',
  'https://www.swedbank.se/privat/kundservice.html': 'https://www.swedbank.se/en/contact-us.html',
  // === SWITZERLAND ===
  'https://www.raiffeisen.ch/rch/en/private-customers/e-banking/mobile-banking.html': 'https://www.raiffeisen.ch/rch/de/privatkunden/e-banking/mobile-banking-zahlungen-scannen.html',
  'https://www.raiffeisen.ch/rch/en/about-raiffeisen/downloads/legal-notices.html': 'https://www.raiffeisen.ch/rch/de/firmenkunden/liquiditaet-und-zahlungsverkehr/electronic-banking/kmu-eservices/open-banking.html',
  'https://www.raiffeisen.ch/rch/en/private-customers/accounts-and-packages.html': 'https://www.raiffeisen.ch/rch/de/privatkunden/konten-und-bezahlen.html',
  'https://www.raiffeisen.ch/rch/en/about-raiffeisen/careers.html': 'https://www.raiffeisen.ch/rch/de/ueber-uns/karriere.html',
};

// 1. Fix seed_all.sql
const sqlPath = 'sql/seed_all.sql';
let sqlContent = readFileSync(sqlPath, 'utf8');
let sqlReplacedCount = 0;

for (const [oldUrl, newUrl] of Object.entries(replacements)) {
  if (sqlContent.includes(oldUrl)) {
    sqlContent = sqlContent.replaceAll(oldUrl, newUrl);
    sqlReplacedCount++;
  }
}

writeFileSync(sqlPath, sqlContent);
console.log(`Fixed seed_all.sql: ${sqlReplacedCount} URLs replaced`);

// 2. Generate migration SQL (UPDATE statements for live Supabase)
// Parse the seed SQL to extract bank names and their evidence URLs
const migrationLines = [];
migrationLines.push('-- Migration: Fix evidence URLs in digital_features');
migrationLines.push(`-- Generated on ${new Date().toISOString().split('T')[0]}`);
migrationLines.push('-- Run this in the Supabase SQL Editor to update the live database');
migrationLines.push('');

for (const [oldUrl, newUrl] of Object.entries(replacements)) {
  if (newUrl === '') {
    // Empty replacement = set to NULL
    migrationLines.push(`UPDATE digital_features SET evidence_url = NULL WHERE evidence_url = '${oldUrl.replace(/'/g, "''")}';`);
  } else {
    migrationLines.push(`UPDATE digital_features SET evidence_url = '${newUrl.replace(/'/g, "''")}' WHERE evidence_url = '${oldUrl.replace(/'/g, "''")}';`);
  }
}

migrationLines.push('');
migrationLines.push('-- Verify: count remaining broken URLs');
migrationLines.push("SELECT count(*) as total_evidence_urls FROM digital_features WHERE evidence_url IS NOT NULL AND evidence_url != '';");

const migrationPath = 'sql/migrate_fix_evidence_urls.sql';
writeFileSync(migrationPath, migrationLines.join('\n'));
console.log(`Generated migration: ${migrationPath} (${Object.keys(replacements).length} UPDATE statements)`);
