import { bloomSvg } from "../lib/foil";

/**
 * The card's own refractor.
 *
 * Decorative, so it is hidden from assistive technology — the card's name and
 * attributes carry the meaning. Rendered inline rather than as an <img> so it
 * costs no request and inherits the page's own colours.
 */
export default function Foil({
  seed,
  rayCount,
  grain,
  className,
}: {
  seed: string;
  rayCount?: number;
  grain?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      // Server-generated from lib/foil.ts; the only interpolated values are
      // numbers this module computed itself.
      dangerouslySetInnerHTML={{ __html: bloomSvg(seed, { rayCount, grain }) }}
    />
  );
}
