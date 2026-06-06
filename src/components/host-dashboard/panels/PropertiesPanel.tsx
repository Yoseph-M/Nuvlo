import { useState, useRef } from "react";
import {
  Zap,
  Droplets,
  Wifi,
  Sun,
  MapPin,
  ImagePlus,
  X,
  ChevronDown,
} from "lucide-react";

interface UtilityToggle {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const UTILITIES: UtilityToggle[] = [
  { id: "generator", label: "Generator", icon: <Zap size={18} /> },
  { id: "water_tank", label: "Water Tank", icon: <Droplets size={18} /> },
  { id: "wifi", label: "WiFi", icon: <Wifi size={18} /> },
  { id: "solar", label: "Solar Power", icon: <Sun size={18} /> },
];

interface Photo {
  id: string;
  url: string;
  name: string;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.25em] text-black/40 mb-4 pt-2">
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-black/60 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-black/80 placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-black/10 transition";

export function PropertiesPanel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(2);
  const [utilities, setUtilities] = useState<Set<string>>(new Set(["wifi"]));
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("Addis Ababa");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nightlyRate, setNightlyRate] = useState(2500);
  const [weeklyDiscount, setWeeklyDiscount] = useState(10);
  const [monthlyRate, setMonthlyRate] = useState(60000);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleUtility = (id: string) =>
    setUtilities((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPhotos: Photo[] = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (id: string) =>
    setPhotos((prev) => prev.filter((p) => p.id !== id));

  const numInput = (
    value: number,
    set: (v: number) => void,
    min = 1,
    max = 99
  ) => (
    <div className="flex items-center gap-3">
      <button
        onClick={() => set(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border border-black/15 text-black/60 hover:bg-black/5 flex items-center justify-center text-lg leading-none"
      >
        −
      </button>
      <span className="w-6 text-center text-sm font-medium">{value}</span>
      <button
        onClick={() => set(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full border border-black/15 text-black/60 hover:bg-black/5 flex items-center justify-center text-lg leading-none"
      >
        +
      </button>
    </div>
  );

  return (
    <div className="p-10 max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Listings</p>
        <h2 className="mt-2 font-display text-4xl text-black/90">Add a property.</h2>
        <p className="mt-2 text-sm text-black/50">
          Fill in the details below to create a new listing.
        </p>
      </div>

      {/* Basic Info */}
      <div className="space-y-5">
        <SectionHeader>Basic Information</SectionHeader>
        <Field label="Property Title">
          <input
            className={inputClass}
            placeholder="e.g. Bole Heights Studio with Rooftop"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field label="Description">
          <textarea
            className={`${inputClass} resize-none h-28`}
            placeholder="Describe the property, neighbourhood, and what makes it special…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Bedrooms">{numInput(bedrooms, setBedrooms)}</Field>
          <Field label="Bathrooms">{numInput(bathrooms, setBathrooms)}</Field>
          <Field label="Max Guests">{numInput(maxGuests, setMaxGuests, 1, 20)}</Field>
        </div>
      </div>

      {/* Utilities */}
      <div>
        <SectionHeader>Utilities & Amenities</SectionHeader>
        <div className="grid grid-cols-2 gap-3">
          {UTILITIES.map(({ id, label, icon }) => {
            const on = utilities.has(id);
            return (
              <button
                key={id}
                onClick={() => toggleUtility(id)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left ${
                  on
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black/60 hover:border-black/25"
                }`}
              >
                <span className={on ? "text-white" : "text-black/40"}>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
                {on && (
                  <span className="ml-auto text-[10px] bg-white/20 px-1.5 py-0.5 rounded">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <SectionHeader>Location</SectionHeader>
        <Field label="Street Address">
          <input
            className={inputClass}
            placeholder="e.g. Bole Road, House No. 47"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Neighbourhood / Sub-city">
            <input
              className={inputClass}
              placeholder="e.g. Bole, Kazanchis"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
            />
          </Field>
          <Field label="City">
            <div className="relative">
              <select
                className={`${inputClass} appearance-none pr-8`}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {["Addis Ababa", "Bahir Dar", "Gondar", "Lalibela", "Axum", "Harar", "Dire Dawa"].map(
                  (c) => <option key={c}>{c}</option>
                )}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" />
            </div>
          </Field>
        </div>
        {/* Map placeholder */}
        <div className="rounded-xl border border-black/10 bg-black/[0.02] h-44 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/5 transition-colors">
          <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
            <MapPin size={18} className="text-black/40" />
          </div>
          <p className="text-sm text-black/40">Click to pin exact location on map</p>
          <p className="text-[10px] text-black/25">Map selector — coming soon</p>
        </div>
      </div>

      {/* Photos */}
      <div>
        <SectionHeader>Property Photos</SectionHeader>
        <div
          onClick={() => fileRef.current?.click()}
          className="rounded-xl border border-dashed border-black/15 bg-white h-32 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-black/[0.02] transition-colors"
        >
          <ImagePlus size={20} className="text-black/30" />
          <p className="text-sm text-black/50">Drag & drop photos, or click to upload</p>
          <p className="text-[10px] text-black/25">JPG, PNG up to 10 MB each</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handlePhotos}
        />
        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {photos.map((p) => (
              <div key={p.id} className="relative group rounded-lg overflow-hidden aspect-square bg-black/5">
                <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(p.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing */}
      <div>
        <SectionHeader>Pricing</SectionHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Nightly */}
          <div className="rounded-xl border border-black/10 bg-white p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">Nightly</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-black/40">ETB</span>
              <input
                type="number"
                className="w-full text-2xl font-display text-black/80 bg-transparent border-none outline-none"
                value={nightlyRate}
                onChange={(e) => setNightlyRate(Number(e.target.value))}
              />
            </div>
            <p className="text-[11px] text-black/35">Base rate per night</p>
          </div>

          {/* Weekly discount */}
          <div className="rounded-xl border border-black/10 bg-white p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">Weekly Discount</p>
            <div className="flex items-baseline gap-1.5">
              <input
                type="number"
                className="w-full text-2xl font-display text-black/80 bg-transparent border-none outline-none"
                value={weeklyDiscount}
                min={0}
                max={50}
                onChange={(e) => setWeeklyDiscount(Number(e.target.value))}
              />
              <span className="text-[11px] text-black/40">%</span>
            </div>
            <p className="text-[11px] text-black/35">
              ≈ ETB {Math.round(nightlyRate * 7 * (1 - weeklyDiscount / 100)).toLocaleString()} / week
            </p>
          </div>

          {/* Monthly */}
          <div className="rounded-xl border border-black/10 bg-white p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">Monthly Rate</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] text-black/40">ETB</span>
              <input
                type="number"
                className="w-full text-2xl font-display text-black/80 bg-transparent border-none outline-none"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value))}
              />
            </div>
            <p className="text-[11px] text-black/35">Long-stay monthly rate</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button className="px-7 py-2.5 border border-black/15 text-black/60 text-[12px] uppercase tracking-[0.15em] rounded-lg hover:bg-black/5 transition-colors">
          Save Draft
        </button>
        <button className="px-7 py-2.5 bg-black text-white text-[12px] uppercase tracking-[0.15em] rounded-lg hover:bg-black/80 transition-colors">
          Submit Listing →
        </button>
      </div>
    </div>
  );
}
