import { JWTPayload } from 'jose';
import { z } from 'zod';

// Session Payload for JWT
export interface SessionPayload extends JWTPayload {
  userId: string;
  expiresAt: string;
}

// Signup Form Schema
export const SignupFormSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
});

// Signup Form State
export type SignupFormState =
  | {
      errors?: {
        userName?: string[];
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      message?: string;
    }
  | undefined;

// Login Form State
export type LoginFormState =
  | {
      errors?: {
        emailOrUsername?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ImageUploadProps {
  setSelectedImage: (image: string) => void;
  setLoading: (loading: boolean) => void;
}

export interface DateSelectProps {
  selectedDate: Date | null;
  handleDateChange: (date: Date) => void;
}

export interface ParticipantsSelectProps {
  participants: string[];
  selectedParticipants: string[];
  handleParticipantsChange: (participants: string[]) => void;
}

export interface WinnerSelectProps {
  participants: string[];
  handleWinnerChange: (winner: string) => void;
}

export interface SportSelectProps {
  sports: { value: string; label: string }[];
  selectedSport: string | null;
  handleSportChange: (value: string | null) => void;
}

export interface Game {
  _id: string;
  date: string;
  participants: string[];
  winner: string;
  sport: string;
}

export interface AppContextType {
  user: User | null;
  loading: boolean;
  users: User[] | null;
  sports: string[] | null;
  games: Game[] | null;
  addGame: (game: Game) => void;
  setUser: (user: User | null) => void;
  clearContext: () => void;
  refetchUser: () => void;
  setSports: (sports: string[] | null) => void;
  setUsers: (users: User[] | null) => void;
}
