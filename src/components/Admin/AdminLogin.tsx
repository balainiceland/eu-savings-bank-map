import { useState } from 'react';
import { Mail, Landmark } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sendMagicLink = useAdmin(state => state.sendMagicLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await sendMagicLink(email);
    setLoading(false);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Failed to send magic link');
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-indo border-2 border-black shadow-indo-md p-8 max-w-md w-full text-center">
          <Landmark className="w-12 h-12 text-esb-royal mx-auto mb-4" />
          <h1 className="text-xl font-bold text-black mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable admin features.
          </p>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-esb-mint rounded-indo border-2 border-black shadow-indo-md p-8 max-w-md w-full text-center">
          <Mail className="w-12 h-12 text-black mx-auto mb-4" />
          <h1 className="text-xl font-bold text-black mb-2">Check your email</h1>
          <p className="text-gray-600 text-sm">
            We sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-indo border-2 border-black shadow-indo-md p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Landmark className="w-12 h-12 text-esb-royal mx-auto mb-3" />
          <h1 className="text-xl font-bold text-black">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">European Savings Bank Map</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2.5 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-esb-royal/30 focus:border-esb-royal"
            />
          </div>

          {error && (
            <div className="text-sm text-black bg-esb-red/30 border border-black px-3 py-2 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="indo-btn indo-btn-teal w-full justify-center py-2.5 text-sm disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
