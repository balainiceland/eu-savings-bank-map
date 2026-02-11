# European Savings Bank Map — Data Collection Template

## Purpose
Use the CSV template (`bank_data_template.csv`) to research and fill in data for European savings banks. Each row = one bank.

## Column Reference

### Identity
| Column | Required | Description |
|--------|----------|-------------|
| `name` | Yes | Official bank name (in English or local language) |
| `country` | Yes | Full country name (e.g. "Germany", "Spain", "Norway") |
| `country_code` | Yes | ISO 3166-1 alpha-2 code (e.g. "DE", "ES", "NO") |
| `city` | Yes | Headquarters city |
| `address` | No | Street address of HQ |
| `latitude` | Yes | Decimal degrees (e.g. 48.1451) |
| `longitude` | Yes | Decimal degrees (e.g. 11.5820) |
| `parent_group` | No | Parent organization (e.g. "Sparkassen-Finanzgruppe", "SpareBank 1 Alliance", "BPCE") |
| `website` | Yes | Official website URL |
| `founded_year` | No | Year the bank was founded |

### Financial Metrics
| Column | Required | Unit | Description |
|--------|----------|------|-------------|
| `total_assets_millions_eur` | Yes | Millions EUR | Total assets under management. Use latest annual report. Convert from local currency if needed. |
| `customer_count_thousands` | Yes | Thousands | Number of customers. e.g. 1500 = 1.5 million customers |
| `deposit_volume_millions_eur` | No | Millions EUR | Total customer deposits |
| `loan_volume_millions_eur` | No | Millions EUR | Total loan portfolio |
| `employee_count` | No | Headcount | Number of employees (FTE or headcount) |
| `branch_count` | No | Count | Number of physical branches/offices |
| `reporting_year` | Yes | Year | Year the financial data refers to (e.g. 2024) |

### Digital Competitiveness Assessment
Each of the 5 categories requires a **maturity level** and an optional **evidence URL**.

**Maturity levels** (use exactly these values):
- `none` (0 points) — Feature absent
- `basic` (1 point) — Minimal implementation
- `intermediate` (2 points) — Solid implementation
- `advanced` (3 points) — Best-in-class implementation

**Digital score is auto-computed:** `round((sum of all 5 category points / 15) * 100)`

#### Category 1: `mobile_banking`
| Level | Criteria |
|-------|----------|
| `none` | No mobile app available |
| `basic` | App on one platform only (iOS or Android) |
| `intermediate` | Both iOS + Android, core banking features (balance, transfers) |
| `advanced` | Full-featured: payments, biometrics, investment, card management |

**How to research:** Search App Store and Google Play for the bank's app. Check ratings, feature list, last update date.

#### Category 2: `open_banking`
| Level | Criteria |
|-------|----------|
| `none` | No APIs or open banking |
| `basic` | PSD2/regulatory compliance only (EU-mandated) |
| `intermediate` | Developer portal + third-party integrations |
| `advanced` | Open API ecosystem with marketplace or extensive partners |

**How to research:** Look for developer.bankname.com or an API/developer section on the website. Check for Open Banking partnerships.

#### Category 3: `digital_onboarding`
| Level | Criteria |
|-------|----------|
| `none` | Must visit branch to open account |
| `basic` | Partial online — starts online but requires branch visit or postal verification |
| `intermediate` | Fully online for basic current/savings accounts |
| `advanced` | All products online + eKYC/video identification + instant activation |

**How to research:** Try the "open account" flow on the website. Look for video identification (e.g. IDnow, WebID), eKYC, or fully digital paths.

#### Category 4: `ai_chatbot`
| Level | Criteria |
|-------|----------|
| `none` | No chatbot or AI assistant |
| `basic` | FAQ/scripted chatbot with keyword matching |
| `intermediate` | Context-aware conversational chatbot (understands follow-ups) |
| `advanced` | Robo-advisory, AI-powered financial insights, or GPT-level assistant |

**How to research:** Visit the bank's website and look for chat widgets. Search news for AI/chatbot announcements.

#### Category 5: `devops_cloud`
| Level | Criteria |
|-------|----------|
| `none` | Legacy/on-premise infrastructure only |
| `basic` | Some cloud migration started |
| `intermediate` | Hybrid cloud + some CI/CD + modern tech stack |
| `advanced` | Cloud-native architecture + full CI/CD + containerization |

**How to research:** Search for the bank's technology blog, engineering job listings (look for AWS/Azure/GCP, Kubernetes, CI/CD mentions), conference talks, and press releases about digital transformation.

### Evidence URLs
For each category, provide a URL that supports the maturity assessment:
- App Store / Google Play links for mobile banking
- Developer portal URLs for open banking
- Account opening page for digital onboarding
- Chat widget URL or press release for AI/chatbot
- Tech blog or job listing for DevOps/cloud

### Other
| Column | Required | Description |
|--------|----------|-------------|
| `featured` | No | Set to `true` to highlight on the map (use for major/notable banks). Default: `false` |

## Target Banks
Focus on **savings banks, building societies, and cooperative banks** in Europe. Key associations:
- **ESBG** (European Savings and Retail Banking Group) members
- **Sparkassen** (Germany), **Cajas/Caisse** (Spain/France), **SpareBank** (Norway)
- **Building societies** (UK), **Raiffeisen** banks (Austria/Switzerland)

## Score Tiers (for reference)
| Score | Tier | Color |
|-------|------|-------|
| 80–100 | Digital Leader | Green |
| 60–79 | Advanced | Blue |
| 40–59 | Developing | Amber |
| 0–39 | Nascent | Red |

## Output Format
- Fill the CSV with one bank per row
- Use UTF-8 encoding
- Leave cells empty (not "N/A") for missing data
- Use decimal points, not commas, for numbers
- Maturity levels must be exactly: `none`, `basic`, `intermediate`, or `advanced`
