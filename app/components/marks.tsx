/**
 * The firm's one image: a round arch, and a corridor of arches receding to a
 * single vanishing point. Pure SVG, drawn with currentColor so it follows the
 * theme; the doorway at the end carries the accent.
 */

/** Open round-arch path: up the left jamb, over the semicircle, down the right. */
function arch(cx: number, bottom: number, w: number, h: number) {
  const r = w / 2;
  const spring = bottom - h + r;
  return `M${cx - r} ${bottom}V${spring}A${r} ${r} 0 0 1 ${cx + r} ${spring}V${bottom}`;
}

/** Closed arch, for the filled doorway. */
function door(cx: number, bottom: number, w: number, h: number) {
  return `${arch(cx, bottom, w, h)}Z`;
}

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 28"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <path d={arch(12, 27, 20, 26)} stroke="currentColor" strokeWidth="1.5" />
      <path d={door(12, 27, 8, 13)} fill="var(--accent)" />
      <path d="M0 27.25H24" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* One-point perspective: each arch is the first, scaled about the vanishing point. */
const VP = { x: 240, y: 204 };
const OUTER = { w: 360, bottom: 330, h: 330 };
const DEPTHS = [1, 0.74, 0.55, 0.41, 0.305, 0.228];
const DOOR = 0.17;

function at(s: number) {
  return {
    cx: VP.x,
    w: OUTER.w * s,
    h: OUTER.h * s,
    bottom: VP.y + (OUTER.bottom - VP.y) * s,
  };
}

export function Corridor({ className = "" }: { className?: string }) {
  const d = at(DOOR);
  return (
    <svg
      viewBox="0 0 480 332"
      className={`corridor ${className}`}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
    >
      {/* floor lines, converging on the doorway */}
      <path
        className="floor"
        pathLength={1}
        d={`M${VP.x - OUTER.w / 2} ${OUTER.bottom}L${d.cx - d.w / 2} ${d.bottom}`}
        strokeOpacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="floor"
        pathLength={1}
        d={`M${VP.x + OUTER.w / 2} ${OUTER.bottom}L${d.cx + d.w / 2} ${d.bottom}`}
        strokeOpacity="0.5"
        vectorEffect="non-scaling-stroke"
      />
      {/* transverse floor joints under each arch */}
      {DEPTHS.slice(1).map((s) => {
        const a = at(s);
        return (
          <path
            key={`j${s}`}
            className="floor"
            pathLength={1}
            d={`M${a.cx - a.w / 2} ${a.bottom}H${a.cx + a.w / 2}`}
            strokeOpacity="0.28"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {/* the arches, nearest first */}
      {DEPTHS.map((s, i) => {
        const a = at(s);
        return (
          <path
            key={s}
            className="arch"
            pathLength={1}
            d={arch(a.cx, a.bottom, a.w, a.h)}
            strokeOpacity={1 - i * 0.12}
            style={{ ["--i" as string]: DEPTHS.length - 1 - i }}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {/* the doorway at the end of the corridor */}
      <path className="door" d={door(d.cx, d.bottom, d.w, d.h)} fill="var(--accent)" stroke="none" />
      {/* ground line */}
      <path d="M0 331H480" strokeOpacity="0.9" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
