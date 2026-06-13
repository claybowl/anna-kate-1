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

export const valuateItem = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<Valuation> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI is not configured yet — missing LOVABLE_API_KEY.");

    const dataUrl = `data:${data.mimeType};base64,${data.imageBase64}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resale appraiser specializing in vintage clothing, jewelry, and home decor. Given a photo of an item, identify it precisely and estimate its CURRENT resale value (USD) on platforms like eBay, Depop, Etsy, Poshmark, and Mercari. Be realistic and grounded — when uncertain, set confidence to low and widen the range. Respond ONLY with valid JSON matching this exact schema: {\"name\": string (short product title, max 60 chars), \"description\": string (1-2 sentences about identifying features, era, brand, materials), \"category\": one of \"vintage_clothing\" | \"jewelry\" | \"decor\" | \"other\", \"estimated_low\": number, \"estimated_high\": number, \"confidence\": one of \"low\" | \"medium\" | \"high\", \"reasoning\": string (1-2 sentences justifying the range based on visible cues)}",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: data.hint
                  ? `Additional context from seller: ${data.hint}. Identify this item and provide a resale valuation.`
                  : "Identify this item and provide a resale valuation.",
              },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Too many requests — wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Top up to keep valuing items.");
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI gateway error (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    const cleaned = content.trim().replace(/^```json\s*/i, "").replace(/```$/, "");
    const parsed = JSON.parse(cleaned) as Valuation;
    return parsed;
  });
