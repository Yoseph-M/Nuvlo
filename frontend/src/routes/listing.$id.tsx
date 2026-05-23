import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";
import { getListing, listings, formatETB, type Listing } from "../lib/mock/listings";
import { flipBridge } from "../lib/gsap/flipBridge";
import { Flip } from "gsap/Flip";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";
import { StaggerReveal } from "../../components/reveal/StaggerReveal";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { ListingCard } from "../../components/listing/ListingCard";

export const Route = createFileRoute("/listing/$id")({
  loader: ({ params }) => {
    const listing = getListing(params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  component: ListingDetail,
});

function ListingDetail() {
  const { listing } = Route.useLoaderData() as { listing: Listing };
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsap();
    const heroImg = heroRef.current?.querySelector(`[data-flip-id="${listing.id}"]`);
    const state = flipBridge.take(listing.id);

    const tl = gsap.timeline();

    if (state && heroImg) {
      Flip.from(state, {
        targets: heroImg,
        duration: 1,
        ease: "luxe",
        absolute: true,
        scale: false,
        onComplete: () => revealContent(),
      });
    } else {
      // Direct load — graceful entrance
      gsap.fromTo(
        heroImg!,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1, ease: "luxe" },
      );
      revealContent(0.2);
    }

    function revealContent(delay = 0) {
      const items = contentRef.current?.querySelectorAll("[data-stage]");
      if (!items?.length) return;
      gsap.fromTo(
        items,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.9, ease: "slowReveal", stagger: 0.08, delay },
      );
    }

    return () => {
      tl.kill();
    };
  }, [listing.id]);

  const related = listings.filter((l) => l.id !== listing.id && l.neighborhood === listing.neighborhood).slice(0, 3);

  return (
    <main className="pt-24">
      {/* Hero */}
      <section ref={heroRef} className="relative h-[80vh] w-full overflow-hidden">
        <div
          data-flip-id={listing.id}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${listing.images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 text-paper sm:px-12 lg:px-20">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">
            {listing.neighborhood} · {listing.city}, Ethiopia
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-6xl leading-[0.95] sm:text-7xl">{listing.title}</h1>
        </div>
      </section>

      <div ref={contentRef} className="px-8 py-20 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[2fr_1fr]">
          {/* Left */}
          <div className="space-y-16">
            <div data-stage className="flex flex-wrap items-center gap-6 border-b border-border pb-8 text-sm">
              <span>{listing.propertyType}</span>
              <span className="opacity-30">·</span>
              <span>{listing.bedrooms} bedrooms · {listing.beds} beds · {listing.baths} bath</span>
              <span className="opacity-30">·</span>
              <span>Up to {listing.maxGuests} guests</span>
              <span className="opacity-30">·</span>
              <span>★ {listing.rating.toFixed(2)} ({listing.reviews} reviews)</span>
              {listing.superhost && <><span className="opacity-30">·</span><span className="text-accent">Superhost</span></>}
            </div>

            <div data-stage className="flex items-center gap-4 border-b border-border pb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-2 font-display text-lg">
                {listing.hostName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm">Hosted by <span className="font-medium">{listing.hostName}</span></p>
                <p className="text-xs text-muted-foreground">Host since {listing.hostSince} · Cancellation: {listing.cancellationPolicy}</p>
              </div>
            </div>

            <p data-stage className="font-display text-3xl leading-snug">
              {listing.description}
            </p>

            <div data-stage>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">The residence</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {listing.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-3 border-b border-border py-3">
                    <span className="h-px w-6 bg-ink" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div data-stage className="grid grid-cols-2 gap-2">
              {listing.images.slice(1, 5).map((src, i) => (
                <div key={i} className="aspect-[4/5] bg-cover bg-center" style={{ backgroundImage: `url(${src})` }} />
              ))}
            </div>
          </div>

          {/* Right — booking panel */}
          <aside data-stage className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-ink p-8">
              <div className="flex items-end justify-between">
                <div className="font-display text-4xl">{formatETB(listing.pricePerNight)}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">per night</div>
              </div>
              <div className="mt-8 space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="text-muted-foreground">Check-in</span>
                  <input type="date" className="bg-transparent text-right outline-none" />
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="text-muted-foreground">Check-out</span>
                  <input type="date" className="bg-transparent text-right outline-none" />
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="text-muted-foreground">Guests</span>
                  <select className="bg-transparent text-right outline-none">
                    {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-8">
                <MagneticButton className="w-full">Reserve</MagneticButton>
              </div>
              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                You won't be charged yet
              </p>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-32">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-4xl">More in {listing.neighborhood}</h2>
              <Link to="/explore" className="text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100">
                Explore all →
              </Link>
            </div>
            <StaggerReveal className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {related.map((l, i) => (
                <ListingCard key={l.id} listing={l} index={i} />
              ))}
            </StaggerReveal>
          </section>
        )}
      </div>
    </main>
  );
}
