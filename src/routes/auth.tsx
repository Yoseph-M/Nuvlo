import { createFileRoute, useNavigate, Link, Navigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { authClient } from "../lib/auth-client";
import { MagneticButton } from "../components/ui/MagneticButton";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";
import { CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getAuthenticatedRedirectPath } from "../lib/auth-routing";

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

type Role = "guest" | "host" | "admin";

const LalibelaStar = () => (
  <svg
    className="h-7 w-7 text-ink"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L15 9H9L12 2Z" fill="currentColor" />
    <path d="M12 22L9 15H15L12 22Z" fill="currentColor" />
    <path d="M2 12L9 9V15L2 12Z" fill="currentColor" />
    <path d="M22 12L15 15V9L22 12Z" fill="currentColor" />
    <rect x="7" y="7" width="10" height="10" stroke="currentColor" strokeWidth="1" transform="rotate(45 12 12)" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const slides = [
  {
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    quote: "We discovered the most incredible glass lodge overlooking the Lalibela mountains. The design was breath-taking, blending traditional woodcraft with modern glass architecture.",
    author: "Abel Tesfaye",
    role: "Lalibela Guest",
  },
  {
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80",
    quote: "As a host in Bishoftu, Bet has allowed me to share my modern lakefront villa with travelers seeking considered, serene escapes. The booking experience is seamless.",
    author: "Helen Alemayehu",
    role: "Bishoftu Host",
  },
  {
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1600&q=80",
    quote: "Every stay is carefully curated. It feels less like renting a room and more like experiencing the soul of Ethiopian hospitality.",
    author: "Marcus Samuelsson",
    role: "Travel Writer",
  },
];

function AuthPage() {
  const navigate = useNavigate();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const authenticatedRedirectPath = getAuthenticatedRedirectPath(session?.user);

  // Tab Mode
  const [mode, setMode] = useState<"signin" | "signup">("signup");

  // Form Fields
  const [role, setRole] = useState<Role>("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Slideshow State
  const [activeSlide, setActiveSlide] = useState(0);

  // States
  const [error, setError] = useState<string | null>(null);
  const [isUnverifiedError, setIsUnverifiedError] = useState(false);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    animateForm();
  }, [mode, isRegisteredSuccess]);

  const animateForm = () => {
    const container = isRegisteredSuccess ? successRef.current : formRef.current;
    if (!container) return;

    gsap.killTweensOf(container.querySelectorAll("[data-fld]"));

    gsap.fromTo(
      container.querySelectorAll("[data-fld]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.06 }
    );
  };

  const animateSlideChange = (newIdx: number) => {
    gsap.timeline()
      .to([bgRef.current, textRef.current], {
        opacity: 0,
        y: 8,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          setActiveSlide(newIdx);
        }
      })
      .to([bgRef.current, textRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
  };

  const handleNextSlide = () => {
    const nextIdx = (activeSlide + 1) % slides.length;
    animateSlideChange(nextIdx);
  };

  const handlePrevSlide = () => {
    const prevIdx = (activeSlide - 1 + slides.length) % slides.length;
    animateSlideChange(prevIdx);
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
        const { data, error: signUpError } = await authClient.signUp.email({
          name,
          email,
          password,
          role,
        });

        if (signUpError) {
          setError(signUpError.message || "Failed to create account.");
          toast.error(signUpError.message || "Failed to create account.");
        } else {
          toast.success("Account created successfully!");
          await authClient.sendVerificationEmail({
            email,
            callbackURL: `${window.location.origin}/auth`,
          }).catch((err) => console.warn("Email verification trigger warning:", err));

          setIsRegisteredSuccess(true);
        }
      } catch (err: any) {
        console.error(err);
        setError("An unexpected error occurred during registration.");
        toast.error("Registration failed.");
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
        const { data, error: authError } = await authClient.signIn.email({
          email,
          password,
        });

        if (authError) {
          if (
            authError.code === "auth/email-already-in-use" ||
            authError.code === "EMAIL_NOT_VERIFIED" ||
            authError.message?.toLowerCase().includes("verify") ||
            authError.message?.toLowerCase().includes("verification")
          ) {
            setIsUnverifiedError(true);
          }
          setError(authError.message || "Invalid credentials.");
        } else {
          toast.success("Welcome back!");
          const dashboardPath = getAuthenticatedRedirectPath(data?.user) || "/guest";
          navigate({ to: dashboardPath });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to sign in. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: googleError } = await authClient.signIn.google(role);
      if (googleError) {
        setError(googleError.message || "Google sign-in failed.");
        toast.error(googleError.message || "Google sign-in failed.");
      } else {
        toast.success("Welcome back!");
        const dashboardPath = getAuthenticatedRedirectPath(data?.user) || "/guest";
        navigate({ to: dashboardPath });
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const { error: resendError } = await authClient.sendVerificationEmail({
        email,
        callbackURL: `${window.location.origin}/auth`,
      });

      if (resendError) {
        toast.error(resendError.message || "Failed to resend verification link.");
      } else {
        toast.success("Verification link sent! Please check your email.");
        setIsUnverifiedError(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Failed to resend verification link.");
    } finally {
      setLoading(false);
    }
  };

  if (isSessionPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading session...</p>
      </main>
    );
  }

  if (authenticatedRedirectPath) {
    return <Navigate to={authenticatedRedirectPath} />;
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Column: Form Section */}
      <section className="relative flex flex-col justify-center px-6 py-16 md:px-12 lg:px-20 xl:px-28">
        
        {/* Brand Logo Header */}
        <div className="absolute top-10 left-6 md:left-12 lg:left-20 xl:left-28 flex items-center gap-3">
          <LalibelaStar />
          <span className="font-display text-lg font-bold tracking-tight text-ink select-none">Bet · ቤት</span>
        </div>

        {/* Center Container */}
        <div className="mx-auto w-full max-w-[360px] pt-8">
          {isRegisteredSuccess ? (
            <div ref={successRef} className="w-full text-center">
              <div data-fld className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-inner">
                <CheckCircle className="h-7 w-7 stroke-[2]" />
              </div>
              <h1 data-fld className="mt-6 font-display text-3xl font-bold tracking-tight text-ink">Verify Your Email</h1>
              <p data-fld className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Welcome, {name}! We have sent a verification link to your email address:
                <br />
                <strong className="text-ink font-semibold">{email}</strong>
              </p>
              <p data-fld className="mt-4 text-xs text-muted-foreground leading-relaxed bg-paper p-4 border border-border rounded-sm">
                Please click the link inside the verification email to verify your email and activate your account.
              </p>

              <div data-fld className="mt-8 pt-6 border-t border-border flex flex-col gap-4">
                <button
                  onClick={() => { setIsRegisteredSuccess(false); setMode("signin"); }}
                  className="w-full bg-ink hover:opacity-90 text-white font-semibold text-xs uppercase tracking-wider py-3 rounded cursor-pointer transition-all duration-300 shadow-sm"
                >
                  Go to Sign In
                </button>
                <button
                  onClick={handleResend}
                  className="text-xs text-muted-foreground hover:text-ink transition-colors underline underline-offset-4"
                >
                  Didn't get the email? Resend link
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} onSubmit={submit} className="w-full">
              {/* Form Heading */}
              <h1 data-fld className="font-display text-3xl font-bold tracking-tight text-ink">
                {mode === "signup" ? "Create an account" : "Welcome back"}
              </h1>
              <p data-fld className="mt-2 text-sm text-muted-foreground">
                {mode === "signup"
                  ? "Sign up to start exploring considered stays across Ethiopia."
                  : "Welcome back! Please enter your details."
                }
              </p>

              {/* Google Sign In Button */}
              <div data-fld className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full border border-border bg-white hover:bg-paper/40 py-2.5 text-sm font-semibold text-ink flex justify-center items-center gap-3 transition-all duration-300 rounded cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {mode === "signup" ? "Sign up with Google" : "Log in with Google"}
                </button>
              </div>

              {/* Or Separator */}
              <div data-fld className="mt-5 flex items-center justify-between">
                <span className="w-[44%] border-b border-border"></span>
                <span className="text-xs text-muted-foreground/60 select-none">or</span>
                <span className="w-[44%] border-b border-border"></span>
              </div>

              {/* Form Input Controls */}
              {mode === "signup" && (
                <>
                  {/* Role Selector */}
                  <div data-fld className="mt-5 flex border border-border rounded p-0.5 bg-paper/20">
                    {(["guest", "host"] as Role[]).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 rounded ${role === r ? "bg-ink text-paper" : "text-ink/60 hover:bg-paper/40"
                          }`}
                      >
                        I'm a {r}
                      </button>
                    ))}
                  </div>

                  <div data-fld className="mt-5">
                    <label className="text-sm font-medium text-ink">Name</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors placeholder:text-muted-foreground/45 text-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                </>
              )}

              <div data-fld className="mt-5">
                <label className="text-sm font-medium text-ink">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors placeholder:text-muted-foreground/45 text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div data-fld className="mt-5">
                <label className="text-sm font-medium text-ink">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors placeholder:text-muted-foreground/45 text-sm"
                  placeholder="••••••••"
                />
              </div>

              {/* Under-field Options: Remember cookie / Forgot password */}
              <div data-fld className="mt-5 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground select-none cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-border text-ink focus:ring-ink"
                  />
                  Remember for 30 days
                </label>
                {mode === "signin" && (
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-ink hover:text-ink/80 transition-colors"
                  >
                    Forgot password
                  </Link>
                )}
              </div>

              {/* Error messages */}
              {error && (
                <div data-fld className="mt-5 p-3.5 bg-destructive/5 border border-destructive/10 text-destructive text-xs leading-relaxed rounded flex flex-col gap-2">
                  <p>{error}</p>
                  {isUnverifiedError && (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="self-start text-xs font-semibold underline underline-offset-2 hover:text-destructive transition-colors"
                    >
                      Resend Verification Email
                    </button>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div data-fld className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink hover:opacity-90 active:scale-[0.99] text-white font-semibold text-xs uppercase tracking-wider py-3 rounded cursor-pointer transition-all duration-300 shadow-sm disabled:opacity-50"
                >
                  {loading ? "Processing..." : mode === "signup" ? "Create Account" : "Log in"}
                </button>
              </div>

              {/* Footer Switch Mode Link */}
              <div data-fld className="mt-8 text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("signin"); setError(null); setIsUnverifiedError(false); }}
                      className="font-semibold text-ink hover:underline cursor-pointer underline-offset-4"
                    >
                      Log in
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("signup"); setError(null); setIsUnverifiedError(false); }}
                      className="font-semibold text-ink hover:underline cursor-pointer underline-offset-4"
                    >
                      Sign up for free
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Right Column: Sliding Testimonials Panel */}
      <section className="relative hidden lg:flex flex-col justify-between p-16 text-white overflow-hidden bg-ink select-none">
        
        {/* Sliding Background Image Layer */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${slides[activeSlide].image})`,
          }}
        />
        {/* Overlay Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/50 to-ink/20" />

        {/* Top Spacer or Small Watermark */}
        <div className="relative z-10 flex justify-between items-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Selected stays</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">{activeSlide + 1} / {slides.length}</span>
        </div>

        {/* Centered Testimonial Details */}
        <div ref={textRef} className="relative z-10 mt-auto max-w-[480px] mb-8">
          
          {/* Star Ratings */}
          <div className="flex gap-1 mb-5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-4.5 w-4.5 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>

          {/* Testimonial Quote */}
          <p className="font-display text-2xl font-light leading-snug tracking-wide text-white mb-6">
            "{slides[activeSlide].quote}"
          </p>

          {/* User Profile Info */}
          <div>
            <h4 className="font-semibold text-base text-white">{slides[activeSlide].author}</h4>
            <p className="text-sm text-white/70 mt-0.5">{slides[activeSlide].role}</p>
          </div>
        </div>

        {/* Carousel Next/Prev Arrow Controllers */}
        <div className="absolute bottom-16 right-16 z-20 flex gap-3.5">
          <button
            type="button"
            onClick={handlePrevSlide}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 text-white transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Previous stay"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNextSlide}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 text-white transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label="Next stay"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
}
