import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';

const ALLOWED_ORIGINS = [process.env.NEXT_PUBLIC_API_URL || ''];

export async function GET(req: Request) {
  const origin = req.headers.get('origin') || '';
  const referer = req.headers.get('referer') || '';

  const isAllowed =
    ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed) || referer.startsWith(allowed));

  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const db = await connectDB();
    const users = await db.collection('users').find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
