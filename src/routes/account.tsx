import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "../lib/mock/store";
import { MagneticButton } from "../components/ui/MagneticButton";

export const Route = createFileRoute("/account")({
  component: Account,
});

function Account() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  if (!user) return <Navigate to="/auth" />;

  return (
    <main className="px-8 py-32 pt-32 sm:px-12 lg:px-20">
      <div className="mx-auto max-w-4xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Account</p>
        <h1 className="mt-3 font-display text-6xl">Bonjour, {user.name.split(" ")[0]}.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          You're signed in as a {user.role}. {user.email}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {user.role === "host" ? (
            <Link to="/host/new" className="block border border-border p-8 transition-colors hover:border-ink">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">For hosts</p>
              <h3 className="mt-3 font-display text-3xl">List another residence</h3>
              <p className="mt-3 text-sm text-muted-foreground">Open the multi-step wizard.</p>
            </Link>
          ) : (
            <Link to="/explore" className="block border border-border p-8 transition-colors hover:border-ink">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">For guests</p>
              <h3 className="mt-3 font-display text-3xl">Plan your next stay</h3>
              <p className="mt-3 text-sm text-muted-foreground">Open the explore map.</p>
            </Link>
          )}
          <div className="border border-border p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Account</p>
            <h3 className="mt-3 font-display text-3xl">Demo session</h3>
            <p className="mt-3 text-sm text-muted-foreground">Sign out resets local state.</p>
            <div className="mt-6">
              <MagneticButton variant="outline" onClick={signOut}>Sign out</MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
