import { useState } from 'react';
import { X, ArrowUpDown, Trophy } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { getScoreColor, getScoreTierLabel, formatAssets, formatCustomers } from '../../types';
import type { Bank } from '../../types';

type SortField = 'digitalScore' | 'totalAssets' | 'customerCount';
type SortDir = 'asc' | 'desc';

export default function RankingsPanel() {
  const isOpen = useStore(state => state.isRankingsPanelOpen);
  const toggleRankingsPanel = useStore(state => state.toggleRankingsPanel);
  const banks = useStore(state => state.filteredBanks);
  const setSelectedBank = useStore(state => state.setSelectedBank);

  const [sortField, setSortField] = useState<SortField>('digitalScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  if (!isOpen) return null;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...banks].sort((a, b) => {
    const aVal = a[sortField] ?? 0;
    const bVal = b[sortField] ?? 0;
    return sortDir === 'desc' ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
  });

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-3 py-2 text-left text-xs font-bold text-black uppercase cursor-pointer hover:text-esb-royal select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-esb-royal' : 'text-gray-300'}`} />
      </div>
    </th>
  );

  return (
    <div className="absolute top-4 left-4 bg-white rounded-indo border-2 border-black shadow-indo-md z-[1000] w-[600px] max-h-[calc(100vh-120px)] overflow-hidden flex flex-col panel-slide-left">
      {/* Header */}
      <div className="p-4 border-b-2 border-black flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-esb-royal" />
          <h2 className="font-bold text-black">Rankings</h2>
          <span className="text-xs text-gray-400">({sorted.length} banks)</span>
        </div>
        <button onClick={toggleRankingsPanel} className="p-1.5 hover:bg-esb-mint/30 rounded-lg">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-y-auto flex-1">
        <table className="w-full">
          <thead className="bg-esb-gold sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-bold text-black uppercase w-8">#</th>
              <th className="px-3 py-2 text-left text-xs font-bold text-black uppercase">Bank</th>
              <SortHeader field="digitalScore" label="Score" />
              <SortHeader field="totalAssets" label="AUM" />
              <SortHeader field="customerCount" label="Customers" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((bank: Bank, index: number) => (
              <tr
                key={bank.id}
                className="hover:bg-esb-mint/30 cursor-pointer transition-colors"
                onClick={() => setSelectedBank(bank)}
              >
                <td className="px-3 py-2.5 text-sm text-gray-400 font-mono">{index + 1}</td>
                <td className="px-3 py-2.5">
                  <div className="text-sm font-medium text-black">{bank.name}</div>
                  <div className="text-xs text-gray-400">{bank.country}</div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-black"
                      style={{ backgroundColor: getScoreColor(bank.digitalScore) }}
                    >
                      {bank.digitalScore}
                    </div>
                    <span className="text-xs" style={{ color: getScoreColor(bank.digitalScore) }}>
                      {getScoreTierLabel(bank.digitalScore)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-600">{formatAssets(bank.totalAssets)}</td>
                <td className="px-3 py-2.5 text-sm text-gray-600">{formatCustomers(bank.customerCount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
