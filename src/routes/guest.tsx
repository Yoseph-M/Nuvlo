import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client.ts";
import { MagneticButton } from "../components/ui/MagneticButton";

export const Route = createFileRoute("/guest")({
  component: GuestDashboard,
});

function GuestDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <main className="px-8 py-32 pt-32 sm:px-12 lg:px-20 flex justify-center items-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading session...</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/auth" />;

  // Note: if user is not a guest, they can still view this page or we could restrict it.
  // For now, it's just their dashboard.

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <main className="px-8 py-32 pt-32 sm:px-12 lg:px-20 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Guest Dashboard</p>
        <h1 className="mt-3 font-display text-6xl">Bonjour, {user.name?.split(" ")[0]}.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          You're signed in as a {(user as any).role || "guest"}. {user.email}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <Link to="/explore" className="block border border-border p-8 transition-colors hover:border-ink">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">For guests</p>
            <h3 className="mt-3 font-display text-3xl">Plan your next stay</h3>
            <p className="mt-3 text-sm text-muted-foreground">Open the explore map.</p>
          </Link>

          <div className="border border-border p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Account</p>
            <h3 className="mt-3 font-display text-3xl">Active session</h3>
            <p className="mt-3 text-sm text-muted-foreground">Sign out will clear your session cookie.</p>
            <div className="mt-6">
              <MagneticButton variant="outline" onClick={handleSignOut}>Sign out</MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
