import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useState } from "react";
import { getListing, listings, formatETB, type Listing } from "../lib/mock/listings";
import { flipBridge } from "../lib/gsap/flipBridge";
import { Flip } from "gsap/Flip";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";
import { StaggerReveal } from "../components/reveal/StaggerReveal";
import { MagneticButton } from "../components/ui/MagneticButton";
import { ListingCard } from "../components/listing/ListingCard";
import { CalendarIcon, User, CheckCircle2, Ticket } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { toast } from "sonner";

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

  // Custom states for booking flow
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 4),
  });
  const [guests, setGuests] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingCode, setBookingCode] = useState("");

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

  // Dynamic calculations
  const nights = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const baseTotal = listing.pricePerNight * nights;
  const cleaningFee = Math.round(listing.pricePerNight * 0.1);
  const serviceFee = Math.round(listing.pricePerNight * 0.05);
  const grandTotal = baseTotal + cleaningFee + serviceFee;

  const handleReserve = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select a valid check-in & check-out range.");
      return;
    }
    const code = `NV-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingCode(code);
    setShowConfirmation(true);
    toast.success("Stay reserved successfully!");
  };

  return (
    <main className="pt-24 text-ink">
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

      <div ref={contentRef} className="px-8 py-20 sm:px-12 lg:px-20 bg-paper/30 dark:bg-paper/5">
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-2 dark:bg-paper-2/40 font-display text-lg">
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
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">The residence</p>
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
                <div key={i} className="aspect-[4/5] bg-cover bg-center transition-all duration-700 hover:scale-[1.02] cursor-pointer" style={{ backgroundImage: `url(${src})` }} />
              ))}
            </div>
          </div>

          {/* Right — booking panel */}
          <aside data-stage className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-ink/40 p-8 shadow-sm bg-paper/60 backdrop-blur-md rounded-sm">
              <div className="flex items-end justify-between">
                <div className="font-display text-4xl">{formatETB(listing.pricePerNight)}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">per night</div>
              </div>

              {/* Styled Date Range Picker */}
              <div className="mt-8 space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">Dates</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex w-full items-center gap-3 border border-border px-4 py-3 text-left text-sm transition-colors hover:border-ink cursor-pointer bg-transparent rounded-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd, yyyy")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, yyyy")
                            )
                          ) : (
                            <span className="text-muted-foreground">Select stays dates</span>
                          )}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-paper border border-border" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                        disabled={{ before: new Date() }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Elegant Guest Counter */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">Guests</span>
                  <div className="flex items-center justify-between border border-border px-4 py-2.5 text-sm rounded-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{guests} guest{guests > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:border-ink hover:text-ink transition-colors cursor-pointer text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={guests <= 1}
                      >
                        -
                      </button>
                      <button
                        onClick={() => setGuests(Math.min(listing.maxGuests, guests + 1))}
                        className="h-7 w-7 rounded-full border border-border flex items-center justify-center hover:border-ink hover:text-ink transition-colors cursor-pointer text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={guests >= listing.maxGuests}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Cost Breakdowns */}
              {nights > 0 && (
                <div className="mt-8 space-y-4 border-t border-border/20 pt-6 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{formatETB(listing.pricePerNight)} x {nights} nights</span>
                    <span className="font-medium text-ink">{formatETB(baseTotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Cleaning fee</span>
                    <span className="font-medium text-ink">{formatETB(cleaningFee)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Service fee</span>
                    <span className="font-medium text-ink">{formatETB(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/20 pt-4 text-base font-semibold">
                    <span>Total</span>
                    <span>{formatETB(grandTotal)}</span>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <MagneticButton onClick={handleReserve} className="w-full">
                  {nights > 0 ? "Reserve stay" : "Select stay dates"}
                </MagneticButton>
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

      {/* Confirmation Dialog Component */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md bg-paper border border-border p-8 rounded-md text-ink">
          <DialogHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner mb-4">
              <CheckCircle2 className="h-8 w-8 stroke-[1.5]" />
            </div>
            <DialogTitle className="font-display text-4xl font-normal">Reservation Confirmed</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-[0.16em] mt-2">
              Your considered stay is secured
            </DialogDescription>
          </DialogHeader>

          {/* Receipt Info */}
          <div className="mt-6 border border-border/30 bg-paper-2/30 p-5 space-y-4 rounded-sm">
            <div className="flex items-center justify-between border-b border-border/20 pb-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <span className="flex items-center gap-1.5"><Ticket className="h-3.5 w-3.5" /> Reference</span>
              <span className="font-semibold text-ink">{bookingCode}</span>
            </div>
            <div className="space-y-2 text-sm">
              <h4 className="font-display text-xl leading-tight">{listing.title}</h4>
              <p className="text-xs text-muted-foreground">{listing.neighborhood}, {listing.city}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-3 text-xs uppercase tracking-[0.1em]">
              <div>
                <span className="text-muted-foreground block mb-1">Check In</span>
                <span className="font-semibold text-ink">{dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">Check Out</span>
                <span className="font-semibold text-ink">{dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "—"}</span>
              </div>
            </div>
            <div className="flex justify-between border-t border-border/20 pt-3 text-sm font-semibold">
              <span>Total calculated</span>
              <span>{formatETB(grandTotal)}</span>
            </div>
          </div>

          <div className="mt-8">
            <MagneticButton onClick={() => setShowConfirmation(false)} className="w-full">
              Continue Exploring
            </MagneticButton>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
