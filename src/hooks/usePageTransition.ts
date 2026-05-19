import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";

/**
 * Exposes scoped animateIn / animateOut methods for a route's stage.
 * Owns its own gsap.context, reverted on unmount — no leaked tweens,
 * no lingering ScrollTriggers.
 *
 * Usage:
 *   const { scopeRef, animateIn, animateOut } = usePageTransition();
 *   <section ref={scopeRef}> ... </section>
 *
 * Wire animateOut() into the router exit handler and await its promise
 * before unmounting, then call animateIn() in a layout effect.
 */
export function usePageTransition<T extends HTMLElement = HTMLDivElement>() {
  const scopeRef = useRef<T | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    registerGsap();
    if (!scopeRef.current) return;
    ctxRef.current = gsap.context(() => {}, scopeRef.current);
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, []);

  const animateIn = useCallback((): Promise<void> => {
    const scope = scopeRef.current;
    const ctx = ctxRef.current;
    if (!scope || !ctx) return Promise.resolve();
    return new Promise((resolve) => {
      ctx.add(() => {
        const targets = scope.querySelectorAll<HTMLElement>("[data-reveal]");
        const tl = gsap.timeline({ onComplete: () => resolve() });
        tl.fromTo(
          scope,
          { autoAlpha: 0, scale: 0.985 },
          { autoAlpha: 1, scale: 1, duration: 0.7, ease: "luxe" },
        );
        if (targets.length) {
          tl.fromTo(
            targets,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "luxe", stagger: 0.06 },
            "-=0.35",
          );
        }
      });
    });
  }, []);

  const animateOut = useCallback((): Promise<void> => {
    const scope = scopeRef.current;
    const ctx = ctxRef.current;
    if (!scope || !ctx) return Promise.resolve();
    return new Promise((resolve) => {
      ctx.add(() => {
        gsap.to(scope, {
          autoAlpha: 0,
          scale: 0.96,
          duration: 0.45,
          ease: "silk",
          onComplete: () => resolve(),
        });
      });
    });
  }, []);

  return { scopeRef, animateIn, animateOut };
}
