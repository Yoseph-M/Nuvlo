import { createFileRoute, Outlet, Link, Navigate, useLocation } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client.ts";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  Inbox,
  MessageSquare,
  Star,
  ShieldCheck,
  LogOut,
  User,
  Menu,
} from "lucide-react";

export const Route = createFileRoute("/host")({
  component: HostLayout,
});

function HostLayout() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const location = useLocation();

  // State to manage the sidebar toggle (expanded vs collapsed)
  const [isExpanded, setIsExpanded] = useState(true);

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Loading Environment</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const hostUser = user as { name: string; email: string; role?: string };

  if (hostUser.role !== "host") {
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
    <div className="h-screen w-screen overflow-hidden bg-slate-50/50 text-slate-900 font-sans antialiased flex flex-col selection:bg-rose-50 selection:text-rose-600">

      {/* 1. FIXED TOP BRAND HEADER LAYER */}
      <header className="h-16 w-full bg-white border-b border-slate-100 fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            title={isExpanded ? "Collapse Menu" : "Expand Menu"}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-baseline gap-1.5 font-display text-xl tracking-tight font-bold">
            <span className="text-slate-950">Bet</span>
            <span className="text-rose-500 font-black text-lg">·</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold">ቤት</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-rose-50 text-rose-600 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider border border-rose-100 uppercase hidden sm:inline-block">
            Host Portal
          </span>
        </div>
      </header>

      {/* Main Container Wrapper - Appling h-[calc(100vh-4rem)] locks layout structure boundaries */}
      <div className="flex flex-1 pt-16 h-[calc(100vh-4rem)] overflow-hidden relative">

        {/* 2. FIXED SIDEBAR PANEL */}
        <aside
          className={`sticky top-0 bottom-0 left-0 bg-white border-r border-slate-100 flex flex-col pb-6 pt-4 h-full shrink-0 transition-all duration-300 ease-in-out z-40 ${isExpanded ? "w-64 px-4" : "w-20 px-3"
            }`}
        >
          {/* Main menu links wrapper area */}
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = item.path === "/host"
                ? location.pathname === "/host" || location.pathname === "/host/"
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center rounded-xl transition-all duration-200 group relative ${isExpanded ? "gap-3 px-4 py-3.5" : "justify-center p-3.5"
                    } ${isActive
                      ? "bg-slate-950 text-white shadow-md shadow-slate-950/10 font-medium"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    }`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-rose-400" : "text-slate-400 group-hover:text-slate-900"}`} />

                  {isExpanded ? (
                    <span className="text-sm font-semibold tracking-wide whitespace-nowrap">{item.label}</span>
                  ) : (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Context Section inside Drawer Footer - Formatted tightly to remain pinned to base */}
          <div className="pt-4 border-t border-slate-100 mt-auto flex flex-col gap-2 bg-white shrink-0">
            <div className={`flex items-center ${isExpanded ? "gap-3 px-2 py-1.5" : "justify-center"}`}>
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-600 p-[2px] shadow-sm shrink-0">
                <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center font-bold text-xs text-slate-800">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3 w-3" />}
                </div>
              </div>
              {isExpanded && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className={`flex items-center text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all ${isExpanded ? "gap-3 px-4 py-3.5 w-full text-left" : "justify-center p-3.5"
                }`}
              title="Sign Out Workspace"
            >
              <LogOut className="h-5 w-5 shrink-0 text-slate-400" />
              {isExpanded && <span className="text-sm font-semibold tracking-wide">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* 3. CORE WORKSPACE WORK PANE */}
        {/* FIXED: Uses flex-1 and w-0 to claim all remaining desktop room flawlessly */}
        <main className="flex-1 w-0 h-full overflow-y-auto bg-slate-50/30">
          <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto w-full">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] p-6 sm:p-10 min-h-[calc(100vh-8rem)] w-full">
              <Outlet />
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}