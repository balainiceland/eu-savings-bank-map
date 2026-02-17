import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Database row types (snake_case from Supabase)
export interface BankFromDB {
  id: string;
  name: string;
  country: string;
  country_code: string;
  city?: string;
  address?: string;
  latitude: number;
  longitude: number;
  parent_group?: string;
  website?: string;
  founded_year?: number;
  total_assets?: number;
  customer_count?: number;
  deposit_volume?: number;
  loan_volume?: number;
  employee_count?: number;
  branch_count?: number;
  reporting_year?: number;
  digital_score: number;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
  digital_features: DigitalFeatureFromDB[];
}

export interface DigitalFeatureFromDB {
  id: string;
  bank_id: string;
  category: string;
  present: boolean;
  maturity_level: string;
  evidence_url?: string;
}

// Insert types
export interface BankInsert {
  name: string;
  country: string;
  country_code: string;
  city?: string;
  address?: string;
  latitude: number;
  longitude: number;
  parent_group?: string;
  website?: string;
  founded_year?: number;
  total_assets?: number;
  customer_count?: number;
  deposit_volume?: number;
  loan_volume?: number;
  employee_count?: number;
  branch_count?: number;
  reporting_year?: number;
  digital_score: number;
  status: 'draft' | 'published';
  featured: boolean;
}

export interface DigitalFeatureInsert {
  bank_id: string;
  category: string;
  present: boolean;
  maturity_level: string;
  evidence_url?: string;
}

// ==================== PUBLIC FUNCTIONS ====================

export async function fetchPublishedBanks(): Promise<{
  success: boolean;
  banks: BankFromDB[];
  error?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, banks: [], error: 'Supabase not configured' };
  }

  try {
    const { data: banks, error: banksError } = await supabase
      .from('banks')
      .select('*')
      .eq('status', 'published')
      .order('name');

    if (banksError) throw banksError;
    if (!banks || banks.length === 0) {
      return { success: true, banks: [] };
    }

    const banksWithFeatures = await attachFeatures(supabase, banks);

    return { success: true, banks: banksWithFeatures };
  } catch (error) {
    console.error('Error fetching banks:', error);
    return {
      success: false,
      banks: [],
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

// Fetch digital_features in batches to avoid Supabase's 1000-row default limit
// (392 banks × 5 features = 1960 rows)
async function attachFeatures(client: SupabaseClient, banks: BankFromDB[]): Promise<BankFromDB[]> {
  const bankIds = banks.map((b: BankFromDB) => b.id);
  // Supabase server-side max is 1000 rows; .limit() can't exceed it.
  // 100 banks × 5 features = 500 rows per batch (safely under 1000).
  const BATCH = 100;
  let allFeatures: DigitalFeatureFromDB[] = [];
  for (let i = 0; i < bankIds.length; i += BATCH) {
    const batch = bankIds.slice(i, i + BATCH);
    const { data: features, error } = await client
      .from('digital_features')
      .select('*')
      .in('bank_id', batch);
    if (error) throw error;
    allFeatures = allFeatures.concat(features || []);
  }
  return banks.map((bank: BankFromDB) => ({
    ...bank,
    digital_features: allFeatures.filter((f: DigitalFeatureFromDB) => f.bank_id === bank.id),
  }));
}

// ==================== ADMIN FUNCTIONS ====================

export async function fetchBanksByStatus(status?: 'draft' | 'published'): Promise<{
  success: boolean;
  banks: BankFromDB[];
  error?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, banks: [], error: 'Supabase not configured' };
  }

  try {
    let query = supabase.from('banks').select('*');
    if (status) {
      query = query.eq('status', status);
    }
    const { data: banks, error: banksError } = await query.order('created_at', { ascending: false });

    if (banksError) throw banksError;
    if (!banks || banks.length === 0) {
      return { success: true, banks: [] };
    }

    const banksWithFeatures = await attachFeatures(supabase, banks);

    return { success: true, banks: banksWithFeatures };
  } catch (error) {
    console.error('Error fetching banks:', error);
    return {
      success: false,
      banks: [],
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export async function createBank(
  bank: BankInsert,
  features: Omit<DigitalFeatureInsert, 'bank_id'>[],
): Promise<{ success: boolean; error?: string; bankId?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    console.log('Demo mode - Bank creation:', { bank, features });
    return { success: true, bankId: 'demo-' + Date.now() };
  }

  try {
    const { data: bankData, error: bankError } = await supabase
      .from('banks')
      .insert(bank)
      .select('id')
      .single();

    if (bankError) throw bankError;

    const bankId = bankData.id;

    if (features.length > 0) {
      const featuresWithId = features.map(f => ({ ...f, bank_id: bankId }));
      const { error: featureError } = await supabase
        .from('digital_features')
        .insert(featuresWithId);
      if (featureError) throw featureError;
    }

    return { success: true, bankId };
  } catch (error) {
    console.error('Error creating bank:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export async function updateBank(
  bankId: string,
  data: Partial<BankInsert>,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { data: updated, error } = await supabase
      .from('banks')
      .update(data)
      .eq('id', bankId)
      .select('id');

    if (error) throw error;
    if (!updated || updated.length === 0) {
      return { success: false, error: 'Update blocked by permissions.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating bank:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export async function updateBankStatus(
  bankId: string,
  status: 'draft' | 'published',
): Promise<{ success: boolean; error?: string }> {
  return updateBank(bankId, { status } as Partial<BankInsert>);
}

export async function saveDigitalFeatures(
  bankId: string,
  features: Omit<DigitalFeatureInsert, 'bank_id'>[],
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Delete existing features
    const { error: deleteError } = await supabase
      .from('digital_features')
      .delete()
      .eq('bank_id', bankId);
    if (deleteError) throw deleteError;

    // Insert new features
    if (features.length > 0) {
      const rows = features.map(f => ({ ...f, bank_id: bankId }));
      const { error: insertError } = await supabase
        .from('digital_features')
        .insert(rows);
      if (insertError) throw insertError;
    }

    // Recalculate digital score
    const points: Record<string, number> = { none: 0, basic: 1, intermediate: 2, advanced: 3 };
    const total = features.reduce((sum, f) => sum + (points[f.maturity_level] || 0), 0);
    const score = Math.round((total / 15) * 100);

    await supabase
      .from('banks')
      .update({ digital_score: score })
      .eq('id', bankId);

    return { success: true };
  } catch (error) {
    console.error('Error saving digital features:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export async function deleteBank(bankId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    await supabase.from('digital_features').delete().eq('bank_id', bankId);
    const { error } = await supabase.from('banks').delete().eq('id', bankId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting bank:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export async function toggleFeatured(bankId: string, featured: boolean): Promise<{ success: boolean; error?: string }> {
  return updateBank(bankId, { featured } as Partial<BankInsert>);
}

// ==================== ADMIN AUTH ====================

export async function fetchAdminUsers(): Promise<{
  success: boolean;
  admins: { id: string; email: string; created_at: string }[];
  error?: string;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, admins: [], error: 'Supabase not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { success: true, admins: data || [] };
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return { success: false, admins: [], error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export async function addAdminUser(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('admin_users')
      .insert({ email: email.toLowerCase().trim() });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error adding admin user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

export async function removeAdminUser(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('email', email.toLowerCase().trim());
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing admin user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' };
  }
}

// Record authorized user (upsert on email)
export async function recordAuthorizedUser(email: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('authorized_users').upsert(
    { email: email.toLowerCase(), last_seen_at: new Date().toISOString() },
    { onConflict: 'email' }
  );
}

export { supabase };
