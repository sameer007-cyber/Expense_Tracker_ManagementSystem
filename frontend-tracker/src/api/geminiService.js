import 'dotenv/config';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL   = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Fetch personalised financial advice from Gemini.
 *
 * @param {{ totalIncome: number, totalExpense: number, remaining: number }} summary
 * @param {{ title: string, amount: number, type: string, date: string, category?: string }[]} transactions
 * @returns {Promise<{ title: string, advice: string }[]>}
 */
export async function getFinancialAdvice(summary, transactions = []) {
  const savingsRate =
    summary.totalIncome > 0
      ? Math.round(
          ((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100
        )
      : 0;

  const txSummary = transactions
    .slice(0, 8)
    .map(
      (t) =>
        `• ${t.type === "income" ? "+" : "-"}₹${t.amount} – ${t.title} (${
          t.category || "uncategorised"
        })`
    )
    .join("\n");

  const prompt = `You are a concise, friendly personal finance advisor for an Indian user.

Here is their current financial snapshot:
- Total Income  : ₹${summary.totalIncome?.toLocaleString()}
- Total Expenses: ₹${summary.totalExpense?.toLocaleString()}
- Net Balance   : ₹${summary.remaining?.toLocaleString()}
- Savings Rate  : ${savingsRate}%

Recent transactions:
${txSummary || "No recent transactions available."}

Based on this data, give 3 short, actionable and specific financial tips (2-3 sentences each). 
Format your response as a JSON array of objects with keys: "title" (short tip heading, max 5 words) and "advice" (the tip text).
Respond ONLY with the JSON array, no markdown fences, no preamble.`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Gemini API error ${res.status}`);
    }

    const data = await res.json();
    const raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    // Remove accidental markdown formatting
    const clean = raw.replace(/```json|```/gi, "").trim();

    return JSON.parse(clean);
  } catch (error) {
    console.error("Gemini API Error:", error.message);

    // Safe fallback so UI doesn't crash
    return [
      {
        title: "Unable to fetch advice",
        advice:
          "We couldn't generate financial tips right now. Please try again later or check your API configuration.",
      },
    ];
  }
}