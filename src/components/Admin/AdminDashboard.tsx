import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Search, Edit2, Trash2, Eye, Star, StarOff, LogOut, Settings, Landmark } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { fetchBanksByStatus, updateBankStatus, deleteBank as deleteBankApi, toggleFeatured, createBank as createBankApi, updateBank as updateBankApi, saveDigitalFeatures } from '../../lib/supabase';
import type { BankFromDB } from '../../lib/supabase';
import { getScoreColor, formatAssets, formatCustomers, getScoreTierLabel } from '../../types';
import type { DigitalCategory, MaturityLevel } from '../../types';
import BankEditor, { type BankEditorData } from './BankEditor';
import AdminSettings from './AdminSettings';

type Tab = 'draft' | 'published' | 'all' | 'settings';

export default function AdminDashboard() {
  const signOut = useAdmin(state => state.signOut);
  const user = useAdmin(state => state.user);

  const [tab, setTab] = useState<Tab>('published');
  const [banks, setBanks] = useState<BankFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBank, setEditingBank] = useState<BankFromDB | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadBanks = useCallback(async () => {
    setLoading(true);
    const status = tab === 'all' || tab === 'settings' ? undefined : tab as 'draft' | 'published';
    const result = await fetchBanksByStatus(status);
    if (result.success) setBanks(result.banks);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    if (tab !== 'settings') loadBanks();
  }, [tab, loadBanks]);

  const handlePublish = async (bankId: string) => {
    const result = await updateBankStatus(bankId, 'published');
    if (result.success) loadBanks();
  };

  const handleUnpublish = async (bankId: string) => {
    const result = await updateBankStatus(bankId, 'draft');
    if (result.success) loadBanks();
  };

  const handleDelete = async (bankId: string) => {
    if (!confirm('Are you sure you want to delete this bank?')) return;
    const result = await deleteBankApi(bankId);
    if (result.success) loadBanks();
  };

  const handleToggleFeatured = async (bankId: string, current: boolean) => {
    const result = await toggleFeatured(bankId, !current);
    if (result.success) loadBanks();
  };

  const handleSave = async (data: BankEditorData) => {
    const bankInsert = {
      name: data.name,
      country: data.country,
      country_code: data.countryCode,
      city: data.city || undefined,
      address: data.address || undefined,
      latitude: data.latitude,
      longitude: data.longitude,
      parent_group: data.parentGroup || undefined,
      website: data.website || undefined,
      founded_year: data.foundedYear,
      total_assets: data.totalAssets,
      customer_count: data.customerCount,
      deposit_volume: data.depositVolume,
      loan_volume: data.loanVolume,
      employee_count: data.employeeCount,
      branch_count: data.branchCount,
      reporting_year: data.reportingYear,
      digital_score: data.digitalScore,
      status: data.status,
      featured: data.featured,
    };

    const features = data.digitalFeatures.map(f => ({
      category: f.category,
      present: f.present,
      maturity_level: f.maturityLevel,
    }));

    if (editingBank) {
      const result = await updateBankApi(editingBank.id, bankInsert);
      if (result.success) {
        await saveDigitalFeatures(editingBank.id, features);
        setEditingBank(null);
        loadBanks();
      }
    } else {
      const result = await createBankApi(bankInsert, features);
      if (result.success) {
        setIsCreating(false);
        loadBanks();
      }
    }
  };

  const filteredBanks = banks.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.city?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const draftCount = banks.filter(b => b.status === 'draft').length;
  const publishedCount = banks.filter(b => b.status === 'published').length;

  // Convert BankFromDB to Bank-like shape for editor
  const bankForEditor = editingBank ? {
    id: editingBank.id,
    name: editingBank.name,
    country: editingBank.country,
    countryCode: editingBank.country_code,
    city: editingBank.city,
    address: editingBank.address,
    latitude: editingBank.latitude,
    longitude: editingBank.longitude,
    parentGroup: editingBank.parent_group,
    website: editingBank.website,
    foundedYear: editingBank.founded_year,
    totalAssets: editingBank.total_assets,
    customerCount: editingBank.customer_count,
    depositVolume: editingBank.deposit_volume,
    loanVolume: editingBank.loan_volume,
    employeeCount: editingBank.employee_count,
    branchCount: editingBank.branch_count,
    reportingYear: editingBank.reporting_year,
    digitalScore: editingBank.digital_score,
    digitalFeatures: (editingBank.digital_features || []).map(f => ({
      id: f.id,
      bankId: f.bank_id,
      category: f.category as DigitalCategory,
      present: f.present,
      maturityLevel: f.maturity_level as MaturityLevel,
    })),
    status: editingBank.status as 'draft' | 'published',
    featured: editingBank.featured,
    createdAt: editingBank.created_at,
    updatedAt: editingBank.updated_at,
  } : undefined;

  if (editingBank || isCreating) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <BankEditor
            bank={bankForEditor}
            onSave={handleSave}
            onCancel={() => { setEditingBank(null); setIsCreating(false); }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="bg-white text-black px-6 py-3 flex items-center justify-between border-b-2 border-black">
        <div className="flex items-center gap-3">
          <Landmark className="w-6 h-6 text-esb-royal" />
          <div>
            <h1 className="font-bold">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">European Savings Bank Map</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
            <Eye className="w-4 h-4" /> View Map
          </a>
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button onClick={signOut} className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-esb-mint border-2 border-black rounded-lg p-4 shadow-indo">
            <div className="text-2xl font-bold text-black">{banks.length}</div>
            <div className="text-sm text-gray-600">Total Banks</div>
          </div>
          <div className="bg-esb-gold border-2 border-black rounded-lg p-4 shadow-indo">
            <div className="text-2xl font-bold text-black">{publishedCount}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-esb-pink border-2 border-black rounded-lg p-4 shadow-indo">
            <div className="text-2xl font-bold text-black">{draftCount}</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
        </div>

        {/* Tabs + Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-white rounded-lg p-1 border-2 border-black">
            {(['published', 'draft', 'all', 'settings'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-sm rounded-md font-bold transition-colors ${
                  tab === t ? 'bg-esb-royal text-black' : 'text-gray-600 hover:bg-esb-mint/30'
                }`}
              >
                {t === 'settings' ? <Settings className="w-4 h-4" /> : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadBanks} className="p-2 hover:bg-esb-mint/30 rounded-lg border-2 border-black" title="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="indo-btn indo-btn-teal text-sm"
            >
              <Plus className="w-4 h-4" /> Add Bank
            </button>
          </div>
        </div>

        {tab === 'settings' ? (
          <AdminSettings />
        ) : (
          <>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search banks..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-esb-royal/30"
              />
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-3 border-esb-royal border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            ) : filteredBanks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No banks found</div>
            ) : (
              <div className="bg-white rounded-lg border-2 border-black shadow-indo overflow-hidden">
                <table className="w-full">
                  <thead className="bg-esb-gold">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Bank</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Score</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">AUM</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-black uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBanks.map(bank => (
                      <tr key={bank.id} className="hover:bg-esb-mint/20">
                        <td className="px-4 py-3">
                          <div className="font-bold text-sm text-black">{bank.name}</div>
                          <div className="text-xs text-gray-400">{bank.city ? `${bank.city}, ` : ''}{bank.country}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-black text-xs font-bold border-2 border-black"
                              style={{ backgroundColor: getScoreColor(bank.digital_score) }}
                            >
                              {bank.digital_score}
                            </div>
                            <span className="text-xs text-gray-500">{getScoreTierLabel(bank.digital_score)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatAssets(bank.total_assets)}
                          <div className="text-xs text-gray-400">{formatCustomers(bank.customer_count)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold border border-black ${
                            bank.status === 'published'
                              ? 'bg-esb-green text-black'
                              : 'bg-esb-amber text-black'
                          }`}>
                            {bank.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setEditingBank(bank)} className="p-1.5 hover:bg-esb-mint/30 rounded" title="Edit">
                              <Edit2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button onClick={() => handleToggleFeatured(bank.id, bank.featured)} className="p-1.5 hover:bg-esb-mint/30 rounded" title="Toggle featured">
                              {bank.featured ? <Star className="w-4 h-4 text-esb-royal fill-current" /> : <StarOff className="w-4 h-4 text-gray-300" />}
                            </button>
                            {bank.status === 'draft' ? (
                              <button onClick={() => handlePublish(bank.id)} className="px-2 py-1 text-xs bg-esb-green text-black border border-black rounded font-bold hover:opacity-80">
                                Publish
                              </button>
                            ) : (
                              <button onClick={() => handleUnpublish(bank.id)} className="px-2 py-1 text-xs bg-esb-amber text-black border border-black rounded font-bold hover:opacity-80">
                                Unpublish
                              </button>
                            )}
                            <button onClick={() => handleDelete(bank.id)} className="p-1.5 hover:bg-esb-red/30 rounded" title="Delete">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
