import { createFileRoute, Link } from "@tanstack/react-router";
import { listings } from "../lib/mock/listings";
import { ListingGrid } from "../../components/listing/ListingGrid";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { StaggerReveal } from "../../components/reveal/StaggerReveal";
import { useGsapContext } from "../lib/gsap/useGsapContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const REGIONS = [
  { name: "Addis Ababa", note: "Capital · cafés, culture, coffee" },
  { name: "Lalibela",    note: "Rock-hewn churches · pilgrim trails" },
  { name: "Gondar",      note: "Castles of Fasil Ghebbi" },
  { name: "Bahir Dar",   note: "Lake Tana · Blue Nile Falls" },
  { name: "Harar",       note: "Walled city · UNESCO heritage" },
  { name: "Simien",      note: "High mountains · gelada country" },
];

function Landing() {
  const featured = listings.slice(0, 6);

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
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, []);

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
            scale: "1.1",
          }}
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-24 text-paper sm:px-12 lg:px-20">
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
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link to="/explore">
              <MagneticButton>Browse all stays</MagneticButton>
            </Link>
            <Link to="/host/new" className="text-xs uppercase tracking-[0.22em] opacity-80 hover:opacity-100">
              Host on Bet →
            </Link>
          </div>
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
              className="group block border-t border-ink/15 pt-6"
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
