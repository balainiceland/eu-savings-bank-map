import { useState } from 'react';
import { X, Trash2, ExternalLink } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '../../hooks/useStore';
import { DIGITAL_CATEGORY_LABELS, MATURITY_LABELS, MATURITY_POINTS, formatAssets, formatCustomers, getScoreColor, getScoreTierLabel } from '../../types';
import type { Bank, DigitalCategory } from '../../types';

const COMPARE_COLORS = ['#21e9c5', '#00ffb2', '#fd88fd', '#e0b8ff'];

export default function ComparePanel() {
  const isOpen = useStore(state => state.isComparePanelOpen);
  const toggleComparePanel = useStore(state => state.toggleComparePanel);
  const compareBanks = useStore(state => state.compareBanks);
  const removeFromCompare = useStore(state => state.removeFromCompare);
  const clearCompare = useStore(state => state.clearCompare);
  const [selectedRadarIdx, setSelectedRadarIdx] = useState<number | null>(null);

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
      row[`level${i}`] = MATURITY_LABELS[feature?.maturityLevel || 'none'];
      row[`evidence${i}`] = feature?.evidenceUrl;
    });
    return row;
  });

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-indo border-2 border-black shadow-indo-md z-[1000] w-[700px] max-h-[60vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-black flex items-center justify-between shrink-0">
        <h2 className="font-bold text-black">Compare Banks ({compareBanks.length}/4)</h2>
        <div className="flex items-center gap-2">
          <button onClick={clearCompare} className="text-xs text-gray-500 hover:text-esb-red font-bold">
            Clear all
          </button>
          <button onClick={toggleComparePanel} className="p-1.5 hover:bg-esb-mint rounded-lg transition-colors" aria-label="Close compare">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        {/* Bank cards row */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${compareBanks.length}, 1fr)` }}>
          {compareBanks.map((bank: Bank, i: number) => (
            <div key={bank.id} className="border-2 border-black rounded-lg p-3 relative shadow-indo bg-white" style={{ borderLeftColor: COMPARE_COLORS[i], borderLeftWidth: 4 }}>
              <button
                onClick={() => removeFromCompare(bank.id)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
              >
                <Trash2 className="w-3 h-3 text-gray-400" />
              </button>
              <div className="text-sm font-bold text-black leading-tight">{bank.name}</div>
              <div className="text-xs text-gray-400">{bank.country}</div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-black"
                  style={{ backgroundColor: getScoreColor(bank.digitalScore) }}
                >
                  {bank.digitalScore}
                </div>
                <span className="text-xs font-bold" style={{ color: getScoreColor(bank.digitalScore) }}>
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
            <h3 className="text-sm font-bold text-black mb-2">Digital Capability Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid stroke="#000" strokeOpacity={0.3} />
                <PolarAngleAxis
                  dataKey="category"
                  tick={(props) => {
                    const { x, y, payload, textAnchor } = props as { x: number; y: number; payload: { index: number; value: string }; textAnchor: string };
                    const lines = String(payload.value).split('\n');
                    const anchor = textAnchor as 'start' | 'middle' | 'end';
                    return (
                      <text
                        x={x} y={y}
                        textAnchor={anchor}
                        fontSize={10}
                        fill={selectedRadarIdx === payload.index ? '#000' : '#6b7280'}
                        fontWeight={selectedRadarIdx === payload.index ? 'bold' : 'normal'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedRadarIdx(prev => prev === payload.index ? null : payload.index)}
                      >
                        {lines.map((line: string, i: number) => (
                          <tspan key={i} x={x} dy={i === 0 ? 0 : 12}>{line}</tspan>
                        ))}
                      </text>
                    );
                  }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 3]} tick={{ fontSize: 9 }} tickCount={4} />
                {compareBanks.map((_bank: Bank, i: number) => (
                  <Radar
                    key={i}
                    name={compareBanks[i].name}
                    dataKey={`bank${i}`}
                    stroke={COMPARE_COLORS[i]}
                    fill={COMPARE_COLORS[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
            {selectedRadarIdx !== null && radarData[selectedRadarIdx] && (
              <div className="mt-2 bg-esb-gold rounded-lg p-2.5 text-xs border-2 border-black">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-black">
                    {(radarData[selectedRadarIdx].category as string).replace('\n/', ' /')}
                  </span>
                  <button onClick={() => setSelectedRadarIdx(null)} className="p-0.5 hover:bg-gray-200 rounded">
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                {compareBanks.map((bank, i) => {
                  const levelLabel = radarData[selectedRadarIdx][`level${i}`] as string;
                  const evidenceUrl = radarData[selectedRadarIdx][`evidence${i}`] as string | undefined;
                  return (
                    <div key={bank.id} className="flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 border-2 border-black" style={{ backgroundColor: COMPARE_COLORS[i] }} />
                      <span className="text-black font-medium">{bank.name}:</span>
                      <span className="text-gray-500">{levelLabel}</span>
                      {evidenceUrl && (
                        <a
                          href={evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-esb-royal hover:text-black inline-flex items-center gap-0.5 font-bold"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
