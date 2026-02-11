import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AdminState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAdminStatus: (email: string) => Promise<boolean>;
}

export const useAdmin = create<AdminState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAdmin: false,
  error: null,

  initialize: async () => {
    if (!isSupabaseConfigured() || !supabase) {
      set({ isLoading: false, error: 'Supabase not configured' });
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        set({ isLoading: false, error: error.message });
        return;
      }

      if (session?.user) {
        const isAdmin = await get().checkAdminStatus(session.user.email || '');
        set({ user: session.user, session, isAdmin, isLoading: false, error: null });
      } else {
        set({ isLoading: false });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const isAdmin = await get().checkAdminStatus(session.user.email || '');
          set({ user: session.user, session, isAdmin });
        } else {
          set({ user: null, session: null, isAdmin: false });
        }
      });
    } catch {
      set({ isLoading: false, error: 'Failed to initialize auth' });
    }
  },

  sendMagicLink: async (email: string) => {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const isAdmin = await get().checkAdminStatus(email);
      if (!isAdmin) {
        return { success: false, error: 'This email is not authorized for admin access' };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to send magic link' };
    }
  },

  signOut: async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    set({ user: null, session: null, isAdmin: false });
  },

  checkAdminStatus: async (email: string) => {
    if (!supabase || !email) return false;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();
      return !error && !!data;
    } catch {
      return false;
    }
  },
}));
