import { useState, useEffect } from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import { fetchAdminUsers, addAdminUser, removeAdminUser } from '../../lib/supabase';

export default function AdminSettings() {
  const [admins, setAdmins] = useState<{ id: string; email: string; created_at: string }[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = async () => {
    setLoading(true);
    const result = await fetchAdminUsers();
    if (result.success) setAdmins(result.admins);
    else setError(result.error || 'Failed to load admins');
    setLoading(false);
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setError(null);
    const result = await addAdminUser(newEmail);
    if (result.success) {
      setNewEmail('');
      loadAdmins();
    } else {
      setError(result.error || 'Failed to add admin');
    }
  };

  const handleRemove = async (email: string) => {
    if (!confirm(`Remove ${email} as admin?`)) return;
    const result = await removeAdminUser(email);
    if (result.success) loadAdmins();
    else setError(result.error || 'Failed to remove admin');
  };

  return (
    <div className="bg-white rounded-lg border-2 border-black shadow-indo p-6">
      <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5" /> Admin Users
      </h2>

      {error && (
        <div className="mb-4 text-sm text-black bg-esb-red/30 border border-black px-3 py-2 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          placeholder="admin@example.com"
          className="flex-1 px-3 py-2 border-2 border-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-esb-royal/30"
        />
        <button type="submit" className="indo-btn indo-btn-teal text-sm">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : (
        <div className="space-y-2">
          {admins.map(admin => (
            <div key={admin.id} className="flex items-center justify-between bg-esb-mint/30 rounded-lg px-4 py-3 border border-black">
              <div>
                <div className="text-sm font-bold text-black">{admin.email}</div>
                <div className="text-xs text-gray-400">Added {new Date(admin.created_at).toLocaleDateString()}</div>
              </div>
              <button onClick={() => handleRemove(admin.email)} className="p-1.5 hover:bg-esb-red/30 rounded" title="Remove">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}
          {admins.length === 0 && (
            <p className="text-gray-500 text-sm">No admin users found.</p>
          )}
        </div>
      )}
    </div>
  );
}
