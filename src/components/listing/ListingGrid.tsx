import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Listing } from "../../lib/mock/listings";
import { ListingCard } from "./ListingCard";
import { StaggerReveal } from "../reveal/StaggerReveal";
import { ListingCardSkeleton } from "../loaders/ListingCardSkeleton";
import { registerGsap } from "../../lib/gsap/register";

export function ListingGrid({
  listings,
  loading = false,
  skeletonCount = 6,
}: {
  listings: Listing[];
  loading?: boolean;
  skeletonCount?: number;
}) {
  const [showReal, setShowReal] = useState(!loading);
  const skelRef = useRef<HTMLDivElement | null>(null);
  const realRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) {
      setShowReal(false);
      return;
    }
    registerGsap();
    const tl = gsap.timeline({ onComplete: () => setShowReal(true) });
    if (skelRef.current) {
      tl.to(skelRef.current, { autoAlpha: 0, duration: 0.5, ease: "silk" });
    }
    return () => {
      tl.kill();
    };
  }, [loading]);

  if (!showReal) {
    return (
      <div ref={skelRef} className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 text-ink/40">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ListingCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div ref={realRef}>
      <StaggerReveal className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l, i) => (
          <ListingCard key={l.id} listing={l} index={i} />
        ))}
      </StaggerReveal>
    </div>
  );
}
