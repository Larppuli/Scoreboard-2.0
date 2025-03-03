import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { decrypt } from '@/app/lib/session';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export async function GET(req: NextRequest) {
  try {
    // Read session from cookies
    const session = req.cookies.get('session')?.value;
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Decrypt session and get userId
    const payload = await decrypt(session);
    if (!payload?.userId) {
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
    }

    // Fetch user from MongoDB
    await client.connect();
    const db = client.db('Poikainscore');
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne(
      { _id: new ObjectId(payload.userId as string) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  } finally {
    await client.close();
  }
}
