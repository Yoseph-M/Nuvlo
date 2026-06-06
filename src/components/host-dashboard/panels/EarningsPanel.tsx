import { TrendingUp, BookCheck, CalendarClock, ArrowUpRight } from "lucide-react";

interface Payout {
  id: string;
  date: string;
  grossETB: number;
  commissionETB: number;
  netETB: number;
  account: string;
  status: "completed" | "pending" | "processing";
}

const PAYOUTS: Payout[] = [
  {
    id: "p1",
    date: "Jul 1, 2025",
    grossETB: 12500,
    commissionETB: 1250,
    netETB: 11250,
    account: "**** 4821",
    status: "pending",
  },
  {
    id: "p2",
    date: "Jun 1, 2025",
    grossETB: 11500,
    commissionETB: 1150,
    netETB: 10350,
    account: "**** 4821",
    status: "completed",
  },
  {
    id: "p3",
    date: "May 1, 2025",
    grossETB: 9900,
    commissionETB: 990,
    netETB: 8910,
    account: "**** 4821",
    status: "completed",
  },
  {
    id: "p4",
    date: "Apr 1, 2025",
    grossETB: 16800,
    commissionETB: 1680,
    netETB: 15120,
    account: "**** 4821",
    status: "completed",
  },
  {
    id: "p5",
    date: "Mar 1, 2025",
    grossETB: 13200,
    commissionETB: 1320,
    netETB: 11880,
    account: "**** 4821",
    status: "completed",
  },
];

const STATUS_STYLES: Record<Payout["status"], string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
};

const totalNet = PAYOUTS.filter((p) => p.status === "completed").reduce(
  (s, p) => s + p.netETB,
  0
);
const completedCount = PAYOUTS.filter((p) => p.status === "completed").length;
const upcomingNet = PAYOUTS.filter((p) => p.status === "pending").reduce(
  (s, p) => s + p.netETB,
  0
);

export function EarningsPanel() {
  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Financials</p>
        <h2 className="mt-2 font-display text-4xl text-black/90">Earnings overview.</h2>
        <p className="mt-2 text-sm text-black/50">
          All figures are net after Bet · ቤት's 10% platform commission.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl">
        {/* Total earnings */}
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              <TrendingUp size={18} className="text-black/50" />
            </div>
            <ArrowUpRight size={14} className="text-green-600" />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
            Total Net Earnings
          </p>
          <p className="mt-1 font-display text-3xl text-black/85">
            {(totalNet / 1000).toFixed(1)}k
          </p>
          <p className="text-[11px] text-black/35 mt-0.5">ETB</p>
        </div>

        {/* Completed bookings */}
        <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
              <BookCheck size={18} className="text-black/50" />
            </div>
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-black/40">
            Completed Bookings
          </p>
          <p className="mt-1 font-display text-3xl text-black/85">{completedCount}</p>
          <p className="text-[11px] text-black/35 mt-0.5">stays paid out</p>
        </div>

        {/* Upcoming */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <CalendarClock size={18} className="text-amber-600" />
            </div>
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-amber-700/70">
            Upcoming Projected
          </p>
          <p className="mt-1 font-display text-3xl text-amber-900">
            {(upcomingNet / 1000).toFixed(1)}k
          </p>
          <p className="text-[11px] text-amber-700/60 mt-0.5">ETB · after commission</p>
        </div>
      </div>

      {/* Payout history table */}
      <div className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black/40 mb-4">
          Payout History
        </p>
        <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/6">
                {["Date", "Gross", "Commission (10%)", "Net Payout", "Account", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] uppercase tracking-[0.15em] text-black/35 font-medium px-5 py-3.5"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors ${
                    i % 2 === 0 ? "" : "bg-black/[0.01]"
                  }`}
                >
                  <td className="px-5 py-4 text-black/70">{p.date}</td>
                  <td className="px-5 py-4 text-black/70">
                    ETB {p.grossETB.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-red-500/80">
                    − ETB {p.commissionETB.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-semibold text-black/85">
                    ETB {p.netETB.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-black/40 font-mono text-[12px]">
                    {p.account}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-black/30 mt-3">
          * All payouts are processed within 3–5 business days of stay completion.
        </p>
      </div>
    </div>
  );
}
