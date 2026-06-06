import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Image as ImageIcon, Search } from "lucide-react";

export const Route = createFileRoute("/host/messages")({
  component: CommunicationHub,
});

function CommunicationHub() {
  const [activeChat, setActiveChat] = useState<string>("chat1");
  const [newMessage, setNewMessage] = useState("");

  const chats = [
    { id: "chat1", name: "Alice Wonderland", property: "Luxury Villa", lastMessage: "What time is check-in?", unread: true },
    { id: "chat2", name: "John Doe", property: "Downtown Apt", lastMessage: "Thanks for hosting us!", unread: false },
    { id: "chat3", name: "Sarah Smith", property: "Luxury Villa", lastMessage: "Is there a parking space?", unread: false },
  ];

  const messages = [
    { id: "m1", sender: "guest", text: "Hi there! I am excited for my stay next week.", time: "10:00 AM" },
    { id: "m2", sender: "guest", text: "What time is check-in?", time: "10:02 AM" },
    { id: "m3", sender: "host", text: "Hello Alice! Check-in is at 3:00 PM. I will send you the access codes a day before.", time: "10:15 AM" }
  ];

  const activeChatDetails = chats.find(c => c.id === activeChat);

  return (
    <div className="animate-fade-in h-[calc(100vh-160px)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Messages</h1>
          <p className="mt-2 text-sm text-muted-foreground">Communicate with your guests.</p>
        </div>
      </div>

      <div className="flex h-full border border-border bg-paper shadow-sm rounded-sm overflow-hidden">
        {/* Left Pane - Chat List */}
        <div className="w-1/3 border-r border-border flex flex-col bg-paper-2/20">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 text-sm bg-paper border border-border rounded-full outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 border-b border-border cursor-pointer transition-colors ${activeChat === chat.id ? "bg-ink/5" : "hover:bg-paper-2/50"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-medium text-sm ${chat.unread ? "text-ink font-bold" : "text-ink/80"}`}>{chat.name}</h4>
                  {chat.unread && <span className="h-2 w-2 rounded-full bg-ink"></span>}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{chat.property}</p>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Chat Thread */}
        <div className="w-2/3 flex flex-col bg-paper">
          {/* Thread Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-paper">
            <div>
              <h3 className="font-display text-xl">{activeChatDetails?.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">Regarding: {activeChatDetails?.property}</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === "host" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[70%] p-4 rounded-sm ${
                  msg.sender === "host" 
                    ? "bg-ink text-paper rounded-tr-none" 
                    : "bg-paper-2 border border-border rounded-tl-none text-ink"
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-paper">
            <div className="flex items-end gap-2">
              <button className="p-3 text-muted-foreground hover:text-ink transition-colors">
                <ImageIcon className="h-5 w-5" />
              </button>
              <div className="flex-1 border border-border rounded-sm overflow-hidden focus-within:border-ink transition-colors">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="w-full bg-transparent p-3 outline-none resize-none text-sm min-h-[60px]"
                  rows={2}
                />
              </div>
              <button className="p-3 bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
