import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";
import { MagneticButton } from "../components/ui/MagneticButton";
import { ArrowLeft, ArrowRight, CheckCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client.ts";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

const forgotSchema = z.object({
  email: z.string().trim().email("Use a valid email").max(120),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    animateForm();
  }, [success]);

  const animateForm = () => {
    const container = success ? successRef.current : formRef.current;
    if (!container) return;
    
    gsap.fromTo(
      container.querySelectorAll("[data-fld]"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parse = forgotSchema.safeParse({ email });
    if (!parse.success) {
      setError(parse.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      // Better Auth forgetPassword API
      const { error: authError } = await authClient.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (authError) {
        setError(authError.message || "Failed to send reset email.");
        toast.error(authError.message || "Failed to send reset email.");
      } else {
        setSuccess(true);
        toast.success("Reset link sent!");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Failed to connect to authentication server.");
    } finally {
      setLoading(false);
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
              "url(https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-paper">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">Maison</p>
          <h2 className="mt-3 font-display text-5xl leading-tight">Recover access to your profile.</h2>
        </div>
      </section>

      {/* Forgot Password action side */}
      <section className="flex items-center justify-center px-8 pt-24 lg:px-16 bg-paper-2/10">
        {success ? (
          <div ref={successRef} className="w-full max-w-sm border border-border bg-paper/60 backdrop-blur-md p-8 shadow-xl rounded-sm text-center">
            <div data-fld className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner">
              <CheckCircle className="h-8 w-8 stroke-[2]" />
            </div>
            <h1 data-fld className="mt-6 font-display text-4xl">Check Your Email</h1>
            <p data-fld className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We have dispatched a password recovery link to your inbox:
              <br />
              <strong className="text-ink font-semibold">{email}</strong>
            </p>
            <p data-fld className="mt-4 text-xs text-muted-foreground leading-relaxed bg-paper/40 p-4 border border-border rounded-sm">
              Please click the link inside the email to set a new password.
            </p>
            
            <div data-fld className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
              <Link to="/auth">
                <MagneticButton className="w-full">
                  Return to Sign In
                </MagneticButton>
              </Link>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-sm">
            <Link to="/auth" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-ink transition-colors mb-8">
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
            
            <h1 data-fld className="font-display text-5xl">
              Forgot Password.
            </h1>
            <p data-fld className="mt-3 text-sm text-muted-foreground">
              Provide your email address below, and we will send you a secure link to reset your password.
            </p>

            <div data-fld className="mt-8">
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</label>
              <div className="relative mt-2">
                <Mail className="absolute left-0 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-border bg-transparent py-3 pl-7 outline-none focus:border-ink"
                  placeholder="you@maison.co"
                />
              </div>
            </div>

            {error && (
              <div data-fld className="mt-6 p-4 bg-destructive/5 border border-destructive/10 text-destructive text-xs leading-relaxed rounded-sm">
                {error}
              </div>
            )}

            <div data-fld className="mt-10">
              <MagneticButton type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2">
                {loading ? "Sending..." : "Request Reset Link"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </MagneticButton>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
