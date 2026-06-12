import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";
import { MagneticButton } from "../components/ui/MagneticButton";
import { Check, X, Loader2, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client.ts";
import { auth } from "../lib/firebase.ts";
import { applyActionCode } from "firebase/auth";

const searchSchema = z.object({
  token: z.string().optional(),
  oobCode: z.string().optional(),
});

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search) => searchSchema.parse(search),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token, oobCode } = Route.useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-token">("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current.querySelectorAll("[data-anim]"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );
    }
  }, [status]);

  useEffect(() => {
    const code = oobCode || token;
    if (!code) {
      setStatus("no-token");
      return;
    }

    const verify = async () => {
      try {
        await applyActionCode(auth, code);
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (err: any) {
        console.error("Verification connection error:", err);
        setStatus("error");
        setMessage(err.message || "Invalid or expired verification token.");
      }
    };

    verify();
  }, [token, oobCode]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setResending(true);
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: resendEmail,
        callbackURL: `${window.location.origin}/auth`,
      });

      if (!error) {
        toast.success("Verification link sent to your inbox!");
        setResendEmail("");
      } else {
        toast.error(error.message || "Failed to resend verification link. Make sure you are signed in first.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Failed to resend verification link.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Visual side */}
      <section className="relative hidden lg:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-paper">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">Nuvlo stays</p>
          <h2 className="mt-3 font-display text-5xl leading-tight">Welcome to your refined travel experience.</h2>
        </div>
      </section>

      {/* Verification content */}
      <section className="flex items-center justify-center px-8 pt-24 lg:px-16 bg-paper-2/20">
        <div ref={cardRef} className="w-full max-w-md border border-border bg-paper/70 backdrop-blur-md p-10 shadow-xl rounded-sm">
          {status === "loading" && (
            <div className="flex flex-col items-center text-center">
              <Loader2 data-anim className="h-12 w-12 animate-spin text-ink opacity-70" />
              <h1 data-anim className="mt-6 font-display text-4xl">Verifying your email...</h1>
              <p data-anim className="mt-3 text-sm text-muted-foreground">
                We're confirming your credentials with our servers. This will just take a second.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center text-center">
              <div data-anim className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner">
                <Check className="h-8 w-8 stroke-[3]" />
              </div>
              <h1 data-anim className="mt-6 font-display text-4xl">Email Verified</h1>
              <p data-anim className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {message}
              </p>
              <div data-anim className="mt-10 w-full">
                <Link to="/auth">
                  <MagneticButton className="w-full flex items-center justify-center gap-2">
                    Proceed to Sign In <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div data-anim className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
                <X className="h-8 w-8 stroke-[3]" />
              </div>
              <h1 data-anim className="mt-6 font-display text-4xl text-center">Verification Failed</h1>
              <p data-anim className="mt-4 text-sm text-muted-foreground text-center leading-relaxed">
                {message || "The verification link is invalid or has expired."}
              </p>

              <div data-anim className="mt-10 w-full border-t border-border pt-8">
                <h3 className="font-display text-2xl">Resend Verification</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Enter your email address below, and we will send you a brand new email verification link.
                </p>

                <form onSubmit={handleResend} className="mt-6 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-0 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        className="w-full border-b border-border bg-transparent py-2 pl-7 outline-none focus:border-ink"
                        placeholder="you@maison.co"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <MagneticButton type="submit" disabled={resending} className="w-full">
                      {resending ? "Resending..." : "Send Verification Link"}
                    </MagneticButton>
                  </div>
                </form>
              </div>
            </div>
          )}

          {status === "no-token" && (
            <div className="flex flex-col items-center">
              <div data-anim className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-inner">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h1 data-anim className="mt-6 font-display text-4xl text-center">Token Missing</h1>
              <p data-anim className="mt-4 text-sm text-muted-foreground text-center leading-relaxed">
                No verification token was found. Please check your verification link or request a new one below.
              </p>

              <div data-anim className="mt-10 w-full border-t border-border pt-8">
                <h3 className="font-display text-2xl">Request Verification</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Enter your email address, and we will dispatch a verification link right away.
                </p>

                <form onSubmit={handleResend} className="mt-6 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-0 top-3 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        className="w-full border-b border-border bg-transparent py-2 pl-7 outline-none focus:border-ink"
                        placeholder="you@maison.co"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <MagneticButton type="submit" disabled={resending} className="w-full">
                      {resending ? "Resending..." : "Send Verification Link"}
                    </MagneticButton>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
