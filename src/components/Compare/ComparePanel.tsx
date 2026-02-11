import { X, Trash2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '../../hooks/useStore';
import { DIGITAL_CATEGORY_LABELS, MATURITY_POINTS, formatAssets, formatCustomers, getScoreColor, getScoreTierLabel } from '../../types';
import type { Bank, DigitalCategory } from '../../types';

const COMPARE_COLORS = ['#2E5090', '#10B981', '#F59E0B', '#EF4444'];

export default function ComparePanel() {
  const isOpen = useStore(state => state.isComparePanelOpen);
  const toggleComparePanel = useStore(state => state.toggleComparePanel);
  const compareBanks = useStore(state => state.compareBanks);
  const removeFromCompare = useStore(state => state.removeFromCompare);
  const clearCompare = useStore(state => state.clearCompare);

  if (!isOpen || compareBanks.length === 0) return null;

  const categories = Object.keys(DIGITAL_CATEGORY_LABELS) as DigitalCategory[];

  // Build radar data
  const radarData = categories.map(category => {
    const row: Record<string, unknown> = {
      category: DIGITAL_CATEGORY_LABELS[category].replace(' / ', '\n/'),
    };
    compareBanks.forEach((bank: Bank, i: number) => {
      const feature = bank.digitalFeatures.find(f => f.category === category);
      row[`bank${i}`] = feature ? MATURITY_POINTS[feature.maturityLevel] : 0;
    });
    return row;
  });

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg z-[1000] w-[700px] max-h-[60vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-esb-navy">Compare Banks ({compareBanks.length}/4)</h2>
        <div className="flex items-center gap-2">
          <button onClick={clearCompare} className="text-xs text-gray-500 hover:text-esb-red">
            Clear all
          </button>
          <button onClick={toggleComparePanel} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        {/* Bank cards row */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${compareBanks.length}, 1fr)` }}>
          {compareBanks.map((bank: Bank, i: number) => (
            <div key={bank.id} className="border rounded-lg p-3 relative" style={{ borderColor: COMPARE_COLORS[i] }}>
              <button
                onClick={() => removeFromCompare(bank.id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
              >
                <Trash2 className="w-3 h-3 text-gray-400" />
              </button>
              <div className="text-sm font-semibold text-esb-navy leading-tight">{bank.name}</div>
              <div className="text-xs text-gray-400">{bank.country}</div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: getScoreColor(bank.digitalScore) }}
                >
                  {bank.digitalScore}
                </div>
                <span className="text-xs" style={{ color: getScoreColor(bank.digitalScore) }}>
                  {getScoreTierLabel(bank.digitalScore)}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                <div>AUM: {formatAssets(bank.totalAssets)}</div>
                <div>Customers: {formatCustomers(bank.customerCount)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Radar overlay */}
        {compareBanks.length >= 2 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-esb-navy mb-2">Digital Capability Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 3]} tick={{ fontSize: 9 }} tickCount={4} />
                {compareBanks.map((_bank: Bank, i: number) => (
                  <Radar
                    key={i}
                    name={compareBanks[i].name}
                    dataKey={`bank${i}`}
                    stroke={COMPARE_COLORS[i]}
                    fill={COMPARE_COLORS[i]}
                    fillOpacity={0.1}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
