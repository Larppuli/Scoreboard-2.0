import { createSession, deleteSession } from "@/app/lib/session";
import {
  SignupFormSchema,
  SignupFormState,
  LoginFormState,
} from "@/app/lib/definitions";
import { findUserByEmailOrUsername, createUser } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function signup(state: SignupFormState, formData: any) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    userName: formData.userName,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { userName, firstName, lastName, email, password, confirmPassword } =
    validatedFields.data;

  // Check if passwords match
  if (password !== confirmPassword) {
    return { errors: { confirmPassword: "Passwords do not match" } };
  }

  try {
    // Check if user already exists
    const existingUser = await findUserByEmailOrUsername(email, userName);
    if (existingUser) {
      return { errors: { email: "Email or username already in use" } };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await createUser({
      userName,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Create a session after signup
    await createSession(newUser._id.toString());

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { errors: { general: "Something went wrong, please try again." } };
  }
}

export async function login(state: LoginFormState, formData: any) {
  const { emailOrUsername, password } = formData;

  try {
    // Find the user by email or username
    const user = await findUserByEmailOrUsername(
      emailOrUsername,
      emailOrUsername
    );
    // If no user is found, return an error
    if (!user) {
      return { errors: { error: "Invalid email or username" } };
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { errors: { error: "Incorrect password" } };
    }

    // Create a session for the authenticated user
    await createSession(user._id.toString());

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { errors: { general: "Something went wrong, please try again." } };
  }
}

export async function logout() {
  await deleteSession();
  return { success: true };
}
