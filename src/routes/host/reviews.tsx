import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MessageSquareReply, Check, ChevronDown, ChevronUp } from "lucide-react";
import { MagneticButton } from "../../components/ui/MagneticButton";

export const Route = createFileRoute("/host/reviews")({
  component: ReviewsBoard,
});

function ReviewsBoard() {
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const metrics = {
    overall: 4.8,
    total: 24,
    cleanliness: 4.9,
    accuracy: 4.8,
    communication: 5.0,
    location: 4.6
  };

  const reviews = [
    {
      id: "r1",
      guest: "Alice Wonderland",
      date: "October 2026",
      property: "Luxury Villa in Bole",
      rating: 5,
      text: "Absolutely stunning place! The host was incredibly responsive and the villa was immaculate. Highly recommend.",
      reply: null
    },
    {
      id: "r2",
      guest: "John Doe",
      date: "September 2026",
      property: "Downtown Apt",
      rating: 4,
      text: "Great location and very clean. The Wi-Fi was a bit spotty in the evenings, but otherwise a fantastic stay.",
      reply: "Thank you for the feedback John! We've since upgraded our ISP to ensure stable connections."
    }
  ];

  const handleReplySubmit = (id: string) => {
    // Mock submit
    setExpandedReply(null);
    setReplyText("");
  };

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Reviews</h1>
          <p className="mt-2 text-sm text-muted-foreground">Monitor guest feedback and maintain your reputation.</p>
        </div>
      </div>

      {/* Aggregate Score Overview */}
      <div className="border border-border bg-paper shadow-sm rounded-sm p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="text-center md:text-left flex-shrink-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Overall Rating</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-ink">
              <span className="font-display text-6xl">{metrics.overall}</span>
              <Star className="h-8 w-8 fill-ink" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Based on {metrics.total} reviews</p>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-2 gap-x-8 gap-y-6 pt-4 md:pt-0 md:border-l md:border-border md:pl-12">
            {[
              { label: "Cleanliness", value: metrics.cleanliness },
              { label: "Accuracy", value: metrics.accuracy },
              { label: "Communication", value: metrics.communication },
              { label: "Location", value: metrics.location },
            ].map(metric => (
              <div key={metric.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium text-ink">{metric.value}</span>
                </div>
                <div className="w-full h-1 bg-paper-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-ink" 
                    style={{ width: `${(metric.value / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review List */}
      <div>
        <h3 className="font-display text-2xl mb-6">Guest Feedback</h3>
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="border border-border bg-paper shadow-sm p-6 md:p-8 transition-colors hover:border-ink/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-lg text-ink">{review.guest}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {review.date} • <span className="font-medium">{review.property}</span>
                  </p>
                </div>
                <div className="flex gap-1 text-ink">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-ink" : "text-border"}`} />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-ink/80 leading-relaxed mb-6">"{review.text}"</p>

              {review.reply ? (
                <div className="ml-8 p-4 border-l-2 border-border bg-paper-2/30">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Your Response</p>
                  <p className="text-sm text-ink/80 italic">{review.reply}</p>
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => setExpandedReply(expandedReply === review.id ? null : review.id)}
                    className="flex items-center gap-2 text-xs font-medium text-ink/70 hover:text-ink transition-colors underline underline-offset-4"
                  >
                    <MessageSquareReply className="h-4 w-4" /> 
                    {expandedReply === review.id ? "Cancel Reply" : "Write a Response"}
                    {expandedReply === review.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  
                  {expandedReply === review.id && (
                    <div className="mt-4 animate-fade-in">
                      <div className="border border-border rounded-sm overflow-hidden focus-within:border-ink transition-colors bg-paper-2/10">
                        <textarea 
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Thank the guest for their stay..." 
                          className="w-full bg-transparent p-4 outline-none resize-none text-sm min-h-[100px]"
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <MagneticButton onClick={() => handleReplySubmit(review.id)} disabled={!replyText.trim()}>
                          Post Response <Check className="h-4 w-4 ml-2" />
                        </MagneticButton>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
