import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

const gamesCollection = process.env.MONGODB_COLLECTION || 'games';
const usersCollection = 'users';
const reportsCollection = 'monthly_reports';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {

  try {
    const PROMPT_END = process.env.PROMPT_END || "";
    const db = await connectDB();

    // 2. Map User IDs to First Names
    const users = await db.collection(usersCollection).find({}, { projection: { firstName: 1, _id: 1 } }).toArray();
    const userMap: Record<string, string> = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user.firstName;
    });

    // 3. Get all months that have game data
    const availableMonths = await db.collection(gamesCollection).aggregate([
      { $project: { yearMonth: { $substr: ["$date", 0, 7] } } },
      { $group: { _id: "$yearMonth" } },
      { $sort: { _id: 1 } }
    ]).toArray();

    const results = [];

    // 4. Iterate through months and generate reports
    for (const entry of availableMonths) {
      const datePrefix = entry._id;
      const [year, monthStr] = datePrefix.split('-').map(Number);
      const currentM = monthStr - 1;

      // Skip if report already exists
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

        // 5. Setup AI and Personas
        const model = genAI.getGenerativeModel({
          model: "gemini-3.1-flash-lite-preview",
          generationConfig: { responseMimeType: "application/json" }
        });

        const personas = [
          { name: "Peksi", desc: "a washed-up, grumpy, 1980s-era sports commentator who hates modern 'soft' players." },
          { name: "Jäsmin", desc: "a sarcastic, high-society Finnish gossip columnist who finds these games 'utterly middle-class'." },
          { name: "Kapteeni", desc: "a terrifying drill sergeant who thinks these players are a disgrace to the Finnish winter war spirit." },
          { name: "Vesander", desc: "a jaded 40-year-old sports store cashier who has sold these guys all their gear and knows exactly how little they use it. He views every game as a personal insult to the high-end equipment he has to restock." },
          { name: "Plamen", desc: "a pessimistic betting addict who just lost his life savings on these amateur results." },
          { name: "Aristoteles", desc: "a pretentiously philosophical art critic who views these terrible game moves as 'failed performance art'." },
          { name: "Tiffany", desc: "an over-caffeinated American life coach who thinks a 0% win rate is a 'growth opportunity'." },
          { name: "Sinikka", desc: "a sweet but confused Finnish grandmother who is just glad you wore warm socks." },
          { name: "Disco-Erkka", desc: "a 90s Eurodance hype-man who treats every goal like a world-record achievement." },
          { name: "Makke", desc: "a hyper-active LinkedIn 'thought leader' who sees every missed goal as a masterclass in pivot-strategy and every rainy game as a metaphor for market volatility. He uses way too many emojis and thinks 'Tuusulan pojat' is a high-performance startup." 
}
        ];

        const selected = personas[Math.floor(Math.random() * personas.length)];

        const prompt = `
          Your name is ${selected.name}. You are ${selected.desc}
          Analyze amateur game data for ${datePrefix}.
          REFERENCE THESE PLAYERS: ${Object.values(userMap).join(", ")}.
          GAME DATA: ${JSON.stringify(gamesWithNames)}.
          ${PROMPT_END}

          Return a JSON object with exactly these two keys:
          1. "title": A 3-7 word headline for the month that fits the persona.
          2. "content": The full recap as requested in the rules. Use your persona's unique voice.
        `;

        try {
          const aiResponse = await model.generateContent(prompt);
          let responseText = aiResponse.response.text().trim();

          // 6. Robust JSON Extraction
          const firstBracket = responseText.indexOf('{');
          const lastBracket = responseText.lastIndexOf('}');

          if (firstBracket === -1 || lastBracket === -1) {
            throw new Error("AI response did not contain a valid JSON object");
          }

          const cleanJson = responseText.substring(firstBracket, lastBracket + 1);
          const parsed = JSON.parse(cleanJson);

          // 7. Save to Database
          await db.collection(reportsCollection).updateOne(
            { month: currentM, year: year },
            {
              $set: {
                title: parsed.title,
                content: parsed.content,
                author: selected.name,
                gameCount: gamesWithNames.length,
                updatedAt: new Date().toISOString()
              }
            },
            { upsert: true }
          );

          results.push({ period: datePrefix, status: 'Success' });
        } catch (aiError: any) {
          console.error(`Error for ${datePrefix}:`, aiError.message);
          results.push({ period: datePrefix, status: 'Error', reason: aiError.message });
        }
      }
    }

    return NextResponse.json({ message: "Backfill complete", summary: results });
  } catch (error) {
    console.error('Critical Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}