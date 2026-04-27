import { auth } from "@/auth";
import { getUserNotifications } from "@/features/notifications/actions";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { CheckCircle, Info, MessageSquare, Calendar } from "lucide-react";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const notifications = await getUserNotifications(session.user.id, { limit: 100 });

  const getIcon = (type: string) => {
    switch (type) {
      case "MESSAGE_RECEIVED":
        return <MessageSquare size={18} className="text-blue-500" />;
      case "APPLICATION_STATUS_UPDATED":
        return <CheckCircle size={18} className="text-green-500" />;
      case "INTERVIEW_SCHEDULED":
        return <Calendar size={18} className="text-purple-500" />;
      default:
        return <Info size={18} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications" 
        description="Stay updated on your application statuses, interviews, and messages."
      />
      
      <div className="bg-card border rounded-lg overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p>You have no notifications.</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-4 flex gap-4 items-start hover:bg-muted/30 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}
              >
                <div className="mt-1 shrink-0 p-2 bg-background border rounded-full">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className={`text-sm ${!n.isRead ? "font-bold text-foreground" : "font-semibold text-foreground/80"}`}>
                      {n.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {n.message && (
                    <p className={`text-sm ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                      {n.message}
                    </p>
                  )}
                  {n.linkUrl && (
                    <div className="pt-2">
                      <Link href={n.linkUrl} className="text-xs font-medium text-primary hover:underline">
                        View Details →
                      </Link>
                    </div>
                  )}
                </div>
                {!n.isRead && (
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
