import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useAuth, type Role } from "../lib/mock/store";
import { MagneticButton } from "../../components/ui/MagneticButton";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Add your name").max(60),
  email: z.string().trim().email("Use a valid email").max(120),
});

function AuthPage() {
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);
  const [role, setRole] = useState<Role>("guest");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    registerGsap();
    if (!formRef.current) return;
    gsap.fromTo(
      formRef.current.querySelectorAll("[data-fld]"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: "slowReveal", stagger: 0.08, delay: 0.2 },
    );
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parse = schema.safeParse({ name, email });
    if (!parse.success) {
      setError(parse.error.issues[0].message);
      return;
    }
    signIn(email, name, role);
    navigate({ to: role === "host" ? "/host/new" : "/account" });
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
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

      <section className="flex items-center justify-center px-8 pt-24 lg:px-16">
        <form ref={formRef} onSubmit={submit} className="w-full max-w-sm">
          <h1 data-fld className="font-display text-5xl">Welcome.</h1>
          <p data-fld className="mt-3 text-sm text-muted-foreground">
            A demo sign-in. No password, no data leaves your browser.
          </p>

          <div data-fld className="mt-10 flex border border-border">
            {(["guest", "host"] as Role[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${role === r ? "bg-ink text-paper" : "text-ink hover:bg-paper-2"}`}
              >
                I'm a {r}
              </button>
            ))}
          </div>

          <div data-fld className="mt-8">
            <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none focus:border-ink"
              placeholder="Ada Lovelace"
            />
          </div>
          <div data-fld className="mt-6">
            <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-3 outline-none focus:border-ink"
              placeholder="you@maison.co"
            />
          </div>
          {error && <p data-fld className="mt-4 text-sm text-destructive">{error}</p>}
          <div data-fld className="mt-10">
            <MagneticButton className="w-full">Continue</MagneticButton>
          </div>
        </form>
      </section>
    </main>
  );
}
