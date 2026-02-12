# ESBG Census Phases

## Phase 00 - Seed
Purpose: Build ESBG member seed and country-level expansion sources.

Inputs:
- `/Users/Bala_1/SavingsBankMap/esbg_member_seed_bootstrap.csv`
- `/Users/Bala_1/SavingsBankMap/esbg_country_expansion_sources.csv`

Outputs:
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_00_seed/esbg_member_seed_bootstrap_phase_00.csv`
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_00_seed/esbg_country_expansion_sources_phase_00.csv`

## Phase 01 - Enumeration (Completed)
Purpose: Enumerate first large country tranches and merge with existing enriched dataset.

Inputs:
- Phase 00 seed files
- `/Users/Bala_1/SavingsBankMap/european_savings_bank_data.csv`

Outputs:
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_01_enumeration/esbg_census_candidates_phase_01.csv`
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_01_enumeration/esbg_census_master_intake_phase_01.csv`
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_01_enumeration/european_savings_bank_data_baseline_phase_01.csv`

## Phase 02 - Enumeration (Next)
Purpose: Add next country groups (France regional Caisse d'Epargne entities, Norway sparebanks, Austria sparkassen) and merge into new master intake.

Planned outputs:
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_02_enumeration/esbg_census_candidates_phase_02.csv`
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_02_enumeration/esbg_census_master_intake_phase_02.csv`

## Phase 03 - Enumeration
Purpose: Expand to additional countries/associations and deduplicate legal entities.

Planned outputs:
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_03_enumeration/esbg_census_candidates_phase_03.csv`
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_03_enumeration/esbg_census_master_intake_phase_03.csv`

## Phase 04 - Enrichment
Purpose: Add financial and digital competitiveness fields with strict citations.

Planned outputs:
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_04_enrichment/esbg_enriched_phase_04.csv`
- `/Users/Bala_1/SavingsBankMap/esbg_phases/phase_04_enrichment/esbg_citation_log_phase_04.csv`
