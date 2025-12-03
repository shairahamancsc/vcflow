'use client';

import type { User } from '@/lib/data';
import { users } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// This is a mock implementation. In a real app, you'd use a library like next-auth or manage sessions with tokens.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('vctechflow-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('vctechflow-user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isSplashPage = pathname === '/';

    if (!user && !isAuthPage && !isSplashPage) {
      router.push('/login');
    } else if (user && isAuthPage) {
      router.push(`/${user.role}/dashboard`);
    }
  }, [user, loading, pathname, router]);


  const login = async (email: string): Promise<User | null> => {
    // Mock API call to find user
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('vctechflow-user', JSON.stringify(foundUser));
      router.push(`/${foundUser.role}/dashboard`);
      return foundUser;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vctechflow-user');
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
