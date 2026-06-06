import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from "lucide-react";

export const Route = createFileRoute("/host/calendar")({
  component: CalendarManager,
});

function CalendarManager() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  // Generate mock calendar grid for current month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); // Adjust for Monday start

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

  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Availability Calendar</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your listing's availability to receive bookings.</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 mb-8 flex items-start gap-3 rounded-sm">
        <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Select dates to mark them as <strong>Blocked</strong>. All unselected dates will be available for guests to book.
        </p>
      </div>

      <div className="border border-border bg-paper shadow-sm rounded-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-muted-foreground" />
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 border border-border hover:bg-paper-2/50 rounded-sm transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={nextMonth} className="p-2 border border-border hover:bg-paper-2/50 rounded-sm transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-border border border-border">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="bg-paper p-3 text-[10px] uppercase tracking-[0.2em] font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
          
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="bg-paper-2/20 min-h-[120px] p-2 opacity-50 pointer-events-none"></div>
          ))}

          {days.map((day) => {
            const dateStr = `${year}-${month}-${day}`;
            const isBlocked = selectedDates.has(dateStr);
            return (
              <div 
                key={day} 
                onClick={() => toggleDate(day)}
                className={`bg-paper min-h-[120px] p-3 cursor-pointer border-[3px] border-transparent transition-all hover:border-ink/10 flex flex-col ${
                  isBlocked ? "bg-destructive/5 text-destructive" : ""
                }`}
              >
                <div className={`text-sm font-medium ${isBlocked ? "text-destructive" : "text-ink"}`}>{day}</div>
                {isBlocked && (
                  <div className="mt-auto text-[10px] uppercase tracking-wider font-semibold text-destructive/70 text-center">
                    Blocked
                  </div>
                )}
                {!isBlocked && (
                  <div className="mt-auto text-[10px] uppercase tracking-wider font-semibold text-emerald-600/70 text-center">
                    Available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
