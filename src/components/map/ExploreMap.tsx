import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { gsap } from "gsap";
import { registerGsap } from "../../lib/gsap/register";
import type { Listing } from "../../lib/mock/listings";
import { useHover } from "../../lib/mock/store";

function makeIcon(price: number, active: boolean) {
  // Compact ETB price chip on the map.
  const display = price >= 1000 ? `ETB ${(price / 1000).toFixed(1)}k` : `ETB ${price}`;
  return L.divIcon({
    className: "",
    html: `<div class="luxe-marker ${active ? "active" : ""}">${display}</div>`,
    iconSize: [78, 28],
    iconAnchor: [39, 14],
  });
}

// Default center: Addis Ababa.
const ADDIS = { lat: 9.0192, lng: 38.7525 };

export function ExploreMap({ listings }: { listings: Listing[] }) {
  const hoveredId = useHover((s) => s.hoveredId);
  const setHover = useHover((s) => s.setHover);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    registerGsap();
  }, []);

  useEffect(() => {
    markerRefs.current.forEach((marker, id) => {
      const el = marker.getElement()?.querySelector(".luxe-marker") as HTMLElement | null;
      if (!el) return;
      gsap.to(el, {
        scale: id === hoveredId ? 1.35 : 1,
        duration: 0.5,
        ease: "luxe",
      });
      el.classList.toggle("active", id === hoveredId);
    });
  }, [hoveredId]);

  if (!ready) {
    return <div className="h-full w-full bg-paper-2" />;
  }

  // If filtered listings span multiple cities, fall back to a wider Ethiopia view.
  const cities = new Set(listings.map((l) => l.city));
  const center = listings[0]?.location ?? ADDIS;
  const zoom = cities.size > 1 ? 6 : 12;

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {listings.map((l) => (
        <Marker
          key={l.id}
          position={[l.location.lat, l.location.lng]}
          icon={makeIcon(l.pricePerNight, l.id === hoveredId)}
          eventHandlers={{
            add: (e) => {
              markerRefs.current.set(l.id, e.target);
            },
            remove: () => {
              markerRefs.current.delete(l.id);
            },
            mouseover: () => setHover(l.id),
            mouseout: () => setHover(null),
          }}
        />
      ))}
    </MapContainer>
  );
}
