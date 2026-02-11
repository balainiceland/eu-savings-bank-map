import { BarChart3, GitCompareArrows, Trophy, Filter, Landmark } from 'lucide-react';
import { useStore, useStatistics } from '../hooks/useStore';

export default function Header() {
  const toggleFilterPanel = useStore(state => state.toggleFilterPanel);
  const toggleRankingsPanel = useStore(state => state.toggleRankingsPanel);
  const toggleComparePanel = useStore(state => state.toggleComparePanel);
  const toggleBenchmarksPanel = useStore(state => state.toggleBenchmarksPanel);
  const compareBanks = useStore(state => state.compareBanks);
  const { totalBanks, totalCountries, averageScore } = useStatistics();

  return (
    <header className="bg-esb-navy text-white px-4 py-3 flex items-center justify-between z-50 relative">
      <div className="flex items-center gap-3">
        <Landmark className="w-6 h-6 text-esb-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight">European Savings Bank Map</h1>
          <p className="text-xs text-gray-300">Digital Competitiveness Rankings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="font-bold text-esb-gold">{totalBanks}</div>
          <div className="text-xs text-gray-300">Banks</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-esb-sky">{totalCountries}</div>
          <div className="text-xs text-gray-300">Countries</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-esb-green">{averageScore}</div>
          <div className="text-xs text-gray-300">Avg Score</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleFilterPanel}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Filters"
        >
          <Filter className="w-5 h-5" />
        </button>
        <button
          onClick={toggleRankingsPanel}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Rankings"
        >
          <Trophy className="w-5 h-5" />
        </button>
        <button
          onClick={toggleBenchmarksPanel}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Benchmarks"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
        <button
          onClick={toggleComparePanel}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
          title="Compare"
        >
          <GitCompareArrows className="w-5 h-5" />
          {compareBanks.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-esb-gold text-esb-navy text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {compareBanks.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
