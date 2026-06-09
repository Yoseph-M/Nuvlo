import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/host/calendar")({
  component: CalendarManager,
});

function CalendarManager() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i);

  const toggleDate = (day: number) => {
    const dateStr = `${year}-${month}-${day}`;
    const newDates = new Set(selectedDates);
    if (newDates.has(dateStr)) {
      newDates.delete(dateStr);
    } else {
      newDates.add(dateStr);
    }
    setSelectedDates(newDates);
  };

  return (
    <div className="animate-fade-in space-y-6">

      {/* Title Segment */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Availability Calendar</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Select specific date tiles on the grid below to manually toggle booking windows open or blocked.
          </p>
        </div>
      </div>

      {/* Modern Notice / Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/60 text-blue-800 text-xs sm:text-sm">
        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
        <p className="leading-normal font-medium">
          <strong className="font-bold">Host Tip:</strong> Blocked dates prevent guests from initiating reservation requests during those intervals. Active property bookings automatically update this timeline.
        </p>
      </div>

      {/* Main Calendar Card Wrapper */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] overflow-hidden">

        {/* Calendar Header Toolbar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-700">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight capitalize">
              {currentMonth.toLocaleString("default", { month: "long" })} {year}
            </h2>
          </div>

          {/* Navigation Control Buttons */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200/60 shadow-sm">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors focus:outline-none"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* The Grid Core Matrix */}
        <div className="p-4 bg-white">
          <div className="grid grid-cols-7 gap-1.5">

            {/* Days of the Week Row */}
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="py-2.5 text-[10px] uppercase tracking-[0.2em] font-extrabold text-center text-slate-400"
              >
                {day}
              </div>
            ))}

            {/* Empty Blank Offset Padding Elements */}
            {blanks.map((_, i) => (
              <div
                key={`blank-${i}`}
                className="bg-slate-50/40 rounded-xl min-h-[100px] sm:min-h-[110px] border border-dashed border-slate-100/60 opacity-40 pointer-events-none"
              />
            ))}

            {/* Dynamic Active Month Days */}
            {days.map((day) => {
              const dateStr = `${year}-${month}-${day}`;
              const isBlocked = selectedDates.has(dateStr);

              return (
                <div
                  key={day}
                  onClick={() => toggleDate(day)}
                  className={`min-h-[100px] sm:min-h-[110px] p-3 rounded-xl cursor-pointer border flex flex-col justify-between transition-all duration-150 select-none ${isBlocked
                      ? "bg-rose-50/40 border-rose-200/70 hover:bg-rose-50/70"
                      : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                    }`}
                >
                  {/* Day Number Label */}
                  <span className={`text-sm font-bold tracking-tight ${isBlocked ? "text-rose-700" : "text-slate-800"
                    }`}>
                    {day}
                  </span>

                  {/* Status Indicator Pill */}
                  {isBlocked ? (
                    <div className="w-full py-1 rounded-lg bg-rose-100/60 text-[9px] uppercase font-black tracking-wider text-rose-700 text-center flex items-center justify-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-rose-500" />
                      <span>Blocked</span>
                    </div>
                  ) : (
                    <div className="w-full py-1 rounded-lg bg-emerald-50 text-[9px] uppercase font-black tracking-wider text-emerald-700 text-center flex items-center justify-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      <span>Available</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}