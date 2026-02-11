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

  if (!isOpen || !selectedBank) return null;

  const bank = selectedBank;
  const isInCompare = compareBanks.some(b => b.id === bank.id);

  // Prepare radar chart data
  const radarData = (Object.keys(DIGITAL_CATEGORY_LABELS) as DigitalCategory[]).map(category => {
    const feature = bank.digitalFeatures.find(f => f.category === category);
    const points = feature ? MATURITY_POINTS[feature.maturityLevel] : 0;
    return {
      category: DIGITAL_CATEGORY_LABELS[category].replace(' / ', '\n/'),
      score: points,
      fullMark: 3,
    };
  });

  return (
    <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg z-[1000] w-96 max-h-[calc(100vh-120px)] overflow-y-auto panel-slide-right">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="font-bold text-esb-navy text-lg leading-tight">{bank.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {bank.city ? `${bank.city}, ` : ''}{bank.country}
            </p>
            {bank.parentGroup && (
              <p className="text-xs text-gray-400 mt-0.5">{bank.parentGroup}</p>
            )}
          </div>
          <button onClick={closeDetailPanel} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: `${getScoreColorImport(bank.digitalScore)}` }}
          >
            {bank.digitalScore}
          </div>
          <DigitalBadge score={bank.digitalScore} size="md" />
          {!isInCompare && compareBanks.length < 4 && (
            <button
              onClick={() => addToCompare(bank)}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg text-esb-royal"
              title="Add to compare"
            >
              <GitCompareArrows className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-esb-navy mb-2">Digital Capabilities</h3>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: '#6b7280' }} />
            <PolarRadiusAxis angle={90} domain={[0, 3]} tick={{ fontSize: 9 }} tickCount={4} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#2E5090"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Digital Features Detail */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-esb-navy mb-2">Feature Breakdown</h3>
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
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: i <= points ? '#3B82F6' : '#e5e7eb',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">{MATURITY_LABELS[level]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-esb-navy mb-2">Financial Overview</h3>
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
            className="flex items-center gap-1 text-esb-royal hover:text-esb-blue"
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
    <div className="bg-gray-50 rounded-lg p-2.5">
      <div className="flex items-center gap-1.5 text-gray-400 mb-1">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-semibold text-esb-navy text-sm">{value}</div>
    </div>
  );
}

// Re-import needed since we can't use getScoreColor directly in JSX template literals easily
function getScoreColorImport(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#3B82F6';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
}
