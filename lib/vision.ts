import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

/**
 * Reads a photo of a card and suggests what to put in the form.
 *
 * Everything it returns is a suggestion the shopkeeper can overwrite — the
 * form is pre-filled, not submitted. Transcribing what is printed on a card is
 * reliable; a price and a condition are not, so the model is told to leave
 * those blank rather than invent something a buyer would read as a fact.
 */

const blank = (what: string) => `${what} Empty string if the photo does not show it.`;

const Suggestion = z.object({
  kind: z
    .enum(["homemade", "sports"])
    .describe(
      "'sports' for a mass-produced trading card of a real athlete or team. 'homemade' for anything drawn, made or decorated by hand.",
    ),
  name: z
    .string()
    .describe(
      "Short display name for the listing. For a sports card, the player's name. For a homemade card, the character or title shown. Max 5 words.",
    ),
  price: z
    .string()
    .describe(
      'Suggested price such as "50c" or "2.00", only if a price is physically printed on the card or its packaging. Empty string otherwise.',
    ),
  player: z.string().describe(blank("The athlete's full name, exactly as printed.")),
  team: z.string().describe(blank("The team name printed on the card.")),
  sport: z
    .string()
    .describe(blank("One word: Baseball, Basketball, Football, Hockey, Soccer, and so on.")),
  cardSet: z
    .string()
    .describe(blank("The set or series name, such as 'Series 1' or 'Topps Chrome'.")),
  year: z.string().describe(blank("Four-digit year printed on the card.")),
  cardNumber: z.string().describe(blank("The card's number within its set, digits only.")),
  manufacturer: z
    .string()
    .describe(blank("Who printed it — Topps, Panini, Upper Deck, Fleer, and so on.")),
  condition: z
    .string()
    .describe(
      "Only the grade printed on a professional grading slab, such as 'PSA 9'. Empty string for a raw card — never assess condition yourself.",
    ),
  isCard: z
    .boolean()
    .describe("True if the photo actually shows a card, sticker, drawing or similar item for sale."),
});

export type CardSuggestion = z.infer<typeof Suggestion>;

const SYSTEM = `You help a family run a small card shop. They photograph a card they want to sell and you fill in the listing.

The shop sells two kinds of card. Sports trading cards are mass-produced and covered in printed facts. Homemade cards are drawn or made by hand. Decide which one you are looking at and set kind accordingly.

For a sports card, transcribe what is actually printed: player, team, sport, set, year, card number, manufacturer. Copy it exactly. Leave any field empty rather than inferring it from what you know about the player or the era — a buyer will read these as facts about the object in the photograph.

For a homemade card, give it a short, friendly name a child would recognise. Do not invent lore and do not describe the photo. Leave every sports field empty.

Never guess at market value. Suggest a price only when one is physically printed on the card or its packaging; otherwise return an empty string.

Never assess condition from a photograph. Fill in condition only by reading the grade off a professional grading slab, such as "PSA 9". A raw card gets an empty string.

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
    // Room for adaptive thinking plus the JSON payload. Thinking is on by
    // default on this model and counts against max_tokens.
    max_tokens: 4000,
    // Transcription from one image. Low effort keeps it quick, which matters
    // because the shopkeeper is standing there waiting on it mid-flow.
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
