'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppContextType, Game, User, UserObject } from './definitions';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  const [sports, setSports] = useState<string[] | null>(null);
  const [users, setUsers] = useState<User[] | null>(null);
  const [games, setGames] = useState<Game[] | null>(null);
  const [userObjects, setUserObjects] = useState<UserObject[]>([]);

  const timestamp = new Date().getTime();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

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
          _id: user._id,
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
  };

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
  };

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        let games = await response.json();

        games.sort((a: Game, b: Game) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setGames(games);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      return null;
    }
  };

  const fetchUserObjects = async () => {
    if (!users || users.length === 0 || !cloudName) return;

    const defaultPfpUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v1741022251265/DefaultPFP`;

    const updatedUsers: UserObject[] = [];

    users.forEach((user) => {
      const primaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v${timestamp}/profilepictures/profile_picture_${user._id}`;

      updatedUsers.push( 
        {
        userName: user.userName,
        image: primaryUrl,
        fullName: `${user.firstName} ${user.lastName}`,
        _id: user._id,
        }
      )
    });

    const checkImageValidity = async (url: string): Promise<boolean> => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch {
        return false;
      }
    };

    const validatedUsers = await Promise.all(
      updatedUsers.map(async (data) => {
        const isValid = await checkImageValidity(data.image);
        return { 
          ...data,
          image: isValid ? data.image : defaultPfpUrl
        };
      })
    );
    setUserObjects(validatedUsers)
  };

  // Initial fetch on app open
  useEffect(() => {
    fetchUser();
    fetchUsers();
    fetchSports();
    fetchGames();
    fetchUserObjects();
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
    setGames((prevGames) => {
      const updatedGames = prevGames ? [...prevGames, newGame] : [newGame];

      return updatedGames.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  // Function to trigger refetch after login
  const refetchUser = () => {
    setFetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (users) {
      fetchUserObjects();
    }
  }, [users]);

  const value: AppContextType = {
    user,
    loading,
    setUser,
    clearContext,
    refetchUser,
    sports,
    setSports,
    users,
    setUsers,
    games,
    addGame,
    userObjects,
    fetchUserObjects,
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
