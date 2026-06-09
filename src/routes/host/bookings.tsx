import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Calendar, User, Clock, ShieldInfo } from "lucide-react";

export const Route = createFileRoute("/host/bookings")({
  component: BookingsManager,
});

type BookingStatus = "pending" | "confirmed" | "cancelled";

interface Booking {
  id: string;
  guestName: string;
  propertyTitle: string;
  dates: string;
  price: number;
  status: BookingStatus;
  avatar: string;
}

function BookingsManager() {
  const [activeTab, setActiveTab] = useState<BookingStatus>("pending");
  const [bookings, setBookings] = useState<Booking[]>([
    { id: "b1", guestName: "Alice Wonderland", propertyTitle: "Luxury Villa in Bole", dates: "Oct 15 - Oct 20, 2026", price: 750, status: "pending", avatar: "A" },
    { id: "b2", guestName: "John Doe", propertyTitle: "Downtown Apartment", dates: "Nov 1 - Nov 5, 2026", price: 600, status: "pending", avatar: "J" },
  ]);

  const handleStatusUpdate = (id: string, newStatus: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  // Quick helper to determine tab styling variables dynamically
  const getTabBadgeColor = (tab: BookingStatus) => {
    if (tab === "pending") return "bg-amber-50 text-amber-700 border-amber-200/60";
    if (tab === "confirmed") return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="animate-fade-in space-y-8">

      {/* Title Segment */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Booking Requests</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Manage your custom tenant reservation validation inquiries, scheduling status logs, and updates.
          </p>
        </div>

        {/* Count overview banner strip */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 w-fit">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Action Required: {bookings.filter(b => b.status === "pending").length} Pending</span>
        </div>
      </div>

      {/* Premium Pill Tabs Segment */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl w-fit flex items-center gap-1.5 border border-slate-200/40">
        {(["pending", "confirmed", "cancelled"] as BookingStatus[]).map((tab) => {
          const isActive = activeTab === tab;
          const count = bookings.filter(b => b.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-200 focus:outline-none ${isActive
                ? "bg-white text-slate-950 shadow-sm border border-slate-200/60 scale-[1.01]"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                }`}
            >
              <span>{tab}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-extrabold ${isActive ? getTabBadgeColor(tab) : "bg-slate-200/70 text-slate-600 border-transparent"
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Bookings Content List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center bg-slate-50/50 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm mb-4">
              <Clock className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 text-base">No requests inside archive</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1">
              There are currently no {activeTab} reservation records to manage inside this filter window.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-5 sm:p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Guest Identity and Property Information */}
              <div className="flex items-start gap-4">
                {/* User Monogram Circle Badge */}
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/60 flex items-center justify-center font-bold text-sm text-slate-700 border border-slate-200/50 shrink-0">
                  {booking.avatar}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 tracking-tight text-lg leading-snug">
                    {booking.propertyTitle}
                  </h3>

                  {/* Metadata labels row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs font-medium pt-0.5">
                    <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <User className="h-3.5 w-3.5 text-slate-400 font-normal" />
                      {booking.guestName}
                    </span>
                    <span className="text-slate-200 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 font-normal" />
                      {booking.dates}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing details and contextual status actions */}
              <div className="flex items-center justify-between md:justify-end gap-6 md:flex-col md:items-end pt-4 border-t border-slate-100 md:border-t-0 md:pt-0 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-0.5">Total payout</span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    ${booking.price}
                  </div>
                </div>

                {/* Interactive State Actions Panel */}
                {booking.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-100/80 transition-all duration-150 focus:outline-none"
                    >
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                      className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-800 border border-slate-950 shadow-sm transition-all duration-150 focus:outline-none"
                    >
                      <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Accept
                    </button>
                  </div>
                ) : (
                  /* Read-only historical pill badge state */
                  <div className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${booking.status === "confirmed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-slate-50 text-slate-400 border-slate-200/60"
                    }`}>
                    {booking.status === "confirmed" ? "✓ Confirmed" : "✕ Cancelled"}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}