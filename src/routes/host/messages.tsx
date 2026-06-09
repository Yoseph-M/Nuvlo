import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Image as ImageIcon, MessageSquare, Building2, Circle } from "lucide-react";

export const Route = createFileRoute("/host/messages")({
  component: CommunicationHub,
});

function CommunicationHub() {
  const [activeChat, setActiveChat] = useState<string>("chat1");
  const [newMessage, setNewMessage] = useState("");

  const chats = [
    { id: "chat1", name: "Alice Wonderland", property: "Luxury Villa in Bole", lastMessage: "What time is check-in?", unread: true, avatar: "A" },
    { id: "chat2", name: "John Doe", property: "Downtown Apartment", lastMessage: "Thanks for hosting us!", unread: false, avatar: "J" },
  ];

  const messages = [
    { id: "m1", sender: "guest", text: "Hi there! I am excited for my stay next week.", time: "10:00 AM" },
    { id: "m2", sender: "guest", text: "What time is check-in?", time: "10:02 AM" },
    { id: "m3", sender: "host", text: "Hello Alice! Check-in is at 3:00 PM.", time: "10:15 AM" }
  ];

  const selectedChatInfo = chats.find(c => c.id === activeChat) || chats[0];

  return (
    <div className="animate-fade-in space-y-6 flex flex-col h-[calc(100vh-12rem)] min-h-[550px]">

      {/* Title Header */}
      <div className="border-b border-slate-100 pb-4 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Messages</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Keep in touch with your active and upcoming visitors on your properties.
        </p>
      </div>

      {/* Main Split Communication Window Container */}
      <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.01)] overflow-hidden grid grid-cols-1 md:grid-cols-3">

        {/* 1. LEFT SIDE PANEL: Chats Listing Menu */}
        <div className="border-r border-slate-100 flex flex-col h-full bg-slate-50/40">
          <div className="p-4 border-b border-slate-100 bg-white shrink-0">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-extrabold flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Inbox Channels
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1 p-2 space-y-1">
            {chats.map(chat => {
              const isSelected = activeChat === chat.id;
              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition-all duration-150 flex items-start gap-3 select-none ${isSelected
                    ? "bg-slate-950 text-white shadow-md shadow-slate-950/5"
                    : "hover:bg-slate-100/70 text-slate-900"
                    }`}
                >
                  {/* Text Monogram Avatar */}
                  <div className={`h-9 w-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${isSelected ? "bg-white/10 border-white/10 text-white" : "bg-slate-100 border-slate-200/60 text-slate-700"
                    }`}>
                    {chat.avatar}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                      {chat.unread && (
                        <Circle className={`h-2 w-2 fill-current shrink-0 ${isSelected ? "text-rose-400" : "text-rose-600"}`} />
                      )}
                    </div>
                    <p className={`text-[11px] truncate flex items-center gap-1 ${isSelected ? "text-slate-400" : "text-slate-400"}`}>
                      <Building2 className="h-3 w-3 shrink-0" /> {chat.property}
                    </p>
                    <p className={`text-xs truncate pt-1 ${isSelected ? "text-slate-300" : "text-slate-600 font-medium"}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. RIGHT SIDE PANEL: Main Message Dynamic Content Feed */}
        <div className="col-span-2 flex flex-col h-full bg-white">

          {/* Active Conversation Context Bar */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">{selectedChatInfo.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                <Building2 className="h-3 w-3 text-slate-300" /> {selectedChatInfo.property}
              </p>
            </div>
          </div>

          {/* Scrolling Speech Bubbles Grid Box */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
            {messages.map(msg => {
              const isHost = msg.sender === "host";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[75%] ${isHost ? "ml-auto items-end" : "mr-auto items-start"}`}
                >
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isHost
                    ? "bg-slate-950 text-white rounded-tr-none"
                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                    }`}>
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Interactive Chat Composer Input Section */}
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl p-1.5 focus-within:border-slate-400 focus-within:bg-white transition-all duration-150">

              {/* Media upload option utility */}
              <button
                type="button"
                className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                title="Attach Files"
              >
                <ImageIcon className="h-4 w-4" />
              </button>

              {/* Message box prompt */}
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedChatInfo.name.split(" ")[0]}...`}
                className="flex-1 bg-transparent px-2 py-1.5 outline-none border-none text-sm text-slate-900 placeholder-slate-400 min-w-0"
              />

              {/* Action Submit Dispatch Trigger */}
              <button
                type="button"
                className="p-2.5 bg-slate-950 text-white rounded-lg hover:bg-slate-800 shadow-sm transition-all duration-150 focus:outline-none flex items-center justify-center shrink-0 disabled:opacity-50"
                disabled={!newMessage.trim()}
                title="Send Message"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}