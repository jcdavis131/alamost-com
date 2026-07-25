/**
 * slop-lite — inline slop-scan + copy-lite for alamost.com
 * HOME-only, free-tier, client-safe (no node deps)
 * Ports 5 checks from card-studio-daily SKILL.md lib/slop.ts
 *
 * Checks:
 * 1. Em-dash spam: >2 — per 500 chars -> replace with : or ,
 * 2. Generic closings: /in conclusion|game changer|unlock your|elevate your|thanks for reading/i
 * 3. Overly perfect lists: 3+ bullets same leading verb
 * 4. Hedged corporate tone: /delve|leverage|synergy|cutting-edge|robust|seamlessly/
 * 5. Missing anecdotes: len>400 && zero concrete driver token
 *
 * Score <0.25 passes
 */

export type SlopResult = {
  score: number;
  issues: string[];
  fixed: string;
  passed: boolean;
};

const GENERIC_CLOSINGS_RE = /in conclusion|game changer|unlock your|elevate your|thanks for reading|in summary|to sum up|remember to/i;
const HEDGED_RE = /\b(delve|leverage|synergy|cutting-edge|robust|seamlessly|elevate|unlock|holistic|world-class)\b/i;
const EM_DASH_RE = /—/g;

export function scrubCaption(s: string): string {
  if (!s) return "";
  return s
    .replace(/—{2,}/g, "—")
    .replace(/--+|——/g, "–")
    .replace(/\s+—\s+/g, " – ")
    .replace(/\b(very|really|quite|rather|fairly)\s+(excited|thrilled|delighted|honored)\b/gi, "$2")
    .replace(/\bIn conclusion.*$/im, "")
    .replace(/\bAs an AI\b.*$/im, "")
    .trim()
    .slice(0, 180);
}

export function slopScan(input: string): SlopResult {
  let s = input ?? "";
  const issues: string[] = [];
  let score = 0;

  // 1) em-dash spam
  const dashCount = (s.match(EM_DASH_RE) || []).length;
  const over500 = Math.max(1, Math.ceil(s.length / 500));
  const normalizedDashes = dashCount / over500;
  if (normalizedDashes > 2) {
    issues.push(`em-dash spam: ${dashCount} dashes / ${over500} blocks`);
    score += 0.35;
    // auto-fix: replace spaced em-dash with colon/comma, keep first 2
    let seen = 0;
    s = s.replace(/(\s*—\s*)/g, (m) => {
      seen++;
      if (seen <= 2) return m;
      return seen % 2 === 0 ? ", " : ": ";
    });
  }

  // 2) generic closings
  if (GENERIC_CLOSINGS_RE.test(s)) {
    const mt = s.match(GENERIC_CLOSINGS_RE);
    issues.push(`generic closing: "${mt?.[0]}"`);
    score += 0.3;
    s = s.replace(GENERIC_CLOSINGS_RE, "").replace(/\s{2,}/g, " ").trim();
  }

  // 3) overly perfect lists
  const lines = s.split(/\n/);
  const bullets = lines.filter(l => /^\s*[-•]\s/.test(l) || /^\s*\d+\.\s/.test(l));
  if (bullets.length >= 3) {
    const verbs = bullets.slice(0,3).map(b => b.trim().split(/\s+/)[1]?.toLowerCase()).filter(Boolean);
    const allSame = verbs.length >= 3 && verbs.every(v => v === verbs[0]);
    if (allSame || bullets.every(b => /^\s*[-•]\s*(Explore|Discover|Unlock|Elevate)/i.test(b))) {
      issues.push("overly perfect list: same verb / marketing list");
      score += 0.25;
      // collapse bullets to sentence if too uniform
      if (bullets.length === lines.length || bullets.length >= 4) {
        const cleaned = bullets.map(b => b.replace(/^\s*[-•\d.]\s*/, "").trim()).join("; ");
        s = cleaned + (s.includes(".") ? "" : ".");
      }
    }
  }

  // 4) hedged corporate tone
  const hedgedMatches = s.match(new RegExp(HEDGED_RE.source, "gi"));
  if (hedgedMatches) {
    issues.push(`hedged corporate: ${hedgedMatches.slice(0,3).join(", ")}`);
    score += 0.3 * Math.min(2, hedgedMatches.length);
    s = s
      .replace(/\bdelve into\b/gi, "look at")
      .replace(/\bdelve\b/gi, "explore")
      .replace(/\bleverage\b/gi, "use")
      .replace(/\bsynergy\b/gi, "fit")
      .replace(/\bcutting-edge\b/gi, "new")
      .replace(/\brobust\b/gi, "solid")
      .replace(/\bseamlessly\b/gi, "smoothly")
      .replace(/\bholistic\b/gi, "full")
      .replace(/\bworld-class\b/gi, "top");
  }

  // 5) missing anecdotes / grounding (len>400 and no concrete token)
  if (s.length > 400) {
    const hasConcrete = /\b\d+(\.\d+)?%|p_\w+=|asof=|model=|\b[A-Z]{1,5}\b.*\d|\+0\.\d+|-\d+\.\d+/.test(s) || /\[asof=/.test(s) || /momentum|flow|transition|rim|pressure|retention/i.test(s);
    if (!hasConcrete) {
      issues.push("missing concrete driver/factor for long copy");
      score += 0.2;
    }
  }

  // final score clamp 0..1
  score = Math.min(1, Math.max(0, score));
  // small discount for short actionable copy
  if (s.length < 300 && issues.length === 0) score *= 0.5;

  return {
    score,
    issues,
    fixed: s.trim(),
    passed: score < 0.25,
  };
}

// Copy-lite: grounded thread builder for alamost.com cards
// Every numeric claim must interpolate asof + model_id per SKILL.md
export type MTNNLite = {
  league: "hoops" | "equities" | "gridiron";
  ticker?: string;
  matchup?: string;
  p_home?: number;
  p_up?: number;
  conf?: number;
  forecast_ret?: number;
  spread?: number;
  ou?: number;
  top?: string[];
  asof: string;
  model_id: string;
  price?: string;
};

export function generateCopyLite(j: MTNNLite): { thread: string[]; citations: string[]; raw: string } {
  const top = (j.top ?? []).slice(0,3).join(", ") || "no drivers";
  let hook = "";
  if (j.league === "equities" && j.ticker) {
    const dir = (j.forecast_ret ?? 0) >= 0 ? "▲" : "▼";
    const fr = ((j.forecast_ret ?? 0)*100).toFixed(1);
    hook = `${dir} ${j.ticker} ${fr}% edge [p_up=${j.p_up?.toFixed(2)} asof=${j.asof.slice(0,10)} src=${j.model_id}]`;
  } else if (j.league === "hoops" && j.matchup) {
    hook = `🏀 ${j.matchup} — ${((j.p_home??0.5)*100).toFixed(0)}% home edge [p_home=${j.p_home?.toFixed(2)} asof=${j.asof.slice(0,10)} src=${j.model_id}]`;
  } else if (j.league === "gridiron" && j.matchup) {
    hook = `🏈 ${j.matchup} — ${((j.p_home??0.5)*100).toFixed(0)}% home [p_home=${j.p_home?.toFixed(2)} asof=${j.asof.slice(0,10)}]`;
  } else {
    hook = `Card ${j.league} [asof=${j.asof.slice(0,10)} model=${j.model_id}]`;
  }
  const second = j.spread !== undefined ? `Spread ${j.spread >=0?"+":""}${j.spread} ${j.ou?`O/U ${j.ou}`:""} conf ${j.conf?.toFixed(2)}` : `conf ${j.conf?.toFixed(2)} • ${j.price ?? ""}`.trim();
  const why = `Why: ${top}`;
  const cta = `— alamost.com • Built solo • free-tier`;

  const raw = [hook, second, why, cta].filter(Boolean).join("\n");
  const scanned = slopScan(raw);
  const thread = scanned.fixed.split("\n");
  const citations = [`asof=${j.asof} model=${j.model_id} league=${j.league}`, ...((j.top??[]).map(t=>`driver=${t}`))];

  return { thread, citations, raw: scanned.fixed };
}

export function validateGrounding(j: Partial<MTNNLite>): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!j.league) missing.push("league");
  if (!j.asof) missing.push("asof");
  if (!j.model_id) missing.push("model_id");
  if (j.conf !== undefined && (j.conf < 0 || j.conf > 1)) missing.push("conf out of [0,1]");
  if (j.p_home !== undefined && (j.p_home < 0 || j.p_home > 1)) missing.push("p_home out of [0,1]");
  if (j.p_up !== undefined && (j.p_up < 0 || j.p_up > 1)) missing.push("p_up out of [0,1]");
  if (j.forecast_ret !== undefined && Math.abs(j.forecast_ret) > 0.5) missing.push("forecast_ret abs>0.5");
  return { ok: missing.length === 0, missing };
}

export default { slopScan, scrubCaption, generateCopyLite, validateGrounding };
