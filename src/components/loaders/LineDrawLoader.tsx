import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { registerGsap } from "../../lib/gsap/register";

type Props = {
  ready: boolean;
  children: React.ReactNode;
};

export function LineDrawLoader({ ready, children }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    registerGsap();
    if (!overlayRef.current) return;
    const paths = overlayRef.current.querySelectorAll("path");
    gsap.set(paths, { strokeDasharray: 220, strokeDashoffset: 220 });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.4,
      ease: "silk",
      stagger: 0.12,
      repeat: -1,
      yoyo: true,
    });
  }, []);

  useEffect(() => {
    if (!ready || !overlayRef.current) return;
    const tl = gsap.timeline({ onComplete: () => setHidden(true) });
    tl.to(overlayRef.current.querySelectorAll("path"), {
      strokeDashoffset: 0,
      duration: 0.4,
      ease: "luxe",
    }).to(overlayRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "luxe",
    });
  }, [ready]);

  return (
    <div className="relative">
      {children}
      {!hidden && (
        <div
          ref={overlayRef}
          className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-paper"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path d="M20 60 Q60 10 100 60" stroke="currentColor" strokeWidth="1.2" />
            <path d="M20 80 Q60 30 100 80" stroke="currentColor" strokeWidth="1.2" />
            <path d="M20 40 Q60 90 100 40" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      )}
    </div>
  );
}
