import { useState } from 'react';
import { X, ExternalLink, GitCompareArrows, Building2, Users, Coins, Calendar } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../../hooks/useStore';
import { DIGITAL_CATEGORY_LABELS, MATURITY_LABELS, MATURITY_POINTS, formatAssets, formatCustomers } from '../../types';
import type { DigitalCategory } from '../../types';
import DigitalBadge from './DigitalBadge';

export default function BankDetail() {
  const selectedBank = useStore(state => state.selectedBank);
  const isOpen = useStore(state => state.isDetailPanelOpen);
  const closeDetailPanel = useStore(state => state.closeDetailPanel);
  const addToCompare = useStore(state => state.addToCompare);
  const compareBanks = useStore(state => state.compareBanks);

  const [selectedRadarIdx, setSelectedRadarIdx] = useState<number | null>(null);

  if (!isOpen || !selectedBank) return null;

  const bank = selectedBank;
  const isInCompare = compareBanks.some(b => b.id === bank.id);

  // Prepare radar chart data
  const radarData = (Object.keys(DIGITAL_CATEGORY_LABELS) as DigitalCategory[]).map(category => {
    const feature = bank.digitalFeatures.find(f => f.category === category);
    const level = feature?.maturityLevel || 'none';
    const points = feature ? MATURITY_POINTS[feature.maturityLevel] : 0;
    return {
      category: DIGITAL_CATEGORY_LABELS[category].replace(' / ', '\n/'),
      score: points,
      fullMark: 3,
      levelLabel: MATURITY_LABELS[level],
      evidenceUrl: feature?.evidenceUrl,
    };
  });

  return (
    <div className="absolute top-4 right-4 bg-white rounded-indo border-2 border-black shadow-indo-md z-[1000] w-96 max-h-[calc(100vh-120px)] overflow-y-auto panel-slide-right">
      {/* Header */}
      <div className="p-4 border-b-2 border-black">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="font-bold text-black text-lg leading-tight">{bank.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {bank.city ? `${bank.city}, ` : ''}{bank.country}
            </p>
            {bank.parentGroup && (
              <p className="text-xs text-gray-400 mt-0.5">{bank.parentGroup}</p>
            )}
          </div>
          <button onClick={closeDetailPanel} className="p-1.5 hover:bg-esb-mint rounded-lg transition-colors" aria-label="Close details">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg border-2 border-black"
            style={{ backgroundColor: `${getScoreColorImport(bank.digitalScore)}` }}
          >
            {bank.digitalScore}
          </div>
          <DigitalBadge score={bank.digitalScore} size="md" />
          {!isInCompare && compareBanks.length < 4 && (
            <button
              onClick={() => addToCompare(bank)}
              className="ml-auto p-2 hover:bg-esb-mint rounded-lg text-esb-royal transition-colors"
              title="Add to compare"
            >
              <GitCompareArrows className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-4 border-b-2 border-black">
        <h3 className="text-sm font-bold text-black mb-2">Digital Capabilities</h3>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
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
            <Radar
              name="Score"
              dataKey="score"
              stroke="#000"
              fill="#21e9c5"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
        {selectedRadarIdx !== null && radarData[selectedRadarIdx] && (
          <div className="mt-2 bg-esb-mint rounded-lg p-2 text-xs border-2 border-black flex items-center justify-between">
            <div>
              <span className="font-bold text-black">{radarData[selectedRadarIdx].category.replace('\n/', ' /')}</span>
              <span className="text-gray-500 ml-2">{radarData[selectedRadarIdx].levelLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              {radarData[selectedRadarIdx].evidenceUrl && (
                <a
                  href={radarData[selectedRadarIdx].evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-esb-royal hover:text-black inline-flex items-center gap-1 font-bold underline"
                >
                  Evidence <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button onClick={() => setSelectedRadarIdx(null)} className="p-0.5 hover:bg-gray-200 rounded">
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Digital Features Detail */}
      <div className="p-4 border-b-2 border-black">
        <h3 className="text-sm font-bold text-black mb-2">Feature Breakdown</h3>
        <div className="space-y-2">
          {(Object.keys(DIGITAL_CATEGORY_LABELS) as DigitalCategory[]).map(category => {
            const feature = bank.digitalFeatures.find(f => f.category === category);
            const level = feature?.maturityLevel || 'none';
            const points = MATURITY_POINTS[level];

            return (
              <div key={category} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{DIGITAL_CATEGORY_LABELS[category]}</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm border-2 border-black"
                        style={{
                          backgroundColor: i <= points ? '#21e9c5' : '#e5e7eb',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">{MATURITY_LABELS[level]}</span>
                  {feature?.evidenceUrl ? (
                    <a
                      href={feature.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View evidence"
                      className="text-esb-royal hover:text-black transition-colors font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="w-3.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="p-4 border-b-2 border-black">
        <h3 className="text-sm font-bold text-black mb-2">Financial Overview</h3>
        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={<Coins className="w-4 h-4" />} label="Total Assets" value={formatAssets(bank.totalAssets)} />
          <MetricCard icon={<Users className="w-4 h-4" />} label="Customers" value={formatCustomers(bank.customerCount)} />
          <MetricCard icon={<Building2 className="w-4 h-4" />} label="Branches" value={bank.branchCount?.toLocaleString() || 'N/A'} />
          <MetricCard icon={<Users className="w-4 h-4" />} label="Employees" value={bank.employeeCount?.toLocaleString() || 'N/A'} />
          <MetricCard icon={<Coins className="w-4 h-4" />} label="Deposits" value={formatAssets(bank.depositVolume)} />
          <MetricCard icon={<Coins className="w-4 h-4" />} label="Loans" value={formatAssets(bank.loanVolume)} />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between text-sm">
        {bank.foundedYear && (
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>Est. {bank.foundedYear}</span>
          </div>
        )}
        {bank.website && (
          <a
            href={bank.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-esb-royal hover:text-black font-bold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Website
          </a>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-esb-mint rounded-lg p-2.5 border-2 border-black shadow-indo">
      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-bold text-black text-sm">{value}</div>
    </div>
  );
}

function getScoreColorImport(score: number): string {
  if (score >= 80) return '#00ffb2';
  if (score >= 60) return '#21e9c5';
  if (score >= 40) return '#fd88fd';
  return '#e0b8ff';
}
