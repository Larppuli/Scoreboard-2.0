import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';

const reportsCollection = 'monthly_reports';

export async function GET() {
  try {
    const db = await connectDB();

    const reports = await db
      .collection(reportsCollection)
      .find({})
      .sort({ year: -1, month: -1 })
      .toArray();

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' }, 
      { status: 500 }
    );
  }
}