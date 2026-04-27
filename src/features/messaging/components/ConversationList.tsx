"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";

export function ConversationList({
  conversations,
  currentUserId,
}: {
  conversations: any[];
  currentUserId: string;
}) {
  if (conversations.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground">
        <p>You have no messages.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conv) => {
        const otherParticipant = conv.participants[0] || { firstName: "Unknown", lastName: "User" };
        const isUnread = conv.hasUnread;
        const lastMessage = conv.lastMessage;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className={`block p-4 hover:bg-muted/30 transition-colors ${
              isUnread ? "bg-primary/5" : ""
            }`}
          >
            <div className="flex gap-4 items-start">
              <UserCircle className="h-10 w-10 text-muted-foreground shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-base truncate ${isUnread ? "font-bold" : "font-semibold"}`}>
                    {otherParticipant.firstName} {otherParticipant.lastName}
                    {conv.application?.opportunity && (
                      <span className="text-muted-foreground font-normal ml-2 text-sm">
                        • {conv.application.opportunity.title}
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {lastMessage ? new Date(lastMessage.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>
                
                {conv.subject && (
                  <p className="text-sm font-medium text-foreground mt-0.5">{conv.subject}</p>
                )}
                
                <p className={`text-sm mt-1 truncate ${isUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {lastMessage ? (
                    <>
                      {lastMessage.senderId === currentUserId ? "You: " : ""}
                      {lastMessage.content}
                    </>
                  ) : (
                    "No messages yet."
                  )}
                </p>
              </div>
              {isUnread && (
                <div className="h-3 w-3 bg-primary rounded-full shrink-0 mt-3"></div>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
