import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, lazy, Suspense, useEffect } from "react";
import {
  listings,
  ALL_REGIONS,
  ALL_PROPERTY_TYPES,
  formatETB,
  type Listing,
  type PropertyType,
} from "../lib/mock/listings";
import { ListingCard } from "../components/listing/ListingCard";
import { useFilters } from "../lib/mock/store";
import { SlidersHorizontal } from "lucide-react";
import { Slider } from "../components/ui/slider";
import { Switch } from "../components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

const ExploreMap = lazy(() =>
  import("../components/map/ExploreMap").then((m) => ({ default: m.ExploreMap })),
);

export const Route = createFileRoute("/explore")({
  component: Explore,
});

function FilterContent({
  propertyType,
  setPropertyType,
  superhostOnly,
  setSuperhostOnly,
  instantOnly,
  setInstantOnly,
}: {
  propertyType: PropertyType | "All";
  setPropertyType: (t: PropertyType | "All") => void;
  superhostOnly: boolean;
  setSuperhostOnly: (v: boolean) => void;
  instantOnly: boolean;
  setInstantOnly: (v: boolean) => void;
}) {
  const filters = useFilters();

  const toggleHood = (h: string) => {
    const has = filters.neighborhoods.includes(h);
    filters.set({
      neighborhoods: has
        ? filters.neighborhoods.filter((x) => x !== h)
        : [...filters.neighborhoods, h],
    });
  };

  return (
    <div className="space-y-10 pb-8 text-ink">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Region</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_REGIONS.map((h) => {
            const on = filters.neighborhoods.includes(h);
            return (
              <button
                key={h}
                onClick={() => toggleHood(h)}
                className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-300 rounded-sm cursor-pointer ${
                  on
                    ? "border-ink bg-ink text-paper shadow-xs scale-[1.03]"
                    : "border-border text-ink hover:border-ink/50"
                }`}
              >
                {h}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Property type</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["All", ...ALL_PROPERTY_TYPES] as const).map((t) => {
            const on = propertyType === t;
            return (
              <button
                key={t}
                onClick={() => setPropertyType(t)}
                className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-all duration-300 rounded-sm cursor-pointer ${
                  on
                    ? "border-ink bg-ink text-paper shadow-xs scale-[1.03]"
                    : "border-border text-ink hover:border-ink/50"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Max price / night</p>
          <p className="text-sm font-medium">{formatETB(filters.maxPrice)}</p>
        </div>
        <Slider
          min={1000}
          max={10000}
          step={100}
          value={[filters.maxPrice]}
          onValueChange={([val]) => filters.set({ maxPrice: val })}
          className="mt-4"
        />
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Guests</p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6].map((g) => (
            <button
              key={g}
              onClick={() => filters.set({ guests: g })}
              className={`h-9 w-9 flex-shrink-0 rounded-full border text-xs transition-all duration-300 cursor-pointer ${
                filters.guests === g
                  ? "border-ink bg-ink text-paper font-semibold scale-110 shadow-xs"
                  : "border-border text-ink hover:border-ink/60"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t border-border/10 pt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-display text-base">Superhost only</span>
          <Switch
            checked={superhostOnly}
            onCheckedChange={setSuperhostOnly}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-display text-base">Instant book</span>
          <Switch
            checked={instantOnly}
            onCheckedChange={setInstantOnly}
          />
        </div>
      </div>

      <button
        onClick={() => {
          filters.reset();
          setPropertyType("All");
          setSuperhostOnly(false);
          setInstantOnly(false);
        }}
        className="w-full text-center py-2.5 border border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-ink hover:border-ink/40 transition-colors rounded-sm cursor-pointer font-semibold"
      >
        Reset all filters
      </button>
    </div>
  );
}

function Explore() {
  const filters = useFilters();
  const [mounted, setMounted] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType | "All">("All");
  const [superhostOnly, setSuperhostOnly] = useState(false);
  const [instantOnly, setInstantOnly] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = useMemo<Listing[]>(() => {
    return listings.filter((l) => {
      if (l.pricePerNight < filters.minPrice || l.pricePerNight > filters.maxPrice) return false;
      if (l.maxGuests < filters.guests) return false;
      if (filters.neighborhoods.length && !filters.neighborhoods.includes(l.neighborhood)) return false;
      if (propertyType !== "All" && l.propertyType !== propertyType) return false;
      if (superhostOnly && !l.superhost) return false;
      if (instantOnly && !l.instantBook) return false;
      return true;
    });
  }, [filters, propertyType, superhostOnly, instantOnly]);

  return (
    <main className="pt-24">
      <div className="grid h-[calc(100vh-6rem)] grid-cols-1 lg:grid-cols-[300px_1fr_minmax(0,1fr)]">
        {/* Filter rail for Desktop */}
        <aside className="hidden overflow-y-auto border-r border-border p-8 lg:block">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Refine</p>
          <h2 className="mt-2 font-display text-3xl mb-8">{filtered.length} stays in Ethiopia</h2>
          <FilterContent
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            superhostOnly={superhostOnly}
            setSuperhostOnly={setSuperhostOnly}
            instantOnly={instantOnly}
            setInstantOnly={setInstantOnly}
          />
        </aside>

        {/* Feed */}
        <section className="feed-scroll overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 xl:grid-cols-2">
            {filtered.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-20 text-center text-sm text-muted-foreground">
              Nothing matches yet — loosen a filter.
            </p>
          )}
        </section>

        {/* Map */}
        <section className="relative hidden lg:block">
          {mounted && (
            <Suspense fallback={<div className="h-full w-full bg-paper-2" />}>
              <ExploreMap listings={filtered} />
            </Suspense>
          )}
        </section>
      </div>

      {/* Floating Action Button for Mobile Filters */}
      <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-paper shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters {filtered.length > 0 && `(${filtered.length})`}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] overflow-y-auto bg-paper px-6 py-8 dark:bg-paper rounded-t-xl border-t border-border/10">
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="font-display text-3xl font-normal text-ink">Filters</SheetTitle>
              <SheetDescription className="text-xs uppercase tracking-[0.16em]">
                {filtered.length} stays matching in Ethiopia
              </SheetDescription>
            </SheetHeader>
            <FilterContent
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              superhostOnly={superhostOnly}
              setSuperhostOnly={setSuperhostOnly}
              instantOnly={instantOnly}
              setInstantOnly={setInstantOnly}
            />
          </SheetContent>
        </Sheet>
      </div>
    </main>
  );
}
