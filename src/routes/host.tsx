import { createFileRoute, Outlet, Link, Navigate } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client.ts";
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Inbox, 
  MessageSquare, 
  Star, 
  ShieldCheck,
  LogOut
} from "lucide-react";

export const Route = createFileRoute("/host")({
  component: HostLayout,
});

function HostLayout() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <main className="flex h-screen w-full items-center justify-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading...</p>
      </main>
    );
  }

  if (!user || user.role !== "host") {
    return <Navigate to="/auth" />;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/host" },
    { label: "Properties", icon: Building2, path: "/host/properties" },
    { label: "Calendar", icon: CalendarDays, path: "/host/calendar" },
    { label: "Bookings", icon: Inbox, path: "/host/bookings" },
    { label: "Messages", icon: MessageSquare, path: "/host/messages" },
    { label: "Reviews", icon: Star, path: "/host/reviews" },
    { label: "Verification", icon: ShieldCheck, path: "/host/verification" },
  ];

  return (
    <div className="flex h-screen w-full bg-paper">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-paper-2/30 flex flex-col pt-24 pb-8 px-6 fixed h-full z-10">
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Host Portal</p>
          <h2 className="mt-2 font-display text-2xl truncate">{user.name}</h2>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-ink/70 hover:text-ink hover:bg-paper-2/50 transition-colors [&.active]:bg-ink/5 [&.active]:text-ink [&.active]:font-medium"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-border mt-auto">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-sm text-sm text-ink/70 hover:text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 overflow-y-auto pt-24 px-8 lg:px-16 pb-16">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
