import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../lib/mock/store";
import { HostWizard } from "../../components/wizard/HostWizard";
import { gsap } from "gsap";
import { registerGsap } from "../lib/gsap/register";

export const Route = createFileRoute("/host/new")({
  component: HostNew,
});

function HostNew() {
  const user = useAuth((s) => s.user);
  const navigate = useNavigate();
  const successRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done || !successRef.current) return;
    registerGsap();
    const checkPath = successRef.current.querySelector("path");
    if (checkPath) {
      const len = (checkPath as SVGPathElement).getTotalLength();
      gsap.set(checkPath, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(checkPath, { strokeDashoffset: 0, duration: 1.2, ease: "luxe" });
    }
    gsap.fromTo(
      successRef.current.querySelectorAll("[data-success]"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: "slowReveal", stagger: 0.12, delay: 0.4 },
    );
    const t = setTimeout(() => navigate({ to: "/account" }), 3200);
    return () => clearTimeout(t);
  }, [done, navigate]);

  if (!user) return <Navigate to="/auth" />;
  if (user.role !== "host") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="max-w-md text-center">
          <h1 className="font-display text-4xl">Hosts only.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Switch your account to host mode to list a residence.
          </p>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 pt-24">
        <div ref={successRef} className="text-center">
          <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto" fill="none">
            <path
              d="M16 42 L34 58 L66 22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p data-success className="mt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Submitted for review
          </p>
          <h1 data-success className="mt-3 font-display text-5xl">
            Your stay is in good hands.
          </h1>
          <p data-success className="mt-4 text-sm text-muted-foreground">
            Taking you to your account…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="px-6 py-32 pt-32 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Host a residence</p>
          <h1 className="mt-3 font-display text-5xl">List your stay.</h1>
        </div>
        <HostWizard onComplete={() => setDone(true)} />
      </div>
    </main>
  );
}
