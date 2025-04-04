// Minimal mock for auth and data fetching
export const mockSupabase = {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: { user: { id: 'mock-user' } } }),
      signOut: () => Promise.resolve()
    },
    from: () => ({
      select: () => Promise.resolve({ data: [] }),
      insert: () => Promise.resolve()
    })
  };
  
  // Replace all Supabase imports with:
  // import { mockSupabase as supabase } from './lib/mockSupabase';