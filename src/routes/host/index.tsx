import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUpRight, TrendingUp, Wallet, ArrowRightLeft, Landmark } from "lucide-react";

export const Route = createFileRoute("/host/")({
    component: HostDashboard,
});

function HostDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/host/earnings");
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
        return (
            <div className="space-y-6">
                <div className="h-12 w-1/4 bg-slate-100 rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
                <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    const metrics = data?.metrics || { totalNetEarnings: 0, completedBookings: 0, upcomingProjectedIncome: 0 };
    const history = data?.payoutHistory || [];

    return (
        <div className="animate-fade-in space-y-8">

            {/* Dashboard Title Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Monitor real-time rental performance, revenue pipelines, and payout records.
                    </p>
                </div>
            </div>

            {/* Metrics Cards Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card 1: Total Net Earnings */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] flex flex-col justify-between group transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Net Earnings</span>
                        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600 transition-colors">
                            <ArrowUpRight className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-1">
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                            ${metrics.totalNetEarnings.toLocaleString()}
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">
                            After 10% platform commission deductions.
                        </p>
                    </div>
                </div>

                {/* Card 2: Completed Bookings */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] flex flex-col justify-between transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed Bookings</span>
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-800">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-1">
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                            {metrics.completedBookings}
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">
                            All-time historical guest listings fulfilled.
                        </p>
                    </div>
                </div>

                {/* Card 3: Projected Income */}
                <div className="p-6 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] flex flex-col justify-between transition-all duration-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Projected Income</span>
                        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-600">
                            <Wallet className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-1">
                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                            ${metrics.upcomingProjectedIncome.toLocaleString()}
                        </div>
                        <p className="text-[10px] font-medium text-slate-400">
                            Confirmed future reservations coming up.
                        </p>
                    </div>
                </div>

            </div>

            {/* Distribution Payout Table Card */}
            <div className="border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2.5 bg-slate-50/40">
                    <div className="p-2 bg-white border border-slate-200/60 rounded-xl text-slate-600">
                        <ArrowRightLeft className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Payout History</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">Settlement Date</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">Net Amount</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">Destination Account</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((item: any) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                                    <td className="px-6 py-4.5 text-slate-600 font-medium">
                                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4.5 font-bold text-slate-900">
                                        ${item.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4.5 text-slate-500 font-medium flex items-center gap-2">
                                        <Landmark className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                        <span>{item.destination}</span>
                                    </td>
                                    <td className="px-6 py-4.5">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100/80">
                                            ● {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {history.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                                        <div className="max-w-xs mx-auto flex flex-col items-center justify-center">
                                            <div className="h-10 w-10 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                                                <ArrowRightLeft className="h-4 w-4" />
                                            </div>
                                            <p className="font-semibold text-slate-800 text-sm">No settlements found</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Your payouts records will build up here as bookings finalize.</p>
                                        </div>
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