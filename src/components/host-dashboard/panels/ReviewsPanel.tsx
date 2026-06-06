import { useState } from "react";
import { Star, ChevronDown, ChevronUp, Send } from "lucide-react";

interface Review {
  id: string;
  guest: string;
  initials: string;
  date: string;
  property: string;
  rating: number;
  content: string;
  categories: { label: string; score: number }[];
  hostReply?: string;
}

const REVIEWS: Review[] = [
  {
    id: "r1",
    guest: "Sara Mekonnen",
    initials: "SM",
    date: "Jun 1, 2025",
    property: "Kazanchis Loft",
    rating: 5,
    content:
      "Exceptional stay. The apartment was immaculate and the location was perfect for exploring Addis. The host was incredibly responsive and went above and beyond. Would absolutely return.",
    categories: [
      { label: "Cleanliness", score: 5 },
      { label: "Communication", score: 5 },
      { label: "Check-in", score: 5 },
      { label: "Accuracy", score: 5 },
    ],
  },
  {
    id: "r2",
    guest: "Yonas Girma",
    initials: "YG",
    date: "May 20, 2025",
    property: "Bole Heights Studio",
    rating: 4,
    content:
      "Very comfortable place with great amenities. The generator was a lifesaver during the power outage. Slightly tricky to find at first but the host sent helpful directions.",
    categories: [
      { label: "Cleanliness", score: 4 },
      { label: "Communication", score: 5 },
      { label: "Check-in", score: 3 },
      { label: "Accuracy", score: 4 },
    ],
    hostReply: "Thank you Yonas! We've since added a map pin to the listing to make arrival easier. Hope to see you again!",
  },
  {
    id: "r3",
    guest: "Hiwot Tadesse",
    initials: "HT",
    date: "Apr 12, 2025",
    property: "Bole Heights Studio",
    rating: 5,
    content:
      "Perfect for a solo work trip. Fast WiFi, quiet neighbourhood, and a lovely rooftop. I'll definitely come back on my next visit to Addis.",
    categories: [
      { label: "Cleanliness", score: 5 },
      { label: "Communication", score: 5 },
      { label: "Check-in", score: 5 },
      { label: "Accuracy", score: 5 },
    ],
  },
];

const AVG_RATING =
  REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

const CATEGORY_AVGS = ["Cleanliness", "Communication", "Check-in", "Accuracy"].map((label) => ({
  label,
  avg:
    REVIEWS.reduce(
      (s, r) => s + (r.categories.find((c) => c.label === label)?.score ?? 0),
      0
    ) / REVIEWS.length,
}));

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-black/15"
          }
        />
      ))}
    </div>
  );
}

function RatingBar({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex-1 h-1.5 rounded-full bg-black/8 overflow-hidden">
      <div
        className="h-full rounded-full bg-black/70 transition-all"
        style={{ width: `${(score / max) * 100}%` }}
      />
    </div>
  );
}

export function ReviewsPanel() {
  const [replies, setReplies] = useState<Record<string, string>>(() =>
    Object.fromEntries(REVIEWS.filter((r) => r.hostReply).map((r) => [r.id, r.hostReply!]))
  );
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) =>
    setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const submitReply = (id: string) => {
    const text = drafts[id]?.trim();
    if (!text) return;
    setReplies((r) => ({ ...r, [id]: text }));
    setDrafts((d) => ({ ...d, [id]: "" }));
    setExpanded((e) => ({ ...e, [id]: false }));
  };

  return (
    <div className="p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Reputation</p>
        <h2 className="mt-2 font-display text-4xl text-black/90">Guest reviews.</h2>
        <p className="mt-2 text-sm text-black/50">
          Public feedback from your guests. Reply to build trust.
        </p>
      </div>

      {/* Aggregate score */}
      <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-7 mb-8 max-w-2xl">
        <div className="flex items-start gap-8">
          {/* Overall */}
          <div className="text-center shrink-0">
            <p className="font-display text-5xl text-black/85">{AVG_RATING.toFixed(1)}</p>
            <StarRow rating={AVG_RATING} />
            <p className="text-[11px] text-black/35 mt-1.5">{REVIEWS.length} reviews</p>
          </div>

          <div className="h-20 w-px bg-black/8 mx-2" />

          {/* Category breakdown */}
          <div className="flex-1 space-y-2.5">
            {CATEGORY_AVGS.map(({ label, avg }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-[11px] text-black/50 w-28 shrink-0">{label}</span>
                <RatingBar score={avg} />
                <span className="text-[11px] font-semibold text-black/60 w-6 text-right">
                  {avg.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-5 max-w-2xl">
        {REVIEWS.map((r) => {
          const hasReply = !!replies[r.id];
          const isExpanded = expanded[r.id];

          return (
            <div
              key={r.id}
              className="rounded-2xl border border-black/8 bg-white shadow-sm p-6"
            >
              {/* Guest header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-[12px] font-semibold text-black/60 shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-black/85">{r.guest}</p>
                    <p className="text-[11px] text-black/35">{r.property} · {r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRow rating={r.rating} />
                  <span className="text-[12px] font-medium text-black/60">{r.rating}.0</span>
                </div>
              </div>

              {/* Review text */}
              <p className="mt-4 text-sm text-black/65 leading-relaxed">{r.content}</p>

              {/* Category scores */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {r.categories.map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-black/35 w-24 shrink-0">{c.label}</span>
                    <RatingBar score={c.score} />
                    <span className="text-[10px] text-black/40">{c.score}</span>
                  </div>
                ))}
              </div>

              {/* Existing reply */}
              {hasReply && (
                <div className="mt-4 rounded-xl bg-black/[0.03] border border-black/8 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-1.5">
                    Your reply
                  </p>
                  <p className="text-[12px] text-black/60 leading-relaxed">{replies[r.id]}</p>
                </div>
              )}

              {/* Reply toggle */}
              <button
                onClick={() => toggleExpand(r.id)}
                className="mt-3 flex items-center gap-1.5 text-[11px] text-black/40 hover:text-black/65 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={13} />
                    {hasReply ? "Edit reply" : "Cancel"}
                  </>
                ) : (
                  <>
                    <ChevronDown size={13} />
                    {hasReply ? "Edit reply" : "Write a reply"}
                  </>
                )}
              </button>

              {/* Reply compose */}
              {isExpanded && (
                <div className="mt-3 space-y-2">
                  <textarea
                    rows={3}
                    value={drafts[r.id] ?? (replies[r.id] ?? "")}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [r.id]: e.target.value }))
                    }
                    placeholder="Write a thoughtful reply to share with this guest…"
                    className="w-full resize-none rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black/75 placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => submitReply(r.id)}
                      disabled={!drafts[r.id]?.trim()}
                      className="flex items-center gap-2 px-5 py-2 bg-black text-white text-[12px] rounded-lg hover:bg-black/80 disabled:opacity-30 transition-all"
                    >
                      <Send size={12} />
                      Publish Reply
                    </button>
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
