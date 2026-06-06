import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client.ts";

export function SiteNav() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-8 py-5"
      style={{
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.65)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
        color: scrolled ? "#111" : "#000000ff",
        transition:
          "background-color 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease, color 0.35s ease",
      }}
    >
      <Link to="/" className="flex items-baseline gap-2 font-display text-2xl tracking-tight">
        <span>Bet</span>
        <span className="text-accent">·</span>
        <span className="text-[11px] uppercase tracking-[0.28em] opacity-70">ቤት</span>
      </Link>
      <nav className="flex items-center gap-8 text-[11px] uppercase tracking-[0.18em]">
        <Link to="/" activeProps={{ className: "opacity-100" }} className="opacity-70 hover:opacity-100">
          Stays
        </Link>
        <Link to="/explore" className="opacity-70 hover:opacity-100">
          Explore
        </Link>
        <Link to="/host/new" className="opacity-70 hover:opacity-100">
          Host
        </Link>
        {user ? (
          <>
            <Link to={user.email === "ab@gmail.com" ? "/admin" : user.role === "host" ? "/host" : "/guest"} className="opacity-70 hover:opacity-100">
              {user.name?.split(" ")[0]}
            </Link>
            <button onClick={handleSignOut} className="opacity-70 hover:opacity-100 uppercase cursor-pointer">
              Sign out
            </button>
          </>
        ) : (
          <Link to="/auth" className="opacity-70 hover:opacity-100">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
