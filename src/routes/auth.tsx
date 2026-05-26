import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useAuth, type Role } from "../lib/mock/store";
import { MagneticButton } from "../components/ui/MagneticButton";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";
import { CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Add your name").max(60),
  email: z.string().trim().email("Use a valid email").max(120),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().trim().email("Use a valid email").max(120),
  password: z.string().min(1, "Password is required"),
});

function AuthPage() {
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  
  // Tab Mode
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  
  // Form Fields
  const [role, setRole] = useState<Role>("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // States
  const [error, setError] = useState<string | null>(null);
  const [isUnverifiedError, setIsUnverifiedError] = useState(false);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    animateForm();
  }, [mode, isRegisteredSuccess]);

  const animateForm = () => {
    const container = isRegisteredSuccess ? successRef.current : formRef.current;
    if (!container) return;
    
    // Clear any previous animations
    gsap.killTweensOf(container.querySelectorAll("[data-fld]"));
    
    gsap.fromTo(
      container.querySelectorAll("[data-fld]"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUnverifiedError(false);

    if (mode === "signup") {
      const parse = signUpSchema.safeParse({ name, email, password });
      if (!parse.success) {
        setError(parse.error.issues[0].message);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await res.json();
        if (res.ok) {
          setIsRegisteredSuccess(true);
          toast.success("Account created successfully!");
        } else {
          setError(data.message || "Failed to create account.");
          toast.error(data.message || "Failed to create account.");
        }
      } catch (err) {
        // Fallback for visual mock mode if backend server is offline during preview
        setIsRegisteredSuccess(true);
        toast.success("Demo Mode: Registration successful!");
      } finally {
        setLoading(false);
      }
    } else {
      // Sign In
      const parse = signInSchema.safeParse({ email, password });
      if (!parse.success) {
        setError(parse.error.issues[0].message);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          // Log user into local mock store so frontend session syncs nicely
          signIn(data.email, data.name, data.role || "guest");
          toast.success(`Welcome back, ${data.name}!`);
          navigate({ to: data.role === "host" ? "/host/new" : "/account" });
        } else {
          if (res.status === 403) {
            setIsUnverifiedError(true);
          }
          setError(data.message || "Invalid credentials.");
        }
      } catch (err) {
        // Fallback for visual mock mode if server is offline
        signIn(email, "Ada Lovelace", "guest");
        toast.success("Demo Mode: Logged in successfully!");
        navigate({ to: "/account" });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Verification link sent! Please check your email.");
        setIsUnverifiedError(false);
      } else {
        toast.error(data.message || "Failed to resend verification link.");
      }
    } catch (err) {
      toast.success("Demo Mode: Verification link resent successfully!");
      setIsUnverifiedError(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Visual background image side */}
      <section className="relative hidden lg:block">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative z-10 flex h-full flex-col justify-end p-12 text-paper">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">Maison</p>
          <h2 className="mt-3 font-display text-5xl leading-tight">An address worth returning to.</h2>
        </div>
      </section>

      {/* Auth action side */}
      <section className="flex items-center justify-center px-8 pt-24 lg:px-16 bg-paper-2/10">
        {isRegisteredSuccess ? (
          <div ref={successRef} className="w-full max-w-sm border border-border bg-paper/60 backdrop-blur-md p-8 shadow-xl rounded-sm text-center">
            <div data-fld className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner">
              <CheckCircle className="h-8 w-8 stroke-[2]" />
            </div>
            <h1 data-fld className="mt-6 font-display text-4xl">Verify Your Email</h1>
            <p data-fld className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Welcome, {name}! We have sent a verification link to your email address:
              <br />
              <strong className="text-ink font-semibold">{email}</strong>
            </p>
            <p data-fld className="mt-4 text-xs text-muted-foreground leading-relaxed bg-paper/40 p-4 border border-border rounded-sm">
              Please click the link inside the verification email to verify your email and activate your account.
            </p>
            
            <div data-fld className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
              <MagneticButton onClick={() => { setIsRegisteredSuccess(false); setMode("signin"); }} className="w-full">
                Go to Sign In
              </MagneticButton>
              <button 
                onClick={handleResend}
                className="text-xs text-muted-foreground hover:text-ink transition-colors underline underline-offset-4"
              >
                Didn't get the email? Resend link
              </button>
            </div>
          </div>
        ) : (
          <form ref={formRef} onSubmit={submit} className="w-full max-w-sm">
            <h1 data-fld className="font-display text-5xl">
              {mode === "signup" ? "Create Account." : "Welcome Back."}
            </h1>
            <p data-fld className="mt-3 text-sm text-muted-foreground">
              {mode === "signup" 
                ? "Join Nuvlo and explore considered stays across Ethiopia." 
                : "Sign in to manage your luxury bookings."
              }
            </p>

            {/* Mode selection tabs */}
            <div data-fld className="mt-8 flex border border-border">
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); setIsUnverifiedError(false); }}
                className={`flex-1 py-3 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  mode === "signup" ? "bg-ink text-paper font-semibold" : "text-ink hover:bg-paper-2/40"
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(null); setIsUnverifiedError(false); }}
                className={`flex-1 py-3 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  mode === "signin" ? "bg-ink text-paper font-semibold" : "text-ink hover:bg-paper-2/40"
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Form Fields */}
            {mode === "signup" && (
              <>
                {/* Role Toggle for Host vs Guest */}
                <div data-fld className="mt-6 flex border border-border bg-paper-2/10">
                  {(["guest", "host"] as Role[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors ${
                        role === r ? "bg-ink text-paper" : "text-ink/65 hover:bg-paper-2/40"
                      }`}
                    >
                      I'm a {r}
                    </button>
                  ))}
                </div>

                <div data-fld className="mt-6">
                  <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none focus:border-ink"
                    placeholder="Ada Lovelace"
                  />
                </div>
              </>
            )}

            <div data-fld className="mt-6">
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none focus:border-ink"
                placeholder="you@maison.co"
              />
            </div>

            <div data-fld className="mt-6">
              <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none focus:border-ink"
                placeholder="••••••••"
              />
            </div>

            {/* Error notifications */}
            {error && (
              <div data-fld className="mt-6 p-4 bg-destructive/5 border border-destructive/10 text-destructive text-xs leading-relaxed rounded-sm flex flex-col gap-2">
                <p>{error}</p>
                {isUnverifiedError && (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="self-start text-xs font-semibold underline underline-offset-2 hover:text-destructive-foreground transition-colors"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            )}

            <div data-fld className="mt-10">
              <MagneticButton type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2">
                {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Continue"} 
                {!loading && <ArrowRight className="h-4 w-4" />}
              </MagneticButton>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
