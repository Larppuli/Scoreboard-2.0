import { NextRequest, NextResponse } from 'next/server';
import { signup } from '@/app/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const response = await signup({}, formData);

    if (response.errors) {
      console.log(response.errors);
      return NextResponse.json({ errors: response.errors }, { status: 400 });
    }

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}