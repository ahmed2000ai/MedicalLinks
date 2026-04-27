import { auth } from "@/auth";
import { getConversationDetails, markConversationRead } from "@/features/messaging/actions";
import { MessageThread } from "@/features/messaging/components/MessageThread";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const res = await getConversationDetails(params.id, session.user.id);

  if (!res.success || !res.conversation) {
    notFound();
  }

  // Mark as read when viewing
  await markConversationRead(params.id, session.user.id);

  const conversation = res.conversation;
  const otherParticipants = conversation.participants
    .filter((p) => p.userId !== session.user.id)
    .map((p) => p.user);
    
  const title = conversation.subject || otherParticipants.map(p => `${p.firstName} ${p.lastName}`).join(", ") || "Conversation";

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-card border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/20 flex items-center gap-4">
        <Link href="/messages" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {conversation.application && (
            <p className="text-sm text-muted-foreground">
              Regarding: {conversation.application.opportunity?.title} ({conversation.application.opportunity?.hospital?.name})
            </p>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <MessageThread 
          conversationId={conversation.id} 
          messages={conversation.messages} 
          currentUserId={session.user.id} 
        />
      </div>
    </div>
  );
}
