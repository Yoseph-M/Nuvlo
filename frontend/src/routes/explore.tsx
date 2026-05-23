import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, lazy, Suspense, useEffect } from "react";
import {
  listings, ALL_REGIONS, ALL_PROPERTY_TYPES, formatETB,
  type Listing, type PropertyType,
} from "../lib/mock/listings";
import { ListingCard } from "../../components/listing/ListingCard";
import { useFilters } from "../lib/mock/store";

const ExploreMap = lazy(() =>
  import("../../components/map/ExploreMap").then((m) => ({ default: m.ExploreMap })),
);

export const Route = createFileRoute("/explore")({
  component: Explore,
});

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

  const toggleHood = (h: string) => {
    const has = filters.neighborhoods.includes(h);
    filters.set({
      neighborhoods: has
        ? filters.neighborhoods.filter((x) => x !== h)
        : [...filters.neighborhoods, h],
    });
  };

  return (
    <main className="pt-24">
      <div className="grid h-[calc(100vh-6rem)] grid-cols-1 lg:grid-cols-[300px_1fr_minmax(0,1fr)]">
        {/* Filter rail */}
        <aside className="hidden overflow-y-auto border-r border-border p-8 lg:block">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Refine</p>
          <h2 className="mt-2 font-display text-2xl">{filtered.length} stays in Ethiopia</h2>

          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Region</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ALL_REGIONS.map((h) => {
                const on = filters.neighborhoods.includes(h);
                return (
                  <button
                    key={h}
                    onClick={() => toggleHood(h)}
                    className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors ${on ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"}`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Property type</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["All", ...ALL_PROPERTY_TYPES] as const).map((t) => {
                const on = propertyType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setPropertyType(t)}
                    className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] transition-colors ${on ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Max price / night</p>
            <input
              type="range"
              min={1000}
              max={10000}
              step={100}
              value={filters.maxPrice}
              onChange={(e) => filters.set({ maxPrice: Number(e.target.value) })}
              className="mt-3 w-full accent-ink"
            />
            <p className="mt-1 text-sm">{formatETB(filters.maxPrice)}</p>
          </div>

          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Guests</p>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <button
                  key={g}
                  onClick={() => filters.set({ guests: g })}
                  className={`h-9 w-9 border text-sm transition-colors ${filters.guests === g ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <label className="flex cursor-pointer items-center justify-between text-sm">
              <span>Superhost only</span>
              <input
                type="checkbox"
                checked={superhostOnly}
                onChange={(e) => setSuperhostOnly(e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between text-sm">
              <span>Instant book</span>
              <input
                type="checkbox"
                checked={instantOnly}
                onChange={(e) => setInstantOnly(e.target.checked)}
                className="h-4 w-4 accent-ink"
              />
            </label>
          </div>

          <button
            onClick={() => {
              filters.reset();
              setPropertyType("All");
              setSuperhostOnly(false);
              setInstantOnly(false);
            }}
            className="mt-10 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-ink"
          >
            Reset filters
          </button>
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
    </main>
  );
}
