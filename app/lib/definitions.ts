import { JWTPayload } from 'jose';
import { z } from 'zod';
import { DateTime } from 'luxon';

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
}

export interface DateSelectProps {
  selectedDate: DateTime | null;
  handleDateChange: (date: DateTime) => void;
}

export interface ParticipantsSelectProps {
  participants: string[];
  selectedParticipants: string[];
  userObjects: UserObject[];
  handleParticipantsChange: (participants: string[]) => void;
}

export interface WinnerSelectProps {
  participants: string[];
  userObjects: UserObject[];
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
  userObjects: UserObject[];
  addGame: (game: Game) => void;
  setUser: (user: User | null) => void;
  clearContext: () => void;
  refetchUser: () => void;
  setSports: (sports: string[] | null) => void;
  setUsers: (users: User[] | null) => void;
  fetchUserObjects: () => void;
}

export interface UserObject {
  userName: string;
  image: string;
  fullName: string;
  _id: string;
}

export interface ProfileCardProps {
  gameCount: number;
  winCount: number;
  lossCount: number;
  daysSinceLastGame: number | null;
  meanGameSize: number | null;
}

export interface PointsCardProps {
  pointsArray: number[];
  userObjects: UserObject[];
}

export interface CompareModalProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  onUserSelect: (user: User) => void;
}

export interface SparklineLengthModalProps {
  opened: boolean;
  maxLength: number;
  setDisplayMax: (display: boolean) => void;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  onLengthSelect: (length: number) => void;
}

export interface ExpectedWinPercentProps {
  meanGameSize: number;
  winPercent: number;
}

export interface LeaguatableProps {
  users: User[];
  games: Game[];
}

export interface OverallStatsProps {
  games: Game[];
}

export interface SportCardProps {
  gameNum: number;
  sport: string;
  width?: string;
  minWidth?: string;
}

export interface PersonCardProps {
  userObjects: UserObject[];
  games: Game[];
}

export interface AccordionLabelProps {
  label: string;
  image: string;
  description: string;
}