"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { startConversation } from "@/features/messaging/actions";
import { useRouter } from "next/navigation";

export function MessageApplicantButton({ 
  applicationId, 
  applicantUserId, 
  recruiterUserId,
  opportunityTitle,
}: { 
  applicationId: string;
  applicantUserId: string;
  recruiterUserId: string;
  opportunityTitle: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleMessage = async () => {
    setIsPending(true);
    const res = await startConversation({
      senderId: recruiterUserId,
      participantIds: [applicantUserId],
      subject: `Regarding: ${opportunityTitle}`,
      applicationId,
      content: `Hello, I'd like to discuss your application for the ${opportunityTitle} opportunity.`,
    });
    
    if (res.success) {
      router.push(`/messages/${res.conversationId}`);
    } else {
      alert("Failed to start conversation.");
      setIsPending(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-10" 
      onClick={handleMessage} 
      disabled={isPending}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      {isPending ? "Starting..." : "Message Applicant"}
    </Button>
  );
}
