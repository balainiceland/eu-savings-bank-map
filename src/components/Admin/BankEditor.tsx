import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { DIGITAL_CATEGORY_LABELS, DIGITAL_CATEGORY_DESCRIPTIONS, MATURITY_LABELS, computeDigitalScore } from '../../types';
import type { Bank, DigitalCategory, MaturityLevel, DigitalFeature } from '../../types';
import { EUROPEAN_COUNTRIES } from '../../data/europeanCountries';

interface BankEditorProps {
  bank?: Bank;
  onSave: (data: BankEditorData) => void;
  onCancel: () => void;
}

export interface BankEditorData {
  name: string;
  country: string;
  countryCode: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  parentGroup: string;
  website: string;
  foundedYear: number | undefined;
  totalAssets: number | undefined;
  customerCount: number | undefined;
  depositVolume: number | undefined;
  loanVolume: number | undefined;
  employeeCount: number | undefined;
  branchCount: number | undefined;
  reportingYear: number;
  digitalFeatures: DigitalFeature[];
  digitalScore: number;
  status: 'draft' | 'published';
  featured: boolean;
}

const categories = Object.keys(DIGITAL_CATEGORY_LABELS) as DigitalCategory[];
const maturityLevels: MaturityLevel[] = ['none', 'basic', 'intermediate', 'advanced'];

export default function BankEditor({ bank, onSave, onCancel }: BankEditorProps) {
  const [name, setName] = useState(bank?.name || '');
  const [country, setCountry] = useState(bank?.country || '');
  const [countryCode, setCountryCode] = useState(bank?.countryCode || '');
  const [city, setCity] = useState(bank?.city || '');
  const [address, setAddress] = useState(bank?.address || '');
  const [latitude, setLatitude] = useState(bank?.latitude || 0);
  const [longitude, setLongitude] = useState(bank?.longitude || 0);
  const [parentGroup, setParentGroup] = useState(bank?.parentGroup || '');
  const [website, setWebsite] = useState(bank?.website || '');
  const [foundedYear, setFoundedYear] = useState<number | undefined>(bank?.foundedYear);
  const [totalAssets, setTotalAssets] = useState<number | undefined>(bank?.totalAssets);
  const [customerCount, setCustomerCount] = useState<number | undefined>(bank?.customerCount);
  const [depositVolume, setDepositVolume] = useState<number | undefined>(bank?.depositVolume);
  const [loanVolume, setLoanVolume] = useState<number | undefined>(bank?.loanVolume);
  const [employeeCount, setEmployeeCount] = useState<number | undefined>(bank?.employeeCount);
  const [branchCount, setBranchCount] = useState<number | undefined>(bank?.branchCount);
  const [reportingYear, setReportingYear] = useState(bank?.reportingYear || 2024);
  const [status, setStatus] = useState<'draft' | 'published'>(bank?.status || 'draft');
  const [featured, setFeatured] = useState(bank?.featured || false);

  // Digital features state
  const [featureLevels, setFeatureLevels] = useState<Record<DigitalCategory, MaturityLevel>>(() => {
    const initial: Record<string, MaturityLevel> = {};
    categories.forEach(cat => {
      const existing = bank?.digitalFeatures.find(f => f.category === cat);
      initial[cat] = existing?.maturityLevel || 'none';
    });
    return initial as Record<DigitalCategory, MaturityLevel>;
  });

  const handleCountryChange = (name: string) => {
    setCountry(name);
    const ec = EUROPEAN_COUNTRIES.find(c => c.name === name);
    if (ec) {
      setCountryCode(ec.code);
      if (!latitude && !longitude) {
        setLatitude(ec.center[0]);
        setLongitude(ec.center[1]);
      }
    }
  };

  const handleFeatureChange = (category: DigitalCategory, level: MaturityLevel) => {
    setFeatureLevels(prev => ({ ...prev, [category]: level }));
  };

  const currentFeatures: DigitalFeature[] = categories.map(cat => ({
    id: bank?.digitalFeatures.find(f => f.category === cat)?.id || `new-${cat}`,
    bankId: bank?.id || 'new',
    category: cat,
    present: featureLevels[cat] !== 'none',
    maturityLevel: featureLevels[cat],
  }));

  const currentScore = computeDigitalScore(currentFeatures);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name, country, countryCode, city, address,
      latitude, longitude, parentGroup, website,
      foundedYear, totalAssets, customerCount,
      depositVolume, loanVolume, employeeCount, branchCount,
      reportingYear, digitalFeatures: currentFeatures,
      digitalScore: currentScore, status, featured,
    });
  };

  const inputClass = "w-full px-3 py-2 border-2 border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-esb-royal/30 focus:border-esb-royal";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">
          {bank ? 'Edit Bank' : 'Add New Bank'}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-esb-mint/30 rounded-lg border-2 border-black">
            <X className="w-4 h-4 inline mr-1" />Cancel
          </button>
          <button type="submit" className="indo-btn indo-btn-teal text-sm">
            <Save className="w-4 h-4" />Save
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <fieldset className="border-2 border-black rounded-lg p-4">
        <legend className="text-sm font-bold text-black px-2">Basic Information</legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Bank Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Country *</label>
            <select value={country} onChange={e => handleCountryChange(e.target.value)} required className={inputClass}>
              <option value="">Select country</option>
              {EUROPEAN_COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
            <input value={city} onChange={e => setCity(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Parent Group</label>
            <input value={parentGroup} onChange={e => setParentGroup(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} type="url" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Latitude *</label>
            <input value={latitude} onChange={e => setLatitude(Number(e.target.value))} type="number" step="any" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Longitude *</label>
            <input value={longitude} onChange={e => setLongitude(Number(e.target.value))} type="number" step="any" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Founded Year</label>
            <input value={foundedYear || ''} onChange={e => setFoundedYear(e.target.value ? Number(e.target.value) : undefined)} type="number" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <input value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Financial Metrics */}
      <fieldset className="border-2 border-black rounded-lg p-4">
        <legend className="text-sm font-bold text-black px-2">Financial Metrics</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Total Assets (M EUR)</label>
            <input value={totalAssets || ''} onChange={e => setTotalAssets(e.target.value ? Number(e.target.value) : undefined)} type="number" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Customers (thousands)</label>
            <input value={customerCount || ''} onChange={e => setCustomerCount(e.target.value ? Number(e.target.value) : undefined)} type="number" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Deposits (M EUR)</label>
            <input value={depositVolume || ''} onChange={e => setDepositVolume(e.target.value ? Number(e.target.value) : undefined)} type="number" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Loans (M EUR)</label>
            <input value={loanVolume || ''} onChange={e => setLoanVolume(e.target.value ? Number(e.target.value) : undefined)} type="number" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Employees</label>
            <input value={employeeCount || ''} onChange={e => setEmployeeCount(e.target.value ? Number(e.target.value) : undefined)} type="number" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Branches</label>
            <input value={branchCount || ''} onChange={e => setBranchCount(e.target.value ? Number(e.target.value) : undefined)} type="number" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reporting Year</label>
            <input value={reportingYear} onChange={e => setReportingYear(Number(e.target.value))} type="number" className={inputClass} />
          </div>
        </div>
      </fieldset>

      {/* Digital Features Checklist */}
      <fieldset className="border-2 border-black rounded-lg p-4">
        <legend className="text-sm font-bold text-black px-2">
          Digital Features (Score: {currentScore}/100)
        </legend>
        <div className="space-y-4">
          {categories.map(category => (
            <div key={category} className="border-b-2 border-black pb-3 last:border-0">
              <div className="font-bold text-sm text-black mb-2">{DIGITAL_CATEGORY_LABELS[category]}</div>
              <div className="grid grid-cols-4 gap-2">
                {maturityLevels.map(level => (
                  <label
                    key={level}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer text-center transition-colors ${
                      featureLevels[category] === level
                        ? 'border-black bg-esb-royal/30'
                        : 'border-gray-200 hover:bg-esb-mint/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name={category}
                      value={level}
                      checked={featureLevels[category] === level}
                      onChange={() => handleFeatureChange(category, level)}
                      className="sr-only"
                    />
                    <span className="text-xs font-bold">{MATURITY_LABELS[level]}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                      {DIGITAL_CATEGORY_DESCRIPTIONS[category][level]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Status */}
      <fieldset className="border-2 border-black rounded-lg p-4">
        <legend className="text-sm font-bold text-black px-2">Publishing</legend>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="draft" checked={status === 'draft'}
              onChange={() => setStatus('draft')} className="accent-[#21e9c5]" />
            <span className="text-sm font-bold">Draft</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="published" checked={status === 'published'}
              onChange={() => setStatus('published')} className="accent-[#21e9c5]" />
            <span className="text-sm font-bold">Published</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer ml-auto">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="accent-[#21e9c5]" />
            <span className="text-sm font-bold">Featured</span>
          </label>
        </div>
      </fieldset>
    </form>
  );
}
