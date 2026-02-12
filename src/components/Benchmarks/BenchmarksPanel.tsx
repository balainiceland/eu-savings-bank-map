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
    <div className="absolute top-4 left-4 bg-white rounded-indo border-2 border-black shadow-indo-md z-[1000] w-[520px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col panel-slide-left">
      {/* Header */}
      <div className="p-4 border-b-2 border-black flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-esb-royal" />
          <h2 className="font-bold text-black">Country Benchmarks</h2>
        </div>
        <button onClick={toggleBenchmarksPanel} className="p-1.5 hover:bg-esb-mint rounded-lg transition-colors" aria-label="Close benchmarks">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-6">
        {/* Global stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-esb-mint border-2 border-black rounded-lg p-3 text-center shadow-indo">
            <div className="text-2xl font-bold text-black">{totalBanks}</div>
            <div className="text-xs text-gray-600">Total Banks</div>
          </div>
          <div className="bg-esb-pink border-2 border-black rounded-lg p-3 text-center shadow-indo">
            <div className="text-2xl font-bold text-black">{totalCountries}</div>
            <div className="text-xs text-gray-600">Countries</div>
          </div>
          <div className="bg-esb-gold border-2 border-black rounded-lg p-3 text-center shadow-indo">
            <div className="text-2xl font-bold text-black">{globalAverage}</div>
            <div className="text-xs text-gray-600">Avg Score</div>
          </div>
        </div>

        {/* Chart */}
        <div>
          <h3 className="text-sm font-bold text-black mb-2">Average Digital Score by Country</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis dataKey="country" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: number | undefined) => [`${value ?? 0}`, 'Avg Score']}
                contentStyle={{ fontSize: 12, border: '2px solid #000', borderRadius: '12px' }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} stroke="#000" strokeWidth={1}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Country table */}
        <div>
          <h3 className="text-sm font-bold text-black mb-2">Country Details</h3>
          <div className="space-y-2">
            {countryBenchmarks.map(cb => (
              <div key={cb.country} className="bg-esb-gold rounded-lg p-3 border-2 border-black">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm text-black">{cb.country}</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-black"
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
          <h3 className="text-sm font-bold text-black mb-2">Top 10 Digital Leaders</h3>
          <div className="space-y-1">
            {topPerformers.map((bank, i) => (
              <div key={bank.id} className="flex items-center gap-2 text-sm py-1">
                <span className="text-gray-400 font-mono w-5 text-right">{i + 1}</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-black"
                  style={{ backgroundColor: getScoreColor(bank.digitalScore) }}
                >
                  {bank.digitalScore}
                </div>
                <span className="text-black font-medium flex-1">{bank.name}</span>
                <span className="text-xs text-gray-400">{bank.countryCode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
