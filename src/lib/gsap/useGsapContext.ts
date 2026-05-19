import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerGsap } from "./register";

/**
 * Scoped GSAP context. All selectors and tweens created inside `setup(ctx)`
 * are auto-reverted on unmount. Pass deps to re-run setup.
 */
export function useGsapContext<T extends HTMLElement = HTMLElement>(
  setup: (ctx: gsap.Context) => void,
  deps: ReadonlyArray<unknown> = [],
) {
  const scopeRef = useRef<T | null>(null);

  useEffect(() => {
    registerGsap();
    if (!scopeRef.current) return;
    const ctx = gsap.context(setup, scopeRef.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
