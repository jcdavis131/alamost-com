/**
 * Shared result shape for form actions.
 *
 * Kept out of app/actions.ts on purpose: that file is "use server", and a
 * client component importing from it — even for a type — pulls the server
 * module into the client graph and breaks the build at runtime.
 */
export type ActionState = { error?: string; ok?: string };

export type FormAction = (prev: ActionState, form: FormData) => Promise<ActionState>;

/** What the vision pass suggests for a photographed card. Null when unavailable. */
export type Suggestion = { name: string; price: string; isCard: boolean } | null;

export type SuggestResult = { suggestion: Suggestion; error?: string };
