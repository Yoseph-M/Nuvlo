import { useNavigate } from "@tanstack/react-router";
import { Flip } from "gsap/Flip";
import { registerGsap } from "../../lib/gsap/register";
import { flipBridge } from "../../lib/gsap/flipBridge";
import { useParallaxImage } from "../../hooks/useParallaxImage";
import { useHover } from "../../lib/mock/store";
import { formatETB, type Listing } from "../../lib/mock/listings";

export function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const navigate = useNavigate();
  const setHover = useHover((s) => s.setHover);
  const { containerRef, imageRef } = useParallaxImage<HTMLDivElement, HTMLDivElement>(18);

  const onClick = () => {
    registerGsap();
    const el = document.querySelector(`[data-flip-id="${listing.id}"]`);
    if (el) {
      const state = Flip.getState(el, { props: "borderRadius" });
      flipBridge.set(listing.id, state);
    }
    navigate({ to: "/listing/$id", params: { id: listing.id } });
  };

  return (
    <article
      data-reveal
      onClick={onClick}
      onMouseEnter={() => setHover(listing.id)}
      onMouseLeave={() => setHover(null)}
      onFocus={() => setHover(listing.id)}
      onBlur={() => setHover(null)}
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-paper-2 rounded-sm border border-border/10 transition-all duration-500 group-hover:border-ink/20 group-hover:shadow-lg"
        style={{ aspectRatio: "4 / 5" }}
      >
        <div
          ref={imageRef}
          data-flip-id={listing.id}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${listing.images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center bg-paper/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-ink">
            {listing.neighborhood}
          </span>
          {listing.superhost && (
            <span className="inline-flex items-center bg-accent/95 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent-foreground">
              Superhost
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 bg-ink px-3 py-1.5 text-[11px] text-paper">
          {formatETB(listing.pricePerNight)}
          <span className="opacity-60"> / night</span>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-accent duration-300">{listing.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {listing.propertyType} · {listing.bedrooms} bed · up to {listing.maxGuests} guests
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {listing.city}, Ethiopia
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div className="text-ink">★ {listing.rating.toFixed(2)}</div>
          <div>{listing.reviews} reviews</div>
        </div>
      </div>
    </article>
  );
}
