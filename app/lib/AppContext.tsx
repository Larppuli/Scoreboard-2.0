'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './definitions';
import { AppContextType } from './definitions';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);

  // Fetch user function
  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/me', { credentials: 'include' });
      if (response.ok) {
        const userData: User = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on app open
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (fetchTrigger === 0) return;
    fetchUser();
  }, [fetchTrigger]);

  // Function to clear the context
  const clearContext = () => {
    setUser(null);
    setLoading(false);
  };

  // Function to trigger refetch after login
  const refetchUser = () => {
    setFetchTrigger((prev) => prev + 1);
  };

  const value: AppContextType = { user, loading, setUser, clearContext, refetchUser };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}