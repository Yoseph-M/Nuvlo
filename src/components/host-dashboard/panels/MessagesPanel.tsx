import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Image as ImageIcon } from "lucide-react";

interface Message {
  id: string;
  sender: "host" | "guest";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  property: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Tigist Haile",
    initials: "TH",
    property: "Bole Heights Studio",
    lastMessage: "Is the WiFi strong enough for video calls?",
    time: "2m",
    unread: 2,
    messages: [
      { id: "m1", sender: "guest", text: "Hello! I just submitted a booking request.", time: "10:02" },
      { id: "m2", sender: "host", text: "Hi Tigist! Thanks for your interest. We'd love to host you.", time: "10:15" },
      { id: "m3", sender: "guest", text: "Great! Quick question — is the WiFi strong enough for video calls?", time: "10:32" },
    ],
  },
  {
    id: "c2",
    name: "Dawit Bekele",
    initials: "DB",
    property: "Kazanchis Loft",
    lastMessage: "What time is check-in?",
    time: "1h",
    unread: 1,
    messages: [
      { id: "m1", sender: "guest", text: "Hi, looking forward to the stay!", time: "09:00" },
      { id: "m2", sender: "guest", text: "What time is check-in?", time: "09:45" },
    ],
  },
  {
    id: "c3",
    name: "Sara Mekonnen",
    initials: "SM",
    property: "Kazanchis Loft",
    lastMessage: "Thank you, it was a lovely stay!",
    time: "2d",
    unread: 0,
    messages: [
      { id: "m1", sender: "guest", text: "Thank you, it was a lovely stay!", time: "Yesterday" },
      { id: "m2", sender: "host", text: "So glad to hear that Sara, you're welcome back anytime! 🙏", time: "Yesterday" },
    ],
  },
  {
    id: "c4",
    name: "Yonas Girma",
    initials: "YG",
    property: "Bole Heights Studio",
    lastMessage: "Is parking available nearby?",
    time: "3d",
    unread: 0,
    messages: [
      { id: "m1", sender: "guest", text: "Is parking available nearby?", time: "Mon" },
      { id: "m2", sender: "host", text: "Yes, there's a secure compound parking right next door, ETB 50/day.", time: "Mon" },
      { id: "m3", sender: "guest", text: "Perfect, thank you!", time: "Mon" },
    ],
  },
];

export function MessagesPanel() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>("c1");
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, active?.messages.length]);

  const markRead = (id: string) => {
    setConversations((cs) =>
      cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
    setActiveId(id);
  };

  const send = () => {
    if (!draft.trim()) return;
    const msg: Message = {
      id: Math.random().toString(36).slice(2),
      sender: "host",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConversations((cs) =>
      cs.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMessage: msg.text,
              time: "now",
            }
          : c
      )
    );
    setDraft("");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left pane — conversation list */}
      <div className="w-72 border-r border-black/8 bg-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-black/8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Messages</p>
          <h2 className="mt-1 font-display text-2xl text-black/85">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => markRead(c.id)}
              className={`w-full flex items-start gap-3 px-5 py-4 border-b border-black/5 text-left transition-colors ${
                activeId === c.id ? "bg-black/[0.03]" : "hover:bg-black/[0.02]"
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-[12px] font-semibold text-black/60">
                  {c.initials}
                </div>
                {c.unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {c.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-[13px] ${c.unread > 0 ? "font-semibold text-black" : "font-medium text-black/70"}`}>
                    {c.name}
                  </p>
                  <span className="text-[10px] text-black/30 shrink-0 ml-1">{c.time}</span>
                </div>
                <p className="text-[11px] text-black/35">{c.property}</p>
                <p className={`text-[11px] mt-0.5 truncate ${c.unread > 0 ? "text-black/60 font-medium" : "text-black/35"}`}>
                  {c.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right pane — thread */}
      <div className="flex-1 flex flex-col bg-black/[0.01] min-w-0">
        {/* Thread header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-black/8">
          <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-[12px] font-semibold text-black/60">
            {active.initials}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-black/85">{active.name}</p>
            <p className="text-[11px] text-black/40">{active.property}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {active.messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "host" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.sender === "host"
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-white border border-black/8 text-black/80 rounded-bl-sm shadow-sm"
                }`}
              >
                <p>{m.text}</p>
                <p className={`text-[10px] mt-1.5 ${m.sender === "host" ? "text-white/40" : "text-black/30"}`}>
                  {m.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-black/8 px-6 py-4">
          <div className="flex items-end gap-3">
            <div className="flex gap-2">
              <button className="p-2 rounded-lg text-black/30 hover:text-black/60 hover:bg-black/5 transition-colors">
                <Paperclip size={16} />
              </button>
              <button className="p-2 rounded-lg text-black/30 hover:text-black/60 hover:bg-black/5 transition-colors">
                <ImageIcon size={16} />
              </button>
            </div>
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type a message… (Enter to send)"
              className="flex-1 resize-none rounded-xl border border-black/10 bg-black/[0.02] px-4 py-2.5 text-sm text-black/80 placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-black/10 transition"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-30 transition-all"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
