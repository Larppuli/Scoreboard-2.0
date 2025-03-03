import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';

export async function GET() {
  try {
    const db = await connectDB();
    const games = await db.collection('games').find({}).toArray();

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await connectDB();
    const gameData = await request.json();

    if (!gameData.date || !gameData.participants || !gameData.sport) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db.collection('games').insertOne(gameData);

    return NextResponse.json(
      { success: true, message: 'Game saved', insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json({ error: 'Failed to save game' }, { status: 500 });
  }
}
