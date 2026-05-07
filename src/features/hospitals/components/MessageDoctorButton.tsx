"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { getOrStartConversationWithDoctor } from "../messaging-actions"

interface MessageDoctorButtonProps {
  applicantProfileId: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function MessageDoctorButton({
  applicantProfileId,
  variant = "outline",
  size = "sm",
  className,
  children
}: MessageDoctorButtonProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleMessageClick = async () => {
    setIsPending(true)
    try {
      const conversationId = await getOrStartConversationWithDoctor(applicantProfileId)
      router.push(`/messages/${conversationId}`)
    } catch (error) {
      console.error("Failed to start conversation:", error)
      setIsPending(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleMessageClick}
      disabled={isPending}
    >
      {isPending ? (
        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <MessageSquare className="h-4 w-4 mr-2" />
      )}
      {children || "Message Doctor"}
    </Button>
  )
}
