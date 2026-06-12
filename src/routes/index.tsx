import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { listings, ALL_REGIONS, type Region } from "../lib/mock/listings";
import { ListingGrid } from "../components/listing/ListingGrid";
import { MagneticButton } from "../components/ui/MagneticButton";
import { StaggerReveal } from "../components/reveal/StaggerReveal";
import { useGsapContext } from "../lib/gsap/useGsapContext";
import { authClient } from "../lib/auth-client";
import { getAuthenticatedRedirectPath } from "../lib/auth-routing";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Waves,
  Mountain,
  Castle,
  TreePine,
  Droplets,
  Snowflake,
  Wheat,
  Home,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bet · ቤት — Considered stays across Ethiopia" },
      {
        name: "description",
        content:
          "Hand-edited short-term homes across Addis Ababa, Lalibela, Gondar, Bahir Dar, Axum, Harar and the Simien — booked in Birr, hosted by Ethiopians.",
      },
    ],
  }),
  component: Landing,
});

const CATEGORIES = [
  { label: "All stays", icon: Home },
  { label: "Lakefront", icon: Waves },
  { label: "Highland", icon: Mountain },
  { label: "Heritage", icon: Castle },
  { label: "Forest", icon: TreePine },
  { label: "Pools", icon: Droplets },
  { label: "Arctic", icon: Snowflake },
  { label: "Farms", icon: Wheat },
  { label: "Top rated", icon: Star },
];

const REGIONS = [
  { name: "Addis Ababa", note: "Capital · cafés, culture, coffee" },
  { name: "Lalibela", note: "Rock-hewn churches · pilgrim trails" },
  { name: "Gondar", note: "Castles of Fasil Ghebbi" },
  { name: "Bahir Dar", note: "Lake Tana · Blue Nile Falls" },
  { name: "Harar", note: "Walled city · UNESCO heritage" },
  { name: "Simien", note: "High mountains · gelada country" },
];

function Landing() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const authenticatedRedirectPath = getAuthenticatedRedirectPath(session?.user);
  const [activeCategory, setActiveCategory] = useState(0);
  const [destination, setDestination] = useState("");
  const featured = listings.slice(0, 6);

  // Scroll-reveal via IntersectionObserver
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    const reveals = document.querySelectorAll(".reveal-fade-up");
    reveals.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const heroRef = useGsapContext<HTMLElement>((ctx) => {
    const words = ctx.selector!(".hero-word") as Element[];
    gsap.set(words, { yPercent: 110, opacity: 0 });
    gsap.to(words, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: "slowReveal",
      stagger: 0.08,
      delay: 0.35,
    });

    // Parallax background at 60% scroll speed
    const img = ctx.selector!(".hero-image")[0] as HTMLElement;
    if (img) {
      gsap.to(img, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Animate search card
    const card = ctx.selector!(".search-card")[0] as HTMLElement;
    if (card) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.8 }
      );
    }

    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, []);

  const handleSearch = useCallback(() => {
    navigate({ to: "/explore" });
  }, [navigate]);

  if (isSessionPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading session...</p>
      </main>
    );
  }

  if (authenticatedRedirectPath) {
    return <Navigate to={authenticatedRedirectPath} />;
  }

  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <div
          className="hero-image absolute inset-0 will-change-transform"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=2400&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            scale: "1.15",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-32 text-paper sm:px-12 lg:px-20">
          <div className="overflow-hidden">
            <p className="mb-8 text-[10px] uppercase tracking-[0.3em] opacity-80">
              ቤት · Bet · Considered stays across Ethiopia · {listings.length} homes
            </p>
          </div>
          <h1 className="max-w-5xl font-display text-[12vw] leading-[0.95] sm:text-[9vw] lg:text-[7vw]">
            {"Stay where Ethiopia".split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="hero-word inline-block pr-[0.18em]">{w}</span>
              </span>
            ))}
            <br />
            {"feels like home.".split(" ").map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="hero-word inline-block pr-[0.18em] italic text-accent">{w}</span>
              </span>
            ))}
          </h1>

          {/* Floating Search Card */}
          <div className="search-card mt-10 max-w-3xl rounded-xl p-6 sm:p-8" style={{ opacity: 0 }}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="sm:col-span-1">
                <label className="text-[10px] uppercase tracking-[0.18em] text-ink/60 font-semibold">
                  Destination
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?"
                    className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
                  />
                </div>
              </div>
              <div className="sm:col-span-1 sm:border-l sm:border-border/30 sm:pl-4">
                <label className="text-[10px] uppercase tracking-[0.18em] text-ink/60 font-semibold">
                  Check in
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-sm text-ink/50">Add dates</span>
                </div>
              </div>
              <div className="sm:col-span-1 sm:border-l sm:border-border/30 sm:pl-4">
                <label className="text-[10px] uppercase tracking-[0.18em] text-ink/60 font-semibold">
                  Guests
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm text-ink/50">Add guests</span>
                </div>
              </div>
              <div className="flex items-end sm:col-span-1">
                <button
                  onClick={handleSearch}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-[11px] uppercase tracking-[0.18em] text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-lg cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Rail */}
      <section className="sticky top-[72px] z-30 border-b border-border/10 bg-paper/95 backdrop-blur-lg py-4 px-8 sm:px-12 lg:px-20">
        <div className="snap-rail">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(i)}
                className={`category-pill ${activeCategory === i ? "active" : ""}`}
              >
                <Icon className="pill-icon h-5 w-5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Manifesto */}
      <section className="px-8 py-32 sm:px-12 lg:px-20">
        <StaggerReveal className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <p data-reveal className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:col-span-3">
            Our standing brief
          </p>
          <p data-reveal className="font-display text-3xl leading-snug sm:text-4xl lg:col-span-9">
            Every home is visited in person. Every host is met over bunna. We keep the collection
            small on purpose — so an evening in Addis, a morning above Lalibela, or a week on
            Lake Tana feels like staying with someone who knows the country.
          </p>
        </StaggerReveal>
      </section>

      {/* Regions */}
      <section className="border-t border-border px-8 py-24 sm:px-12 lg:px-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Where to stay</p>
            <h2 className="mt-3 font-display text-5xl">Regions we cover</h2>
          </div>
        </div>
        <StaggerReveal className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => (
            <Link
              key={r.name}
              to="/explore"
              data-reveal
              className="group block border-t border-ink/15 pt-6 hover-lift"
            >
              <h3 className="font-display text-3xl">{r.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{r.note}</p>
              <span className="mt-4 inline-block text-[11px] uppercase tracking-[0.22em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                See stays →
              </span>
            </Link>
          ))}
        </StaggerReveal>
      </section>

      {/* Featured grid */}
      <section className="px-8 pb-32 pt-24 sm:px-12 lg:px-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Now showing</p>
            <h2 className="mt-3 font-display text-5xl">Featured homes</h2>
          </div>
          <Link to="/explore" className="hidden text-xs uppercase tracking-[0.2em] opacity-70 hover:opacity-100 sm:inline">
            View all {listings.length} →
          </Link>
        </div>
        <ListingGrid listings={featured} />
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-16 sm:px-12 lg:px-20">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div>
            <div className="font-display text-3xl">
              Bet<span className="text-accent">.</span>
            </div>
            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              ቤት · Ethiopian short-term stays
            </p>
          </div>
          <p className="max-w-sm text-xs text-muted-foreground">
            Prices in Ethiopian Birr (ETB). All listings illustrative — a frontend showcase
            choreographed with GSAP.
          </p>
        </div>
      </footer>
    </main>
  );
}
