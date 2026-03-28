"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

async function chatCompletion(system: string, user: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it in the Convex dashboard under Settings → Environment Variables."
    );
  }

  const response = await fetch(OPENAI_CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      max_tokens: 400,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("OpenAI returned an empty response");
  }

  return text;
}

export const generateDescription = action({
  args: { title: v.string() },
  handler: async (_ctx, { title }) => {
    const t = title.trim();
    if (!t) {
      throw new Error("title is required");
    }
    if (t.length > 200) {
      throw new Error("title must be at most 200 characters");
    }

    return await chatCompletion(
      "You write concise, honest listings for a student marketplace. Output plain text only: 2–4 short sentences, friendly and clear. No markdown headings or bullet lists.",
      `Write a listing description for this item title: "${t}"`
    );
  },
});

export const priceSuggestion = action({
  args: {
    title: v.string(),
    condition: v.string(),
  },
  handler: async (_ctx, { title, condition }) => {
    const t = title.trim();
    const c = condition.trim();
    if (!t) {
      throw new Error("title is required");
    }
    if (t.length > 200) {
      throw new Error("title must be at most 200 characters");
    }
    if (!c) {
      throw new Error("condition is required");
    }
    if (c.length > 300) {
      throw new Error("condition must be at most 300 characters");
    }

    const raw = await chatCompletion(
      'You suggest one fair resale price in US dollars for student marketplace items. Respond with a single JSON object only, no markdown, shape: {"price": number, "rationale": string}. price must be a realistic number (can include cents).',
      `Item: "${t}". Condition reported by seller: "${c}". Suggest one fair asking price.`
    );

    let price: number;
    let rationale: string;

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch?.[0] ?? raw) as {
        price?: unknown;
        rationale?: unknown;
      };
      if (typeof parsed.price !== "number" || !Number.isFinite(parsed.price)) {
        throw new Error("invalid price in JSON");
      }
      price = Math.round(parsed.price * 100) / 100;
      rationale =
        typeof parsed.rationale === "string" ? parsed.rationale.trim() : "";
    } catch {
      const numMatch = raw.match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
      const n = numMatch ? parseFloat(numMatch[1]) : NaN;
      if (!Number.isFinite(n)) {
        throw new Error("Could not parse a price from the model response");
      }
      price = Math.round(n * 100) / 100;
      rationale = raw;
    }

    return { price, rationale };
  },
});
