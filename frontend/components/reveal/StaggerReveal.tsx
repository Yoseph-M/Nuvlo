import { type ReactNode } from "react";
import { useGsapContext } from "../../lib/gsap/useGsapContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: ReactNode;
  selector?: string;
  y?: number;
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
};

export function StaggerReveal({
  children,
  selector = "[data-reveal]",
  y = 40,
  stagger = 0.08,
  duration = 0.9,
  delay = 0,
  start = "top 85%",
  className,
  as: Tag = "div",
}: Props) {
  const ref = useGsapContext<HTMLDivElement>((ctx) => {
    const targets = ctx.selector!(selector) as Element[];
    if (!targets.length) return;
    gsap.set(targets, { opacity: 0, y, willChange: "transform,opacity" });
    ScrollTrigger.create({
      trigger: ref.current!,
      start,
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease: "slowReveal",
          clearProps: "willChange",
        });
      },
    });
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
