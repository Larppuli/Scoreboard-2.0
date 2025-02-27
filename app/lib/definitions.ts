import { z } from 'zod';
import { JWTPayload } from 'jose';

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