"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/features/messaging/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, UserCircle, AlertCircle } from "lucide-react";
import { formatParticipantName } from "@/features/messaging/utils";

export function MessageThread({
  conversationId,
  messages: initialMessages,
  currentUserId,
  currentUserName,
  currentUserRole,
}: {
  conversationId: string;
  messages: any[];
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Only APPLICANT (doctor) and HOSPITAL_CONTACT may send messages
  const canSend = ["APPLICANT", "HOSPITAL_CONTACT"].includes(currentUserRole);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setError(null);

    const res = await sendMessage(conversationId, currentUserId, trimmed);

    if (res.success && res.message) {
      // Optimistically append using the real sender name
      setMessages((prev) => [
        ...prev,
        {
          ...res.message,
          senderId: currentUserId,
          sender: { id: currentUserId, firstName: currentUserName, lastName: "" },
        },
      ]);
      setContent("");
    } else {
      setError(res.error ?? "Failed to send message. Please try again.");
    }

    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation below.
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
              <UserCircle className="h-8 w-8 text-muted-foreground shrink-0 mt-1" />
              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className="text-xs text-muted-foreground mb-1 px-1">
                  {isMe ? "You" : formatParticipantName(msg.sender)}{" "}
                  &bull;{" "}
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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

      {/* Compose area */}
      <div className="shrink-0 p-4 bg-card border-t space-y-2">
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {canSend ? (
          <div className="flex gap-2 items-end">
            <Textarea
              id="message-compose"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
              className="min-h-[60px] max-h-40 resize-none flex-1"
              disabled={isSending}
              aria-label="Message compose box"
            />
            <Button
              id="message-send-btn"
              onClick={handleSend}
              disabled={!content.trim() || isSending}
              className="h-auto px-5 py-3 shrink-0"
              aria-label="Send message"
            >
              {isSending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-1">
            Messaging is not available for your account type.
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Do not share personal contact details outside of officially agreed channels.
        </p>
      </div>
    </div>
  );
}
