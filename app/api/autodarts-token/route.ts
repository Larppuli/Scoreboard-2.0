import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/db';

export async function GET() {
  try {
    const db = await connectDB();
    const users = await db.collection('autodarts_token').find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
    try {
      const db = await connectDB();
      const gameData = await request.json();
  
      const result = await db.collection('autodarts_token').insertOne(gameData);
  
      return NextResponse.json(
        { success: true, message: 'Token saved', insertedId: result.insertedId },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error saving token:', error);
      return NextResponse.json({ error: 'Failed to save token' }, { status: 500 });
    }
  }
  

export async function PUT(request: NextRequest) {
    try {
        const db = await connectDB();
        const { refreshToken } = await request.json();

        if (!refreshToken || typeof refreshToken !== 'string') {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 400 });
        }

        const result = await db.collection('autodarts_token').updateOne(
        {},
        { $set: { refreshToken } }
        );

        if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'No document found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Token updated' });
    } catch (error) {
        console.error('Error updating token:', error);
        return NextResponse.json({ error: 'Failed to update token' }, { status: 500 });
    }
}