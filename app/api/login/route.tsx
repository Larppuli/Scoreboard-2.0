import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/app/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const result = await login({}, formData);

    if (result.errors) {
      return NextResponse.json({ errors: result.errors }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Login successful' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { errors: { general: 'Something went wrong, please try again.' } },
      { status: 500 }
    );
  }
}