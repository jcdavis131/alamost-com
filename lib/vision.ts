import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

/**
 * Reads a photo of a card and suggests what to put in the form.
 *
 * Everything it returns is a suggestion the shopkeeper can overwrite — the
 * form is pre-filled, not submitted. Reading the card's name off the artwork
 * is reliable; a price is a guess, so the model is told to leave it blank
 * rather than invent one it cannot support.
 */

const Suggestion = z.object({
  name: z
    .string()
    .describe("Short display name for the card, from the title or character shown. Max 5 words."),
  price: z
    .string()
    .describe(
      'Suggested price such as "50c" or "2.00". Empty string if the photo gives no basis for a price.',
    ),
  isCard: z
    .boolean()
    .describe("True if the photo actually shows a card, sticker, drawing or similar item for sale."),
});

export type CardSuggestion = z.infer<typeof Suggestion>;

const SYSTEM = `You help a child run a small card shop. She photographs a card she wants to sell and you fill in the listing for her.

Give the card a short, friendly name a child would recognise — the character or title shown on it. Do not invent lore, do not describe the photo, and do not use more than five words.

Only suggest a price when the photo gives you a basis for one, such as a price written on the card or packaging. Otherwise return an empty string for price. Never guess at market value.

If the photo does not show a card, sticker, drawing, or similar sellable item, set isCard to false and leave the other fields empty.`;

export function isVisionConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function suggestFromPhoto(photo: Blob): Promise<CardSuggestion | null> {
  if (!isVisionConfigured()) return null;

  const client = new Anthropic();
  const base64 = Buffer.from(await photo.arrayBuffer()).toString("base64");

  const response = await client.messages.parse({
    model: "claude-opus-5",
    // Room for adaptive thinking plus the small JSON payload. Thinking is on
    // by default on this model and counts against max_tokens.
    max_tokens: 4000,
    // A short extraction from one image — low effort keeps it quick, which
    // matters because the shopkeeper is waiting on it mid-flow.
    output_config: { effort: "low", format: zodOutputFormat(Suggestion) },
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
          { type: "text", text: "Fill in the listing for this card." },
        ],
      },
    ],
  });

  // Safety classifiers can decline; content is empty or partial when they do.
  if (response.stop_reason === "refusal") return null;

  return response.parsed_output ?? null;
}
