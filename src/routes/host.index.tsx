import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUpRight, TrendingUp, Wallet, ArrowDownRight } from "lucide-react";

export const Route = createFileRoute("/host/")({
  component: HostDashboard,
});

function HostDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call to GET /host/earnings
    const fetchEarnings = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/host/earnings", {
          // Normally pass headers for better-auth here, but keeping it simple for mock state
        });
        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error("Failed to fetch earnings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (isLoading) {
    return <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading financials...</div>;
  }

  const metrics = data?.metrics || { totalNetEarnings: 0, completedBookings: 0, upcomingProjectedIncome: 0 };
  const history = data?.payoutHistory || [];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Financial Overview</h1>
          <p className="mt-2 text-sm text-muted-foreground">Track your revenue streams and payout history.</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border border-border bg-paper shadow-sm rounded-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <Wallet className="h-4 w-4" />
            <p className="text-[10px] uppercase tracking-[0.2em]">Total Net Earnings</p>
          </div>
          <h2 className="font-display text-4xl">${metrics.totalNetEarnings.toLocaleString()}</h2>
          <p className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            After 10% platform commission
          </p>
        </div>

        <div className="p-6 border border-border bg-paper shadow-sm rounded-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <ArrowUpRight className="h-4 w-4" />
            <p className="text-[10px] uppercase tracking-[0.2em]">Completed Bookings</p>
          </div>
          <h2 className="font-display text-4xl">{metrics.completedBookings}</h2>
          <p className="mt-2 text-xs text-muted-foreground">All-time stays</p>
        </div>

        <div className="p-6 border border-border bg-paper shadow-sm rounded-sm">
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <ArrowDownRight className="h-4 w-4" />
            <p className="text-[10px] uppercase tracking-[0.2em]">Projected Income</p>
          </div>
          <h2 className="font-display text-4xl">${metrics.upcomingProjectedIncome.toLocaleString()}</h2>
          <p className="mt-2 text-xs text-muted-foreground">From upcoming confirmed bookings</p>
        </div>
      </div>

      {/* Payout History Table */}
      <div>
        <h3 className="font-display text-2xl mb-6">Payout History</h3>
        <div className="border border-border rounded-sm overflow-hidden bg-paper shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper-2/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Destination</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {history.map((item: any) => (
                <tr key={item.id} className="hover:bg-paper-2/30 transition-colors">
                  <td className="px-6 py-4">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">${item.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.destination}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No payouts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
