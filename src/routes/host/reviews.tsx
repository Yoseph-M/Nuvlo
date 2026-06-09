import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MessageSquareReply, Building2, Calendar, Sparkles } from "lucide-react";
import { MagneticButton } from "../../components/ui/MagneticButton";

export const Route = createFileRoute("/host/reviews")({
  component: ReviewsBoard,
});

function ReviewsBoard() {
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const metrics = { overall: 4.8, total: 24, cleanliness: 4.9, accuracy: 4.8, communication: 5.0, location: 4.6 };
  const reviews = [
    { id: "r1", guest: "Alice Wonderland", date: "October 2026", property: "Luxury Villa in Bole", rating: 5, text: "Absolutely stunning place! The host was incredibly responsive.", reply: null },
  ];

  return (
    <div className="animate-fade-in space-y-8">

      {/* Page Title Section */}
      <div className="border-b border-slate-100 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Reviews</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          See tenant evaluation scores, quality metrics, and manage host response updates.
        </p>
      </div>

      {/* Premium Split Summary Scorecard Block */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] p-6 sm:p-8 flex flex-col lg:flex-row gap-8 items-stretch">

        {/* Left Sub-Card: Big Badge Main Score */}
        <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 border border-slate-100/70 rounded-xl lg:w-1/4 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Overall Rating</span>
          <div className="text-5xl font-black tracking-tight text-slate-900 flex items-baseline gap-1">
            {metrics.overall}
            <span className="text-xs text-slate-400 font-bold">/5.0</span>
          </div>
          <div className="flex items-center gap-0.5 text-amber-400 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-3 bg-white border border-slate-200/50 px-2.5 py-1 rounded-md">
            Based on {metrics.total} reviews
          </span>
        </div>

        {/* Right Sub-Card: Individual Quality Dimension Progress Sliders */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 justify-center py-2">
          {[
            { label: "Cleanliness", value: metrics.cleanliness },
            { label: "Communication", value: metrics.communication },
            { label: "Accuracy", value: metrics.accuracy },
            { label: "Location", value: metrics.location },
          ].map((metric) => (
            <div key={metric.label} className="flex flex-col justify-center space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold tracking-tight text-slate-700">
                <span>{metric.label}</span>
                <span className="text-slate-900">{metric.value.toFixed(1)}</span>
              </div>
              {/* Progress Track */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-950 rounded-full transition-all duration-500"
                  style={{ width: `${(metric.value / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Reviews Loop Block */}
      <div className="space-y-4">
        {reviews.map(review => {
          const isReplying = expandedReply === review.id;
          return (
            <div
              key={review.id}
              className="p-6 sm:p-8 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-200"
            >
              {/* Review Header Detail Row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-50">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">{review.guest}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs font-semibold mt-1">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Building2 className="h-3.5 w-3.5 text-slate-300" /> {review.property}
                    </span>
                    <span className="hidden sm:inline text-slate-200">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" /> {review.date}
                    </span>
                  </div>
                </div>

                {/* Micro Star Badge Row */}
                <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50/50 border border-amber-100/60 px-2.5 py-1 rounded-xl w-fit shrink-0">
                  {Array.from({ length: review.rating }).map((_, idx) => (
                    <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Guest Comment Text Description */}
              <p className="text-slate-700 text-sm leading-relaxed my-5 font-medium italic">
                "{review.text}"
              </p>

              {/* Action Dropdown Control Trigger */}
              {!isReplying && (
                <button
                  type="button"
                  onClick={() => setExpandedReply(review.id)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors focus:outline-none"
                >
                  <MessageSquareReply className="h-3.5 w-3.5" /> Write a Response
                </button>
              )}

              {/* Collapsible Action Input Field Box */}
              {isReplying && (
                <div className="mt-4 pt-4 border-t border-slate-50 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Sparkles className="h-3.5 w-3.5 text-slate-400" /> Formulate Host Response
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Thank ${review.guest.split(" ")[0]} for choosing your property...`}
                    className="w-full bg-slate-50/50 border border-slate-200/70 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-slate-950 min-h-[110px] transition-all duration-150 resize-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedReply(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide text-slate-500 hover:bg-slate-50 transition-colors focus:outline-none"
                    >
                      Cancel
                    </button>
                    <MagneticButton onClick={() => setExpandedReply(null)}>
                      Post Response
                    </MagneticButton>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}