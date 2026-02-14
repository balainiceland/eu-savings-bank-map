import { useState } from 'react';
import { X, Crosshair } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { useStore } from '../../hooks/useStore';
import { getScoreColor } from '../../types';
import type { Bank } from '../../types';

interface PresetView {
  label: string;
  xKey: keyof Bank;
  yKey: keyof Bank;
  xLabel: string;
  yLabel: string;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
}

const PRESETS: PresetView[] = [
  {
    label: 'Score vs Assets',
    xKey: 'totalAssets',
    yKey: 'digitalScore',
    xLabel: 'Total Assets (EUR M)',
    yLabel: 'Digital Score',
    xFormat: (v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}B` : `${v}M`}`,
  },
  {
    label: 'Score vs Employees',
    xKey: 'employeeCount',
    yKey: 'digitalScore',
    xLabel: 'Employee Count',
    yLabel: 'Digital Score',
  },
  {
    label: 'Deposits vs Loans',
    xKey: 'depositVolume',
    yKey: 'loanVolume',
    xLabel: 'Deposit Volume (EUR M)',
    yLabel: 'Loan Volume (EUR M)',
    xFormat: (v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}B` : `${v}M`}`,
    yFormat: (v) => `${v >= 1000 ? `${(v / 1000).toFixed(0)}B` : `${v}M`}`,
  },
  {
    label: 'Score vs Customers',
    xKey: 'customerCount',
    yKey: 'digitalScore',
    xLabel: 'Customer Count (K)',
    yLabel: 'Digital Score',
  },
];

interface ScatterPoint {
  x: number;
  y: number;
  bank: Bank;
}

export default function ScatterPanel() {
  const isOpen = useStore(state => state.isScatterPanelOpen);
  const toggle = useStore(state => state.toggleScatterPanel);
  const filteredBanks = useStore(state => state.filteredBanks);
  const setSelectedBank = useStore(state => state.setSelectedBank);
  const [presetIdx, setPresetIdx] = useState(0);

  if (!isOpen) return null;

  const preset = PRESETS[presetIdx];

  const data: ScatterPoint[] = filteredBanks
    .filter(b => {
      const xVal = b[preset.xKey];
      const yVal = b[preset.yKey];
      return xVal != null && yVal != null && typeof xVal === 'number' && typeof yVal === 'number';
    })
    .map(b => ({
      x: b[preset.xKey] as number,
      y: b[preset.yKey] as number,
      bank: b,
    }));

  const handleClick = (point: ScatterPoint) => {
    setSelectedBank(point.bank);
  };

  return (
    <div className="absolute top-4 left-4 bg-white rounded-indo border-2 border-black shadow-indo-md z-[1000] w-[520px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col panel-slide-left">
      {/* Header */}
      <div className="p-4 border-b-2 border-black flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-esb-royal" />
          <h2 className="font-bold text-black">Scatter Plots</h2>
        </div>
        <button onClick={toggle} className="p-1.5 hover:bg-esb-mint rounded-lg transition-colors" aria-label="Close scatter">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-4">
        {/* View selector */}
        <div className="flex items-center gap-2 mb-3">
          <label className="text-xs font-bold text-black">View:</label>
          <select
            value={presetIdx}
            onChange={(e) => setPresetIdx(Number(e.target.value))}
            className="flex-1 text-sm border-2 border-black rounded-lg px-2 py-1 bg-white font-medium"
          >
            {PRESETS.map((p, i) => (
              <option key={i} value={i}>{p.label}</option>
            ))}
          </select>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          {data.length} of {filteredBanks.length} banks (with data)
        </p>

        <ResponsiveContainer width="100%" height={340}>
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="x"
              type="number"
              name={preset.xLabel}
              tick={{ fontSize: 10 }}
              tickFormatter={preset.xFormat}
              label={{ value: preset.xLabel, position: 'insideBottom', offset: -5, fontSize: 11 }}
            />
            <YAxis
              dataKey="y"
              type="number"
              name={preset.yLabel}
              tick={{ fontSize: 10 }}
              tickFormatter={preset.yFormat}
              label={{ value: preset.yLabel, angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const point = payload[0].payload as ScatterPoint;
                return (
                  <div className="bg-white border-2 border-black rounded-indo p-2 shadow-indo text-xs">
                    <div className="font-bold text-black">{point.bank.name}</div>
                    <div className="text-gray-500">{point.bank.country}</div>
                    <div className="mt-1 space-y-0.5">
                      <div>{preset.xLabel}: {preset.xFormat ? preset.xFormat(point.x) : point.x.toLocaleString()}</div>
                      <div>{preset.yLabel}: {preset.yFormat ? preset.yFormat(point.y) : point.y.toLocaleString()}</div>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter data={data} onClick={handleClick} cursor="pointer" stroke="#000" strokeWidth={2}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getScoreColor(entry.bank.digitalScore)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
