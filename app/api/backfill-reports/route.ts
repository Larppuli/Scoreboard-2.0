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
      if (existing && existing.title && existing.comments) {
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

        const personas = [
          { name: "Peksi", desc: "a washed-up, grumpy, 1980s-era sports commentator who hates modern 'soft' players. You insult the players in every aspect." },
          { name: "Zäsmin", desc: "a sarcastic, high-society Finnish gossip columnist who finds these games 'utterly middle-class'." },
          { name: "Kapteeni", desc: "a terrifying drill sergeant who thinks these players are a disgrace to the Finnish spirit." },
          { name: "Vesander", desc: "a jaded sports store cashier who knows exactly how little these guys use their expensive gear." },
          { name: "Plamen", desc: "a pessimistic betting addict who just lost his life savings on these amateur results." },
          { name: "Aristoteles", desc: "a pretentiously philosophical art critic who views these terrible moves as 'failed performance art'." },
          { name: "Tiffany", desc: "an over-caffeinated American life coach who thinks failure is a 'growth opportunity'." },
          { name: "Sinikka", desc: "a sweet but confused Finnish grandmother who is just glad you wore warm socks." },
          { name: "Disco-Erkka", desc: "a 90s Eurodance hype-man who treats every goal like a world-record achievement." },
          { name: "Makke", desc: "a hyper-active LinkedIn 'thought leader' who sees learning opportunities in every disaster. Uses way too many emojis. 🚀📈" }
        ];

        const selected = personas[Math.floor(Math.random() * personas.length)];

        const prompt = `
          Your name is ${selected.name}. You are ${selected.desc}
          Analyze amateur game data for ${datePrefix}.
          REFERENCE THESE PLAYERS: ${Object.values(userMap).join(", ")}.
          GAME DATA: ${JSON.stringify(gamesWithNames)}.
          ${PROMPT_END}

          Return a JSON object with exactly these three keys:
          1. "title": A 3-7 word headline for the month.
          2. "content": The full recap in your unique voice.
          3. "comments": An array of 1-5 objects. Each object should have "user" (a creative username that sounds like internet nickname and might contain a finnish first name) and "text" (a short, 1-sentence sarcastic or very mean comment about the month's performance. If comments already exists, start to argue with them with 30% propability. In the case of argument, the full nickname of the user that are argued with must be mentioned) Comments MUST NOT imitate any player.
        `;

        try {
          const aiResponse = await model.generateContent(prompt);
          let responseText = aiResponse.response.text().trim();

          const firstBracket = responseText.indexOf('{');
          const lastBracket = responseText.lastIndexOf('}');
          const parsed = JSON.parse(responseText.substring(firstBracket, lastBracket + 1));

          await db.collection(reportsCollection).updateOne(
            { month: currentM, year: year },
            {
              $set: {
                title: parsed.title,
                content: parsed.content,
                comments: parsed.comments,
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