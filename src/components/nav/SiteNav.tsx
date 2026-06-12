import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { authClient } from "../../lib/auth-client.ts";
import { Sun, Moon } from "lucide-react";
import { cn } from "../../lib/utils";

export function SiteNav() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  // Get the current URL path location
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Hide this navigation bar on host panel pages and auth-related pages
  const hiddenPaths = ["/auth", "/forgot-password", "/reset-password", "/verify-email"];
  if (location.pathname.startsWith("/host") || hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const castedUser = user as { name?: string; email?: string; role?: string } | undefined;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-8 transition-all duration-500",
        scrolled
          ? "bg-paper/85 dark:bg-paper/75 backdrop-blur-md border-b border-border/10 py-4 shadow-sm text-ink"
          : "mix-blend-difference text-paper py-6"
      )}
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
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border/20 text-current hover:border-current/40 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-3.5 w-3.5" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
        </button>
      </nav>
    </header>
  );
}