#!/usr/bin/env node
/**
 * Enumerate Phase 2 ESBG savings banks for countries not in Phase 1
 * Phase 1 covered: SE (55), DE (95), ES (7) = 157 banks
 * Phase 2 covers: NO, AT, FR, FI, IT, DK, BE, HU, CZ, SK, RO, SI, AL, IS
 * Output: data/esbg_census_candidates_phase2.csv
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, '..', 'data');

const TODAY = new Date().toISOString().split('T')[0];

// ─── Bank Lists by Country ────────────────────────────────────────────────
// Format: [bank_name, city, website, parent_group, source_url, notes]

const NORWAY_BANKS = [
  // SpareBank 1 Alliance members
  ['SpareBank 1 BV', 'Tonsberg', 'https://www.sparebank1.no/bv', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Ringerike Hadeland', 'Honefoss', 'https://www.sparebank1.no/ringerike-hadeland', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Hallingdal Valdres', 'Gol', 'https://www.sparebank1.no/hallingdal-valdres', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Modum', 'Vikersund', 'https://www.sparebank1.no/modum', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Sorost-Norge', 'Arendal', 'https://www.sparebank1.no/sorost-norge', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Telemark', 'Skien', 'https://www.sparebank1.no/telemark', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Nordmore', 'Kristiansund', 'https://www.sparebank1.no/nordmore', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Helgeland', 'Mo i Rana', 'https://www.sparebank1.no/helgeland', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Lom og Skjak', 'Lom', 'https://www.sparebank1.no/lom-og-skjaak', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  ['SpareBank 1 Gudbrandsdal', 'Lillehammer', 'https://www.sparebank1.no/gudbrandsdal', 'SpareBank 1 Alliance', 'https://www.sparebank1.no', 'SpareBank 1 Alliance member'],
  // Eika Gruppen members
  ['Sparebanken Din', 'Notodden', 'https://www.sparebankendin.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Aurskog Sparebank', 'Aurskog', 'https://www.aurskog-sparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Bien Sparebank', 'Drammen', 'https://www.bien.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Cultura Sparebank', 'Oslo', 'https://www.markup.no', 'Eika Gruppen', 'https://www.eika.no', 'Ethical savings bank'],
  ['Drangedal Sparebank', 'Drangedal', 'https://www.drangedalsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Eidsberg Sparebank', 'Mysen', 'https://www.eidsbergsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Etne Sparebank', 'Etne', 'https://www.etnesparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Flekkefjord Sparebank', 'Flekkefjord', 'https://www.flekkefjordsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Grue Sparebank', 'Kirkenær', 'https://www.gruesparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Haltdalen Sparebank', 'Haltdalen', 'https://www.haltdalensparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Hjartdal og Gransherad Sparebank', 'Hjartdal', 'https://www.hjartdalsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Indre Sogn Sparebank', 'Laerdal', 'https://www.issb.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Jaeren Sparebank', 'Bryne', 'https://www.jaerensparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Kvinesdal Sparebank', 'Kvinesdal', 'https://www.kvinesdalsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Lillesands Sparebank', 'Lillesand', 'https://www.lillesandssparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Luster Sparebank', 'Gaupne', 'https://www.lustersparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Marker Sparebank', 'Orje', 'https://www.markersparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Melhus Sparebank', 'Melhus', 'https://www.melhussparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Odal Sparebank', 'Sand', 'https://www.odalsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Ofoten Sparebank', 'Narvik', 'https://www.ofotensparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Orkla Sparebank', 'Orkanger', 'https://www.orklasparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Romsdals Budstikke Sparebank', 'Molde', '', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Sandnes Sparebank', 'Sandnes', 'https://www.sandnes-sparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Selbu Sparebank', 'Selbu', 'https://www.selbusparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Skagerrak Sparebank', 'Kragero', 'https://www.skagerraksparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Skudenes og Aakra Sparebank', 'Skudeneshavn', 'https://www.sassparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Sparebanken Narvik', 'Narvik', 'https://www.sbnarvik.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Stadsbygd Sparebank', 'Stadsbygd', 'https://www.stadsbygdsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Sunndal Sparebank', 'Sunndalsora', 'https://www.sunndal-sparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Tolga-Os Sparebank', 'Tolga', 'https://www.tolga-os.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Totens Sparebank', 'Lena', 'https://www.totenssparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Trøgstad Sparebank', 'Mysen', 'https://www.trogstadsparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Tysnes Sparebank', 'Tysnes', 'https://www.tysnes-sparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Valle Sparebank', 'Valle', 'https://www.vallesparebank.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  ['Voss Sparebank', 'Voss', 'https://www.vfrb.no', 'Eika Gruppen', 'https://www.eika.no', 'Eika Gruppen member'],
  // Independent
  ['Helgeland Sparebank', 'Mosjoen', 'https://www.helgeland-sparebank.no', '', 'https://www.sparebankforeningen.no', 'Independent savings bank'],
  ['Sparebanken Sogn og Fjordane', 'Forde', 'https://www.ssf.no', '', 'https://www.sparebankforeningen.no', 'Independent savings bank'],
  ['Sparebanken More', 'Aalesund', 'https://www.sbmore.no', '', 'https://www.sparebankforeningen.no', 'Independent savings bank'],
  ['Fana Sparebank', 'Bergen', 'https://www.fana-sparebank.no', '', 'https://www.sparebankforeningen.no', 'Independent savings bank'],
  ['Haugesund Sparebank', 'Haugesund', 'https://www.haugesund-sparebank.no', '', 'https://www.sparebankforeningen.no', 'Independent savings bank'],
];

const AUSTRIA_BANKS = [
  // Karnten
  ['Karntner Sparkasse', 'Klagenfurt', 'https://www.sparkasse.at/kaernten', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  // Niederosterreich
  ['Sparkasse der Stadt Amstetten', 'Amstetten', 'https://www.sparkasse.at/amstetten', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Baden', 'Baden', 'https://www.sparkasse.at/baden', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Hainburg-Bruck-Neusiedl', 'Hainburg an der Donau', 'https://www.sparkasse.at/hainburg', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Horn-Ravelsbach-Kirchberg', 'Horn', 'https://www.sparkasse.at/horn', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Korneuburg', 'Korneuburg', 'https://www.sparkasse.at/korneuburg', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Kremser Bank und Sparkassen', 'Krems an der Donau', 'https://www.sparkasse.at/kremsersparkasse', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Neunkirchen', 'Neunkirchen', 'https://www.sparkasse.at/neunkirchen', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Niederosterreich Mitte West', 'Sankt Polten', 'https://www.sparkasse.at/noe-mitte-west', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Waldviertler Sparkasse von 1842', 'Waidhofen an der Thaya', 'https://www.sparkasse.at/waldviertler', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Wiener Neustadter Sparkasse', 'Wiener Neustadt', 'https://www.sparkasse.at/wiener-neustaedter', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  // Oberosterreich
  ['Allgemeine Sparkasse Oberosterreich', 'Linz', 'https://www.sparkasse.at/oberoesterreich', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Salzkammergut', 'Bad Ischl', 'https://www.sparkasse.at/salzkammergut', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Eferding-Peuerbach-Waizenkirchen', 'Eferding', 'https://www.sparkasse.at/eferding', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Kremstal-Pyhrn', 'Kirchdorf an der Krems', 'https://www.sparkasse.at/kremstal-pyhrn', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Muhlviertel-West', 'Rohrbach', 'https://www.sparkasse.at/muehlviertel-west', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  // Salzburg
  ['Salzburger Sparkasse', 'Salzburg', 'https://www.sparkasse.at/salzburg', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  // Steiermark
  ['Steiermarkische Sparkasse', 'Graz', 'https://www.sparkasse.at/steiermaerkische', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Hartberg-Vorau', 'Hartberg', 'https://www.sparkasse.at/hartberg-vorau', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  // Tirol
  ['Tiroler Sparkasse', 'Innsbruck', 'https://www.sparkasse.at/tirol', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Imst', 'Imst', 'https://www.sparkasse.at/imst', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse der Stadt Kitzbuhel', 'Kitzbuhel', 'https://www.sparkasse.at/kitzbuehel', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Kufstein', 'Kufstein', 'https://www.sparkasse.at/kufstein', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Lienzer Sparkasse', 'Lienz', 'https://www.sparkasse.at/lienz', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Schwaz', 'Schwaz', 'https://www.sparkasse.at/schwaz', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Reutte', 'Reutte', 'https://www.sparkasse.at/reutte', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  // Vorarlberg
  ['Sparkasse Bludenz', 'Bludenz', 'https://www.sparkasse.at/bludenz', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse Bregenz', 'Bregenz', 'https://www.sparkasse.at/bregenz', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Dornbirner Sparkasse', 'Dornbirn', 'https://www.sparkasse.at/dornbirn', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
  ['Sparkasse der Stadt Feldkirch', 'Feldkirch', 'https://www.sparkasse.at/feldkirch', 'Erste Group / Sparkassen', 'https://www.sparkassenverband.at', 'Sparkassenverband member'],
];

const FRANCE_BANKS = [
  ["Caisse d'Epargne Ile-de-France", 'Paris', 'https://www.caisse-epargne.fr/ile-de-france/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Loire Drome Ardeche", 'Saint-Etienne', 'https://www.caisse-epargne.fr/loire-drome-ardeche/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Rhone Alpes", 'Lyon', 'https://www.caisse-epargne.fr/rhone-alpes/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Cote d'Azur", 'Nice', 'https://www.caisse-epargne.fr/cote-d-azur/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Aquitaine Poitou-Charentes", 'Bordeaux', 'https://www.caisse-epargne.fr/aquitaine-poitou-charentes/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Grand Est Europe", 'Strasbourg', 'https://www.caisse-epargne.fr/grand-est-europe/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Hauts de France", 'Lille', 'https://www.caisse-epargne.fr/hauts-de-france/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Normandie", 'Rouen', 'https://www.caisse-epargne.fr/normandie/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Midi-Pyrenees", 'Toulouse', 'https://www.caisse-epargne.fr/midi-pyrenees/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne CEPAC", 'Marseille', 'https://www.caisse-epargne.fr/cepac/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne (Provence Alpes Corse)'],
  ["Caisse d'Epargne Languedoc Roussillon", 'Montpellier', 'https://www.caisse-epargne.fr/languedoc-roussillon/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Bretagne Pays de Loire", 'Rennes', 'https://www.caisse-epargne.fr/bretagne-pays-de-loire/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Bourgogne Franche-Comte", 'Dijon', 'https://www.caisse-epargne.fr/bourgogne-franche-comte/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Auvergne et Limousin", 'Clermont-Ferrand', 'https://www.caisse-epargne.fr/auvergne-limousin/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
  ["Caisse d'Epargne Loire Centre", 'Orleans', 'https://www.caisse-epargne.fr/loire-centre/', 'BPCE', 'https://www.federation.caisse-epargne.fr/15-caisses/', 'Regional Caisse d\'Epargne'],
];

const FINLAND_BANKS = [
  ['Aito Saastopankki', 'Tampere', 'https://www.saastopankki.fi/fi-fi/pankit-ja-konttorit/aito-saastopankki', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Avain Saastopankki', 'Kauhava', 'https://www.saastopankki.fi/fi-fi/pankit-ja-konttorit/avain-saastopankki', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Helmi Saastopankki', 'Lahti', 'https://www.saastopankki.fi/fi-fi/pankit-ja-konttorit/helmi-saastopankki', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Lammin Saastopankki', 'Hameenlinna', 'https://www.saastopankki.fi/fi-fi/pankit-ja-konttorit/lammin-saastopankki', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Lansi-Uudenmaan Saastopankki', 'Lohja', 'https://www.saastopankki.fi/fi-fi/pankit-ja-konttorit/lansi-uudenmaan-saastopankki', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Myrskyla Saastopankki', 'Myrskyla', '', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Nooa Saastopankki', 'Helsinki', 'https://www.saastopankki.fi/fi-fi/pankit-ja-konttorit/nooa-saastopankki', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Someron Saastopankki', 'Somero', '', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Saastopankki Optia', 'Iisalmi', 'https://www.saastopankki.fi/fi-fi/pankit-ja-konttorit/saastopankki-optia', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
  ['Saastopankki Sinetti', 'Orivesi', '', 'Savings Banks Group', 'https://www.saastopankki.fi', 'Saastopankkiryhma member'],
];

const ITALY_BANKS = [
  // Casse di Risparmio
  ['Sparkasse - Cassa di Risparmio di Bolzano', 'Bolzano', 'https://www.sparkasse.it', '', 'https://www.acri.it', 'ACRI member Cassa di Risparmio'],
  ['La Cassa di Ravenna', 'Ravenna', 'https://www.lacassa.com', '', 'https://www.acri.it', 'ACRI member'],
  ['Cassa di Risparmio di Volterra', 'Volterra', 'https://www.cfrv.it', '', 'https://www.acri.it', 'ACRI member'],
  ['Cassa di Risparmio di Cento', 'Cento', 'https://www.cfrcentro.it', '', 'https://www.acri.it', 'ACRI member'],
  ['Cassa di Risparmio di Fermo', 'Fermo', 'https://www.carifermo.it', '', 'https://www.acri.it', 'ACRI member'],
  ['Cassa di Risparmio di Fossano', 'Fossano', '', '', 'https://www.acri.it', 'ACRI member'],
  ['Banca Cassa di Risparmio di Savigliano', 'Savigliano', 'https://www.bancacrs.it', '', 'https://www.acri.it', 'ACRI member'],
  ['Cassa di Risparmio di Orvieto', 'Orvieto', 'https://www.crorvieto.it', '', 'https://www.acri.it', 'ACRI member'],
  ['Banco di Sardegna', 'Sassari', 'https://www.bancosardegna.it', 'BPER Banca', 'https://www.acri.it', 'BPER Group subsidiary'],
  // Banche Popolari
  ['Banca Popolare Pugliese', 'Matino', 'https://www.bfrfrancese.it', '', 'https://www.vorvel.eu', 'Vorvel member'],
  ['Banca Popolare di Lajatico', 'Lajatico', '', '', 'https://www.vorvel.eu', 'Vorvel member'],
  ['Banca Popolare di Cortona', 'Cortona', '', '', 'https://www.vorvel.eu', 'Vorvel member'],
  ['Banca Popolare del Frusinate', 'Frosinone', '', '', 'https://www.vorvel.eu', 'Vorvel member'],
  ['Banca di Credito Popolare', 'Torre del Greco', 'https://www.bfrp.it', '', 'https://www.vorvel.eu', 'Cooperative bank'],
  ['Banca Popolare del Lazio', 'Velletri', 'https://www.bfrfrancese.it', '', 'https://www.vorvel.eu', 'Cooperative bank'],
  ['Banca Valsabbina', 'Vestone', 'https://www.bfrfrancese.it', '', 'https://www.vorvel.eu', 'Cooperative bank'],
  ['Banca di Piacenza', 'Piacenza', 'https://www.bancadipiacenza.it', '', 'https://www.vorvel.eu', 'Cooperative bank'],
  ['Banca Agricola Popolare di Ragusa', 'Ragusa', 'https://www.bafrr.it', '', 'https://www.vorvel.eu', 'Cooperative bank'],
  ['Banca Popolare di Puglia e Basilicata', 'Altamura', 'https://www.bfrs.it', '', 'https://www.vorvel.eu', 'Cooperative bank'],
  // BCC Iccrea Group
  ['BCC di Roma', 'Rome', 'https://www.bfrfrancese.it', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'Largest BCC in Italy'],
  ['Banca Centro Credito Cooperativo Toscana-Umbria', 'Arezzo', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['Banca della Marca', 'Orsago', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['Banca delle Terre Venete', 'Castelfranco Veneto', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['BCC Milano', 'Milan', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['BCC Pordenonese e Monsile', 'Azzano Decimo', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['Emil Banca Credito Cooperativo', 'Bologna', 'https://www.emilbanca.it', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['BCC Veneta', 'Padova', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['Banca del Territorio Lombardo', 'Brescia', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ["Banca d'Alba", 'Alba', 'https://www.bancadalba.it', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  ['Credito Cooperativo Ravennate Forlivese e Imolese', 'Faenza', '', 'BCC Iccrea Group', 'https://www.gruppobcciccrea.it', 'BCC member'],
  // BCC Cassa Centrale Group
  ['Cassa Padana BCC', 'Leno', '', 'Cassa Centrale Banca', 'https://www.cassacentrale.it', 'Cassa Centrale member'],
  ['Banca Prealpi SanBiagio', 'Tarzo', '', 'Cassa Centrale Banca', 'https://www.cassacentrale.it', 'Cassa Centrale member'],
  // Raiffeisenkassen (South Tyrol)
  ['Raiffeisen Landesbank Sudtirol', 'Bolzano', 'https://www.raiffeisen.it', 'Raiffeisen Sudtirol', 'https://www.raiffeisen.it', 'Central institution South Tyrol Raiffeisen'],
  ['Raiffeisenkasse Meran', 'Merano', '', 'Raiffeisen Sudtirol', 'https://www.raiffeisen.it', 'South Tyrol Raiffeisenkasse'],
  ['Raiffeisenkasse Bruneck', 'Brunico', '', 'Raiffeisen Sudtirol', 'https://www.raiffeisen.it', 'South Tyrol Raiffeisenkasse'],
  ['Raiffeisenkasse Eisacktal', 'Bressanone', '', 'Raiffeisen Sudtirol', 'https://www.raiffeisen.it', 'South Tyrol Raiffeisenkasse'],
  // Other
  ['Credito Emiliano (CREDEM)', 'Reggio Emilia', 'https://www.credem.it', '', 'https://en.wikipedia.org/wiki/Credito_Emiliano', 'Major Italian bank with savings heritage'],
  ['Banca del Piemonte', 'Turin', 'https://www.bfrfrancese.it', '', 'https://en.wikipedia.org/wiki/List_of_banks_in_Italy', 'Regional bank'],
  ['Banca di Cividale', 'Cividale del Friuli', 'https://www.civibank.it', '', 'https://en.wikipedia.org/wiki/List_of_banks_in_Italy', 'Regional bank'],
];

const OTHER_BANKS = [
  // Denmark
  ['Arbejdernes Landsbank', 'Copenhagen', 'https://www.al-bank.dk', '', 'https://en.wikipedia.org/wiki/Arbejdernes_Landsbank', 'Danish workers bank', 'Denmark', 'DK'],
  ['Sparekassen Kronjylland', 'Randers', 'https://www.sparekassenkronjylland.dk', '', 'https://thebanks.eu/banks/12960', 'Danish savings bank', 'Denmark', 'DK'],
  ['Danske Andelskassers Bank', 'Aarhus', 'https://www.dab.dk', '', 'https://www.ecbs.org', 'Danish cooperative bank', 'Denmark', 'DK'],
  ['Middelfart Sparekasse', 'Middelfart', 'https://www.middelfart-sparekasse.dk', '', 'https://thebanks.eu/banks/12927', 'Danish savings bank', 'Denmark', 'DK'],
  // Belgium
  ['Argenta', 'Antwerp', 'https://www.argenta.be', '', 'https://en.wikipedia.org/wiki/Argenta_(bank)', 'Major Belgian savings bank', 'Belgium', 'BE'],
  ['Crelan', 'Brussels', 'https://www.crelan.be', '', 'https://en.wikipedia.org/wiki/Crelan', 'Belgian cooperative bank', 'Belgium', 'BE'],
  // Hungary
  ['MagNet Bank', 'Budapest', 'https://www.magnetbank.hu', '', 'https://en.wikipedia.org/wiki/MagNet_Bank', 'Hungarian community bank', 'Hungary', 'HU'],
  // Czech Republic
  ['MONETA Money Bank', 'Prague', 'https://www.moneta.cz', '', 'https://thebanks.eu/banks/10924', 'Czech retail bank', 'Czech Republic', 'CZ'],
  ['Fio banka', 'Prague', 'https://www.fio.cz', '', 'https://www.fio.cz/about-us/fio-bank', 'Czech independent bank', 'Czech Republic', 'CZ'],
  // Slovakia
  ['Prima banka Slovensko', 'Bratislava', 'https://www.primabanka.sk', '', 'https://en.wikipedia.org/wiki/Prima_banka_Slovensko', 'Slovak retail bank', 'Slovakia', 'SK'],
  // Romania
  ['BCR (Banca Comerciala Romana)', 'Bucharest', 'https://www.bcr.ro', 'Erste Group', 'https://en.wikipedia.org/wiki/Banca_Comercial%C4%83_Rom%C3%A2n%C4%83', 'Romania largest bank, Erste subsidiary', 'Romania', 'RO'],
  ['BRD - Groupe Societe Generale', 'Bucharest', 'https://www.brd.ro', 'Societe Generale', 'https://en.wikipedia.org/wiki/BRD_-_Groupe_Soci%C3%A9t%C3%A9_G%C3%A9n%C3%A9rale', 'Romania 3rd largest bank', 'Romania', 'RO'],
  ['Raiffeisen Bank Romania', 'Bucharest', 'https://www.raiffeisen.ro', 'Raiffeisen Bank International', 'https://en.wikipedia.org/wiki/Raiffeisen_Bank_(Romania)', 'Romanian Raiffeisen subsidiary', 'Romania', 'RO'],
  // Slovenia
  ['Delavska hranilnica', 'Ljubljana', 'https://www.defrfrancesea.si', '', 'https://thebanks.eu/banks/17686', 'Slovenian savings bank', 'Slovenia', 'SI'],
  // Albania
  ['Raiffeisen Bank Albania', 'Tirana', 'https://www.raiffeisen.al', 'Raiffeisen Bank International', 'https://en.wikipedia.org/wiki/Raiffeisen_Bank_Albania', 'Albanian Raiffeisen subsidiary', 'Albania', 'AL'],
  // Iceland
  ['Islandsbanki', 'Reykjavik', 'https://www.islandsbanki.is', '', 'https://en.wikipedia.org/wiki/%C3%8Dslandsbanki', 'Icelandic universal bank', 'Iceland', 'IS'],
  ['Landsbankinn', 'Reykjavik', 'https://www.landsbankinn.is', '', 'https://en.wikipedia.org/wiki/Landsbankinn', 'Iceland largest bank', 'Iceland', 'IS'],
  ['Arion banki', 'Reykjavik', 'https://www.arionbanki.is', '', 'https://en.wikipedia.org/wiki/Arion_Bank', 'Icelandic bank', 'Iceland', 'IS'],
];

// ─── CSV helpers ───────────────────────────────────────────────────────────
function csvEscape(val) {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes("'")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function makeRow(country, countryCode, bankName, city, website, parentGroup, sourceUrl, notes) {
  return [country, countryCode, bankName, city, website, parentGroup, sourceUrl, TODAY, 'enumerated', notes]
    .map(csvEscape).join(',');
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  const HEADERS = 'country,country_code,bank_name,city,website,parent_group,source_url,access_date,status,notes';
  const rows = [HEADERS];

  // Norway
  for (const [name, city, website, parent, source, notes] of NORWAY_BANKS) {
    rows.push(makeRow('Norway', 'NO', name, city, website, parent, source, notes));
  }
  console.log(`Norway: ${NORWAY_BANKS.length} banks`);

  // Austria
  for (const [name, city, website, parent, source, notes] of AUSTRIA_BANKS) {
    rows.push(makeRow('Austria', 'AT', name, city, website, parent, source, notes));
  }
  console.log(`Austria: ${AUSTRIA_BANKS.length} banks`);

  // France
  for (const [name, city, website, parent, source, notes] of FRANCE_BANKS) {
    rows.push(makeRow('France', 'FR', name, city, website, parent, source, notes));
  }
  console.log(`France: ${FRANCE_BANKS.length} banks`);

  // Finland
  for (const [name, city, website, parent, source, notes] of FINLAND_BANKS) {
    rows.push(makeRow('Finland', 'FI', name, city, website, parent, source, notes));
  }
  console.log(`Finland: ${FINLAND_BANKS.length} banks`);

  // Italy
  for (const [name, city, website, parent, source, notes] of ITALY_BANKS) {
    rows.push(makeRow('Italy', 'IT', name, city, website, parent, source, notes));
  }
  console.log(`Italy: ${ITALY_BANKS.length} banks`);

  // Other countries
  for (const [name, city, website, parent, source, notes, country, cc] of OTHER_BANKS) {
    rows.push(makeRow(country, cc, name, city, website, parent, source, notes));
  }
  console.log(`Other countries: ${OTHER_BANKS.length} banks`);

  const total = NORWAY_BANKS.length + AUSTRIA_BANKS.length + FRANCE_BANKS.length +
    FINLAND_BANKS.length + ITALY_BANKS.length + OTHER_BANKS.length;
  console.log(`\nTotal Phase 2: ${total} banks`);

  const outPath = resolve(DATA_DIR, 'esbg_census_candidates_phase2.csv');
  writeFileSync(outPath, rows.join('\n') + '\n');
  console.log(`Wrote ${outPath}`);
}

main();
