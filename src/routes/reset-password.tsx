import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";
import { MagneticButton } from "../components/ui/MagneticButton";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client.ts";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => searchSchema.parse(search),
  component: ResetPasswordPage,
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    animateForm();
  }, [success, token]);

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

    if (!token) {
      setError("Reset token is missing from the link. Please request a new reset link.");
      return;
    }

    const parse = resetPasswordSchema.safeParse({ password });
    if (!parse.success) {
      setError(parse.error.issues[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (authError) {
        setError(authError.message || "Failed to reset password.");
        toast.error(authError.message || "Failed to reset password.");
      } else {
        setSuccess(true);
        toast.success("Password reset successfully!");
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
              "url(https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-paper">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">Maison</p>
          <h2 className="mt-3 font-display text-5xl leading-tight">Create a secure new password.</h2>
        </div>
      </section>

      {/* Reset Password Action Side */}
      <section className="flex items-center justify-center px-8 pt-24 lg:px-16 bg-paper-2/10">
        {!token ? (
          <div className="w-full max-w-sm border border-border bg-paper/60 backdrop-blur-md p-8 shadow-xl rounded-sm text-center">
            <h1 className="font-display text-4xl text-destructive">Invalid Link</h1>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              The password reset token is missing or invalid. Please request a new recovery email.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <Link to="/forgot-password">
                <MagneticButton className="w-full">
                  Request New Link
                </MagneticButton>
              </Link>
              <Link to="/auth" className="text-xs text-muted-foreground hover:text-ink transition-colors underline underline-offset-2">
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : success ? (
          <div ref={successRef} className="w-full max-w-sm border border-border bg-paper/60 backdrop-blur-md p-8 shadow-xl rounded-sm text-center">
            <div data-fld className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner">
              <CheckCircle className="h-8 w-8 stroke-[2]" />
            </div>
            <h1 data-fld className="mt-6 font-display text-4xl">Success</h1>
            <p data-fld className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your password has been successfully updated. You may now sign in with your new credentials.
            </p>
            
            <div data-fld className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
              <Link to="/auth">
                <MagneticButton className="w-full">
                  Proceed to Sign In
                </MagneticButton>
              </Link>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-sm">
            <h1 data-fld className="font-display text-5xl">
              New Password.
            </h1>
            <p data-fld className="mt-3 text-sm text-muted-foreground">
              Please enter and confirm your new account password below.
            </p>

            <div data-fld className="mt-8">
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">New Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-0 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-border bg-transparent py-3 pl-7 outline-none focus:border-ink"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div data-fld className="mt-6">
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Confirm New Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-0 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-border bg-transparent py-3 pl-7 outline-none focus:border-ink"
                  placeholder="••••••••"
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
                {loading ? "Updating..." : "Reset Password"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </MagneticButton>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
