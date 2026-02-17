import { create } from 'zustand';
import { supabase, isSupabaseConfigured, recordAuthorizedUser } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  initialize: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        set({ isLoading: false });
        return;
      }

      if (session?.user) {
        await recordAuthorizedUser(session.user.email || '');
        set({ user: session.user, session, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          await recordAuthorizedUser(session.user.email || '');
          set({ user: session.user, session, isAuthenticated: true });
        } else {
          set({ user: null, session: null, isAuthenticated: false });
        }
      });
    } catch {
      set({ isLoading: false });
    }
  },

  sendMagicLink: async (email: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      console.log('Demo mode - Magic link requested for:', email);
      return { success: true };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  },

  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    set({ user: null, session: null, isAuthenticated: false });
  },
}));
