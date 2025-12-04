'use client';

import type { User as AppUser } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password?: string) => Promise<AppUser | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Fetches app-specific user profile from your 'profiles' table in Supabase
const getAppUserProfile = async (userId: string): Promise<{ name: string; role: AppUser['role'] } | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data as { name: string; role: AppUser['role'] };
};


// Combines Supabase user data with our app's profile data
const processUser = async (user: SupabaseUser | null): Promise<AppUser | null> => {
  if (!user) return null;
  
  const profile = await getAppUserProfile(user.id);

  return {
    id: user.id,
    email: user.email!,
    name: profile?.name || user.email!,
    role: profile?.role || 'customer', // Default to 'customer' if profile is missing
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const appUser = await processUser(session?.user ?? null);
      setUser(appUser);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const appUser = await processUser(session?.user ?? null);
        setUser(appUser);
        // If the user logs out, session is null, and we should redirect.
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
        const appUser = await processUser(data.user);
        setUser(appUser);
        if (appUser) {
          router.push(`/${appUser.role}/dashboard`);
        }
        return appUser;
    }

    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); // This will trigger the onAuthStateChange listener
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
