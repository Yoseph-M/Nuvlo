import { useState } from "react";
import { Check, X, Calendar, Clock } from "lucide-react";

type BookingStatus = "pending" | "confirmed" | "cancelled";
type Tab = BookingStatus;

interface Booking {
  id: string;
  guest: string;
  initials: string;
  property: string;
  dateRange: string;
  nights: number;
  totalETB: number;
  status: BookingStatus;
  requestedAt: string;
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    guest: "Tigist Haile",
    initials: "TH",
    property: "Bole Heights Studio",
    dateRange: "Jun 10 – Jun 15, 2025",
    nights: 5,
    totalETB: 12500,
    status: "pending",
    requestedAt: "2 hours ago",
  },
  {
    id: "b2",
    guest: "Dawit Bekele",
    initials: "DB",
    property: "Kazanchis Loft",
    dateRange: "Jun 20 – Jun 25, 2025",
    nights: 5,
    totalETB: 10000,
    status: "pending",
    requestedAt: "5 hours ago",
  },
  {
    id: "b3",
    guest: "Hanna Tesfaye",
    initials: "HT",
    property: "Bole Heights Studio",
    dateRange: "Jul 1 – Jul 4, 2025",
    nights: 3,
    totalETB: 7500,
    status: "pending",
    requestedAt: "1 day ago",
  },
  {
    id: "b4",
    guest: "Sara Mekonnen",
    initials: "SM",
    property: "Kazanchis Loft",
    dateRange: "May 28 – Jun 2, 2025",
    nights: 5,
    totalETB: 11500,
    status: "confirmed",
    requestedAt: "3 days ago",
  },
  {
    id: "b5",
    guest: "Yonas Girma",
    initials: "YG",
    property: "Bole Heights Studio",
    dateRange: "Jun 5 – Jun 8, 2025",
    nights: 3,
    totalETB: 7200,
    status: "confirmed",
    requestedAt: "1 week ago",
  },
  {
    id: "b6",
    guest: "Abebe Worku",
    initials: "AW",
    property: "Kazanchis Loft",
    dateRange: "May 15 – May 18, 2025",
    nights: 3,
    totalETB: 6900,
    status: "cancelled",
    requestedAt: "2 weeks ago",
  },
];

const TAB_LABELS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending Requests" },
  { id: "confirmed", label: "Confirmed Stays" },
  { id: "cancelled", label: "Cancelled" },
];

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

export function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [tab, setTab] = useState<Tab>("pending");

  const accept = (id: string) =>
    setBookings((b) =>
      b.map((x) => (x.id === id ? { ...x, status: "confirmed" } : x))
    );
  const reject = (id: string) =>
    setBookings((b) =>
      b.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x))
    );

  const filtered = bookings.filter((b) => b.status === tab);

  const counts: Record<Tab, number> = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Reservations</p>
        <h2 className="mt-2 font-display text-4xl text-black/90">Booking requests.</h2>
        <p className="mt-2 text-sm text-black/50">
          Review and manage stay requests from your guests.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-black/5 rounded-xl w-fit mb-8">
        {TAB_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[12px] font-medium transition-all ${
              tab === id
                ? "bg-white text-black shadow-sm"
                : "text-black/45 hover:text-black/70"
            }`}
          >
            {label}
            {counts[id] > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  id === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : id === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-black/10 text-black/40"
                }`}
              >
                {counts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="space-y-4 max-w-2xl">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-black/8 bg-white p-12 text-center">
            <p className="text-sm text-black/35">No {tab} bookings at the moment.</p>
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-black/10 flex items-center justify-center text-sm font-semibold text-black/60 shrink-0">
                  {b.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-black/85">{b.guest}</p>
                      <p className="text-[11px] text-black/40 mt-0.5">{b.property}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-[12px] text-black/50">
                      <Calendar size={12} />
                      <span>{b.dateRange}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-black/50">
                      <Clock size={12} />
                      <span>{b.nights} nights · Requested {b.requestedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-black/35">Total</span>
                      <p className="text-lg font-display text-black/85">
                        ETB {b.totalETB.toLocaleString()}
                      </p>
                    </div>

                    {b.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => reject(b.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-[12px] font-medium hover:bg-red-50 transition-colors"
                        >
                          <X size={13} />
                          Reject
                        </button>
                        <button
                          onClick={() => accept(b.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white text-[12px] font-medium hover:bg-black/80 transition-colors"
                        >
                          <Check size={13} />
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
