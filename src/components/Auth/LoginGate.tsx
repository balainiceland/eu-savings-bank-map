import { useEffect, useState } from 'react';
import { Landmark, Mail, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';

interface LoginGateProps {
  children: React.ReactNode;
}

export default function LoginGate({ children }: LoginGateProps) {
  const { isAuthenticated, isLoading, initialize, sendMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Skip gate in demo mode (no Supabase configured)
  if (!isSupabaseConfigured()) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-esb-royal animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);

    const result = await sendMagicLink(email.trim());

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Failed to send verification email');
    }
    setSending(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] p-8 w-full max-w-md text-center">
        <Landmark className="w-16 h-16 text-esb-royal mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-black mb-2">European Savings Bank Map</h1>
        <p className="text-gray-500 text-sm mb-8">
          Digital Competitiveness Rankings
        </p>

        {sent ? (
          <div className="space-y-4">
            <CheckCircle className="w-12 h-12 text-esb-green mx-auto" />
            <p className="text-black font-medium">Check your email</p>
            <p className="text-gray-500 text-sm">
              We sent a verification link to <strong className="text-black">{email}</strong>.
              Click the link to access the map.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="text-esb-royal hover:text-black text-sm transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-esb-royal focus:border-esb-royal"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={sending || !email.trim()}
              className="w-full py-3 bg-esb-royal text-white font-bold rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Verification Link'
              )}
            </button>

            <p className="text-gray-400 text-xs">
              We'll send you a magic link to verify your email and access the map.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
