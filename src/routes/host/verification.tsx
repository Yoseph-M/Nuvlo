import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, CheckCircle2, ShieldAlert, ArrowRight, ArrowLeft, FileText, UserCheck, ShieldCheck } from "lucide-react";
import { MagneticButton } from "../../components/ui/MagneticButton";

export const Route = createFileRoute("/host/verification")({
  component: VerificationDashboard,
});

function VerificationDashboard() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"unverified" | "pending" | "verified">("unverified");

  const submitVerification = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/host/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityIdUrl: "mock-url", selfieUrl: "mock-url", ownershipProofUrl: "mock-url" })
      });
      if (response.ok) setStatus("pending");
    } catch (err) {
      console.error(err);
    }
  };

  const stepsMeta = [
    { number: 1, label: "Identity Document", icon: FileText },
    { number: 2, label: "Selfie Match", icon: UserCheck },
    { number: 3, label: "Property Deed", icon: ShieldCheck },
  ];

  if (status === "pending") {
    return (
      <div className="animate-fade-in max-w-2xl mx-auto mt-12">
        <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-4 shadow-sm">
          <div className="p-2.5 bg-amber-100/80 rounded-xl border border-amber-200 text-amber-700 shrink-0">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Verification Under Review</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Our operations desk is evaluating your identity files and proof of residence documents. This protocol ensures community trust and usually takes up to 24–48 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">

      {/* View Title Grid Block */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Host Verification</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Complete mandatory background mapping to verify your profile and open real estate guest bookings.
        </p>
      </div>

      {/* Horizontal Multi-Step Stepper Component */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-xl">
        {stepsMeta.map((s) => {
          const isActive = step === s.number;
          const isCompleted = step > s.number;

          return (
            <div
              key={s.number}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-150 select-none ${isActive
                  ? "bg-white text-slate-950 shadow-sm border border-slate-200/50"
                  : isCompleted
                    ? "text-emerald-700"
                    : "text-slate-400"
                }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <s.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
              )}
              <span className="hidden sm:inline tracking-tight">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Content Form Wrapper Panel Card */}
      <div className="p-6 sm:p-8 border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] rounded-2xl">

        {/* Step 1 Content Window */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Government Issued Identification</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Upload a clear photo or high-resolution scan of your passport, National ID card, or driver's license.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 bg-slate-50/40 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all duration-150 group">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-105 transition-transform mb-4">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">Click to upload or drag and drop files</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Acceptable file formats: JPEG or PNG files up to 5MB</p>
            </div>
          </div>
        )}

        {/* Step 2 Content Window */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Selfie Authentication</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide an authentication portrait selfie holding your chosen government identification paper adjacent to your face.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 bg-slate-50/40 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all duration-150 group">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-105 transition-transform mb-4">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">Click to run camera or dispatch capture file</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Ensure text details and faces remain clear and unblurred</p>
            </div>
          </div>
        )}

        {/* Step 3 Content Window */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Proof of Ownership / Rental Authority</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Provide verified certification blueprints or official lease agreements proving authorization to operate the listings.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 bg-slate-50/40 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all duration-150 group">
              <div className="h-12 w-12 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-105 transition-transform mb-4">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-slate-800">Click to upload valid registration files</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">PDF, DOCX, or scan images accepted</p>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Buttons Footer Navigation Row */}
      <div className="flex items-center justify-between pt-2">
        <MagneticButton
          variant="outline"
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className={step === 1 ? "opacity-0 pointer-events-none" : ""}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
        </MagneticButton>

        {step < 3 ? (
          <MagneticButton onClick={() => setStep(s => s + 1)}>
            Continue <ArrowRight className="h-4 w-4 ml-1.5" />
          </MagneticButton>
        ) : (
          <MagneticButton onClick={submitVerification}>
            Submit for Review <CheckCircle2 className="h-4 w-4 ml-1.5" />
          </MagneticButton>
        )}
      </div>

    </div>
  );
}