import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  CalendarDays,
  BookOpen,
  MessageSquare,
  DollarSign,
  Star,
  ChevronRight,
  Home,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { OnboardingPanel } from "./panels/OnboardingPanel";
import { PropertiesPanel } from "./panels/PropertiesPanel";
import { CalendarPanel } from "./panels/CalendarPanel";
import { BookingsPanel } from "./panels/BookingsPanel";
import { MessagesPanel } from "./panels/MessagesPanel";
import { EarningsPanel } from "./panels/EarningsPanel";
import { ReviewsPanel } from "./panels/ReviewsPanel";

type View =
  | "onboarding"
  | "properties"
  | "calendar"
  | "bookings"
  | "messages"
  | "earnings"
  | "reviews";

interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "onboarding", label: "Verification", icon: ShieldCheck },
  { id: "properties", label: "Properties", icon: Building2 },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "bookings", label: "Bookings", icon: BookOpen, badge: 3 },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { id: "earnings", label: "Earnings", icon: DollarSign },
  { id: "reviews", label: "Reviews", icon: Star },
];

const PANEL_TITLES: Record<View, string> = {
  onboarding: "Verification",
  properties: "Properties",
  calendar: "Calendar",
  bookings: "Bookings",
  messages: "Messages",
  earnings: "Earnings",
  reviews: "Reviews",
};

function renderPanel(view: View) {
  switch (view) {
    case "onboarding": return <OnboardingPanel />;
    case "properties": return <PropertiesPanel />;
    case "calendar": return <CalendarPanel />;
    case "bookings": return <BookingsPanel />;
    case "messages": return <MessagesPanel />;
    case "earnings": return <EarningsPanel />;
    case "reviews": return <ReviewsPanel />;
  }
}

export function HostDashboard({ userName }: { userName: string }) {
  const [view, setView] = useState<View>("onboarding");

  return (
    <div className="flex min-h-screen bg-black/[0.025]">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[oklch(0.14_0.015_60)] flex flex-col z-50 select-none">
        {/* Brand */}
        <div className="px-6 pt-8 pb-6 border-b border-white/8">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/30 mb-1">
            Host Dashboard
          </p>
          <h1 className="font-display text-2xl text-white/90 leading-none">Bet · ቤት</h1>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-medium tracking-wide transition-all ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                <Icon
                  size={15}
                  className={active ? "text-white" : "text-white/35 group-hover:text-white/60"}
                />
                <span>{label}</span>
                {badge && (
                  <span className="ml-auto bg-white/15 text-white/80 text-[9px] px-1.5 py-0.5 rounded-full font-semibold">
                    {badge}
                  </span>
                )}
                {active && (
                  <ChevronRight
                    size={11}
                    className="ml-auto text-white/30"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-5 border-t border-white/8 space-y-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            <Home size={13} />
            <span>Back to site</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[11px] font-semibold text-white/80 shrink-0">
              {(userName[0] ?? "H").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-white/70 truncate">{userName}</p>
              <p className="text-[9px] text-white/30 uppercase tracking-wider">Host</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <main className="ml-56 flex-1 min-h-screen flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-black/6">
          <div className="flex items-center gap-2 text-[11px] text-black/35">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-black/65 font-medium">{PANEL_TITLES[view]}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] text-black/40">Verified host</span>
          </div>
        </div>

        {/* Panel */}
        <div className="flex-1 overflow-y-auto">
          {renderPanel(view)}
        </div>
      </main>
    </div>
  );
}
