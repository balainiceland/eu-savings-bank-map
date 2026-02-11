import { Search, X, RotateCcw } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { EUROPEAN_COUNTRIES } from '../../data/europeanCountries';

export default function FilterPanel() {
  const isOpen = useStore(state => state.isFilterPanelOpen);
  const filters = useStore(state => state.filters);
  const setFilters = useStore(state => state.setFilters);
  const resetFilters = useStore(state => state.resetFilters);
  const toggleFilterPanel = useStore(state => state.toggleFilterPanel);
  const filteredBanks = useStore(state => state.filteredBanks);
  const banks = useStore(state => state.banks);

  if (!isOpen) return null;

  const countries = [...new Set(banks.map(b => b.country))].sort();

  return (
    <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg z-[1000] w-72 max-h-[calc(100vh-120px)] overflow-y-auto panel-slide-left">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-esb-navy">Filters</h2>
        <div className="flex items-center gap-1">
          <button onClick={resetFilters} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Reset">
            <RotateCcw className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={toggleFilterPanel} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search banks..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-esb-blue/30 focus:border-esb-blue"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
          <select
            value={filters.country || ''}
            onChange={(e) => setFilters({ country: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-esb-blue/30 focus:border-esb-blue"
          >
            <option value="">All Countries</option>
            {countries.map(c => {
              const ec = EUROPEAN_COUNTRIES.find(ec => ec.name === c);
              return (
                <option key={c} value={c}>
                  {ec ? `${c} (${ec.code})` : c}
                </option>
              );
            })}
          </select>
        </div>

        {/* Digital Score Range */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Digital Score: {filters.scoreRange[0]} - {filters.scoreRange[1]}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.scoreRange[0]}
              onChange={(e) => setFilters({ scoreRange: [Number(e.target.value), filters.scoreRange[1]] })}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.scoreRange[1]}
              onChange={(e) => setFilters({ scoreRange: [filters.scoreRange[0], Number(e.target.value)] })}
              className="flex-1"
            />
          </div>
        </div>

        {/* Results count */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          Showing {filteredBanks.length} of {banks.length} banks
        </div>
      </div>
    </div>
  );
}
