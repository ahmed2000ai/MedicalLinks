"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/features/messaging/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserCircle } from "lucide-react";

export function MessageThread({
  conversationId,
  messages: initialMessages,
  currentUserId,
}: {
  conversationId: string;
  messages: any[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() || isSending) return;
    
    setIsSending(true);
    const res = await sendMessage(conversationId, currentUserId, content);
    
    if (res.success && res.message) {
      // Optimistically append (or rely on the returned message which has no sender populated fully, so we mock it)
      setMessages((prev) => [
        ...prev,
        {
          ...res.message,
          senderId: currentUserId,
          sender: { id: currentUserId, firstName: "You", lastName: "" }, // Rough mock for UI
        },
      ]);
      setContent("");
    }
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
              <UserCircle className="h-8 w-8 text-muted-foreground shrink-0 mt-1" />
              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-xs text-muted-foreground mb-1 px-1">
                  {isMe ? "You" : `${msg.sender?.firstName} ${msg.sender?.lastName}`} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div 
                  className={`p-3 rounded-2xl ${
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-sm" 
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-card border-t">
        <div className="flex gap-2">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-32 resize-y"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button 
            className="h-auto px-6 shrink-0" 
            onClick={handleSend}
            disabled={!content.trim() || isSending}
          >
            {isSending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Send size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
