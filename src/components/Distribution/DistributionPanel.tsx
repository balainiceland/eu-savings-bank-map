import { useState } from 'react';
import { X, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useStore, useDistributionData } from '../../hooks/useStore';
import { getScoreColor } from '../../types';

type Tab = 'histogram' | 'maturity';

export default function DistributionPanel() {
  const isOpen = useStore(state => state.isDistributionPanelOpen);
  const toggle = useStore(state => state.toggleDistributionPanel);
  const { scoreHistogram, maturityDistribution } = useDistributionData();
  const [tab, setTab] = useState<Tab>('histogram');

  if (!isOpen) return null;

  return (
    <div className="absolute top-4 right-4 bg-white rounded-indo border-2 border-black shadow-indo-md z-[1000] w-[480px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col panel-slide-right">
      {/* Header */}
      <div className="p-4 border-b-2 border-black flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-esb-royal" />
          <h2 className="font-bold text-black">Distribution Charts</h2>
        </div>
        <button onClick={toggle} className="p-1.5 hover:bg-esb-mint rounded-lg transition-colors" aria-label="Close distribution">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-black shrink-0">
        <button
          onClick={() => setTab('histogram')}
          className={`flex-1 py-2 text-sm font-bold transition-colors ${tab === 'histogram' ? 'bg-esb-royal text-white' : 'bg-white text-black hover:bg-esb-mint'}`}
        >
          Score Histogram
        </button>
        <button
          onClick={() => setTab('maturity')}
          className={`flex-1 py-2 text-sm font-bold transition-colors border-l-2 border-black ${tab === 'maturity' ? 'bg-esb-royal text-white' : 'bg-white text-black hover:bg-esb-mint'}`}
        >
          Feature Maturity
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 p-4">
        {tab === 'histogram' ? (
          <div>
            <p className="text-xs text-gray-500 mb-3">Distribution of digital scores across all banks</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={scoreHistogram} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis dataKey="bin" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number | undefined) => [`${value ?? 0} banks`, 'Count']}
                  contentStyle={{ fontSize: 12, border: '2px solid #000', borderRadius: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} stroke="#000" strokeWidth={1}>
                  {scoreHistogram.map((entry, index) => (
                    <Cell key={index} fill={getScoreColor(entry.midpoint)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-500 mb-3">Maturity levels across digital capability categories</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={maturityDistribution} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 9 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, border: '2px solid #000', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="none" name="None" stackId="a" fill="#e0b8ff" stroke="#000" strokeWidth={1} />
                <Bar dataKey="basic" name="Basic" stackId="a" fill="#fd88fd" stroke="#000" strokeWidth={1} />
                <Bar dataKey="intermediate" name="Intermediate" stackId="a" fill="#21e9c5" stroke="#000" strokeWidth={1} />
                <Bar dataKey="advanced" name="Advanced" stackId="a" fill="#00ffb2" stroke="#000" strokeWidth={1} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
