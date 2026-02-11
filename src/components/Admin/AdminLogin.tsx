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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Landmark className="w-12 h-12 text-esb-gold mx-auto mb-4" />
          <h1 className="text-xl font-bold text-esb-navy mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables to enable admin features.
          </p>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Mail className="w-12 h-12 text-esb-blue mx-auto mb-4" />
          <h1 className="text-xl font-bold text-esb-navy mb-2">Check your email</h1>
          <p className="text-gray-500 text-sm">
            We sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Landmark className="w-12 h-12 text-esb-gold mx-auto mb-3" />
          <h1 className="text-xl font-bold text-esb-navy">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">European Savings Bank Map</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-esb-blue/30 focus:border-esb-blue"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-2.5 bg-esb-royal text-white rounded-lg font-medium hover:bg-esb-navy transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
