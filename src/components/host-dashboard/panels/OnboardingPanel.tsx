import { useState } from "react";
import {
  Upload,
  Camera,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

type Step = 0 | 1 | 2;

const STEPS = [
  { label: "Identity", desc: "Government-issued ID" },
  { label: "Ownership", desc: "Property documents" },
  { label: "Review", desc: "Await verification" },
];

interface UploadAreaProps {
  icon: React.ReactNode;
  title: string;
  hint: string;
  file: File | null;
  accept: string;
  capture?: "user" | "environment";
  onChange: (f: File | null) => void;
}

function UploadArea({ icon, title, hint, file, accept, capture, onChange }: UploadAreaProps) {
  return (
    <label className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-black/15 bg-white p-10 cursor-pointer transition-colors hover:bg-black/[0.02]">
      <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center text-black/40 group-hover:text-black/60 transition-colors">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-black/80">
          {file ? file.name : title}
        </p>
        <p className="text-[11px] text-black/40 mt-0.5">{hint}</p>
      </div>
      {file && (
        <div className="flex items-center gap-1.5 text-green-700 text-[11px]">
          <CheckCircle size={12} />
          <span>File selected</span>
        </div>
      )}
      <input
        type="file"
        className="hidden"
        accept={accept}
        {...(capture ? { capture } : {})}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

export function OnboardingPanel() {
  const [step, setStep] = useState<Step>(0);
  const [nationalId, setNationalId] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [ownershipDoc, setOwnershipDoc] = useState<File | null>(null);

  return (
    <div className="p-10 max-w-2xl">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Host Setup</p>
        <h2 className="mt-2 font-display text-4xl text-black/90">Verify your account.</h2>
        <p className="mt-2 text-sm text-black/50">
          Complete identity verification to start listing properties on Bet · ቤት.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <button
              onClick={() => i < step ? setStep(i as Step) : undefined}
              className="flex items-center gap-2.5 text-left"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold border-2 transition-colors ${
                  i < step
                    ? "bg-black border-black text-white"
                    : i === step
                    ? "border-black text-black bg-white"
                    : "border-black/20 text-black/30 bg-white"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <div className="hidden sm:block">
                <p className={`text-[12px] font-medium leading-none ${i === step ? "text-black" : i < step ? "text-black/60" : "text-black/30"}`}>
                  {s.label}
                </p>
                <p className="text-[10px] text-black/30 mt-0.5">{s.desc}</p>
              </div>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-10 mx-3 ${i < step ? "bg-black" : "bg-black/10"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 0 — Identity */}
      {step === 0 && (
        <div className="space-y-5">
          <UploadArea
            icon={<Upload size={20} />}
            title="Upload National or City ID"
            hint="PNG, JPG or PDF · up to 10 MB"
            file={nationalId}
            accept="image/*,.pdf"
            onChange={setNationalId}
          />
          <UploadArea
            icon={<Camera size={20} />}
            title="Take or upload a selfie"
            hint="Hold your ID beside your face · JPEG or PNG"
            file={selfie}
            accept="image/*"
            capture="user"
            onChange={setSelfie}
          />
          <div className="pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-7 py-2.5 bg-black text-white text-[12px] uppercase tracking-[0.15em] rounded-lg hover:bg-black/80 transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — Ownership */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-black/80 mb-1">Proof of Ownership or Rental Agreement</p>
            <p className="text-[11px] text-black/40 mb-4">
              Acceptable documents: title deed, lease agreement, or written sub-letting permission from the property owner.
            </p>
            <UploadArea
              icon={<FileText size={20} />}
              title="Upload property document"
              hint="PNG, JPG or PDF · up to 20 MB"
              file={ownershipDoc}
              accept="image/*,.pdf"
              onChange={setOwnershipDoc}
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => setStep(0)}
              className="px-7 py-2.5 border border-black/15 text-black/70 text-[12px] uppercase tracking-[0.15em] rounded-lg hover:bg-black/5 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(2)}
              className="px-7 py-2.5 bg-black text-white text-[12px] uppercase tracking-[0.15em] rounded-lg hover:bg-black/80 transition-colors"
            >
              Submit for Review →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Pending */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Submitted confirmation */}
          <div className="flex items-center gap-3 p-5 rounded-xl bg-green-50 border border-green-200">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Documents submitted successfully</p>
              <p className="text-[11px] text-green-700 mt-0.5">
                You will receive an email notification once the review is complete.
              </p>
            </div>
          </div>

          {/* Pending banner */}
          <div className="flex items-start gap-3 p-5 rounded-xl bg-amber-50 border border-amber-200">
            <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Admin Verification Pending</p>
              <p className="text-[12px] text-amber-700 mt-1">
                Your documents are currently under review. This typically takes 1–3 business days.
              </p>
            </div>
          </div>

          {/* Access restrictions */}
          <div className="rounded-xl border border-black/10 p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-black/40" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Access Restrictions During Review
              </p>
            </div>
            {[
              "Property listings cannot be published until your account is verified.",
              "You may prepare listing drafts and save them for later publication.",
              "Booking requests will not be processed until approval is granted.",
              "Your profile will not appear in guest searches during this period.",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <AlertTriangle size={12} className="text-black/30 mt-0.5 shrink-0" />
                <p className="text-[12px] text-black/50">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
