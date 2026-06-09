import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Home, Wifi, Zap, Droplet, Sun, MapPin, DollarSign, Building2 } from "lucide-react";
import { MagneticButton } from "../../components/ui/MagneticButton";

export const Route = createFileRoute("/host/properties")({
  component: PropertiesManager,
});

function PropertiesManager() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [utilities, setUtilities] = useState<Record<string, boolean>>({
    wifi: false,
    generator: false,
    waterTank: false,
    solar: false,
  });

  if (activeTab === "create") {
    return (
      <div className="animate-fade-in max-w-3xl mx-auto pb-16 space-y-8">

        {/* Creation Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">List a new property</h1>
            <p className="mt-1.5 text-sm text-slate-500">Fill out the key specifications below to publish your residence.</p>
          </div>
          <MagneticButton variant="outline" onClick={() => setActiveTab("list")}>
            Cancel
          </MagneticButton>
        </div>

        {/* Input Form Fields */}
        <form className="space-y-6">

          {/* Section 1: Basic Parameters */}
          <section className="p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Building2 className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Basic Specifications</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2">
                  Property Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Luxury Penthouse with Panoramic Views"
                  className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-950 outline-none transition-all duration-150"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> Location Description
                  </label>
                  <input
                    type="text"
                    placeholder="Bole, Addis Ababa"
                    className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-950 outline-none transition-all duration-150"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-slate-400" /> Nightly Rate (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="150"
                    className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-950 outline-none transition-all duration-150"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Infrastructural Utilities */}
          <section className="p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Zap className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Essential Backup Utilities</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "wifi", label: "High-Speed Wi-Fi", icon: Wifi },
                { key: "generator", label: "Backup Generator", icon: Zap },
                { key: "waterTank", label: "Water Tank Setup", icon: Droplet },
                { key: "solar", label: "Solar Energy System", icon: Sun },
              ].map((item) => {
                const isSelected = utilities[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => setUtilities(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-150 gap-2 ${isSelected
                        ? "border-slate-950 bg-slate-950 text-white shadow-md shadow-slate-950/10 scale-[1.02]"
                        : "border-slate-100 bg-slate-50/40 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                  >
                    <item.icon className={`h-5 w-5 ${isSelected ? "text-white" : "text-slate-500"}`} />
                    <span className="text-xs font-bold tracking-tight">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Form Actions Strip */}
          <div className="flex justify-end pt-4">
            <MagneticButton type="button" onClick={() => setActiveTab("list")}>
              Save & Publish Listing
            </MagneticButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8">

      {/* Properties Primary Index Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Properties</h1>
          <p className="mt-1.5 text-sm text-slate-500">Manage your active luxury housing listings, setup attributes, and availability.</p>
        </div>
        <MagneticButton onClick={() => setActiveTab("create")} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Listing
        </MagneticButton>
      </div>

      {/* Empty State Showcase Screen */}
      <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-slate-50/50 flex flex-col items-center justify-center max-w-xl mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm mb-5 text-slate-400">
          <Home className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">No active properties</h3>
        <p className="text-sm text-slate-400 mt-1 mb-6 max-w-sm leading-normal">
          You haven't listed any real estate spaces yet. Add your first residence to open reservations.
        </p>
        <MagneticButton variant="outline" onClick={() => setActiveTab("create")}>
          Create Listing
        </MagneticButton>
      </div>

    </div>
  );
}