// Lina's Card Shop — card manifest.
// Cards are printable: white background, big art, few words.
// Art is emoji so there are no image assets to host and everything works offline.

export type CardKind = "animal" | "number" | "shape";

/** Accent keys map to Okabe-Ito hues, which stay distinguishable for colorblind readers. */
export type AccentKey = "blue" | "vermillion" | "green" | "purple" | "orange" | "sky";

export type KidCard = {
  id: string;
  kind: CardKind;
  /** Big word on the card. Kept short so a new reader can sound it out. */
  name: string;
  art: string;
  /** Leading letter, shown in its own badge for letter practice. */
  letter: string;
  /** One short sentence, simple words only. */
  fact: string;
  accent: AccentKey;
  /** Number cards only: how many pieces of art to draw for counting. */
  count?: number;
};

export const cardsManifest: KidCard[] = [
  // --- Animals ---
  { id: "bear",     kind: "animal", name: "BEAR",     art: "🐻", letter: "B", fact: "Bears love honey.",        accent: "vermillion" },
  { id: "cat",      kind: "animal", name: "CAT",      art: "🐱", letter: "C", fact: "Cats purr when happy.",    accent: "purple" },
  { id: "dog",      kind: "animal", name: "DOG",      art: "🐶", letter: "D", fact: "Dogs wag their tails.",    accent: "orange" },
  { id: "elephant", kind: "animal", name: "ELEPHANT", art: "🐘", letter: "E", fact: "Elephants have big ears.", accent: "sky" },
  { id: "frog",     kind: "animal", name: "FROG",     art: "🐸", letter: "F", fact: "Frogs hop very high.",     accent: "green" },
  { id: "lion",     kind: "animal", name: "LION",     art: "🦁", letter: "L", fact: "Lions have a big roar.",   accent: "orange" },
  { id: "owl",      kind: "animal", name: "OWL",      art: "🦉", letter: "O", fact: "Owls stay up at night.",   accent: "blue" },
  { id: "penguin",  kind: "animal", name: "PENGUIN",  art: "🐧", letter: "P", fact: "Penguins slide on ice.",   accent: "sky" },
  { id: "turtle",   kind: "animal", name: "TURTLE",   art: "🐢", letter: "T", fact: "Turtles walk slowly.",     accent: "green" },
  { id: "unicorn",  kind: "animal", name: "UNICORN",  art: "🦄", letter: "U", fact: "Unicorns are magic.",      accent: "purple" },

  // --- Numbers: art repeats `count` times so the card can be counted out loud ---
  { id: "one",   kind: "number", name: "ONE",   art: "⭐", letter: "1", fact: "Count them: one.",   accent: "blue",       count: 1 },
  { id: "two",   kind: "number", name: "TWO",   art: "🍎", letter: "2", fact: "Count them: two.",   accent: "vermillion", count: 2 },
  { id: "three", kind: "number", name: "THREE", art: "🌸", letter: "3", fact: "Count them: three.", accent: "purple",     count: 3 },
  { id: "four",  kind: "number", name: "FOUR",  art: "🐞", letter: "4", fact: "Count them: four.",  accent: "green",      count: 4 },
  { id: "five",  kind: "number", name: "FIVE",  art: "🎈", letter: "5", fact: "Count them: five.",  accent: "orange",     count: 5 },

  // --- Shapes ---
  { id: "circle",   kind: "shape", name: "CIRCLE",   art: "🔵", letter: "C", fact: "A circle is round.",          accent: "blue" },
  { id: "square",   kind: "shape", name: "SQUARE",   art: "🟩", letter: "S", fact: "A square has four sides.",    accent: "green" },
  { id: "triangle", kind: "shape", name: "TRIANGLE", art: "🔺", letter: "T", fact: "A triangle has three sides.", accent: "vermillion" },
  { id: "star",     kind: "shape", name: "STAR",     art: "⭐", letter: "S", fact: "Stars shine at night.",       accent: "orange" },
  { id: "heart",    kind: "shape", name: "HEART",    art: "💜", letter: "H", fact: "A heart means love.",         accent: "purple" },
];

export const kinds: { id: CardKind | "all"; label: string; art: string }[] = [
  { id: "all",    label: "All",     art: "🌈" },
  { id: "animal", label: "Animals", art: "🐾" },
  { id: "number", label: "Numbers", art: "🔢" },
  { id: "shape",  label: "Shapes",  art: "⭐" },
];

/**
 * Card background/ink pairs. Ink is chosen per hue so large text clears 3:1
 * against its banner — the light hues get dark ink rather than white.
 */
export const accents: Record<AccentKey, { bg: string; ink: string }> = {
  blue:       { bg: "#0072B2", ink: "#FFFFFF" },
  vermillion: { bg: "#D55E00", ink: "#FFFFFF" },
  green:      { bg: "#009E73", ink: "#FFFFFF" },
  purple:     { bg: "#CC79A7", ink: "#111110" },
  orange:     { bg: "#E69F00", ink: "#111110" },
  sky:        { bg: "#56B4E9", ink: "#111110" },
};
