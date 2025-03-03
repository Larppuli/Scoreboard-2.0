import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const users = await db.collection("users").find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
