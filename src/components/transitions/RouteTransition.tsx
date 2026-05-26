import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import { registerGsap } from "../../lib/gsap/register";

/**
 * Cinematic page transition driven by pathname changes.
 * A full-bleed curtain wipes down/up over the content while
 * the inner stage fades + scales. No content "pops" in.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const curtainRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    registerGsap();
    const curtain = curtainRef.current;
    const stage = stageRef.current;
    if (!curtain || !stage) return;

    if (firstRender.current) {
      firstRender.current = false;
      gsap.set(curtain, { scaleY: 0, transformOrigin: "top" });
      gsap.fromTo(
        stage,
        { opacity: 0, scale: 0.985 },
        { opacity: 1, scale: 1, duration: 0.9, ease: "luxe" },
      );
      return;
    }

    const tl = gsap.timeline();
    tl.set(curtain, { scaleY: 0, transformOrigin: "top" })
      .to(curtain, { scaleY: 1, duration: 0.45, ease: "silk" })
      .add(() => {
        // Reset stage to fresh state mid-curtain
        gsap.set(stage, { opacity: 0, scale: 0.985 });
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      })
      .set(curtain, { transformOrigin: "bottom" })
      .to(curtain, { scaleY: 0, duration: 0.55, ease: "silk" })
      .to(stage, { opacity: 1, scale: 1, duration: 0.8, ease: "luxe" }, "-=0.35");
  }, [pathname]);

  return (
    <>
      <div ref={curtainRef} className="page-curtain" aria-hidden />
      <div ref={stageRef} className="min-h-screen">
        {children}
      </div>
    </>
  );
}
