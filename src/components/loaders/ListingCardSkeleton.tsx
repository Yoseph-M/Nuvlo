import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGsap } from "../../lib/gsap/register";

/**
 * Line-draw skeleton for a listing card slot.
 * Strokes draw on via strokeDashoffset, hold briefly, then the parent
 * cross-dissolves to the real card when data resolves.
 */
export function ListingCardSkeleton({ index = 0 }: { index?: number }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const paths = root.querySelectorAll<SVGPathElement | SVGRectElement>("[data-stroke]");
      paths.forEach((p) => {
        const len = (p as SVGGeometryElement).getTotalLength?.() ?? 600;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap
        .timeline({ delay: index * 0.05 })
        .to(paths, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "luxe",
          stagger: 0.08,
        })
        .to({}, { duration: 0.25 });
    }, root);
    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={rootRef} className="opacity-90" aria-hidden>
      <svg
        viewBox="0 0 400 500"
        className="block w-full"
        style={{ aspectRatio: "4 / 5" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <rect data-stroke x="1" y="1" width="398" height="498" />
        <path data-stroke d="M 30 380 L 370 380" />
        <path data-stroke d="M 30 410 L 260 410" />
        <path data-stroke d="M 30 440 L 180 440" />
      </svg>
      <div className="mt-4 space-y-2">
        <svg viewBox="0 0 400 22" className="block w-full" fill="none" stroke="currentColor">
          <path data-stroke d="M 0 11 L 280 11" strokeWidth="1.5" />
        </svg>
        <svg viewBox="0 0 400 14" className="block w-2/3" fill="none" stroke="currentColor">
          <path data-stroke d="M 0 7 L 220 7" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
