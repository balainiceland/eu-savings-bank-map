# EU Savings Bank Map — Data Sourcing & Enrichment Instructions

## Purpose

You are sourcing and enriching data for the **EU Savings Bank Digital Competitiveness Map**, an interactive map visualizing how European savings banks, cooperative banks, and building societies are performing in digital transformation. The map tracks each bank's digital maturity across five categories and combines this with financial metrics to create a comprehensive European banking landscape view.

Your task is to **source new banks** and/or **enrich existing bank records** for **[TARGET COUNTRY/REGION]**, producing structured data ready for import.

---

## Output Formats

You must produce **two deliverables**:

### 1. SQL File (for database import)

Each bank needs:
- One `INSERT INTO banks` statement (with CTE returning the id)
- One `INSERT INTO digital_features` statement (5 rows, one per digital category)

### 2. CSV Row (for master spreadsheet tracking)

One row per bank in the master CSV format (see CSV section below).

---

## SQL Template Per Bank

```sql
-- [NUMBER]. [Bank Name]
WITH b AS (
  INSERT INTO banks (
    name, country, country_code, city, address,
    latitude, longitude, parent_group, website, founded_year,
    total_assets, customer_count, deposit_volume, loan_volume,
    employee_count, branch_count, reporting_year,
    digital_score, status, featured
  )
  SELECT
    '[Bank Name]', '[Country]', '[CC]', '[City]',
    '[Full Address]',
    [latitude], [longitude],
    '[Parent Group or NULL]',
    '[https://website.example]',
    [founded_year],
    [total_assets], [customer_count], [deposit_volume], [loan_volume],
    [employee_count], [branch_count], [reporting_year],
    [digital_score], 'published', [true|false]
  WHERE NOT EXISTS (
    SELECT 1 FROM banks WHERE name = '[Bank Name]'
      OR (ABS(latitude - [latitude]) < 0.005 AND ABS(longitude - [longitude]) < 0.005)
  )
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level, evidence_url)
SELECT id, cat, present, level, url FROM b,
(VALUES
  ('mobile_banking',       true, '[level]', '[evidence_url or NULL]'),
  ('open_banking',         true, '[level]', '[evidence_url or NULL]'),
  ('digital_onboarding',   true, '[level]', '[evidence_url or NULL]'),
  ('ai_chatbot',           [true|false], '[level]', '[evidence_url or NULL]'),
  ('devops_cloud',         [true|false], '[level]', '[evidence_url or NULL]')
) AS t(cat, present, level, url);
```

### Deduplication

Every INSERT must include the `WHERE NOT EXISTS` guard that checks:
- Exact name match, **OR**
- GPS proximity within 0.005 degrees (~500m)

This prevents duplicate entries when re-running the SQL.

---

## Field-by-Field Specification

### banks table

| Field | Required | Type | Rules |
|-------|----------|------|-------|
| `name` | YES | text | Official bank name. Use the locally recognized name, not a translation (e.g., "Sparkasse KölnBonn" not "Cologne Savings Bank"). If a network, include the network name (e.g., "Groupe BPCE (Caisse d'Epargne network)") |
| `country` | YES | text | Full English country name. Must be one of the 24 supported countries (see list below) |
| `country_code` | YES | text | ISO 3166-1 alpha-2 code, UPPERCASE (e.g., `DE`, `ES`, `NO`) |
| `city` | YES | text | Headquarters city |
| `address` | RECOMMENDED | text | Full street address including postal code |
| `latitude` | YES | decimal | GPS latitude of the headquarters building. Minimum 4 decimal places |
| `longitude` | YES | decimal | GPS longitude of the headquarters building |
| `parent_group` | RECOMMENDED | text | Parent banking group/alliance if applicable (e.g., "Sparkassen-Finanzgruppe", "SpareBank 1 Alliance", "BPCE"). Set to `NULL` if independent |
| `website` | YES | text | Bank's main website URL. Include `https://` |
| `founded_year` | RECOMMENDED | integer | Year the bank was originally founded (even if restructured later) |
| `total_assets` | YES | decimal | **In millions EUR**. This is the most important financial metric. Convert from local currency if needed |
| `customer_count` | RECOMMENDED | decimal | **In thousands**. Total retail + business customers |
| `deposit_volume` | RECOMMENDED | decimal | **In millions EUR**. Total customer deposits |
| `loan_volume` | RECOMMENDED | decimal | **In millions EUR**. Total outstanding loans |
| `employee_count` | RECOMMENDED | integer | Headcount (FTE preferred) |
| `branch_count` | RECOMMENDED | integer | Number of physical branches/offices |
| `reporting_year` | YES | integer | The fiscal year the financial data comes from (e.g., `2024` or `2023`) |
| `digital_score` | YES | decimal | 0-100, **computed** from digital features (see scoring formula below) |
| `status` | YES | text | Always set to `'published'` |
| `featured` | YES | boolean | Set to `true` only for major/notable banks (top 2-3 per country). Default `false` |

### Financial Data Units -- CRITICAL

| Field | Unit | Example |
|-------|------|---------|
| `total_assets` | Millions EUR | CaixaBank: `630000` (= EUR 630 billion) |
| `customer_count` | Thousands | CaixaBank: `20300` (= 20.3 million) |
| `deposit_volume` | Millions EUR | CaixaBank: `462000` (= EUR 462 billion) |
| `loan_volume` | Millions EUR | CaixaBank: `366000` (= EUR 366 billion) |
| `employee_count` | Actual headcount | CaixaBank: `46200` |
| `branch_count` | Actual count | CaixaBank: `4300` |

If financial data is reported in **local currency** (GBP, SEK, NOK, CHF, PLN, HUF, CZK, RON, ISK, DKK), convert to EUR using the approximate exchange rate at the reporting date. Note the conversion in your source log.

---

## Digital Features Specification

Every bank must have **exactly 5 digital feature assessments** -- one per category. This is what makes this map unique.

### The 5 Digital Categories

| Category | DB Value | What It Measures |
|----------|----------|-----------------|
| **Mobile Banking** | `mobile_banking` | Quality and completeness of mobile banking app |
| **Open Banking / APIs** | `open_banking` | API ecosystem, PSD2 implementation, developer portal |
| **Digital Onboarding** | `digital_onboarding` | Ability to open accounts/products fully online |
| **AI / Chatbot** | `ai_chatbot` | Use of AI assistants, chatbots, robo-advisory |
| **DevOps & Cloud** | `devops_cloud` | Cloud adoption, CI/CD, modern infrastructure |

### Maturity Levels & Scoring

Each category is rated on a 4-level maturity scale:

| Level | DB Value | Points | Description |
|-------|----------|--------|-------------|
| None | `none` | 0 | Feature absent or not applicable |
| Basic | `basic` | 1 | Minimal implementation |
| Intermediate | `intermediate` | 2 | Solid implementation with some gaps |
| Advanced | `advanced` | 3 | Best-in-class implementation |

### Maturity Assessment Rubrics

**Mobile Banking:**
| Level | Criteria |
|-------|----------|
| `none` | No mobile app available |
| `basic` | App on one platform only (iOS or Android), limited features |
| `intermediate` | App on both platforms, core banking features (transfers, balance, payments) |
| `advanced` | Full-featured app with mobile payments, biometrics, investment, insurance, real-time notifications |

**Open Banking / APIs:**
| Level | Criteria |
|-------|----------|
| `none` | No APIs, no PSD2 beyond bare minimum |
| `basic` | PSD2/PSD3 compliance only (regulatory minimum) |
| `intermediate` | Developer portal, partner integrations, sandbox environment |
| `advanced` | Open API ecosystem, marketplace, active fintech partnerships, BaaS offerings |

**Digital Onboarding:**
| Level | Criteria |
|-------|----------|
| `none` | Account opening requires branch visit |
| `basic` | Partial online process, still requires paper/branch for some steps |
| `intermediate` | Fully online account opening for basic products (current account, savings) |
| `advanced` | All products available online, eKYC, video identification, instant activation |

**AI / Chatbot:**
| Level | Criteria |
|-------|----------|
| `none` | No AI or chatbot features |
| `basic` | Simple FAQ chatbot, keyword-based |
| `intermediate` | Context-aware chatbot, natural language understanding, personalized responses |
| `advanced` | Robo-advisory, AI-driven financial insights, predictive analytics, AI in risk/compliance |

**DevOps & Cloud:**
| Level | Criteria |
|-------|----------|
| `none` | Fully legacy/on-premises infrastructure |
| `basic` | Some workloads migrated to cloud |
| `intermediate` | Hybrid cloud strategy, some CI/CD pipelines |
| `advanced` | Cloud-native architecture, full CI/CD, infrastructure as code, microservices |

### Digital Score Calculation

```
digital_score = (sum of maturity points across all 5 categories / 15) x 100
```

- Maximum possible: 15 points (5 categories x 3 points each) = score of 100
- All advanced: 15/15 x 100 = 100
- All intermediate: 10/15 x 100 = 67
- All basic: 5/15 x 100 = 33
- Mixed example: advanced(3) + advanced(3) + intermediate(2) + basic(1) + intermediate(2) = 11/15 x 100 = 73

**Round to nearest integer.**

### Score Tiers

| Tier | Score Range | Map Color |
|------|------------|-----------|
| Digital Leader | 80-100 | Green (#00ffb2) |
| Advanced | 60-79 | Teal (#21e9c5) |
| Developing | 40-59 | Pink (#fd88fd) |
| Nascent | 0-39 | Purple (#e0b8ff) |

### Evidence URLs

For each digital feature, provide an **evidence URL** -- a link that supports the maturity assessment. Acceptable evidence:

- Bank's own website showing the feature (e.g., mobile app page, API developer portal)
- Press releases or news articles about digital initiatives
- Annual reports mentioning digital strategy
- Case studies or technology partner announcements
- App store listings

If no evidence URL is available, use `NULL` -- but try to find at least one per category.

---

## Supported Countries

Use **only** these 24 countries and their codes:

| Country | Code | | Country | Code |
|---------|------|-|---------|------|
| Albania | AL | | Luxembourg | LU |
| Austria | AT | | Malta | MT |
| Belgium | BE | | Netherlands | NL |
| Czech Republic | CZ | | Norway | NO |
| Denmark | DK | | Poland | PL |
| Finland | FI | | Portugal | PT |
| France | FR | | Romania | RO |
| Germany | DE | | Slovakia | SK |
| Hungary | HU | | Slovenia | SI |
| Iceland | IS | | Spain | ES |
| Italy | IT | | Sweden | SE |
| | | | Switzerland | CH |
| | | | United Kingdom | GB |

---

## What Qualifies as a "Savings Bank"

Include these types of institutions:
- **Savings banks** (Sparkassen, Caisses d'Epargne, Cajas, Sparebanker, etc.)
- **Cooperative banks** with a retail/savings focus
- **Building societies** (UK)
- **Postal savings banks** or banks with savings bank heritage
- **Regional/mutual banks** that serve retail depositors

Do **NOT** include:
- Investment banks or wholesale banks
- Central banks
- Insurance companies (even if they offer savings products)
- Pure fintech/neobanks with no physical presence (Revolut, N26, etc.)
- Credit unions with < EUR 500M in assets (too small)

### Key Indicator: ESBG Membership

Banks that are members of the **European Savings and Banking Group (ESBG)** or the **World Savings and Retail Banking Institute (WSBI)** are prime candidates. Check:
- https://www.wsbi-esbg.org/members/

---

## Data Sourcing Strategy

### Tier 1 -- Authoritative Sources (Prefer These)

1. **Bank annual reports** -- Most reliable for financial data. Usually available as PDF on the bank's investor relations page
2. **National banking regulators / central banks:**
   - Germany: BaFin, Bundesbank statistics
   - Spain: Banco de Espana
   - France: ACPR (Banque de France)
   - Norway: Finanstilsynet
   - UK: PRA/FCA
   - Sweden: Finansinspektionen
   - Italy: Banca d'Italia
   - Austria: FMA
   - Poland: KNF
   - etc.
3. **ESBG / WSBI publications:**
   - Annual reports, member directories, statistical annexes
   - https://www.wsbi-esbg.org/
4. **S&P Global / Moody's / Fitch** -- If accessible, use for total assets and financial metrics

### Tier 2 -- Digital Assessment Sources

5. **Bank websites** -- Navigate to:
   - Mobile banking / app pages
   - Open banking / API / developer portal pages
   - Account opening pages
   - Press/news sections (search for "AI", "chatbot", "cloud", "digital")
6. **App store listings** -- Check Apple App Store and Google Play for the bank's app (ratings, feature descriptions)
7. **Technology partner announcements** -- e.g., "Bank X partners with Temenos/Backbase/Mambu for cloud migration"
8. **Industry reports:**
   - Deloitte European Banking Survey
   - EBF Digital Banking Factbook
   - McKinsey Panorama / Finalta benchmarks

### Tier 3 -- Supplementary

9. **LinkedIn company pages** -- Employee count, job postings (cloud/DevOps hiring = signal)
10. **Crunchbase / Owler** -- Company overview, estimated financials
11. **Wikipedia** -- Founded year, headquarters, parent group
12. **Google Maps** -- For headquarters GPS coordinates

---

## Enrichment vs. New Entry

### For NEW banks (not yet in the database):

Provide all fields. Every new bank must have:
- Complete location data (name, country, code, city, address, lat/lng)
- At least `total_assets` and `reporting_year` for financial data
- All 5 digital feature assessments with maturity levels
- At least 3 evidence URLs across the 5 categories

### For ENRICHING existing banks:

Focus on filling gaps. Common enrichment tasks:
1. **Missing financial data** -- Add `deposit_volume`, `loan_volume`, `customer_count`, `branch_count`
2. **Upgrade evidence URLs** -- Replace missing/broken URLs with working ones
3. **Reassess digital maturity** -- If the bank has launched new features since last assessment
4. **Update reporting_year** -- If newer annual report is available
5. **Add address** -- Many existing entries only have city, not full address

For enrichment, produce an **UPDATE SQL** instead:

```sql
-- Enrich: [Bank Name] -- add financial data from 2024 annual report
UPDATE banks SET
  total_assets = [value],
  deposit_volume = [value],
  loan_volume = [value],
  customer_count = [value],
  employee_count = [value],
  branch_count = [value],
  reporting_year = 2024,
  updated_at = now()
WHERE name = '[Bank Name]';
```

For digital feature updates:

```sql
-- Update digital feature evidence for [Bank Name]
UPDATE digital_features SET
  maturity_level = '[new_level]',
  evidence_url = '[new_url]'
WHERE bank_id = (SELECT id FROM banks WHERE name = '[Bank Name]')
  AND category = '[category]';
```

---

## CSV Format (Master Tracking)

Each bank should also be recorded as a CSV row in the master spreadsheet format:

```
name,country,country_code,city,address,latitude,longitude,parent_group,website,founded_year,total_assets_millions_eur,customer_count_thousands,deposit_volume_millions_eur,loan_volume_millions_eur,employee_count,branch_count,reporting_year,mobile_banking,mobile_banking_evidence,open_banking,open_banking_evidence,digital_onboarding,digital_onboarding_evidence,ai_chatbot,ai_chatbot_evidence,devops_cloud,devops_cloud_evidence,featured
```

**Digital feature columns** use the maturity level string directly: `none`, `basic`, `intermediate`, or `advanced`.

---

## Assessment Tracker CSV (Citation Tracking)

For each bank assessed, also produce a tracker row:

```
name,country,website,mobile_banking,open_banking,digital_onboarding,ai_chatbot,devops_cloud,digital_score,digital_tier,annual_report_url,case_study_url,press_release_url,assessment_confidence,evidence_status,notes
```

### Assessment Confidence Levels

| Confidence | When to use |
|------------|-------------|
| `High` | All evidence URLs verified from official bank sources |
| `Medium-High` | Majority verified; mix of official + reputable third-party |
| `Medium` | Partial verification; some URLs unverified |
| `Unverified` | Assessment based on general knowledge, no specific URLs yet |

### Evidence Status

| Status | When to use |
|--------|-------------|
| `strict_verified` | All URLs directly validated (HTTP 200, content matches claim) |
| `strict_partial` | Some URLs verified, others pending |
| `pending_source_validation` | URLs collected but not yet verified |

---

## Citation Log CSV

For each piece of evidence, also produce a citation row:

```
bank_name,field,value,source_url,source_type,access_date,verification_status,notes
```

**source_type** values: `annual_report`, `case_study_or_tech_source`, `press_release`, `bank_website`, `regulator_data`, `app_store`, `industry_report`

**verification_status** values: `verified`, `unverified`, `broken_link`

---

## SQL File Structure

```sql
-- =====================================================
-- EU Savings Bank Map -- [Country] Banks
-- Source: [Primary source name/URL]
-- Date: [YYYY-MM-DD]
-- Total entries: [N new] + [M enriched]
--
-- Run this in your Supabase SQL Editor
-- Skips duplicates by checking name OR GPS proximity
-- =====================================================

-- ===== NEW BANKS =====

-- 1. [Bank Name]
WITH b AS (
  INSERT INTO banks (...) SELECT ... WHERE NOT EXISTS (...) RETURNING id
)
INSERT INTO digital_features (...) SELECT ... FROM b, (VALUES ...) AS t(...);

-- ===== ENRICHMENT UPDATES =====

-- Update: [Bank Name] -- [what was enriched]
UPDATE banks SET ... WHERE name = '...';
```

### Batching

- Maximum **30 banks per file** (each bank generates a larger SQL block than the factory map due to the CTE + 5 feature rows)
- Name files as: `seed_[country]_[source]_batch_NNN.sql`
- Examples: `seed_germany_sparkassen_batch_001.sql`, `seed_norway_sparebanken_batch_001.sql`

---

## String Escaping

- Escape single quotes by doubling them: `'` -> `''`
- Example: `'Caisse d''Epargne Ile-de-France'`
- Be especially careful with:
  - French names: d'Epargne, Ile-de-France
  - German names: usually safe (ae, oe, ue are fine in UTF-8)
  - Norwegian/Swedish: oe, aa, ae are fine in UTF-8

---

## Countries Already Covered (Current Database: ~70 banks)

The database currently has banks from these countries. Focus enrichment on filling gaps and adding missing institutions:

- **Spain** -- CaixaBank, Kutxabank, Unicaja, Ibercaja, Abanca, Caixa Ontinyent, Colonya Pollenca
- **France** -- Groupe BPCE, Credit Mutuel, Banques Populaires
- **Germany** -- Sparkasse KoelnBonn, Hamburger Sparkasse, Berliner Sparkasse, and others
- **Norway** -- SpareBank 1 SR-Bank, SpareBank 1 Nord-Norge, SpareBank 1 SMN, SpareBank 1 Ostlandet
- **Sweden** -- Swedbank, Laensfoersaekringar, Sparbanken Skaane
- **Austria** -- Erste Group, Raiffeisen
- **UK** -- Nationwide Building Society, Yorkshire Building Society
- **Netherlands** -- Rabobank, De Volksbank
- **Hungary** -- OTP Bank
- **Finland** -- OP Financial Group, S-Pankki
- **Italy** -- Cassa Depositi e Prestiti, Banca Etica
- **Poland** -- PKO Bank Polski, Bank Pocztowy

### High-Priority Countries for NEW Data

- **Germany** -- Hundreds of Sparkassen exist, only a few in DB. Major gap.
- **Italy** -- Large savings bank sector (Casse di Risparmio), underrepresented
- **Portugal** -- Caixa Geral de Depositos, Montepio
- **Switzerland** -- Cantonal banks (Kantonalbanken), Raiffeisen Schweiz
- **Denmark** -- Spar Nord, Nykredit, Arbejdernes Landsbank
- **Belgium** -- Belfius, Argenta
- **Czech Republic** -- Ceska sporitelna
- **Romania** -- CEC Bank, Banca Transilvania
- **Slovenia** -- NLB, Delavska Hranilnica
- **Slovakia** -- Slovenska sporitelna, Prima banka

---

## Quality Checklist

Before submitting your output, verify each bank entry:

- [ ] Bank name is the official local name (not translated)
- [ ] Country is one of the 24 supported countries
- [ ] Country code is correct ISO 3166-1 alpha-2 (uppercase)
- [ ] City is the headquarters city
- [ ] GPS coordinates point to the actual HQ building, not city center (unless noted)
- [ ] Website URL is valid and uses `https://`
- [ ] `total_assets` is in **millions EUR** (not billions, not local currency)
- [ ] `customer_count` is in **thousands** (not actual count)
- [ ] `reporting_year` matches the annual report used
- [ ] All 5 digital features are assessed (none missing)
- [ ] Digital score is correctly calculated: `round(sum_of_points / 15 * 100)`
- [ ] At least 3 evidence URLs provided across the 5 digital features
- [ ] Evidence URLs are accessible and relevant to the claimed maturity level
- [ ] Single quotes in all text fields are properly escaped (`''`)
- [ ] WHERE NOT EXISTS deduplication guard is present
- [ ] The institution is a savings/cooperative/mutual bank (not investment bank, neobank, etc.)
- [ ] Assessment confidence and evidence status are recorded in the tracker CSV

---

## Complete Example: New Bank

```sql
-- 1. SpareBank 1 SR-Bank
WITH b AS (
  INSERT INTO banks (
    name, country, country_code, city, address,
    latitude, longitude, parent_group, website, founded_year,
    total_assets, customer_count, deposit_volume, loan_volume,
    employee_count, branch_count, reporting_year,
    digital_score, status, featured
  )
  SELECT
    'SpareBank 1 SR-Bank', 'Norway', 'NO', 'Stavanger',
    'Bjergsted Terrasse 1, 4007 Stavanger, Norway',
    58.9700, 5.7331,
    'SpareBank 1 Alliance',
    'https://www.sparebank1.no/nb/sr-bank/',
    1839,
    35000, 300, 22000, 28000,
    1200, 30, 2024,
    80, 'published', false
  WHERE NOT EXISTS (
    SELECT 1 FROM banks WHERE name = 'SpareBank 1 SR-Bank'
      OR (ABS(latitude - 58.9700) < 0.005 AND ABS(longitude - 5.7331) < 0.005)
  )
  RETURNING id
)
INSERT INTO digital_features (bank_id, category, present, maturity_level, evidence_url)
SELECT id, cat, present, level, url FROM b,
(VALUES
  ('mobile_banking',     true,  'advanced',     'https://www.sparebank1.no/nb/sr-bank/privat/digitale-tjenester/mobilbank.html'),
  ('open_banking',       true,  'intermediate', 'https://developer.sparebank1.no/'),
  ('digital_onboarding', true,  'advanced',     'https://www.sparebank1.no/nb/sr-bank/privat/bli-kunde.html'),
  ('ai_chatbot',         true,  'intermediate', NULL),
  ('devops_cloud',       true,  'intermediate', 'https://www.sparebank1.no/nb/sr-bank/om-oss/teknologi.html')
) AS t(cat, present, level, url);
```

**Score calculation:** advanced(3) + intermediate(2) + advanced(3) + intermediate(2) + intermediate(2) = 12/15 x 100 = **80**

## Complete Example: Enrichment Update

```sql
-- Enrich: Hamburger Sparkasse -- 2024 annual report financial data
UPDATE banks SET
  total_assets = 55000,
  deposit_volume = 38000,
  loan_volume = 32000,
  customer_count = 1600,
  employee_count = 4800,
  branch_count = 95,
  reporting_year = 2024,
  updated_at = now()
WHERE name = 'Hamburger Sparkasse';

-- Update: Hamburger Sparkasse -- upgraded AI chatbot (launched 2024)
UPDATE digital_features SET
  maturity_level = 'intermediate',
  evidence_url = 'https://www.haspa.de/de/home/service/chatbot.html'
WHERE bank_id = (SELECT id FROM banks WHERE name = 'Hamburger Sparkasse')
  AND category = 'ai_chatbot';
```

---

## Deliverables

For each target country/region, produce:

1. **SQL file(s)** -- New banks + enrichment updates, batched at 30 banks per file
2. **CSV rows** -- In the master CSV format for each new bank
3. **Assessment tracker rows** -- Confidence level and evidence status per bank
4. **Citation log rows** -- One row per evidence URL with source type and verification status
5. **Source log** -- Brief text noting:
   - What sources you used (annual reports, regulator data, websites)
   - How many new banks sourced and how many existing banks enriched
   - Currency conversions applied (with exchange rates used)
   - Data quality issues or gaps
   - Banks excluded and why

Name files as: `seed_[country]_[source]_batch_NNN.sql`
Examples: `seed_germany_sparkassen_batch_001.sql`, `seed_switzerland_kantonalbanken_batch_001.sql`
