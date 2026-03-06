import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gamesCollection = process.env.MONGODB_COLLECTION || 'games';
const usersCollection = 'users'; 
const reportsCollection = 'monthly_reports';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function POST(request: NextRequest) {
    if (process.env.ENVIRONMENT !== 'dev') {
    return NextResponse.json(
      { error: 'Backfill is only permitted in the local dev environment.' }, 
      { status: 403 }
        );
    }
  try {
    const PROMPT_END = process.env.PROMPT_END || "";
    const db = await connectDB();
    
    const users = await db.collection(usersCollection).find({}, { projection: { firstName: 1, _id: 1 } }).toArray();
    const userMap: Record<string, string> = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user.firstName;
    });

    const availableMonths = await db.collection(gamesCollection).aggregate([
      { $project: { yearMonth: { $substr: ["$date", 0, 7] } } },
      { $group: { _id: "$yearMonth" } },
      { $sort: { _id: 1 } }
    ]).toArray();

    const results = [];

    for (const entry of availableMonths) {
      const datePrefix = entry._id;
      const [year, monthStr] = datePrefix.split('-').map(Number);
      const currentM = monthStr - 1;

      const existing = await db.collection(reportsCollection).findOne({ month: currentM, year: year });
      if (existing && existing.title) {
        results.push({ period: datePrefix, status: 'Skipped' });
        continue;
      }

      const rawGames = await db.collection(gamesCollection).find({
        date: { $regex: `^${datePrefix}` }
      }).toArray();

      if (rawGames.length > 0) {
        const gamesWithNames = rawGames.map(game => ({
          ...game,
          participants: game.participants?.map((id: any) => userMap[id.toString()] || "Unknown Rookie"),
          winner: userMap[game.winner?.toString()] || "TBD"
        }));

        const model = genAI.getGenerativeModel({ 
          model: "gemini-3.1-flash-lite-preview",
          generationConfig: { responseMimeType: "application/json" }
        });
        
        const prompt = `
          You are a washed-up, grumpy, 1980s-era sports commentator. 
          Analyze amateur game data for ${datePrefix}.
          
          REFERENCE THESE PLAYERS: ${Object.values(userMap).join(", ")}.
          GAME DATA: ${JSON.stringify(gamesWithNames)}.
          
          ${PROMPT_END}

          Return a JSON object with exactly these two keys:
          1. "title": A 3-7 word cynical/funny headline for the month.
          2. "content": The full recap as requested in the rules.
        `;

        try {
          const aiResponse = await model.generateContent(prompt);
          const responseText = aiResponse.response.text();
          const parsed = JSON.parse(responseText);

          await db.collection(reportsCollection).updateOne(
            { month: currentM, year: year },
            { 
              $set: { 
                title: parsed.title,
                content: parsed.content, 
                gameCount: gamesWithNames.length, 
                updatedAt: new Date().toISOString() 
              } 
            },
            { upsert: true }
          );

          results.push({ period: datePrefix, status: 'Success' });
        } catch (aiError) {
          console.error(`Error for ${datePrefix}:`, aiError);
          results.push({ period: datePrefix, status: 'Error' });
        }
      }
    }

    return NextResponse.json({ message: "Backfill complete", summary: results });
  } catch (error) {
    console.error('Critical Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}