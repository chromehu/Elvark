'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'student' | 'instructor' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Get stable client instance
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Profile fetch error:', error);
        }
        return;
      }

      if (data) {
        setProfile(data as Profile);
      } else {
        // User exists in auth but no profile yet - this shouldn't happen but handle gracefully
        if (process.env.NODE_ENV === 'development') {
          console.warn('No profile found for authenticated user', uid);
        }
        setProfile(null);
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Unexpected error fetching profile:', err);
      }
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error && process.env.NODE_ENV === 'development') {
          console.error('Session retrieval error:', error);
        }

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Unexpected error during auth init:', err);
        }
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Sign out error:', err);
      }
      // Still clear local state even if sign out failed
      setUser(null);
      setProfile(null);
    }
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, profile, loading, signOut, refreshProfile }),
    [user, profile, loading, signOut, refreshProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
