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
    <header className="bg-white text-black px-4 py-3 flex items-center justify-between z-50 relative border-b-2 border-black">
      <div className="flex items-center gap-3">
        <Landmark className="w-6 h-6 text-esb-royal" />
        <div>
          <h1 className="text-lg font-bold leading-tight">European Savings Bank Map</h1>
          <p className="text-xs text-gray-500">Digital Competitiveness Rankings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="font-bold text-esb-royal">{totalBanks}</div>
          <div className="text-xs text-gray-500">Banks</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-esb-green">{totalCountries}</div>
          <div className="text-xs text-gray-500">Countries</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-esb-amber">{averageScore}</div>
          <div className="text-xs text-gray-500">Avg Score</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleFilterPanel}
          className="p-2 hover:bg-esb-mint rounded-lg border-2 border-transparent hover:border-black transition-colors"
          aria-label="Toggle filters"
        >
          <Filter className="w-5 h-5" />
        </button>
        <button
          onClick={toggleRankingsPanel}
          className="p-2 hover:bg-esb-mint rounded-lg border-2 border-transparent hover:border-black transition-colors"
          aria-label="Toggle rankings"
        >
          <Trophy className="w-5 h-5" />
        </button>
        <button
          onClick={toggleBenchmarksPanel}
          className="p-2 hover:bg-esb-mint rounded-lg border-2 border-transparent hover:border-black transition-colors"
          aria-label="Toggle benchmarks"
        >
          <BarChart3 className="w-5 h-5" />
        </button>
        <button
          onClick={toggleComparePanel}
          className="p-2 hover:bg-esb-mint rounded-lg border-2 border-transparent hover:border-black transition-colors relative"
          aria-label="Toggle compare"
        >
          <GitCompareArrows className="w-5 h-5" />
          {compareBanks.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-esb-royal text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-black">
              {compareBanks.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
