import { create } from 'zustand';
import type { Bank, FilterState, DigitalFeature, DigitalCategory, MaturityLevel } from '../types';
import { sampleBanks } from '../data/sampleBanks';
import { fetchPublishedBanks, type BankFromDB, type DigitalFeatureFromDB, isSupabaseConfigured } from '../lib/supabase';

interface StoreState {
  // Data
  banks: Bank[];
  filteredBanks: Bank[];
  selectedBank: Bank | null;

  // Loading
  isLoading: boolean;
  error: string | null;
  dataSource: 'supabase' | 'sample';

  // Filters
  filters: FilterState;

  // UI State
  isFilterPanelOpen: boolean;
  isDetailPanelOpen: boolean;
  isRankingsPanelOpen: boolean;
  isComparePanelOpen: boolean;
  isBenchmarksPanelOpen: boolean;
  compareBanks: Bank[];

  // Actions
  loadBanks: () => Promise<void>;
  setBanks: (banks: Bank[]) => void;
  setSelectedBank: (bank: Bank | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  toggleFilterPanel: () => void;
  toggleRankingsPanel: () => void;
  toggleComparePanel: () => void;
  toggleBenchmarksPanel: () => void;
  closeDetailPanel: () => void;
  addToCompare: (bank: Bank) => void;
  removeFromCompare: (bankId: string) => void;
  clearCompare: () => void;
}

const initialFilters: FilterState = {
  search: '',
  country: null,
  scoreRange: [0, 100],
  aumRange: [0, 3000000],
  customerRange: [0, 100000],
};

function transformDBBank(db: BankFromDB): Bank {
  const digitalFeatures: DigitalFeature[] = (db.digital_features || []).map((f: DigitalFeatureFromDB) => ({
    id: f.id,
    bankId: f.bank_id,
    category: f.category as DigitalCategory,
    present: f.present,
    maturityLevel: f.maturity_level as MaturityLevel,
    evidenceUrl: f.evidence_url,
  }));

  return {
    id: db.id,
    name: db.name,
    country: db.country,
    countryCode: db.country_code,
    city: db.city,
    address: db.address,
    latitude: db.latitude,
    longitude: db.longitude,
    parentGroup: db.parent_group,
    website: db.website,
    foundedYear: db.founded_year,
    totalAssets: db.total_assets,
    customerCount: db.customer_count,
    depositVolume: db.deposit_volume,
    loanVolume: db.loan_volume,
    employeeCount: db.employee_count,
    branchCount: db.branch_count,
    reportingYear: db.reporting_year,
    digitalScore: db.digital_score,
    digitalFeatures,
    status: db.status as Bank['status'],
    featured: db.featured || false,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

const applyFilters = (banks: Bank[], filters: FilterState): Bank[] => {
  return banks.filter(bank => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        bank.name.toLowerCase().includes(q) ||
        bank.country.toLowerCase().includes(q) ||
        bank.city?.toLowerCase().includes(q) ||
        bank.parentGroup?.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (filters.country && bank.country !== filters.country) return false;

    if (bank.digitalScore < filters.scoreRange[0] || bank.digitalScore > filters.scoreRange[1]) return false;

    if (bank.totalAssets != null) {
      if (bank.totalAssets < filters.aumRange[0] || bank.totalAssets > filters.aumRange[1]) return false;
    }

    if (bank.customerCount != null) {
      if (bank.customerCount < filters.customerRange[0] || bank.customerCount > filters.customerRange[1]) return false;
    }

    return true;
  });
};

export const useStore = create<StoreState>((set, get) => ({
  banks: [],
  filteredBanks: [],
  selectedBank: null,
  isLoading: true,
  error: null,
  dataSource: 'sample',
  filters: initialFilters,
  isFilterPanelOpen: true,
  isDetailPanelOpen: false,
  isRankingsPanelOpen: false,
  isComparePanelOpen: false,
  isBenchmarksPanelOpen: false,
  compareBanks: [],

  loadBanks: async () => {
    set({ isLoading: true, error: null });

    let allBanks = [...sampleBanks];
    let dataSource: 'supabase' | 'sample' = 'sample';

    if (isSupabaseConfigured()) {
      const result = await fetchPublishedBanks();
      if (result.success && result.banks.length > 0) {
        allBanks = result.banks.map(transformDBBank);
        dataSource = 'supabase';
      } else if (result.error) {
        console.error('Supabase error:', result.error);
      }
    }

    set({
      banks: allBanks,
      filteredBanks: applyFilters(allBanks, get().filters),
      isLoading: false,
      dataSource,
    });
  },

  setBanks: (banks) => {
    set({ banks, filteredBanks: applyFilters(banks, get().filters) });
  },

  setSelectedBank: (bank) => {
    set({ selectedBank: bank, isDetailPanelOpen: bank !== null });
  },

  setFilters: (newFilters) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters, filteredBanks: applyFilters(get().banks, filters) });
  },

  resetFilters: () => {
    set({ filters: initialFilters, filteredBanks: get().banks });
  },

  toggleFilterPanel: () => set({ isFilterPanelOpen: !get().isFilterPanelOpen }),
  toggleRankingsPanel: () => set({ isRankingsPanelOpen: !get().isRankingsPanelOpen }),
  toggleComparePanel: () => set({ isComparePanelOpen: !get().isComparePanelOpen }),
  toggleBenchmarksPanel: () => set({ isBenchmarksPanelOpen: !get().isBenchmarksPanelOpen }),

  closeDetailPanel: () => set({ isDetailPanelOpen: false, selectedBank: null }),

  addToCompare: (bank) => {
    const current = get().compareBanks;
    if (current.length >= 4) return;
    if (current.some(b => b.id === bank.id)) return;
    set({ compareBanks: [...current, bank], isComparePanelOpen: true });
  },

  removeFromCompare: (bankId) => {
    const updated = get().compareBanks.filter(b => b.id !== bankId);
    set({ compareBanks: updated, isComparePanelOpen: updated.length > 0 });
  },

  clearCompare: () => set({ compareBanks: [], isComparePanelOpen: false }),
}));

// Selector hooks
export const useStatistics = () => {
  const banks = useStore(state => state.filteredBanks);
  const totalBanks = banks.length;
  const totalCountries = new Set(banks.map(b => b.country)).size;
  const averageScore = banks.length > 0
    ? Math.round(banks.reduce((sum, b) => sum + b.digitalScore, 0) / banks.length)
    : 0;
  const banksWithDeposits = banks.filter(b => b.depositVolume && b.depositVolume > 0).length;
  const totalDepositsTrillion = banks.reduce((sum, b) => sum + (b.depositVolume || 0), 0) / 1_000_000;
  return { totalBanks, totalCountries, averageScore, banksWithDeposits, totalDepositsTrillion };
};

export interface CountryBenchmark {
  country: string;
  countryCode: string;
  bankCount: number;
  averageScore: number;
  minScore: number;
  maxScore: number;
  totalAssets: number;
  totalCustomers: number;
  topBank: Bank | null;
}

export const useBenchmarks = () => {
  const banks = useStore(state => state.banks);

  const globalAverage = banks.length > 0
    ? Math.round(banks.reduce((sum, b) => sum + b.digitalScore, 0) / banks.length)
    : 0;

  const countryMap = new Map<string, Bank[]>();
  banks.forEach(b => {
    const list = countryMap.get(b.country) || [];
    list.push(b);
    countryMap.set(b.country, list);
  });

  const countryBenchmarks: CountryBenchmark[] = Array.from(countryMap.entries())
    .map(([country, countryBanks]) => {
      const scores = countryBanks.map(b => b.digitalScore);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const topBank = countryBanks.reduce((best, b) =>
        b.digitalScore > (best?.digitalScore || 0) ? b : best, countryBanks[0]);
      const totalAssets = countryBanks.reduce((sum, b) => sum + (b.totalAssets || 0), 0);
      const totalCustomers = countryBanks.reduce((sum, b) => sum + (b.customerCount || 0), 0);

      return {
        country,
        countryCode: countryBanks[0].countryCode,
        bankCount: countryBanks.length,
        averageScore: avgScore,
        minScore: Math.min(...scores),
        maxScore: Math.max(...scores),
        totalAssets,
        totalCustomers,
        topBank,
      };
    })
    .sort((a, b) => b.averageScore - a.averageScore);

  const topPerformers = [...banks]
    .sort((a, b) => b.digitalScore - a.digitalScore)
    .slice(0, 10);

  return {
    globalAverage,
    countryBenchmarks,
    topPerformers,
    totalBanks: banks.length,
    totalCountries: countryMap.size,
  };
};
