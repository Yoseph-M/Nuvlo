import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Calendar, User, Clock } from "lucide-react";
import { MagneticButton } from "../../components/ui/MagneticButton";

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

  // Mock data for requests
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "b1",
      guestName: "Alice Wonderland",
      propertyTitle: "Luxury Villa in Bole",
      dates: "Oct 15 - Oct 20, 2026",
      price: 750,
      status: "pending",
      avatar: "A"
    },
    {
      id: "b2",
      guestName: "John Doe",
      propertyTitle: "Downtown Apartment",
      dates: "Nov 1 - Nov 5, 2026",
      price: 600,
      status: "pending",
      avatar: "J"
    },
    {
      id: "b3",
      guestName: "Sarah Smith",
      propertyTitle: "Luxury Villa in Bole",
      dates: "Sep 10 - Sep 14, 2026",
      price: 600,
      status: "confirmed",
      avatar: "S"
    }
  ]);

  const handleStatusUpdate = async (id: string, newStatus: BookingStatus) => {
    // Optimistic UI update
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

    try {
      await fetch(`http://localhost:5001/api/host/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error(err);
      // Revert if API fails
    }
  };

  const filteredBookings = bookings.filter(b => b.status === activeTab);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Booking Requests</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage incoming stays and reservation statuses.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-8">
        {(["pending", "confirmed", "cancelled"] as BookingStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors border-b-2 relative top-[1px] ${
              activeTab === tab 
                ? "border-ink text-ink" 
                : "border-transparent text-muted-foreground hover:text-ink"
            }`}
          >
            {tab}
            {tab === "pending" && bookings.filter(b => b.status === "pending").length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center bg-ink text-paper text-[9px] rounded-full h-4 w-4">
                {bookings.filter(b => b.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-12 border border-border text-center bg-paper shadow-sm">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">No {activeTab} bookings found.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="p-6 border border-border bg-paper shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-ink/20">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-paper-2 border border-border flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-lg text-ink/70">{booking.avatar}</span>
                </div>
                <div>
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {booking.guestName}
                    {booking.status === "pending" && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[9px] uppercase tracking-wider font-semibold border border-amber-500/20">
                        Pending
                      </span>
                    )}
                    {booking.status === "confirmed" && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] uppercase tracking-wider font-semibold border border-emerald-500/20">
                        Confirmed
                      </span>
                    )}
                  </h3>
                  <div className="text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {booking.propertyTitle}</span>
                    <span className="hidden sm:inline text-border">•</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {booking.dates}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-4 border-t border-border pt-4 md:border-0 md:pt-0">
                <div className="font-display text-2xl">${booking.price}</div>
                {booking.status === "pending" && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      className="flex items-center justify-center px-4 py-2 text-xs font-medium text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 transition-colors"
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                      className="flex items-center justify-center px-4 py-2 text-xs font-medium text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                    >
                      <Check className="h-4 w-4 mr-1" /> Accept
                    </button>
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
