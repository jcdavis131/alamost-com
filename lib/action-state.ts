/**
 * Shared result shape for form actions.
 *
 * Kept out of app/actions.ts on purpose: that file is "use server", and a
 * client component importing from it — even for a type — pulls the server
 * module into the client graph and breaks the build at runtime.
 */
export type ActionState = { error?: string; ok?: string };

export type FormAction = (prev: ActionState, form: FormData) => Promise<ActionState>;

/**
 * What the vision pass suggests for a photographed card.
 *
 * Every field is a string, including year, because these go straight into form
 * inputs and an empty string is the honest representation of "the photo did
 * not tell me". Null for the whole object means the pass was unavailable.
 */
export type Suggestion = {
  kind: "homemade" | "sports";
  name: string;
  price: string;
  player: string;
  team: string;
  sport: string;
  cardSet: string;
  year: string;
  cardNumber: string;
  manufacturer: string;
  condition: string;
  isCard: boolean;
} | null;

export type SuggestResult = { suggestion: Suggestion; error?: string };
