import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadCloud, CheckCircle, ShieldAlert, ArrowRight, ArrowLeft } from "lucide-react";
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
        body: JSON.stringify({
          cityIdUrl: "mock-url",
          selfieUrl: "mock-url",
          ownershipProofUrl: "mock-url"
        })
      });
      if (response.ok) {
        setStatus("pending");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "pending") {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto mt-8">
        <div className="p-8 border border-amber-500/20 bg-amber-500/5 rounded-sm flex items-start gap-4">
          <ShieldAlert className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
          <div>
            <h2 className="font-display text-2xl text-amber-900">Admin Verification Pending</h2>
            <p className="mt-2 text-sm text-amber-800/80 leading-relaxed">
              We have received your verification documents. Our team is currently reviewing your National/City ID, live selfie, and ownership proofs. 
              You will not be able to publish listings until your account has been fully verified. This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <div className="mb-12">
        <h1 className="font-display text-4xl">Host Verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">Complete these steps to unlock publishing capabilities.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-border -z-10"></div>
        {[1, 2, 3].map((s) => (
          <div key={s} className={`flex flex-col items-center gap-2 bg-paper px-4`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${step === s ? "border-ink bg-ink text-paper" : step > s ? "border-emerald-500 bg-emerald-500 text-paper" : "border-border bg-paper text-muted-foreground"}`}>
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {s === 1 ? "Identity" : s === 2 ? "Selfie" : "Ownership"}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="border border-border p-8 bg-paper shadow-sm rounded-sm mb-8 min-h-[300px]">
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="font-display text-2xl mb-2">Upload National or City ID</h3>
            <p className="text-sm text-muted-foreground mb-6">Please provide a clear scan or photo of your government-issued ID.</p>
            <div className="border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-paper-2/50 transition-colors">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-2">SVG, PNG, JPG or PDF (max. 5MB)</p>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="font-display text-2xl mb-2">Live Selfie Capture</h3>
            <p className="text-sm text-muted-foreground mb-6">We need to match your face with the ID provided in the previous step.</p>
            <div className="border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-paper-2/50 transition-colors bg-ink/5">
              <div className="w-32 h-32 rounded-full border border-border bg-paper mb-4 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Camera Preview</span>
              </div>
              <MagneticButton variant="outline">Take Photo</MagneticButton>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="font-display text-2xl mb-2">Proof of Ownership / Rental Agreement</h3>
            <p className="text-sm text-muted-foreground mb-6">Provide documentation proving you have the right to rent the listed properties.</p>
            <div className="border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-paper-2/50 transition-colors">
              <UploadCloud className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-2">PDF only (max. 10MB)</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <MagneticButton 
          variant="outline" 
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className={step === 1 ? "opacity-0 pointer-events-none" : ""}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </MagneticButton>
        
        {step < 3 ? (
          <MagneticButton onClick={() => setStep(s => Math.min(3, s + 1))}>
            Continue <ArrowRight className="h-4 w-4 ml-2" />
          </MagneticButton>
        ) : (
          <MagneticButton onClick={submitVerification}>
            Submit for Review <CheckCircle className="h-4 w-4 ml-2" />
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
