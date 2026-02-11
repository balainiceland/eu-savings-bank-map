import { X, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useStore, useBenchmarks } from '../../hooks/useStore';
import { getScoreColor, formatAssets, formatCustomers } from '../../types';

export default function BenchmarksPanel() {
  const isOpen = useStore(state => state.isBenchmarksPanelOpen);
  const toggleBenchmarksPanel = useStore(state => state.toggleBenchmarksPanel);
  const { globalAverage, countryBenchmarks, topPerformers, totalBanks, totalCountries } = useBenchmarks();

  if (!isOpen) return null;

  const chartData = countryBenchmarks.map(cb => ({
    country: cb.countryCode,
    score: cb.averageScore,
    banks: cb.bankCount,
  }));

  return (
    <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg z-[1000] w-[520px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col panel-slide-left">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-esb-royal" />
          <h2 className="font-semibold text-esb-navy">Country Benchmarks</h2>
        </div>
        <button onClick={toggleBenchmarksPanel} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-6">
        {/* Global stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-esb-navy text-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{totalBanks}</div>
            <div className="text-xs text-gray-300">Total Banks</div>
          </div>
          <div className="bg-esb-royal text-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{totalCountries}</div>
            <div className="text-xs text-gray-300">Countries</div>
          </div>
          <div className="bg-esb-blue text-white rounded-lg p-3 text-center">
            <div className="text-2xl font-bold">{globalAverage}</div>
            <div className="text-xs text-gray-300">Avg Score</div>
          </div>
        </div>

        {/* Chart */}
        <div>
          <h3 className="text-sm font-semibold text-esb-navy mb-2">Average Digital Score by Country</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis dataKey="country" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number | undefined) => [`${value ?? 0}`, 'Avg Score']}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Country table */}
        <div>
          <h3 className="text-sm font-semibold text-esb-navy mb-2">Country Details</h3>
          <div className="space-y-2">
            {countryBenchmarks.map(cb => (
              <div key={cb.country} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-esb-navy">{cb.country}</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: getScoreColor(cb.averageScore) }}
                    >
                      {cb.averageScore}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{cb.bankCount} bank{cb.bankCount !== 1 ? 's' : ''}</span>
                  <span>AUM: {formatAssets(cb.totalAssets)}</span>
                  <span>Customers: {formatCustomers(cb.totalCustomers)}</span>
                </div>
                {cb.topBank && (
                  <div className="text-xs text-gray-400 mt-1">
                    Top: {cb.topBank.name} ({cb.topBank.digitalScore})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top performers */}
        <div>
          <h3 className="text-sm font-semibold text-esb-navy mb-2">Top 10 Digital Leaders</h3>
          <div className="space-y-1">
            {topPerformers.map((bank, i) => (
              <div key={bank.id} className="flex items-center gap-2 text-sm py-1">
                <span className="text-gray-400 font-mono w-5 text-right">{i + 1}</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getScoreColor(bank.digitalScore) }}
                >
                  {bank.digitalScore}
                </div>
                <span className="text-esb-navy font-medium flex-1">{bank.name}</span>
                <span className="text-xs text-gray-400">{bank.countryCode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
