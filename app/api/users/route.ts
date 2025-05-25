import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

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

export async function PUT(req: Request) {
  try {
    const origin = req.headers.get('origin') || '';
    const referer = req.headers.get('referer') || '';

    const isAllowed = ALLOWED_ORIGINS.some((allowed) =>
      origin.startsWith(allowed) || referer.startsWith(allowed)
    );

    if (!isAllowed) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
    }

    const db = await connectDB();
    const userData = await req.json();

    const { id, value, attribute } = userData;

    if (!id || !attribute) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let newValue = value;

    if (attribute === 'password') {
      newValue = await bcrypt.hash(value, 10);
    }

    console.log('Updating user:', { id, attribute, newValue });

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { [attribute]: newValue } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: `${attribute} updated`, modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}