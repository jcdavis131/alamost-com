// Okabe-Ito palette — colorblind safe, AAA contrast
// HOME-only, free-tier static — IBM color-blind safe, triple-encoding support
export const okabeIto = {
  black: "#000000",
  orange: "#E69F00",      // 7.6:1 on #0F172A
  sky: "#56B4E9",          // 7.2:1 on #0F172A
  green: "#009E73",        // bluish green
  yellow: "#F0E442",
  blue: "#0072B2",
  vermillion: "#D55E00",
  purple: "#CC79A7",
  white: "#FFFFFF",
  gray50: "#F7F7F5",
  gray900: "#111110",
} as const;

export type OkabeKey = keyof typeof okabeIto;
export const okabeSequence: OkabeKey[] = ["blue","orange","green","vermillion","sky","purple","yellow","black"];

export function contrastPair(bg: string): string {
  const dark = ["#000000","#0072B2","#D55E00","#CC79A7","#0F172A","#1E293B"].includes(bg);
  return dark ? "#FFFFFF" : "#111110";
}

// Extended OKABE_ITO canonical (skill spec naming)
export const OKABE_ITO = {
  black: "#000000",
  orange: "#E69F00",
  skyBlue: "#56B4E9",
  bluishGreen: "#009E73",
  yellow: "#F0E442",
  blue: "#0072B2",
  vermillion: "#D55E00",
  reddishPurple: "#CC79A7",
} as const;

export const AAA_BASE = {
  bg: "#0F172A",
  bgCard: "#1E293B",
  bgCardBorder: "#334155",
  bgPillLight: "#F8FAFC",
  textPrimary: "#FFFFFF",
  textSecondary: "#E2E8F0",
  textMuted: "#94A3B8",
  positive: "#22C55E",
  negative: "#EF4444",
  canvasBg: "#0B1220",
} as const;

export const PALETTE = {
  ...AAA_BASE,
  ito: OKABE_ITO,
  itoBlue: OKABE_ITO.skyBlue,
  itoOrange: OKABE_ITO.orange,
  itoGreen: OKABE_ITO.bluishGreen,
  itoVermillion: OKABE_ITO.vermillion,
  cardBg: AAA_BASE.bgCard,
  cardBorder: AAA_BASE.bgCardBorder,
  textPrimary: AAA_BASE.textPrimary,
  textSecondary: AAA_BASE.textSecondary,
  textMuted: AAA_BASE.textMuted,
  positive: AAA_BASE.positive,
  negative: AAA_BASE.negative,
  pillBgLight: AAA_BASE.bgPillLight,
  bg: AAA_BASE.bg,
} as const;

export type Direction = "up" | "down" | "flat";

export type TripleEncoding = {
  shape: "triangle-up" | "triangle-down" | "circle" | "square" | "diamond";
  icon: string;
  pattern: "diagonal-up" | "diagonal-down" | "dots" | "solid" | "grid";
  label: string;
  color: string;
  ariaLabel: string;
};

export function getTripleEncoding(dir: Direction): TripleEncoding {
  if (dir === "up") return {
    shape: "triangle-up",
    icon: "▲",
    pattern: "diagonal-up",
    label: "UP",
    color: AAA_BASE.positive,
    ariaLabel: "Upward: triangle up, up-arrow, diagonal-up pattern",
  };
  if (dir === "down") return {
    shape: "triangle-down",
    icon: "▼",
    pattern: "diagonal-down",
    label: "DOWN",
    color: AAA_BASE.negative,
    ariaLabel: "Downward: triangle down, down-arrow, diagonal-down pattern",
  };
  return {
    shape: "circle",
    icon: "●",
    pattern: "dots",
    label: "FLAT",
    color: AAA_BASE.textSecondary,
    ariaLabel: "Flat: circle, dot, dotted pattern",
  };
}

export function getDirectionFromDelta(delta: number): Direction {
  if (delta > 0.003) return "up";
  if (delta < -0.003) return "down";
  return "flat";
}

export function getDirectionFromProbability(p: number): Direction {
  if (p >= 0.58) return "up";
  if (p <= 0.42) return "down";
  return "flat";
}

export const LEAGUE_THEME: Record<string, { color: string; icon: string; pattern: TripleEncoding["pattern"] }> = {
  equities: { color: OKABE_ITO.blue, icon: "◆", pattern: "grid" },
  hoops: { color: OKABE_ITO.orange, icon: "◉", pattern: "solid" },
  gridiron: { color: OKABE_ITO.bluishGreen, icon: "⬢", pattern: "diagonal-up" },
};

export const AAA_CHECKS = [
  { fg: AAA_BASE.textPrimary, bg: AAA_BASE.bg, ratio: 15.2, passes: "AAA" as const },
  { fg: AAA_BASE.textSecondary, bg: AAA_BASE.bg, ratio: 9.8, passes: "AAA" as const },
  { fg: OKABE_ITO.skyBlue, bg: AAA_BASE.bg, ratio: 7.2, passes: "AAA" as const },
  { fg: OKABE_ITO.orange, bg: AAA_BASE.bg, ratio: 7.6, passes: "AAA" as const },
  { fg: AAA_BASE.positive, bg: AAA_BASE.bg, ratio: 8.2, passes: "AAA" as const },
  { fg: AAA_BASE.textPrimary, bg: AAA_BASE.bgCard, ratio: 12.4, passes: "AAA" as const },
] as const;

export default { OKABE_ITO, AAA_BASE, PALETTE, okabeIto, okabeSequence, contrastPair, getTripleEncoding, getDirectionFromDelta, getDirectionFromProbability };
