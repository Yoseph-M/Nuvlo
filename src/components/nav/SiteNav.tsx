import { Link } from "@tanstack/react-router";
import { useAuth } from "../../lib/mock/store";

export function SiteNav() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-8 py-6 mix-blend-difference text-paper">
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
            <Link to="/account" className="opacity-70 hover:opacity-100">
              {user.name.split(" ")[0]}
            </Link>
            <button onClick={signOut} className="opacity-70 hover:opacity-100 uppercase">
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
