import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";

/**
 * Subtle background parallax on pointer move.
 * Returns refs for the container and the inner image-bearing element.
 */
export function useParallaxImage<C extends HTMLElement, I extends HTMLElement>(
  intensity = 14,
) {
  const containerRef = useRef<C | null>(null);
  const imageRef = useRef<I | null>(null);

  useEffect(() => {
    registerGsap();
    const c = containerRef.current;
    const i = imageRef.current;
    if (!c || !i) return;

    const xTo = gsap.quickTo(i, "x", { duration: 0.8, ease: "luxe" });
    const yTo = gsap.quickTo(i, "y", { duration: 0.8, ease: "luxe" });
    const sTo = gsap.quickTo(i, "scale", { duration: 0.8, ease: "luxe" });

    const onEnter = () => sTo(1.06);
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      xTo(dx * intensity);
      yTo(dy * intensity);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      sTo(1);
    };

    c.addEventListener("pointerenter", onEnter);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerleave", onLeave);
    return () => {
      c.removeEventListener("pointerenter", onEnter);
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerleave", onLeave);
    };
  }, [intensity]);

  return { containerRef, imageRef };
}
