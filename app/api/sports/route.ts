import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';

export async function GET() {
  try {
    const db = await connectDB();
    const users = await db.collection('sports').find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const db = await connectDB();
    const body = await request.json();
    const newSport = body.sport;

    if (typeof newSport !== 'string' || newSport.trim() === '') {
      return NextResponse.json({ error: 'Invalid sport string' }, { status: 400 });
    }

    const doc = await db.collection('sports').findOne({});

    if (!doc) {
      return NextResponse.json({ error: 'No document found' }, { status: 404 });
    }

    const result = await db.collection('sports').updateOne(
      { _id: doc._id },
      { $addToSet: { sports: newSport } }
    );

    return NextResponse.json(
      { success: true, message: 'Sport added', modifiedCount: result.modifiedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating sports:', error);
    return NextResponse.json({ error: 'Failed to update sports' }, { status: 500 });
  }
}