import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DateStatus = "available" | "blocked";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function firstDayOf(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}

export function CalendarPanel() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [statuses, setStatuses] = useState<Record<string, DateStatus>>({});

  const key = (d: number) => `${year}-${month}-${d}`;

  const toggle = (d: number) => {
    const k = key(d);
    setStatuses((prev) => {
      const cur = prev[k];
      if (!cur) return { ...prev, [k]: "available" };
      if (cur === "available") return { ...prev, [k]: "blocked" };
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const isPast = (d: number) =>
    new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const totalDays = daysInMonth(year, month);
  const firstDay = firstDayOf(year, month);

  const availableCount = Object.values(statuses).filter((v) => v === "available").length;
  const blockedCount = Object.values(statuses).filter((v) => v === "blocked").length;

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Availability</p>
        <h2 className="mt-2 font-display text-4xl text-black/90">Manage your calendar.</h2>
        <p className="mt-2 text-sm text-black/50">
          Click any future date to mark it as available or blocked. Dates with no selection are open by default.
        </p>
      </div>

      <div className="flex flex-wrap items-start gap-8">
        {/* Calendar card */}
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden w-full max-w-sm">
          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
            >
              <ChevronLeft size={16} className="text-black/50" />
            </button>
            <h3 className="text-sm font-semibold text-black/80">
              {MONTHS[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors"
            >
              <ChevronRight size={16} className="text-black/50" />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 border-b border-black/5">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] uppercase tracking-[0.15em] text-black/30 py-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-px p-3">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
              const s = statuses[key(d)];
              const past = isPast(d);
              const today_ = isToday(d);

              return (
                <button
                  key={d}
                  onClick={() => !past && toggle(d)}
                  disabled={past}
                  title={s ? s.charAt(0).toUpperCase() + s.slice(1) : "Click to mark"}
                  className={[
                    "flex items-center justify-center rounded-lg text-sm transition-all w-full aspect-square",
                    past
                      ? "text-black/20 cursor-not-allowed"
                      : "cursor-pointer",
                    today_ && !s
                      ? "ring-2 ring-black/30 font-semibold"
                      : "",
                    s === "available"
                      ? "bg-green-100 text-green-800 font-semibold hover:bg-green-200"
                      : "",
                    s === "blocked"
                      ? "bg-red-100 text-red-700 font-semibold hover:bg-red-200"
                      : "",
                    !s && !past
                      ? "text-black/70 hover:bg-black/5"
                      : "",
                  ].filter(Boolean).join(" ")}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend + Stats */}
        <div className="space-y-6 flex-1 min-w-48">
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">Legend</p>
            {[
              { color: "bg-green-100 border-green-300", label: "Available", hint: "Click once" },
              { color: "bg-red-100 border-red-300", label: "Blocked", hint: "Click twice" },
              { color: "bg-white border-black/15", label: "Default (open)", hint: "No click" },
              { color: "bg-black/10 border-transparent", label: "Past date", hint: "Not editable" },
            ].map(({ color, label, hint }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg border ${color} shrink-0`} />
                <div>
                  <p className="text-[12px] font-medium text-black/70">{label}</p>
                  <p className="text-[10px] text-black/35">{hint}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="rounded-xl border border-black/10 bg-white p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">This Month</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-black/50">Available days</span>
                <span className="font-semibold text-green-700">{availableCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/50">Blocked days</span>
                <span className="font-semibold text-red-600">{blockedCount}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-black/8 pt-2">
                <span className="text-black/50">Unset (open)</span>
                <span className="font-semibold text-black/60">
                  {totalDays - availableCount - blockedCount - [...Array(totalDays)].filter((_, i) => isPast(i + 1)).length}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStatuses({})}
            className="w-full py-2 border border-black/10 text-black/40 text-[11px] uppercase tracking-[0.15em] rounded-lg hover:bg-black/5 hover:text-black/60 transition-colors"
          >
            Clear month
          </button>
        </div>
      </div>
    </div>
  );
}
