'use client';

import type { User as AppUser } from '@/lib/data';
import { users as mockUsers } from '@/lib/data';
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

// Combines Supabase user data with our app's mock role data
const processUser = (user: SupabaseUser | null): AppUser | null => {
  if (!user) return null;
  // In a real app, the 'role' would likely come from your own 'profiles' table in Supabase.
  // Here, we'll find the mock user to get their role for demonstration purposes.
  const mockUser = mockUsers.find(u => u.email.toLowerCase() === user.email?.toLowerCase());
  return {
    id: user.id,
    email: user.email!,
    name: user.user_metadata.name || user.email!,
    role: mockUser?.role || 'customer', // Default to 'customer' if not found
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
      setUser(processUser(session?.user ?? null));
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(processUser(session?.user ?? null));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        const appUser = processUser(data.user);
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
    setUser(null);
    router.push('/login');
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
