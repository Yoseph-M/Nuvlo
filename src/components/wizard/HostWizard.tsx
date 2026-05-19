import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { registerGsap } from "../../lib/gsap/register";
import { MagneticButton } from "../ui/MagneticButton";
import { z } from "zod";

const steps = [
  { id: "basics", label: "Basics" },
  { id: "location", label: "Location" },
  { id: "photos", label: "Photos" },
  { id: "amenities", label: "Amenities" },
  { id: "review", label: "Review" },
] as const;

const draftSchema = z.object({
  title: z.string().trim().min(4, "Give it a name").max(80),
  description: z.string().trim().min(20, "Add a few details").max(800),
  neighborhood: z.string().trim().min(2).max(40),
  pricePerNight: z.coerce.number().min(20).max(5000),
  maxGuests: z.coerce.number().min(1).max(20),
  amenities: z.array(z.string()).max(20),
});

type Draft = z.infer<typeof draftSchema> & {
  photos: string[];
};

const initial: Draft = {
  title: "",
  description: "",
  neighborhood: "",
  pricePerNight: 250,
  maxGuests: 2,
  amenities: [],
  photos: [],
};

export function HostWizard({ onComplete }: { onComplete: (draft: Draft) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(initial);
  const [error, setError] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsap();
    if (!stageRef.current || !stepRef.current) return;
    // Animate container height + step slide-in
    const target = stepRef.current.scrollHeight;
    const tl = gsap.timeline();
    tl.fromTo(
      stepRef.current,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.7, ease: "luxe" },
    )
      .to(stageRef.current, { height: target, duration: 0.7, ease: "luxe" }, 0)
      .to(
        progressRef.current,
        { width: `${((stepIndex + 1) / steps.length) * 100}%`, duration: 0.7, ease: "luxe" },
        0,
      );
  }, [stepIndex]);

  const next = () => {
    setError(null);
    if (stepIndex < steps.length - 1) {
      slideOut(() => setStepIndex((i) => i + 1));
    } else {
      const parse = draftSchema.safeParse(draft);
      if (!parse.success) {
        setError(parse.error.issues[0]?.message ?? "Check your inputs");
        return;
      }
      onComplete(draft);
    }
  };

  const prev = () => {
    if (stepIndex === 0) return;
    slideOut(() => setStepIndex((i) => i - 1), -60);
  };

  const slideOut = (cb: () => void, x = 60) => {
    if (!stepRef.current) return cb();
    gsap.to(stepRef.current, {
      opacity: 0,
      x: -x,
      duration: 0.45,
      ease: "silk",
      onComplete: cb,
    });
  };

  const update = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span>Step {stepIndex + 1} of {steps.length}</span>
        <span>{steps[stepIndex].label}</span>
      </div>
      <div className="relative mb-12 h-px bg-border">
        <div ref={progressRef} className="absolute inset-y-0 left-0 bg-ink" style={{ width: "20%" }} />
      </div>

      <div
        ref={stageRef}
        className="overflow-hidden"
        style={{ height: "auto" }}
      >
        <div ref={stepRef}>
          {stepIndex === 0 && (
            <StepBasics draft={draft} update={update} />
          )}
          {stepIndex === 1 && <StepLocation draft={draft} update={update} />}
          {stepIndex === 2 && <StepPhotos draft={draft} update={update} />}
          {stepIndex === 3 && <StepAmenities draft={draft} update={update} />}
          {stepIndex === 4 && <StepReview draft={draft} />}
        </div>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">{error}</p>
      )}

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={stepIndex === 0}
          className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-ink disabled:opacity-30"
        >
          Back
        </button>
        <MagneticButton onClick={next}>
          {stepIndex === steps.length - 1 ? "Publish stay" : "Continue"}
        </MagneticButton>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full border-b border-border bg-transparent py-3 text-lg outline-none transition-colors focus:border-ink";

function StepBasics({ draft, update }: { draft: Draft; update: (p: Partial<Draft>) => void }) {
  return (
    <div className="space-y-8">
      <h2 className="font-display text-4xl">Tell us about the stay.</h2>
      <Field label="Title">
        <input className={inputCls} value={draft.title} onChange={(e) => update({ title: e.target.value })} placeholder="Atelier with wrought-iron balcony" />
      </Field>
      <Field label="Description">
        <textarea className={`${inputCls} resize-none`} rows={4} value={draft.description} onChange={(e) => update({ description: e.target.value })} placeholder="A few unhurried sentences..." />
      </Field>
    </div>
  );
}

function StepLocation({ draft, update }: { draft: Draft; update: (p: Partial<Draft>) => void }) {
  return (
    <div className="space-y-8">
      <h2 className="font-display text-4xl">Where does it live?</h2>
      <Field label="Neighborhood">
        <input className={inputCls} value={draft.neighborhood} onChange={(e) => update({ neighborhood: e.target.value })} placeholder="Marais, Montmartre..." />
      </Field>
    </div>
  );
}

function StepPhotos({ draft, update }: { draft: Draft; update: (p: Partial<Draft>) => void }) {
  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).slice(0, 8).map((f) => URL.createObjectURL(f));
    update({ photos: [...draft.photos, ...urls].slice(0, 8) });
  };
  return (
    <div className="space-y-6">
      <h2 className="font-display text-4xl">Show us the light.</h2>
      <label className="block cursor-pointer border border-dashed border-border p-10 text-center text-sm text-muted-foreground hover:bg-paper-2/40">
        <input type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
        Drop photos here or click to choose
      </label>
      {draft.photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {draft.photos.map((p, i) => (
            <div key={i} className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url(${p})` }} />
          ))}
        </div>
      )}
    </div>
  );
}

const amenityChoices = ["Espresso bar", "Fireplace", "Library", "Soaking tub", "Concierge", "Smart blackout", "Private terrace", "Vinyl collection", "Wine fridge", "Steam shower"];

function StepAmenities({ draft, update }: { draft: Draft; update: (p: Partial<Draft>) => void }) {
  const toggle = (a: string) => {
    const has = draft.amenities.includes(a);
    update({ amenities: has ? draft.amenities.filter((x) => x !== a) : [...draft.amenities, a] });
  };
  return (
    <div className="space-y-8">
      <h2 className="font-display text-4xl">What makes it feel like home?</h2>
      <div className="flex flex-wrap gap-2">
        {amenityChoices.map((a) => {
          const on = draft.amenities.includes(a);
          return (
            <button
              key={a}
              onClick={() => toggle(a)}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-colors ${on ? "border-ink bg-ink text-paper" : "border-border text-ink hover:border-ink"}`}
            >
              {a}
            </button>
          );
        })}
      </div>
      <Field label="Price per night (€)">
        <input type="number" className={inputCls} value={draft.pricePerNight} onChange={(e) => update({ pricePerNight: Number(e.target.value) })} />
      </Field>
      <Field label="Maximum guests">
        <input type="number" className={inputCls} value={draft.maxGuests} onChange={(e) => update({ maxGuests: Number(e.target.value) })} />
      </Field>
    </div>
  );
}

function StepReview({ draft }: { draft: Draft }) {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-4xl">A last look.</h2>
      <dl className="grid grid-cols-2 gap-y-4 text-sm">
        <Row label="Title" value={draft.title || "—"} />
        <Row label="Neighborhood" value={draft.neighborhood || "—"} />
        <Row label="Price / night" value={`€${draft.pricePerNight}`} />
        <Row label="Max guests" value={String(draft.maxGuests)} />
        <Row label="Amenities" value={draft.amenities.join(", ") || "—"} />
        <Row label="Photos" value={`${draft.photos.length} attached`} />
      </dl>
      <p className="border-t border-border pt-6 text-sm text-muted-foreground">
        {draft.description || "—"}
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </>
  );
}
