import { auth } from "@/auth";
import { listConversations } from "@/features/messaging/actions";
import { ConversationList } from "@/features/messaging/components/ConversationList";
import { PageHeader } from "@/components/ui/page-header";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const conversations = await listConversations(session.user.id);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Messages" 
        description="Manage your direct communications and interview scheduling."
      />
      <div className="bg-card border rounded-lg overflow-hidden">
        <ConversationList conversations={conversations} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
