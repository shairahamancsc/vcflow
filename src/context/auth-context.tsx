'use client';

import type { User as AppUser } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password?: string) => Promise<AppUser | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getAppUserProfile = async (userId: string): Promise<{ name: string; role: AppUser['role'] } | null> => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as { name: string; role: AppUser['role'] } | null;
};

const processUser = async (user: SupabaseUser | null): Promise<AppUser | null> => {
  if (!user) return null;
  const supabase = getSupabase();
  
  let profile = await getAppUserProfile(user.id);

  if (!profile) {
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata.name || user.email, 
        role: 'customer',
      })
      .select('name, role')
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    profile = newProfile;
  }

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || user.email!,
    role: profile?.role || 'customer',
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const supabase = getSupabase();
    const processSession = async (session: Session | null) => {
        const appUser = await processUser(session?.user ?? null);
        setUser(appUser);
        setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
        processSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await processSession(session);
        if (!session) {
            router.push('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isSplashPage = pathname === '/';

    if (!user && !isAuthPage && !isSplashPage) {
      router.push('/login');
    } else if (user && (isAuthPage || isSplashPage)) {
      router.push(`/${user.role}/dashboard`);
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password?: string): Promise<AppUser | null> => {
    const supabase = getSupabase();
     if (!password) {
      console.error("Password is required for login.");
      return null;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Supabase login error:', error.message);
        return null;
    }
    
    if (data.user) {
        return await processUser(data.user);
    }
    
    return null;
  };

  const logout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
