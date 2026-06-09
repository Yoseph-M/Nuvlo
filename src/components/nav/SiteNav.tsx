import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client.ts";

export function SiteNav() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [scrolled, setScrolled] = useState(false);

  // Get the current URL path location
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // If the user is currently inside any host panel page, hide this navigation bar completely
  if (location.pathname.startsWith("/host")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const castedUser = user as { name?: string; email?: string; role?: string } | undefined;

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
        {/* Point safely to /host dashboard directly now that /host/new is deleted */}
        <Link to="/host" className="opacity-70 hover:opacity-100">
          Host
        </Link>
        {castedUser ? (
          <>
            <Link
              to={castedUser.email === "ab@gmail.com" ? "/admin" : castedUser.role === "host" ? "/host" : "/guest"}
              className="opacity-70 hover:opacity-100"
            >
              {castedUser.name?.split(" ")[0]}
            </Link>
            <button onClick={handleSignOut} className="opacity-70 hover:opacity-100 uppercase cursor-pointer bg-transparent border-none outline-none">
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