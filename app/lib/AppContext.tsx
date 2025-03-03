'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './definitions';
import { AppContextType, Game } from './definitions';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const [sports, setSports] = useState<string[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);

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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
  
        const userArray = users.map((user: User) => ({
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
        }));
  
        setUsers(userArray);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return null;
    }
  }

  const fetchSports = async () => {
    try {
      const response = await fetch('/api/sports');
      if (response.ok) {
        const sports = await response.json();
  
        setSports(sports[0].sports);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
      return null;
    }
  }

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const games = await response.json();
  
        setGames(games);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      return null;
    }
  }

  // Initial fetch on app open
  useEffect(() => {
    fetchUser();
    fetchUsers();
    fetchSports();
    fetchGames();
  }, []);

  useEffect(() => {
    if (fetchTrigger === 0) return;
    fetchUser();
    fetchUsers();
  }, [fetchTrigger]);

  // Function to clear the context
  const clearContext = () => {
    setUser(null);
    setLoading(false);
  };

  const addGame = (newGame: Game) => {
    setGames((prevGames) => (prevGames ? [...prevGames, newGame] : [newGame]));
  };

  // Function to trigger refetch after login
  const refetchUser = () => {
    setFetchTrigger((prev) => prev + 1);
  };

  const value: AppContextType = 
    { user, 
      loading, 
      setUser, 
      clearContext, 
      refetchUser, 
      sports, 
      setSports, 
      users, 
      setUsers, 
      games, 
      addGame 
    };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}