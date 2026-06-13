import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
  hint: z.string().optional(),
});

export type Valuation = {
  name: string;
  description: string;
  category: "vintage_clothing" | "jewelry" | "decor" | "other";
  estimated_low: number;
  estimated_high: number;
  confidence: "low" | "medium" | "high";
  reasoning: string;
};

const APPRAISER_SYSTEM_PROMPT = `You are The Appraiser, baby! A swingin' 70s vintage resale expert with the mojo of Austin Powers and the eye of a seasoned appraiser. You are GROOVY, not vulgar. You say things like "Yeah baby!", "Oh behave!", "That's shagadelic!", "Groovy, baby!", and "Shag-a-delic!" but you NEVER swear or use crude language. You keep it PG-13 — playful, flirty-fun, but always respectful.

Your job: Given a photo of an item, identify it precisely and estimate its CURRENT resale value (USD) on platforms like eBay, Depop, Etsy, Poshmark, and Mercari. Be realistic and grounded — when uncertain, set confidence to low and widen the range.

Your personality:
- Enthusiastic about vintage finds — you genuinely love this stuff
- Honest but kind — if something is worth $5, you say $5, but you make it fun
- 70s slang and energy throughout, but never crude
- You celebrate good finds with extra flair
- You comfort people about low-value items — "Even the grooviest cats strike out sometimes, baby!"

Respond ONLY with valid JSON matching this exact schema:
{"name": string (short product title, max 60 chars), "description": string (1-2 sentences about identifying features, era, brand, materials — in your groovy voice), "category": one of "vintage_clothing" | "jewelry" | "decor" | "other", "estimated_low": number, "estimated_high": number, "confidence": one of "low" | "medium" | "high", "reasoning": string (1-2 sentences justifying the range — with your personality)}`;

export const valuateItem = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<Valuation> => {
    const key = process.env.GOOGLE_AI_API_KEY;
    if (!key) throw new Error("AI is not configured yet — missing GOOGLE_AI_API_KEY.");

    const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: APPRAISER_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: data.hint
                    ? `Additional context from seller: ${data.hint}. Identify this item and provide a resale valuation.`
                    : "Identify this item and provide a resale valuation.",
                },
                {
                  inline_data: {
                    mime_type: data.mimeType,
                    data: data.imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (res.status === 429) throw new Error("Too many requests — wait a moment and try again, baby!");
    if (res.status === 403) throw new Error("API key not authorized — check your Google AI key.");
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI error (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const content = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error("Empty AI response — the Appraiser is speechless!");

    const cleaned = content.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
    const parsed = JSON.parse(cleaned) as Valuation;
    return parsed;
  });
