import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Image as ImageIcon, MapPin, Check, DollarSign, Home, Wifi, Zap, Droplet, Sun } from "lucide-react";
import { MagneticButton } from "../../components/ui/MagneticButton";

export const Route = createFileRoute("/host/properties")({
  component: PropertiesManager,
});

function PropertiesManager() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  
  // Create form states
  const [utilities, setUtilities] = useState<Record<string, boolean>>({
    wifi: false,
    generator: false,
    waterTank: false,
    solar: false,
  });

  if (activeTab === "create") {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl">List a new property</h1>
            <p className="mt-2 text-sm text-muted-foreground">Fill out the details below to add your residence.</p>
          </div>
          <MagneticButton variant="outline" onClick={() => setActiveTab("list")}>Cancel</MagneticButton>
        </div>

        <form className="space-y-12">
          {/* Basics */}
          <section className="p-8 border border-border bg-paper shadow-sm rounded-sm">
            <h2 className="font-display text-2xl mb-6">Basics</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Property Title</label>
                <input type="text" placeholder="e.g. Luxury Villa in Bole" className="w-full border-b border-border bg-transparent py-3 outline-none focus:border-ink transition-colors" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Description</label>
                <textarea rows={4} placeholder="Describe the space..." className="w-full border border-border bg-transparent p-3 outline-none focus:border-ink transition-colors rounded-sm resize-none"></textarea>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Bedrooms</label>
                  <input type="number" min="1" placeholder="1" className="w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Bathrooms</label>
                  <input type="number" min="1" placeholder="1" className="w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Max Guests</label>
                  <input type="number" min="1" placeholder="2" className="w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors" />
                </div>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="p-8 border border-border bg-paper shadow-sm rounded-sm">
            <h2 className="font-display text-2xl mb-6">Location</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Street Address</label>
                  <input type="text" placeholder="Street name and number" className="w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">City / Subcity</label>
                  <input type="text" placeholder="e.g. Bole" className="w-full border-b border-border bg-transparent py-2 outline-none focus:border-ink transition-colors" />
                </div>
              </div>
              <div className="h-full min-h-[200px] border border-border bg-paper-2/50 rounded-sm flex flex-col items-center justify-center text-muted-foreground">
                <MapPin className="h-8 w-8 mb-2" />
                <span className="text-xs uppercase tracking-wider">Map Pin Selector</span>
              </div>
            </div>
          </section>

          {/* Utilities & Amenities */}
          <section className="p-8 border border-border bg-paper shadow-sm rounded-sm">
            <h2 className="font-display text-2xl mb-6">Utilities</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: "wifi", label: "High-speed WiFi", icon: Wifi },
                { id: "generator", label: "Backup Generator", icon: Zap },
                { id: "waterTank", label: "Water Tank", icon: Droplet },
                { id: "solar", label: "Solar Power", icon: Sun },
              ].map((util) => (
                <div 
                  key={util.id}
                  onClick={() => setUtilities(prev => ({ ...prev, [util.id]: !prev[util.id] }))}
                  className={`border p-4 cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 text-center h-32 ${
                    utilities[util.id] ? "border-ink bg-ink/5 text-ink" : "border-border text-muted-foreground hover:border-ink/50"
                  }`}
                >
                  <util.icon className={`h-6 w-6 ${utilities[util.id] ? "text-ink" : "text-muted-foreground"}`} />
                  <span className="text-xs font-medium">{util.label}</span>
                  {utilities[util.id] && <Check className="h-4 w-4 absolute top-2 right-2 text-ink" />}
                </div>
              ))}
            </div>
          </section>

          {/* Photos */}
          <section className="p-8 border border-border bg-paper shadow-sm rounded-sm">
            <h2 className="font-display text-2xl mb-6">Photos</h2>
            <div className="border-2 border-dashed border-border p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-paper-2/50 transition-colors h-64">
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Drag & drop high-quality photos</p>
              <p className="text-xs text-muted-foreground mt-2">Minimum 5 photos recommended</p>
            </div>
          </section>

          {/* Pricing */}
          <section className="p-8 border border-border bg-paper shadow-sm rounded-sm">
            <h2 className="font-display text-2xl mb-6">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-border bg-paper-2/20">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Nightly Base Rate</p>
                <div className="flex items-center text-3xl font-display">
                  <DollarSign className="h-6 w-6 text-muted-foreground mr-1" />
                  <input type="number" placeholder="150" className="w-full bg-transparent outline-none" />
                </div>
              </div>
              <div className="p-6 border border-border bg-paper-2/20">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Weekly Discount (%)</p>
                <div className="flex items-center text-3xl font-display">
                  <input type="number" placeholder="10" className="w-full bg-transparent outline-none" />
                  <span className="text-muted-foreground text-xl ml-1">%</span>
                </div>
              </div>
              <div className="p-6 border border-border bg-paper-2/20">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Monthly Discount (%)</p>
                <div className="flex items-center text-3xl font-display">
                  <input type="number" placeholder="25" className="w-full bg-transparent outline-none" />
                  <span className="text-muted-foreground text-xl ml-1">%</span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4 border-t border-border">
            <MagneticButton type="button" onClick={() => setActiveTab("list")}>Save & Publish Listing</MagneticButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Properties</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your luxury listings and availability.</p>
        </div>
        <MagneticButton onClick={() => setActiveTab("create")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Listing
        </MagneticButton>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Placeholder for empty state or single listing */}
        <div className="border border-border p-12 text-center bg-paper shadow-sm flex flex-col items-center">
          <Home className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-display text-2xl mb-2">No active properties</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">You haven't listed any properties yet. Add your first residence to start receiving bookings.</p>
          <MagneticButton variant="outline" onClick={() => setActiveTab("create")}>Create Listing</MagneticButton>
        </div>
      </div>
    </div>
  );
}
