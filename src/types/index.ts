// Bank types
export interface Bank {
  id: string;
  name: string;

  // Location
  country: string;
  countryCode: string;
  city?: string;
  address?: string;
  latitude: number;
  longitude: number;

  // Organization
  parentGroup?: string;
  website?: string;
  foundedYear?: number;

  // Financial metrics
  totalAssets?: number;    // millions EUR
  customerCount?: number;  // thousands
  depositVolume?: number;  // millions EUR
  loanVolume?: number;     // millions EUR
  employeeCount?: number;
  branchCount?: number;
  reportingYear?: number;

  // Digital competitiveness
  digitalScore: number;    // 0-100, computed from features
  digitalFeatures: DigitalFeature[];

  // Status
  status: 'draft' | 'published';
  featured: boolean;

  // Meta
  createdAt: string;
  updatedAt: string;
}

export interface DigitalFeature {
  id: string;
  bankId: string;
  category: DigitalCategory;
  present: boolean;
  maturityLevel: MaturityLevel;
  evidenceUrl?: string;
}

export type DigitalCategory =
  | 'mobile_banking'
  | 'open_banking'
  | 'digital_onboarding'
  | 'ai_chatbot'
  | 'devops_cloud';

export type MaturityLevel = 'none' | 'basic' | 'intermediate' | 'advanced';

// Filter types
export interface FilterState {
  search: string;
  country: string | null;
  scoreRange: [number, number];
  aumRange: [number, number];
  customerRange: [number, number];
}

// Map types
export interface MapViewState {
  center: [number, number];
  zoom: number;
}

// Statistics
export interface Statistics {
  totalBanks: number;
  totalCountries: number;
  averageScore: number;
  byCountry: Record<string, number>;
}

// Constants
export const DIGITAL_CATEGORY_LABELS: Record<DigitalCategory, string> = {
  mobile_banking: 'Mobile Banking',
  open_banking: 'Open Banking / APIs',
  digital_onboarding: 'Digital Onboarding',
  ai_chatbot: 'AI / Chatbot',
  devops_cloud: 'DevOps & Cloud',
};

export const MATURITY_LABELS: Record<MaturityLevel, string> = {
  none: 'None',
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const MATURITY_POINTS: Record<MaturityLevel, number> = {
  none: 0,
  basic: 1,
  intermediate: 2,
  advanced: 3,
};

export const DIGITAL_CATEGORY_DESCRIPTIONS: Record<DigitalCategory, Record<MaturityLevel, string>> = {
  mobile_banking: {
    none: 'No mobile app',
    basic: 'One platform only',
    intermediate: 'Both platforms, core banking',
    advanced: 'Full-featured + payments + biometrics',
  },
  open_banking: {
    none: 'No APIs',
    basic: 'PSD2 compliance only',
    intermediate: 'Developer portal + partners',
    advanced: 'Open API ecosystem',
  },
  digital_onboarding: {
    none: 'Branch only',
    basic: 'Partial online',
    intermediate: 'Fully online basic accounts',
    advanced: 'All products + eKYC + video ident',
  },
  ai_chatbot: {
    none: 'None',
    basic: 'FAQ chatbot',
    intermediate: 'Context-aware chatbot',
    advanced: 'Robo-advisory + AI insights',
  },
  devops_cloud: {
    none: 'Legacy only',
    basic: 'Some cloud migration',
    intermediate: 'Hybrid cloud + some CI/CD',
    advanced: 'Cloud-native + full CI/CD',
  },
};

// Scoring functions
export function computeDigitalScore(features: DigitalFeature[]): number {
  if (features.length === 0) return 0;
  const totalPoints = features.reduce((sum, f) => sum + MATURITY_POINTS[f.maturityLevel], 0);
  const maxPoints = 15; // 5 categories * 3 max points
  return Math.round((totalPoints / maxPoints) * 100);
}

export type ScoreTier = 'leader' | 'advanced' | 'developing' | 'nascent';

export function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return 'leader';
  if (score >= 60) return 'advanced';
  if (score >= 40) return 'developing';
  return 'nascent';
}

export function getScoreTierLabel(score: number): string {
  const tier = getScoreTier(score);
  switch (tier) {
    case 'leader': return 'Digital Leader';
    case 'advanced': return 'Advanced';
    case 'developing': return 'Developing';
    case 'nascent': return 'Nascent';
  }
}

export function getScoreColor(score: number): string {
  const tier = getScoreTier(score);
  switch (tier) {
    case 'leader': return '#10B981';   // green
    case 'advanced': return '#3B82F6'; // blue
    case 'developing': return '#F59E0B'; // amber
    case 'nascent': return '#EF4444';  // red
  }
}

export function getScoreBgClass(score: number): string {
  const tier = getScoreTier(score);
  switch (tier) {
    case 'leader': return 'bg-esb-green';
    case 'advanced': return 'bg-esb-blue';
    case 'developing': return 'bg-esb-amber';
    case 'nascent': return 'bg-esb-red';
  }
}

// Format helpers
export function formatAssets(millions?: number): string {
  if (millions == null) return 'N/A';
  if (millions >= 1000) return `€${(millions / 1000).toFixed(0)}B`;
  return `€${millions.toFixed(0)}M`;
}

export function formatCustomers(thousands?: number): string {
  if (thousands == null) return 'N/A';
  if (thousands >= 1000) return `${(thousands / 1000).toFixed(1)}M`;
  return `${thousands.toFixed(0)}K`;
}
